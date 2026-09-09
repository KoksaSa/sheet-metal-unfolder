// ═══════════════════════════════════════════════════════════════
// STATE / СОСТОЯНИЕ — глобальный объект S, операции с точками,
// undo/redo для точек и параметров металла
// ═══════════════════════════════════════════════════════════════

const S = {
  points: [],
  metal: { metalTypeIndex: 1, thickness: 0.8, bendRadius: 1.6, kFactor: 0.5, width: 600, partNumber: '', dieIndex: 0, punchIndex: 0 },
  hems: [], // [{segIndex, height, side:'left'|'right'}]
  hemEditing: null, // {segIndex} when hem dialog is open
  hemHoveredSeg: -1,
  toolMode: 'draw',
  lang: localStorage.getItem('sheet-metal-lang') || 'ru',
  snapToGrid: true,
  gridSize: 5,
  angleSnap: 'none',
  showDimensions: true,
  showAxisLabels: true,
  showToolsOnCanvas: false,
  simMode: false,
  simFaceSide: 'up', // лицевая сторона: 'up' или 'down'
  simFlipX: false, // переворот по X (лево↔право)
  simFlipY: false, // переворот по Y (верх↔низ)
  simBentMarkers: [], // индексы согнутых гибов в порядке выполнения
  toolLocked: false, // инструменты заблокированы (режим симуляции) — нельзя перетащить
  toolKeyTarget: 'punch', // v5.5: активный инструмент для стрелок ←→↑↓ ('punch'|'die'), выбирается кликом
  // === Анимация гибки (2D) ===
  simAnimRunning: false,
  simAnimBendIdx: -1,
  simAnimProgress: 0,
  simAnimDirection: 1,
  simAnimStartT: 0,
  simAnimOnDone: null,
  simSequenceRAF: null,
  simSequenceTimer: null,
  simSequence: [],
  simSequenceStep: -1,
  punchOffsetX: parseFloat(localStorage.getItem('punchOffsetX')) || 0,
  punchOffsetY: parseFloat(localStorage.getItem('punchOffsetY')) || 0,
  dieOffsetX: parseFloat(localStorage.getItem('dieOffsetX')) || 0,
  dieOffsetY: parseFloat(localStorage.getItem('dieOffsetY')) || 0,
  bendPointX: parseFloat(localStorage.getItem('bendPointX')) || 0,
  bendPointY: parseFloat(localStorage.getItem('bendPointY')) || 0,
  previewBendIdx: null,
  previewFlip: false,
  selectedBendIndex: undefined, // выбранный гиб в режиме симуляции
  stopperVisible: true,          // упор (задний упор гибочного пресса) показан в симуляции
  // v4.4: подпись профиля, на которой накоплена последовательность гибов
  // (сверяется при входе в «Симуляцию» — профиль изменился → сброс)
  simProfileSig: null,
  // Для каждого выполненного гиба: {stopperDist, faceOrient} — позиция упора
  // ДО гибки и ориентация лицевой стороны в момент гибки. Индексируется по bendIdx.
  // Используется в чертеже «Последовательность гибки».
  bendStepMeta: {},
  checkDieHeight: true,
  viewport: { offsetX: 0, offsetY: 0, scale: 3 },
  unfoldResult: null,
  autoUnfold: true,
  undoHistory: [],
  redoHistory: [],
  metalUndoHistory: [],
  metalRedoHistory: [],
  isDark: localStorage.getItem('theme') === 'dark',
  showSegments: false,
  animBendIdx: -1,
  dxfOpts: { layers: { outline: true, bend: true, dimension: true, text: true, info: true, tick: true } },
  mouseWorld: null,
  hoveredPt: -1,
  snapEndpoint: -1,
  drawFromIdx: null // индекс точки, от которой продолжается рисование (null = последняя)
};

// ==================== ХЕЛПЕРЫ СОСТОЯНИЯ ====================
function cloneState() {
  return {
    points: S.points.map(pt => ({ ...pt })),
    hems: S.hems.map(h => ({ ...h }))
  };
}

function snapPoint(p) {
  const gs = S.gridSize;
  if (S.angleSnap === 'none') {
    return { x: Math.round(p.x / gs) * gs, y: Math.round(p.y / gs) * gs };
  }
  const pts = S.points;
  if (!pts.length) return { x: Math.round(p.x / gs) * gs, y: Math.round(p.y / gs) * gs };
  // При рисовании от первой точки угол отсчитываем от неё
  const last = S.drawFromIdx === 0 ? pts[0] : pts[pts.length - 1];
  const dx = p.x - last.x, dy = p.y - last.y;
  const rawA = Math.atan2(dy, dx);
  const snapDeg = Number(S.angleSnap);
  const snapRad = snapDeg * Math.PI / 180;
  const snappedA = Math.round(rawA / snapRad) * snapRad;
  const d = Math.max(gs, Math.round(Math.sqrt(dx * dx + dy * dy) / gs) * gs);
  return {
    x: Math.round((last.x + Math.cos(snappedA) * d) / gs) * gs,
    y: Math.round((last.y + Math.sin(snappedA) * d) / gs) * gs
  };
}

function addPoint(p) {
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  // drawFromIdx === 0 → вставка в начало (рисуем от первой точки)
  // drawFromIdx === null → вставка в конец (рисуем от последней точки)
  if (S.drawFromIdx === 0 && S.points.length > 0) {
    S.points = [p, ...S.points];
  } else {
    S.points = [...S.points, p];
  }
  S.redoHistory = [];
  maybeAutoUnfold();
}

function removePoint(idx) {
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  // Если удалили первую точку в режиме рисования от неё — сброс
  if (S.drawFromIdx === 0 && idx === 0) S.drawFromIdx = null;
  S.points = S.points.filter((_, i) => i !== idx);
  S.redoHistory = [];
  maybeAutoUnfold();
}

// Замыкание контура: добавляем дубликат первой точки в конец
function closeContour() {
  if (S.points.length < 3) return;
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  const fp = S.points[0];
  S.points = [...S.points, { x: fp.x, y: fp.y }];
  S.redoHistory = [];
  S.drawFromIdx = null;
  maybeAutoUnfold();
}

function clearDrawing() {
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  S.points = [];
  S.redoHistory = [];
  S.hems = [];
  S.hemEditing = null;
  S.hemHoveredSeg = -1;
  S.drawFromIdx = null;
  S.unfoldResult = null;
  // v4.4 FIX: полный сброс состояния симуляции — раньше «Очистить» удалял
  // только точки, а simBentMarkers/bendStepMeta/перевороты оставались от
  // СТАРОЙ детали: новая деталь наследовала «уже частично согнутый» вид
  // (лечилось только F5).
  if (typeof resetSimulationState === 'function') resetSimulationState();
  if (typeof view3dUserZoomed !== 'undefined') view3dUserZoomed = false;
  localStorage.removeItem('sheet-metal-project');
  renderAll();
}

// v4.4: подпись профиля по координатам точек (округление 0.1 мм).
// Используется для детекта «профиль изменился» (очищён/перерисован/
// отредактирован) с момента накопления последовательности гибов.
function simProfileSignature() {
  if (!S.points || S.points.length === 0) return null;
  return S.points.map(p => (Math.round(p.x * 10) / 10) + ':' + (Math.round(p.y * 10) / 10)).join('|');
}

// v4.4: ПОЛНЫЙ сброс состояния симуляции: маркеры согнутых гибов,
// меты шагов, перевороты, лицевая сторона, превью, режим симуляции,
// шаги 3D-модалки и подпись профиля. Вызывается из «Очистить»,
// loadPreset и при смене профиля — новая деталь ВСЕГДА начинается
// с плоского листа.
function resetSimulationState() {
  S.simBentMarkers = [];
  S.bendStepMeta = {};
  S.simFlipX = false;
  S.simFlipY = false;
  S.simFaceSide = 'up';
  S.selectedBendIndex = undefined;
  S.previewBendIdx = null;
  S.previewFlip = false;
  S.simProfileSig = null;
  // 3D-модалка: сброс шагов (модуль canvas/sim3d.js, если загружен)
  if (typeof sim3dResetForNewProfile === 'function') sim3dResetForNewProfile();
  // Останавливаем анимации и выходим из режима симуляции
  if (S.simAnimRunning || S.showToolsOnCanvas) {
    if (typeof stopAnimation === 'function') stopAnimation();
  }
  S.showToolsOnCanvas = false;
  S.simMode = false;
  S.toolLocked = false;
}

function doUndo() {
  if (!S.undoHistory.length) return;
  const current = cloneState();
  const prev = S.undoHistory.pop();
  S.redoHistory = [...S.redoHistory, current];
  if (S.redoHistory.length > 50) S.redoHistory.shift();
  S.points = prev.points;
  S.hems = prev.hems || [];
  if (S.drawFromIdx !== null && S.drawFromIdx >= S.points.length) S.drawFromIdx = S.points.length - 1;
  maybeAutoUnfold();
  renderAll();
}

function doRedo() {
  if (!S.redoHistory.length) return;
  const current = cloneState();
  const next = S.redoHistory.pop();
  S.undoHistory = [...S.undoHistory, current];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  S.points = next.points;
  S.hems = next.hems || [];
  if (S.drawFromIdx !== null && S.drawFromIdx >= S.points.length) S.drawFromIdx = S.points.length - 1;
  maybeAutoUnfold();
  renderAll();
}

function setMetalWithUndo(partial) {
  S.metalUndoHistory = [...S.metalUndoHistory, { ...S.metal }];
  if (S.metalUndoHistory.length > 20) S.metalUndoHistory.shift();
  Object.assign(S.metal, partial);
  S.metalRedoHistory = [];
  maybeAutoUnfold();
  renderUnfoldInfo();
  renderHeader();
}

function undoMetal() {
  if (!S.metalUndoHistory.length) return;
  S.metalRedoHistory = [...S.metalRedoHistory, { ...S.metal }];
  Object.assign(S.metal, S.metalUndoHistory.pop());
  maybeAutoUnfold();
}

function redoMetal() {
  if (!S.metalRedoHistory.length) return;
  S.metalUndoHistory = [...S.metalUndoHistory, { ...S.metal }];
  Object.assign(S.metal, S.metalRedoHistory.pop());
  maybeAutoUnfold();
}

function selectMetalType(idx) {
  const mt = METAL_TYPES[idx] || METAL_TYPES[0];
  setMetalWithUndo({ metalTypeIndex: idx, kFactor: mt.kFactor, thickness: mt.defaultThickness });
}

function maybeAutoUnfold() {
  if (!S.autoUnfold || S.points.length < 2 || S.metal.width <= 0) return;
  const die = getDieByIndex(S.metal.dieIndex);
  const punch = getPunchByIndex(S.metal.punchIndex);
  S.unfoldResult = unfoldProfile(S.points, S.metal.bendRadius, S.metal.kFactor, S.metal.thickness, S.metal.width, die, punch);
  // Reset unfold zoom to auto-fit when profile changes
  if (typeof ufManualZoom !== 'undefined') ufManualZoom = null;
}

function doUnfold() {
  if (S.points.length < 2 || S.metal.width <= 0) {
    toast(S.lang === 'ru' ? 'Ширина должна быть больше 0' : 'Width must be > 0', 'error');
    return;
  }
  const die = getDieByIndex(S.metal.dieIndex);
  const punch = getPunchByIndex(S.metal.punchIndex);
  S.unfoldResult = unfoldProfile(S.points, S.metal.bendRadius, S.metal.kFactor, S.metal.thickness, S.metal.width, die, punch);
}

// ═══════════════════════════════════════════════════════════════
// STATE / СОХРАНЕНИЕ — экспорт DXF/SVG/PNG/JSON, импорт JSON,
// автосохранение в localStorage, позиции инструментов
// ═══════════════════════════════════════════════════════════════

// ==================== ЗАГРУЗКА ФАЙЛОВ ====================
function downloadBlob(content, type, fn) {
  const b = new Blob([content], { type });
  const u = URL.createObjectURL(b);
  const a = document.createElement('a');
  a.href = u; a.download = fn;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(u);
}

function exportDXF() {
  if (!S.unfoldResult) return;
  const mt = METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0];
  const mtName = S.lang === 'en' ? mt.nameEn : mt.nameRu;
  const dxf = generateDXF(S.unfoldResult, S.metal.bendRadius, S.metal.kFactor, S.metal.thickness, mtName, S.dxfOpts);
  const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  downloadBlob(dxf, 'application/dxf', 'unfold-' + ts + '.dxf');
  toast(t('exportOk'));
}

function exportSVG() {
  if (!S.unfoldResult) return;
  const mt = METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0];
  const mtName = S.lang === 'en' ? mt.nameEn : mt.nameRu;
  const svg = generateSVG(S.unfoldResult, S.metal.bendRadius, S.metal.kFactor, S.metal.thickness, mtName);
  downloadBlob(svg, 'image/svg+xml', 'unfold-pattern.svg');
  toast(t('exportOk'));
}

function exportPNG(whiteBg) {
  const cv = document.getElementById('unfold-canvas');
  if (!cv) return;
  const exp = document.createElement('canvas');
  exp.width = cv.width; exp.height = cv.height;
  const ctx = exp.getContext('2d');
  ctx.drawImage(cv, 0, 0);
  if (whiteBg) {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, exp.width, exp.height);
  }
  exp.toBlob(b => {
    if (!b) return;
    downloadBlob(b, 'image/png', 'unfold-pattern.png');
    toast(t('exportOk'));
  }, 'image/png');
}

function exportJSON() {
  const data = {
    version: '4.9',
    points: S.points,
    metal: S.metal,
    hems: S.hems,
    toolMode: S.toolMode,
    snapToGrid: S.snapToGrid,
    gridSize: S.gridSize,
    angleSnap: S.angleSnap
  };
  const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  downloadBlob(JSON.stringify(data, null, 2), 'application/json', 'sheet-metal-' + ts + '.json');
  toast(t('exportOk'));
}

function triggerImport() {
  document.getElementById('file-import').click();
}

// FIX: после импорта проекта сразу выполняем авто-развёртку —
// раньше кнопки экспорта оставались заблокированными до изменения параметров.
function importJSON(e) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    try {
      const d = JSON.parse(ev.target.result);
      if (!d.points || !d.metal) { toast(t('importFormatError'), 'error'); return; }
      // v5.8: позиции ТЕКУЩИХ инструментов — в карту (уходят «своим»)
      if (typeof syncToolPositionsToMap === 'function') syncToolPositionsToMap();
      S.points = d.points;
      Object.assign(S.metal, d.metal);
      if (d.hems) S.hems = d.hems; else S.hems = [];
      // v5.5: индекс пуансона из старого проекта мог указывать на
      // удалённую встроенную позицию — нормализуем
      if (typeof normalizePunchIndex === 'function') normalizePunchIndex();
      // v5.8: инструменты загруженного проекта получают ИХ сохранённые
      // позиции (на этой машине не ставившиеся — встанут в (0,0))
      if (typeof applyToolPositionsFromMap === 'function') applyToolPositionsFromMap();
      S.unfoldResult = null;
      S.undoHistory = [];
      S.redoHistory = [];
      // Сброс симуляции: другой профиль — старые гибы бессмысленны
      S.simBentMarkers = [];
      S.bendStepMeta = {};
      S.selectedBendIndex = undefined;
      S.simFlipX = false;
      S.simFlipY = false;
      maybeAutoUnfold();
      toast(t('loadedOk'));
      renderAll();
    } catch (err) {
      console.error('Import error:', err);
      toast(t('importError'), 'error');
    }
  };
  r.readAsText(f);
  e.target.value = '';
}

function saveProject() {
  try {
    localStorage.setItem('sheet-metal-project', JSON.stringify({ points: S.points, metal: S.metal, hems: S.hems }));
    toast(t('savedOk'));
  } catch (err) {
    console.error('Save error:', err);
    toast(t('importError'), 'error');
  }
}

// ==================== ПОЗИЦИИ ИНСТРУМЕНТОВ НА ХОЛСТЕ ====================
// v5.8: помимо единых смещений текущих инструментов храним КАРТЫ ПО
// ИНСТРУМЕНТАМ (punchPositions/diePositions) — каждый пуансон/матрица
// запоминает своё установленное место и восстанавливает его при
// возврате (переключение в списке, undo/redo, импорт проекта).
function saveToolPositions() {
  try {
    // Текущие смещения уходят в карту «своих» инструментов
    if (typeof syncToolPositionsToMap === 'function') syncToolPositionsToMap();
    localStorage.setItem('sheet-metal-tool-positions', JSON.stringify({
      punchOffsetX: S.punchOffsetX || 0,
      punchOffsetY: S.punchOffsetY || 0,
      dieOffsetX: S.dieOffsetX || 0,
      dieOffsetY: S.dieOffsetY || 0,
      bendPointX: S.bendPointX || 0,
      bendPointY: S.bendPointY || 0,
      punchPositions: S.punchPositions || {},
      diePositions: S.diePositions || {}
    }));
    // Легаси-ключи (state.js читает их при старте до loadToolPositions)
    localStorage.setItem('punchOffsetX', S.punchOffsetX || 0);
    localStorage.setItem('punchOffsetY', S.punchOffsetY || 0);
    localStorage.setItem('dieOffsetX', S.dieOffsetX || 0);
    localStorage.setItem('dieOffsetY', S.dieOffsetY || 0);
  } catch (err) { console.error('Save tool positions error:', err); }
}

function loadToolPositions() {
  try {
    let hadMaps = false;
    const raw = localStorage.getItem('sheet-metal-tool-positions');
    if (raw) {
      const d = JSON.parse(raw);
      if (d.punchOffsetX !== undefined) S.punchOffsetX = d.punchOffsetX;
      if (d.punchOffsetY !== undefined) S.punchOffsetY = d.punchOffsetY;
      if (d.dieOffsetX !== undefined) S.dieOffsetX = d.dieOffsetX;
      if (d.dieOffsetY !== undefined) S.dieOffsetY = d.dieOffsetY;
      if (d.bendPointX !== undefined) S.bendPointX = d.bendPointX;
      if (d.bendPointY !== undefined) S.bendPointY = d.bendPointY;
      // v5.8: карты позиций по инструментам
      if (d.punchPositions && typeof d.punchPositions === 'object') { S.punchPositions = d.punchPositions; hadMaps = true; }
      if (d.diePositions && typeof d.diePositions === 'object') { S.diePositions = d.diePositions; hadMaps = true; }
    }
    // v5.8: апгрейд с v5.7 (карт не было): единое сохранённое смещение
    // приписываем ТЕКУЩЕМУ инструменту как его установленное место —
    // чтобы при первом переключении позиция не потерялась. Если карты
    // УЖЕ есть (v5.8) — они точнее единого смещения (могло отстать от
    // смены инструмента), карту НЕ трогаем: applyToolPositionsFromMap
    // выберет позицию именно выбранного инструмента.
    if (!hadMaps && typeof syncToolPositionsToMap === 'function') syncToolPositionsToMap();
  } catch (err) { console.error('Load tool positions error:', err); }
}

function loadProject() {
  try {
    const raw = localStorage.getItem('sheet-metal-project');
    if (!raw) { toast(t('noSaved'), 'error'); return; }
    const d = JSON.parse(raw);
    if (!d.points || !d.metal) { toast(t('importFormatError'), 'error'); return; }
    // v5.8: позиции текущих инструментов — в карту, затем применяем
    // сохранённые позиции инструментов загружаемого проекта
    if (typeof syncToolPositionsToMap === 'function') syncToolPositionsToMap();
    S.points = d.points;
    Object.assign(S.metal, d.metal);
    if (d.hems) S.hems = d.hems; else S.hems = [];
    // v5.5: индекс пуансона из старого проекта мог указывать на
    // удалённую встроенную позицию — нормализуем
    if (typeof normalizePunchIndex === 'function') normalizePunchIndex();
    // v5.8: применяем сохранённые ПО ИНСТРУМЕНТУ позиции
    if (typeof applyToolPositionsFromMap === 'function') applyToolPositionsFromMap();
    S.unfoldResult = null;
    S.undoHistory = [];
    S.redoHistory = [];
    maybeAutoUnfold();
    toast(t('loadedOk'));
    renderAll();
  } catch (err) {
    console.error('Load error:', err);
    toast(t('importError'), 'error');
  }
}

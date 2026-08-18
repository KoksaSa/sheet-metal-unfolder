// ==================== STATE ====================
const S = {
  points: [],
  metal: { metalTypeIndex: 1, thickness: 0.8, bendRadius: 1.6, kFactor: 0.5, width: 100, partNumber: '' },
  hems: [], // [{segIndex, height, side:'left'|'right'}]
  hemEditing: null, // {segIndex} when hem dialog is open
  hemHoveredSeg: -1,
  toolMode: 'draw',
  lang: localStorage.getItem('sheet-metal-lang') || 'ru',
  snapToGrid: true,
  gridSize: 10,
  angleSnap: 'none',
  showDimensions: true,
  showAxisLabels: true,
  viewport: { offsetX: 0, offsetY: 0, scale: 3 },
  unfoldResult: null,
  autoUnfold: true,
  undoHistory: [],
  redoHistory: [],
  metalUndoHistory: [],
  metalRedoHistory: [],
  isDark: localStorage.getItem('theme') === 'dark',
  showSegments: false,
  showPoints: false,
  animBendIdx: -1,
  dxfOpts: { layers: { outline: true, bend: true, dimension: true, text: true, info: true, tick: true } },
  mouseWorld: null,
  hoveredPt: -1,
  snapEndpoint: -1,
  drawFromIdx: null // индекс точки, от которой продолжается рисование (null = последняя)
};

// ==================== STATE HELPERS ====================
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
  const last = pts[pts.length - 1];
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
  // Вставка после активной точки, если она выбрана (иначе — в конец)
  const insertIdx = S.drawFromIdx != null && S.drawFromIdx >= 0 && S.drawFromIdx < S.points.length
    ? S.drawFromIdx + 1
    : S.points.length;
  S.points = [...S.points.slice(0, insertIdx), p, ...S.points.slice(insertIdx)];
  S.redoHistory = [];
  maybeAutoUnfold();
}

function removePoint(idx) {
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  S.points = S.points.filter((_, i) => i !== idx);
  S.redoHistory = [];
  // Активная точка могла сместиться или удалиться
  if (S.drawFromIdx !== null) {
    if (idx === S.drawFromIdx) S.drawFromIdx = null;
    else if (idx < S.drawFromIdx) S.drawFromIdx--;
    if (S.drawFromIdx !== null && S.drawFromIdx >= S.points.length) S.drawFromIdx = S.points.length - 1;
  }
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
  if (typeof view3dUserZoomed !== 'undefined') view3dUserZoomed = false;
  localStorage.removeItem('sheet-metal-project');
  renderAll();
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
  S.unfoldResult = unfoldProfile(S.points, S.metal.bendRadius, S.metal.kFactor, S.metal.thickness, S.metal.width);
  // Reset unfold zoom to auto-fit when profile changes
  if (typeof ufManualZoom !== 'undefined') ufManualZoom = null;
}

function doUnfold() {
  if (S.points.length < 2 || S.metal.width <= 0) {
    toast(S.lang === 'ru' ? 'Ширина должна быть больше 0' : 'Width must be > 0', 'error');
    return;
  }
  S.unfoldResult = unfoldProfile(S.points, S.metal.bendRadius, S.metal.kFactor, S.metal.thickness, S.metal.width);
}

// ==================== TOAST ====================
function toast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  const d = document.createElement('div');
  d.className = 'toast toast-' + type;
  d.textContent = msg;
  c.appendChild(d);
  setTimeout(() => d.remove(), 2500);
}

// ==================== DOWNLOADS ====================
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
  const mtName = S.lang === 'en' ? METAL_TYPES[S.metal.metalTypeIndex].nameEn : METAL_TYPES[S.metal.metalTypeIndex].nameRu;
  const dxf = generateDXF(S.unfoldResult, S.metal.bendRadius, S.metal.kFactor, S.metal.thickness, mtName, S.dxfOpts);
  const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  downloadBlob(dxf, 'application/dxf', 'unfold-' + ts + '.dxf');
  toast(t('exportOk'));
}

function exportSVG() {
  if (!S.unfoldResult) return;
  const mtName = S.lang === 'en' ? METAL_TYPES[S.metal.metalTypeIndex].nameEn : METAL_TYPES[S.metal.metalTypeIndex].nameRu;
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
    version: '3.8',
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

function importJSON(e) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    try {
      const d = JSON.parse(ev.target.result);
      if (!d.points || !d.metal) { toast(t('importFormatError'), 'error'); return; }
      S.points = d.points;
      if (d.metal) Object.assign(S.metal, d.metal);
      if (d.hems) S.hems = d.hems; else S.hems = [];
      S.unfoldResult = null;
      S.undoHistory = [];
      S.redoHistory = [];
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

function loadProject() {
  try {
    const raw = localStorage.getItem('sheet-metal-project');
    if (!raw) { toast(t('noSaved'), 'error'); return; }
    const d = JSON.parse(raw);
    if (!d.points || !d.metal) { toast(t('importFormatError'), 'error'); return; }
    S.points = d.points;
    Object.assign(S.metal, d.metal);
    if (d.hems) S.hems = d.hems; else S.hems = [];
    S.unfoldResult = null;
    S.undoHistory = [];
    S.redoHistory = [];
    toast(t('loadedOk'));
    renderAll();
  } catch (err) {
    console.error('Load error:', err);
    toast(t('importError'), 'error');
  }
}

// ==================== THEME & LANG ====================
function applyTheme() {
  document.documentElement.classList.toggle('dark', S.isDark);
  document.getElementById('icon-sun').classList.toggle('hidden', S.isDark);
  document.getElementById('icon-moon').classList.toggle('hidden', !S.isDark);
  localStorage.setItem('theme', S.isDark ? 'dark' : 'light');
}

function toggleTheme() {
  S.isDark = !S.isDark;
  applyTheme();
}

function toggleLang() {
  S.lang = S.lang === 'ru' ? 'en' : 'ru';
  localStorage.setItem('sheet-metal-lang', S.lang);
  renderAll();
}

function toggleAutoUnfold() {
  S.autoUnfold = !S.autoUnfold;
  if (S.autoUnfold) maybeAutoUnfold();
  renderAll();
}

function toggleLeftSidebar() {
  document.getElementById('mobile-sidebar').classList.toggle('hidden');
}
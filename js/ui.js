// ==================== DIALOGS ====================
// Ensure dialog is hidden immediately (before DOMContentLoaded)
(function() {
  const overlay = document.getElementById('dialog-overlay');
  if (overlay) overlay.classList.add('hidden');
})();

function showShortcuts() {
  const s = S.lang;
  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/></svg>' + t('shortcuts') + '</h3><div class="space-y-2">';
  [
    ['D', t('shortcutDraw')],
    ['V', t('shortcutSelect')],
    ['E', t('shortcutErase')],
    ['M', t('shortcutMeasure')],
    ['H', t('shortcutHem')],
    ['N', t('shortcutCoordInput')],
    ['F', t('shortcutCenter')],
    ['Enter', t('shortcutUnfold')],
    ['Ctrl+Z', t('shortcutUndoPoints')],
    ['Ctrl+Y', t('shortcutRedoPoints')],
    ['Ctrl+Shift+Z', t('shortcutUndoParams')],
    ['Ctrl+Shift+Y', t('shortcutRedoParams')],
    ['Ctrl+S', t('shortcutSave')]
  ].forEach(([k, v]) => {
    h += '<div class="flex items-center justify-between"><span class="text-sm text-gray-600 dark:text-gray-400">' + v + '</span><kbd class="text-[10px] font-mono bg-gray-100 dark:bg-gray-700 rounded px-1.5 py-0.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">' + k + '</kbd></div>';
  });
  h += '<hr class="my-2 border-gray-200 dark:border-gray-700"><div class="text-[10px] text-gray-500 dark:text-gray-400 space-y-0.5"><p>' + t('shortcutMouse1') + '</p><p>' + t('shortcutMouse2') + '</p><p>' + t('shortcutCloseContour') + '</p></div></div>';
  showDialog(h);
}

function showCoordInput() {
  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/></svg>' + t('coordInput') + '</h3>';
  h += '<div class="grid grid-cols-2 gap-3"><div><label class="text-xs font-medium">' + t('coordInputX') + '</label><input type="number" id="ci-x" step="any" class="w-full h-8 text-xs border border-gray-200 dark:border-gray-700 rounded-md px-2 mt-1 bg-white dark:bg-gray-800" autofocus></div>';
  h += '<div><label class="text-xs font-medium">' + t('coordInputY') + '</label><input type="number" id="ci-y" step="any" class="w-full h-8 text-xs border border-gray-200 dark:border-gray-700 rounded-md px-2 mt-1 bg-white dark:bg-gray-800"></div></div>';
  h += '<div class="flex items-center gap-2 mt-3"><div class="switch' + (S.snapToGrid ? ' active' : '') + '" id="ci-snap" onclick="this.classList.toggle(\'active\')"></div><label class="text-xs cursor-pointer">' + t('snapGridCheck') + '</label></div>';
  h += '<div class="flex justify-end gap-2 mt-4"><button onclick="closeDialog()" class="text-xs h-8 px-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">' + t('cancel') + '</button>';
  h += '<button onclick="submitCoordInput()" class="text-xs h-8 px-3 bg-green-600 text-white rounded-md hover:bg-green-700">' + t('add') + '</button></div>';
  showDialog(h);
  setTimeout(() => { const el = document.getElementById('ci-x'); if (el) el.focus(); }, 100);
}

function submitCoordInput() {
  const xv = parseFloat(document.getElementById('ci-x').value);
  const yv = parseFloat(document.getElementById('ci-y').value);
  if (isNaN(xv) || isNaN(yv)) { toast(t('enterCoordsError'), 'error'); return; }
  let p = { x: xv, y: yv };
  const snapEl = document.getElementById('ci-snap');
  if (snapEl && snapEl.classList.contains('active')) p = snapPoint(p);
  addPoint(p);
  closeDialog();
  toast(t('pointAdded'));
  renderAll();
}

function showDxfOptions() {
  const l = S.dxfOpts.layers;
  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' + t('dxfOptions') + '</h3>';
  h += '<div class="space-y-2"><label class="text-xs font-medium">' + t('dxfLayers') + '</label>';
  [
    ['outline', t('dxfLayerOutline')],
    ['bend', t('dxfLayerBend')],
    ['dimension', t('dxfLayerDim')],
    ['text', t('dxfLayerText')],
    ['info', t('dxfLayerInfo')],
    ['tick', t('dxfLayerTick')]
  ].forEach(([k, v]) => {
    h += '<label class="flex items-center gap-2.5 cursor-pointer"><input type="checkbox" ' + (l[k] ? 'checked' : '') + ' onchange="S.dxfOpts.layers[\'' + k + '\']=this.checked" class="w-4 h-4 accent-green-600"><span class="text-xs text-gray-600 dark:text-gray-400">' + v + '</span></label>';
  });
  h += '</div><div class="flex justify-end gap-2 mt-4"><button onclick="closeDialog()" class="text-xs h-8 px-3 border border-gray-200 dark:border-gray-700 rounded-md">' + t('cancel') + '</button>';
  h += '<button onclick="exportDXF();closeDialog()" class="text-xs h-8 px-3 bg-green-600 text-white rounded-md hover:bg-green-700">' + t('dxfDownload') + '</button></div>';
  showDialog(h);
}

function showDialog(html, extraClass) {
  const box = document.getElementById('dialog-content');
  if (!html || html.trim() === '') return; // Prevent empty dialogs
  box.innerHTML = html;
  box.className = extraClass ? 'dialog-box ' + extraClass : 'dialog-box';
  document.getElementById('dialog-overlay').classList.remove('hidden');
}

function closeDialog() {
  document.getElementById('dialog-overlay').classList.add('hidden');
}

// ==================== HEM DIALOG ====================
function showHemDialog(segIndex) {
  S.hemEditing = { segIndex };
  const existing = S.hems.find(h => h.segIndex === segIndex);
  const height = existing ? existing.height : 10;
  const side = existing ? existing.side : 'left';
  const numSegs = S.points.length - 1;
  const isEndHem = segIndex === numSegs;
  const segLabel = isEndHem
    ? t('segmentLabel') + ' ' + numSegs + ' → ' + t('hem')
    : t('segmentLabel') + ' ' + (segIndex + 1);

  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v10l4-4"/><path d="M12 12l-4-4"/><path d="M4 20h16"/></svg>' + segLabel + '</h3>';

  // Height input
  h += '<div class="space-y-1 mb-3"><label class="text-xs font-medium">' + t('hemHeight') + '</label>';
  h += '<input type="number" id="hem-dialog-height" min="0.5" max="50" step="0.5" value="' + height + '" class="w-full h-9 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500/30 font-mono">';
  h += '</div>';

  // Side toggle
  h += '<div class="space-y-1 mb-4"><label class="text-xs font-medium">' + t('hemSide') + '</label>';
  h += '<div class="flex gap-2">';
  h += '<button id="hem-side-left" onclick="setHemSide(\'left\')" class="flex-1 h-9 text-xs rounded-md border-2 transition-all ' + (side === 'left' ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30 text-purple-700 font-semibold' : 'border-gray-200 dark:border-gray-700 text-gray-600 hover:border-purple-300') + '">' + t('hemSideLeft') + '</button>';
  h += '<button id="hem-side-right" onclick="setHemSide(\'right\')" class="flex-1 h-9 text-xs rounded-md border-2 transition-all ' + (side === 'right' ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30 text-purple-700 font-semibold' : 'border-gray-200 dark:border-gray-700 text-gray-600 hover:border-purple-300') + '">' + t('hemSideRight') + '</button>';
  h += '</div></div>';

  // Buttons
  h += '<div class="flex justify-between gap-2">';
  if (existing) {
    h += '<button onclick="removeHem(S.hemEditing.segIndex)" class="text-xs h-8 px-3 border border-red-200 dark:border-red-800 text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30">' + t('hemRemove') + '</button>';
  } else {
    h += '<button onclick="cancelHem()" class="text-xs h-8 px-3 border border-gray-200 dark:border-gray-700 rounded-md">' + t('hemCancel') + '</button>';
  }
  h += '<button onclick="applyHemFromDialog()" class="text-xs h-8 px-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-semibold">' + t('hemApply') + '</button>';
  h += '</div>';

  showDialog(h);
  // Focus the input
  setTimeout(() => {
    const inp = document.getElementById('hem-dialog-height');
    if (inp) { inp.focus(); inp.select(); }
  }, 50);
}

function setHemSide(side) {
  const leftBtn = document.getElementById('hem-side-left');
  const rightBtn = document.getElementById('hem-side-right');
  const active = 'flex-1 h-9 text-xs rounded-md border-2 transition-all border-purple-600 bg-purple-50 dark:bg-purple-950/30 text-purple-700 font-semibold';
  const inactive = 'flex-1 h-9 text-xs rounded-md border-2 transition-all border-gray-200 dark:border-gray-700 text-gray-600 hover:border-purple-300';
  if (leftBtn) leftBtn.className = side === 'left' ? active : inactive;
  if (rightBtn) rightBtn.className = side === 'right' ? active : inactive;
}

function applyHemFromDialog() {
  if (!S.hemEditing) return;
  const height = parseFloat(document.getElementById('hem-dialog-height').value);
  if (isNaN(height) || height <= 0) return;
  const leftBtn = document.getElementById('hem-side-left');
  const isLeftActive = leftBtn && leftBtn.className.includes('border-purple-600');
  const side = isLeftActive ? 'left' : 'right';
  applyHem(S.hemEditing.segIndex, height, side);
  closeDialog();
}

function applyHem(segIndex, height, side) {
  // Save undo state (includes hems)
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  S.redoHistory = [];
  // Remove existing hem for this segment
  S.hems = S.hems.filter(h => h.segIndex !== segIndex);
  if (height > 0) {
    S.hems.push({ segIndex, height, side });
  }
  S.hemEditing = null;
  if (S.autoUnfold) maybeAutoUnfold();
  renderAll();
}

function removeHem(segIndex) {
  const si = segIndex !== undefined ? segIndex : (S.hemEditing ? S.hemEditing.segIndex : -1);
  if (si < 0) return;
  // Save undo state (includes hems)
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  S.redoHistory = [];
  S.hems = S.hems.filter(h => h.segIndex !== si);
  S.hemEditing = null;
  closeDialog();
  if (S.autoUnfold) maybeAutoUnfold();
  renderAll();
  toast(t('hemRemoved'));
}

function cancelHem() {
  S.hemEditing = null;
  closeDialog();
  drawDrawCanvas();
}


// ==================== RENDER ALL UI ====================
function renderAll() {
  renderHeader();
  renderToolButtons();
  renderMetalParams();
  renderSnapSettings();
  renderStats();
  renderPointsTable();
  renderPresets();
  renderUnfoldInfo();
  renderMobileUnfold();
  resizeView3d();
  draw3DPreview();
  drawDrawCanvas();
  drawUnfoldCanvas();
  lucide.createIcons();
}

function renderHeader() {
  document.getElementById('h-title').textContent = t('title');
  document.getElementById('lang-label').textContent = S.lang.toUpperCase();
  document.getElementById('footer-controls').textContent = t('footerControls');
 // Translate data-i18n spans in header
  document.querySelectorAll('header [data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
  ['btn-drawing', 'btn-dxf', 'btn-svg', 'btn-pngw', 'btn-png', 'btn-pdf'].forEach(id => {
    document.getElementById(id).disabled = !S.unfoldResult;
  });
  const autoBtn = document.getElementById('btn-auto');
  autoBtn.className = 'h-8 w-8 flex items-center justify-center rounded-md ' +
    (S.autoUnfold ? 'text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400' : 'text-gray-600 dark:text-gray-400');
  // Status bar
  const st = document.getElementById('status-bar');
  if (S.points.length > 0) {
    const toolLabel = t(S.toolMode);
    const totalLen = S.points.length >= 2
      ? S.points.slice(0, -1).reduce((s, p, i) => {
          const dx = S.points[i + 1].x - p.x, dy = S.points[i + 1].y - p.y;
          return s + Math.sqrt(dx * dx + dy * dy);
        }, 0) : 0;
    st.textContent = t('segments') + S.points.length +
      (S.points.length > 1 ? ' | ' + t('profileLength') + ': ' + totalLen.toFixed(1) + t('mm') : '') +
      ' | ' + toolLabel;
    const colors = { draw: '#22c55e', select: '#3b82f6', erase: '#ef4444', measure: '#f59e0b', hem: '#8b5cf6' };
    st.style.borderLeft = '3px solid';
    st.style.borderLeftColor = colors[S.toolMode];
  } else {
    st.textContent = t('profileHeader');
  }
}

function renderToolButtons() {
  const c = document.getElementById('tool-buttons');
  const tools = [
    { mode: 'draw', icon: 'pencil', key: 'D', label: 'draw' },
    { mode: 'select', icon: 'mouse-pointer-2', key: 'V', label: 'select' },
    { mode: 'erase', icon: 'eraser', key: 'E', label: 'erase' },
    { mode: 'measure', icon: 'ruler', key: 'M', label: 'measure' },
    { mode: 'hem', icon: 'git-branch', key: 'H', label: 'hemTool' }
  ];
  c.className = 'flex gap-1 flex-wrap';
  const btnBase = 'flex-1 min-w-0 h-8 text-[11px] rounded-md flex items-center justify-center border transition-all gap-1';
  const btnActive = 'bg-green-600 hover:bg-green-700 text-white border-green-600';
  const btnInactive = 'border-gray-200 dark:border-gray-700 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950/30';
  c.innerHTML = tools.map(tl => {
    const active = S.toolMode === tl.mode;
    return '<button onclick="S.toolMode=\'' + tl.mode + '\';S.drawFromIdx=null;renderAll()" class="' + btnBase + ' ' + (active ? btnActive : btnInactive) + '"><i data-lucide="' + tl.icon + '" class="h-3.5 w-3.5 shrink-0"></i><span class="truncate">' + t(tl.label) + '</span></button>';
  }).join('');
}

function renderMetalParams() {
  const c = document.getElementById('metal-params-container');
  const mt = METAL_TYPES[S.metal.metalTypeIndex];
  const mtName = S.lang === 'en' ? mt.nameEn : mt.nameRu;
  let h = '';
  // Metal type
  h += '<div class="space-y-1"><label class="text-xs font-medium">' + t('metalType') + '</label><select onchange="selectMetalType(Number(this.value))" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 focus:outline-none focus:ring-2 focus:ring-green-500/30">';
  METAL_TYPES.forEach((m, i) => {
    h += '<option value="' + i + '"' + (i === S.metal.metalTypeIndex ? ' selected' : '') + '>' + (S.lang === 'en' ? m.nameEn : m.nameRu) + '</option>';
  });
  h += '</select></div>';
  // Thickness
  h += '<div class="space-y-1"><label class="text-xs font-medium">' + t('thickness') + ' <span class="text-gray-500">(mm)</span></label><select onchange="setMetalWithUndo({thickness:Number(this.value)})" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2">';
  THICKNESS_OPTIONS.forEach(th => {
    h += '<option value="' + th + '"' + (th === S.metal.thickness ? ' selected' : '') + '>' + th + ' mm</option>';
  });
  h += '</select></div>';
  // Bend radius
  h += '<div class="space-y-1"><label class="text-xs font-medium">' + t('bendRadius') + ' <span class="text-gray-500">(mm)</span></label><input type="number" min="0.1" max="100" step="0.5" value="' + S.metal.bendRadius + '" onchange="const v=parseFloat(this.value);if(!isNaN(v)&&v>0){setMetalWithUndo({bendRadius:v});doUnfold();renderAll()}" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2"></div>';
  // Die & Punch selection
  const die = DIES[S.metal.dieIndex] || DIES[0];
  const punch = PUNCHES[S.metal.punchIndex] || PUNCHES[0];
  h += '<div class="rounded-md border border-gray-200 dark:border-gray-700 p-2 space-y-2"><div class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1"><i data-lucide="hammer" class="h-3 w-3"></i>' + t('bendTool') + '</div>';
  h += '<div class="grid grid-cols-2 gap-2">';
  h += '<div class="space-y-1"><label class="text-[10px] text-gray-500">' + t('dieSelect') + '</label><select onchange="setMetalWithUndo({dieIndex:Number(this.value)});doUnfold();renderAll()" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1">';
  DIES.forEach((d, i) => {
    h += '<option value="' + i + '"' + (i === S.metal.dieIndex ? ' selected' : '') + '>' + (S.lang === 'en' ? d.nameEn : d.nameRu) + ' (H' + d.height + ')</option>';
  });
  h += '</select></div>';
  h += '<div class="space-y-1"><label class="text-[10px] text-gray-500">' + t('punchSelect') + '</label><select onchange="setMetalWithUndo({punchIndex:Number(this.value)});doUnfold();renderAll()" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1">';
  PUNCHES.forEach((p, i) => {
    h += '<option value="' + i + '"' + (i === S.metal.punchIndex ? ' selected' : '') + '>' + (S.lang === 'en' ? p.nameEn : p.nameRu) + '</option>';
  });
  h += '</select></div>';
  h += '</div>';
  // Checkbox: die height check
  h += '<div class="flex items-center justify-between pt-1"><label class="text-[10px] text-gray-500 flex items-center gap-1"><i data-lucide="ruler" class="h-3 w-3"></i>' + t('checkDieHeight') + '</label><div class="switch' + (S.checkDieHeight ? ' active' : '') + '" onclick="S.checkDieHeight=!S.checkDieHeight;doUnfold();renderAll()"></div></div>';
  h += '</div>';
  // K-factor
  h += '<div class="space-y-1"><div class="flex items-center justify-between"><label class="text-xs font-medium" title="' + t('kFactorTooltip') + '">' + t('kFactor') + '</label><span id="kf-display" class="text-xs font-mono text-gray-500 tabular-nums">' + S.metal.kFactor.toFixed(2) + '</span></div><input type="range" min="0.1" max="0.7" step="0.01" value="' + S.metal.kFactor + '" oninput="setMetalWithUndo({kFactor:Number(this.value)});document.getElementById(\'kf-display\').textContent=Number(this.value).toFixed(2)" class="w-full"></div>';
  // Width
  h += '<div class="space-y-1"><label class="text-xs font-medium">' + t('blankWidth') + ' <span class="text-gray-500">(mm)</span></label><input type="number" min="1" max="10000" step="1" value="' + S.metal.width + '" onchange="const v=parseFloat(this.value);if(!isNaN(v)&&v>0){setMetalWithUndo({width:v});doUnfold();renderAll()}" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2"></div>';
  // Part number
  h += '<div class="space-y-1"><label class="text-xs font-medium">' + t('partNumber') + '</label><input type="text" value="' + (S.metal.partNumber || '') + '" onchange="setMetalWithUndo({partNumber:this.value})" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2" placeholder="\u2014"></div>';
  c.innerHTML = h;
}

function renderSnapSettings() {
  const c = document.getElementById('snap-container');
  let h = '';
  h += '<div class="flex items-center justify-between"><label class="text-xs font-medium flex items-center gap-1.5"><i data-lucide="magnet" class="h-3 w-3"></i>' + t('snapToGrid') + '</label><div class="switch' + (S.snapToGrid ? ' active' : '') + '" onclick="S.snapToGrid=!S.snapToGrid;renderAll()"></div></div>';
  if (S.snapToGrid) {
    h += '<div class="space-y-1"><div class="flex items-center justify-between"><span class="text-[10px] text-gray-500">' + t('gridStep') + '</span><span class="text-[10px] text-gray-500 font-mono tabular-nums">' + S.gridSize + ' mm</span></div>';
    h += '<input type="range" min="1" max="50" step="1" value="' + S.gridSize + '" oninput="S.gridSize=Number(this.value)" onchange="S.gridSize=Number(this.value);drawDrawCanvas()" class="w-full"></div>';
  }
  h += '<div class="flex items-center justify-between"><label class="text-xs font-medium flex items-center gap-1.5"><i data-lucide="compass" class="h-3 w-3"></i>' + t('angleSnap') + '</label><span class="text-[10px] font-mono text-gray-500 tabular-nums">' + (S.angleSnap === 'none' ? '\u2014' : S.angleSnap + '°') + '</span></div>';
  h += '<div class="flex gap-1">';
  ['none', '15', '30', '45', '90'].forEach(v => {
    h += '<button onclick="S.angleSnap=\'' + v + '\';renderAll()" class="flex-1 text-[10px] py-1 rounded-md border transition-all ' +
      (S.angleSnap === v ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 dark:border-gray-700 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-950/30') +
      '">' + (v === 'none' ? '\u2014' : v + '°') + '</button>';
  });
  h += '</div>';
  h += '<div class="flex items-center justify-between"><label class="text-xs font-medium flex items-center gap-1.5"><i data-lucide="ruler" class="h-3 w-3"></i>' + t('dimensionsOnCanvas') + '</label><div class="switch' + (S.showDimensions ? ' active' : '') + '" onclick="S.showDimensions=!S.showDimensions;drawDrawCanvas()"></div></div>';
  h += '<div class="flex items-center justify-between"><label class="text-xs font-medium flex items-center gap-1.5"><i data-lucide="crosshair" class="h-3 w-3"></i>' + t('axisLabels') + '</label><div class="switch' + (S.showAxisLabels ? ' active' : '') + '" onclick="S.showAxisLabels=!S.showAxisLabels;drawDrawCanvas()"></div></div>';
  c.innerHTML = h;
}

function renderStats() {
  const c = document.getElementById('stats-container');
  if (S.points.length < 2) { c.innerHTML = ''; return; }
  const totalLen = S.points.slice(0, -1).reduce((s, p, i) => {
    const dx = S.points[i + 1].x - p.x, dy = S.points[i + 1].y - p.y;
    return s + Math.sqrt(dx * dx + dy * dy);
  }, 0);
  c.innerHTML = '<hr class="my-3 border-gray-200 dark:border-gray-700"><div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-2.5 space-y-1"><p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium">' + t('profileStats') + '</p><div class="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs"><span class="text-gray-500 dark:text-gray-400">' + t('pointsLabel') + '</span><span class="text-right font-mono tabular-nums">' + S.points.length + ' ' + pointWord(S.points.length) + '</span><span class="text-gray-500 dark:text-gray-400">' + t('profileLength') + '</span><span class="text-right font-mono tabular-nums">' + totalLen.toFixed(1) + ' mm</span></div></div>';
}

function renderPointsTable() {
  const c = document.getElementById('points-table-container');
  if (!S.points.length) { c.innerHTML = ''; return; }
  let h = '<hr class="my-3 border-gray-200 dark:border-gray-700"><div class="space-y-1.5"><div class="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400"><span class="flex items-center gap-1.5"><i data-lucide="crosshair" class="h-3 w-3"></i>' + t('pointsLabel') + ' <span class="text-[10px] opacity-60">(' + S.points.length + ')</span></span></div>';
  h += '<div class="max-h-[120px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"><div class="grid grid-cols-4 text-[10px]">';
  h += '<div class="font-medium text-gray-500 dark:text-gray-400 px-2 py-1 border-b sticky top-0 bg-white dark:bg-gray-800">#</div>';
  h += '<div class="font-medium text-gray-500 dark:text-gray-400 px-2 py-1 border-b sticky top-0 bg-white dark:bg-gray-800">X, Y</div>';
  h += '<div class="font-medium text-gray-500 dark:text-gray-400 px-2 py-1 border-b sticky top-0 bg-white dark:bg-gray-800"></div>';
  h += '<div class="font-medium text-gray-500 dark:text-gray-400 px-2 py-1 border-b sticky top-0 bg-white dark:bg-gray-800"></div>';
  S.points.forEach((p, i) => {
    h += '<div class="px-2 py-0.5 font-mono tabular-nums text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700/30">' + i + '</div>';
    h += '<div class="px-2 py-0.5 font-mono tabular-nums border-b border-gray-100 dark:border-gray-700/30">' + p.x.toFixed(1) + ', ' + p.y.toFixed(1) + '</div>';
    h += '<button onclick="editPoint(' + i + ')" class="px-1 py-0.5 border-b border-gray-100 dark:border-gray-700/30 hover:bg-green-50 dark:hover:bg-green-950/30 text-green-600 dark:text-green-400 cursor-pointer" title="' + t('edit') + '"><i data-lucide="pencil" class="h-2.5 w-2.5"></i></button>';
    h += '<button onclick="removePoint(' + i + ');renderAll()" class="px-1 py-0.5 border-b border-gray-100 dark:border-gray-700/30 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 cursor-pointer" title="' + t('delete') + '"><i data-lucide="x" class="h-2.5 w-2.5"></i></button>';
  });
  h += '</div></div>';
  h += '</div>';
  c.innerHTML = h;
}

function renderPresets() {
  const c = document.getElementById('presets-container');
  let h = '<div class="space-y-2"><h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-l-2 border-green-500 pl-2"><i data-lucide="shapes" class="h-3 w-3"></i><span>' + t('templates') + '</span></h3><div class="grid grid-cols-3 gap-1.5">';
  PRESET_SHAPES.forEach((sh, idx) => {
    const name = S.lang === 'en' ? sh.nameEn : sh.nameRu;
    const pts = PRESET_SVG_PTS[sh.nameRu] || '2,14 10,14';
    h += '<button onclick="loadPreset(' + idx + ')" class="group flex flex-col items-center justify-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950/30 dark:hover:border-green-700 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.97]"><svg viewBox="0 0 16 16" class="w-6 h-4 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="' + pts + '"/></svg><span class="text-[8px] text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-center leading-tight line-clamp-2">' + name + '</span></button>';
  });
  h += '</div></div>';
  c.innerHTML = h;
}

function loadPreset(idx) {
  const shape = PRESET_SHAPES[idx];
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  S.points = shape.points.map(pt => ({ ...pt }));
  S.hems = [];
  S.redoHistory = [];
  S.unfoldResult = null;
  if (S.autoUnfold) maybeAutoUnfold();
  ufManualZoom = null;
  view3dUserZoomed = false;
  renderAll();
}

// ==================== EDIT POINT ====================
function editPoint(idx) {
  if (idx < 0 || idx >= S.points.length) return;
  const pt = S.points[idx];
  const len = idx < S.points.length - 1 ? dist(S.points[idx], S.points[idx + 1]) : 0;
  const ang = idx < S.points.length - 1 ? Math.atan2(S.points[idx + 1].y - pt.y, S.points[idx + 1].x - pt.x) * 180 / Math.PI : 0;

  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/></svg>' + t('editPoint') + ' #' + (idx + 1) + '</h3>';
  h += '<div class="space-y-2">';

  // Coordinates
  h += '<div class="grid grid-cols-2 gap-2"><div><label class="text-xs font-medium">' + t('coordInputX') + '</label><input type="number" id="ep-x" step="any" value="' + pt.x.toFixed(1) + '" class="w-full h-7 text-xs border border-gray-200 dark:border-gray-700 rounded px-2 mt-1 bg-white dark:bg-gray-800"></div>';
  h += '<div><label class="text-xs font-medium">' + t('coordInputY') + '</label><input type="number" id="ep-y" step="any" value="' + pt.y.toFixed(1) + '" class="w-full h-7 text-xs border border-gray-200 dark:border-gray-700 rounded px-2 mt-1 bg-white dark:bg-gray-800"></div></div>';

  // Segment settings
  if (idx < S.points.length - 1) {
    h += '<hr class="border-gray-200 dark:border-gray-700"><div class="space-y-1"><label class="text-xs font-medium flex items-center gap-1"><i data-lucide="move-diagonal" class="h-3 w-3"></i>' + t('segmentLabel') + ' #' + (idx + 1) + '</label>';
    h += '<div class="grid grid-cols-2 gap-2"><div><label class="text-[10px] text-gray-500">' + t('lengthShort') + ' (' + t('mm') + ')</label><input type="number" id="ep-len" step="any" value="' + len.toFixed(1) + '" class="w-full h-7 text-xs border border-gray-200 dark:border-gray-700 rounded px-2 mt-1 bg-white dark:bg-gray-800"></div>';
    h += '<div><label class="text-[10px] text-gray-500">' + t('angleShort') + ' (°)</label><input type="number" id="ep-ang" step="any" value="' + ang.toFixed(1) + '" class="w-full h-7 text-xs border border-gray-200 dark:border-gray-700 rounded px-2 mt-1 bg-white dark:bg-gray-800"></div></div>';
    h += '</div>';
  }

  h += '<div class="flex justify-end gap-2 mt-3"><button onclick="closeDialog()" class="text-xs h-7 px-3 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700">' + t('cancel') + '</button>';
  h += '<button onclick="applyEditPoint(' + idx + ')" class="text-xs h-7 px-3 bg-green-600 text-white rounded hover:bg-green-700">' + t('add') + '</button></div>';
  h += '</div>';
  showDialog(h);
  lucide.createIcons();
  setTimeout(() => { const el = document.getElementById('ep-x'); if (el) el.focus(); }, 100);
}

function applyEditPoint(idx) {
  const xv = parseFloat(document.getElementById('ep-x').value);
  const yv = parseFloat(document.getElementById('ep-y').value);
  if (isNaN(xv) || isNaN(yv)) { toast(t('enterCoordsError'), 'error'); return; }

  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();

  S.points[idx] = { x: xv, y: yv };

  // Если есть следующий сегмент, изменяем длину/угол
  if (idx < S.points.length - 1) {
    const len = parseFloat(document.getElementById('ep-len').value);
    const ang = parseFloat(document.getElementById('ep-ang').value);
    if (!isNaN(len) && !isNaN(ang)) {
      const rad = ang * Math.PI / 180;
      S.points[idx + 1] = {
        x: xv + Math.cos(rad) * len,
        y: yv + Math.sin(rad) * len
      };
    }
  }

  S.redoHistory = [];
  closeDialog();
  maybeAutoUnfold();
  renderAll();
  toast(t('pointAdded'));
}

// ==================== EDIT SEGMENT ====================
function editSegment(idx) {
  if (idx < 0 || idx >= S.points.length - 1) return;
  const p1 = S.points[idx];
  const p2 = S.points[idx + 1];
  const len = dist(p1, p2);
  const ang = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>' + t('edit') + ' ' + t('segment') + ' #' + (idx + 1) + '</h3>';
  h += '<div class="space-y-3">';
  h += '<p class="text-[10px] text-gray-500 dark:text-gray-400">' + t('editSegmentHint') + '</p>';
  h += '<div class="grid grid-cols-2 gap-3"><div><label class="text-xs font-medium">' + t('lengthShort') + ' (' + t('mm') + ')</label><input type="number" id="es-len" step="any" value="' + len.toFixed(1) + '" class="w-full h-8 text-xs border border-gray-200 dark:border-gray-700 rounded-md px-2 mt-1 bg-white dark:bg-gray-800"></div>';
  h += '<div><label class="text-xs font-medium">' + t('angleShort') + ' (°)</label><input type="number" id="es-ang" step="any" value="' + ang.toFixed(1) + '" class="w-full h-8 text-xs border border-gray-200 dark:border-gray-700 rounded-md px-2 mt-1 bg-white dark:bg-gray-800"></div></div>';
  h += '<p class="text-[9px] text-gray-400">' + t('pointMoveHint').replace('#N2', '#' + (idx + 2)).replace('#N1', '#' + (idx + 1)) + '</p>';

  h += '<div class="flex justify-end gap-2 mt-4"><button onclick="closeDialog()" class="text-xs h-8 px-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">' + t('cancel') + '</button>';
  h += '<button onclick="applyEditSegment(' + idx + ')" class="text-xs h-8 px-3 bg-green-600 text-white rounded-md hover:bg-green-700">' + t('add') + '</button></div>';
  showDialog(h);
  setTimeout(() => { const el = document.getElementById('es-len'); if (el) el.focus(); }, 100);
}

function applyEditSegment(idx) {
  const len = parseFloat(document.getElementById('es-len').value);
  const ang = parseFloat(document.getElementById('es-ang').value);
  if (isNaN(len) || isNaN(ang)) { toast(t('enterCoordsError'), 'error'); return; }

  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();

  const p1 = S.points[idx];
  const rad = ang * Math.PI / 180;
  S.points[idx + 1] = {
    x: p1.x + Math.cos(rad) * len,
    y: p1.y + Math.sin(rad) * len
  };

  S.redoHistory = [];
  closeDialog();
  maybeAutoUnfold();
  renderAll();
  toast(t('pointAdded'));
}

// ==================== UNFOLD INFO PANEL ====================
function renderUnfoldInfo() {
  const c = document.getElementById('unfold-info');
  const badge = document.getElementById('bend-badge');
  const playBtn = document.getElementById('btn-play-pause');
  if (!S.unfoldResult || S.unfoldResult.totalLength <= 0) {
    badge.classList.add('hidden');
    playBtn.classList.add('hidden');
    c.innerHTML = '<div class="flex flex-col items-center justify-center py-6 text-center"><div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-3 animate-pulse"><i data-lucide="info" class="h-5 w-5 text-gray-400"></i></div><p class="text-xs text-gray-500 dark:text-gray-400">' + t('noUnfold') + '</p></div>';
    lucide.createIcons();
    return;
  }
  const res = S.unfoldResult;
  const mt = METAL_TYPES[S.metal.metalTypeIndex];
  const mtName = S.lang === 'en' ? mt.nameEn : mt.nameRu;
  badge.classList.remove('hidden');
  badge.textContent = res.bendInfos.length + ' ' + bendWord(res.bendInfos.length);
  if (res.bendLinePositions.length > 0) playBtn.classList.remove('hidden');
  else playBtn.classList.add('hidden');
  const area = res.totalLength * res.width;
  const wt = calcWeight(area, S.metal.thickness, S.metal.metalTypeIndex);
  const fmtW = wt < .001 ? (wt * 1000).toFixed(1) + ' ' + t('weightG') : wt < 1 ? (wt * 1000).toFixed(0) + ' ' + t('weightG') : wt.toFixed(3) + ' ' + t('weightKg');
  const density = getMetalDensity(S.metal.metalTypeIndex, S.metal.thickness) * 1e9;
  const die = DIES[S.metal.dieIndex] || DIES[0];
  const punch = PUNCHES[S.metal.punchIndex] || PUNCHES[0];
  // Short flanges
  const minFlange = S.metal.bendRadius * 2 + S.metal.thickness;
  let shortCount = 0;
  res.elements.forEach(el => {
    if (el.type === 'straight' && el.length > 0 && el.length < minFlange) shortCount++;
  });
  let h = '';
  // BOM
  h += '<div class="rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600/50 p-2.5"><p class="text-[10px] text-gray-500 dark:text-gray-400 font-semibold border-l-2 border-green-500 pl-2 mb-1.5">' + t('bomTitle') + '</p>';
  h += '<div class="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]"><span class="text-gray-500 dark:text-gray-400">' + t('partNo') + '</span><span class="text-right font-mono tabular-nums truncate">' + (S.metal.partNumber || '\u2014') + '</span>';
  h += '<span class="text-gray-500 dark:text-gray-400">' + t('material') + '</span><span class="text-right font-mono tabular-nums truncate">' + mtName + '</span>';
  h += '<span class="text-gray-500 dark:text-gray-400">' + t('thickShort') + '</span><span class="text-right font-mono tabular-nums">' + S.metal.thickness + ' mm</span>';
  h += '<span class="text-gray-500 dark:text-gray-400">L</span><span class="text-right font-mono tabular-nums">' + res.totalLength.toFixed(1) + ' mm</span>';
  h += '<span class="text-gray-500 dark:text-gray-400">' + t('bendWord1') + '</span><span class="text-right font-mono tabular-nums">' + res.bendInfos.length + '</span>';
  h += '<span class="text-gray-500 dark:text-gray-400">' + t('blankWeight') + '</span><span class="text-right font-mono tabular-nums font-semibold">' + fmtW + '</span>';
  if (S.hems && S.hems.length > 0) {
    h += '<span class="text-gray-500 dark:text-gray-400">' + t('hem') + '</span><span class="text-right font-mono tabular-nums">';
    h += S.hems.map(hm => {
      const sn = hm.segIndex < S.points.length - 1 ? (hm.segIndex + 1) : S.points.length - 1;
      return (sn + ':' + hm.height + (hm.side === 'right' ? '→' : '←'));
    }).join(' | ');
    h += '</span>';
  }
  h += '</div></div>';
  // Dimensions
  h += '<div class="grid grid-cols-2 gap-2"><div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-2 text-center"><p class="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">' + t('lengthLabel') + '</p><p class="text-sm font-bold tabular-nums">' + res.totalLength.toFixed(1) + ' <span class="text-[10px] font-normal text-gray-500">' + t('mm') + '</span></p></div>';
  h += '<div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-2 text-center"><p class="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">' + t('widthLabel') + '</p><p class="text-sm font-bold tabular-nums">' + res.width.toFixed(1) + ' <span class="text-[10px] font-normal text-gray-500">' + t('mm') + '</span></p></div></div>';
  // Weight
  h += '<div class="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 p-2.5"><div class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center"><i data-lucide="weight" class="h-3.5 w-3.5 text-green-700 dark:text-green-400"></i></div><div class="flex-1"><p class="text-[10px] text-green-600 dark:text-green-400 font-medium">' + t('weightTitle') + '</p><p class="text-lg font-black text-green-800 dark:text-green-200 tabular-nums">' + fmtW + '</p></div></div><p class="text-[10px] text-green-600/70 dark:text-green-400/60 mt-1.5">' + t('areaLabel') + ': ' + (area / 100).toFixed(1) + t('areaSuffix') + '</p></div>';
  // Material info
  h += '<div class="rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600/50 p-2.5"><div class="flex items-center gap-2"><div class="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center"><i data-lucide="info" class="h-3 w-3 text-blue-600 dark:text-blue-400"></i></div><div class="flex-1"><p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium">' + t('material') + '</p><p class="text-[10px] font-medium truncate">' + mtName + '</p></div></div>';
  h += '<div class="grid grid-cols-3 gap-x-2 mt-1.5 text-[9px]"><div><span class="text-gray-500 dark:text-gray-400">' + t('density') + '</span><p class="font-mono tabular-nums">' + density.toFixed(1) + ' ' + t('densityUnit') + '</p></div>';
  h += '<div><span class="text-gray-500 dark:text-gray-400">' + t('thickShort') + '</span><p class="font-mono tabular-nums">' + S.metal.thickness + ' mm</p></div>';
  h += '<div><span class="text-gray-500 dark:text-gray-400">R/K</span><p class="font-mono tabular-nums">' + S.metal.bendRadius + '/' + S.metal.kFactor.toFixed(2) + '</p></div></div></div>';
  // Short flange warning
  if (shortCount > 0) {
    h += '<div class="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 p-2.5"><div class="flex items-start gap-2"><i data-lucide="triangle-alert" class="h-4 w-4 text-red-500 shrink-0 mt-0.5"></i><div class="flex-1"><p class="text-[11px] font-semibold text-red-700 dark:text-red-300">' + t('shortFlanges') + '</p><p class="text-[10px] text-red-600/80 dark:text-red-400/70 mt-0.5">' + shortCount + ' ' + t('flangesShorter') + ' ' + minFlange.toFixed(1) + ' mm</p></div></div></div>';
  }
  // Bend feasibility warning
  const badBends = (res.bendInfos || []).filter(b => b.feasible === false);
  if (badBends.length > 0) {
    const dieName = S.lang === 'en' ? die.nameEn : die.nameRu;
    const punchName = S.lang === 'en' ? punch.nameEn : punch.nameRu;
    h += '<div class="rounded-lg bg-red-50 dark:bg-red-950/40 border-2 border-red-400/60 dark:border-red-700/60 p-2.5"><div class="flex items-start gap-2"><i data-lucide="triangle-alert" class="h-4 w-4 text-red-500 shrink-0 mt-0.5"></i><div class="flex-1"><p class="text-[11px] font-semibold text-red-700 dark:text-red-300">' + t('bendNotFeasible') + '</p><p class="text-[10px] text-red-600/80 dark:text-red-400/70 mt-0.5">' + dieName + ' / ' + punchName + '</p></div></div><div class="mt-1.5 space-y-1">';
    badBends.forEach(b => {
      const bn = res.bendInfos.indexOf(b) + 1;
      h += '<div class="text-[10px] text-red-700 dark:text-red-400"><b>' + t('bend') + ' ' + bn + ' (' + (b.bendAngle * 180 / Math.PI).toFixed(0) + '°):</b><div class="pl-2">' + b.problems.join('<br>— ') + '</div></div>';
    });
    h += '</div></div>';
  }
  // Segments toggle
  h += '<button onclick="S.showSegments=!S.showSegments;renderUnfoldInfo()" class="w-full flex items-center justify-between text-[10px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 py-1"><span class="flex items-center gap-1"><i data-lucide="table-properties" class="h-3 w-3"></i>' + t('segmentsTitle') + '</span><span class="transition-transform duration-200 ' + (S.showSegments ? 'rotate-180' : '') + '">\u25bc</span></button>';
  if (S.showSegments) {
    h += '<div class="max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"><table class="w-full text-[10px]"><thead><tr class="border-b bg-gray-50 dark:bg-gray-700/30"><th class="text-left px-2 py-1 font-medium text-gray-500">#</th><th class="text-left px-2 py-1 font-medium text-gray-500">' + t('segBend') + '/' + t('segStraight') + '</th><th class="text-right px-2 py-1 font-medium text-gray-500">' + t('mm') + '</th><th class="text-right px-2 py-1 font-medium text-gray-500 hidden lg:table-cell">' + t('segCumul') + '</th></tr></thead><tbody>';
    let cum = 0;
    res.elements.forEach((el, i) => {
      const isS = el.type === 'straight';
      const isHem = el.type === 'hem';
      const isBend = el.type === 'bend';
      const badBend = isBend && el.feasible === false;
      const len = isS ? el.length : (isHem ? el.length : el.bendAllowance);
      cum += len;
      const isShort = isS && len > 0 && len < minFlange;
      let rowBg = isS ? '' : (isHem ? 'bg-blue-50/50 dark:bg-blue-950/20' : 'bg-orange-50/50 dark:bg-orange-950/20');
      if (badBend) rowBg = 'bg-red-50/70 dark:bg-red-950/40';
      if (isShort) rowBg += ' bg-red-50/50 dark:bg-red-950/30';
      h += '<tr class="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50 ' + rowBg + '"><td class="px-2 py-1 text-gray-500 font-mono">' + (i + 1) + '</td>';
      h += '<td class="px-2 py-1"><span class="' + (isS ? 'text-green-700 dark:text-green-400' : (isHem ? 'text-blue-600 dark:text-blue-400' : badBend ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-orange-600 dark:text-orange-400 font-medium')) + '">' + (isS ? t('segStraight') : (isHem ? t('hem') + (el.edge === 'bottom' ? '↓' : '↑') : (badBend ? '\u26a0 ' : '') + t('segBend'))) + '</span>';
      if (!isS && !isHem) h += '<span class="ml-1 font-mono ' + (badBend ? 'text-red-500' : 'text-orange-500') + '">' + ((el.angle * 180 / Math.PI).toFixed(0)) + '°</span>';
      if (isShort) h += '<span class="ml-1 text-red-500" title="' + t('minFlangeWarning') + minFlange.toFixed(1) + ' mm">\u26a0</span>';
      h += '</td><td class="px-2 py-1 text-right font-mono tabular-nums">' + len.toFixed(2) + '</td><td class="px-2 py-1 text-right font-mono tabular-nums text-gray-500 hidden lg:table-cell">' + cum.toFixed(1) + '</td></tr>';
    });
    h += '<tfoot><tr class="border-t bg-gray-100 dark:bg-gray-700/20 font-semibold"><td colspan="2" class="px-2 py-1 text-gray-500">' + t('total') + '</td><td class="px-2 py-1 text-right font-mono tabular-nums">' + res.totalLength.toFixed(2) + '</td><td class="px-2 py-1 text-right font-mono tabular-nums text-gray-500 hidden lg:table-cell">' + res.totalLength.toFixed(1) + '</td></tr></tfoot></table></div>';
  }
  // Bend details
  if (res.bendInfos.length > 0) {
    h += '<div class="space-y-1 mt-2"><p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium">' + t('bendDetails') + '</p><div class="max-h-32 overflow-y-auto space-y-0.5">';
    res.bendInfos.forEach((b, i) => {
      const bad = b.feasible === false;
      h += '<div class="flex items-center justify-between text-[10px] rounded px-2 py-1 ' + (bad ? 'bg-red-50 dark:bg-red-950/30 border border-red-300/50' : 'bg-gray-50 dark:bg-gray-700/20') + '"><span class="text-gray-500">' + t('bend') + (i + 1) + (bad ? ' \u26a0' : '') + '</span><span class="' + (bad ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400') + ' font-mono tabular-nums">' + (b.bendAngle * 180 / Math.PI).toFixed(1) + '°</span><span class="text-gray-500 font-mono tabular-nums">' + t('ba') + b.bendAllowance.toFixed(2) + '</span></div>';
    });
    h += '</div></div>';
  }
  c.innerHTML = h;
}

// ==================== MOBILE UNFOLD PANEL ====================
function renderMobileUnfold() {
  const c = document.getElementById('mobile-unfold');
  if (!S.unfoldResult || S.unfoldResult.totalLength <= 0) { c.innerHTML = ''; return; }
  const res = S.unfoldResult;
  const mt = METAL_TYPES[S.metal.metalTypeIndex];
  const wt = calcWeight(res.totalLength * res.width, S.metal.thickness, S.metal.metalTypeIndex);
  const fmtW = wt < .001 ? (wt * 1000).toFixed(1) + ' ' + t('weightG') : wt < 1 ? (wt * 1000).toFixed(0) + ' ' + t('weightG') : wt.toFixed(3) + ' ' + t('weightKg');
  c.innerHTML = '<div class="flex items-center justify-between"><h2 class="text-xs font-semibold flex items-center gap-1.5"><i data-lucide="box" class="h-3.5 w-3.5 text-green-600 dark:text-green-400"></i>' + t('unfoldTitle') + ' <span class="text-[9px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full">' + res.bendInfos.length + ' ' + bendWord(res.bendInfos.length) + '</span></h2></div>' +
    '<div class="h-32 rounded-lg overflow-hidden border border-green-200 dark:border-green-800 flex flex-col" id="mobile-unfold-cv"></div>' +
    '<div class="grid grid-cols-3 gap-2 text-center"><div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-1.5"><p class="text-[9px] text-gray-500">' + t('lengthLabel') + '</p><p class="text-xs font-bold tabular-nums">' + res.totalLength.toFixed(1) + ' <span class="text-[9px] font-normal text-gray-500">' + t('mm') + '</span></p></div><div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-1.5"><p class="text-[9px] text-gray-500">' + t('widthLabel') + '</p><p class="text-xs font-bold tabular-nums">' + res.width.toFixed(1) + ' <span class="text-[9px] font-normal text-gray-500">' + t('mm') + '</span></p></div><div class="rounded-lg bg-green-50 dark:bg-green-950/30 p-1.5"><p class="text-[9px] text-green-600 dark:text-green-400">' + t('weightTitle') + '</p><p class="text-xs font-bold text-green-800 dark:text-green-200 tabular-nums">' + fmtW + '</p></div></div>' +
    '<div class="flex gap-1.5"><button onclick="showDxfOptions()" class="flex-1 text-xs h-7 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-md flex items-center justify-center gap-1"><i data-lucide="file-down" class="h-3 w-3"></i>DXF</button><button onclick="exportSVG()" class="flex-1 text-xs h-7 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-md flex items-center justify-center gap-1"><i data-lucide="file-code-2" class="h-3 w-3"></i>SVG</button><button onclick="exportPNG(true)" class="flex-1 text-xs h-7 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-md flex items-center justify-center gap-1"><i data-lucide="image" class="h-3 w-3"></i>PNG</button></div>';
  lucide.createIcons();
}

// ==================== DRAWING GENERATOR ====================
function generateDrawing() {
  if (!S.unfoldResult || S.points.length < 2) return;
  const res = S.unfoldResult;
  const mt = METAL_TYPES[S.metal.metalTypeIndex];
  const mtName = S.lang === 'en' ? mt.nameEn : mt.nameRu;
  // Невозможные гибы
  const badBends = (res.bendInfos || []).filter(b => b.feasible === false);
  const die = DIES[S.metal.dieIndex] || DIES[0];
  const punch = PUNCHES[S.metal.punchIndex] || PUNCHES[0];
  const L = res.totalLength, W = res.width;
  const area = L * W;
  const wt = calcWeight(area, S.metal.thickness, S.metal.metalTypeIndex);
  const fmtW = wt < .001 ? (wt * 1000).toFixed(1) + ' ' + t('weightG') : wt < 1 ? (wt * 1000).toFixed(0) + ' ' + t('weightG') : wt.toFixed(3) + ' ' + t('weightKg');
  const density = getMetalDensity(S.metal.metalTypeIndex, S.metal.thickness) * 1e9;
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);

  // A4 landscape: 297x210mm, 3px/mm
  const pxPerMm = 3;
  const CW = 297 * pxPerMm;
  const CH = 210 * pxPerMm;
  const border = 10 * pxPerMm;
  const titleH = 45 * pxPerMm;

  const cv = document.createElement('canvas');
  cv.width = CW; cv.height = CH;
  const ctx = cv.getContext('2d');

  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, CW, CH);
  ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
  ctx.strokeRect(border, border, CW - border * 2, CH - border * 2);

  const drawTop = border + 15;
  const drawBottom = CH - border - titleH - 15;
  const drawLeft = border + 15;
  const drawRight = CW - border - 15;
  const drawW = drawRight - drawLeft;
  const drawH = drawBottom - drawTop;

  // Profile 40%, Unfold 60%
  const profileW = drawW * 0.38;
  const unfoldW = drawW * 0.58;
  const gap = drawW * 0.04;
  const profileLeft = drawLeft;
  const unfoldLeft = profileLeft + profileW + gap;

  // Separator
  ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1;
  const sepX = profileLeft + profileW + gap / 2;
  ctx.beginPath(); ctx.moveTo(sepX, drawTop); ctx.lineTo(sepX, drawBottom); ctx.stroke();

  // === PROFILE VIEW ===
  ctx.fillStyle = '#333';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(t('drawingProfile'), profileLeft + profileW / 2, drawTop);

  let pMinX = Infinity, pMaxX = -Infinity, pMinY = Infinity, pMaxY = -Infinity;
  S.points.forEach(p => {
    if (p.x < pMinX) pMinX = p.x; if (p.x > pMaxX) pMaxX = p.x;
    if (p.y < pMinY) pMinY = p.y; if (p.y > pMaxY) pMaxY = p.y;
  });
  const pRangeX = pMaxX - pMinX || 1;
  const pRangeY = pMaxY - pMinY || 1;
  const profPad = 30;
  const profTop = drawTop + 20;
  const profBot = drawBottom - 10;
  const profAreaH = profBot - profTop;
  const pScale = Math.min((profileW - profPad * 2) / pRangeX, (profAreaH - profPad * 2) / pRangeY);
  const pOfsX = profileLeft + (profileW - pRangeX * pScale) / 2;
  const pOfsY = profTop + (profAreaH - pRangeY * pScale) / 2;

  function p2d(wx, wy) { return { x: pOfsX + (wx - pMinX) * pScale, y: pOfsY + (pMaxY - wy) * pScale }; }

  if (S.points.length >= 2) {
    ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2;
    ctx.beginPath();
    const p0 = p2d(S.points[0].x, S.points[0].y);
    ctx.moveTo(p0.x, p0.y);
    for (let i = 1; i < S.points.length; i++) {
      const pp = p2d(S.points[i].x, S.points[i].y);
      ctx.lineTo(pp.x, pp.y);
    }
    ctx.stroke();

    // Build bend number map: vertexIndex -> bendNumber (1-indexed)
    const bendNumMap = {};
    if (res.bendInfos) res.bendInfos.forEach((b, idx) => { bendNumMap[b.vertexIndex] = idx + 1; });

    S.points.forEach((p, i) => {
      const pp = p2d(p.x, p.y);
      ctx.beginPath(); ctx.arc(pp.x, pp.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#16a34a'; ctx.fill();
      const bNum = bendNumMap[i];
      if (bNum) {
        ctx.fillStyle = '#c2410c'; ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(String(bNum), pp.x, pp.y - 5);
      }
    });

    // Segment dimensions
    ctx.fillStyle = '#666'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < S.points.length - 1; i++) {
      const a = S.points[i], b = S.points[i + 1];
      const segLen = dist(a, b);
      const pa = p2d(a.x, a.y), pb = p2d(b.x, b.y);
      const mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2;
      const ang = Math.atan2(pb.y - pa.y, pb.x - pa.x);
      ctx.save();
      ctx.translate(mx + Math.cos(ang + Math.PI / 2) * 10, my + Math.sin(ang + Math.PI / 2) * 10);
      ctx.rotate(ang);
      ctx.fillText(segLen.toFixed(1), 0, 0);
      ctx.restore();
    }

    // Bend angles on profile
    // Карта вершин: vertexIndex -> bend (с полем feasible)
    const bendFeasMap = {};
    if (res.bendInfos) res.bendInfos.forEach(b => { bendFeasMap[b.vertexIndex] = b; });
    for (let i = 1; i < S.points.length - 1; i++) {
      const pp = p2d(S.points[i - 1].x, S.points[i - 1].y);
      const pc = p2d(S.points[i].x, S.points[i].y);
      const pn = p2d(S.points[i + 1].x, S.points[i + 1].y);
      const aToPrev = Math.atan2(pp.y - pc.y, pp.x - pc.x);
      const aToNext = Math.atan2(pn.y - pc.y, pn.x - pc.x);
      const ba = Math.abs(normAngle(aToNext - aToPrev));
      if (ba < 5 * Math.PI / 180) continue;
      const arcR = Math.min(18, pRangeX * pScale * 0.12, pRangeY * pScale * 0.12);
      const diff = normAngle(aToPrev - aToNext);
      const bInfo = bendFeasMap[i];
      const infeasible = bInfo && bInfo.feasible === false;
      ctx.strokeStyle = infeasible ? '#dc2626' : '#c2410c';
      ctx.lineWidth = infeasible ? 2 : 0.8;
      ctx.beginPath();
      ctx.arc(pc.x, pc.y, arcR, aToNext, aToPrev, diff < 0);
      ctx.stroke();
      const midA = aToNext + diff / 2;
      const lr = arcR + 10;
      ctx.fillStyle = infeasible ? '#dc2626' : '#c2410c';
      ctx.font = infeasible ? 'bold 9px sans-serif' : 'bold 8px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText((infeasible ? '\u26a0 ' : '') + (ba * 180 / Math.PI).toFixed(1) + '\u00b0', pc.x + Math.cos(midA) * lr, pc.y + Math.sin(midA) * lr);
    }

    // Hem hooks on profile
    if (S.hems && S.hems.length > 0) {
      const br = S.metal.bendRadius;
      S.hems.forEach(hem => {
        const si = hem.segIndex;
        const numSegs = S.points.length - 1;
        if (si < 0 || si > numSegs) return;
        let pt, neighbor;
        if (si >= numSegs - 1) {
          pt = S.points[S.points.length - 1];
          neighbor = S.points[S.points.length - 2];
        } else {
          pt = S.points[si];
          neighbor = S.points[si + 1];
        }
        const isLeft = hem.side !== 'right';
        const segAngle = Math.atan2(neighbor.y - pt.y, neighbor.x - pt.x);
        const perpAngle = isLeft ? (segAngle - Math.PI / 2) : (segAngle + Math.PI / 2);
        const h1w = { x: pt.x + Math.cos(perpAngle) * br, y: pt.y + Math.sin(perpAngle) * br };
        const h2w = { x: h1w.x + Math.cos(segAngle) * hem.height, y: h1w.y + Math.sin(segAngle) * hem.height };
        const c0 = p2d(pt.x, pt.y), c1 = p2d(h1w.x, h1w.y), c2 = p2d(h2w.x, h2w.y);
        const hColor = isLeft ? '#3b82f6' : '#8b5cf6';
        ctx.strokeStyle = hColor; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(c0.x, c0.y); ctx.lineTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.stroke();
        ctx.beginPath(); ctx.arc(c1.x, c1.y, 2.5, 0, Math.PI * 2); ctx.fillStyle = hColor; ctx.fill();
        const label = hem.height.toFixed(1) + ' mm';
        const lx = (c1.x + c2.x) / 2, ly = (c1.y + c2.y) / 2;
        const offset = isLeft ? -12 : 12;
        ctx.fillStyle = hColor; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(label, lx + (-Math.sin(segAngle) * offset), ly + (Math.cos(segAngle) * offset));
      });
    }
  }

  // === UNFOLD VIEW ===
  ctx.fillStyle = '#333';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(t('drawingUnfold'), unfoldLeft + unfoldW / 2, drawTop);

  const ufPad = 25;
  const ufTop = drawTop + 20;
  const ufBot = drawBottom - 35;
  const ufAreaH = ufBot - ufTop;
  const uScale = Math.min((unfoldW - ufPad * 2) / L, (ufAreaH - ufPad * 2) / W);
  const uOfsX = unfoldLeft + (unfoldW - L * uScale) / 2;
  const uOfsY = ufTop + (ufAreaH - W * uScale) / 2;

  ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2;
  ctx.strokeRect(uOfsX, uOfsY, L * uScale, W * uScale);

  let bc = 0;
  res.elements.forEach(el => {
    if (el.type === 'straight') {
      ctx.fillStyle = '#dcfce7';
      ctx.fillRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      ctx.strokeStyle = '#16a34a33'; ctx.lineWidth = 0.5;
      ctx.strokeRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      if (el.length > 5) {
        const mx = (el.startX + el.endX) / 2;
        ctx.fillStyle = '#15803d'; ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(el.length.toFixed(1), uOfsX + mx * uScale, uOfsY + W * uScale / 2);
      }
    } else if (el.type === 'hem') {
      ctx.fillStyle = '#bfdbfe';
      ctx.fillRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1; ctx.setLineDash([2, 2]);
      ctx.strokeRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      ctx.setLineDash([]);
      const mx = (el.startX + el.endX) / 2;
      ctx.fillStyle = '#1d4ed8'; ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(el.height.toFixed(1), uOfsX + mx * uScale, uOfsY + W * uScale / 2);
    } else {
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      ctx.strokeStyle = '#ea580c33'; ctx.lineWidth = 0.5;
      ctx.strokeRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      const mx = (el.startX + el.endX) / 2;
      ctx.fillStyle = '#c2410c'; ctx.font = '9px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText((el.angle * 180 / Math.PI).toFixed(0) + '\u00b0', uOfsX + mx * uScale, uOfsY + W * uScale / 2);
      bc++;
    }
  });

  ctx.setLineDash([4, 3]);
  res.bendLinePositions.forEach((xp, idx) => {
    const bInf = res.bendInfos[idx];
    const infeasible = bInf && bInf.feasible === false;
    ctx.strokeStyle = infeasible ? '#dc2626' : '#ea580c';
    ctx.lineWidth = infeasible ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(uOfsX + xp * uScale, uOfsY);
    ctx.lineTo(uOfsX + xp * uScale, uOfsY + W * uScale);
    ctx.stroke();
    const nx = uOfsX + xp * uScale, ny = uOfsY + 10;
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(nx, ny, 7, 0, Math.PI * 2);
    ctx.fillStyle = infeasible ? '#dc2626' : '#f97316'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(idx + 1), nx, ny);
    ctx.setLineDash([4, 3]);
  });
  ctx.setLineDash([]);

  // Hem bend lines on unfold (blue, no numbers)
  if (res.hemBendLinePositions && res.hemBendLinePositions.length > 0) {
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1.5;
    res.hemBendLinePositions.forEach(xp => {
      ctx.beginPath();
      ctx.moveTo(uOfsX + xp * uScale, uOfsY);
      ctx.lineTo(uOfsX + xp * uScale, uOfsY + W * uScale);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  // Unfold dimensions
  const dimY = uOfsY + W * uScale + 12;
  ctx.strokeStyle = '#666'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(uOfsX, dimY); ctx.lineTo(uOfsX + L * uScale, dimY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(uOfsX, dimY - 3); ctx.lineTo(uOfsX, dimY + 3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(uOfsX + L * uScale, dimY - 3); ctx.lineTo(uOfsX + L * uScale, dimY + 3); ctx.stroke();
  ctx.fillStyle = '#555'; ctx.font = '9px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(L.toFixed(1) + ' mm', uOfsX + L * uScale / 2, dimY + 3);

  const dimX = uOfsX + L * uScale + 10;
  ctx.beginPath(); ctx.moveTo(dimX, uOfsY); ctx.lineTo(dimX, uOfsY + W * uScale); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dimX - 3, uOfsY); ctx.lineTo(dimX + 3, uOfsY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dimX - 3, uOfsY + W * uScale); ctx.lineTo(dimX + 3, uOfsY + W * uScale); ctx.stroke();
  ctx.save(); ctx.translate(dimX + 3, uOfsY + W * uScale / 2); ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#555'; ctx.font = '9px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(W.toFixed(1) + ' mm', 0, 0);
  ctx.restore();

  // Legend
  const lgX = unfoldLeft + unfoldW - 5;
  const lgY = ufTop + 15;
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.font = '8px sans-serif';
  ctx.fillStyle = '#dcfce7'; ctx.fillRect(lgX - 50, lgY - 4, 10, 8);
  ctx.strokeStyle = '#16a34a33'; ctx.lineWidth = 0.5; ctx.strokeRect(lgX - 50, lgY - 4, 10, 8);
  ctx.fillStyle = '#555'; ctx.fillText(t('straightLegend'), lgX, lgY);
  ctx.fillStyle = '#fed7aa'; ctx.fillRect(lgX - 50, lgY + 10, 10, 8);
  ctx.strokeStyle = '#ea580c33'; ctx.lineWidth = 0.5; ctx.strokeRect(lgX - 50, lgY + 10, 10, 8);
  ctx.fillStyle = '#555'; ctx.fillText(t('bendLegend'), lgX, lgY + 14);

  // === TITLE BLOCK ===
  const tbTop = CH - border - titleH;
  ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
  ctx.strokeRect(border, tbTop, CW - border * 2, titleH);
  ctx.beginPath(); ctx.moveTo(border + (CW - border * 2) * 0.6, tbTop); ctx.lineTo(border + (CW - border * 2) * 0.6, tbTop + titleH); ctx.stroke();

  const ts = 9; const lh = ts + 5;
  let ty = tbTop + 8;
  ctx.fillStyle = '#000'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText(t('drawingTitle') + ' \u2014 ' + (S.metal.partNumber || '\u2014'), border + 10, ty); ty += lh + 4;
  ctx.font = ts + 'px sans-serif';
  ctx.fillText(t('material') + ': ' + mtName, border + 10, ty); ty += lh;
  ctx.fillText(t('thickness') + ': ' + S.metal.thickness + ' mm', border + 10, ty); ty += lh;
  ctx.fillText('R: ' + S.metal.bendRadius + ' mm  |  K: ' + S.metal.kFactor.toFixed(2), border + 10, ty); ty += lh;
  ctx.fillText(t('bendWord1') + ': ' + res.bendInfos.length + '  |  L: ' + L.toFixed(1) + ' mm  |  W: ' + W.toFixed(1) + ' mm', border + 10, ty); ty += lh;
  ctx.fillText(t('dieSelect') + ': ' + (S.lang === 'en' ? die.nameEn : die.nameRu) + '  |  ' + t('punchSelect') + ': ' + (S.lang === 'en' ? punch.nameEn : punch.nameRu), border + 10, ty);

  ctx.textAlign = 'right'; ty = tbTop + 8;
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText(t('blankWeight') + ': ' + fmtW, CW - border - 10, ty); ty += lh + 4;
  ctx.font = ts + 'px sans-serif';
  ctx.fillText(t('areaLabel') + ': ' + (area / 100).toFixed(1) + t('areaSuffix'), CW - border - 10, ty); ty += lh;
  ctx.fillText(t('density') + ': ' + density.toFixed(1) + ' ' + t('densityUnit'), CW - border - 10, ty); ty += lh;
  ctx.fillText(dateStr, CW - border - 10, ty);

  // Show dialog with preview
  const dataUrl = cv.toDataURL('image/png');
  let dh = '';
  // Предупреждение о невозможных гибах
  if (badBends.length > 0) {
    const dieName = S.lang === 'en' ? die.nameEn : die.nameRu;
    const punchName = S.lang === 'en' ? punch.nameEn : punch.nameRu;
    dh += '<div class="mb-3 rounded-lg border-2 border-red-500/50 bg-red-50 dark:bg-red-950/30 p-3">';
    dh += '<p class="text-xs font-semibold text-red-700 dark:text-red-400 flex items-center gap-1.5 mb-1"><i data-lucide="alert-triangle" class="h-3.5 w-3.5"></i>' + t('bendWarningsTitle') + ' — ' + dieName + ' / ' + punchName + '</p>';
    dh += '<div class="space-y-1">';
    badBends.forEach((b, i) => {
      dh += '<div class="text-[10px] text-red-700 dark:text-red-400">';
      dh += '<b>Гиб #' + (b.vertexIndex) + ' (' + (b.bendAngle * 180 / Math.PI).toFixed(0) + '°):</b>';
      b.problems.forEach(pr => { dh += '<div class="pl-3">— ' + pr + '</div>'; });
      dh += '</div>';
    });
    dh += '</div></div>';
  }
  dh += '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' + t('drawingTitle') + '</h3>';
  dh += '<div style="max-height:85vh;overflow-y:auto;"><img src="' + dataUrl + '" style="width:100%;border:1px solid #e5e5e5;border-radius:4px;"/></div>';
  dh += '<div class="flex gap-2 mt-3">';
  dh += '<button onclick="downloadDrawing()" class="flex-1 text-xs h-9 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold flex items-center justify-center gap-1.5"><i data-lucide="download" class="h-3.5 w-3.5"></i>' + t('drawingDownload') + '</button>';
  dh += '<button onclick="printDrawing()" class="flex-1 text-xs h-9 px-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center gap-1.5"><i data-lucide="printer" class="h-3.5 w-3.5"></i>' + t('drawingPrint') + '</button>';
  dh += '</div>';
  showDialog(dh, 'dialog-box-wide');
  lucide.createIcons();
  window._drawingCanvas = cv;
}

function downloadDrawing() {
  const cv = window._drawingCanvas;
  if (!cv) return;
  const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  cv.toBlob(blob => {
    if (!blob) return;
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u; a.download = 'drawing-' + ts + '.png';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(u);
  }, 'image/png');
}

function printDrawing() {
  const cv = window._drawingCanvas;
  if (!cv) return;
  const dataUrl = cv.toDataURL('image/png');
  const win = window.open('', '_blank');
  if (!win) { toast('Popup blocked', 'error'); return; }
  win.document.write('<!DOCTYPE html><html><head><title>' + t('drawingTitle') + '</title><style>@page{margin:0;size:A4 landscape}@media print{body{margin:0;padding:0}}</style></head><body style="margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#fff;"><img src="' + dataUrl + '" style="max-width:100%;max-height:100vh;" onload="setTimeout(()=>window.print(),300)"/></body></html>');
  win.document.close();
}
// ═══════════════════════════════════════════════════════════════
// UI / DIALOGS — базовые диалоги: show/close, горячие клавиши,
// ввод координат, параметры экспорта DXF
// ═══════════════════════════════════════════════════════════════

function showShortcuts() {
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

// ==================== БАЗОВЫЕ ДИАЛОГИ ====================
function showDialog(html, extraClass) {
  const box = document.getElementById('dialog-content');
  const overlay = document.getElementById('dialog-overlay');
  if (!html || html.trim() === '') return;
  if (!overlay || !box) return;
  box.innerHTML = html;
  box.className = extraClass ? 'dialog-box ' + extraClass : 'dialog-box';
  overlay.classList.remove('hidden'); // важно: снимаем !important-правило из CSS
  overlay.style.display = 'flex';
}

function closeDialog() {
  const overlay = document.getElementById('dialog-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.style.display = 'none';
  }
}

// ==================== ЗАКРЫТИЕ ПО КЛИКУ МИМО ОКНА ====================
// v5.4 FIX: при выделении текста мышью внутри окна ввода курсор часто
// выходит за пределы окна (на оверлей). Браузер порождает click на общем
// предке mousedown/mouseup — оверлее — и окно закрывалось посреди выделения.
// Теперь закрываем ТОЛЬКО если нажатие мыши НАЧАЛОСЬ на оверлее (вне окна):
// drag, начавшийся внутри окна (выделение текста), click по оверлее не
// закрывает. Простые клики по фону работают как раньше.
(function () {
  const overlay = document.getElementById('dialog-overlay');
  if (!overlay) return;
  let pressOutside = false;
  overlay.addEventListener('mousedown', function (e) {
    pressOutside = (e.target === overlay);
  });
  overlay.addEventListener('click', function (e) {
    if (e.target !== overlay) return;
    if (pressOutside) closeDialog();
    pressOutside = false;
  });
})();

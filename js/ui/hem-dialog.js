// ═══════════════════════════════════════════════════════════════
// UI / HEM-DIALOG — диалог каймы (высота, сторона), применение,
// удаление, отмена
// ═══════════════════════════════════════════════════════════════

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

  // Высота
  h += '<div class="space-y-1 mb-3"><label class="text-xs font-medium">' + t('hemHeight') + '</label>';
  h += '<input type="number" id="hem-dialog-height" min="0.5" max="50" step="0.5" value="' + height + '" class="w-full h-9 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500/30 font-mono">';
  h += '</div>';

  // Сторона
  h += '<div class="space-y-1 mb-4"><label class="text-xs font-medium">' + t('hemSide') + '</label>';
  h += '<div class="flex gap-2">';
  h += '<button id="hem-side-left" onclick="setHemSide(\'left\')" class="flex-1 h-9 text-xs rounded-md border-2 transition-all ' + (side === 'left' ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30 text-purple-700 font-semibold' : 'border-gray-200 dark:border-gray-700 text-gray-600 hover:border-purple-300') + '">' + t('hemSideLeft') + '</button>';
  h += '<button id="hem-side-right" onclick="setHemSide(\'right\')" class="flex-1 h-9 text-xs rounded-md border-2 transition-all ' + (side === 'right' ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30 text-purple-700 font-semibold' : 'border-gray-200 dark:border-gray-700 text-gray-600 hover:border-purple-300') + '">' + t('hemSideRight') + '</button>';
  h += '</div></div>';

  // Кнопки
  h += '<div class="flex justify-between gap-2">';
  if (existing) {
    h += '<button onclick="removeHem(S.hemEditing.segIndex)" class="text-xs h-8 px-3 border border-red-200 dark:border-red-800 text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30">' + t('hemRemove') + '</button>';
  } else {
    h += '<button onclick="cancelHem()" class="text-xs h-8 px-3 border border-gray-200 dark:border-gray-700 rounded-md">' + t('hemCancel') + '</button>';
  }
  h += '<button onclick="applyHemFromDialog()" class="text-xs h-8 px-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-semibold">' + t('hemApply') + '</button>';
  h += '</div>';

  showDialog(h);
  // Фокус в поле
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
  // Undo-состояние (включая каймы)
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  S.redoHistory = [];
  // Удаляем существующую кайму этого сегмента
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

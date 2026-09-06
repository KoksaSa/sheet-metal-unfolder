// ═══════════════════════════════════════════════════════════════
// UI / EDIT-DIALOGS — редактирование точки и сегмента
// ═══════════════════════════════════════════════════════════════

// ==================== EDIT POINT ====================
function editPoint(idx) {
  if (idx < 0 || idx >= S.points.length) return;
  const pt = S.points[idx];
  const len = idx < S.points.length - 1 ? dist(S.points[idx], S.points[idx + 1]) : 0;
  const ang = idx < S.points.length - 1 ? Math.atan2(S.points[idx + 1].y - pt.y, S.points[idx + 1].x - pt.x) * 180 / Math.PI : 0;

  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/></svg>' + t('editPoint') + ' #' + (idx + 1) + '</h3>';
  h += '<div class="space-y-2">';

  // Координаты
  h += '<div class="grid grid-cols-2 gap-2"><div><label class="text-xs font-medium">' + t('coordInputX') + '</label><input type="number" id="ep-x" step="any" value="' + pt.x.toFixed(1) + '" class="w-full h-7 text-xs border border-gray-200 dark:border-gray-700 rounded px-2 mt-1 bg-white dark:bg-gray-800"></div>';
  h += '<div><label class="text-xs font-medium">' + t('coordInputY') + '</label><input type="number" id="ep-y" step="any" value="' + pt.y.toFixed(1) + '" class="w-full h-7 text-xs border border-gray-200 dark:border-gray-700 rounded px-2 mt-1 bg-white dark:bg-gray-800"></div></div>';

  // Настройки сегмента
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
  refreshIcons();
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
  const dirX = Math.cos(rad), dirY = Math.sin(rad);

  // Удлинение должно идти в сторону свободного края контура,
  // а не к пересечению с другой точкой (гибом).
  const isLeftFree = idx === 0;
  const isRightFree = idx + 1 === S.points.length - 1;

  if (isLeftFree && !isRightFree && S.points.length > 2) {
    // Левый конец — свободный край: двигаем НАЧАЛЬНУЮ точку в обратном
    // направлении, сохраняя точку гиба (idx+1) на месте.
    S.points[idx] = {
      x: S.points[idx + 1].x - dirX * len,
      y: S.points[idx + 1].y - dirY * len
    };
  } else {
    // Правый конец — свободный край (или контур из двух точек):
    // двигаем КОНЕЧНУЮ точку по направлению сегмента.
    S.points[idx + 1] = {
      x: p1.x + dirX * len,
      y: p1.y + dirY * len
    };
  }

  S.redoHistory = [];
  closeDialog();
  maybeAutoUnfold();
  renderAll();
  toast(t('pointAdded'));
}

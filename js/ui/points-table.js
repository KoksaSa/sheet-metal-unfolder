// ═══════════════════════════════════════════════════════════════
// UI / POINTS-TABLE — статистика профиля, таблица точек,
// шаблоны фигур (пресеты)
// ═══════════════════════════════════════════════════════════════

// ==================== СТАТИСТИКА ПРОФИЛЯ ====================
function renderStats() {
  const c = document.getElementById('stats-container');
  if (!c) return;
  if (S.points.length < 2) { c.innerHTML = ''; return; }
  const totalLen = S.points.slice(0, -1).reduce((s, p, i) => {
    const dx = S.points[i + 1].x - p.x, dy = S.points[i + 1].y - p.y;
    return s + Math.sqrt(dx * dx + dy * dy);
  }, 0);
  c.innerHTML = '<hr class="my-3 border-gray-200 dark:border-gray-700"><div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-2.5 space-y-1"><p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium">' + t('profileStats') + '</p><div class="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs"><span class="text-gray-500 dark:text-gray-400">' + t('pointsLabel') + '</span><span class="text-right font-mono tabular-nums">' + S.points.length + ' ' + pointWord(S.points.length) + '</span><span class="text-gray-500 dark:text-gray-400">' + t('profileLength') + '</span><span class="text-right font-mono tabular-nums">' + totalLen.toFixed(1) + ' mm</span></div></div>';
}

// ==================== ТАБЛИЦА ТОЧЕК ====================
function renderPointsTable() {
  const c = document.getElementById('points-table-container');
  if (!c) return;
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

// ==================== ШАБЛОНЫ (ПРЕСЕТЫ) ====================
function renderPresets() {
  const c = document.getElementById('presets-container');
  if (!c) return;
  let h = '<div class="space-y-2"><h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-l-2 border-green-500 pl-2"><i data-lucide="shapes" class="h-3 w-3"></i><span>' + t('templates') + '</span></h3><div class="grid grid-cols-3 gap-1.5">';
  PRESET_SHAPES.forEach((sh, idx) => {
    const name = S.lang === 'en' ? sh.nameEn : sh.nameRu;
    const pts = PRESET_SVG_PTS[sh.nameRu] || '2,14 10,14';
    h += '<button onclick="loadPreset(' + idx + ')" class="group flex flex-col items-center justify-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950/30 dark:hover:border-green-700 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.97]"><svg viewBox="0 0 16 16" class="w-6 h-4 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="' + pts + '"/></svg><span class="text-[8px] text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-center leading-tight line-clamp-2">' + name + '</span></button>';
  });
  // v4.9: плитка «DXF» убрана — импорт профиля DXF теперь кнопка
  // «Импорт профиля DXF» в блоке действий левой панели
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
  // Сброс состояния симуляции: другой профиль — старые гибы бессмысленны
  // (v4.4: единый полный сброс, включая шаги 3D-симуляции)
  if (typeof resetSimulationState === 'function') resetSimulationState();
  if (S.simAnimRunning && typeof stopAnimation === 'function') stopAnimation();
  if (S.autoUnfold) maybeAutoUnfold();
  ufManualZoom = null;
  view3dUserZoomed = false;
  renderAll();
}

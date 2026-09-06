// ═══════════════════════════════════════════════════════════════
// UI / UNFOLD-INFO — правая панель: спецификация (BOM), размеры,
// вес, материал, инструменты, детали гибов, сегменты развёртки +
// мобильная панель развёртки
// ═══════════════════════════════════════════════════════════════

function renderUnfoldInfo() {
  const c = document.getElementById('unfold-info');
  const badge = document.getElementById('bend-badge');
  const playBtn = document.getElementById('btn-play-pause');
  if (!c) return;
  if (!S.unfoldResult || S.unfoldResult.totalLength <= 0) {
    if (badge) badge.classList.add('hidden');
    if (playBtn) playBtn.classList.add('hidden');
    c.innerHTML = '<div class="flex flex-col items-center justify-center py-6 text-center"><div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-3 animate-pulse"><i data-lucide="info" class="h-5 w-5 text-gray-400"></i></div><p class="text-xs text-gray-500 dark:text-gray-400">' + t('noUnfold') + '</p></div>';
    refreshIcons();
    return;
  }
  const res = S.unfoldResult;
  const mt = METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0];
  const mtName = S.lang === 'en' ? mt.nameEn : mt.nameRu;
  if (badge) {
    badge.classList.remove('hidden');
    badge.textContent = res.bendInfos.length + ' ' + bendWord(res.bendInfos.length);
  }
  if (playBtn) {
    if (res.bendLinePositions.length > 0) playBtn.classList.remove('hidden');
    else playBtn.classList.add('hidden');
  }
  const area = res.totalLength * res.width;
  const wt = calcWeight(area, S.metal.thickness, S.metal.metalTypeIndex);
  const fmtW = wt < .001 ? (wt * 1000).toFixed(1) + ' ' + t('weightG') : wt < 1 ? (wt * 1000).toFixed(0) + ' ' + t('weightG') : wt.toFixed(3) + ' ' + t('weightKg');
  const density = getMetalDensity(S.metal.metalTypeIndex, S.metal.thickness) * 1e9;
  // Инструменты (свои или пресеты)
  const die = getDieByIndex(S.metal.dieIndex);
  const punch = getPunchByIndex(S.metal.punchIndex);
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
  // Габариты
  h += '<div class="grid grid-cols-2 gap-2"><div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-2 text-center"><p class="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">' + t('lengthLabel') + '</p><p class="text-sm font-bold tabular-nums">' + res.totalLength.toFixed(1) + ' <span class="text-[10px] font-normal text-gray-500">' + t('mm') + '</span></p></div>';
  h += '<div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-2 text-center"><p class="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">' + t('widthLabel') + '</p><p class="text-sm font-bold tabular-nums">' + res.width.toFixed(1) + ' <span class="text-[10px] font-normal text-gray-500">' + t('mm') + '</span></p></div></div>';
  // v4.7: наружный габарит профиля (полоса ±T/2 от средней линии)
  // + заметка, что размеры профиля — по СРЕДНЕЙ линии (нейтральный слой)
  const outerB = (typeof profileOuterBounds === 'function') ? profileOuterBounds(S.points, S.metal.thickness) : null;
  if (outerB) {
    h += '<div class="rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 p-2 flex items-center justify-between gap-2"><div class="flex items-center gap-1.5"><i data-lucide="maximize-2" class="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0"></i><span class="text-[10px] text-teal-700 dark:text-teal-300 font-medium">' + t('outerDimsLabel') + '</span></div><span class="text-[10px] font-mono tabular-nums text-teal-700 dark:text-teal-300">' + outerB.width.toFixed(1) + ' × ' + outerB.height.toFixed(1) + ' ' + t('mm') + '</span></div>';
  }
  h += '<p class="text-[9px] text-gray-400 dark:text-gray-500 leading-snug flex items-start gap-1"><i data-lucide="info" class="h-3 w-3 mt-0.5 shrink-0"></i><span>' + t('centerLineNote') + '</span></p>';
  // Вес
  h += '<div class="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 p-2.5"><div class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center"><i data-lucide="weight" class="h-3.5 w-3.5 text-green-700 dark:text-green-400"></i></div><div class="flex-1"><p class="text-[10px] text-green-600 dark:text-green-400 font-medium">' + t('weightTitle') + '</p><p class="text-lg font-black text-green-800 dark:text-green-200 tabular-nums">' + fmtW + '</p></div></div><p class="text-[10px] text-green-600/70 dark:text-green-400/60 mt-1.5">' + t('areaLabel') + ': ' + (area / 100).toFixed(1) + t('areaSuffix') + '</p></div>';
  // Материал
  h += '<div class="rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600/50 p-2.5"><div class="flex items-center gap-2"><div class="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center"><i data-lucide="info" class="h-3 w-3 text-blue-600 dark:text-blue-400"></i></div><div class="flex-1"><p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium">' + t('material') + '</p><p class="text-[10px] font-medium truncate">' + mtName + '</p></div></div>';
  h += '<div class="grid grid-cols-3 gap-x-2 mt-1.5 text-[9px]"><div><span class="text-gray-500 dark:text-gray-400">' + t('density') + '</span><p class="font-mono tabular-nums">' + density.toFixed(1) + ' ' + t('densityUnit') + '</p></div>';
  h += '<div><span class="text-gray-500 dark:text-gray-400">' + t('thickShort') + '</span><p class="font-mono tabular-nums">' + S.metal.thickness + ' mm</p></div>';
  h += '<div><span class="text-gray-500 dark:text-gray-400">R/K</span><p class="font-mono tabular-nums">' + S.metal.bendRadius + '/' + S.metal.kFactor.toFixed(2) + '</p></div></div></div>';
  // Миниатюры инструментов + углы гибов
  h += '<div class="rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600/50 p-2.5"><div class="flex items-center gap-2 mb-1.5"><div class="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center"><i data-lucide="hammer" class="h-3 w-3 text-blue-600 dark:text-blue-400"></i></div><p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium">' + t('bendTool') + '</p></div>';
  h += '<div class="grid grid-cols-2 gap-2">';
  // Матрица
  h += '<div class="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1.5"><p class="text-[9px] text-gray-500 dark:text-gray-400 mb-1">' + t('dieSelect') + '</p><div class="h-12 flex items-center justify-center overflow-hidden">' + (die ? toolThumbSVG(die, 'die', 80, 44) : '<span class="text-[9px] text-gray-400">\u2014</span>') + '</div>';
  if (die) h += '<p class="text-[9px] text-gray-500 dark:text-gray-400 mt-1 font-mono">' + toolSizeLabel(die, true) + '</p>';
  h += '</div>';
  // Пуансон
  h += '<div class="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1.5"><p class="text-[9px] text-gray-500 dark:text-gray-400 mb-1">' + t('punchSelect') + '</p><div class="h-12 flex items-center justify-center overflow-hidden">' + (punch ? toolThumbSVG(punch, 'punch', 80, 44) : '<span class="text-[9px] text-gray-400">\u2014</span>') + '</div>';
  if (punch) h += '<p class="text-[9px] text-gray-500 dark:text-gray-400 mt-1 font-mono">' + toolSizeLabel(punch, false) + '</p>';
  h += '</div>';
  h += '</div>';
  // Углы гибов
  if (res.bendInfos && res.bendInfos.length > 0) {
    h += '<div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700"><p class="text-[9px] text-gray-500 dark:text-gray-400 mb-1">' + t('bendWord1') + ' (' + res.bendInfos.length + ')</p><div class="flex flex-wrap gap-1">';
    res.bendInfos.forEach((b, i) => {
      const interior = (Math.PI - b.bendAngle) * 180 / Math.PI;
      h += '<span class="text-[9px] px-1.5 py-0.5 rounded bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 font-mono tabular-nums border border-orange-200 dark:border-orange-800/50">' + (i + 1) + ': ' + interior.toFixed(0) + '\u00b0</span>';
    });
    h += '</div></div>';
  }
  h += '</div>';
  // Сегменты развёртки (раскрывающийся блок)
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
      let rowBg = isS ? '' : (isHem ? 'bg-blue-50/50 dark:bg-blue-950/20' : 'bg-orange-50/50 dark:bg-orange-950/20');
      if (badBend) rowBg = 'bg-red-50/70 dark:bg-red-950/40';
      h += '<tr class="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50 ' + rowBg + '"><td class="px-2 py-1 text-gray-500 font-mono">' + (i + 1) + '</td>';
      h += '<td class="px-2 py-1"><span class="' + (isS ? 'text-green-700 dark:text-green-400' : (isHem ? 'text-blue-600 dark:text-blue-400' : badBend ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-orange-600 dark:text-orange-400 font-medium')) + '">' + (isS ? t('segStraight') : (isHem ? t('hem') + (el.edge === 'bottom' ? '↓' : '↑') : (badBend ? '\u26a0 ' : '') + t('segBend'))) + '</span>';
      if (!isS && !isHem) h += '<span class="ml-1 font-mono ' + (badBend ? 'text-red-500' : 'text-orange-500') + '">' + ((el.angle * 180 / Math.PI).toFixed(0)) + '°</span>';
      h += '</td><td class="px-2 py-1 text-right font-mono tabular-nums">' + len.toFixed(2) + '</td><td class="px-2 py-1 text-right font-mono tabular-nums text-gray-500 hidden lg:table-cell">' + cum.toFixed(1) + '</td></tr>';
    });
    h += '<tfoot><tr class="border-t bg-gray-100 dark:bg-gray-700/20 font-semibold"><td colspan="2" class="px-2 py-1 text-gray-500">' + t('total') + '</td><td class="px-2 py-1 text-right font-mono tabular-nums">' + res.totalLength.toFixed(2) + '</td><td class="px-2 py-1 text-right font-mono tabular-nums text-gray-500 hidden lg:table-cell">' + res.totalLength.toFixed(1) + '</td></tr></tfoot></table></div>';
  }
  // Детали гибов
  if (res.bendInfos.length > 0) {
    h += '<div class="space-y-1 mt-2"><p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium">' + t('bendDetails') + '</p><div class="max-h-32 overflow-y-auto space-y-0.5">';
    res.bendInfos.forEach((b, i) => {
      const bad = b.feasible === false;
      h += '<div class="flex items-center justify-between text-[10px] rounded px-2 py-1 ' + (bad ? 'bg-red-50 dark:bg-red-950/30 border border-red-300/50' : 'bg-gray-50 dark:bg-gray-700/20') + '"><span class="text-gray-500">' + t('bend') + (i + 1) + (bad ? ' \u26a0' : '') + '</span><span class="' + (bad ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400') + ' font-mono tabular-nums">' + (b.bendAngle * 180 / Math.PI).toFixed(1) + '°</span><span class="text-gray-500 font-mono tabular-nums">' + t('ba') + b.bendAllowance.toFixed(2) + '</span></div>';
    });
    h += '</div></div>';
  }
  c.innerHTML = h;
  refreshIcons();
}

// ==================== МОБИЛЬНАЯ ПАНЕЛЬ РАЗВЁРТКИ ====================
function renderMobileUnfold() {
  const c = document.getElementById('mobile-unfold');
  if (!c) return;
  if (!S.unfoldResult || S.unfoldResult.totalLength <= 0) { c.innerHTML = ''; return; }
  const res = S.unfoldResult;
  const mt = METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0];
  const wt = calcWeight(res.totalLength * res.width, S.metal.thickness, S.metal.metalTypeIndex);
  const fmtW = wt < .001 ? (wt * 1000).toFixed(1) + ' ' + t('weightG') : wt < 1 ? (wt * 1000).toFixed(0) + ' ' + t('weightG') : wt.toFixed(3) + ' ' + t('weightKg');
  c.innerHTML = '<div class="flex items-center justify-between"><h2 class="text-xs font-semibold flex items-center gap-1.5"><i data-lucide="box" class="h-3.5 w-3.5 text-green-600 dark:text-green-400"></i>' + t('unfoldTitle') + ' <span class="text-[9px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full">' + res.bendInfos.length + ' ' + bendWord(res.bendInfos.length) + '</span></h2></div>' +
    '<div class="h-32 rounded-lg overflow-hidden border border-green-200 dark:border-green-800 flex flex-col" id="mobile-unfold-cv"></div>' +
    '<div class="grid grid-cols-3 gap-2 text-center"><div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-1.5"><p class="text-[9px] text-gray-500">' + t('lengthLabel') + '</p><p class="text-xs font-bold tabular-nums">' + res.totalLength.toFixed(1) + ' <span class="text-[9px] font-normal text-gray-500">' + t('mm') + '</span></p></div><div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-1.5"><p class="text-[9px] text-gray-500">' + t('widthLabel') + '</p><p class="text-xs font-bold tabular-nums">' + res.width.toFixed(1) + ' <span class="text-[9px] font-normal text-gray-500">' + t('mm') + '</span></p></div><div class="rounded-lg bg-green-50 dark:bg-green-950/30 p-1.5"><p class="text-[9px] text-green-600 dark:text-green-400">' + t('weightTitle') + '</p><p class="text-xs font-bold text-green-800 dark:text-green-200 tabular-nums">' + fmtW + '</p></div></div>' +
    '<div class="flex gap-1.5"><button onclick="showDxfOptions()" class="flex-1 text-xs h-7 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-md flex items-center justify-center gap-1"><i data-lucide="file-down" class="h-3 w-3"></i>DXF</button></div>';
  refreshIcons();
}

// ═══════════════════════════════════════════════════════════════
// UI / PARAMS — левая панель: параметры металла (ширина, тип,
// толщина, радиус, K-фактор, инструменты гибки) и настройки
// привязки. Плюс миниатюры инструментов (SVG).
// ═══════════════════════════════════════════════════════════════

// ==================== МИНИАТЮРЫ ИНСТРУМЕНТОВ (SVG) ====================
// Подпись размеров инструмента: V — ручей, S — ширина, H — высота (R для пуансона)
function toolSizeLabel(tool, isDie) {
  if (!tool) return '';
  const parts = [];
  if (isDie) {
    if (tool.vWidth && tool.vWidth > 0) parts.push('V' + tool.vWidth);
  } else {
    if (tool.radius && tool.radius > 0) parts.push('R' + tool.radius);
  }
  if (tool.swidth && tool.swidth > 0) parts.push('S' + tool.swidth);
  if (tool.height && tool.height > 0) parts.push('H' + tool.height);
  return parts.length ? '(' + parts.join(' ') + ')' : '';
}

function toolThumbSVG(tool, kind, w, h) {
  w = w || 70; h = h || 34;
  const pad = 4;
  if (!tool) return '';

  // Кастомный инструмент с профилем — рисуем его
  if (tool.isCustom && tool.profile && tool.profile.chains && tool.profile.chains.length) {
    return drawProfileSVG(tool.profile, w, h, kind === 'punch' ? '#ef4444' : '#3b82f6', pad);
  }
  // Старый формат (массив точек) — конвертируем на лету
  if (tool.isCustom && Array.isArray(tool.profile) && tool.profile.length) {
    const prof = {
      chains: [tool.profile],
      minX: Math.min(...tool.profile.map(p => p.x)),
      maxX: Math.max(...tool.profile.map(p => p.x)),
      minY: Math.min(...tool.profile.map(p => p.y)),
      maxY: Math.max(...tool.profile.map(p => p.y)),
      width: Math.max(...tool.profile.map(p => p.x)) - Math.min(...tool.profile.map(p => p.x)),
      height: Math.max(...tool.profile.map(p => p.y)) - Math.min(...tool.profile.map(p => p.y))
    };
    return drawProfileSVG(prof, w, h, kind === 'punch' ? '#ef4444' : '#3b82f6', pad);
  }

  // Стандартный инструмент — схематично
  const color = kind === 'punch' ? '#ef4444' : '#3b82f6';
  const usableW = w - pad * 2, usableH = h - pad * 2;
  if (kind === 'punch') {
    if (tool.radius) {
      return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '"><path d="M' + pad + ' ' + (h - pad) + ' L' + pad + ' ' + (h - tool.radius * 0.5) + ' A' + tool.radius * 0.5 + ' ' + tool.radius * 0.5 + ' 0 0 1 ' + (w - pad) + ' ' + (h - tool.radius * 0.5) + ' L' + (w - pad) + ' ' + (h - pad) + '" fill="none" stroke="' + color + '" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    }
  } else {
    const mid = w / 2;
    const depth = Math.min(usableH * 0.9, tool.vWidth * 0.45 || 6);
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '"><path d="M' + pad + ' ' + (h - pad) + ' L' + pad + ' ' + (h - pad - usableH * 0.5) + ' L' + mid + ' ' + (h - pad - depth) + ' L' + (w - pad) + ' ' + (h - pad - usableH * 0.5) + ' L' + (w - pad) + ' ' + (h - pad) + '" fill="none" stroke="' + color + '" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  }
  return '';
}

function drawProfileSVG(profile, w, h, color, pad) {
  // Поддержка обоих форматов: { chains } или массив точек
  let chains = null, minX = 0, minY = 0, pw = 0, ph = 0;
  if (profile && Array.isArray(profile.chains)) {
    chains = profile.chains;
    minX = profile.minX || 0; minY = profile.minY || 0;
    pw = profile.width; ph = profile.height;
  } else if (Array.isArray(profile) && profile.length) {
    chains = [profile];
    minX = Math.min(...profile.map(p => p.x));
    minY = Math.min(...profile.map(p => p.y));
    const maxX = Math.max(...profile.map(p => p.x));
    const maxY = Math.max(...profile.map(p => p.y));
    pw = maxX - minX; ph = maxY - minY;
  }
  if (!chains || pw <= 0 || ph <= 0) return '';
  pad = pad || 4;
  color = color || '#3b82f6';
  const usableW = w - pad * 2, usableH = h - pad * 2;
  const scale = Math.min(usableW / pw, usableH / ph) || 1;
  const offX = pad + (usableW - pw * scale) / 2;
  const offY = pad + (usableH - ph * scale) / 2;
  let d = '';
  chains.forEach(chain => {
    chain.forEach((p, pi) => {
      const sx = offX + (p.x - minX) * scale;
      const sy = offY + (ph - (p.y - minY)) * scale;
      d += (pi === 0 ? 'M' : 'L') + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' ';
    });
  });
  if (!d) return '';
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" style="display:block;max-width:100%"><path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></svg>';
}

// ==================== ПАРАМЕТРЫ МЕТАЛЛА ====================
function renderMetalParams() {
  const c = document.getElementById('metal-params-container');
  if (!c) return;
  const mt = METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0];
  const mtName = S.lang === 'en' ? mt.nameEn : mt.nameRu;
  let h = '';
  // Ширина заготовки — первый блок левой панели. Влияет на развёртку и вес.
  h += '<div class="space-y-1"><label class="text-xs font-medium">' + t('blankWidth') + ' <span class="text-gray-500">(mm)</span></label><input type="number" min="1" max="10000" step="1" value="' + S.metal.width + '" onchange="const v=parseFloat(this.value);if(!isNaN(v)&&v>0){setMetalWithUndo({width:v});doUnfold();renderAll()}" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2"></div>';
  // Тип металла
  h += '<div class="space-y-1"><label class="text-xs font-medium">' + t('metalType') + '</label><select onchange="selectMetalType(Number(this.value))" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 focus:outline-none focus:ring-2 focus:ring-green-500/30">';
  METAL_TYPES.forEach((m, i) => {
    h += '<option value="' + i + '"' + (i === S.metal.metalTypeIndex ? ' selected' : '') + '>' + (S.lang === 'en' ? m.nameEn : m.nameRu) + '</option>';
  });
  h += '</select></div>';
  // Толщина
  h += '<div class="space-y-1"><label class="text-xs font-medium">' + t('thickness') + ' <span class="text-gray-500">(mm)</span></label><select onchange="setMetalWithUndo({thickness:Number(this.value)})" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2">';
  THICKNESS_OPTIONS.forEach(th => {
    h += '<option value="' + th + '"' + (th === S.metal.thickness ? ' selected' : '') + '>' + th + ' mm</option>';
  });
  h += '</select></div>';
  // Радиус гиба
  h += '<div class="space-y-1"><label class="text-xs font-medium">' + t('bendRadius') + ' <span class="text-gray-500">(mm)</span></label><input type="number" min="0.1" max="100" step="0.5" value="' + S.metal.bendRadius + '" onchange="const v=parseFloat(this.value);if(!isNaN(v)&&v>0){setMetalWithUndo({bendRadius:v});doUnfold();renderAll()}" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2"></div>';
  // Матрица и пуансон — единый реестр: встроенные + свои инструменты
  const die = getDieByIndex(S.metal.dieIndex);
  const punch = getPunchByIndex(S.metal.punchIndex);
  const allDies = getAllDies();
  const allPunches = getAllPunches();
  h += '<div class="rounded-md border border-gray-200 dark:border-gray-700 p-2 space-y-2"><div class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1"><i data-lucide="hammer" class="h-3 w-3"></i>' + t('bendTool') + '</div>';
  // Чекбокс «Установить инструмент» — переключатель режимов:
  //   ВКЛ  → инструменты можно двигать (установка)
  //   ВЫКЛ → инструменты заблокированы (симуляция)
  const installOn = !S.toolLocked && S.showToolsOnCanvas;
  h += '<div class="flex items-center justify-between rounded-md ' + (installOn ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50' : 'bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700') + ' px-2 py-1.5"><label class="text-xs font-semibold flex items-center gap-1.5 cursor-pointer ' + (installOn ? 'text-amber-700 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400') + '" title="' + t('installToolHint') + '"><i data-lucide="' + (installOn ? 'unlock' : 'lock') + '" class="h-3.5 w-3.5"></i>' + t('installTool') + '</label><div class="switch' + (installOn ? ' active' : '') + '" id="install-tool-switch" onclick="var _on=(!S.toolLocked && S.showToolsOnCanvas); if(_on){S.toolLocked=true;} else {S.toolLocked=false; S.showToolsOnCanvas=true; S.simMode=true;} renderMetalParams(); if(typeof renderToolButtons===\'function\')renderToolButtons(); if(typeof drawDrawCanvas===\'function\')drawDrawCanvas();"></div></div>';
  h += '<div class="grid grid-cols-2 gap-2">';
  h += '<div class="space-y-1"><label class="text-[10px] text-gray-500">' + t('dieSelect') + '</label><select onchange="setMetalWithUndo({dieIndex:Number(this.value)});doUnfold();renderAll()" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1">';
  if (allDies.length === 0) {
    h += '<option value="0" selected>' + (S.lang === 'en' ? 'No dies yet' : 'Нет матриц — добавьте свою') + '</option>';
  }
  allDies.forEach((d, i) => {
    h += '<option value="' + i + '"' + (i === S.metal.dieIndex ? ' selected' : '') + '>' + (S.lang === 'en' ? d.nameEn : d.nameRu) + ' ' + toolSizeLabel(d, true) + (d.isCustom ? ' ★' : '') + '</option>';
  });
  h += '</select>';
  h += '<div class="mt-1 rounded border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 h-9 flex items-center justify-center overflow-hidden">' + (die ? toolThumbSVG(die, 'die', 70, 32) : '<span class="text-[9px] text-gray-400">—</span>') + '</div>';
  h += '</div>';
  h += '<div class="space-y-1"><label class="text-[10px] text-gray-500">' + t('punchSelect') + '</label><select onchange="setMetalWithUndo({punchIndex:Number(this.value)});doUnfold();renderAll()" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1">';
  if (allPunches.length === 0) {
    h += '<option value="0" selected>' + (S.lang === 'en' ? 'No punches yet' : 'Нет пуансонов — добавьте свой') + '</option>';
  }
  allPunches.forEach((p, i) => {
    h += '<option value="' + i + '"' + (i === S.metal.punchIndex ? ' selected' : '') + '>' + (S.lang === 'en' ? p.nameEn : p.nameRu) + ' ' + toolSizeLabel(p, false) + (p.isCustom ? ' ★' : '') + '</option>';
  });
  h += '</select>';
  h += '<div class="mt-1 rounded border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 h-9 flex items-center justify-center overflow-hidden">' + (punch ? toolThumbSVG(punch, 'punch', 70, 32) : '<span class="text-[9px] text-gray-400">—</span>') + '</div>';
  h += '</div>';
  h += '</div>';
  // Кнопки своих инструментов
  h += '<div class="grid grid-cols-2 gap-1.5 pt-1">';
  h += '<button onclick="showCustomDieDialog()" class="text-[9px] h-6 px-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/50">' + t('customDie') + '</button>';
  h += '<button onclick="showCustomPunchDialog()" class="text-[9px] h-6 px-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/50">' + t('customPunch') + '</button>';
  h += '</div>';
  // Чекбокс: учитывать толщину матрицы
  h += '<div class="flex items-center justify-between pt-1"><label class="text-[10px] text-gray-500 flex items-center gap-1"><i data-lucide="ruler" class="h-3 w-3"></i>' + t('checkDieHeight') + '</label><div class="switch' + (S.checkDieHeight ? ' active' : '') + '" onclick="S.checkDieHeight=!S.checkDieHeight;doUnfold();renderAll()"></div></div>';
  h += '</div>';
  // K-фактор
  h += '<div class="space-y-1"><div class="flex items-center justify-between"><label class="text-xs font-medium" title="' + t('kFactorTooltip') + '">' + t('kFactor') + '</label><span id="kf-display" class="text-xs font-mono text-gray-500 tabular-nums">' + S.metal.kFactor.toFixed(2) + '</span></div><input type="range" min="0.1" max="0.7" step="0.01" value="' + S.metal.kFactor + '" oninput="setMetalWithUndo({kFactor:Number(this.value)});document.getElementById(\'kf-display\').textContent=Number(this.value).toFixed(2)" class="w-full"></div>';
  c.innerHTML = h;
}

// ==================== НАСТРОЙКИ ПРИВЯЗКИ ====================
function renderSnapSettings() {
  const c = document.getElementById('snap-container');
  if (!c) return;
  let h = '';
  h += '<div class="flex items-center justify-between"><label class="text-xs font-medium flex items-center gap-1.5"><i data-lucide="magnet" class="h-3 w-3"></i>' + t('snapToGrid') + '</label><div class="switch' + (S.snapToGrid ? ' active' : '') + '" onclick="S.snapToGrid=!S.snapToGrid;renderAll()"></div></div>';
  if (S.snapToGrid) {
    h += '<div class="space-y-1"><div class="flex items-center justify-between"><span class="text-[10px] text-gray-500">' + t('gridStep') + '</span><span class="text-[10px] text-gray-500 font-mono tabular-nums" id="grid-step-val">' + S.gridSize + ' mm</span></div>';
    h += '<input type="range" min="1" max="50" step="1" value="' + S.gridSize + '" oninput="S.gridSize=Number(this.value);document.getElementById(\'grid-step-val\').textContent=Number(this.value)+\' mm\';drawDrawCanvas()" onchange="S.gridSize=Number(this.value);drawDrawCanvas()" class="w-full"></div>';
  }
  h += '<div class="flex items-center justify-between"><label class="text-xs font-medium flex items-center gap-1.5"><i data-lucide="compass" class="h-3 w-3"></i>' + t('angleSnap') + '</label><span class="text-[10px] font-mono text-gray-500 tabular-nums">' + (S.angleSnap === 'none' ? '\u2014' : S.angleSnap + '°') + '</span></div>';
  h += '<div class="flex gap-1">';
  ['none', '15', '30', '45', '90'].forEach(v => {
    h += '<button onclick="S.angleSnap=\'' + v + '\';renderAll()" class="flex-1 text-[10px] py-1 rounded-md border transition-all ' +
      (S.angleSnap === v ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 dark:border-gray-700 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-950/30') +
      '">' + (v === 'none' ? '\u2014' : v + '°') + '</button>';
  });
  h += '</div>';
  h += '<div class="flex items-center justify-between"><label class="text-xs font-medium flex items-center gap-1.5"><i data-lucide="hammer" class="h-3 w-3"></i>' + t('showToolsOnCanvas') + '</label><div class="switch' + (S.showToolsOnCanvas ? ' active' : '') + '" onclick="S.showToolsOnCanvas=!S.showToolsOnCanvas;if(!S.showToolsOnCanvas){S.previewBendIdx=null;S.previewFlip=false;}renderSnapSettings();drawDrawCanvas()"></div></div>';
  c.innerHTML = h;
}

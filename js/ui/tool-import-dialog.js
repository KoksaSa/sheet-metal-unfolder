// ═══════════════════════════════════════════════════════════════
// UI / TOOL-IMPORT-DIALOG — импорт своих матриц/пуансонов из DXF:
// диалог с превью профиля, параметрами и списком своих инструментов
// ═══════════════════════════════════════════════════════════════

// Временные данные импорта
let _importProfile = null;   // { chains, width, height, minX, maxX, minY, maxY, tipX? }
let _importType = 'die';     // 'die' | 'punch'
let _importFileName = '';
let _importDrawn = false;    // v5.7: профиль нарисован на холсте (не DXF)

function showCustomDieDialog() { showToolImportDialog('die'); }
function showCustomPunchDialog() { showToolImportDialog('punch'); }

function drawToolProfileSVG(profile, viewW, viewH) {
  // Рисуем все цепочки профиля, масштабируя под viewBox
  if (!profile || !profile.chains || !profile.chains.length) {
    return '<svg width="' + viewW + '" height="' + viewH + '" viewBox="0 0 ' + viewW + ' ' + viewH + '"></svg>';
  }
  const pad = 6;
  const usableW = viewW - pad * 2;
  const usableH = viewH - pad * 2;
  const scale = Math.min(usableW / profile.width, usableH / profile.height) || 1;
  const offX = pad + (usableW - profile.width * scale) / 2;
  const offY = pad + (usableH - profile.height * scale) / 2;
  let d = '';
  profile.chains.forEach(chain => {
    chain.forEach((p, pi) => {
      const sx = offX + (p.x - profile.minX) * scale;
      const sy = offY + (profile.height - (p.y - profile.minY)) * scale;
      d += (pi === 0 ? 'M' : 'L') + sx.toFixed(2) + ' ' + sy.toFixed(2) + ' ';
    });
  });
  const color = _importType === 'punch' ? '#ef4444' : '#3b82f6';
  return '<svg width="' + viewW + '" height="' + viewH + '" viewBox="0 0 ' + viewW + ' ' + viewH + '" style="display:block">' +
    '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '</svg>';
}

// v5.7: автозаполнение полей диалога из профиля (общее для DXF-импорта
// и нарисованного на холсте контура). Возвращает имя по умолчанию.
// isDrawn: контур нарисован на холсте — эвристику радиуса «по ширине»
// (из DXF-пути) не применяем, ставим стандартный R1.
function fillToolImportFromProfile(profile, drawnHint, isDrawn) {
  const prev = document.getElementById('tool-preview');
  if (prev) prev.innerHTML = drawToolProfileSVG(profile, 280, 100);
  const dims = document.getElementById('tool-dims');
  if (dims) {
    dims.textContent = t('widthShort') + ': ' + profile.width.toFixed(1) + ' ' + t('mm') +
      '   ' + t('heightShort') + ': ' + profile.height.toFixed(1) + ' ' + t('mm') +
      (drawnHint ? '   · ' + drawnHint : '');
  }
  const isDie = _importType === 'die';
  const swEl = document.getElementById('tool-swidth');
  if (swEl && !swEl.value) swEl.value = Math.max(1, Math.round(profile.width));
  const htEl = document.getElementById('tool-height');
  if (htEl && !htEl.value) htEl.value = Math.max(1, Math.round(profile.height));
  if (isDie) {
    const vwEl = document.getElementById('tool-vwidth');
    if (vwEl && !vwEl.value) {
      const vEst = (typeof estimateDieVWidth === 'function') ? estimateDieVWidth(profile) : null;
      if (vEst) vwEl.value = Math.max(1, Math.round(vEst));
    }
  } else {
    const rdEl = document.getElementById('tool-radius');
    if (rdEl && !rdEl.value) rdEl.value = isDrawn ? 1 : Math.max(0.5, Math.round(profile.width * 5) / 10);
  }
  // Имя по умолчанию: порядковый номер своего инструмента
  const tools = loadCustomTools();
  const n = (isDie ? tools.customDies.length : tools.customPunches.length) + 1;
  return isDie
    ? (S.lang === 'ru' ? 'Матрица ' + n : 'Die ' + n)
    : (S.lang === 'ru' ? 'Пуансон ' + n : 'Punch ' + n);
}

function showToolImportDialog(type, presetProfile) {
  _importType = type;
  _importProfile = (presetProfile && presetProfile.chains && presetProfile.chains.length) ? presetProfile : null;
  _importDrawn = !!_importProfile;
  _importFileName = '';
  const tools = loadCustomTools();
  const isDie = type === 'die';
  const title = isDie ? t('customDie') : t('customPunch');
  const list = isDie ? tools.customDies : tools.customPunches;
  const listLabel = isDie ? t('customDiesList') : t('customPunchesList');

  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><i data-lucide="hammer" class="h-4 w-4 text-blue-600"></i>' + title + '</h3>';
  h += '<div class="space-y-3">';

  // Имя
  h += '<div><label class="text-xs font-medium">' + t('customDieName') + '</label>';
  h += '<input type="text" id="tool-name" placeholder="V-custom" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 mt-1"></div>';

  // Импорт файла DXF
  h += '<div class="rounded-md border border-dashed border-gray-300 dark:border-gray-600 p-2"><div class="text-[10px] font-medium text-gray-500 mb-1">' + t('dxfImport') + '</div>';
  h += '<input type="file" accept=".dxf" id="tool-dxf-file" onchange="importToolDXF(this)" class="text-[10px] w-full text-gray-600 dark:text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer">';
  h += '<div id="tool-dxf-info" class="mt-1 text-[10px] text-gray-400">' + t('dxfNoFile') + '</div>';
  h += '</div>';

  // Превью профиля
  h += '<div><label class="text-xs font-medium">' + t('toolPreview') + '</label>';
  h += '<div id="tool-preview" class="mt-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-28 flex items-center justify-center overflow-hidden"></div>';
  h += '<div id="tool-dims" class="mt-1 text-[10px] font-mono text-gray-500">\u2014</div>';
  h += '</div>';

  // Параметры инструмента: V — ручей, S — ширина, H — высота, макс. угол
  h += '<div class="rounded-md border border-gray-200 dark:border-gray-700 p-2"><div class="text-[10px] font-semibold text-gray-500 mb-1.5">' + t('toolParams') + '</div>';
  h += '<div class="grid grid-cols-2 gap-2">';
  if (isDie) {
    h += '<div><label class="text-[10px] text-gray-500">' + t('dieVLabel') + '</label><input type="number" id="tool-vwidth" min="1" step="0.5" placeholder="8" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 mt-0.5"></div>';
  } else {
    h += '<div><label class="text-[10px] text-gray-500">' + t('punchRLabel') + '</label><input type="number" id="tool-radius" min="0.1" step="0.1" placeholder="1.5" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 mt-0.5"></div>';
  }
  h += '<div><label class="text-[10px] text-gray-500">' + t('toolSLabel') + '</label><input type="number" id="tool-swidth" min="1" step="0.5" placeholder="40" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 mt-0.5"></div>';
  h += '<div><label class="text-[10px] text-gray-500">' + t('toolHLabel') + '</label><input type="number" id="tool-height" min="1" step="0.5" placeholder="30" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 mt-0.5"></div>';
  h += '<div><label class="text-[10px] text-gray-500">' + t('toolMaxAngleLabel') + '</label><input type="number" id="tool-maxangle" min="1" max="180" step="1" value="' + (isDie ? '140' : '90') + '" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 mt-0.5"></div>';
  h += '</div></div>';

  // Список существующих
  if (list.length > 0) {
    h += '<div class="pt-3 border-t border-gray-200 dark:border-gray-700"><p class="text-[10px] font-semibold text-gray-500 mb-2">' + listLabel + '</p>';
    list.forEach(tool => {
      h += '<div class="flex items-center justify-between text-[10px] py-1 border-b border-gray-100 dark:border-gray-800">';
      h += '<div class="flex items-center gap-2 min-w-0">';
      h += '<div class="w-10 h-8 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700 shrink-0 overflow-hidden">' + drawProfileSVG(tool.profile, 40, 32, isDie ? '#3b82f6' : '#ef4444', 2) + '</div>';
      h += '<div class="min-w-0"><div class="font-mono truncate">' + tool.nameRu + '</div><div class="text-[9px] text-gray-400 font-mono">' + toolSizeLabel(tool, isDie) + '</div></div>';
      h += '</div>';
      h += '<button onclick="' + (isDie ? 'deleteCustomDie' : 'deleteCustomPunch') + '(\'' + tool.id + '\');showCustom' + (isDie ? 'Die' : 'Punch') + 'Dialog();" class="text-red-500 hover:text-red-700 px-1 text-sm leading-none">×</button>';
      h += '</div>';
    });
    h += '</div>';
  }

  // Закреплённый футер с кнопками
  h += '<div class="sticky bottom-0 -mx-5 -mb-5 px-5 py-3 mt-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2 rounded-b-xl">';
  h += '<button onclick="closeDialog()" class="text-xs h-8 px-3 border border-gray-200 dark:border-gray-700 rounded-md">' + t('cancel') + '</button>';
  h += '<button onclick="applyCustomTool()" class="text-xs h-8 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">' + t('save') + '</button></div>';

  h += '</div>';
  showDialog(h);
  refreshIcons();
  // Превью: нарисованный на холсте контур (v5.7) или пустое поле
  const prev = document.getElementById('tool-preview');
  if (prev) prev.innerHTML = drawToolProfileSVG(_importProfile, 280, 100);
  if (_importProfile) {
    // v5.7: контур нарисован на холсте — превью + автозаполнение + имя
    const defName = fillToolImportFromProfile(_importProfile, t('toolDrawnOnCanvas'), true);
    const nameEl = document.getElementById('tool-name');
    if (nameEl && !nameEl.value.trim()) nameEl.value = defName;
    const info = document.getElementById('tool-dxf-info');
    if (info) info.textContent = t('toolDrawnOnCanvas');
  }
  setTimeout(() => { const el = document.getElementById('tool-name'); if (el) el.focus(); }, 100);
}

async function importToolDXF(input) {
  if (!input || !input.files || !input.files.length) return;
  const file = input.files[0];
  _importFileName = file.name.replace(/\.dxf$/i, '');
  try {
    const text = await file.text();
    const profile = profileFromDXF(text);
    if (profile && profile.chains && profile.chains.length) {
      _importProfile = profile;
      const prev = document.getElementById('tool-preview');
      if (prev) prev.innerHTML = drawToolProfileSVG(profile, 280, 100);
      const dims = document.getElementById('tool-dims');
      if (dims) dims.textContent =
        t('widthShort') + ': ' + profile.width.toFixed(1) + ' ' + t('mm') +
        '   ' + t('heightShort') + ': ' + profile.height.toFixed(1) + ' ' + t('mm');
      const info = document.getElementById('tool-dxf-info');
      if (info) info.textContent = '✓ ' + _importFileName;
      // Подставляем имя по умолчанию
      const nameEl = document.getElementById('tool-name');
      if (nameEl && !nameEl.value.trim()) {
        nameEl.value = _importFileName.replace(/[_\-\s]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      }
      // Автозаполнение параметров из габаритов DXF:
      // S — ширина, H — высота, V — автоопределение ручья (для матрицы)
      const swEl = document.getElementById('tool-swidth');
      if (swEl && !swEl.value) swEl.value = Math.max(1, Math.round(profile.width));
      const htEl = document.getElementById('tool-height');
      if (htEl && !htEl.value) htEl.value = Math.max(1, Math.round(profile.height));
      const vwEl = document.getElementById('tool-vwidth');
      if (vwEl && !vwEl.value) {
        const vEst = estimateDieVWidth(profile);
        if (vEst) vwEl.value = Math.max(1, Math.round(vEst));
      }
      const rdEl = document.getElementById('tool-radius');
      if (rdEl && !rdEl.value) rdEl.value = Math.max(0.5, Math.round(profile.width * 5) / 10);
      return;
    }
    const info = document.getElementById('tool-dxf-info');
    if (info) info.textContent = t('dxfNoContour');
    toast(t('dxfNoContour'), 'error');
  } catch (err) {
    console.error('DXF import error:', err);
    const info = document.getElementById('tool-dxf-info');
    if (info) info.textContent = t('dxfError') + ': ' + err.message;
    toast(t('dxfError'), 'error');
  }
}

function applyCustomTool() {
  try {
    const nameRu = (document.getElementById('tool-name').value || '').trim();
    if (!_importProfile) { toast(t('dxfPleaseImport'), 'error'); return; }
    const profile = _importProfile;
    const wasDrawn = _importDrawn;
    // Читаем параметры из полей ввода (автозаполняются из DXF, редактируемы)
    const numVal = (id, fallback) => {
      const el = document.getElementById(id);
      if (!el) return fallback;
      const v = parseFloat(el.value);
      return isNaN(v) || v <= 0 ? fallback : v;
    };
    if (_importType === 'die') {
      const vWidth = numVal('tool-vwidth', estimateDieVWidth(profile) || Math.round(profile.width));
      const swidth = numVal('tool-swidth', Math.round(profile.width));
      const height = numVal('tool-height', Math.round(profile.height));
      const maxAngle = numVal('tool-maxangle', 140);
      addCustomDie({
        nameRu: nameRu || ('V' + vWidth),
        nameEn: nameRu || ('V' + vWidth),
        vWidth: vWidth,
        swidth: swidth,
        height: height,
        maxAngle: maxAngle,
        profile
      });
      // Выбираем только что добавленную матрицу
      S.metal.dieIndex = DIES.length + (loadCustomTools().customDies.length - 1);
    } else {
      const swidth = numVal('tool-swidth', Math.round(profile.width));
      const height = numVal('tool-height', Math.round(profile.height));
      const radius = numVal('tool-radius', Math.max(0.5, Math.round(profile.width * 5) / 10));
      const maxAngle = numVal('tool-maxangle', 90);
      addCustomPunch({
        nameRu: nameRu || ('R' + radius),
        nameEn: nameRu || ('R' + radius),
        swidth: swidth,
        height: height,
        radius: radius,
        maxAngle: maxAngle,
        profile
      });
      // Выбираем только что добавленный пуансон
      S.metal.punchIndex = PUNCHES.length + (loadCustomTools().customPunches.length - 1);
    }
    closeDialog();
    // v5.7: НОВЫЙ инструмент (нарисованный или из DXF) появляется на
    // холсте в координатах (0,0) ДО его установки — смещение прежнего
    // не наследуется; сразу включаем режим «Установить инструмент»,
    // чтобы новый инструмент было видно и можно было перетащить.
    if (typeof resetToolOffsets === 'function') resetToolOffsets(_importType);
    S.showToolsOnCanvas = true;
    S.simMode = true;
    S.toolLocked = false;
    doUnfold();
    renderAll();
    if (typeof toast === 'function') toast(t(wasDrawn ? 'toolDrawDone' : 'toolAddDone'));
  } catch (err) {
    console.error('applyCustomTool error:', err);
    toast(t('importError') + ': ' + err.message, 'error');
  }
}

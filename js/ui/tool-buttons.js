// ═══════════════════════════════════════════════════════════════
// UI / TOOL-BUTTONS — плитки инструментов (рисование/выбор/ластик/
// измерение/кайма) + кнопки управления симуляцией (перевороты,
// лицевая сторона, сброс, 3D-симуляция)
// ═══════════════════════════════════════════════════════════════

function renderToolButtons() {
  const c = document.getElementById('tool-buttons');
  if (!c) return;
  const tools = [
    { mode: 'draw', icon: 'pencil', key: 'D', label: 'draw' },
    { mode: 'select', icon: 'mouse-pointer-2', key: 'V', label: 'select' },
    { mode: 'erase', icon: 'eraser', key: 'E', label: 'erase' },
    { mode: 'measure', icon: 'ruler', key: 'M', label: 'measure' },
    { mode: 'hem', icon: 'git-branch', key: 'H', label: 'hemTool' }
  ];
  c.className = 'grid grid-cols-3 gap-1';
  const btnBase = 'w-full h-12 text-sm rounded-md flex items-center justify-center border transition-all gap-2';
  const btnActive = 'bg-green-600 hover:bg-green-700 text-white border-green-600';
  const btnInactive = 'border-gray-200 dark:border-gray-700 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950/30';
  c.innerHTML = tools.map(tl => {
    const active = S.toolMode === tl.mode;
    return '<button onclick="S.toolMode=\'' + tl.mode + '\';S.drawFromIdx=null;renderAll()" class="' + btnBase + ' ' + (active ? btnActive : btnInactive) + '"><i data-lucide="' + tl.icon + '" class="h-5 w-5 shrink-0"></i><span class="truncate">' + t(tl.label) + '</span></button>';
  }).join('');

  // Кнопка-тумблер «Симуляция гибки» (включает режим симуляции).
  // Активное состояние из S.showToolsOnCanvas.
  const simBtn = document.createElement('button');
  const simActive = !!S.showToolsOnCanvas;
  simBtn.className = btnBase + ' ' + (simActive
    ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600 ring-2 ring-purple-300 dark:ring-purple-500'
    : 'border-dashed border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30');
  simBtn.innerHTML = '<i data-lucide="sparkles" class="h-5 w-5 shrink-0"></i><span class="truncate">' + t('simulate') + (simActive ? ' • ' + t('simOn') : ' • ' + t('simOff')) + '</span>';
  simBtn.title = simActive ? t('simOn') : t('simOff');
  simBtn.onclick = function () {
    S.showToolsOnCanvas = !S.showToolsOnCanvas;
    S.simMode = S.showToolsOnCanvas;
    if (S.showToolsOnCanvas) {
      S.toolMode = 'select';
      // При входе в симуляцию «Установить инструмент» по умолчанию ВЫКЛ:
      // инструменты видны, но заблокированы. Пользователь должен явно
      // включить чек «Установить инструмент», чтобы двигать пуансон/матрицу.
      S.toolLocked = true;
      // v4.4 FIX: если профиль изменился с момента накопления гибов
      // (очищён и перерисован / точки отредактированы) — старая
      // последовательность бессмысленна, сбрасываем: симуляция всегда
      // начинается с плоского листа для НЫНЕШНЕГО профиля.
      const sigNow = (typeof simProfileSignature === 'function') ? simProfileSignature() : null;
      if ((S.simBentMarkers || []).length > 0 && S.simProfileSig && sigNow !== S.simProfileSig) {
        S.simBentMarkers = [];
        S.bendStepMeta = {};
        S.simFlipX = false;
        S.simFlipY = false;
        S.simFaceSide = 'up';
        S.selectedBendIndex = undefined;
      }
      S.simProfileSig = sigNow;
      // Заготовка встаёт первым маркером гибки в (0,0): ставим
      // selectedBendIndex=0, перерисовываем, затем сбрасываем выбор —
      // иначе 1-й клик по маркеру 0 сразу бы сгибал.
      S.simBentMarkers = S.simBentMarkers || [];
      S.selectedBendIndex = 0;
      if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
      S.selectedBendIndex = undefined;
      if (S.bendPointX === 0 && S.bendPointY === 0) {
        S.bendPointX = S.punchOffsetX || 0;
        S.bendPointY = S.punchOffsetY || 0;
        localStorage.setItem('bendPointX', S.bendPointX);
        localStorage.setItem('bendPointY', S.bendPointY);
      }
      S.previewBendIdx = null;
      S.previewFlip = false;
    } else {
      if (typeof stopAnimation === 'function') stopAnimation();
      // НЕ сбрасываем simBentMarkers при выходе — последовательность
      // гибки сохраняется для чертежа «Последовательность гибки».
      S.previewBendIdx = null;
      S.previewFlip = false;
      S.selectedBendIndex = undefined;
      S.simFlipX = false;
      S.simFlipY = false;
      // Лицевая сторона сбрасывается в 'up' (кнопка неактивна при след. входе)
      S.simFaceSide = 'up';
      // При выходе из симуляции разблокируем инструменты
      S.toolLocked = false;
    }
    renderAll();
  };
  c.appendChild(simBtn);

  // Кнопки управления симуляцией (только в режиме симуляции, ручной режим)
  if (S.showToolsOnCanvas && S.unfoldResult && S.unfoldResult.bendInfos && S.unfoldResult.bendInfos.length > 0) {
    const bentCount = (S.simBentMarkers || []).length;

    // ↕Y — переворот по Y (верх↔низ)
    const flipYBtn = document.createElement('button');
    flipYBtn.id = 'btn-sim-flipy';
    flipYBtn.className = btnBase + ' border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30';
    flipYBtn.innerHTML = '<i data-lucide="flip-vertical" class="h-5 w-5 shrink-0"></i><span class="truncate">↕Y</span>';
    flipYBtn.title = S.lang === 'ru' ? 'Перевернуть по Y (отразить верх/низ)' : 'Flip by Y axis';
    flipYBtn.onclick = function () {
      S.simFlipY = !S.simFlipY;
      if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
    };
    c.appendChild(flipYBtn);

    // ↔X — переворот по X (лево↔право)
    const flipXBtn = document.createElement('button');
    flipXBtn.id = 'btn-sim-flipx';
    flipXBtn.className = btnBase + ' border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30';
    flipXBtn.innerHTML = '<i data-lucide="flip-horizontal" class="h-5 w-5 shrink-0"></i><span class="truncate">↔X</span>';
    flipXBtn.title = S.lang === 'ru' ? 'Перевернуть по X (отразить лево/право)' : 'Flip by X axis';
    flipXBtn.onclick = function () {
      S.simFlipX = !S.simFlipX;
      if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
    };
    c.appendChild(flipXBtn);

    // «Лицевая» — инвертирует сторону лицевой линии (синяя полоска)
    const faceBtn = document.createElement('button');
    faceBtn.id = 'btn-sim-face';
    const faceActive = (S.simFaceSide || 'up') === 'down';
    faceBtn.className = btnBase + ' ' + (faceActive
      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
      : 'border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30');
    faceBtn.innerHTML = '<i data-lucide="paintbrush" class="h-5 w-5 shrink-0"></i><span class="truncate">' + t('faceSide') + '</span>';
    faceBtn.title = S.lang === 'ru' ? 'Развернуть лицевую сторону заготовки' : 'Flip face side';
    faceBtn.onclick = function () {
      S.simFaceSide = ((S.simFaceSide || 'up') === 'up') ? 'down' : 'up';
      if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
      // Если 3D-симуляция открыта — перерисовать её
      if (sim3dModalOpen && typeof draw3DSimulation === 'function') draw3DSimulation();
      // Обновить кнопку (активное состояние) без полного renderAll
      const cur = document.getElementById('btn-sim-face');
      if (cur) {
        const on = (S.simFaceSide === 'down');
        cur.className = btnBase + ' ' + (on
          ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
          : 'border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30');
      }
    };
    c.appendChild(faceBtn);

    // ↺ «Сброс» — очистить все согнутые гибы
    if (bentCount > 0) {
      const resetBtn = document.createElement('button');
      resetBtn.id = 'btn-sim-reset';
      resetBtn.className = btnBase + ' border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30';
      resetBtn.innerHTML = '<i data-lucide="rotate-ccw" class="h-5 w-5 shrink-0"></i><span class="truncate">' + t('resetBends') + '</span>';
      resetBtn.onclick = function () {
        if (typeof resetAllBends === 'function') resetAllBends();
      };
      c.appendChild(resetBtn);
    }

    // «3D Сим» — 3D-симуляция (матрица, пуансон, упор, контур — вращается)
    const sim3DBtn = document.createElement('button');
    sim3DBtn.id = 'btn-sim-3d';
    sim3DBtn.className = btnBase + ' border-purple-600 bg-purple-600 hover:bg-purple-700 text-white border-purple-600';
    sim3DBtn.innerHTML = '<i data-lucide="box" class="h-5 w-5 shrink-0"></i><span class="truncate">3D ' + t('simulate') + '</span>';
    sim3DBtn.title = S.lang === 'ru' ? '3D симуляция гибки (матрица, пуансон, упор, контур — можно вращать)' : '3D bending simulation (rotatable)';
    sim3DBtn.onclick = function () { if (typeof toggle3DSimModal === 'function') toggle3DSimModal(); };
    c.appendChild(sim3DBtn);
  }
  // Перерисовываем иконки Lucide для добавленных плейсхолдеров.
  refreshIcons();
}

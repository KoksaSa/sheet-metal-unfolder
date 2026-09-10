// ═══════════════════════════════════════════════════════════════
// APP — инициализация, горячие клавиши, авто-сохранение
//
// FIX v4.1: Ctrl+Shift+Z / Ctrl+Shift+Y были перепутаны местами
// (Shift+Z делал redoMetal вместо undoMetal). Теперь:
//   Ctrl+Z          — отмена (точки)
//   Ctrl+Y          — повтор (точки)
//   Ctrl+Shift+Z    — отмена (параметры металла)
//   Ctrl+Shift+Y    — повтор (параметры металла)
// ═══════════════════════════════════════════════════════════════

// ==================== ГОРЯЧИЕ КЛАВИШИ ====================
document.addEventListener('keydown', e => {
  // Диалог каймы: Enter — применить, Escape — отмена
  if (S.hemEditing && document.getElementById('dialog-overlay') && !document.getElementById('dialog-overlay').classList.contains('hidden')) {
    if (e.key === 'Enter') { e.preventDefault(); applyHemFromDialog(); return; }
    if (e.key === 'Escape') { e.preventDefault(); cancelHem(); return; }
    return; // Остальные хоткеи не обрабатываем пока открыт диалог каймы
  }

  const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA';
  const mod = e.ctrlKey || e.metaKey;

  // v5.7: рисование своего инструмента на холсте — горячие клавиши
  // (Enter — завершить, Backspace — убрать точку, Esc — отмена ниже)
  if (S.toolMode === 'tooldraw' && S.toolDraw) {
    if (e.key === 'Enter') { e.preventDefault(); finishToolDraw(); return; }
    if (e.key === 'Backspace') { e.preventDefault(); undoToolDrawPoint(); return; }
  }

  // Undo / Redo работают и в полях ввода (как в браузере), и вне их
  if (mod && e.code === 'KeyZ') {
    e.preventDefault();
    // v5.7: в режиме рисования инструмента Ctrl+Z убирает точку ЧЕРНОВИКА
    // (а не точку профиля детали)
    if (S.toolMode === 'tooldraw' && S.toolDraw) { undoToolDrawPoint(); return; }
    if (e.shiftKey) { undoMetal(); renderAll(); }
    else doUndo();
    return;
  }
  if (mod && e.code === 'KeyY') {
    e.preventDefault();
    if (e.shiftKey) { redoMetal(); renderAll(); }
    else doRedo();
    return;
  }

  if (isInput) return;
  if (mod && e.code === 'KeyS') {
    e.preventDefault();
    saveProject();
    return;
  }

  // Enter — ручная развёртка (полезно при выключенной авто-развёртке)
  if (e.key === 'Enter' && !S.autoUnfold) {
    e.preventDefault();
    doUnfold();
    renderUnfoldInfo();
    drawUnfoldCanvas();
    draw3DPreview();
    renderHeader();
    return;
  }

  const key = e.key.toLowerCase();
  switch (key) {
    // v5.7: смена режима через setToolMode — сбрасывает черновик
    // инструмента при выходе из рисования инструмента
    case 'd': setToolMode('draw'); break;
    case 'v': setToolMode('select'); break;
    case 'e': setToolMode('erase'); break;
    case 'h': setToolMode('hem'); break;
    case 'm': setToolMode('measure'); measureStart = null; measureEnd = null; measureStep = 0; renderAll(); break;
    case 'f': S.viewport = { offsetX: canvasW / 2, offsetY: canvasH / 2, scale: 3 }; drawDrawCanvas(); break;
    // Стрелки: в режиме установки — двигают АКТИВНЫЙ инструмент
    // (пуансон ИЛИ матрицу — по последнему клику; по умолчанию пуансон;
    // Shift — шаг 5 мм). При заблокированных инструментах (симуляция) —
    // перевороты заготовки.
    // ВАЖНО: используем `key` (уже toLowerCase), а не `e.key` (="ArrowLeft"),
    // иначе сравнение e.key === 'arrowleft' всегда false и шаг всегда +1.
    case 'arrowleft':
    case 'arrowright':
      if (S.showToolsOnCanvas && S.toolMode !== 'tooldraw') {
        e.preventDefault();
        if (S.toolLocked) {
          S.simFlipX = !S.simFlipX;
        } else if (typeof moveActiveTool === 'function') {
          moveActiveTool((key === 'arrowleft' ? -1 : 1) * (e.shiftKey ? 5 : 1), 0);
        }
        if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
      }
      break;
    case 'arrowup':
    case 'arrowdown':
      if (S.showToolsOnCanvas && S.toolMode !== 'tooldraw') {
        e.preventDefault();
        if (S.toolLocked) {
          S.simFlipY = !S.simFlipY;
        } else if (typeof moveActiveTool === 'function') {
          moveActiveTool(0, (key === 'arrowup' ? 1 : -1) * (e.shiftKey ? 5 : 1));
        }
        if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
      }
      break;
    case 'escape':
      // v5.7: Esc в режиме рисования инструмента — отмена рисования
      if (S.toolMode === 'tooldraw' && S.toolDraw) {
        e.preventDefault();
        cancelToolDraw();
        break;
      }
      // Сброс предпросмотра гиба
      if (S.previewBendIdx !== null) {
        e.preventDefault();
        S.previewBendIdx = null;
        drawDrawCanvas();
        return;
      }
      // Сброс активной точки рисования
      if (S.toolMode === 'draw' && S.drawFromIdx !== null) {
        e.preventDefault();
        S.drawFromIdx = null;
        drawDrawCanvas();
      } else if (S.toolMode !== 'select') {
        // Esc переключает на инструмент «Выбор»
        e.preventDefault();
        S.toolMode = 'select';
        S.drawFromIdx = null;
        renderAll();
      }
      break;
  }
});

// ==================== RESIZE ====================
const resizeObs = new ResizeObserver(() => {
  resizeDrawCanvas();
  resizeUnfoldCanvas();
  resizeView3d();
  drawDrawCanvas();
  drawUnfoldCanvas();
  draw3DPreview();
});

// ==================== INIT ====================
function init() {
  applyTheme();

  // FIX v4.1: сначала узнаём РЕАЛЬНЫЕ размеры холстов, потом ставим
  // viewport в центр (раньше использовались значения по умолчанию
  // 400×300 — центр вида был смещён).
  resizeDrawCanvas();
  resizeUnfoldCanvas();
  resizeView3d();
  S.viewport = { offsetX: canvasW / 2, offsetY: canvasH / 2, scale: 3 };

  // Force hide dialog on load (defensive)
  const overlay = document.getElementById('dialog-overlay');
  if (overlay) overlay.style.display = 'none';

  // Start resize observer after canvases exist
  const canvasCont = document.getElementById('canvas-container');
  const unfoldCont = document.getElementById('unfold-container');
  if (canvasCont) resizeObs.observe(canvasCont);
  if (unfoldCont) resizeObs.observe(unfoldCont);

  // Try load saved project
  try {
    const raw = localStorage.getItem('sheet-metal-project');
    if (raw) {
      const d = JSON.parse(raw);
      if (d.points && d.metal) {
        S.points = d.points;
        Object.assign(S.metal, d.metal);
        // Ensure new fields exist (compatibility with old saves)
        if (S.metal.dieIndex === undefined) S.metal.dieIndex = 0;
        if (S.metal.punchIndex === undefined) S.metal.punchIndex = 0;
        // v5.5: список встроенных пуансонов сокращён до одного —
        // старый сохранённый индекс (напр. «гусиная шея» из v5.4)
        // нормализуем в допустимый диапазон
        if (typeof normalizePunchIndex === 'function') normalizePunchIndex();
        if (S.metal.metalTypeIndex === undefined || !METAL_TYPES[S.metal.metalTypeIndex]) S.metal.metalTypeIndex = 0;
        if (S.checkDieHeight === undefined) S.checkDieHeight = true;
        if (d.hems) S.hems = d.hems;
        else S.hems = [];
        maybeAutoUnfold();
      }
    }
  } catch (err) {
    console.error('Auto-load error:', err);
  }

  // Загружаем позиции инструментов на холсте
  if (typeof loadToolPositions === 'function') loadToolPositions();

  renderAll();

  // Auto-save debounce
  setInterval(() => {
    try {
      if (S.points.length > 0) {
        localStorage.setItem('sheet-metal-project', JSON.stringify({ points: S.points, metal: S.metal, hems: S.hems }));
      } else {
        localStorage.removeItem('sheet-metal-project');
      }
      if (typeof saveToolPositions === 'function') saveToolPositions();
    } catch (err) {
      console.error('Auto-save error:', err);
    }
  }, 2000);
}

// v4.8: «Загрузить деталь» — открывает STEP-инструмент «Развёртка крестом»
// (step-v-gib.html — 3D-деталь/STEP → развёртка). Новая вкладка: текущий
// проект калькулятора не теряется; opener обрезаем для безопасности.
function openStepTool() {
  const w = window.open('step-v-gib.html', '_blank');
  if (w) { try { w.opener = null; } catch (e) { /* noopener best-effort */ } }
  else if (typeof toast === 'function') toast(t('popupBlocked'));
}
window.openStepTool = openStepTool;

// v5.0: «Калькулятор Y гиба» — эмпирический подбор положения Y на станке
// для угла 90° (y-calculator.html, база испытаний в localStorage).
// Открывается в новой вкладке с предзаполненными параметрами текущего
// металла/толщины/матрицы/ширины заготовки.
function openYCalculator() {
  let material = '';
  try {
    const mt = METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0];
    material = S.lang === 'en' ? mt.nameEn : mt.nameRu;
  } catch (e) {}
  let v = 10;
  try {
    const die = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
    if (die && die.vWidth) v = die.vWidth;
  } catch (e) {}
  const q = 'material=' + encodeURIComponent(material) +
    '&thickness=' + encodeURIComponent(S.metal.thickness) +
    '&v=' + encodeURIComponent(v) +
    '&length=' + encodeURIComponent(S.metal.width) +
    '&angle=90';
  const w = window.open('y-calculator.html?' + q, '_blank');
  if (w) { try { w.opener = null; } catch (e) { /* noopener best-effort */ } }
  else if (typeof toast === 'function') toast(t('popupBlocked'));
}
window.openYCalculator = openYCalculator;

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

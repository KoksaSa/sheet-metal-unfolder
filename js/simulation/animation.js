// ═══════════════════════════════════════════════════════════════
// SIMULATION / АНИМАЦИЯ — сгибание/разгибание отдельного гиба,
// последовательная гибка всех гибов, сброс состояния
// ═══════════════════════════════════════════════════════════════

function _simClearTimers() {
  if (S.simSequenceRAF) { cancelAnimationFrame(S.simSequenceRAF); S.simSequenceRAF = null; }
  if (S.simSequenceTimer) { clearTimeout(S.simSequenceTimer); S.simSequenceTimer = null; }
}

/**
 * Запустить анимацию сгибания гиба.
 * По завершении гиб добавляется в simBentMarkers (накопительный эффект).
 * Перед анимацией записывает метаданные шага (позиция упора, ориентация
 * лицевой стороны, перевороты) для чертежа «Последовательность гибки».
 */
function startBendAnimation(bendIdx, onDone) {
  if (!S.unfoldResult || !S.unfoldResult.bendInfos || bendIdx < 0 || bendIdx >= S.unfoldResult.bendInfos.length) {
    if (onDone) onDone();
    return;
  }
  if ((S.simBentMarkers || []).includes(bendIdx)) {
    if (onDone) onDone();
    return;
  }
  const b = S.unfoldResult.bendInfos[bendIdx];
  const dir = bendDirection(b);

  // Записать ПОЗИЦИЮ УПОРА ДО гибки: профиль ПОСЛЕ всех ранее выполненных
  // гибов (без текущего), позиционированный по текущему гибу, и точка
  // касания упора с контуром. Плюс ориентация лицевой стороны.
  (function recordPreBendMeta() {
    // СНАЧАЛА записываем метаданные шага (v4.2): тогда расчёт профиля
    // ДО гиба увидит переворот ТЕКУЩЕГО гиба — переход XOR между гибами
    // применится, а дельта шага 6 станет нулевой. Раньше meta писалась
    // ПОСЛЕ расчёта: переворот текущего гиба не учитывался, и упор со
    // stopperDist ставились по НЕперевёрнутой заготовке.
    // Ориентация лицевой стороны: faceOrient — РЕКОМЕНДАЦИЯ оператору
    // (исходная сторона лица + знак гиба детали), не зависит от текущего
    // переворота. Гиб вверх (dir+1) и лицо сверху → «вверх».
    let effFaceUp = (S.simFaceSide || 'up') === 'up';
    const faceOrient = (dir > 0) === effFaceUp ? 'up' : 'down';
    S.bendStepMeta = S.bendStepMeta || {};
    S.bendStepMeta[bendIdx] = {
      stopperDist: null, // заполняется ниже, после расчёта профиля
      faceOrient: faceOrient,
      // v4.5: сторона лицевой стороны НА МОМЕНТ гибки — для исторического
      // показа в 3D-симуляции (каждый шаг показывает своё состояние,
      // «Лицевая» могла переключаться между гибами). Чертёж
      // последовательности по-прежнему использует faceOrient
      // (рекомендация оператору).
      faceSide: (S.simFaceSide || 'up'),
      // Перевороты на момент гибки — для чертежа последовательности
      // и для накопительной геометрии (см. simulation/profile.js)
      flipX: !!S.simFlipX,
      flipY: !!S.simFlipY
    };
    const savedSel = S.selectedBendIndex, savedBent = S.simBentMarkers;
    S.selectedBendIndex = bendIdx;
    S.simBentMarkers = (savedBent || []).slice(); // уже согнутые (без текущего)
    const prof = computeAccumulatedProfile({ bendIdx: bendIdx, progress: 0, animating: false });
    S.selectedBendIndex = savedSel; S.simBentMarkers = savedBent;
    // v4.7: касание упора — по НАРУЖНОЙ поверхности заготовки (полоса
    // толщиной T вокруг средней линии, клип по высоте упора 8 мм):
    // для вертикальных/наклонных полок расстояние зависит от толщины
    // металла (+T/2), для торца плоской полки — нет (как на станке).
    // Раньше бралась средняя линия — при изменении толщины расстояние
    // НЕ менялось (проверено: T=0.8 и T=5 давали одинаковые числа).
    const touchX = (typeof stopperTouchXThick === 'function') ? stopperTouchXThick(prof) : null;
    S.bendStepMeta[bendIdx].stopperDist = touchX !== null ? Math.abs(touchX) : null;
  })();

  _simClearTimers();
  S.simAnimRunning = true;
  S.simAnimBendIdx = bendIdx;
  S.simAnimDirection = 1;
  S.simAnimProgress = 0;
  S.simAnimStartT = performance.now();
  S.simAnimOnDone = function () {
    S.simBentMarkers = S.simBentMarkers || [];
    if (!S.simBentMarkers.includes(bendIdx)) {
      S.simBentMarkers.push(bendIdx);
    }
    // v4.4: фиксируем подпись профиля, на которой накоплена последовательность.
    // При смене профиля (очистка/перерисовка) следующий вход в «Симуляцию»
    // обнаружит расхождение и начнёт с плоского листа.
    if (typeof simProfileSignature === 'function') S.simProfileSig = simProfileSignature();
    if (typeof updateSimButton === 'function') updateSimButton();
    if (onDone) onDone();
  };
  if (typeof updateSimButton === 'function') updateSimButton();
  _simRAF();
}

/**
 * Запустить анимацию разгибания гиба (только последнего).
 */
function startUnbendAnimation(bendIdx, onDone) {
  _simClearTimers();
  S.simAnimRunning = true;
  S.simAnimBendIdx = bendIdx;
  S.simAnimDirection = -1;
  S.simAnimProgress = 1;
  S.simAnimStartT = performance.now();
  S.simAnimOnDone = function () {
    S.simBentMarkers = (S.simBentMarkers || []).filter(i => i !== bendIdx);
    // Удалить метаданные этого гиба — он больше не входит в последовательность
    if (S.bendStepMeta) delete S.bendStepMeta[bendIdx];
    if (typeof updateSimButton === 'function') updateSimButton();
    if (onDone) onDone();
  };
  if (typeof updateSimButton === 'function') updateSimButton();
  _simRAF();
}

function _simRAF() {
  S.simSequenceRAF = requestAnimationFrame(_simTick);
}

function _simTick(now) {
  if (!S.simAnimRunning) return;
  const elapsed = now - S.simAnimStartT;
  const raw = Math.max(0, Math.min(1, elapsed / SIM_BEND_DURATION));
  S.simAnimProgress = (S.simAnimDirection === 1) ? raw : (1 - raw);

  if (typeof drawDrawCanvas === 'function') drawDrawCanvas();

  if (raw >= 1) {
    // ВАЖНО: сначала вызываем cb (добавляет bend в simBentMarkers),
    // потом сбрасываем состояние анимации и перерисовываем — иначе
    // заготовка визуально «отпрыгивает» обратно.
    S.simAnimRunning = false;
    S.simSequenceRAF = null;
    const cb = S.simAnimOnDone;
    S.simAnimOnDone = null;
    S.simAnimBendIdx = -1;
    S.simAnimProgress = 0;
    if (cb) cb();
    if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
  } else {
    _simRAF();
  }
}

function stopAnimation() {
  _simClearTimers();
  S.simAnimRunning = false;
  S.simAnimBendIdx = -1;
  S.simAnimProgress = 0;
  S.simSequenceStep = -1;
  S.simSequence = [];
  S.simAnimOnDone = null;
  if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
  if (typeof updateSimButton === 'function') updateSimButton();
}

function resetAllBends() {
  stopAnimation();
  S.simBentMarkers = [];
  S.selectedBendIndex = undefined;
  S.bendStepMeta = {};
  if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
  if (typeof renderToolButtons === 'function') renderToolButtons();
}

/**
 * Последовательная гибка всех ОСТАВШИХСЯ гибов в естественном порядке.
 */
function startSequenceAnimation() {
  if (!S.unfoldResult || !S.unfoldResult.bendInfos || S.unfoldResult.bendInfos.length === 0) return;
  _simClearTimers();
  const bentSet = S.simBentMarkers || [];
  const remaining = S.unfoldResult.bendInfos.map((b, i) => i).filter(i => !bentSet.includes(i));
  if (remaining.length === 0) {
    return;
  }
  S.simSequence = remaining;
  S.simSequenceStep = -1;
  _simSequenceNext();
  if (typeof updateSimButton === 'function') updateSimButton();
}

function _simSequenceNext() {
  if (!S.simSequence || S.simSequenceStep >= S.simSequence.length - 1) {
    S.simSequenceStep = -1;
    S.simSequence = [];
    if (typeof updateSimButton === 'function') updateSimButton();
    if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
    return;
  }
  S.simSequenceStep++;
  const bendIdx = S.simSequence[S.simSequenceStep];
  S.selectedBendIndex = bendIdx;
  startBendAnimation(bendIdx, function () {
    S.simSequenceTimer = setTimeout(_simSequenceNext, SIM_BETWEEN_DELAY);
  });
}

/**
 * Текущее состояние анимации для отрисовки.
 */
function getAnimInfo() {
  if (!S.simAnimRunning || S.simAnimBendIdx < 0) return null;
  const bends = S.unfoldResult ? (S.unfoldResult.bendInfos || []) : [];
  const bend = bends[S.simAnimBendIdx];
  if (!bend) return null;
  const targetHalf = targetHalfAngleForBend(bend);
  const halfAngle = easeInOutCubic(S.simAnimProgress) * targetHalf;
  const die = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
  const vWidth = die ? (die.vWidth || 10) : 10;
  const depth = punchDepthForHalfAngle(halfAngle, vWidth);
  return {
    animating: true,
    bendIdx: S.simAnimBendIdx,
    progress: S.simAnimProgress,
    direction: S.simAnimDirection,
    halfAngle,
    depth,
    interiorAngle: interiorAngleFromHalfAngle(halfAngle),
    sequenceStep: S.simSequenceStep,
    sequenceTotal: S.simSequence ? S.simSequence.length : 0
  };
}

// ==================== СБРОС СОСТОЯНИЯ ====================

function resetSimulation() {
  _simClearTimers();
  S.simAnimRunning = false;
  S.simAnimBendIdx = -1;
  S.simAnimProgress = 0;
  S.simAnimDirection = 1;
  S.simAnimOnDone = null;
  S.simSequence = [];
  S.simSequenceStep = -1;
  S.simBentMarkers = [];
  S.selectedBendIndex = undefined;
  S.simBentMarkers = [];
  S.bendStepMeta = {};
}

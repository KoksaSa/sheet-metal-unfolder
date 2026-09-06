// ═══════════════════════════════════════════════════════════════
// ENGINE / РАЗВЁРТКА — расчёт плоской заготовки профиля
// ( bend allowance, K-фактор, каймы/hems, проверка гибов )
// ═══════════════════════════════════════════════════════════════

/**
 * Расчёт развёртки профиля
 * @param {Array} points - массив точек профиля
 * @param {number} bendRadius - радиус гиба
 * @param {number} kFactor - K-фактор
 * @param {number} thickness - толщина
 * @param {number} width - ширина заготовки
 * @param {object} [die] - матрица (необязательно)
 * @param {object} [punch] - пуансон (необязательно)
 * @returns {object|null} результат развёртки или null
 */
function unfoldProfile(points, bendRadius, kFactor, thickness, width, die, punch) {
  if (points.length < 2) return null;

  // Вычислить сегменты между точками
  const segs = [];
  for (let i = 0; i < points.length - 1; i++) {
    const s = points[i], e = points[i + 1];
    segs.push({
      start: s, end: e,
      length: dist(s, e),
      angle: Math.atan2(e.y - s.y, e.x - s.x)
    });
  }
  if (!segs.length) return null;

  // Радиус нейтральной линии
  const nr = bendRadius + kFactor * thickness;

  // Найти гибы
  const bends = [];
  if (segs.length >= 2) {
    for (let i = 0; i < segs.length - 1; i++) {
      let def = normAngle(segs[i + 1].angle - segs[i].angle);
      const ba = Math.abs(def);
      // Пропустить почти прямые или почти 180° сегменты
      if (ba < 5 * Math.PI / 180 || ba > Math.PI - 5 * Math.PI / 180) continue;
      // Касательное расстояние по внешнему радиусу (как в SolidWorks: R + t)
      const td = (bendRadius + thickness) * Math.tan(ba / 2);
      const bl = nr * ba;
      const cross = Math.cos(segs[i].angle) * Math.sin(segs[i + 1].angle)
                  - Math.sin(segs[i].angle) * Math.cos(segs[i + 1].angle);
      bends.push({
        vertexIndex: i + 1,
        vertex: points[i + 1],
        bendAngle: ba,
        deflection: def,
        bendAllowance: bl,
        tangentDistance: td,
        neutralRadius: nr,
        isInward: cross > 0,
        segBeforeIndex: i,
        segAfterIndex: i + 1
      });
    }
  }

  // Проверка возможности гибки на выбранных инструментах
  if (die && punch) {
    bends.forEach(b => {
      // Длины полок: длина сегмента минус касательные расстояния соседних гибов
      const prevBend = bends.find(bb => bb.segAfterIndex === b.segBeforeIndex);
      const nextBend = bends.find(bb => bb.segBeforeIndex === b.segAfterIndex);
      let beforeLen = segs[b.segBeforeIndex].length - b.tangentDistance;
      if (prevBend) beforeLen -= prevBend.tangentDistance;
      let afterLen = segs[b.segAfterIndex].length - b.tangentDistance;
      if (nextBend) afterLen -= nextBend.tangentDistance;
      beforeLen = Math.max(0, beforeLen);
      afterLen = Math.max(0, afterLen);
      const checkDH = typeof S !== 'undefined' && S.checkDieHeight;
      const prevInward = prevBend ? prevBend.isInward : false;
      const nextInward = nextBend ? nextBend.isInward : false;
      const segBeforeFull = segs[b.segBeforeIndex].length;
      const segAfterFull = segs[b.segAfterIndex].length;
      // Длины внешних полок (за соседними гибами) — для проверки столкновения полок
      const segBeforeOuterFull = prevBend ? segs[prevBend.segBeforeIndex].length : 0;
      const segAfterOuterFull = nextBend ? segs[nextBend.segAfterIndex].length : 0;
      const result = checkBendFeasibility(b, beforeLen, afterLen, segBeforeFull, segAfterFull, bendRadius, die, punch, !!prevBend, !!nextBend, checkDH, prevInward, nextInward, segBeforeOuterFull, segAfterOuterFull);
      b.feasible = result.ok;
      b.problems = result.problems;
      b.warnings = result.warnings;
      b.flangeBefore = beforeLen;
      b.flangeAfter = afterLen;
    });
  }

  // Расчёт каймы (180° загиб)
  // При 180° металл загибается обратно на лист — учитываем перекрытие (2T вместо T).
  // Прямой участок: h - (R + T), минус T за перекрытие = h - R - 2T.
  // Дуга 90° по нейтральной линии: π/2 * (R + K*T).
  function calcHem(h) {
    if (!h || h <= 0) return 0;
    const R = bendRadius;
    return h - R - 2 * thickness + (Math.PI / 2) * (R + kFactor * thickness);
  }

  // Build a map of hems by segment index
  const hemMap = new Map();
  (S.hems || []).forEach(h => {
    let si = h.segIndex;
    // Last segment hem → place AFTER last segment (at the edge of the contour)
    if (si === segs.length - 1) si = segs.length;
    if (si >= 0 && si <= segs.length && h.height > 0) {
      hemMap.set(si, h);
    }
  });

  // Построить развёртку
  const elements = [];
  const bendLinePositions = [];
  const hemBendLinePositions = [];
  let cx = 0;
  const bendMap = new Map();
  bends.forEach(b => bendMap.set(b.vertexIndex, b));

  for (let i = 0; i < segs.length; i++) {
    // Hem before this segment (at its start point)
    const hemBefore = hemMap.get(i);
    if (hemBefore) {
      const hemAdd = calcHem(hemBefore.height);
      if (hemAdd > 0) {
        elements.push({ type: 'hem', edge: hemBefore.side || 'left', segIndex: i, height: hemBefore.height, length: hemAdd, startX: cx, endX: cx + hemAdd });
        cx += hemAdd;
        hemBendLinePositions.push(cx);
      }
    }

    let sl = segs[i].length;
    const sb = bendMap.get(i);
    if (sb) sl -= sb.tangentDistance;
    const eb = bendMap.get(i + 1);
    if (eb) sl -= eb.tangentDistance;
    sl = Math.max(0, sl);
    elements.push({ type: 'straight', length: sl, startX: cx, endX: cx + sl });
    cx += sl;
    if (eb) {
      elements.push({
        type: 'bend',
        angle: eb.bendAngle,
        bendAllowance: eb.bendAllowance,
        startX: cx,
        endX: cx + eb.bendAllowance,
        direction: eb.isInward ? 1 : -1,
        feasible: eb.feasible,
        problems: eb.problems,
        bendNumber: eb.vertexIndex
      });
      bendLinePositions.push(cx);
      cx += eb.bendAllowance;
    }
  }

  // Hem after last segment (bend line at the START of the hem fold to avoid overlapping with outline edge)
  const hemAfterLast = hemMap.get(segs.length);
  if (hemAfterLast) {
    const hemAdd = calcHem(hemAfterLast.height);
    if (hemAdd > 0) {
      hemBendLinePositions.push(cx);
      elements.push({ type: 'hem', edge: hemAfterLast.side || 'left', segIndex: segs.length, height: hemAfterLast.height, length: hemAdd, startX: cx, endX: cx + hemAdd });
      cx += hemAdd;
    }
  }

  return {
    elements,
    totalLength: cx,
    width,
    bendInfos: bends,
    bendLinePositions,
    hemBendLinePositions
  };
}

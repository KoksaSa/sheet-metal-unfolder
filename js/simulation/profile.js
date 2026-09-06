// ═══════════════════════════════════════════════════════════════
// SIMULATION / ПРОФИЛЬ — накопительная модель гибки:
// каждый гиб применяется поверх предыдущих (как на реальном станке)
//
// Идентификатор гиба = ИНДЕКС в массиве S.unfoldResult.bendInfos
// (в engine/unfold.js у bendInfos нет поля .index — только vertexIndex)
//
// Правило направления: ГИБ ВСЕГДА ВВЕРХ.
//   • deflection > 0 — контур поворачивает влево/вверх → гнём напрямую
//   • deflection < 0 — отражаем геометрию так, чтобы гиб пошёл вверх
// ═══════════════════════════════════════════════════════════════

// ==================== КОНСТАНТЫ ====================
const MARKER_HIT_RADIUS       = 16;
const MARKER_RADIUS           = 11;
const SELECTED_MARKER_RADIUS  = 13;
const HOVER_MARKER_RADIUS     = 15;

const SIM_BEND_DURATION   = 900;  // мс на один гиб (2D)
const SIM_BETWEEN_DELAY   = 350;  // пауза между гибами в последовательности
const SIM_PUNCH_LIFT      = 14;   // высота покоя пуансона над листом (мм)

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// ==================== ГЕОМЕТРИЯ ====================

// halfAngle = половина угла прогиба (bendAngle = |deflection| = отклонение от плоскости).
// Внутренний угол между полками = π − 2·halfAngle = π − bendAngle.
//   • Интерьер 74° → прогиб 106° → halfAngle 53° → V-форма 74° ✓
//   • Интерьер 90° → прогиб 90°  → halfAngle 45° → V-форма 90° ✓
function targetHalfAngleForBend(bend) {
  return bend.bendAngle / 2;
}

// Air bending: глубина погружения пуансона в V-матрицу
function punchDepthForHalfAngle(halfAngle, vWidth) {
  const V = Math.max(1, vWidth || 10);
  return (V / 2) * Math.tan(halfAngle);
}

function interiorAngleFromHalfAngle(halfAngle) {
  return Math.PI - 2 * halfAngle;
}

/**
 * Направление V-fold ОТНОСИТЕЛЬНО ДЕТАЛИ: +1 = вверх, -1 = вниз.
 * world y>0 = ВВЕРХ на экране (w2c инвертирует).
 */
function bendDirection(bend) {
  return bend.deflection < 0 ? 1 : -1;
}

/**
 * Эффективное направление гиба В СИСТЕМЕ СТАНКА (v4.2).
 * На реальном прессе пуансон всегда давит СВЕРХУ, и обе полки
 * поднимаются вверх — независимо от того, перевёрнута ли заготовка.
 * Поэтому при перевёрнутой заготовке (flipY) направление гиба
 * относительно ДЕТАЛИ инвертируется: eff = dir × (−1) при перевороте.
 * Зеркало между гибами сопрягает поворот, и накопленная геометрия
 * детали остаётся верной (см. шаг 2 computeAccumulatedProfile).
 */
function effectiveBendDirection(bend, bendIdx) {
  return bendDirection(bend) * (getBendStepFlipY(bendIdx) ? -1 : 1);
}

/**
 * flipY для конкретного шага из bendStepMeta.
 * flipY=true — оператор физически перевернул заготовку после гиба.
 */
function getBendStepFlipY(bendIdx) {
  const meta = (S.bendStepMeta || {})[bendIdx];
  if (meta && typeof meta.flipY === 'boolean') {
    return meta.flipY;
  }
  return false;
}

// ==================== РАДИУСНЫЕ ДУГИ ГИБОВ (v5.0) ====================
// В местах ВЫПОЛНЕННЫХ гибов острый излом заменяется дугой по таблице
// металла. Дуга строится по НЕЙТРАЛЬНОЙ линии профиля:
//   • радиус Rn = bendRadius + kFactor·T (нейтральный радиус) —
//     согласован с развёрткой (длина дуги = bend allowance);
//   • дуга вписана в угол: касательна к обеим полкам, точки касания
//     на расстоянии t = r·tan(φ/2) от виртуального острия (линии гиба);
//   • центр — на биссектрисе УГЛА (−dIn + dOut) на расстоянии
//     r/cos(φ/2) от острия.
// АНИМАЦИЯ («заворачивание», материал не растягивается): длина дуги по
// нейтральной линии ПОСТОЯННА = BA = Rn·φ_target, радиус во время гиба
// r = BA/φ(тек) — от ∞ (плоский лист) до Rn (готовый гиб). Полки
// «заворачиваются» на дугу по мере опускания пуансона, как на станке.
// Дуга не должна съедать соседнюю геометрию: r ограничивается длиной
// соседних участков (короткая полка → дуга меньше; вырожденная —
// оставляем острый угол).

// Нейтральный радиус гиба по таблице металла (мм)
function neutralBendRadius() {
  const R = (S.metal && Number.isFinite(S.metal.bendRadius)) ? S.metal.bendRadius : 1;
  const k = (S.metal && Number.isFinite(S.metal.kFactor)) ? S.metal.kFactor : 0.35;
  const T = (S.metal && Number.isFinite(S.metal.thickness)) ? S.metal.thickness : 1;
  return Math.max(0.05, R + k * T);
}

/**
 * v5.0: Y внутренней поверхности дуги АКТИВНОГО гиба (для пуансона,
 * 2D и 3D). Пуансон давит по биссектрисе V-складки (после позиционирования
 * она вертикальна через (0,0)) и касается вогнутой стороны дуги:
 *   y = |CV| − (r − T/2) = r/cos(φ/2) − r + T/2 над линией гиба.
 * При φ→0 (плоский лист) → T/2 (верхняя поверхность листа).
 * @param {number} bendIdx - индекс гиба (или undefined → S.simAnimBendIdx)
 * @param {number} progress - сырой прогресс анимации 0..1
 * @returns {number|null} мировая Y вершины пуансона
 */
function activeBendArcInnerY(bendIdx, progress) {
  if (!S.unfoldResult || !S.unfoldResult.bendInfos) return null;
  let idx = (typeof bendIdx === 'number' && bendIdx >= 0) ? bendIdx : S.simAnimBendIdx;
  if (idx === undefined || idx === null || idx < 0) return null;
  const b = S.unfoldResult.bendInfos[idx];
  if (!b) return null;
  const T = (S.metal && Number.isFinite(S.metal.thickness)) ? S.metal.thickness : 1;
  const Rn = neutralBendRadius();
  const phiF = Math.max(0.035, b.bendAngle);
  const e = easeInOutCubic(Math.max(0, Math.min(1, progress)));
  const phi = e * phiF;
  if (phi < 1e-3) return T / 2; // плоский лист — касание верхней поверхности
  const r = Rn * phiF / phi;
  const iy = r / Math.cos(phi / 2) - r + T / 2;
  return Number.isFinite(iy) ? iy : null;
}

// ==================== УПОР: КАСАНИЕ С УЧЁТОМ ТОЛЩИНЫ (v4.7) ====================
// Заготовка — ПОЛОСА металла толщиной T вокруг средней линии профиля.
// Упор — вертикальная стенка высотой 8 мм (полоса Y ∈ [-4, +4]) слева
// от зоны гибки. Касание — по НАРУЖНОЙ ПОВЕРХНОСТИ полосы:
//  • вертикальная/наклонная полка — поверхность смещена от средней
//    линии на T/2 в сторону упора → толщина ВЛИЯЕТ (напр. 100 → 100+T/2);
//  • торец плоской полки — сам торец: X от T НЕ зависит (на реальном
//    станке расстояние от оси гиба до торца листа не меняется с толщиной).
// Для каждого сегмента строим прямоугольник полосы (A±(T/2)n, B±(T/2)n),
// клипуем полосой высоты упора и берём минимальный X вершин — точное
// касание для наклонных полок и при T > высоты упора.
// Единая функция для: bendStepMeta.stopperDist (чертёж), 2D-упора
// (tooling-2d.js) и 3D-упора (sim3d.js) — числа всегда совпадают.
function stopperTouchXThick(prof, opts) {
  if (!prof || !prof.pts || prof.pts.length < 2) return null;
  const T = (opts && typeof opts.thickness === 'number' && opts.thickness > 0)
    ? opts.thickness : (S.metal.thickness || 1);
  const h = (opts && typeof opts.height === 'number' && opts.height > 0) ? opts.height : 8;
  const yLo = -h / 2, yHi = h / 2;
  const o = T / 2;
  let touchX = null;
  for (let i = 0; i < prof.pts.length - 1; i++) {
    const A = prof.pts[i], B = prof.pts[i + 1];
    const dx = B.x - A.x, dy = B.y - A.y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-9) continue;
    const nx = -dy / len, ny = dx / len; // единичная нормаль сегмента
    const poly = [
      { x: A.x + nx * o, y: A.y + ny * o },
      { x: B.x + nx * o, y: B.y + ny * o },
      { x: B.x - nx * o, y: B.y - ny * o },
      { x: A.x - nx * o, y: A.y - ny * o }
    ];
    const clipped = _clipPolyBandY(poly, yLo, yHi);
    if (clipped.length === 0) continue;
    for (let k = 0; k < clipped.length; k++) {
      if (touchX === null || clipped[k].x < touchX) touchX = clipped[k].x;
    }
  }
  return touchX;
}

// Клип выпуклого многоугольника горизонтальной полосой y ∈ [yLo, yHi]
// (алгоритм Сазерленда–Ходгмана, две полуплоскости).
function _clipPolyBandY(poly, yLo, yHi) {
  let out = poly;
  const bounds = [{ v: yLo, keepAbove: true }, { v: yHi, keepAbove: false }];
  for (let b = 0; b < bounds.length; b++) {
    const bound = bounds[b];
    const src = out; out = [];
    for (let i = 0; i < src.length; i++) {
      const cur = src[i], nxt = src[(i + 1) % src.length];
      const curIn = bound.keepAbove ? cur.y >= bound.v : cur.y <= bound.v;
      const nxtIn = bound.keepAbove ? nxt.y >= bound.v : nxt.y <= bound.v;
      if (curIn) out.push(cur);
      if (curIn !== nxtIn) {
        const tt = (bound.v - cur.y) / (nxt.y - cur.y);
        out.push({ x: cur.x + (nxt.x - cur.x) * tt, y: bound.v });
      }
    }
    if (out.length === 0) return out;
  }
  return out;
}

/**
 * Список гибов для применения, в порядке выполнения.
 * Каждый элемент: { bendIdx, progress }
 */
function getApplyList(animInfo) {
  const bentSet = S.simBentMarkers || [];
  const list = [];
  bentSet.forEach(bIdx => {
    if (animInfo && animInfo.bendIdx === bIdx) {
      list.push({ bendIdx: bIdx, progress: animInfo.progress });
    } else {
      list.push({ bendIdx: bIdx, progress: 1 });
    }
  });
  if (animInfo && animInfo.bendIdx >= 0 && !bentSet.includes(animInfo.bendIdx)) {
    list.push({ bendIdx: animInfo.bendIdx, progress: animInfo.progress });
  }
  return list;
}

/**
 * Вычисляет накопительный профиль со всеми выполненными гибами
 * + анимируемым гибом (если есть).
 *
 * Правило: ГИБ ВСЕГДА ВВЕРХ. При позиционировании входная полка лежит
 * на матрице (горизонтально, -X), выходная поднимается ВВЕРХ (+Y).
 *
 * @param {object|null} animInfo — из getAnimInfo() или null
 *   (допускается поле _is3d = true для 3D-симуляции)
 * @returns {object|null}
 */
function computeAccumulatedProfile(animInfo) {
  if (!S.unfoldResult || !S.points || S.points.length < 2) return null;
  let bends = S.unfoldResult.bendInfos || [];
  const n = S.points.length;
  const numSegs = n - 1;
  const bentSet = S.simBentMarkers || [];
  const hasHems = S.hems && S.hems.length > 0;
  if (bends.length === 0 && !hasHems) return null;

  // === ОБРАБОТКА КАЙМЫ (HEM) ===
  // Кайма = гиб 180° на ребре профиля. В плоской развёртке добавляет длину,
  // в симуляции всегда согнута (сложена пополам). Маркер гиба с углом 180°.
  const hemMap = new Map();
  if (hasHems) {
    S.hems.forEach(h => {
      let si = h.segIndex;
      if (si >= numSegs - 1) si = numSegs; // after last segment = at last point
      if (si >= 0 && si <= numSegs && h.height > 0) {
        hemMap.set(si, h);
      }
    });
  }
  // Плоская длина каймы (как calcHem в engine/unfold.js)
  function calcHemFlat(height) {
    const R = S.metal.bendRadius;
    const T = S.metal.thickness;
    const k = S.metal.kFactor;
    return Math.max(0, height - R - 2 * T + (Math.PI / 2) * (R + k * T));
  }

  // Длины сегментов исходного профиля
  const segLengths = [];
  for (let i = 0; i < n - 1; i++) {
    segLengths.push(Math.hypot(
      S.points[i + 1].x - S.points[i].x,
      S.points[i + 1].y - S.points[i].y
    ));
  }

  // 1. Плоская развёртка (все точки на оси X от P0) + расширения каймы.
  //    origToFlat[i] = индекс точки S.points[i] в массиве pts.
  //    origPtRefs[i] = сам объект-точка (v4.9: после вставки точек дуги
  //    каймы индексы пересчитываются по ссылкам на объекты).
  const pts = [{ x: 0, y: 0 }];
  const origToFlat = [0];
  const origPtRefs = [pts[0]];
  const hemInfo = []; // { flatIdx, hemLength, side, height, origVertex }

  // Кайма на вершине 0 (перед первым сегментом)
  const hemAt0 = hemMap.get(0);
  if (hemAt0) {
    const hemLen = calcHemFlat(hemAt0.height);
    if (hemLen > 0) {
      hemInfo.push({ flatIdx: 0, hemLength: hemLen, side: hemAt0.side || 'left', height: hemAt0.height, origVertex: 0 });
      pts.push({ x: pts[0].x + hemLen, y: 0 });
    }
  }

  for (let i = 0; i < n - 1; i++) {
    // Добавляем сегмент i
    const lastPt = pts[pts.length - 1];
    pts.push({ x: lastPt.x + segLengths[i], y: 0 });
    origToFlat[i + 1] = pts.length - 1;
    origPtRefs[i + 1] = pts[pts.length - 1];

    // Кайма на вершине i+1 (перед сегментом i+1, если не последний сегмент)
    if (i + 1 < numSegs) {
      const hem = hemMap.get(i + 1);
      if (hem) {
        const hemLen = calcHemFlat(hem.height);
        if (hemLen > 0) {
          const flatIdx = pts.length - 1;
          hemInfo.push({ flatIdx, hemLength: hemLen, side: hem.side || 'left', height: hem.height, origVertex: i + 1 });
          pts.push({ x: pts[flatIdx].x + hemLen, y: 0 });
        }
      }
    }
  }

  // Кайма после последнего сегмента (на последней точке)
  const hemAfterLast = hemMap.get(numSegs);
  if (hemAfterLast) {
    const hemLen = calcHemFlat(hemAfterLast.height);
    if (hemLen > 0) {
      const flatIdx = origToFlat[n - 1];
      hemInfo.push({ flatIdx, hemLength: hemLen, side: hemAfterLast.side || 'left', height: hemAfterLast.height, origVertex: n - 1 });
      pts.push({ x: pts[flatIdx].x + hemLen, y: 0 });
    }
  }

  // Фальцовка каймы (всегда 180°) — v4.9: аккуратный заворот ПО ДУГЕ
  // вместо резкого отражения (раньше линия просто «ломалась» в точке
  // гиба каймы). Кайма = «капля» закрытого типа:
  //   • дуга-полукруг радиусом r = T/2 по средней линии (центр на линии
  //     гиба); внешняя поверхность заворота = скругление радиусом T;
  //   • обратная нога параллельна основе на расстоянии T — полосы
  //     металла вплотную (закрытая кайма), лицевая сторона ноги
  //     «лежит» на лицевой стороне основы;
  //   • длина средней линии сохраняется: π·r + нога = hemLength —
  //     развёртка и симуляция остаются согласованы.
  // Направления:
  //   • концевая/внутренняя кайма: линия гиба = вершина, дуга выпирает
  //     вперёд по ходу материала, нога возвращается назад (поверх
  //     предыдущего сегмента) — как в v4.x;
  //   • кайма в начале: линия гиба = дальний конец удлинения (та же
  //     точка, что hemBendLinePositions в развёртке), край P0 (линия
  //     реза) заворачивается ВПЕРЁД, поверх первого сегмента — раньше
  //     он отражался назад и «свисал» за край с артефактной линией к
  //     следующей точке.
  if (hemInfo.length > 0) {
    const T = S.metal.thickness || 1;
    const N = 12; // хорд на дугу 180° (гладко и в 2D, и в 3D)
    hemInfo.forEach(h => { h._origFlat = h.flatIdx; });
    // Обход СНИЗУ ВВЕРХ: вставка точек дуги нижней каймы не сдвигает
    // индексы верхних (flatIdx обрабатываемой каймы ещё валиден).
    const ordered = hemInfo.map((h, hi) => ({ h, hi }))
      .sort((a, b) => b.h._origFlat - a.h._origFlat);
    ordered.forEach(({ h, hi }) => {
      const vi = h._origFlat;
      if (vi + 1 >= pts.length) return;
      const ext = pts[vi + 1];
      const s = (h.side === 'right') ? 1 : -1; // right → вверх, left → вниз
      let r = T / 2;
      if (h.hemLength < Math.PI * r) r = Math.max(0.01, h.hemLength / Math.PI);
      const legLen = Math.max(0, h.hemLength - Math.PI * r);
      // Центр дуги: на линии гиба (fx), отступ s·r от средней линии
      // основы. Дуга: вершина/линия гиба → скругление → нога на s·2r.
      const isStartHem = (h.origVertex === 0 && vi === 0);
      if (isStartHem) {
        // «Шапка» против хода материала: нога (fold, s·2r) → капля →
        // линия гиба (fold, fy). Параметризация зависит от стороны s:
        // th = s·(90° + 180°·k/N) — от ноги через −x до линии гиба.
        const fx = ext.x, fy = ext.y; // ext — линия гиба (y = 0)
        const cy = fy + s * r;
        const arc = [];
        for (let k = 0; k <= N; k++) {
          const th = s * (Math.PI / 2 + Math.PI * k / N);
          arc.push({
            x: fx + r * Math.cos(th),
            y: cy + r * Math.sin(th),
            _hemArc: k < N // линия гиба (k=N) — обычная точка основы
          });
        }
        arc[N]._hemFold = hi; // маркер К — на линии гиба
        // Край материала P0 → конец обратной ноги (дуга «съедает» π·r)
        pts[vi].x = fx + legLen;
        pts[vi].y = cy + s * r; // = fy + s·2r
        pts.splice(vi + 1, 1, ...arc);
      } else {
        // Дуга от вершины (линия гиба) выпирает ВПЕРЁД по ходу: вершина
        // → +x → нога. th = s·(180°·k/N − 90°); первая точка — сама
        // вершина (k=0), поэтому пишем с k = 1 (без дубля вершины).
        const fx = pts[vi].x, fy = pts[vi].y;
        const cy = fy + s * r;
        pts[vi]._hemFold = hi; // маркер К — на линии гиба
        const arc = [];
        for (let k = 1; k <= N; k++) {
          const th = s * (Math.PI * k / N - Math.PI / 2);
          arc.push({
            x: fx + r * Math.cos(th),
            y: cy + r * Math.sin(th),
            _hemArc: true
          });
        }
        // k = N — конец дуги (fold, s·2r); обратная нога — параллельно основе
        arc.push({ x: fx - legLen, y: cy + s * r, _hemArc: true });
        pts.splice(vi + 1, 1, ...arc);
      }
    });
    // Вставки сдвинули индексы — пересчитываем их по ссылкам на объекты
    for (let i = 0; i < origPtRefs.length; i++) {
      origToFlat[i] = pts.indexOf(origPtRefs[i]);
    }
    hemInfo.forEach((h, hi) => {
      const idx = pts.findIndex(p => p._hemFold === hi);
      if (idx >= 0) h.flatIdx = idx;
      delete h._origFlat;
    });
  }

  // Корректируем vertexIndex реальных гибов на плоский профиль (с каймами)
  bends = bends.map(b => ({
    ...b,
    _origVertexIndex: b.vertexIndex,
    vertexIndex: origToFlat[b.vertexIndex] !== undefined ? origToFlat[b.vertexIndex] : b.vertexIndex
  }));

  // Определяем активный гиб (для позиционирования).
  let activeBendIdx = -1;
  let activeBend = null;
  let activeProg = 0;
  // Поддержка каймы: selectedBendIndex — строка 'hemN'.
  let activeIsHem = false;
  if (animInfo && animInfo.bendIdx >= 0 && bends[animInfo.bendIdx]) {
    activeBendIdx = animInfo.bendIdx;
    activeBend = bends[activeBendIdx];
    activeProg = animInfo.progress;
  } else if (S.selectedBendIndex !== undefined && typeof S.selectedBendIndex === 'string' && S.selectedBendIndex.indexOf('hem') === 0) {
    // Выбрана кайма — позиционируем по её вершине, без V-fold.
    const hemNum = parseInt(S.selectedBendIndex.slice(3), 10);
    if (hemInfo[hemNum]) {
      activeBend = { vertexIndex: hemInfo[hemNum].flatIdx, bendAngle: Math.PI, deflection: 0, isInward: false };
      activeBendIdx = -2; // признак каймы
      activeIsHem = true;
      activeProg = 1;
    }
  } else if (S.selectedBendIndex !== undefined && bends[S.selectedBendIndex]) {
    activeBendIdx = S.selectedBendIndex;
    activeBend = bends[activeBendIdx];
    activeProg = bentSet.includes(activeBendIdx) ? 1 : 0;
  } else if (bentSet.length > 0) {
    activeBendIdx = bentSet[bentSet.length - 1];
    activeBend = bends[activeBendIdx];
    activeProg = 1;
  } else if (bends.length > 0) {
    // Нет ни выбора, ни согнутых гибов, ни анимации — позиционируем по
    // первому гибу (индекс 0), чтобы заготовка встала первым маркером
    // гибки в (0,0) сразу при входе в симуляцию.
    activeBendIdx = 0;
    activeBend = bends[0];
    activeProg = 0;
  }

  // 2. Применяем ПРЕДЫДУЩИЕ гибы — V-FOLD (наклон всей заготовки + правая сторона).
  //    ФИЗИКА ПЕРЕВОРОТА ЗАГОТОВКИ (v4.2, FIX «зеркалился и гнулся вниз»):
  //    • «↕Y» = физический поворот детали вокруг оси гиба (лицом вниз/вверх);
  //    • чётность переворота на момент каждого гиба хранится в
  //      bendStepMeta[k].flipY (P_k);
  //    • между гибами применяется зеркало y→−y, только если чётность
  //      ИЗМЕНИЛАСЬ (XOR): переворот и возврат = два зеркала = без
  //      изменения — раньше сравнение было не XOR, из-за чего переворот
  //      + возврат между гибами ломали геометрию;
  //    • направление гиба — в системе станка (effectiveBendDirection):
  //      при перевёрнутой заготовке гиб относительно детали инвертируется,
  //      и на станке он ВСЕГДА выполняется вверх (пуансон сверху).
  const applyList = getApplyList(animInfo);
  applyList.forEach(({ bendIdx, progress }, listIdx) => {
    if (bendIdx === activeBendIdx) return;
    const b = bends[bendIdx];
    if (!b) return;
    const vi = b.vertexIndex;
    if (vi < 0 || vi >= pts.length) return;
    const easedProg = easeInOutCubic(Math.max(0, Math.min(1, progress)));
    const halfAngle = targetHalfAngleForBend(b) * easedProg;
    const dir = effectiveBendDirection(b, bendIdx);
    const px = pts[vi].x, py = pts[vi].y;
    // Наклон ВСЕЙ заготовки
    const tiltAngle = -halfAngle * dir;
    const cosT = Math.cos(tiltAngle), sinT = Math.sin(tiltAngle);
    for (let i = 0; i < pts.length; i++) {
      const dx = pts[i].x - px, dy = pts[i].y - py;
      pts[i].x = px + dx * cosT - dy * sinT;
      pts[i].y = py + dx * sinT + dy * cosT;
    }
    // Правая сторона: +2*halfAngle*dir
    const angR = 2 * halfAngle * dir;
    const cosR = Math.cos(angR), sinR = Math.sin(angR);
    for (let i = vi + 1; i < pts.length; i++) {
      const dx = pts[i].x - px, dy = pts[i].y - py;
      pts[i].x = px + dx * cosR - dy * sinR;
      pts[i].y = py + dx * sinR + dy * cosR;
    }
    // Физический переворот заготовки ПЕРЕД следующим гибом — если
    // чётность переворота ИЗМЕНИЛАСЬ (XOR), а не просто «включена».
    const nextItem = applyList[listIdx + 1];
    if (nextItem && progress >= 0.999999) {
      const curFlipY = getBendStepFlipY(bendIdx);
      const nextFlipY = getBendStepFlipY(nextItem.bendIdx);
      if (curFlipY !== nextFlipY) {
        for (let i = 0; i < pts.length; i++) {
          pts[i].y = -pts[i].y;
        }
      }
    }
  });

  // 3. Позиционирование: точка гиба в (0,0), входная полка горизонтальна.
  //    v4.9: clamp по pts.length — массив длиннее исходного профиля из-за
  //    точек дуги каймы (раньше clamp по n обрезал якорь при каймах).
  let anchorV = activeBend ? activeBend.vertexIndex : 0;
  if (anchorV < 0) anchorV = 0;
  if (anchorV >= pts.length) anchorV = pts.length - 1;

  if (anchorV > 0) {
    const preAngle = Math.atan2(
      pts[anchorV].y - pts[anchorV - 1].y,
      pts[anchorV].x - pts[anchorV - 1].x
    );
    const tryRotation = (targetAngle) => {
      const rotAngle = targetAngle - preAngle;
      const cosR = Math.cos(rotAngle), sinR = Math.sin(rotAngle);
      let sumY = 0, count = 0;
      for (let i = anchorV + 1; i < pts.length; i++) {
        const x = pts[i].x - pts[anchorV].x, y = pts[i].y - pts[anchorV].y;
        sumY += x * sinR + y * cosR;
        count++;
      }
      const afterY = count > 0 ? sumY / count : 0;
      let sumY2 = 0, count2 = 0;
      for (let i = 0; i < anchorV; i++) {
        const x = pts[i].x - pts[anchorV].x, y = pts[i].y - pts[anchorV].y;
        sumY2 += x * sinR + y * cosR;
        count2++;
      }
      const beforeY = count2 > 0 ? sumY2 / count2 : 0;
      return { rotAngle, afterY, beforeY };
    };
    const v1 = tryRotation(Math.PI);
    const v2 = tryRotation(0);
    let best;
    if (activeIsHem) {
      // v4.3: старая эвристика «полки не в воздухе» сохранена ТОЛЬКО
      // для каймы (V-fold для каймы не применяется, направление гиба
      // не определено) — направление первого согнутого гиба, сопряжённое
      // чётностью переворота текущего шага, + средняя высота полок.
      if (Math.abs(v1.beforeY - v2.beforeY) > 0.01) {
        const firstBentBend = (S.simBentMarkers || [])[0];
        const flipParity = activeBendIdx >= 0 ? getBendStepFlipY(activeBendIdx) : false;
        const prevDir = firstBentBend !== undefined
          ? bendDirection(bends[firstBentBend]) * (flipParity ? -1 : 1)
          : 1;
        best = (prevDir > 0 ? v1.beforeY >= v2.beforeY : v1.beforeY <= v2.beforeY) ? v1 : v2;
      } else {
        best = v2;
      }
    } else {
      // v4.3 FIX («V-складка вниз / зеркало детали после поворотов»):
      // якорь СТРОГО согласован с направлением гиба В СИСТЕМЕ СТАНКА.
      // Пуансон всегда давит СВЕРХУ → V-складка ВСЕГДА раскрыта вверх:
      //   • effDir > 0 → v2: входная полка слева (−X), выход справа
      //     поднимается ВВЕРХ;
      //   • effDir < 0 → v1: входная полка справа (+X), выход слева
      //     поднимается ВВЕРХ.
      // Раньше якорь выбирался эвристикой (направление первого согнутого
      // гиба + средняя высота полок) и при переворотах входил в
      // противоречие с направлением активного гиба: V-складка рендерилась
      // ВНИЗ (полки в теле матрицы), а смена якоря выглядела как «зеркало»
      // детали. Проверено перебором 36 комбинаций кнопок: V всегда вверх.
      const effDir = activeBend ? effectiveBendDirection(activeBend, activeBendIdx) : 1;
      best = effDir > 0 ? v2 : v1;
    }
    const cosR = Math.cos(best.rotAngle), sinR = Math.sin(best.rotAngle);
    for (let i = 0; i < pts.length; i++) {
      const x = pts[i].x, y = pts[i].y;
      pts[i].x = x * cosR - y * sinR;
      pts[i].y = x * sinR + y * cosR;
    }
  }

  // Сдвиг: вершина активного гиба в (0,0).
  if (anchorV >= 0 && anchorV < pts.length) {
    const dx = -pts[anchorV].x, dy = -pts[anchorV].y;
    pts.forEach(p => { p.x += dx; p.y += dy; });
  }

  // 4. Активный V-fold (после позиционирования).
  //    Наклон ВСЕЙ заготовки на -halfAngle*dir, затем правая сторона
  //    на +2*halfAngle*dir → V-форма. Направление — в системе станка
  //    (effectiveBendDirection): при перевёрнутой заготовке гиб идёт
  //    вверх на станке (пуансон сверху), как в реальности (v4.2).
  //    Для каймы V-fold не делаем.
  if (activeBend && activeProg > 0 && !activeIsHem) {
    const b = activeBend;
    const vi = b.vertexIndex;
    if (vi >= 0 && vi < pts.length) {
      const easedProg = easeInOutCubic(Math.max(0, Math.min(1, activeProg)));
      const halfAngle = targetHalfAngleForBend(b) * easedProg;
      const dir = effectiveBendDirection(b, activeBendIdx);
      const px = pts[vi].x, py = pts[vi].y;
      const tiltAngle = -halfAngle * dir;
      const cosT = Math.cos(tiltAngle), sinT = Math.sin(tiltAngle);
      for (let i = 0; i < pts.length; i++) {
        const dx = pts[i].x - px, dy = pts[i].y - py;
        pts[i].x = px + dx * cosT - dy * sinT;
        pts[i].y = py + dx * sinT + dy * cosT;
      }
      const angR = 2 * halfAngle * dir;
      const cosR = Math.cos(angR), sinR = Math.sin(angR);
      for (let i = vi + 1; i < pts.length; i++) {
        const dx = pts[i].x - px, dy = pts[i].y - py;
        pts[i].x = px + dx * cosR - dy * sinR;
        pts[i].y = py + dx * sinR + dy * cosR;
      }
      const dx = -pts[vi].x, dy = -pts[vi].y;
      pts.forEach(p => { p.x += dx; p.y += dy; });
    }
  }

  // 5. Глубина погружения пуансона (air bending) для активного гиба.
  let depth = 0;
  let halfAngle = 0;
  if (activeBend && activeProg > 0) {
    halfAngle = easeInOutCubic(activeProg) * targetHalfAngleForBend(activeBend);
    const die = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
    const vWidth = die ? (die.vWidth || 10) : 10;
    depth = punchDepthForHalfAngle(halfAngle, vWidth);
  }

  // 6. Визуальные/физические перевороты заготовки (зеркалирование геометрии).
  //    simFlipX — видовое зеркало лево↔право (x → -x).
  //    simFlipY — ТЕКУЩАЯ ориентация заготовки. Перевороты, сделанные
  //    ДО последнего выполненного гиба, УЖЕ учтены между гибами (шаг 2),
  //    поэтому здесь применяется только ДЕЛЬТА — заготовку перевернули
  //    ПОСЛЕ последнего гиба. Раньше глобальный simFlipY применялся
  //    безусловно → переворот действовал ДВАЖДЫ (между гибами + здесь),
  //    заготовка «зеркалилась обратно», а активный гиб шёл вниз вместо
  //    вверх (v4.1, баг: Z-профиль → 1-й гиб → «↕Y» → 2-й гиб).
  //    Для 3D (_is3d) дельта не применяется: шаги показывают состояние
  //    на момент гиба, а осмотр детали — вращением камеры.
  if (S.simFlipX) {
    pts.forEach(p => { p.x = -p.x; });
  }
  if (!(animInfo && animInfo._is3d)) {
    // Дельта переворота: текущая ориентация (S.simFlipY) XOR чётность
    // на момент последнего гиба. Покрывает ОБА направления:
    // • тумблер включён после гибов → показать перевёрнутую деталь;
    // • переворот был «запечён» в meta, тумблер выключен (деталь
    //   вернули) → показать исходную ориентацию (зеркало назад).
    const lastItem = applyList.length > 0 ? applyList[applyList.length - 1] : null;
    const lastParity = lastItem ? getBendStepFlipY(lastItem.bendIdx) : false;
    if (!!S.simFlipY !== lastParity) {
      pts.forEach(p => { p.y = -p.y; });
    }
  }

  // 6.5 (v5.0): РАДИУСНЫЕ ДУГИ В МЕСТАХ ВЫПОЛНЕННЫХ ГИБОВ.
  //     Выполняется ПОСЛЕ всех поворотов/переворотов и ДО маркеров:
  //     острый угол в вершине каждого согнутого (или анимируемого) гиба
  //     заменяется касательной дугой нейтрального радиуса Rn (таблица
  //     металла). Маркеры/линии гиба остаются на виртуальном острие.
  //     Радиусы: выполненный гиб → r = Rn; анимируемый → r = BA/φ
  //     («заворачивание» с сохранением длины, см. комментарий выше).
  const bendArcSharps = new Map(); // bendIdx → {x,y} остриё (линия гиба)
  const bendArcActual = {};        // bendIdx → фактический угол поворота
  const bendArcRadius = {};        // bendIdx → фактический радиус дуги
  (function insertBendArcs() {
    const Rn = neutralBendRadius();
    // Гибы к обработке: всё из applyList с прогрессом > 0 (согнутые +
    // анимируемый). Ещё плоские (φ≈0) дуги не получают.
    const todo = [];
    applyList.forEach(({ bendIdx, progress }) => {
      const b = bends[bendIdx];
      if (!b) return;
      const pr = Math.max(0, Math.min(1, progress));
      if (pr <= 0.0001) return;
      todo.push({ bendIdx, b, pr });
    });
    // Позиции остриёв снимаем ДО вставок (координаты уже финальные)
    todo.forEach(({ bendIdx, b }) => {
      const vi = b.vertexIndex;
      if (vi > 0 && vi < pts.length - 1) {
        bendArcSharps.set(bendIdx, { x: pts[vi].x, y: pts[vi].y });
      }
    });
    // Обход СВЕРХУ ВНИЗ: вставка в вершине с большим индексом не сдвигает
    // нижние (flatIdx обрабатываемых ниже ещё валидны)
    const sorted = todo.slice().sort((a, c) => c.b.vertexIndex - a.b.vertexIndex);
    const shifts = []; // {pos, delta} — для пересчёта индексов после вставок
    sorted.forEach(({ bendIdx, b, pr }) => {
      const vi = b.vertexIndex;
      if (vi <= 0 || vi >= pts.length - 1) return;
      const V = pts[vi], prev = pts[vi - 1], next = pts[vi + 1];
      const dInX = V.x - prev.x, dInY = V.y - prev.y;
      const dOutX = next.x - V.x, dOutY = next.y - V.y;
      const lenIn = Math.hypot(dInX, dInY), lenOut = Math.hypot(dOutX, dOutY);
      if (lenIn < 1e-6 || lenOut < 1e-6) return;
      const uInX = dInX / lenIn, uInY = dInY / lenIn;
      const uOutX = dOutX / lenOut, uOutY = dOutY / lenOut;
      const crossIO = uInX * uOutY - uInY * uOutX;
      const dotIO = uInX * uOutX + uInY * uOutY;
      const phi = Math.atan2(Math.abs(crossIO), dotIO); // фактический поворот 0..π
      bendArcActual[bendIdx] = phi;
      if (phi < 0.035) return; // почти прямой — дуга не нужна
      const phiF = Math.max(0.035, b.bendAngle); // целевая величина (для BA)
      const BA = Rn * phiF;     // длина нейтральной линии в зоне гиба
      let r = phi > 1e-4 ? BA / phi : Infinity;
      // Ограничение: касательные не длиннее соседних участков
      const halfTan = Math.tan(phi / 2);
      if (halfTan > 1e-6) {
        const rMax = Math.min(lenIn, lenOut) / halfTan;
        if (r > rMax) r = rMax;
      }
      if (!(r >= 0.05) || !Number.isFinite(r)) return; // не влезает — острый угол
      bendArcRadius[bendIdx] = r;
      const t = r * halfTan;
      const sweep = crossIO >= 0 ? 1 : -1;
      // Биссектриса УГЛА: между направлениями НА полки (−dIn и +dOut)
      let bx = uOutX - uInX, by = uOutY - uInY;
      const bl = Math.hypot(bx, by);
      if (bl < 1e-6) return; // φ≈180°, вырожденная биссектриса
      bx /= bl; by /= bl;
      const dCV = r / Math.cos(phi / 2);
      const Cx = V.x + bx * dCV, Cy = V.y + by * dCV;
      const A = { x: V.x - uInX * t, y: V.y - uInY * t, _bendArc: true };
      const B = { x: V.x + uOutX * t, y: V.y + uOutY * t, _bendArc: true };
      const aA = Math.atan2(A.y - Cy, A.x - Cx);
      // Хорд по длине дуги (дуга при анимации НЕ меняет длины — качество
      // хорд стабильно; при «заворачивании» BA постоянна)
      const N = Math.max(8, Math.min(24, Math.round(BA)));
      const arc = [];
      for (let k = 1; k < N; k++) {
        const a = aA + sweep * phi * k / N;
        arc.push({ x: Cx + r * Math.cos(a), y: Cy + r * Math.sin(a), _bendArc: true });
      }
      arc.push(B);
      pts.splice(vi, 1, A, ...arc); // 1 точка → N+1: индексы > vi сдвинутся на +N
      shifts.push({ pos: vi, delta: N });
    });
    if (shifts.length > 0) {
      const remap = (g) => g + shifts.reduce((s, op) => s + (op.pos < g ? op.delta : 0), 0);
      bends = bends.map(b => ({ ...b, vertexIndex: remap(b.vertexIndex) }));
      hemInfo.forEach(h => { h.flatIdx = remap(h.flatIdx); });
    }
  })();

  // 7. Маркеры гибов (index — индекс в массиве bendInfos).
  //    v5.0: позиция маркера — ВИРТУАЛЬНОЕ ОСТРИЁ гиба (линия гиба,
  //    снимается до вставки дуг): маркер всегда на оси пуансона и в том
  //    же месте, что и на плоской развёртке (в чертеже/таблице).
  const bendMarkers = bends.map((b, i) => {
    const vi = Math.max(0, Math.min(pts.length - 1, b.vertexIndex));
    const sharp = bendArcSharps.get(i);
    const mp = (sharp && Number.isFinite(sharp.x) && Number.isFinite(sharp.y)) ? sharp : pts[vi];
    return {
      x: mp.x,
      y: mp.y,
      index: i,
      vertexIndex: b.vertexIndex,
      origVertexIndex: b._origVertexIndex,
      isBent: bentSet.includes(i),
      bendOrder: bentSet.indexOf(i) + 1, // 0 если не согнут
      label: 'P' + b._origVertexIndex
    };
  });

  // Маркеры каймы (всегда согнуты, угол 180°)
  hemInfo.forEach((hem, hi) => {
    bendMarkers.push({
      x: pts[hem.flatIdx].x,
      y: pts[hem.flatIdx].y,
      index: 'hem' + hi,
      vertexIndex: hem.flatIdx,
      origVertexIndex: hem.origVertex,
      isHem: true,
      isBent: true,
      bendOrder: 0,
      label: 'К' + (hi + 1)
    });
  });

  // Вычисляем углы для каждого согнутого гиба.
  // v5.0: фактический угол поворота в вершине фиксируется в проходе
  // insertBendArcs ДО вставки дуг — по точной геометрии (работает и во
  // время разгибания: показывает текущий угол). Если гиб пропущен
  // проходом — берём целевой угол. Раньше угол считался по соседним
  // точкам массива: после вставки дуг соседняя точка — хорда дуги,
  // и подпись «проседала» бы на ~φ/2N.
  const bendAngles = {};
  for (const bIdx of bentSet) {
    const b = bends[bIdx];
    if (!b) continue; // защита: bIdx вне диапазона (изменён профиль)
    const recorded = bendArcActual[bIdx];
    bendAngles[bIdx] = (recorded !== undefined && Number.isFinite(recorded)) ? recorded : b.bendAngle;
  }

  // Углы каймы — всегда 180°
  hemInfo.forEach((hem, hi) => {
    bendAngles['hem' + hi] = Math.PI;
  });

  return {
    pts, bendMarkers, depth, halfAngle,
    interiorAngle: activeBend ? Math.PI - 2 * halfAngle : Math.PI,
    bendAngles,
    hemInfo,
    anchorV,
    activeBendIdx,
    bentCount: bentSet.length,
    totalBends: bends.length,
    // v5.0: геометрия дуг (отладка/подписи): острия, фактические углы и радиусы
    bendArcSharps, bendArcActual, bendArcRadius
  };
}

// Совместимость со старыми вызовами
function computeSimPoints() {
  return computeAccumulatedProfile(null);
}
function computeBentProfile(markerIdx) {
  return computeAccumulatedProfile({ bendIdx: markerIdx, progress: 1, animating: false });
}

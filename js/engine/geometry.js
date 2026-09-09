// ═══════════════════════════════════════════════════════════════
// ENGINE / ГЕОМЕТРИЯ — базовые геометрические helpers,
// масса детали, плотность, усилие гибки (air bending)
// ═══════════════════════════════════════════════════════════════

function dist(a, b) {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

function normAngle(a) {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a <= -Math.PI) a += 2 * Math.PI;
  return a;
}

function calcWeight(area, thick, mtIdx) {
  const mt = METAL_TYPES[mtIdx] || METAL_TYPES[0];
  const ts = Object.keys(mt.densities).map(Number).sort((a, b) => a - b);
  let d = 7.85e-6;
  for (const tt of ts) {
    d = mt.densities[tt];
    if (tt >= thick) break;
  }
  return area * thick * d;
}

function getMetalDensity(mtIdx, thick) {
  const mt = METAL_TYPES[mtIdx] || METAL_TYPES[0];
  const ts = Object.keys(mt.densities).map(Number).sort((a, b) => a - b);
  let d = 7.85e-6;
  for (const tt of ts) {
    d = mt.densities[tt];
    if (tt >= thick) break;
  }
  return d;
}

/**
 * Расчёт усилия свободной гибки (air bending) на V-матрице.
 * Формула: F = 1.33 × σв × L × t² / V — для угла 90°.
 * Поправка на угол (чем острее внутренний угол, тем больше усилие):
 *   F(α) = F(90°) × sin(45°) / sin(α/2)
 * Итог: F = 0.94 × σв × L × t² / (V × sin(α/2)), Н.
 * @param {number} interiorAngleRad - внутренний угол гиба (угол между полками), рад
 * @param {number} thickness - толщина металла, мм
 * @param {number} width - длина гиба (ширина заготовки), мм
 * @param {object} die - матрица {vWidth}
 * @param {number} mtIdx - индекс металла (для предела прочности)
 * @returns {{newtons: number, tons: number, tensile: number}} усилие
 */
function calcBendForce(interiorAngleRad, thickness, width, die, mtIdx) {
  const mt = METAL_TYPES[mtIdx] || METAL_TYPES[0];
  const tensile = mt.tensile || 400;
  const V = die.vWidth;
  const t = Math.max(0.01, thickness);
  const L = Math.max(1, width);
  const alpha = Math.max(0.05, Math.min(Math.PI - 0.05, interiorAngleRad));
  const forceN = 0.94 * tensile * L * t * t / (V * Math.sin(alpha / 2));
  const tons = forceN / 9810; // 1 тс ≈ 9.81 кН
  return { newtons: forceN, tons: tons, tensile: tensile };
}

// ==================== ПРОВЕРКА ВОЗМОЖНОСТИ ГИБА ====================
/**
 * Проверка возможности гибки на выбранных матрице и пуансоне.
 * ВНИМАНИЕ: подробные предупреждения гибов отключены по требованию
 * пользователя — функция всегда возвращает «возможно».
 * Полная сигнатура оставлена для совместимости вызовов (engine/unfold.js).
 */
function checkBendFeasibility(bend, segBeforeLen, segAfterLen, segBeforeFull, segAfterFull, bendRadius, die, punch, hasBendBefore, hasBendAfter, checkDieHeight, prevInward, nextInward, segBeforeOuter, segAfterOuter) {
  return { ok: true, problems: [], warnings: [] };
}

// ==================== НАРУЖНЫЙ ГАБАРИТ ПРОФИЛЯ (v4.7) ====================
/**
 * Профиль задаётся СРЕДНЕЙ линией листа (нейтральный слой) — это
 * стандарт развёрток (K-фактор). Полоса металла — T/2 в обе стороны
 * от средней линии. Возвращает bounding box НАРУЖНОГО контура полосы
 * (с учётом торцов, перпендикулярных сегментам).
 * @param {Array} points - точки средней линии
 * @param {number} thickness - толщина металла, мм
 * @returns {{minX,maxX,minY,maxY,width,height}|null}
 */
function profileOuterBounds(points, thickness) {
  if (!points || points.length < 2) return null;
  const T = (typeof thickness === 'number' && thickness > 0) ? thickness : 1;
  const o = T / 2;
  let mnX = Infinity, mxX = -Infinity, mnY = Infinity, mxY = -Infinity;
  for (let i = 0; i < points.length - 1; i++) {
    const A = points[i], B = points[i + 1];
    const dx = B.x - A.x, dy = B.y - A.y;
    const len = Math.hypot(dx, dy);
    let nx = 0, ny = 0;
    if (len > 1e-9) { nx = -dy / len; ny = dx / len; }
    const cxs = [A.x + nx * o, B.x + nx * o, A.x - nx * o, B.x - nx * o];
    const cys = [A.y + ny * o, B.y + ny * o, A.y - ny * o, B.y - ny * o];
    for (let k = 0; k < 4; k++) {
      if (cxs[k] < mnX) mnX = cxs[k];
      if (cxs[k] > mxX) mxX = cxs[k];
      if (cys[k] < mnY) mnY = cys[k];
      if (cys[k] > mxY) mxY = cys[k];
    }
  }
  return { minX: mnX, maxX: mxX, minY: mnY, maxY: mxY, width: mxX - mnX, height: mxY - mnY };
}

// ==================== КАЙМА: СТОРОНА ВЫРОЖДЕННОЙ ГРАНИ (v5.6) ====================
// Кайма — заворот на 180° по дуге радиуса r = T/2 («капля»: дуга + нога
// на расстоянии 2r от основы). Лист задаётся средней линией, грани —
// офсеты ±T/2. На дуге каймы офсет с ВЫПУКЛОЙ стороны — валидная
// поверхность (радиус r + T/2 = T), а офсет со стороны ЦЕНТРА дуги
// ВЫРОЖДАЕТСЯ (r − T/2 ≤ 0: нулевой/отрицательный радиус, грань
// схлопывается в линию через центр или самопересекается). Нога каймы:
// грань со стороны центра ложится точно на грань основы (z-fighting),
// внешняя — валидна. До v5.6 все 3D-рендеры пропускали на _hemArc-
// сегментах «лицевую» грань БЕЗУСЛОВНО — но лицевой вырожденная грань
// становится только при одном сочетании знаков (сторона каймы ×
// лицевая сторона листа × зеркальные отражения при накоплении гибов);
// при другом сочетании пропускалась именно ВАЛИДНАЯ внешняя грань,
// и кайма оставалась «полой» (одной плоскости нет — баг пользователя).
// Решение: сторона вырождения определяется ГЕОМЕТРИЧЕСКИ по сегменту —
// знак векторного произведения соседних хорд говорит, в какую сторону
// поворачивает ломаная; центр кривизны всегда С ТОЙ ЖЕ стороны
// (выпуклость заворачивается К центру). Алгебраически верно в любых
// координатах и выживает при поворотах/переносах/отражениях профиля.
// «Левый» = сторона левой нормали (−dy, dx) сегмента.
// @param {Array} pts — полилиния с точками _hemArc (блок каймы)
// @param {number} i — индекс сегмента (pts[i] → pts[i+1])
// @returns {'left'|'right'|null} — сторона ВЫРОЖДЕННОЙ грани (null — не определено)
function hemDegenerateSide(pts, i) {
  if (!pts || i < 0 || i + 1 >= pts.length) return null;
  const a = pts[i], b = pts[i + 1];
  if (!a || !b) return null;
  const c = pts[i + 2], p = pts[i - 1];
  // Хорда ВПЕРЁД надёжна, пока следующая точка в блоке каймы (дуга);
  // для НОГИ и последней хорды — хорда НАЗАД (поворот дуги продолжается
  // в ногу до касательной). Приоритет: сосед из блока каймы.
  let cr = 0;
  if (c && c._hemArc) {
    cr = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
  } else if (p && p._hemArc) {
    cr = (a.x - p.x) * (b.y - a.y) - (a.y - p.y) * (b.x - a.x);
  } else if (c) {
    cr = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
  } else if (p) {
    cr = (a.x - p.x) * (b.y - a.y) - (a.y - p.y) * (b.x - a.x);
  }
  if (Math.abs(cr) < 1e-9) return null;
  // cr > 0 — поворот «влево» (к левой нормали) ⇒ центр дуги слева,
  // вырождена ЛЕВАЯ грань; cr < 0 — вырождена ПРАВАЯ.
  return cr > 0 ? 'left' : 'right';
}

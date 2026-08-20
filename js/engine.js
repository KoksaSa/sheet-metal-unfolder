// ==================== ENGINE ====================
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

// ==================== BEND FEASIBILITY ====================
/**
 * Проверка возможности гибки на выбранных матрице и пуансоне.
 * Ключевое: пуансон не должен врезаться в кромку металла при гибке.
 * @param {object} bend - объект гиба (bendAngle в радианах)
 * @param {number} segBeforeLen - длина полки до гиба (минус tangentDistance), мм
 * @param {number} segAfterLen - длина полки после гиба (минус tangentDistance), мм
 * @param {number} segBeforeFull - полная длина сегмента до гиба, мм
 * @param {number} segAfterFull - полная длина сегмента после гиба, мм
 * @param {number} bendRadius - радиус гиба, мм
 * @param {object} die - матрица {vWidth, height, maxAngle}
 * @param {object} punch - пуансон {radius, maxAngle}
 * @param {boolean} hasBendBefore - есть ли гиб на другом конце полки до
 * @param {boolean} hasBendAfter - есть ли гиб на другом конце полки после
 * @param {boolean} checkDieHeight - проверять ли высоту матрицы
 * @param {boolean} prevInward - предыдущий гиб загнул полку вниз (к матрице)
 * @param {boolean} nextInward - следующий гиб загнёт полку вниз (к матрице)
 * @returns {{ok: boolean, problems: string[], warnings: string[]}} результат проверки
 */
function checkBendFeasibility(bend, segBeforeLen, segAfterLen, segBeforeFull, segAfterFull, bendRadius, die, punch, hasBendBefore, hasBendAfter, checkDieHeight, prevInward, nextInward) {
  const problems = [];
  const warnings = [];
  const bendDeg = bend.bendAngle * 180 / Math.PI;

  // 1. Угол гиба должен укладываться в возможности инструмента,
  //    иначе пуансон врежется в кромку металла при гибке
  const maxBendAngle = Math.min(punch.maxAngle, die.maxAngle);
  if (bendDeg > maxBendAngle) {
    problems.push('Угол гиба ' + bendDeg.toFixed(0) + '° больше максимального ' + maxBendAngle + '° для этого инструмента — пуансон врежется в кромку');
  }

  // 2. Радиус пуансона не должен превышать радиус гиба
  if (punch.radius > bendRadius + 0.2) {
    problems.push('Радиус пуансона R' + punch.radius + ' больше радиуса гиба R' + bendRadius.toFixed(1) + ' мм — пуансон не впишется в гиб');
  }

  // 3. Минимальная длина полки: при короткой полке пуансон упрётся
  //    в соседнюю кромку металла (зависит от угла гиба и ширины V)
  const half = bendDeg * Math.PI / 180 / 2;
  if (half > 0) {
    const minFlange = ((die.vWidth / 2) + 2) / Math.sin(half);
    if (segBeforeLen < minFlange) {
      problems.push('Полка слева ' + segBeforeLen.toFixed(1) + ' мм меньше минимальной ' + minFlange.toFixed(1) + ' мм — пуансон врежется в кромку');
    }
    if (segAfterLen < minFlange) {
      problems.push('Полка справа ' + segAfterLen.toFixed(1) + ' мм меньше минимальной ' + minFlange.toFixed(1) + ' мм — пуансон врежется в кромку');
    }
  }

  // 4. Полка между гибами в Z-профиле (гибы в РАЗНЫХ направлениях):
  //    минимальная полка = V/2. В Z-профиле один гиб идёт вниз (к матрице),
  //    другой вверх — если полка < V/2, уже согнутая вниз полка не даст
  //    сдвинуть деталь до центра ручья. В U-профиле (гибы в одну сторону)
  //    полки смотрят в одну сторону — проверка не нужна.
  //    Z = соседние гибы в противоположных направлениях (inward ≠ neighbor).
  //    Используем ПОЛНУЮ длину сегмента.
  const curInward = bend.isInward;
  const minZFlange = die.vWidth / 2;
  if (hasBendBefore && prevInward !== curInward && segBeforeFull < minZFlange) {
    problems.push('Полка слева ' + segBeforeFull.toFixed(1) + ' мм меньше V/2 (' + minZFlange.toFixed(1) + ' мм) — уже согнутая полка не даст сдвинуть деталь до центра ручья (Z-профиль)');
  }
  if (hasBendAfter && curInward !== nextInward && segAfterFull < minZFlange) {
    problems.push('Полка справа ' + segAfterFull.toFixed(1) + ' мм меньше V/2 (' + minZFlange.toFixed(1) + ' мм) — уже согнутая полка не даст сдвинуть деталь до центра ручья (Z-профиль)');
  }

  // 5. Крайняя полка длиннее высоты матрицы — при гибке кромка может
  //    упереться в подложку (стол / станину пресса).
  //    Используем ПОЛНУЮ длину сегмента (не уменьшенную на tangentDistance),
  //    т.к. физически опускается весь конец полки, включая зону радиуса.
  //    Вертикальное опускание = полная длина × sin(угол гиба).
  if (die.height > 0) {
    const bendRad = bend.bendAngle;
    const drop = Math.sin(bendRad);
    if (drop > 0) {
      if (!hasBendBefore && segBeforeFull * drop > die.height) {
        warnings.push('Крайняя полка слева ' + segBeforeFull.toFixed(1) + ' мм длиннее высоты матрицы ' + die.height + ' мм — при гибке кромка упрётся в подложку');
      }
      if (!hasBendAfter && segAfterFull * drop > die.height) {
        warnings.push('Крайняя полка справа ' + segAfterFull.toFixed(1) + ' мм длиннее высоты матрицы ' + die.height + ' мм — при гибке кромка упрётся в подложку');
      }
    }
  }

  return { ok: problems.length === 0, problems, warnings };
}

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
      const result = checkBendFeasibility(b, beforeLen, afterLen, segBeforeFull, segAfterFull, bendRadius, die, punch, !!prevBend, !!nextBend, checkDH, prevInward, nextInward);
      b.feasible = result.ok;
      b.problems = result.problems;
      b.warnings = result.warnings;
      b.flangeBefore = beforeLen;
      b.flangeAfter = afterLen;
    });
  }

  // Расчёт каймы (180° загиб)
  function calcHem(h) {
    if (!h || h <= 0) return 0;
    const R = bendRadius;
    return h - R - thickness + (Math.PI / 2) * (R + kFactor * thickness);
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

/**
 * Генерация DXF (R12 / AC1009 — максимальная совместимость)
 */
function generateDXF(res, br, kf, th, mtName, opts) {
  const L = res.totalLength, W = res.width;

  function n(v) {
    return parseFloat(Number(v).toFixed(6)).toString();
  }

  const dxf = [];

  // ══ HEADER ══
  dxf.push('0', 'SECTION', '2', 'HEADER');
  dxf.push('9', '$ACADVER', '1', 'AC1009');
  dxf.push('9', '$INSUNITS', '70', '4');
  dxf.push('9', '$HANDSEED', '5', 'FFFF');
  dxf.push('0', 'ENDSEC');

  // ══ TABLES ══
  dxf.push('0', 'SECTION', '2', 'TABLES');

  // LTYPE
  dxf.push('0', 'TABLE', '2', 'LTYPE', '70', '2');
  dxf.push('0', 'LTYPE', '2', 'CONTINUOUS', '70', '0', '3', 'Solid line', '72', '65', '73', '0', '40', '0');
  dxf.push('0', 'LTYPE', '2', 'DASHED', '70', '0', '3', 'Dashed line __ __ __ __ __ __ __ __ __ __', '72', '65', '73', '0', '40', '5');
  dxf.push('0', 'ENDTAB');

  // LAYER
  dxf.push('0', 'TABLE', '2', 'LAYER', '70', '2');
  dxf.push('0', 'LAYER', '2', 'OUTLINE', '70', '0', '62', '7', '6', 'CONTINUOUS');
  dxf.push('0', 'LAYER', '2', 'BEND', '70', '0', '62', '1', '6', 'DASHED');
  dxf.push('0', 'ENDTAB');

  // STYLE
  dxf.push('0', 'TABLE', '2', 'STYLE', '70', '1');
  dxf.push('0', 'STYLE', '2', 'STANDARD', '70', '0', '40', '0', '41', '1', '50', '0', '71', '0', '42', '5', '3', 'txt', '4', '');
  dxf.push('0', 'ENDTAB');

  dxf.push('0', 'ENDSEC');

  // ══ ENTITIES ══
  dxf.push('0', 'SECTION', '2', 'ENTITIES');

  // Контур заготовки (OUTLINE)
  dxf.push(
    '0', 'LINE', '8', 'OUTLINE',
    '10', n(0), '20', n(0), '30', '0',
    '11', n(L), '21', n(0), '31', '0'
  );
  dxf.push(
    '0', 'LINE', '8', 'OUTLINE',
    '10', n(L), '20', n(0), '30', '0',
    '11', n(L), '21', n(W), '31', '0'
  );
  dxf.push(
    '0', 'LINE', '8', 'OUTLINE',
    '10', n(L), '20', n(W), '30', '0',
    '11', n(0), '21', n(W), '31', '0'
  );
  dxf.push(
    '0', 'LINE', '8', 'OUTLINE',
    '10', n(0), '20', n(W), '30', '0',
    '11', n(0), '21', n(0), '31', '0'
  );

  // Линии гиба (включая кайму)
  res.bendLinePositions.forEach(x => {
    dxf.push(
      '0', 'LINE', '8', 'BEND',
      '10', n(x), '20', n(0), '30', '0',
      '11', n(x), '21', n(W), '31', '0'
    );
  });
  res.hemBendLinePositions.forEach(x => {
    dxf.push(
      '0', 'LINE', '8', 'BEND',
      '10', n(x), '20', n(0), '30', '0',
      '11', n(x), '21', n(W), '31', '0'
    );
  });

  dxf.push('0', 'ENDSEC', '0', 'EOF');

  return dxf.join('\n');
}

/**
 * Генерация SVG
 */
function generateSVG(res, br, kf, th, mtName) {
  const L = res.totalLength, W = res.width;
  const pad = 10;
  const svgW = L + pad * 2 + 80, svgH = W + pad * 2 + 50;
  let s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + svgW + '" height="' + svgH + '" viewBox="0 0 ' + svgW + ' ' + svgH + '">';
  s += '<rect x="' + pad + '" y="' + pad + '" width="' + L + '" height="' + W + '" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>';

  res.elements.forEach(el => {
    if (el.type === 'straight') {
      s += '<rect x="' + (pad + el.startX) + '" y="' + pad + '" width="' + (el.endX - el.startX) + '" height="' + W + '" fill="#dcfce7" stroke="#16a34a33" stroke-width="0.5"/>';
      if (el.length > 5) {
        const mx = (el.startX + el.endX) / 2;
        s += '<text x="' + (pad + mx) + '" y="' + (pad + W / 2) + '" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="bold" fill="#15803d">' + el.length.toFixed(1) + '</text>';
      }
    } else {
      s += '<rect x="' + (pad + el.startX) + '" y="' + pad + '" width="' + (el.endX - el.startX) + '" height="' + W + '" fill="#fed7aa" stroke="#ea580c33" stroke-width="0.5"/>';
      const mx = (el.startX + el.endX) / 2;
      s += '<text x="' + (pad + mx) + '" y="' + (pad + W / 2) + '" text-anchor="middle" dominant-baseline="central" font-size="9" fill="#c2410c">' + (el.angle * 180 / Math.PI).toFixed(0) + '°</text>';
    }
  });

  res.bendLinePositions.forEach((x, i) => {
    s += '<line x1="' + (pad + x) + '" y1="' + pad + '" x2="' + (pad + x) + '" y2="' + (pad + W) + '" stroke="#ea580c" stroke-width="1.5" stroke-dasharray="4 3"/>';
    s += '<circle cx="' + (pad + x) + '" cy="' + (pad + 20) + '" r="8" fill="#f97316" stroke="#fff" stroke-width="1.5"/>';
    s += '<text x="' + (pad + x) + '" y="' + (pad + 20) + '" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="bold" fill="#fff">' + (i + 1) + '</text>';
  });

  const dy = pad + W + 15;
  s += '<line x1="' + pad + '" y1="' + dy + '" x2="' + (pad + L) + '" y2="' + dy + '" stroke="#737373" stroke-width="0.8"/>';
  s += '<line x1="' + pad + '" y1="' + (dy - 4) + '" x2="' + pad + '" y2="' + (dy + 4) + '" stroke="#737373" stroke-width="0.8"/>';
  s += '<line x1="' + (pad + L) + '" y1="' + (dy - 4) + '" x2="' + (pad + L) + '" y2="' + (dy + 4) + '" stroke="#737373" stroke-width="0.8"/>';
  s += '<text x="' + (pad + L / 2) + '" y="' + (dy + 14) + '" text-anchor="middle" font-size="10" font-family="monospace" fill="#525252">' + L.toFixed(1) + ' mm</text>';
  s += '<text x="' + pad + '" y="' + (dy + 30) + '" font-size="8" fill="#a3a3a3">Metal: ' + mtName + ' | T: ' + th + ' mm | K: ' + kf + ' | R: ' + br + ' mm</text>';
  return s + '</svg>';
}
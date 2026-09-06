// ═══════════════════════════════════════════════════════════════
// SIMULATION / ОТРИСОВКА — профиль (согнутый/несогнутый), лицевая
// сторона, маркеры гибов, углы, усилие гибки, hit-тестирование
// ═══════════════════════════════════════════════════════════════

function drawPolyline(ctx, pts) {
  if (!pts || pts.length < 2) return;
  ctx.beginPath();
  const first = w2c(pts[0].x, pts[0].y);
  ctx.moveTo(first.cx, first.cy);
  for (let i = 1; i < pts.length; i++) {
    const p = w2c(pts[i].x, pts[i].y);
    ctx.lineTo(p.cx, p.cy);
  }
  ctx.stroke();
}

// Согнутый профиль — оранжевый, с полосой толщины металла и точками вершин
function drawBentProfile(pts, ctx, isDark) {
  if (!pts || pts.length < 2) return;
  const T = S.metal.thickness || 1;
  ctx.save();
  ctx.strokeStyle = isDark ? '#f9731622' : '#ea580c22';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  drawPolyline(ctx, pts);
  ctx.restore();
  // v4.7: полоса металла — толщина линии = выбранной толщине металла
  // (центральная линия = средней линии листа, торцы перпендикулярно)
  ctx.save();
  ctx.strokeStyle = isDark ? 'rgba(251,146,60,0.30)' : 'rgba(234,88,12,0.25)';
  ctx.lineWidth = Math.max(2, T * S.viewport.scale);
  ctx.lineCap = 'butt'; ctx.lineJoin = 'round';
  drawPolyline(ctx, pts);
  ctx.restore();
  ctx.strokeStyle = isDark ? '#f97316' : '#ea580c';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  drawPolyline(ctx, pts);
  // v4.9: точки дуги каймы — НЕ вершины профиля, кружки не рисуем
  // (иначе дуга заворота выглядит «пунктиром» из точек);
  // v5.0: то же для точек дуг гибов (_bendArc) — касательные точки и хорды
  // не являются вершинами исходного профиля
  pts.forEach(pt => {
    if (pt._hemArc || pt._bendArc) return;
    const c = w2c(pt.x, pt.y);
    ctx.beginPath();
    ctx.arc(c.cx, c.cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#f97316aa' : '#ea580caa';
    ctx.fill();
  });
}

// Несогнутый (плоский) профиль — зелёный
function drawSimProfile(pts, ctx, isDark) {
  if (!pts || pts.length < 2) return;
  const T = S.metal.thickness || 1;
  ctx.save();
  ctx.strokeStyle = isDark ? '#22c55e22' : '#16a34a22';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  drawPolyline(ctx, pts);
  ctx.restore();
  // v4.7: полоса металла — толщина линии = выбранной толщине металла
  ctx.save();
  ctx.strokeStyle = isDark ? 'rgba(74,222,128,0.30)' : 'rgba(34,197,94,0.25)';
  ctx.lineWidth = Math.max(2, T * S.viewport.scale);
  ctx.lineCap = 'butt'; ctx.lineJoin = 'round';
  drawPolyline(ctx, pts);
  ctx.restore();
  ctx.strokeStyle = isDark ? '#22c55e' : '#16a34a';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  drawPolyline(ctx, pts);
  // v4.9: точки дуги каймы — без кружков (не вершины профиля);
  // v5.0: и точки дуг гибов (_bendArc)
  pts.forEach(pt => {
    if (pt._hemArc || pt._bendArc) return;
    const c = w2c(pt.x, pt.y);
    ctx.beginPath();
    ctx.arc(c.cx, c.cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#22c55eaa' : '#16a34aaa';
    ctx.fill();
  });
}

/**
 * Внутренние углы согнутых гибов: «90°», «59°» или «180°» (кайма).
 * Кайма — фиолетовый цвет, ключи вида 'hem0', 'hem1'…
 */
function drawBendAngles(prof, ctx, isDark) {
  if (!prof || !prof.bendAngles || !prof.pts) return;
  const bends = (S.unfoldResult && S.unfoldResult.bendInfos) ? S.unfoldResult.bendInfos : [];
  const hemViMap = {};
  if (prof.bendMarkers) {
    prof.bendMarkers.forEach(m => {
      if (m.isHem) hemViMap[m.index] = m.vertexIndex;
    });
  }
  for (const bIdx in prof.bendAngles) {
    const angle = prof.bendAngles[bIdx];
    const angleDeg = (angle * 180 / Math.PI).toFixed(0);
    const isHem = typeof bIdx === 'string' && bIdx.indexOf('hem') === 0;
    let vi;
    let marker = null;
    if (isHem) {
      vi = hemViMap[bIdx];
    } else {
      vi = bends[bIdx] ? bends[bIdx].vertexIndex : 0;
      marker = prof.bendMarkers ? prof.bendMarkers.find(m => m.index === parseInt(bIdx)) : null;
      if (marker) vi = marker.vertexIndex;
    }
    if (vi === undefined || vi < 0 || vi >= prof.pts.length) continue;
    // v5.0: позиция подписи — позиция МАРКЕРА (виртуальное остриё гиба,
    // совпадает с линией гиба на развёртке). Индекс в pts после вставки
    // дуг указывает на касательную точку — чуть в стороне от оси гиба.
    const labelX = (marker && Number.isFinite(marker.x)) ? marker.x : prof.pts[vi].x;
    const labelY = (marker && Number.isFinite(marker.y)) ? marker.y : prof.pts[vi].y;
    const c = w2c(labelX, labelY);
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const text = angleDeg + '°';
    const tw = ctx.measureText(text).width;
    ctx.fillStyle = isDark ? 'rgba(26,26,46,0.85)' : 'rgba(255,255,255,0.85)';
    ctx.fillRect(c.cx + 14, c.cy - 7, tw + 6, 14);
    ctx.fillStyle = isHem ? '#a855f7' : (isDark ? '#fbbf24' : '#d97706');
    ctx.fillText(text, c.cx + 17, c.cy);
  }
}

/**
 * Лицевая сторона заготовки — голубая линия вдоль исходной «верхней»
 * грани металла, которая при гибке разворачивается вместе с металлом.
 *
 * Физика: лицевая сторона = исходная +Y поверхность плоского листа.
 * simFlipX — видовое зеркало (X-зеркало меняет направление обхода).
 * simFlipY — ФИЗИЧЕСКИЙ переворот заготовки вокруг оси гиба: лицо
 * оказывается с другой стороны ВСЕГДА (и на плоской заготовке),
 * т.к. отображаемая геометрия зеркалится с той же чётностью (v4.2).
 */
function drawFaceSide(pts, ctx, isDark) {
  if (!pts || pts.length < 2) return;
  const T = S.metal.thickness || 1;
  let faceUp = (S.simFaceSide || 'up') === 'up';
  if (S.simFlipX) faceUp = !faceUp;
  if (S.simFlipY) faceUp = !faceUp;
  const sign = faceUp ? 1 : -1;
  const off = T / 2;
  ctx.save();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  let started = false;
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i + 1].x - pts[i].x;
    const dy = pts[i + 1].y - pts[i].y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) continue;
    const nx = -dy / len * sign * off;
    const ny = dx / len * sign * off;
    const a = w2c(pts[i].x + nx, pts[i].y + ny);
    const b = w2c(pts[i + 1].x + nx, pts[i + 1].y + ny);
    if (!started) { ctx.moveTo(a.cx, a.cy); started = true; }
    else ctx.lineTo(a.cx, a.cy);
    ctx.lineTo(b.cx, b.cy);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * Маркеры точек гиба:
 *   кайма — фиолетовые, согнутые — зелёные с галочкой + №,
 *   выбранный — жёлтый, прочие — синие с №.
 */
function drawSimMarkers(markers, selectedBendIdx, ctx, isDark) {
  if (!markers || markers.length === 0) return;
  markers.forEach(m => {
    const c = w2c(m.x, m.y);
    const isSelected = (m.index === selectedBendIdx);
    const isBent = m.isBent;
    const isHem = !!m.isHem;

    ctx.beginPath();
    ctx.arc(c.cx, c.cy, isSelected ? SELECTED_MARKER_RADIUS : MARKER_RADIUS, 0, Math.PI * 2);

    if (isHem) {
      ctx.fillStyle = isDark ? '#a855f755' : '#a855f744';
      ctx.fill();
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(c.cx - 4, c.cy + 2);
      ctx.lineTo(c.cx, c.cy - 3);
      ctx.lineTo(c.cx + 4, c.cy + 2);
      ctx.stroke();
    } else if (isBent) {
      ctx.fillStyle = isDark ? '#22c55e55' : '#22c55e44';
      ctx.fill();
      ctx.strokeStyle = isDark ? '#22c55e' : '#16a34a';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(c.cx - 4, c.cy);
      ctx.lineTo(c.cx - 1, c.cy + 3);
      ctx.lineTo(c.cx + 4, c.cy - 3);
      ctx.stroke();
      ctx.fillStyle = isDark ? '#22c55e' : '#16a34a';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('№' + m.bendOrder, c.cx, c.cy - MARKER_RADIUS - 2);
    } else if (isSelected) {
      ctx.fillStyle = isDark ? '#f59e0b66' : '#f59e0b44';
      ctx.fill();
      ctx.strokeStyle = isDark ? '#f59e0b' : '#d97706';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(c.cx, c.cy, HOVER_MARKER_RADIUS, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? '#f59e0b88' : '#d9770666';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      ctx.fillStyle = isDark ? '#3b82f644' : '#3b82f633';
      ctx.fill();
      ctx.strokeStyle = isDark ? '#3b82f6' : '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Кайма (hem) сохраняет подпись К1, К2…
    if (isHem) {
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(m.label, c.cx, c.cy + MARKER_RADIUS + 2);
    }

    // № гиба над маркером (для согнутых — порядок выполнения)
    if (!isBent) {
      ctx.fillStyle = isDark ? '#8888aa' : '#737373';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('\u2116' + (m.index + 1), c.cx, c.cy - MARKER_RADIUS - 2);
    } else {
      ctx.fillStyle = isDark ? '#22c55e' : '#16a34a';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('\u2116' + m.bendOrder, c.cx, c.cy - MARKER_RADIUS - 2);
    }
  });
}

// Статусная строка симуляции (режим, прогресс, подсказки)
function drawSimLabels(totalBends, ctx, isDark, animInfo, bentCount) {
  const isRu = S.lang === 'ru';
  ctx.fillStyle = isDark ? '#f59e0b' : '#d97706';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  if (animInfo && animInfo.animating) {
    const interiorDeg = (animInfo.interiorAngle * 180 / Math.PI).toFixed(0);
    const depthMm = animInfo.depth.toFixed(1);
    const stepInfo = animInfo.sequenceStep >= 0
      ? (isRu ? 'Шаг ' + (animInfo.sequenceStep + 1) + '/' + animInfo.sequenceTotal + ' • ' : 'Step ' + (animInfo.sequenceStep + 1) + '/' + animInfo.sequenceTotal + ' • ')
      : '';
    ctx.fillText(
      isRu
        ? '⚙ V-гибка ' + stepInfo + 'гиб ' + (animInfo.bendIdx + 1) + ' • угол ' + interiorDeg + '° • глубина ' + depthMm + ' мм'
        : '⚙ V-bending ' + stepInfo + 'bend ' + (animInfo.bendIdx + 1) + ' • angle ' + interiorDeg + '° • depth ' + depthMm + ' mm',
      10, 10
    );
    ctx.font = '9px sans-serif';
    ctx.fillStyle = isDark ? '#93c5fd' : '#3b82f6';
    ctx.fillText(isRu ? 'Заготовка сгибается вверх…' : 'Blank bending upward…', 10, 26);
    return;
  }

  const mode = isRu ? 'РУЧНОЙ режим' : 'MANUAL mode';
  if (bentCount > 0) {
    ctx.fillText(
      isRu
        ? '[' + mode + '] Согнуто: ' + bentCount + '/' + totalBends + ' гибов'
        : '[' + mode + '] Bent: ' + bentCount + '/' + totalBends + ' bends',
      10, 10
    );
    ctx.font = '9px sans-serif';
    ctx.fillStyle = isDark ? '#93c5fd' : '#3b82f6';
    ctx.fillText(
      isRu
        ? 'ЛКМ по точке — выбрать гиб • ещё ЛКМ — согнуть V вверх • ПКМ по последнему — разогнуть'
        : 'LMB point — select bend • LMB again — bend V up • RMB last — unbend',
      10, 26
    );
  } else {
    ctx.fillText(
      isRu ? '[' + mode + '] ЛКМ по точке гиба — выбрать' : '[' + mode + '] LMB bend point — select',
      10, 10
    );
    ctx.font = '9px sans-serif';
    ctx.fillStyle = isDark ? '#93c5fd' : '#3b82f6';
    ctx.fillText(
      isRu
        ? 'Гибов: ' + totalBends + ' • ЛКМ выбрать • ещё ЛКМ согнуть вверх • порядок любой'
        : 'Bends: ' + totalBends + ' • LMB select • LMB again bend up • any order',
      10, 26
    );
  }
}

/**
 * Усилие гибки (в тоннах) для выбранного/анимируемого гиба.
 * Формула air bending — см. calcBendForce в engine/geometry.js.
 */
function drawBendForceLabel(ctx, isDark, animInfo, activeBendIdx) {
  if (!S.unfoldResult || !S.unfoldResult.bendInfos) return;
  const isRu = S.lang === 'ru';
  let bendIdx = -1, interiorAngle = Math.PI;
  if (animInfo && animInfo.animating) {
    bendIdx = animInfo.bendIdx;
    interiorAngle = animInfo.interiorAngle;
  } else if (activeBendIdx >= 0 && S.selectedBendIndex !== undefined) {
    bendIdx = S.selectedBendIndex;
    const b = S.unfoldResult.bendInfos[bendIdx];
    if (!b) return;
    // Целевой внутренний угол (π - bendAngle), до которого нужно согнуть
    interiorAngle = Math.PI - b.bendAngle;
  } else {
    return;
  }
  const b = S.unfoldResult.bendInfos[bendIdx];
  if (!b) return;
  const die = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
  if (!die || !die.vWidth) return;
  const force = calcBendForce(interiorAngle, S.metal.thickness, S.metal.width, die, S.metal.metalTypeIndex);
  const tons = force.tons;
  const tonsStr = tons < 1 ? tons.toFixed(2) : tons < 10 ? tons.toFixed(1) : Math.round(tons);
  const mt = METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0];
  const mtName = isRu ? mt.nameRu : mt.nameEn;
  const x = canvasW - 10;
  const y = 10;
  ctx.save();
  ctx.textAlign = 'right'; ctx.textBaseline = 'top';
  const lines = [
    (isRu ? 'Усилие гиба: ' : 'Bend force: ') + tonsStr + (isRu ? ' т' : ' t'),
    (isRu ? 'Металл: ' : 'Metal: ') + mtName + '  T=' + S.metal.thickness + '  V=' + die.vWidth,
    (isRu ? 'Угол: ' : 'Angle: ') + Math.round(interiorAngle * 180 / Math.PI) + '°  ' +
      (isRu ? 'Ширина: ' : 'Width: ') + S.metal.width + ' мм'
  ];
  ctx.font = 'bold 12px sans-serif';
  const bgH = lines.length * 16 + 8;
  const maxW = Math.max.apply(null, lines.map(function(l) { return ctx.measureText(l).width; }));
  ctx.fillStyle = isDark ? 'rgba(26,26,46,0.85)' : 'rgba(255,255,255,0.85)';
  ctx.fillRect(x - maxW - 8, y - 2, maxW + 16, bgH);
  ctx.strokeStyle = isDark ? '#f59e0b66' : '#d9770666';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - maxW - 8, y - 2, maxW + 16, bgH);
  ctx.fillStyle = isDark ? '#fbbf24' : '#b45309';
  ctx.fillText(lines[0], x, y + 2);
  ctx.font = '9px sans-serif';
  ctx.fillStyle = isDark ? '#d1d5db' : '#666';
  ctx.fillText(lines[1], x, y + 18);
  ctx.fillText(lines[2], x, y + 32);
  ctx.restore();
}

// ==================== HIT-TESTING МАРКЕРОВ ====================

function findMarkerAt(markers, cx, cy) {
  if (!markers || markers.length === 0) return null;
  let best = null, bestDist = Infinity;
  for (const m of markers) {
    const c = w2c(m.x, m.y);
    const d = Math.sqrt((c.cx - cx) ** 2 + (c.cy - cy) ** 2);
    if (d < MARKER_HIT_RADIUS && d < bestDist) { bestDist = d; best = m; }
  }
  return best;
}

function findMarkerHover(markers, cx, cy) {
  if (!markers || markers.length === 0) return -1;
  let bestIdx = -1, bestDist = Infinity;
  for (let mi = 0; mi < markers.length; mi++) {
    const m = markers[mi];
    const c = w2c(m.x, m.y);
    const d = Math.sqrt((c.cx - cx) ** 2 + (c.cy - cy) ** 2);
    if (d < MARKER_HIT_RADIUS && d < bestDist) { bestDist = d; bestIdx = mi; }
  }
  return bestIdx;
}

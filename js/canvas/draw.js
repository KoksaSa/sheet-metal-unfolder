// ═══════════════════════════════════════════════════════════════
// CANVAS / DRAW — главный холст рисования: сетка, оси, профиль,
// размеры, точки, кайма, симуляция гибочного станка (2D)
// ═══════════════════════════════════════════════════════════════

// v5.9: Путь профиля с ГЛАДКИМИ радиусными дугами. Соседние точки с
// одинаковой меткой _radiusArc лежат на одной окружности (центр/радиус
// в метке) — пару соединяем не хордой, а подразделённой дугой. Прямые
// сегменты (без метки) — как обычно. Строит путь (beginPath…), НЕ
// штрихует — вызывающий задаёт стиль и вызывает stroke().
function pathProfile(ctx, pts) {
  ctx.beginPath();
  if (!pts || !pts.length) return;
  const f = w2c(pts[0].x, pts[0].y);
  ctx.moveTo(f.cx, f.cy);
  for (let i = 0; i < pts.length - 1; i++) {
    const A = pts[i], B = pts[i + 1];
    const am = A._radiusArc, bm = B._radiusArc;
    if (am && bm && am.id === bm.id && Number.isFinite(am.cx) && Number.isFinite(am.cy) && am.r > 0) {
      // Хорда дуги: подводим дугу (6 подшагов на пару — визуально гладко)
      const aA = Math.atan2(A.y - am.cy, A.x - am.cx);
      const aB = Math.atan2(B.y - am.cy, B.x - am.cx);
      const d = normAngle(aB - aA);
      if (Math.abs(d) > 1e-9) {
        const SUB = 6;
        for (let k = 1; k <= SUB; k++) {
          const a = aA + d * k / SUB;
          const c = w2c(am.cx + Math.cos(a) * am.r, am.cy + Math.sin(a) * am.r);
          ctx.lineTo(c.cx, c.cy);
        }
        continue;
      }
    }
    const c = w2c(B.x, B.y);
    ctx.lineTo(c.cx, c.cy);
  }
}

// v5.9: длина сегмента профиля: для дуги — по ДУГЕ (r·Δφ), для прямой — хорда
function profileSegLength(pts, i) {
  const A = pts[i], B = pts[i + 1];
  const am = A._radiusArc, bm = B._radiusArc;
  if (am && bm && am.id === bm.id && Number.isFinite(am.cx) && Number.isFinite(am.cy) && am.r > 0) {
    const aA = Math.atan2(A.y - am.cy, A.x - am.cx);
    const aB = Math.atan2(B.y - am.cy, B.x - am.cx);
    return am.r * Math.abs(normAngle(aB - aA));
  }
  return dist(A, B);
}

function drawDrawCanvas() {
  if (!drawCtx) return;
  const dpr = window.devicePixelRatio || 1;
  drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const w = canvasW, h = canvasH;
  const isDark = S.isDark;
  let drawDrawCanvasSimDone = false;

  // Сброс hit areas
  S._hitAreas = [];

  // Clear
  drawCtx.fillStyle = isDark ? '#1a1a2e' : '#fafafa';
  drawCtx.fillRect(0, 0, w, h);

  // Spotlight when empty
  if (S.points.length === 0) {
    const grd = drawCtx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * .6);
    grd.addColorStop(0, isDark ? 'rgba(34,197,94,.04)' : 'rgba(22,163,74,.05)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    drawCtx.fillStyle = grd;
    drawCtx.fillRect(0, 0, w, h);
    drawCtx.fillStyle = isDark ? 'rgba(163,163,184,.3)' : 'rgba(82,82,82,.25)';
    drawCtx.font = 'bold 14px sans-serif';
    drawCtx.textAlign = 'center';
    drawCtx.textBaseline = 'middle';
    drawCtx.fillText(t('drawProfile'), w / 2, h / 2 - 10);
    drawCtx.font = '11px sans-serif';
    drawCtx.fillText(t('drawProfileHint'), w / 2, h / 2 + 12);
  }

  // World bounds
  const tl = c2w(0, 0), br = c2w(w, h);
  const wMinX = Math.min(tl.x, br.x), wMaxX = Math.max(tl.x, br.x);
  const wMinY = Math.min(tl.y, br.y), wMaxY = Math.max(tl.y, br.y);
  const gs = S.gridSize;

  // Minor grid
  drawCtx.strokeStyle = isDark ? '#2a2a3e' : '#e5e5e5';
  drawCtx.lineWidth = .5;
  drawCtx.beginPath();
  for (let gx = Math.floor(wMinX / gs) * gs; gx <= Math.ceil(wMaxX / gs) * gs; gx += gs) {
    const { cx } = w2c(gx, 0);
    drawCtx.moveTo(cx, 0);
    drawCtx.lineTo(cx, h);
  }
  for (let gy = Math.floor(wMinY / gs) * gs; gy <= Math.ceil(wMaxY / gs) * gs; gy += gs) {
    const { cy } = w2c(0, gy);
    drawCtx.moveTo(0, cy);
    drawCtx.lineTo(w, cy);
  }
  drawCtx.stroke();

  // Major grid
  const mg = gs * 5;
  drawCtx.strokeStyle = isDark ? '#3a3a4e' : '#d4d4d4';
  drawCtx.lineWidth = 1;
  drawCtx.beginPath();
  for (let gx = Math.floor(wMinX / mg) * mg; gx <= Math.ceil(wMaxX / mg) * mg; gx += mg) {
    const { cx } = w2c(gx, 0);
    drawCtx.moveTo(cx, 0);
    drawCtx.lineTo(cx, h);
  }
  for (let gy = Math.floor(wMinY / mg) * mg; gy <= Math.ceil(wMaxY / mg) * mg; gy += mg) {
    const { cy } = w2c(0, gy);
    drawCtx.moveTo(0, cy);
    drawCtx.lineTo(w, cy);
  }
  drawCtx.stroke();

  // Origin
  const o = w2c(0, 0);
  drawCtx.strokeStyle = isDark ? '#22c55e88' : '#16a34a66';
  drawCtx.lineWidth = 1.5;
  drawCtx.beginPath();
  drawCtx.moveTo(o.cx - 8, o.cy); drawCtx.lineTo(o.cx + 8, o.cy);
  drawCtx.moveTo(o.cx, o.cy - 8); drawCtx.lineTo(o.cx, o.cy + 8);
  drawCtx.stroke();
  drawCtx.beginPath();
  drawCtx.arc(o.cx, o.cy, 3, 0, Math.PI * 2);
  drawCtx.fillStyle = isDark ? '#22c55e44' : '#16a34a33';
  drawCtx.fill();
  drawCtx.strokeStyle = isDark ? '#22c55e88' : '#16a34a66';
  drawCtx.lineWidth = 1;
  drawCtx.stroke();

  // Axes
  drawCtx.strokeStyle = isDark ? '#555570' : '#a3a3a3';
  drawCtx.lineWidth = 1.5;
  drawCtx.beginPath();
  drawCtx.moveTo(0, o.cy); drawCtx.lineTo(w, o.cy);
  drawCtx.moveTo(o.cx, 0); drawCtx.lineTo(o.cx, h);
  drawCtx.stroke();

  // Axis labels
  drawCtx.fillStyle = isDark ? '#8888aa' : '#737373';
  drawCtx.font = '11px sans-serif';
  drawCtx.textAlign = 'right'; drawCtx.textBaseline = 'top';
  drawCtx.fillText('X', w - 4, o.cy + 4);
  drawCtx.textAlign = 'left'; drawCtx.textBaseline = 'bottom';
  drawCtx.fillText('Y', o.cx + 4, 14);
  drawCtx.textAlign = 'right'; drawCtx.textBaseline = 'top';
  drawCtx.font = '9px sans-serif';
  drawCtx.fillText('0', o.cx - 4, o.cy + 2);

  // Grid labels
  drawCtx.fillStyle = isDark ? '#555570' : '#a3a3a3';
  drawCtx.font = '9px sans-serif';
  drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'top';
  for (let gx = Math.floor(wMinX / mg) * mg; gx <= Math.ceil(wMaxX / mg) * mg; gx += mg) {
    if (gx === 0) continue;
    const { cx } = w2c(gx, 0);
    if (cx > 25 && cx < w - 25) drawCtx.fillText(String(gx), cx, o.cy + 2);
  }
  drawCtx.textAlign = 'right'; drawCtx.textBaseline = 'middle';
  for (let gy = Math.floor(wMinY / mg) * mg; gy <= Math.ceil(wMaxY / mg) * mg; gy += mg) {
    if (gy === 0) continue;
    const { cy } = w2c(0, gy);
    if (cy > 15 && cy < h - 10) drawCtx.fillText(String(gy), o.cx - 4, cy);
  }

  // Axis labels along edges
  if (S.showAxisLabels) {
    const pad = 25;
    drawCtx.fillStyle = isDark ? '#6b6b8a' : '#9ca3af';
    drawCtx.font = '9px monospace';
    drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'top';
    const lsx = gs * Math.max(1, Math.ceil(30 / (gs * S.viewport.scale)));
    for (let gx = Math.floor(wMinX / lsx) * lsx; gx <= Math.ceil(wMaxX / lsx) * lsx; gx += lsx) {
      const { cx } = w2c(gx, 0);
      if (cx > pad && cx < w - pad) drawCtx.fillText(gx % 1 === 0 ? String(gx) : gx.toFixed(1), cx, h - pad + 6);
    }
    drawCtx.textAlign = 'right'; drawCtx.textBaseline = 'middle';
    for (let gy = Math.floor(wMinY / lsx) * lsx; gy <= Math.ceil(wMaxY / lsx) * lsx; gy += lsx) {
      const { cy } = w2c(0, gy);
      if (cy > 12 && cy < h - pad) drawCtx.fillText(gy % 1 === 0 ? String(gy) : gy.toFixed(1), pad - 4, cy);
    }
  }

  // ==================== РЕЖИМ СИМУЛЯЦИИ ====================
  // Накопительная симуляция гибочного станка:
  //  • Матрица снизу с V-ручьём (статичная)
  //  • Пуансон сверху — опускается в матрицу при гибке
  //  • Металл плавно деформируется: V-сгиб с углом = f(глубины)
  //  • Гибы НАКАПЛИВАЮТСЯ: каждый выполненный гиб сохраняется
  if (S.showToolsOnCanvas && S.unfoldResult && S.points.length >= 2) {
    const animInfo = getAnimInfo();
    const isAnimating = animInfo && animInfo.animating;
    const bentCount = (S.simBentMarkers || []).length;

    // Накопительный профиль (все выполненные гибы + анимируемый)
    const prof = computeAccumulatedProfile(animInfo);

    // v5.9: коллизия контура с телом пуансона при ТЕКУЩЕМ положении
    // пуансона (в покое / во время анимации — «живой» отклик)
    let punchCollision = null;
    if (prof && prof.pts && typeof detectPunchCollision === 'function') {
      punchCollision = detectPunchCollision(prof.pts, punchTipWorldY(animInfo));
    }

    // === МАТРИЦА И ПУАНСОНОМ (рисуются под профилем) ===
    // v5.9: при коллизии пуансон подсвечивается красным
    drawPressBrakeTooling(isDark, animInfo, punchCollision);

    if (prof && prof.pts) {
      // Профиль: если есть согнутые гибы или анимация — оранжевым,
      // иначе (плоский) — зелёным
      if (bentCount > 0 || isAnimating) {
        drawBentProfile(prof.pts, drawCtx, isDark);
      } else {
        drawSimProfile(prof.pts, drawCtx, isDark);
      }
      // Лицевая сторона (голубой контур)
      if (typeof drawFaceSide === 'function') drawFaceSide(prof.pts, drawCtx, isDark);
      // Углы согнутых гибов (внутренний угол)
      if (typeof drawBendAngles === 'function') drawBendAngles(prof, drawCtx, isDark);
      // Маркеры с порядковыми номерами для согнутых
      drawSimMarkers(prof.bendMarkers, S.selectedBendIndex, drawCtx, isDark);
      // Подписи
      drawSimLabels(prof.bendMarkers.length, drawCtx, isDark, animInfo, bentCount);
      // Усилие гибки (в тоннах) — для выбранного/анимируемого гиба
      drawBendForceLabel(drawCtx, isDark, animInfo, prof.activeBendIdx);
      // Упор (задний упор гибочного пресса)
      if (typeof drawStopper === 'function') drawStopper(prof, isDark);
      // v5.9: точки касания контура с пуансоном — красные маркеры
      if (punchCollision && typeof drawPunchCollisionMarks === 'function') {
        drawPunchCollisionMarks(punchCollision, isDark);
      }
    }

    drawDrawCanvasSimDone = true;
  }

  // ==================== ПРОФИЛЬ (режим рисования) ====================
  if (S.points.length >= 2 && !drawDrawCanvasSimDone) {
    // v4.7: полоса металла — толщина линии = выбранной толщине металла
    // (T в мм × масштаб вьюпорта). Центральная линия профиля = СРЕДНЕЙ
    // линии листа; полоса показывает реальное сечение материала, торцы —
    // перпендикулярно сегментам (butt), стыки — скруглены (round).
    const bandT = S.metal.thickness || 1;
    const bandW = Math.max(2, bandT * S.viewport.scale);
    drawCtx.save();
    drawCtx.strokeStyle = isDark ? 'rgba(148,163,184,0.40)' : 'rgba(100,116,139,0.32)';
    drawCtx.lineWidth = bandW;
    drawCtx.lineCap = 'butt';
    drawCtx.lineJoin = 'round';
    pathProfile(drawCtx, S.points); // v5.9: гладкие дуги радиусных гибов
    drawCtx.stroke();
    drawCtx.restore();

    // Glow
    drawCtx.save();
    drawCtx.strokeStyle = isDark ? '#22c55e22' : '#16a34a22';
    drawCtx.lineWidth = 8;
    drawCtx.lineCap = 'round'; drawCtx.lineJoin = 'round';
    pathProfile(drawCtx, S.points); // v5.9
    drawCtx.stroke();
    drawCtx.restore();

    // Main line
    drawCtx.strokeStyle = isDark ? '#22c55e' : '#16a34a';
    drawCtx.lineWidth = 2.5;
    drawCtx.lineCap = 'round'; drawCtx.lineJoin = 'round';
    pathProfile(drawCtx, S.points); // v5.9
    drawCtx.stroke();

    // === Лицевая сторона (голубая полоска вдоль профиля) ===
    drawFaceSideDrawing(S.points, drawCtx);

    // ==================== РАЗМЕРЫ С УМНЫМ РАЗМЕЩЕНИЕМ ====================
    if (S.showDimensions) {

      function rectsOverlap(a, b, pad) {
        const p = pad || 3;
        const ox = Math.min(a.x + a.w / 2, b.x + b.w / 2) - Math.max(a.x - a.w / 2, b.x - b.w / 2);
        const oy = Math.min(a.y + a.h / 2, b.y + b.h / 2) - Math.max(a.y - a.h / 2, b.y - b.h / 2);
        return ox > p && oy > p;
      }

      const placed = [];
      const dimLabels = [];

      // 1. Подписи длин сегментов
      drawCtx.font = '10px monospace';
      for (let i = 0; i < S.points.length - 1; i++) {
        // v5.9: для сегментов дуги — длина по ДУГЕ (r·Δφ), не хорда
        const sl = profileSegLength(S.points, i);
        const mx = (S.points[i].x + S.points[i + 1].x) / 2;
        const my = (S.points[i].y + S.points[i + 1].y) / 2;
        const mc = w2c(mx, my);
        const a = Math.atan2(S.points[i + 1].y - S.points[i].y, S.points[i + 1].x - S.points[i].x);
        const nX = -Math.sin(a), nY = Math.cos(a);
        const aX = Math.cos(a), aY = -Math.sin(a);
        const text = sl.toFixed(1);
        const tw = drawCtx.measureText(text).width + 8;

        const ideal = { x: mc.cx + nX * 14, y: mc.cy + nY * 14 };

        // Кандидаты: обе стороны нормали, разные дистанции, сдвиги вдоль сегмента
        const cands = [];
        const dists = [14, 26, 38, 52];
        const sides = [1, -1];
        const shifts = [0, -28, 28];
        for (const side of sides) {
          for (const d of dists) {
            for (const sh of shifts) {
              cands.push({
                x: mc.cx + nX * d * side + aX * sh,
                y: mc.cy + nY * d * side + aY * sh,
                rank: d * 3 + Math.abs(sh)
              });
            }
          }
        }
        cands.sort((x, y) => x.rank - y.rank);

        let chosen = null;
        for (const c of cands) {
          if (c.x < 8 || c.x > w - 8 || c.y < 8 || c.y > h - 8) continue;
          const cand = { type: 'length', index: i, text, x: c.x, y: c.y, w: tw, h: 14, idealX: ideal.x, idealY: ideal.y };
          if (!placed.some(p => rectsOverlap(p, cand))) { chosen = cand; break; }
        }
        if (!chosen) chosen = { type: 'length', index: i, text, x: ideal.x, y: ideal.y, w: tw, h: 14, idealX: ideal.x, idealY: ideal.y };
        placed.push(chosen);
        dimLabels.push(chosen);
      }

      // 2. Дуги углов + подписи углов
      const bendFeasMap = {};
      if (S.unfoldResult && S.unfoldResult.bendInfos) {
        S.unfoldResult.bendInfos.forEach(b => { bendFeasMap[b.vertexIndex] = b; });
      }
      for (let i = 1; i < S.points.length - 1; i++) {
        const prev = S.points[i - 1], curr = S.points[i], next = S.points[i + 1];
        const aIn = Math.atan2(curr.y - prev.y, curr.x - prev.x);
        const aOut = Math.atan2(next.y - curr.y, next.x - curr.x);
        let def = aOut - aIn;
        while (def > Math.PI) def -= 2 * Math.PI;
        while (def <= -Math.PI) def += 2 * Math.PI;
        const ba = Math.abs(def);
        if (ba < 5 * Math.PI / 180 || ba > Math.PI - 5 * Math.PI / 180) continue;
        const p = w2c(curr.x, curr.y);
        const ar = 18;
        const bInfo = bendFeasMap[i];
        const infeasible = bInfo && bInfo.feasible === false;

        // Дуга показывает угол поворота контура (внутренний угол = π − ba)
        const cs = -aIn + Math.PI;
        const ce = -aOut;
        let ds = ce - cs;
        while (ds > Math.PI) ds -= 2 * Math.PI;
        while (ds <= -Math.PI) ds += 2 * Math.PI;
        const ccw = ds < 0;

        drawCtx.beginPath();
        drawCtx.arc(p.cx, p.cy, ar, cs, ce, ccw);
        drawCtx.strokeStyle = infeasible ? '#ef4444' : (isDark ? '#fbbf24' : '#f59e0b');
        drawCtx.lineWidth = infeasible ? 3 : 1.5;
        drawCtx.stroke();
        if (infeasible) {
          drawCtx.beginPath();
          drawCtx.arc(p.cx, p.cy, ar + 4, 0, Math.PI * 2);
          drawCtx.strokeStyle = 'rgba(239,68,68,0.3)';
          drawCtx.lineWidth = 2;
          drawCtx.stroke();
        }
        const mid = cs + ds / 2;
        drawCtx.font = 'bold 9px sans-serif';
        const angleText = ((180 - ba * 180 / Math.PI)).toFixed(0) + '°';
        const atw = drawCtx.measureText(angleText).width + 8;

        const cands = [];
        const dists2 = [28, 38, 50, 64];
        for (const d of dists2) {
          for (let k = 0; k < 8; k++) {
            const ang = mid + k * Math.PI / 4;
            cands.push({
              x: p.cx + Math.cos(ang) * d,
              y: p.cy + Math.sin(ang) * d,
              rank: Math.abs(Math.atan2(Math.sin(ang - mid), Math.cos(ang - mid))) * 40 + d
            });
          }
        }
        cands.sort((x, y) => x.rank - y.rank);

        let chosen = null;
        for (const c of cands) {
          if (c.x < 8 || c.x > w - 8 || c.y < 8 || c.y > h - 8) continue;
          const cand = { type: 'angle', text: angleText, x: c.x, y: c.y, w: atw, h: 14, pcx: p.cx, pcy: p.cy, baseR: 28, infeasible: !!infeasible };
          if (!placed.some(q => rectsOverlap(q, cand))) { chosen = cand; break; }
        }
        if (!chosen) {
          chosen = { type: 'angle', text: angleText, x: p.cx + Math.cos(mid) * 28, y: p.cy + Math.sin(mid) * 28, w: atw, h: 14, pcx: p.cx, pcy: p.cy, baseR: 28, infeasible: !!infeasible };
        }
        placed.push(chosen);
        dimLabels.push(chosen);
      }

      // 3. Рисование с фоном-плашкой для читаемости
      dimLabels.forEach(label => {
        drawCtx.save();
        const bw = label.w + 4, bh = label.h + 2;
        drawCtx.fillStyle = isDark ? 'rgba(26,26,46,0.82)' : 'rgba(255,255,255,0.88)';
        drawCtx.beginPath();
        if (drawCtx.roundRect) drawCtx.roundRect(label.x - bw / 2, label.y - bh / 2, bw, bh, 3);
        else drawCtx.rect(label.x - bw / 2, label.y - bh / 2, bw, bh);
        drawCtx.fill();

        if (label.type === 'length') {
          // Выноска к середине сегмента, если подпись уехала от идеальной позиции
          const distFromIdeal = Math.sqrt((label.x - label.idealX) ** 2 + (label.y - label.idealY) ** 2);
          if (distFromIdeal > 20) {
            drawCtx.strokeStyle = isDark ? '#a3a3b866' : '#73737355';
            drawCtx.lineWidth = 0.7;
            drawCtx.setLineDash([2, 3]);
            drawCtx.beginPath();
            drawCtx.moveTo(label.idealX, label.idealY);
            drawCtx.lineTo(label.x, label.y);
            drawCtx.stroke();
            drawCtx.setLineDash([]);
          }
          drawCtx.fillStyle = isDark ? '#a3a3b8' : '#525252';
          drawCtx.font = '10px monospace';
          drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'middle';
          drawCtx.fillText(label.text, label.x, label.y);
          S._hitAreas.push({
            type: 'segment', index: label.index,
            x: label.x - bw / 2, y: label.y - bh / 2, w: bw, h: bh
          });
        } else {
          // Выноска от дуги
          const distFromBase = Math.sqrt((label.x - label.pcx) ** 2 + (label.y - label.pcy) ** 2);
          if (distFromBase > label.baseR + 6) {
            const ang = Math.atan2(label.y - label.pcy, label.x - label.pcx);
            drawCtx.strokeStyle = isDark ? '#fbbf2466' : '#d9770666';
            drawCtx.lineWidth = 0.7;
            drawCtx.setLineDash([2, 2]);
            drawCtx.beginPath();
            drawCtx.moveTo(label.pcx + Math.cos(ang) * label.baseR, label.pcy + Math.sin(ang) * label.baseR);
            drawCtx.lineTo(label.x - Math.cos(ang) * (label.w / 2 + 2), label.y - Math.sin(ang) * (label.h / 2 + 2));
            drawCtx.stroke();
            drawCtx.setLineDash([]);
          }
          drawCtx.fillStyle = isDark ? '#fbbf24' : '#d97706';
          if (label.infeasible) {
            drawCtx.fillStyle = '#ef4444';
          }
          drawCtx.font = 'bold 9px sans-serif';
          drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'middle';
          drawCtx.fillText((label.infeasible ? '⚠ ' : '') + label.text, label.x, label.y);
        }
        drawCtx.restore();
      });
    }
  }

  // ==================== ТОЧКИ ====================
  if (!drawDrawCanvasSimDone) {
    S._hitAreas = S._hitAreas || [];
    // Карта: vertexIndex -> номер гиба (1-indexed)
    const bendNumMap = {};
    if (S.unfoldResult && S.unfoldResult.bendInfos) {
      S.unfoldResult.bendInfos.forEach((b, idx) => { bendNumMap[b.vertexIndex] = idx + 1; });
    }
    S.points.forEach((pt, i) => {
      const { cx, cy } = w2c(pt.x, pt.y);
      const hov = S.hoveredPt === i;
      const isF = i === 0, isL = i === S.points.length - 1;
      const isActive = S.toolMode === 'draw' && S.drawFromIdx === 0 && i === 0;
      // v5.9: точки радиусной дуги — мельче и бирюзовые (не вершины профиля)
      const isArcPt = !!pt._radiusArc;
      if (hov || isActive) {
        drawCtx.beginPath();
        drawCtx.arc(cx, cy, hov ? (isArcPt ? 10 : 14) : (isArcPt ? 9 : 12), 0, Math.PI * 2);
        drawCtx.fillStyle = isActive ? '#3b82f620' : (isArcPt ? '#0d948815' : '#22c55e15');
        drawCtx.fill();
      }
      // Кольцо вокруг активной точки
      if (isActive) {
        drawCtx.beginPath();
        drawCtx.arc(cx, cy, 10, 0, Math.PI * 2);
        drawCtx.strokeStyle = '#3b82f6';
        drawCtx.lineWidth = 2;
        drawCtx.setLineDash([3, 2]);
        drawCtx.stroke();
        drawCtx.setLineDash([]);
      }
      drawCtx.beginPath();
      drawCtx.arc(cx, cy, hov ? (isArcPt ? 6 : 8) : (isArcPt ? 4 : 6), 0, Math.PI * 2);
      drawCtx.fillStyle = isF ? '#22c55e' : isL ? '#ef4444' : (isArcPt ? (isDark ? '#2dd4bf' : '#0d9488') : (isDark ? '#22c55e' : '#16a34a'));
      drawCtx.fill();
      drawCtx.beginPath();
      drawCtx.arc(cx, cy, hov ? (isArcPt ? 2.5 : 3.5) : (isArcPt ? 1.8 : 2.5), 0, Math.PI * 2);
      drawCtx.fillStyle = isDark ? '#0a0a0a' : '#fff';
      drawCtx.fill();
      // Label — только вершины гибов (совпадает с нумерацией развёртки)
      const bNum = bendNumMap[i];
      if (bNum) {
        const label = String(bNum);
        drawCtx.font = 'bold 8px monospace';
        const lw = drawCtx.measureText(label).width;
        const lx = cx + 10, ly = cy - 6;
        drawCtx.fillStyle = isDark ? '#2e1a0acc' : '#fff7edcc';
        drawCtx.beginPath();
        if (drawCtx.roundRect) drawCtx.roundRect(lx - 2, ly - 7, lw + 4, 10, 2);
        else drawCtx.rect(lx - 2, ly - 7, lw + 4, 10);
        drawCtx.fill();
        drawCtx.fillStyle = isDark ? '#fbbf24' : '#ea580c';
        drawCtx.textAlign = 'left'; drawCtx.textBaseline = 'middle';
        drawCtx.fillText(label, lx, ly - 2);
      }
      // Hit area для точки (для перетаскивания)
      S._hitAreas.push({ type: 'point', index: i, x: cx - 10, y: cy - 10, w: 20, h: 20 });
    });
  }

  // Кайма: подсветка наведённого сегмента
  if (S.toolMode === 'hem' && S.hemHoveredSeg >= 0 && S.hemHoveredSeg < S.points.length - 1) {
    const si = S.hemHoveredSeg;
    const a = w2c(S.points[si].x, S.points[si].y);
    const b = w2c(S.points[si + 1].x, S.points[si + 1].y);
    drawCtx.save();
    drawCtx.strokeStyle = '#8b5cf6';
    drawCtx.lineWidth = 6;
    drawCtx.lineCap = 'round';
    drawCtx.globalAlpha = 0.4;
    drawCtx.beginPath();
    drawCtx.moveTo(a.cx, a.cy);
    drawCtx.lineTo(b.cx, b.cy);
    drawCtx.stroke();
    drawCtx.restore();
  }

  // Кайма: «крючки» — только в режиме рисования (не симуляции).
  // В симуляции кайма отображается в согнутом профиле.
  if (!drawDrawCanvasSimDone) drawHemHooks2D();

  // Индикатор замыкания контура
  if ((S.toolMode === 'draw' || S.toolMode === 'select') && S.points.length >= 3 && S.mouseWorld) {
    // Только при рисовании от конца — у первой точки (двойной клик)
    if (S.drawFromIdx !== 0) {
      const fc = w2c(S.points[0].x, S.points[0].y);
      const mc = w2c(S.mouseWorld.x, S.mouseWorld.y);
      const dd = Math.sqrt((fc.cx - mc.cx) ** 2 + (fc.cy - mc.cy) ** 2);
      if (dd < 15) {
        const alpha = .5 + .3 * Math.sin(Date.now() / 200);
        drawCtx.save();
        drawCtx.globalAlpha = alpha;
        drawCtx.strokeStyle = '#22c55e';
        drawCtx.lineWidth = 3;
        drawCtx.beginPath();
        drawCtx.arc(fc.cx, fc.cy, 14, 0, Math.PI * 2);
        drawCtx.stroke();
        drawCtx.restore();
        cancelAnimationFrame(animFrame);
        animFrame = requestAnimationFrame(drawDrawCanvas);
        return;
      }
    }
  }

  // Индикатор привязки к точке
  if (S.toolMode === 'draw' && S.snapEndpoint >= 0 && S.snapEndpoint < S.points.length) {
    const sp = w2c(S.points[S.snapEndpoint].x, S.points[S.snapEndpoint].y);
    drawCtx.strokeStyle = '#06b6d4';
    drawCtx.lineWidth = 2.5;
    drawCtx.beginPath();
    drawCtx.arc(sp.cx, sp.cy, 12, 0, Math.PI * 2);
    drawCtx.stroke();
  }

  // ══ v5.9: ЧЕРНОВИК РАДИУСНОЙ ДУГИ (режим «Дуга») ══
  // Есть конец — сегментированная дуга с подписью (живой предпросмотр
  // из диалога: радиус/сегменты/сторона); нет конца — резинка от старта.
  if (S.toolMode === 'arc' && S.arcDraft && !drawDrawCanvasSimDone) {
    const d = S.arcDraft;
    const sc = w2c(d.startPt.x, d.startPt.y);
    if (d.endPt && typeof arcDraftGeometry === 'function') {
      const geo = arcDraftGeometry(d);
      if (geo && geo.pts) {
        drawCtx.save();
        // Сегментированная дуга — бирюзовый пунктир по хордам
        drawCtx.strokeStyle = isDark ? '#2dd4bf' : '#0d9488';
        drawCtx.lineWidth = 2;
        drawCtx.setLineDash([7, 4]);
        drawCtx.beginPath();
        const c0 = w2c(geo.pts[0].x, geo.pts[0].y);
        drawCtx.moveTo(c0.cx, c0.cy);
        geo.pts.forEach(function (pp) {
          const c = w2c(pp.x, pp.y);
          drawCtx.lineTo(c.cx, c.cy);
        });
        drawCtx.stroke();
        drawCtx.setLineDash([]);
        // Вершины сегментов — будущие линии гиба
        geo.pts.forEach(function (pp) {
          const c = w2c(pp.x, pp.y);
          drawCtx.beginPath();
          drawCtx.arc(c.cx, c.cy, 2.5, 0, Math.PI * 2);
          drawCtx.fillStyle = isDark ? '#2dd4bf' : '#0d9488';
          drawCtx.fill();
        });
        // Подпись: R, охват, угол сегмента
        const midPt = geo.pts[Math.floor(geo.pts.length / 2)];
        const mc = w2c(midPt.x, midPt.y);
        const perDeg = (geo.perSeg * 180 / Math.PI).toFixed(1);
        const sweepDeg = (geo.sweep * 180 / Math.PI).toFixed(0);
        const lbl = 'R' + geo.R.toFixed(1) + ' \u00b7 ' + sweepDeg + '\u00b0 \u00b7 ' + geo.N + '\u00d7' + perDeg + '\u00b0';
        drawCtx.font = 'bold 11px monospace';
        const lw = drawCtx.measureText(lbl).width;
        drawCtx.fillStyle = isDark ? 'rgba(13,40,38,0.9)' : 'rgba(240,253,250,0.95)';
        drawCtx.fillRect(mc.cx - lw / 2 - 5, mc.cy - 20, lw + 10, 16);
        drawCtx.strokeStyle = isDark ? '#2dd4bf66' : '#0d948866';
        drawCtx.lineWidth = 1;
        drawCtx.strokeRect(mc.cx - lw / 2 - 5, mc.cy - 20, lw + 10, 16);
        drawCtx.fillStyle = isDark ? '#2dd4bf' : '#0d9488';
        drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'middle';
        drawCtx.fillText(lbl, mc.cx, mc.cy - 12);
        drawCtx.restore();
      }
    } else if (S.mouseWorld) {
      // Резинка от старта дуги к курсору
      const tw = S.snapToGrid ? snapPoint(S.mouseWorld) : S.mouseWorld;
      const to = w2c(tw.x, tw.y);
      drawCtx.strokeStyle = isDark ? '#2dd4bf55' : '#0d948855';
      drawCtx.lineWidth = 1.5;
      drawCtx.setLineDash([6, 4]);
      drawCtx.beginPath();
      drawCtx.moveTo(sc.cx, sc.cy);
      drawCtx.lineTo(to.cx, to.cy);
      drawCtx.stroke();
      drawCtx.setLineDash([]);
      const len = dist(d.startPt, tw);
      drawCtx.fillStyle = isDark ? '#2dd4bf99' : '#0d948888';
      drawCtx.font = '10px monospace';
      drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'bottom';
      drawCtx.fillText(len.toFixed(1) + ' mm', (sc.cx + to.cx) / 2, (sc.cy + to.cy) / 2 - 8);
    }
    // Стартовая точка черновика — бирюзовое кольцо
    drawCtx.beginPath();
    drawCtx.arc(sc.cx, sc.cy, 9, 0, Math.PI * 2);
    drawCtx.strokeStyle = isDark ? '#2dd4bf' : '#0d9488';
    drawCtx.lineWidth = 2.5;
    drawCtx.stroke();
    drawCtx.beginPath();
    drawCtx.arc(sc.cx, sc.cy, 3, 0, Math.PI * 2);
    drawCtx.fillStyle = isDark ? '#2dd4bf' : '#0d9488';
    drawCtx.fill();
  }

  // Резинка (rubber band)
  if (S.toolMode === 'draw' && S.points.length > 0 && S.mouseWorld) {
    const lp = S.drawFromIdx === 0 ? S.points[0] : S.points[S.points.length - 1];
    const from = w2c(lp.x, lp.y);
    const tw = S.snapToGrid ? snapPoint(S.mouseWorld) : S.mouseWorld;
    const to = w2c(tw.x, tw.y);
    drawCtx.strokeStyle = isDark ? '#22c55e44' : '#16a34a55';
    drawCtx.lineWidth = 1.5;
    drawCtx.setLineDash([6, 4]);
    drawCtx.beginPath();
    drawCtx.moveTo(from.cx, from.cy);
    drawCtx.lineTo(to.cx, to.cy);
    drawCtx.stroke();
    drawCtx.setLineDash([]);
    const len = dist(lp, tw);
    drawCtx.fillStyle = isDark ? '#22c55e99' : '#16a34a88';
    drawCtx.font = '10px monospace';
    drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'bottom';
    drawCtx.fillText(len.toFixed(1) + ' mm', (from.cx + to.cx) / 2, (from.cy + to.cy) / 2 - 8);
  }

  // Инструмент измерения
  if (S.toolMode === 'measure' && measureStart) {
    const mc = isDark ? '#fbbf24' : '#f59e0b';
    const sc = w2c(measureStart.x, measureStart.y);
    let ec;
    if (measureEnd) ec = w2c(measureEnd.x, measureEnd.y);
    else if (S.mouseWorld) ec = w2c(S.mouseWorld.x, S.mouseWorld.y);
    else ec = sc;
    drawCtx.strokeStyle = mc;
    drawCtx.lineWidth = 1.5;
    drawCtx.setLineDash([6, 4]);
    drawCtx.beginPath();
    drawCtx.moveTo(sc.cx, sc.cy);
    drawCtx.lineTo(ec.cx, ec.cy);
    drawCtx.stroke();
    drawCtx.setLineDash([]);
    [sc, ec].forEach(p => {
      drawCtx.beginPath();
      drawCtx.arc(p.cx, p.cy, 5, 0, Math.PI * 2);
      drawCtx.fillStyle = mc;
      drawCtx.fill();
      drawCtx.beginPath();
      drawCtx.arc(p.cx, p.cy, 2, 0, Math.PI * 2);
      drawCtx.fillStyle = isDark ? '#0a0a0a' : '#fff';
      drawCtx.fill();
    });
    const sp2 = measureEnd || S.mouseWorld || measureStart;
    const dx2 = sp2.x - measureStart.x, dy2 = sp2.y - measureStart.y;
    const d = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    const ad = (Math.atan2(-dy2, dx2) * 180 / Math.PI);
    const mxc = (sc.cx + ec.cx) / 2, myc = (sc.cy + ec.cy) / 2;
    const lb = d.toFixed(1) + ' mm  ' + ad.toFixed(1) + '°';
    drawCtx.font = 'bold 11px monospace';
    const lw2 = drawCtx.measureText(lb).width;
    drawCtx.fillStyle = isDark ? '#1a1a2ecc' : '#ffffffdd';
    drawCtx.beginPath();
    if (drawCtx.roundRect) drawCtx.roundRect(mxc - lw2 / 2 - 4, myc - 18, lw2 + 8, 16, 3);
    else drawCtx.rect(mxc - lw2 / 2 - 4, myc - 18, lw2 + 8, 16);
    drawCtx.fill();
    drawCtx.fillStyle = mc;
    drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'middle';
    drawCtx.fillText(lb, mxc, myc - 10);
  }

  // Крестик мыши
  if (S.mouseWorld) {
    const mw = S.mouseWorld;
    const sn = S.snapToGrid ? snapPoint(mw) : mw;
    const mc = w2c(sn.x, sn.y);
    drawCtx.strokeStyle = isDark ? '#ffffff18' : '#00000022';
    drawCtx.lineWidth = .5;
    drawCtx.setLineDash([3, 3]);
    drawCtx.beginPath();
    drawCtx.moveTo(mc.cx, 0); drawCtx.lineTo(mc.cx, h);
    drawCtx.moveTo(0, mc.cy); drawCtx.lineTo(w, mc.cy);
    drawCtx.stroke();
    drawCtx.setLineDash([]);
    drawCtx.fillStyle = isDark ? '#d4d4e8' : '#262626';
    drawCtx.font = '10px monospace';
    drawCtx.textAlign = 'left'; drawCtx.textBaseline = 'bottom';
    drawCtx.fillText(sn.x.toFixed(1) + ', ' + sn.y.toFixed(1), 8, h - 8);
  }

  // ==================== ИНСТРУМЕНТЫ НА ХОЛСТЕ (масштаб 1:1) ====================
  // Во время симуляции инструменты рисуются в drawPressBrakeTooling —
  // здесь только при включённых инструментах БЕЗ активной симуляции,
  // иначе матрица задвоится.
  if (S.showToolsOnCanvas && !drawDrawCanvasSimDone) {
    drawToolsOnCanvas(isDark);
  }

  // ==================== ЧЕРНОВИК ИНСТРУМЕНТА (v5.7) ====================
  // Рисование своего пуансона/матрицы на холсте — поверх всего,
  // работает в любом режиме (профиль/симуляция/установка).
  if (S.toolDraw && S.toolMode === 'tooldraw') {
    drawToolDraft(isDark);
  }
}

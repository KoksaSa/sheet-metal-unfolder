// ═══════════════════════════════════════════════════════════════
// UI / DRAWING — генерация готового чертежа (A4): профиль + развёртка
// + титульный блок + листы «Последовательность гибки» (по шагам
// симуляции, с упором и лицевой стороной). Скачивание PNG / печать.
//
// FIX v4.1: нумерация гибов теперь учитывает порядок симуляции
// (S.simBentMarkers), а не несуществующие поля simBends/bendOrder.
// ═══════════════════════════════════════════════════════════════

function generateDrawing() {
  if (!S.unfoldResult || S.points.length < 2) return;
  const res = S.unfoldResult;
  const mt = METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0];
  const mtName = S.lang === 'en' ? mt.nameEn : mt.nameRu;
  // Невозможные гибы
  const badBends = (res.bendInfos || []).filter(b => b.feasible === false);
  const die = getDieByIndex(S.metal.dieIndex);
  const punch = getPunchByIndex(S.metal.punchIndex);
  const L = res.totalLength, W = res.width;
  const area = L * W;
  const wt = calcWeight(area, S.metal.thickness, S.metal.metalTypeIndex);
  const fmtW = wt < .001 ? (wt * 1000).toFixed(1) + ' ' + t('weightG') : wt < 1 ? (wt * 1000).toFixed(0) + ' ' + t('weightG') : wt.toFixed(3) + ' ' + t('weightKg');
  const density = getMetalDensity(S.metal.metalTypeIndex, S.metal.thickness) * 1e9;
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);

  // Карта порядка гибки: bendIndex → порядковый номер шага (1-based)
  // Приоритет: порядок СИМУЛЯЦИИ (simBentMarkers) > старые поля > естественный порядок
  const simOrder = (Array.isArray(S.simBentMarkers) && S.simBentMarkers.length > 0) ? S.simBentMarkers : null;
  const legacyOrder = (Array.isArray(S.simBends) && S.simBends.length > 0) ? S.simBends : ((S.bendOrder && S.bendOrder.length > 0) ? S.bendOrder : null);
  const bendOrder = simOrder || legacyOrder || (res.bendInfos || []).map((b, i) => i);
  const bendStepMap = {}; // bendIndex → step number
  bendOrder.forEach((bendIdx, stepNum) => { bendStepMap[bendIdx] = stepNum + 1; });

  // A4 landscape: 297x210mm, 3px/mm
  const pxPerMm = 3;
  const CW = 297 * pxPerMm;
  const CH = 210 * pxPerMm;
  const border = 10 * pxPerMm;
  const titleH = 55 * pxPerMm;

  const cv = document.createElement('canvas');
  cv.width = CW; cv.height = CH;
  const ctx = cv.getContext('2d');

  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, CW, CH);
  ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
  ctx.strokeRect(border, border, CW - border * 2, CH - border * 2);

  const drawTop = border + 15;
  const drawBottom = CH - border - titleH - 15;
  const drawLeft = border + 15;
  const drawRight = CW - border - 15;
  const drawW = drawRight - drawLeft;
  const drawH = drawBottom - drawTop;

  // Profile 40%, Unfold 60%
  const profileW = drawW * 0.38;
  const unfoldW = drawW * 0.58;
  const gap = drawW * 0.04;
  const profileLeft = drawLeft;
  const unfoldLeft = profileLeft + profileW + gap;

  // Разделитель
  ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1;
  const sepX = profileLeft + profileW + gap / 2;
  ctx.beginPath(); ctx.moveTo(sepX, drawTop); ctx.lineTo(sepX, drawBottom); ctx.stroke();

  // === ВИД ПРОФИЛЯ ===
  // v4.7: профиль — СРЕДНЯЯ линия листа (нейтральный слой, стандарт
  // развёрток): размеры сегментов — по средней линии; полоса металла
  // показывает реальное сечение (толщина T, торцы перпендикулярны).
  ctx.fillStyle = '#333';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(t('drawingProfile'), profileLeft + profileW / 2, drawTop);
  ctx.fillStyle = '#666';
  ctx.font = '8px sans-serif';
  ctx.fillText(t('centerLineNoteShort'), profileLeft + profileW / 2, drawTop + 13);
  // Наружный габарит профиля (с учётом толщины) — под видом профиля
  const outerB = (typeof profileOuterBounds === 'function') ? profileOuterBounds(S.points, S.metal.thickness) : null;
  if (outerB) {
    ctx.fillStyle = '#0d9488';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText(t('outerDimsLabel') + ': ' + outerB.width.toFixed(1) + ' × ' + outerB.height.toFixed(1) + ' mm', profileLeft + profileW / 2, drawTop + 23);
  }

  let pMinX = Infinity, pMaxX = -Infinity, pMinY = Infinity, pMaxY = -Infinity;
  S.points.forEach(p => {
    if (p.x < pMinX) pMinX = p.x; if (p.x > pMaxX) pMaxX = p.x;
    if (p.y < pMinY) pMinY = p.y; if (p.y > pMaxY) pMaxY = p.y;
  });
  const pRangeX = pMaxX - pMinX || 1;
  const pRangeY = pMaxY - pMinY || 1;
  const profPad = 30;
  const profTop = drawTop + 20;
  const profBot = drawBottom - 10;
  const profAreaH = profBot - profTop;
  const pScale = Math.min((profileW - profPad * 2) / pRangeX, (profAreaH - profPad * 2) / pRangeY);
  const pOfsX = profileLeft + (profileW - pRangeX * pScale) / 2;
  const pOfsY = profTop + (profAreaH - pRangeY * pScale) / 2;

  function p2d(wx, wy) { return { x: pOfsX + (wx - pMinX) * pScale, y: pOfsY + (pMaxY - wy) * pScale }; }

  if (S.points.length >= 2) {
    // v4.7: полоса металла — толщина T в масштабе вида (средняя линия
    // = центр полосы; наглядно видно наружный/внутренний контур)
    ctx.save();
    ctx.strokeStyle = 'rgba(100,116,139,0.30)';
    ctx.lineWidth = Math.max(1, (S.metal.thickness || 1) * pScale);
    ctx.lineCap = 'butt'; ctx.lineJoin = 'round';
    ctx.beginPath();
    const bp0 = p2d(S.points[0].x, S.points[0].y);
    ctx.moveTo(bp0.x, bp0.y);
    for (let i = 1; i < S.points.length; i++) {
      const bpp = p2d(S.points[i].x, S.points[i].y);
      ctx.lineTo(bpp.x, bpp.y);
    }
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2;
    ctx.beginPath();
    const p0 = p2d(S.points[0].x, S.points[0].y);
    ctx.moveTo(p0.x, p0.y);
    for (let i = 1; i < S.points.length; i++) {
      const pp = p2d(S.points[i].x, S.points[i].y);
      ctx.lineTo(pp.x, pp.y);
    }
    ctx.stroke();

    // Номера гибов = шаги из порядка симуляции
    const bendNumMap = {};
    if (res.bendInfos) res.bendInfos.forEach((b, idx) => { bendNumMap[b.vertexIndex] = bendStepMap[idx] || (idx + 1); });

    S.points.forEach((p, i) => {
      const pp = p2d(p.x, p.y);
      ctx.beginPath(); ctx.arc(pp.x, pp.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#16a34a'; ctx.fill();
      const bNum = bendNumMap[i];
      if (bNum) {
        ctx.fillStyle = '#c2410c'; ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(String(bNum), pp.x, pp.y - 5);
      }
    });

    // Размеры сегментов
    ctx.fillStyle = '#666'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < S.points.length - 1; i++) {
      const a = S.points[i], b = S.points[i + 1];
      const segLen = dist(a, b);
      const pa = p2d(a.x, a.y), pb = p2d(b.x, b.y);
      const mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2;
      const ang = Math.atan2(pb.y - pa.y, pb.x - pa.x);
      ctx.save();
      ctx.translate(mx + Math.cos(ang + Math.PI / 2) * 10, my + Math.sin(ang + Math.PI / 2) * 10);
      ctx.rotate(ang);
      ctx.fillText(segLen.toFixed(1), 0, 0);
      ctx.restore();
    }

    // Углы гибов на профиле
    const bendFeasMap = {};
    if (res.bendInfos) res.bendInfos.forEach(b => { bendFeasMap[b.vertexIndex] = b; });
    for (let i = 1; i < S.points.length - 1; i++) {
      const pp = p2d(S.points[i - 1].x, S.points[i - 1].y);
      const pc = p2d(S.points[i].x, S.points[i].y);
      const pn = p2d(S.points[i + 1].x, S.points[i + 1].y);
      const aToPrev = Math.atan2(pp.y - pc.y, pp.x - pc.x);
      const aToNext = Math.atan2(pn.y - pc.y, pn.x - pc.x);
      const ba = Math.abs(normAngle(aToNext - aToPrev));
      if (ba < 5 * Math.PI / 180) continue;
      const arcR = Math.min(18, pRangeX * pScale * 0.12, pRangeY * pScale * 0.12);
      const diff = normAngle(aToPrev - aToNext);
      const bInfo = bendFeasMap[i];
      const infeasible = bInfo && bInfo.feasible === false;
      ctx.strokeStyle = infeasible ? '#dc2626' : '#c2410c';
      ctx.lineWidth = infeasible ? 2 : 0.8;
      ctx.beginPath();
      ctx.arc(pc.x, pc.y, arcR, aToNext, aToPrev, diff < 0);
      ctx.stroke();
      const midA = aToNext + diff / 2;
      const lr = arcR + 10;
      ctx.fillStyle = infeasible ? '#dc2626' : '#c2410c';
      ctx.font = infeasible ? 'bold 9px sans-serif' : 'bold 8px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText((infeasible ? '\u26a0 ' : '') + (ba * 180 / Math.PI).toFixed(1) + '\u00b0', pc.x + Math.cos(midA) * lr, pc.y + Math.sin(midA) * lr);
    }

    // Крючки каймы на профиле
    if (S.hems && S.hems.length > 0) {
      const br = S.metal.bendRadius;
      S.hems.forEach(hem => {
        const si = hem.segIndex;
        const numSegs = S.points.length - 1;
        if (si < 0 || si > numSegs) return;
        let pt, neighbor;
        if (si >= numSegs - 1) {
          pt = S.points[S.points.length - 1];
          neighbor = S.points[S.points.length - 2];
        } else {
          pt = S.points[si];
          neighbor = S.points[si + 1];
        }
        const isLeft = hem.side !== 'right';
        const segAngle = Math.atan2(neighbor.y - pt.y, neighbor.x - pt.x);
        const perpAngle = isLeft ? (segAngle - Math.PI / 2) : (segAngle + Math.PI / 2);
        const h1w = { x: pt.x + Math.cos(perpAngle) * br, y: pt.y + Math.sin(perpAngle) * br };
        const h2w = { x: h1w.x + Math.cos(segAngle) * hem.height, y: h1w.y + Math.sin(segAngle) * hem.height };
        const c0 = p2d(pt.x, pt.y), c1 = p2d(h1w.x, h1w.y), c2 = p2d(h2w.x, h2w.y);
        const hColor = isLeft ? '#3b82f6' : '#8b5cf6';
        ctx.strokeStyle = hColor; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(c0.x, c0.y); ctx.lineTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.stroke();
        ctx.beginPath(); ctx.arc(c1.x, c1.y, 2.5, 0, Math.PI * 2); ctx.fillStyle = hColor; ctx.fill();
        const label = hem.height.toFixed(1) + ' mm';
        const lx = (c1.x + c2.x) / 2, ly = (c1.y + c2.y) / 2;
        const offset = isLeft ? -12 : 12;
        ctx.fillStyle = hColor; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(label, lx + (-Math.sin(segAngle) * offset), ly + (Math.cos(segAngle) * offset));
      });
    }
  }

  // === ВИД РАЗВЁРТКИ ===
  ctx.fillStyle = '#333';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(t('drawingUnfold'), unfoldLeft + unfoldW / 2, drawTop);

  const ufPad = 25;
  const ufTop = drawTop + 20;
  const ufBot = drawBottom - 35;
  const ufAreaH = ufBot - ufTop;
  const uScale = Math.min((unfoldW - ufPad * 2) / L, (ufAreaH - ufPad * 2) / W);
  const uOfsX = unfoldLeft + (unfoldW - L * uScale) / 2;
  const uOfsY = ufTop + (ufAreaH - W * uScale) / 2;

  ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2;
  ctx.strokeRect(uOfsX, uOfsY, L * uScale, W * uScale);

  res.elements.forEach(el => {
    if (el.type === 'straight') {
      ctx.fillStyle = '#dcfce7';
      ctx.fillRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      ctx.strokeStyle = '#16a34a33'; ctx.lineWidth = 0.5;
      ctx.strokeRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      if (el.length > 5) {
        const mx = (el.startX + el.endX) / 2;
        ctx.fillStyle = '#15803d'; ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(el.length.toFixed(1), uOfsX + mx * uScale, uOfsY + W * uScale / 2);
      }
    } else if (el.type === 'hem') {
      ctx.fillStyle = '#bfdbfe';
      ctx.fillRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1; ctx.setLineDash([2, 2]);
      ctx.strokeRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      ctx.setLineDash([]);
      const mx = (el.startX + el.endX) / 2;
      ctx.fillStyle = '#1d4ed8'; ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(el.length.toFixed(1), uOfsX + mx * uScale, uOfsY + W * uScale / 2);
    } else {
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      ctx.strokeStyle = '#ea580c33'; ctx.lineWidth = 0.5;
      ctx.strokeRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      const mx = (el.startX + el.endX) / 2;
      ctx.fillStyle = '#c2410c'; ctx.font = '9px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText((el.angle * 180 / Math.PI).toFixed(0) + '\u00b0', uOfsX + mx * uScale, uOfsY + W * uScale / 2);
    }
  });

  ctx.setLineDash([4, 3]);
  res.bendLinePositions.forEach((xp, idx) => {
    const bInf = res.bendInfos[idx];
    const infeasible = bInf && bInf.feasible === false;
    ctx.strokeStyle = infeasible ? '#dc2626' : '#ea580c';
    ctx.lineWidth = infeasible ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(uOfsX + xp * uScale, uOfsY);
    ctx.lineTo(uOfsX + xp * uScale, uOfsY + W * uScale);
    ctx.stroke();
    const nx = uOfsX + xp * uScale, ny = uOfsY + 10;
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(nx, ny, 7, 0, Math.PI * 2);
    ctx.fillStyle = infeasible ? '#dc2626' : '#f97316'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(bendStepMap[idx] || (idx + 1)), nx, ny);
    ctx.setLineDash([4, 3]);
  });
  ctx.setLineDash([]);

  // Линии гиба каймы (синие, без номеров)
  if (res.hemBendLinePositions && res.hemBendLinePositions.length > 0) {
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1.5;
    res.hemBendLinePositions.forEach(xp => {
      ctx.beginPath();
      ctx.moveTo(uOfsX + xp * uScale, uOfsY);
      ctx.lineTo(uOfsX + xp * uScale, uOfsY + W * uScale);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  // Размеры развёртки
  const dimY = uOfsY + W * uScale + 12;
  ctx.strokeStyle = '#666'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(uOfsX, dimY); ctx.lineTo(uOfsX + L * uScale, dimY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(uOfsX, dimY - 3); ctx.lineTo(uOfsX, dimY + 3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(uOfsX + L * uScale, dimY - 3); ctx.lineTo(uOfsX + L * uScale, dimY + 3); ctx.stroke();
  ctx.fillStyle = '#555'; ctx.font = '9px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(L.toFixed(1) + ' mm', uOfsX + L * uScale / 2, dimY + 3);

  const dimX = uOfsX + L * uScale + 10;
  ctx.beginPath(); ctx.moveTo(dimX, uOfsY); ctx.lineTo(dimX, uOfsY + W * uScale); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dimX - 3, uOfsY); ctx.lineTo(dimX + 3, uOfsY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dimX - 3, uOfsY + W * uScale); ctx.lineTo(dimX + 3, uOfsY + W * uScale); ctx.stroke();
  ctx.save(); ctx.translate(dimX + 3, uOfsY + W * uScale / 2); ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#555'; ctx.font = '9px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(W.toFixed(1) + ' mm', 0, 0);
  ctx.restore();

  // Легенда
  const lgX = unfoldLeft + unfoldW - 5;
  const lgY = ufTop + 15;
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.font = '8px sans-serif';
  ctx.fillStyle = '#dcfce7'; ctx.fillRect(lgX - 50, lgY - 4, 10, 8);
  ctx.strokeStyle = '#16a34a33'; ctx.lineWidth = 0.5; ctx.strokeRect(lgX - 50, lgY - 4, 10, 8);
  ctx.fillStyle = '#555'; ctx.fillText(t('straightLegend'), lgX, lgY);
  ctx.fillStyle = '#fed7aa'; ctx.fillRect(lgX - 50, lgY + 10, 10, 8);
  ctx.strokeStyle = '#ea580c33'; ctx.lineWidth = 0.5; ctx.strokeRect(lgX - 50, lgY + 10, 10, 8);
  ctx.fillStyle = '#555'; ctx.fillText(t('bendLegend'), lgX, lgY + 14);

  // === ТИТУЛЬНЫЙ БЛОК ===
  const tbTop = CH - border - titleH;
  ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
  ctx.strokeRect(border, tbTop, CW - border * 2, titleH);
  ctx.beginPath(); ctx.moveTo(border + (CW - border * 2) * 0.6, tbTop); ctx.lineTo(border + (CW - border * 2) * 0.6, tbTop + titleH); ctx.stroke();

  const ts = 9; const lh = ts + 5;
  let ty = tbTop + 8;
  ctx.fillStyle = '#000'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText(t('drawingTitle') + ' \u2014 ' + (S.metal.partNumber || '\u2014'), border + 10, ty); ty += lh + 4;
  ctx.font = ts + 'px sans-serif';
  ctx.fillText(t('material') + ': ' + mtName, border + 10, ty); ty += lh;
  ctx.fillText(t('thickness') + ': ' + S.metal.thickness + ' mm', border + 10, ty); ty += lh;
  ctx.fillText('R: ' + S.metal.bendRadius + ' mm  |  K: ' + S.metal.kFactor.toFixed(2), border + 10, ty); ty += lh;
  ctx.fillText(t('bendWord1') + ': ' + res.bendInfos.length + '  |  L: ' + L.toFixed(1) + ' mm  |  W: ' + W.toFixed(1) + ' mm', border + 10, ty); ty += lh;
  ctx.fillText(t('dieSelect') + ': ' + (die ? (S.lang === 'en' ? die.nameEn : die.nameRu) : '\u2014') + '  |  ' + t('punchSelect') + ': ' + (punch ? (S.lang === 'en' ? punch.nameEn : punch.nameRu) : '\u2014'), border + 10, ty);

  ctx.textAlign = 'right'; ty = tbTop + 8;
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText(t('blankWeight') + ': ' + fmtW, CW - border - 10, ty); ty += lh + 4;
  ctx.font = ts + 'px sans-serif';
  ctx.fillText(t('areaLabel') + ': ' + (area / 100).toFixed(1) + t('areaSuffix'), CW - border - 10, ty); ty += lh;
  ctx.fillText(t('density') + ': ' + density.toFixed(1) + ' ' + t('densityUnit'), CW - border - 10, ty); ty += lh;
  // v4.7: наружный габарит профиля (полоса ±T/2 от средней линии) и
  // заметка, что размеры профиля — по СРЕДНЕЙ линии (нейтральный слой)
  if (outerB) {
    ctx.fillText(t('outerDimsLabel') + ': ' + outerB.width.toFixed(1) + ' × ' + outerB.height.toFixed(1) + ' mm', CW - border - 10, ty); ty += lh;
  }
  ctx.fillStyle = '#555';
  ctx.font = '8px sans-serif';
  ctx.fillText(t('centerLineNote'), CW - border - 10, ty); ty += lh;
  ctx.fillStyle = '#000';
  ctx.font = ts + 'px sans-serif';
  ctx.fillText(dateStr, CW - border - 10, ty);

  // === МИНИАТЮРЫ ИНСТРУМЕНТОВ + УГЛЫ ГИБОВ ===
  const toolsTop = tbTop + 105;
  ctx.strokeStyle = '#999'; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(border + 10, toolsTop); ctx.lineTo(CW - border - 10, toolsTop); ctx.stroke();

  // Отрисовка профиля инструмента на canvas (аналог drawProfileSVG)
  function drawToolProfileOnCanvas(tool, kind, ox, oy, ow, oh) {
    const color = kind === 'punch' ? '#ef4444' : '#3b82f6';
    const pad = 3;
    let chains = null, minX = 0, minY = 0, pw = 0, ph = 0;
    // v5.4: реальный контур и для стандартных инструментов с профилем
    if (tool.profile && tool.profile.chains && tool.profile.chains.length) {
      chains = tool.profile.chains;
      minX = tool.profile.minX || 0; minY = tool.profile.minY || 0;
      pw = tool.profile.width; ph = tool.profile.height;
    } else if (Array.isArray(tool.profile) && tool.profile.length) {
      chains = [tool.profile];
      minX = Math.min(...tool.profile.map(p => p.x));
      minY = Math.min(...tool.profile.map(p => p.y));
      const maxX = Math.max(...tool.profile.map(p => p.x));
      const maxY = Math.max(...tool.profile.map(p => p.y));
      pw = maxX - minX; ph = maxY - minY;
    }
    if (chains && pw > 0 && ph > 0) {
      const usableW = ow - pad * 2, usableH = oh - pad * 2;
      const scale = Math.min(usableW / pw, usableH / ph) || 1;
      const offX = ox + pad + (usableW - pw * scale) / 2;
      const offY = oy + pad + (usableH - ph * scale) / 2;
      ctx.strokeStyle = color; ctx.lineWidth = 1.2; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      chains.forEach(chain => {
        ctx.beginPath();
        chain.forEach((p, pi) => {
          const sx = offX + (p.x - minX) * scale;
          const sy = offY + (ph - (p.y - minY)) * scale;
          if (pi === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        });
        ctx.stroke();
      });
      return;
    }
    // Стандартный / без профиля — схематично
    const usableW = ow - pad * 2, usableH = oh - pad * 2;
    if (kind === 'punch') {
      const r = (tool.radius || 1) * 0.5;
      ctx.strokeStyle = color; ctx.lineWidth = 1.2; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(ox + pad, oy + oh - pad);
      ctx.lineTo(ox + pad, oy + oh - pad - usableH * 0.5);
      ctx.arc(ox + ow / 2, oy + oh - pad - usableH * 0.5, r, Math.PI, 0, false);
      ctx.lineTo(ox + ow - pad, oy + oh - pad);
      ctx.stroke();
    } else {
      const mid = ox + ow / 2;
      const depth = Math.min(usableH * 0.9, (tool.vWidth || 10) * 0.45);
      ctx.strokeStyle = color; ctx.lineWidth = 1.2; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(ox + pad, oy + oh - pad);
      ctx.lineTo(ox + pad, oy + oh - pad - usableH * 0.5);
      ctx.lineTo(mid, oy + oh - pad - depth);
      ctx.lineTo(ox + ow - pad, oy + oh - pad - usableH * 0.5);
      ctx.lineTo(ox + ow - pad, oy + oh - pad);
      ctx.stroke();
    }
  }

  // Матрица (слева)
  const dieX = border + 15;
  const dieY = toolsTop + 8;
  ctx.fillStyle = '#000'; ctx.font = '8px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText(t('dieSelect'), dieX, dieY);
  if (die) {
    drawToolProfileOnCanvas(die, 'die', dieX, dieY + 12, 60, 28);
    ctx.fillStyle = '#555'; ctx.font = '7px monospace';
    ctx.fillText(toolSizeLabel(die, true), dieX, dieY + 42);
  }

  // Пуансон (рядом с матрицей)
  const punchX = dieX + 80;
  ctx.fillStyle = '#000'; ctx.font = '8px sans-serif';
  ctx.fillText(t('punchSelect'), punchX, dieY);
  if (punch) {
    drawToolProfileOnCanvas(punch, 'punch', punchX, dieY + 12, 60, 28);
    ctx.fillStyle = '#555'; ctx.font = '7px monospace';
    ctx.fillText(toolSizeLabel(punch, false), punchX, dieY + 42);
  }

  // Углы гибов (справа)
  const bendsX = CW - border - 10;
  ctx.textAlign = 'right'; ctx.textBaseline = 'top';
  ctx.fillStyle = '#000'; ctx.font = '8px sans-serif';
  ctx.fillText(t('bendWord1') + ' (' + res.bendInfos.length + '):', bendsX, toolsTop + 8);
  if (res.bendInfos && res.bendInfos.length > 0) {
    ctx.font = 'bold 8px monospace';
    let bx = bendsX;
    const by = toolsTop + 22;
    // Рисуем справа налево
    for (let i = res.bendInfos.length - 1; i >= 0; i--) {
      const b = res.bendInfos[i];
      const interior = (Math.PI - b.bendAngle) * 180 / Math.PI;
      const txt = (i + 1) + ':' + interior.toFixed(0) + '\u00b0';
      const tw = ctx.measureText(txt).width;
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(bx - tw - 4, by - 1, tw + 4, 12);
      ctx.strokeStyle = '#ea580c55'; ctx.lineWidth = 0.5;
      ctx.strokeRect(bx - tw - 4, by - 1, tw + 4, 12);
      ctx.fillStyle = '#c2410c'; ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillText(txt, bx, by + 1);
      bx -= tw + 6;
    }
  }

  // === СТРАНИЦЫ «ПОСЛЕДОВАТЕЛЬНОСТЬ ГИБКИ» ===
  // Показывает ВЫПОЛНЕННЫЕ гибы (S.simBentMarkers) в порядке выполнения.
  // Для каждого шага: контур заготовки ПОСЛЕ этого гиба, угол гиба,
  // миниатюра упора, расстояние от упора до точки гиба (0,0).
  // Если гибов больше 5 — таблица разбивается на страницы по 5 шагов.
  const seqDataUrls = [];
  const seqCanvases = [];
  const bentMarkers = (S.simBentMarkers || []).slice(); // порядок выполнения
  if (bentMarkers.length > 0 && res.bendInfos.length > 0) {
    const MAX_STEPS_PER_PAGE = 5;
    const nSteps = bentMarkers.length;
    const nPages = Math.ceil(nSteps / MAX_STEPS_PER_PAGE);
    for (let pageNum = 0; pageNum < nPages; pageNum++) {
      const pageSteps = bentMarkers.slice(pageNum * MAX_STEPS_PER_PAGE, (pageNum + 1) * MAX_STEPS_PER_PAGE);
      const pageStartStep = pageNum * MAX_STEPS_PER_PAGE;
      const seqCv = document.createElement('canvas');
      seqCv.width = CW; seqCv.height = CH;
      const sctx = seqCv.getContext('2d');
      sctx.fillStyle = '#fff'; sctx.fillRect(0, 0, CW, CH);
      sctx.strokeStyle = '#000'; sctx.lineWidth = 2;
      sctx.strokeRect(border, border, CW - border * 2, CH - border * 2);

      // Заголовок
      sctx.fillStyle = '#333'; sctx.font = 'bold 14px sans-serif';
      sctx.textAlign = 'center'; sctx.textBaseline = 'top';
      sctx.fillText(S.lang === 'en' ? 'Bending Sequence' : 'Последовательность гибки', CW / 2, border + 8);
      sctx.font = '10px sans-serif'; sctx.fillStyle = '#666';
      sctx.fillText((S.metal.partNumber || '\u2014') + '  |  ' + dateStr, CW / 2, border + 26);
      if (nPages > 1) {
        sctx.font = '9px sans-serif'; sctx.fillStyle = '#999';
        sctx.textAlign = 'right';
        sctx.fillText((S.lang === 'en' ? 'Page ' : 'Лист ') + (pageNum + 1) + ' / ' + nPages, CW - border - 8, border + 8);
      }

      // Таблица: 1 шаг на строку
      const tblTop = border + 45;
      const tblBot = CH - border - 15;
      const tblH = tblBot - tblTop;
      const rowH = Math.min(tblH / pageSteps.length, 160);
      // Колонки: Шаг | Гиб/Угол | Упор/Расстояние | Y станка | Контур
      // v5.0: добавлена колонка «Y станка» (эмпирическая база Y из
      // y-calculator.html, ключ localStorage 'bendYCalculator_v1').
      const colStepW = 36;
      // v4.6: 130 (было 100); v5.0: 118 — влезает «↔ Разворот по горизонтали» (8px)
      const colAngleW = 118;
      const colStopW = 150;
      const colYW = 96;
      const colProfW = CW - border * 2 - 20 - colStepW - colAngleW - colStopW - colYW;

      const colStepX = border + 10;
      const colAngleX = colStepX + colStepW;
      const colStopX = colAngleX + colAngleW;
      const colYX = colStopX + colStopW;
      const colProfX = colYX + colYW;

      // Заголовки колонок
      sctx.fillStyle = '#f0f0f0';
      sctx.fillRect(colStepX, tblTop, colStepW, 20);
      sctx.fillRect(colAngleX, tblTop, colAngleW, 20);
      sctx.fillRect(colStopX, tblTop, colStopW, 20);
      sctx.fillRect(colYX, tblTop, colYW, 20);
      sctx.fillRect(colProfX, tblTop, colProfW, 20);
      sctx.strokeStyle = '#999'; sctx.lineWidth = 0.5;
      sctx.strokeRect(colStepX, tblTop, colStepW, 20);
      sctx.strokeRect(colAngleX, tblTop, colAngleW, 20);
      sctx.strokeRect(colStopX, tblTop, colStopW, 20);
      sctx.strokeRect(colYX, tblTop, colYW, 20);
      sctx.strokeRect(colProfX, tblTop, colProfW, 20);
      sctx.fillStyle = '#333'; sctx.font = 'bold 9px sans-serif';
      sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
      sctx.fillText(S.lang === 'en' ? 'Step' : 'Шаг', colStepX + colStepW / 2, tblTop + 10);
      sctx.fillText(S.lang === 'en' ? 'Bend / Angle' : 'Гиб / Угол', colAngleX + colAngleW / 2, tblTop + 10);
      sctx.fillText(S.lang === 'en' ? 'Stopper / Dist' : 'Упор / Расст.', colStopX + colStopW / 2, tblTop + 10);
      sctx.fillText(t('drawingSeqY'), colYX + colYW / 2, tblTop + 10);
      sctx.fillText(S.lang === 'en' ? 'Bent Profile' : 'Контур заготовки', colProfX + colProfW / 2, tblTop + 10);

      // Для каждого шага на странице
      let pageHasY = false; // v5.0: был ли на странице расчёт Y из базы
      let pageHasCollision = false; // v5.9: был ли на странице шаг с коллизией
      pageSteps.forEach((bendIdx, pageStepIdx) => {
        const stepNum = pageStartStep + pageStepIdx; // абсолютный номер шага
        const cellY = tblTop + 20 + pageStepIdx * rowH;
        // Грани
        sctx.strokeStyle = '#ccc'; sctx.lineWidth = 0.5;
        sctx.strokeRect(colStepX, cellY, colStepW, rowH);
        sctx.strokeRect(colAngleX, cellY, colAngleW, rowH);
        sctx.strokeRect(colProfX, cellY, colProfW, rowH);
        sctx.strokeRect(colStopX, cellY, colStopW, rowH);
        sctx.strokeRect(colYX, cellY, colYW, rowH);

        // === Колонка «шаг»: оранжевый кружок с номером ===
        sctx.fillStyle = '#f97316'; sctx.beginPath();
        sctx.arc(colStepX + colStepW / 2, cellY + 20, 10, 0, Math.PI * 2); sctx.fill();
        sctx.strokeStyle = '#fff'; sctx.lineWidth = 1; sctx.stroke();
        sctx.fillStyle = '#fff'; sctx.font = 'bold 9px sans-serif';
        sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
        sctx.fillText(String(stepNum + 1), colStepX + colStepW / 2, cellY + 20);

        // === Колонка «гиб + угол» ===
        const bInfo = res.bendInfos[bendIdx];
        const interior = bInfo ? ((Math.PI - bInfo.bendAngle) * 180 / Math.PI).toFixed(0) : '?';
        sctx.fillStyle = '#c2410c'; sctx.font = 'bold 11px sans-serif';
        sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
        sctx.fillText(S.lang === 'en'
          ? 'B' + (bendIdx + 1)
          : 'Г' + (bendIdx + 1), colAngleX + colAngleW / 2, cellY + 20);
        sctx.fillStyle = '#333'; sctx.font = 'bold 13px sans-serif';
        sctx.fillText(interior + '\u00b0', colAngleX + colAngleW / 2, cellY + 42);
        // Ориентация лицевой стороны (из метаданных шага)
        const meta = (S.bendStepMeta || {})[bendIdx];
        if (meta && meta.faceOrient) {
          const faceUp = meta.faceOrient === 'up';
          sctx.fillStyle = faceUp ? '#2563eb' : '#9333ea';
          sctx.font = 'bold 10px sans-serif';
          sctx.fillText(faceUp ? '\u25B2' : '\u25BC', colAngleX + colAngleW / 2, cellY + 58);
          sctx.fillStyle = faceUp ? '#2563eb' : '#9333ea';
          sctx.font = 'bold 8px sans-serif';
          sctx.fillText(S.lang === 'en'
            ? (faceUp ? 'Face up' : 'Face down')
            : (faceUp ? 'Лицевой вверх' : 'Лицевой вниз'),
            colAngleX + colAngleW / 2, cellY + 69);
        }
        // v4.6: развороты заготовки на момент гибки (кнопки «↔X» / «↕Y»).
        // ↔X = отражение лево↔право → разворот по ГОРИЗОНТАЛИ,
        // ↕Y = отражение верх↔низ → разворот по ВЕРТИКАЛИ.
        if (meta) {
          const flipLabels = [];
          if (meta.flipX) flipLabels.push('\u2194 ' + (S.lang === 'en' ? 'Flip horizontally' : 'Разворот по горизонтали'));
          if (meta.flipY) flipLabels.push('\u2195 ' + (S.lang === 'en' ? 'Flip vertically' : 'Разворот по вертикали'));
          flipLabels.forEach((lbl, fi) => {
            sctx.font = '8px sans-serif';
            // Защита от переполнения узкой колонки — ужимаем шрифт
            if (sctx.measureText(lbl).width > colAngleW - 6) sctx.font = '7px sans-serif';
            sctx.fillStyle = '#0d9488';
            sctx.fillText(lbl, colAngleX + colAngleW / 2, cellY + 83 + fi * 12);
          });
        }

        // === Колонка «контур заготовки»: профиль ПОСЛЕ этого шага ===
        const stepBentSet = bentMarkers.slice(0, stepNum + 1);
        const stepMeta = (S.bendStepMeta || {})[bendIdx];
        const stepFlipX = stepMeta ? !!stepMeta.flipX : false;
        const stepFlipY = stepMeta ? !!stepMeta.flipY : false;
        // Временно: simBentMarkers = stepBentSet, selected = bendIdx,
        // simFlipX/Y из meta → считаем профиль → восстанавливаем.
        const savedBent = S.simBentMarkers, savedSel = S.selectedBendIndex, savedFlipX = S.simFlipX, savedFlipY = S.simFlipY;
        S.simBentMarkers = stepBentSet;
        S.selectedBendIndex = bendIdx; // позиционирует по этому гибу (в 0,0)
        S.simFlipX = stepFlipX; S.simFlipY = stepFlipY;
        const stepProf = computeAccumulatedProfile({ bendIdx: bendIdx, progress: 1, animating: false });
        S.simBentMarkers = savedBent; S.selectedBendIndex = savedSel; S.simFlipX = savedFlipX; S.simFlipY = savedFlipY;

        if (stepProf && stepProf.pts && stepProf.pts.length >= 2) {
          // Вписать профиль в колонку (по габаритам)
          let mnX = Infinity, mxX = -Infinity, mnY = Infinity, mxY = -Infinity;
          stepProf.pts.forEach(p => {
            if (p.x < mnX) mnX = p.x; if (p.x > mxX) mxX = p.x;
            if (p.y < mnY) mnY = p.y; if (p.y > mxY) mxY = p.y;
          });
          const rangeX = (mxX - mnX) || 1, rangeY = (mxY - mnY) || 1;
          const profPad = 6;
          const profCellW = colProfW - profPad * 2;
          const profCellH = rowH - profPad * 2;
          const sScale = Math.min(profCellW / rangeX, profCellH / rangeY);
          const sOfsX = colProfX + profPad + (profCellW - rangeX * sScale) / 2;
          const sOfsY = cellY + profPad + (profCellH - rangeY * sScale) / 2;
          function p2s(wx, wy) { return { x: sOfsX + (wx - mnX) * sScale, y: sOfsY + (mxY - wy) * sScale }; }
          // Контур (центральная линия металла) — зелёный
          sctx.strokeStyle = '#16a34a'; sctx.lineWidth = 2;
          sctx.beginPath();
          const sp0 = p2s(stepProf.pts[0].x, stepProf.pts[0].y);
          sctx.moveTo(sp0.x, sp0.y);
          for (let i = 1; i < stepProf.pts.length; i++) {
            const sp = p2s(stepProf.pts[i].x, stepProf.pts[i].y);
            sctx.lineTo(sp.x, sp.y);
          }
          sctx.stroke();
          // Лицевая сторона — синяя линия, перпендикулярный отступ ±T/2
          // от каждого сегмента. Знак: faceOrient 'up' → +1, 'down' → -1,
          // simFlipX инвертирует (X-зеркало меняет направление обхода).
          const T = S.metal.thickness || 1;
          const faceSign = ((stepMeta && stepMeta.faceOrient === 'down') ? -1 : 1) * (stepFlipX ? -1 : 1);
          sctx.strokeStyle = '#3b82f6'; sctx.lineWidth = 1.5;
          sctx.beginPath();
          let faceStarted = false;
          for (let i = 0; i < stepProf.pts.length - 1; i++) {
            const dx = stepProf.pts[i + 1].x - stepProf.pts[i].x;
            const dy = stepProf.pts[i + 1].y - stepProf.pts[i].y;
            const len = Math.hypot(dx, dy);
            if (len < 1e-6) continue;
            const nx = -dy / len * faceSign * (T / 2);
            const ny = dx / len * faceSign * (T / 2);
            const a = p2s(stepProf.pts[i].x + nx, stepProf.pts[i].y + ny);
            const b = p2s(stepProf.pts[i + 1].x + nx, stepProf.pts[i + 1].y + ny);
            if (!faceStarted) { sctx.moveTo(a.x, a.y); faceStarted = true; }
            else sctx.lineTo(a.x, a.y);
            sctx.lineTo(b.x, b.y);
          }
          sctx.stroke();
          // Точка гиба (0,0) — оранжевый маркер
          const org = p2s(0, 0);
          sctx.fillStyle = '#f97316'; sctx.beginPath();
          sctx.arc(org.x, org.y, 3, 0, Math.PI * 2); sctx.fill();

          // === v5.9: КОЛЛИЗИЯ КОНТУРА С ПУАНСОНОМ на этом шаге ===
          // Конечное положение вершины пуансона при ВЫПОЛНЕННОМ гибе
          // (progress=1) — самый опасный момент хода. Контур пуансона —
          // красный пунктир в ячейке, точки касания — красные кружки,
          // бейдж «⚠ Касание пуансона» в углу ячейки.
          if (typeof detectPunchCollision === 'function') {
            const finTipY = (typeof activeBendArcInnerY === 'function') ? activeBendArcInnerY(bendIdx, 1) : null;
            const tipYv = (finTipY !== null && Number.isFinite(finTipY)) ? finTipY : (S.metal.thickness || 1) / 2;
            const col = detectPunchCollision(stepProf.pts, tipYv);
            if (col) {
              pageHasCollision = true;
              // Контур пуансона в ячейке (красный пунктир) — видно, ГДЕ касается
              const polys = (typeof punchSolidPolygon === 'function') ? punchSolidPolygon(tipYv) : null;
              if (polys) {
                sctx.save();
                sctx.strokeStyle = '#dc2626';
                sctx.lineWidth = 1;
                sctx.setLineDash([3, 2]);
                polys.forEach(function (poly) {
                  sctx.beginPath();
                  poly.forEach(function (p, pi) {
                    const s = p2s(p.x, p.y);
                    if (pi === 0) sctx.moveTo(s.x, s.y); else sctx.lineTo(s.x, s.y);
                  });
                  sctx.closePath();
                  sctx.stroke();
                });
                sctx.restore();
              }
              // Точки касания — красные кружки с белой обводкой
              col.pts.forEach(function (hp) {
                const s = p2s(hp.x, hp.y);
                sctx.beginPath();
                sctx.arc(s.x, s.y, 3.5, 0, Math.PI * 2);
                sctx.fillStyle = '#dc2626'; sctx.fill();
                sctx.strokeStyle = '#fff'; sctx.lineWidth = 1; sctx.stroke();
              });
              // Бейдж в левом верхнем углу ячейки контура
              sctx.save();
              sctx.font = 'bold 8px sans-serif';
              const btxt = t('punchCollisionBadge');
              const bw = sctx.measureText(btxt).width;
              sctx.fillStyle = 'rgba(255,255,255,0.93)';
              sctx.fillRect(colProfX + 3, cellY + 3, bw + 8, 13);
              sctx.strokeStyle = '#dc2626'; sctx.lineWidth = 1;
              sctx.strokeRect(colProfX + 3, cellY + 3, bw + 8, 13);
              sctx.fillStyle = '#dc2626';
              sctx.textAlign = 'left'; sctx.textBaseline = 'middle';
              sctx.fillText(btxt, colProfX + 7, cellY + 10);
              sctx.restore();
              // Красное кольцо вокруг номера шага — шаг с коллизией
              sctx.beginPath();
              sctx.arc(colStepX + colStepW / 2, cellY + 20, 12.5, 0, Math.PI * 2);
              sctx.strokeStyle = '#dc2626'; sctx.lineWidth = 2.5; sctx.stroke();
            }
          }
        }

        // === Колонка «упор + расстояние» ===
        // Расстояние из S.bendStepMeta[bendIdx].stopperDist — позиция
        // упора ДО гибки (записана в startBendAnimation).
        const meta2 = (S.bendStepMeta || {})[bendIdx];
        const stopperDist = meta2 ? meta2.stopperDist : null;
        if (stopperDist !== null && stopperDist !== undefined) {
          // Миниатюра упора: заштрихованный прямоугольник 20×8
          const stopScale = Math.min((colStopW - 40) / 60, rowH / 50);
          const stopCx = colStopX + colStopW / 2;
          const stopCy = cellY + 30;
          const swPx = 20 * stopScale, shPx = 8 * stopScale;
          const sLeft = stopCx - swPx / 2, sTop = stopCy - shPx / 2;
          sctx.fillStyle = '#6b728015';
          sctx.fillRect(sLeft, sTop, swPx, shPx);
          sctx.save();
          sctx.beginPath();
          sctx.rect(sLeft, sTop, swPx, shPx);
          sctx.clip();
          sctx.strokeStyle = '#6b728088'; sctx.lineWidth = 0.8;
          for (let s = -shPx; s <= swPx + shPx; s += 3) {
            sctx.beginPath();
            sctx.moveTo(sLeft + s, sTop + shPx);
            sctx.lineTo(sLeft + s + shPx, sTop);
            sctx.stroke();
          }
          sctx.restore();
          sctx.strokeStyle = '#6b7280cc'; sctx.lineWidth = 1.5;
          sctx.strokeRect(sLeft, sTop, swPx, shPx);
          // Расстояние от правого края упора до (0,0)
          sctx.fillStyle = '#333'; sctx.font = 'bold 11px sans-serif';
          sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
          sctx.fillText((S.lang === 'en' ? 'Dist: ' : 'Расст: ') + stopperDist.toFixed(1) + ' мм', stopCx, stopCy + shPx / 2 + 14);
          // Подпись «Упор»
          sctx.fillStyle = '#666'; sctx.font = '8px sans-serif';
          sctx.fillText(S.lang === 'en' ? 'Stopper' : 'Упор', stopCx, stopCy - shPx / 2 - 8);
        } else {
          sctx.fillStyle = '#999'; sctx.font = '9px sans-serif';
          sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
          sctx.fillText(S.lang === 'en' ? 'No touch' : 'Нет касания', colStopX + colStopW / 2, cellY + rowH / 2);
        }

        // === Колонка «Y станка» (v5.0): какое Y выставить на станке,
        // чтобы получить требуемый угол — из эмпирической базы
        // испытаний калькулятора Y (js/ui/y-calc.js). ===
        const yInfo = (typeof recommendBendY === 'function' && typeof bendYDefaultMachineId === 'function') ? (function () {
          try {
            const machine = bendYDefaultMachineId();
            if (!machine) return null;
            let material = '';
            const mt = (typeof METAL_TYPES !== 'undefined') ? (METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0]) : null;
            if (mt) material = S.lang === 'en' ? mt.nameEn : mt.nameRu;
            let v = 10;
            const die = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
            if (die && die.vWidth) v = die.vWidth;
            const bInfoY = res.bendInfos[bendIdx];
            const interiorDeg = bInfoY ? (Math.PI - bInfoY.bendAngle) * 180 / Math.PI : 90;
            return recommendBendY({ machine, material, thickness: S.metal.thickness, grain: 'unknown', v, length: S.metal.width, angle: interiorDeg });
          } catch (e) { return null; }
        })() : null;
        if (yInfo) {
          pageHasY = true;
          sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
          // Итоговый Y (с калибровочной поправкой станка) — крупно, бирюзовый
          sctx.fillStyle = '#0f766e'; sctx.font = 'bold 12px sans-serif';
          sctx.fillText(yInfo.finalY.toFixed(2), colYX + colYW / 2, cellY + 26);
          // Уровень доверия расчёта
          const confTxt = yInfo.confidence === 'high' ? (S.lang === 'en' ? 'high' : 'высокое')
            : yInfo.confidence === 'medium' ? (S.lang === 'en' ? 'medium' : 'среднее')
              : (S.lang === 'en' ? 'low' : 'низкое');
          sctx.fillStyle = yInfo.confidence === 'high' ? '#15803d'
            : yInfo.confidence === 'medium' ? '#b45309' : '#dc2626';
          sctx.font = '8px sans-serif';
          sctx.fillText(confTxt, colYX + colYW / 2, cellY + 40);
          // Метод расчёта (7px, обрезаем по ширине колонки)
          if (rowH >= 70 && yInfo.method) {
            sctx.font = '7px sans-serif'; sctx.fillStyle = '#999';
            let mtxt = String(yInfo.method);
            while (mtxt.length > 1 && sctx.measureText(mtxt).width > colYW - 8) mtxt = mtxt.slice(0, -1);
            if (mtxt !== String(yInfo.method)) mtxt += '\u2026';
            sctx.fillText(mtxt, colYX + colYW / 2, cellY + 52);
          }
        } else {
          sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
          sctx.fillStyle = '#999'; sctx.font = '12px sans-serif';
          sctx.fillText('\u2014', colYX + colYW / 2, cellY + rowH / 2);
          sctx.font = '8px sans-serif';
          sctx.fillText(t('drawingSeqYNoData'), colYX + colYW / 2, cellY + rowH / 2 + 12);
        }
      }); // end pageSteps.forEach

      // v5.0: сноска об источнике значений Y (если хоть один шаг
      // получил рекомендацию из базы калькулятора)
      if (pageHasY) {
        sctx.fillStyle = '#888'; sctx.font = '8px sans-serif';
        sctx.textAlign = 'center'; sctx.textBaseline = 'top';
        sctx.fillText(t('drawingSeqY') + ' — ' + t('drawingSeqYHint'), CW / 2, tblBot + 3);
      }
      // v5.9: легенда коллизий — на каких шагах контур касается пуансона
      if (pageHasCollision) {
        sctx.fillStyle = '#dc2626'; sctx.font = 'bold 9px sans-serif';
        sctx.textAlign = 'center'; sctx.textBaseline = 'top';
        sctx.fillText(t('punchCollisionLegend'), CW / 2, tblBot + (pageHasY ? 15 : 3));
      }

      seqDataUrls.push(seqCv.toDataURL('image/png'));
      seqCanvases.push(seqCv);
    } // end for pageNum
    window._drawingCanvasSeq = seqCanvases;
  } else {
    window._drawingCanvasSeq = null;
  }

  // Диалог с предпросмотром
  const dataUrl = cv.toDataURL('image/png');
  let dh = '';
  // Предупреждение о невозможных гибах
  if (badBends.length > 0) {
    const dieName = die ? (S.lang === 'en' ? die.nameEn : die.nameRu) : '\u2014';
    const punchName = punch ? (S.lang === 'en' ? punch.nameEn : punch.nameRu) : '\u2014';
    dh += '<div class="mb-3 rounded-lg border-2 border-red-500/50 bg-red-50 dark:bg-red-950/30 p-3">';
    dh += '<p class="text-xs font-semibold text-red-700 dark:text-red-400 flex items-center gap-1.5 mb-1"><i data-lucide="alert-triangle" class="h-3.5 w-3.5"></i>' + t('bendWarningsTitle') + ' — ' + dieName + ' / ' + punchName + '</p>';
    dh += '<div class="space-y-1">';
    badBends.forEach(b => {
      dh += '<div class="text-[10px] text-red-700 dark:text-red-400">';
      dh += '<b>' + t('bend') + ' #' + (b.vertexIndex) + ' (' + (b.bendAngle * 180 / Math.PI).toFixed(0) + '°):</b>';
      b.problems.forEach(pr => { dh += '<div class="pl-3">— ' + pr + '</div>'; });
      dh += '</div>';
    });
    dh += '</div></div>';
  }
  // Предупреждения (не блокируют, но показываем жёлтым)
  const warnBends = (res.bendInfos || []).filter(b => b.warnings && b.warnings.length > 0);
  if (warnBends.length > 0) {
    dh += '<div class="mb-3 rounded-lg border-2 border-amber-500/50 bg-amber-50 dark:bg-amber-950/30 p-3">';
    dh += '<p class="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-1"><i data-lucide="alert-triangle" class="h-3.5 w-3.5"></i>' + t('bendWarnings') + '</p>';
    dh += '<div class="space-y-1">';
    warnBends.forEach(b => {
      dh += '<div class="text-[10px] text-amber-700 dark:text-amber-400">';
      dh += '<b>' + t('bend') + ' #' + (b.vertexIndex) + ' (' + (b.bendAngle * 180 / Math.PI).toFixed(0) + '°):</b>';
      b.warnings.forEach(pr => { dh += '<div class="pl-3">— ' + pr + '</div>'; });
      dh += '</div>';
    });
    dh += '</div></div>';
  }
  dh += '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' + t('drawingTitle') + '</h3>';
  dh += '<div style="max-height:85vh;overflow-y:auto;">';
  dh += '<img src="' + dataUrl + '" style="width:100%;border:1px solid #e5e5e5;border-radius:4px;margin-bottom:8px;"/>';
  if (seqDataUrls.length > 0) {
    seqDataUrls.forEach((seqUrl, i) => {
      dh += '<div class="text-[10px] text-gray-500 mb-1">' + (S.lang === 'en' ? 'Page ' : 'Лист ') + (i + 2) + ': ' + (S.lang === 'en' ? 'Bending Sequence' : 'Последовательность гибки') + (seqDataUrls.length > 1 ? ' (' + (i + 1) + '/' + seqDataUrls.length + ')' : '') + '</div>';
      dh += '<img src="' + seqUrl + '" style="width:100%;border:1px solid #e5e5e5;border-radius:4px;margin-bottom:8px;"/>';
    });
  }
  dh += '</div>';
  dh += '<div class="flex gap-2 mt-3">';
  dh += '<button onclick="downloadDrawing()" class="flex-1 text-xs h-9 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold flex items-center justify-center gap-1.5"><i data-lucide="download" class="h-3.5 w-3.5"></i>' + t('drawingDownload') + '</button>';
  dh += '<button onclick="printDrawing()" class="flex-1 text-xs h-9 px-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center gap-1.5"><i data-lucide="printer" class="h-3.5 w-3.5"></i>' + t('drawingPrint') + '</button>';
  dh += '</div>';
  showDialog(dh, 'dialog-box-wide');
  refreshIcons();
  window._drawingCanvas = cv;
}

function downloadDrawing() {
  const cv = window._drawingCanvas;
  if (!cv) return;
  const seqCvs = window._drawingCanvasSeq;
  const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  // Если есть страницы последовательности — объединяем все вертикально
  if (seqCvs && seqCvs.length > 0) {
    const gap = 20;
    let totalH = cv.height + seqCvs.reduce((s, c) => s + c.height + gap, gap);
    const combined = document.createElement('canvas');
    combined.width = cv.width;
    combined.height = totalH;
    const cctx = combined.getContext('2d');
    cctx.fillStyle = '#fff'; cctx.fillRect(0, 0, combined.width, combined.height);
    let y = 0;
    cctx.drawImage(cv, 0, y); y += cv.height + gap;
    seqCvs.forEach(c => { cctx.drawImage(c, 0, y); y += c.height + gap; });
    combined.toBlob(blob => {
      if (!blob) return;
      const u = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = u; a.download = 'drawing-' + ts + '.png';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(u);
    }, 'image/png');
  } else {
    cv.toBlob(blob => {
      if (!blob) return;
      const u = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = u; a.download = 'drawing-' + ts + '.png';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(u);
    }, 'image/png');
  }
}

function printDrawing() {
  const cv = window._drawingCanvas;
  if (!cv) return;
  const seqCvs = window._drawingCanvasSeq;
  const dataUrl = cv.toDataURL('image/png');
  const seqDataUrls = (seqCvs && seqCvs.length > 0) ? seqCvs.map(c => c.toDataURL('image/png')) : [];
  const win = window.open('', '_blank');
  if (!win) { toast(t('popupBlocked'), 'error'); return; }
  // Первая страница (профиль + развёртка)
  let imgHtml = '<img src="' + dataUrl + '" style="max-width:100%;max-height:100vh;" onload="setTimeout(()=>window.print(),300)"/>';
  // Каждая страница последовательности — на отдельном листе
  if (seqDataUrls.length > 0) {
    seqDataUrls.forEach(seqUrl => {
      imgHtml += '<div style="page-break-after:always;"></div><img src="' + seqUrl + '" style="max-width:100%;max-height:100vh;"/>';
    });
  }
  win.document.write('<!DOCTYPE html><html><head><title>' + t('drawingTitle') + '</title><style>@page{margin:0;size:A4 landscape}@media print{body{margin:0;padding:0}}</style></head><body style="margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#fff;">' + imgHtml + '</body></html>');
  win.document.close();
}

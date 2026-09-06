// ═══════════════════════════════════════════════════════════════
// CANVAS / UNFOLD — холст развёртки (правая панель): заготовка,
// зоны гибов/каймы, линии гиба с номерами, размеры, анимация
// подсветки линий гиба
// ═══════════════════════════════════════════════════════════════

const unfoldCanvas = document.getElementById('unfold-canvas');
const unfoldCtx = unfoldCanvas ? unfoldCanvas.getContext('2d') : null;
let ufW = 300, ufH = 200;
let ufManualZoom = null;
// Sidebar scroll prevention — defined early for use in multiple sections
const unfoldContEl = document.getElementById('unfold-container');
const rightSidebarEl = unfoldContEl ? unfoldContEl.closest('aside') : null;

function resizeUnfoldCanvas() {
  const cont = document.getElementById('unfold-container');
  if (!cont) return;
  const r = cont.getBoundingClientRect();
  ufW = Math.floor(r.width);
  ufH = Math.floor(r.height);
  const dpr = window.devicePixelRatio || 1;
  unfoldCanvas.width = ufW * dpr;
  unfoldCanvas.height = ufH * dpr;
  unfoldCanvas.style.width = ufW + 'px';
  unfoldCanvas.style.height = ufH + 'px';
}

function drawUnfoldCanvas() {
  if (!unfoldCtx) return;
  const dpr = window.devicePixelRatio || 1;
  unfoldCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const w = ufW, h = ufH;
  const isDark = S.isDark;

  unfoldCtx.fillStyle = isDark ? '#1a1a2e' : '#fafafa';
  unfoldCtx.fillRect(0, 0, w, h);

  if (!S.unfoldResult || S.unfoldResult.totalLength <= 0) {
    unfoldCtx.fillStyle = isDark ? 'rgba(163,163,184,.4)' : 'rgba(82,82,82,.3)';
    unfoldCtx.font = '12px sans-serif';
    unfoldCtx.textAlign = 'center'; unfoldCtx.textBaseline = 'middle';
    unfoldCtx.fillText(t('drawProfile') + ' \u2022 ' + t('shortcutUnfold'), w / 2, h / 2);
    return;
  }

  const res = S.unfoldResult;
  const L = res.totalLength, W = res.width;
  let sc, ox, oy;
  if (ufManualZoom && ufManualZoom.scale > 0) {
    sc = ufManualZoom.scale; ox = ufManualZoom.ox; oy = ufManualZoom.oy;
  } else {
    const pad = 60;
    sc = Math.min((w - pad * 2) / L, (h - pad * 2) / W, 5);
    ox = (w - L * sc) / 2;
    oy = (h - W * sc) / 2;
  }

  const isAnim = S.animBendIdx >= 0;

  // Внешний прямоугольник
  unfoldCtx.strokeStyle = isDark ? '#22c55e' : '#16a34a';
  unfoldCtx.lineWidth = 2;
  unfoldCtx.strokeRect(ox, oy, L * sc, W * sc);

  // Припуск на обрезку
  unfoldCtx.save();
  unfoldCtx.strokeStyle = isDark ? '#22c55e' : '#16a34a';
  unfoldCtx.globalAlpha = .15;
  unfoldCtx.lineWidth = 1;
  unfoldCtx.setLineDash([4, 4]);
  unfoldCtx.strokeRect(ox + 5 * sc, oy + 5 * sc, (L - 10) * sc, (W - 10) * sc);
  unfoldCtx.setLineDash([]);
  unfoldCtx.restore();

  // Элементы
  let bc = 0;
  res.elements.forEach(el => {
    const after = isAnim && bc > S.animBendIdx;
    unfoldCtx.save();
    unfoldCtx.globalAlpha = after ? .3 : 1;
    if (el.type === 'straight') {
      unfoldCtx.fillStyle = isDark ? '#14532d80' : '#dcfce7';
      unfoldCtx.fillRect(ox + el.startX * sc, oy, (el.endX - el.startX) * sc, W * sc);
      unfoldCtx.strokeStyle = isDark ? '#22c55e33' : '#16a34a33';
      unfoldCtx.lineWidth = .5;
      unfoldCtx.strokeRect(ox + el.startX * sc, oy, (el.endX - el.startX) * sc, W * sc);
      if (el.length > 5) {
        const mx = (el.startX + el.endX) / 2;
        unfoldCtx.fillStyle = isDark ? '#4ade80' : '#15803d';
        unfoldCtx.font = 'bold 10px sans-serif';
        unfoldCtx.textAlign = 'center'; unfoldCtx.textBaseline = 'middle';
        unfoldCtx.fillText(el.length.toFixed(1), ox + mx * sc, oy + W * sc / 2);
      }
    } else {
      const infeasible = el.type === 'bend' && el.feasible === false;
      unfoldCtx.fillStyle = infeasible ? (isDark ? '#7f1d1d80' : '#fee2e2') : (isDark ? '#7c2d1280' : '#fed7aa');
      unfoldCtx.fillRect(ox + el.startX * sc, oy, (el.endX - el.startX) * sc, W * sc);
      unfoldCtx.strokeStyle = infeasible ? '#ef4444' : '#ea580c33';
      unfoldCtx.lineWidth = infeasible ? 2 : .5;
      unfoldCtx.strokeRect(ox + el.startX * sc, oy, (el.endX - el.startX) * sc, W * sc);
      const mx = (el.startX + el.endX) / 2;
      unfoldCtx.fillStyle = infeasible ? '#ef4444' : (isDark ? '#fb923c' : '#c2410c');
      unfoldCtx.font = infeasible ? 'bold 9px sans-serif' : '9px sans-serif';
      unfoldCtx.textAlign = 'center'; unfoldCtx.textBaseline = 'middle';
      unfoldCtx.fillText((infeasible ? '\u26a0 ' : '') + (el.angle * 180 / Math.PI).toFixed(0) + '\u00b0', ox + mx * sc, oy + W * sc / 2);
      bc++;
    }
    unfoldCtx.restore();
  });

  // Кайма (синие зоны)
  res.elements.forEach(el => {
    if (el.type === 'hem') {
      unfoldCtx.save();
      unfoldCtx.fillStyle = isDark ? '#1e3a8a80' : '#bfdbfe';
      unfoldCtx.fillRect(ox + el.startX * sc, oy, (el.endX - el.startX) * sc, W * sc);
      unfoldCtx.strokeStyle = isDark ? '#3b82f6' : '#2563eb';
      unfoldCtx.lineWidth = 1;
      unfoldCtx.setLineDash([2, 2]);
      unfoldCtx.strokeRect(ox + el.startX * sc, oy, (el.endX - el.startX) * sc, W * sc);
      unfoldCtx.setLineDash([]);
      const mx = (el.startX + el.endX) / 2;
      unfoldCtx.fillStyle = isDark ? '#60a5fa' : '#1d4ed8';
      unfoldCtx.font = 'bold 9px sans-serif';
      unfoldCtx.textAlign = 'center'; unfoldCtx.textBaseline = 'middle';
      const arrow = el.edge === 'bottom' ? '↓' : '↑';
      unfoldCtx.fillText(el.length.toFixed(1) + ' ' + arrow, ox + mx * sc, oy + W * sc / 2);
      unfoldCtx.restore();
    }
  });

  // Линии гиба
  unfoldCtx.setLineDash([4, 3]);
  res.bendLinePositions.forEach((xp, idx) => {
    const after = isAnim && idx > S.animBendIdx;
    const curr = isAnim && idx === S.animBendIdx;
    const bendEl = res.bendInfos[idx];
    const infeasible = bendEl && bendEl.feasible === false;
    unfoldCtx.save();
    if (after) unfoldCtx.globalAlpha = .3;
    if (curr) {
      unfoldCtx.strokeStyle = isDark ? '#fbbf24' : '#f59e0b';
      unfoldCtx.lineWidth = 3;
      unfoldCtx.shadowColor = isDark ? '#fbbf24' : '#f59e0b';
      unfoldCtx.shadowBlur = 12;
      unfoldCtx.setLineDash([]);
    } else if (infeasible) {
      unfoldCtx.strokeStyle = '#ef4444';
      unfoldCtx.lineWidth = 3;
      unfoldCtx.setLineDash([]);
    } else {
      unfoldCtx.strokeStyle = isDark ? '#fb923c' : '#ea580c';
      unfoldCtx.lineWidth = 1.5;
    }
    unfoldCtx.beginPath();
    unfoldCtx.moveTo(ox + xp * sc, oy);
    unfoldCtx.lineTo(ox + xp * sc, oy + W * sc);
    unfoldCtx.stroke();
    unfoldCtx.shadowColor = 'transparent';
    unfoldCtx.shadowBlur = 0;
    unfoldCtx.setLineDash([4, 3]);

    // Номер
    const nr = curr ? 12 : 8;
    const nx = ox + xp * sc, ny = oy + 12 + nr;
    if (curr) {
      unfoldCtx.shadowColor = isDark ? '#fbbf24' : '#f59e0b';
      unfoldCtx.shadowBlur = 10;
    }
    unfoldCtx.beginPath();
    unfoldCtx.arc(nx, ny, nr, 0, Math.PI * 2);
    unfoldCtx.fillStyle = curr
      ? (isDark ? '#fbbf24' : '#f59e0b')
      : infeasible
        ? '#ef4444'
        : (isDark ? '#ea580c' : '#f97316');
    unfoldCtx.fill();
    unfoldCtx.strokeStyle = isDark ? '#0a0a0a' : '#fff';
    unfoldCtx.lineWidth = 1.5;
    unfoldCtx.setLineDash([]);
    unfoldCtx.stroke();
    unfoldCtx.shadowColor = 'transparent';
    unfoldCtx.shadowBlur = 0;
    unfoldCtx.fillStyle = '#fff';
    unfoldCtx.font = curr ? 'bold 11px sans-serif' : 'bold 9px sans-serif';
    unfoldCtx.textAlign = 'center'; unfoldCtx.textBaseline = 'middle';
    unfoldCtx.fillText(String(idx + 1), nx, ny);
    unfoldCtx.restore();
  });
  unfoldCtx.setLineDash([]);

  // Линии гиба каймы (без номеров)
  if (res.hemBendLinePositions && res.hemBendLinePositions.length > 0) {
    unfoldCtx.setLineDash([4, 3]);
    unfoldCtx.strokeStyle = isDark ? '#3b82f6' : '#2563eb';
    unfoldCtx.lineWidth = 1.5;
    res.hemBendLinePositions.forEach(xp => {
      unfoldCtx.beginPath();
      unfoldCtx.moveTo(ox + xp * sc, oy);
      unfoldCtx.lineTo(ox + xp * sc, oy + W * sc);
      unfoldCtx.stroke();
    });
    unfoldCtx.setLineDash([]);
  }

  // Отметки шкалы
  const ti = L < 200 ? 10 : L < 1000 ? 50 : 100;
  unfoldCtx.save();
  unfoldCtx.strokeStyle = isDark ? '#555570' : '#737373';
  unfoldCtx.lineWidth = .5;
  let tci = 0;
  for (let tm = ti; tm < L; tm += ti) {
    tci++;
    const isL = tci % 5 === 0;
    const tl = isL ? 6 : 3;
    const tpx = ox + tm * sc;
    unfoldCtx.beginPath();
    unfoldCtx.moveTo(tpx, oy);
    unfoldCtx.lineTo(tpx, oy + tl);
    unfoldCtx.stroke();
  }
  unfoldCtx.restore();

  // Размеры
  const dimY = oy + W * sc + 15;
  unfoldCtx.strokeStyle = isDark ? '#555570' : '#737373';
  unfoldCtx.lineWidth = .8;
  unfoldCtx.beginPath();
  unfoldCtx.moveTo(ox, dimY);
  unfoldCtx.lineTo(ox + L * sc, dimY);
  unfoldCtx.stroke();
  unfoldCtx.beginPath();
  unfoldCtx.moveTo(ox, dimY - 4); unfoldCtx.lineTo(ox, dimY + 4);
  unfoldCtx.moveTo(ox + L * sc, dimY - 4); unfoldCtx.lineTo(ox + L * sc, dimY + 4);
  unfoldCtx.stroke();
  unfoldCtx.fillStyle = isDark ? '#a3a3b8' : '#525252';
  unfoldCtx.font = '10px monospace';
  unfoldCtx.textAlign = 'center'; unfoldCtx.textBaseline = 'top';
  unfoldCtx.fillText(L.toFixed(1) + ' mm', ox + L * sc / 2, dimY + 4);

  const dimX = ox + L * sc + 15;
  unfoldCtx.beginPath();
  unfoldCtx.moveTo(dimX, oy);
  unfoldCtx.lineTo(dimX, oy + W * sc);
  unfoldCtx.stroke();
  unfoldCtx.beginPath();
  unfoldCtx.moveTo(dimX - 4, oy); unfoldCtx.lineTo(dimX + 4, oy);
  unfoldCtx.moveTo(dimX - 4, oy + W * sc); unfoldCtx.lineTo(dimX + 4, oy + W * sc);
  unfoldCtx.stroke();
  unfoldCtx.save();
  unfoldCtx.translate(dimX + 4, oy + W * sc / 2);
  unfoldCtx.rotate(-Math.PI / 2);
  unfoldCtx.fillStyle = isDark ? '#a3a3b8' : '#525252';
  unfoldCtx.font = '10px monospace';
  unfoldCtx.textAlign = 'center'; unfoldCtx.textBaseline = 'middle';
  unfoldCtx.fillText(W.toFixed(1) + ' mm', 0, 0);
  unfoldCtx.restore();

  // Масштабная линейка
  const sbLen = 10 * sc;
  if (sbLen > 20 && sbLen < w / 2) {
    const sbx = 10, sby = h - 14;
    unfoldCtx.strokeStyle = isDark ? '#a3a3b8' : '#525252';
    unfoldCtx.lineWidth = 1.5;
    unfoldCtx.beginPath();
    unfoldCtx.moveTo(sbx, sby);
    unfoldCtx.lineTo(sbx + sbLen, sby);
    unfoldCtx.moveTo(sbx, sby - 3); unfoldCtx.lineTo(sbx, sby + 3);
    unfoldCtx.moveTo(sbx + sbLen, sby - 3); unfoldCtx.lineTo(sbx + sbLen, sby + 3);
    unfoldCtx.stroke();
    unfoldCtx.fillStyle = isDark ? '#a3a3b8' : '#525252';
    unfoldCtx.font = '9px monospace';
    unfoldCtx.textAlign = 'center'; unfoldCtx.textBaseline = 'bottom';
    unfoldCtx.fillText('10 mm', sbx + sbLen / 2, sby - 4);
  }

  // Легенда
  const lgX = w - 8, lgY = 14;
  unfoldCtx.textAlign = 'right'; unfoldCtx.textBaseline = 'middle';
  unfoldCtx.font = '9px sans-serif';
  unfoldCtx.fillStyle = isDark ? '#14532d80' : '#dcfce7';
  unfoldCtx.fillRect(lgX - 60, lgY - 5, 12, 10);
  unfoldCtx.strokeStyle = isDark ? '#22c55e33' : '#16a34a33';
  unfoldCtx.lineWidth = .5;
  unfoldCtx.strokeRect(lgX - 60, lgY - 5, 12, 10);
  unfoldCtx.fillStyle = isDark ? '#a3a3b8' : '#525252';
  unfoldCtx.fillText(t('straightLegend'), lgX, lgY);
  unfoldCtx.fillStyle = isDark ? '#7c2d1280' : '#fed7aa';
  unfoldCtx.fillRect(lgX - 60, lgY + 12, 12, 10);
  unfoldCtx.strokeStyle = isDark ? '#ea580c33' : '#ea580c33';
  unfoldCtx.lineWidth = .5;
  unfoldCtx.strokeRect(lgX - 60, lgY + 12, 12, 10);
  unfoldCtx.fillStyle = isDark ? '#a3a3b8' : '#525252';
  unfoldCtx.fillText(t('bendLegend'), lgX, lgY + 17);
}

// ==================== АНИМАЦИЯ ПОДСВЕТКИ ЛИНИЙ ГИБА ====================
let bendAnimTimer = null;

function toggleBendAnim() {
  if (bendAnimTimer) {
    clearInterval(bendAnimTimer);
    bendAnimTimer = null;
    S.animBendIdx = -1;
  } else {
    S.animBendIdx = 0;
    bendAnimTimer = setInterval(() => {
      if (!S.unfoldResult || S.animBendIdx >= S.unfoldResult.bendLinePositions.length) {
        clearInterval(bendAnimTimer);
        bendAnimTimer = null;
        S.animBendIdx = -1;
        return;
      }
      S.animBendIdx++;
      drawUnfoldCanvas();
      draw3DPreview();
    }, 800);
  }
}

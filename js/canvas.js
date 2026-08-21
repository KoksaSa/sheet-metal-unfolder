 // ==================== HIT AREAS ====================
  // Массив кликабельных областей для сегментов и точек
  S._hitAreas = [];

  // ==================== DRAWING CANVAS ====================
const drawCanvas = document.getElementById('draw-canvas');
const drawCtx = drawCanvas.getContext('2d');
let canvasW = 400, canvasH = 300;
let isPanning = false, panStart = null, dragPtIdx = null;
let dragPunch = false;
let dragBendPoint = false;
let measureStart = null, measureEnd = null, measureStep = 0;
let animFrame = 0;

function w2c(wx, wy) {
  return { cx: wx * S.viewport.scale + S.viewport.offsetX, cy: -wy * S.viewport.scale + S.viewport.offsetY };
}
function c2w(cx, cy) {
  return { x: (cx - S.viewport.offsetX) / S.viewport.scale, y: -(cy - S.viewport.offsetY) / S.viewport.scale };
}

function resizeDrawCanvas() {
  const cont = document.getElementById('canvas-container');
  if (!cont) return;
  const r = cont.getBoundingClientRect();
  canvasW = Math.floor(r.width);
  canvasH = Math.floor(r.height);
  const dpr = window.devicePixelRatio || 1;
  drawCanvas.width = canvasW * dpr;
  drawCanvas.height = canvasH * dpr;
  drawCanvas.style.width = canvasW + 'px';
  drawCanvas.style.height = canvasH + 'px';
}

// ==================== HEM HOOK 2D ====================
function findNearSegment(cx, cy, threshold) {
  const thresh = threshold || 10;
  let bestDist = Infinity, bestIdx = -1;
  for (let i = 0; i < S.points.length - 1; i++) {
    const a = w2c(S.points[i].x, S.points[i].y);
    const b = w2c(S.points[i + 1].x, S.points[i + 1].y);
    const dx = b.cx - a.cx, dy = b.cy - a.cy;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) continue;
    let t = ((cx - a.cx) * dx + (cy - a.cy) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const px = a.cx + t * dx, py = a.cy + t * dy;
    const d = Math.sqrt((cx - px) ** 2 + (cy - py) ** 2);
    if (d < bestDist && d < thresh) {
      bestDist = d; bestIdx = i;
    }
  }
  return bestIdx;
}

function drawHemHooks2D() {
  if (S.points.length < 2 || !S.hems || S.hems.length === 0) return;
  S.hems.forEach(hem => {
    const si = hem.segIndex;
    const numSegs = S.points.length - 1;
    if (si < 0 || si > numSegs) return;
    let pt, neighbor;
    if (si >= numSegs - 1) {
      // Hem at the end point of the last segment (edge of contour)
      pt = S.points[S.points.length - 1];
      neighbor = S.points[S.points.length - 2];
    } else {
      pt = S.points[si];
      neighbor = S.points[si + 1];
    }
    const isLeft = hem.side !== 'right';
    drawSingleHemHook(pt, neighbor, hem.height, isLeft);
  });
}

function drawSingleHemHook(pt, neighbor, hemHeight, isLeft) {
  const segAngle = Math.atan2(neighbor.y - pt.y, neighbor.x - pt.x);
  // Перпендикуляр вниз (внутрь материала)
  const perpAngle = isLeft ? (segAngle - Math.PI / 2) : (segAngle + Math.PI / 2);

  const br = S.metal.bendRadius;

  // Геометрия каймы:
  // pt → h1: перпендикуляр вниз на радиус гиба
  // h1 → h2: параллельно ребру (вперёд) на указанную длину
  const h1w = {
    x: pt.x + Math.cos(perpAngle) * br,
    y: pt.y + Math.sin(perpAngle) * br
  };
  const h2w = {
    x: h1w.x + Math.cos(segAngle) * hemHeight,
    y: h1w.y + Math.sin(segAngle) * hemHeight
  };

  const c0 = w2c(pt.x, pt.y);
  const c1 = w2c(h1w.x, h1w.y);
  const c2 = w2c(h2w.x, h2w.y);

  const isDark = S.isDark;
  const color = isLeft ? '#3b82f6' : '#8b5cf6';

  drawCtx.save();

  // L-образный контур каймы
  drawCtx.strokeStyle = color;
  drawCtx.lineWidth = 1.5;
  drawCtx.lineCap = 'round';
  drawCtx.lineJoin = 'round';
  drawCtx.beginPath();
  drawCtx.moveTo(c0.cx, c0.cy);
  drawCtx.lineTo(c1.cx, c1.cy);
  drawCtx.lineTo(c2.cx, c2.cy);
  drawCtx.stroke();

  // Точка гиба
  drawCtx.beginPath();
  drawCtx.arc(c1.cx, c1.cy, 3, 0, Math.PI * 2);
  drawCtx.fillStyle = color;
  drawCtx.fill();

  // Подпись — вдоль параллельной части (h1→h2)
  drawCtx.font = 'bold 8px sans-serif';
  drawCtx.textAlign = 'center';
  drawCtx.textBaseline = 'middle';
  const label = 'H' + hemHeight.toFixed(0);
  const lx = (c1.cx + c2.cx) / 2;
  const ly = (c1.cy + c2.cy) / 2;
  // Смещение подписи от линии
  const offset = isLeft ? -12 : 12;
  const segPerpX = -Math.sin(segAngle) * offset;
  const segPerpY = Math.cos(segAngle) * offset;
  drawCtx.fillStyle = color;
  drawCtx.fillText(label, lx + segPerpX, ly + segPerpY);

  drawCtx.restore();
}


function drawDrawCanvas() {
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

  // ==================== SIMULATION MODE ====================
  if (S.simMode && S.unfoldResult && S.points.length >= 2) {
    const sim = computeSimPoints();
    if (sim && sim.pts.length >= 2) {
      // Плоская линия развёртки (серая, для ориентира) — с тем же якорем,
      // что и согнутый контур (подана тем же местом к центру ручья).
      const flat = computeSimPoints([]);
      const flatPts = flat ? flat.pts : null;
      if (sim && flat && flat.bendMarkers && sim.anchorIndex !== undefined && flat.bendMarkers[sim.anchorIndex]) {
        const a = flat.bendMarkers[sim.anchorIndex];
        const dx = -a.x, dy = -a.y;
        flatPts.forEach(p => { p.x += dx; p.y += dy; });
      }
      // Развёрнутая линия (плоская). Пока нет активных гибов — это
      // основной вид детали (сплошная). При наличии согнутых — ориентир.
      const hasSimBends = S.simBends.length > 0;
      drawCtx.save();
      if (hasSimBends) {
        drawCtx.strokeStyle = isDark ? '#3a3a4e88' : '#c0c0c088';
        drawCtx.lineWidth = 1.5;
        drawCtx.setLineDash([6, 4]);
      } else {
        drawCtx.strokeStyle = isDark ? '#22c55e' : '#16a34a';
        drawCtx.lineWidth = 2.5;
        drawCtx.lineCap = 'round'; drawCtx.lineJoin = 'round';
      }
      drawCtx.beginPath();
      if (flatPts) {
      const sf0 = w2c(flatPts[0].x, flatPts[0].y);
      drawCtx.moveTo(sf0.cx, sf0.cy);
      for (let i = 1; i < flatPts.length; i++) {
        const p = w2c(flatPts[i].x, flatPts[i].y);
        drawCtx.lineTo(p.cx, p.cy);
      }
      drawCtx.stroke();
      drawCtx.setLineDash([]);
      drawCtx.restore();
      }

      // Согнутый контур (оранжевый) — только когда есть согнутые гибы.
      // Пока ничего не согнуто — отображается только развёрнутая линия.
      if (S.simBends.length > 0) {
      drawCtx.save();
      drawCtx.strokeStyle = isDark ? '#f59e0b33' : '#f59e0b22';
      drawCtx.lineWidth = 8;
      drawCtx.lineCap = 'round'; drawCtx.lineJoin = 'round';
      drawCtx.beginPath();
      const g0 = w2c(sim.pts[0].x, sim.pts[0].y);
      drawCtx.moveTo(g0.cx, g0.cy);
      for (let i = 1; i < sim.pts.length; i++) {
        const p = w2c(sim.pts[i].x, sim.pts[i].y);
        drawCtx.lineTo(p.cx, p.cy);
      }
      drawCtx.stroke();
      drawCtx.strokeStyle = isDark ? '#f59e0b' : '#d97706';
      drawCtx.lineWidth = 2.5;
      drawCtx.beginPath();
      const s0 = w2c(sim.pts[0].x, sim.pts[0].y);
      drawCtx.moveTo(s0.cx, s0.cy);
      for (let i = 1; i < sim.pts.length; i++) {
        const p = w2c(sim.pts[i].x, sim.pts[i].y);
        drawCtx.lineTo(p.cx, p.cy);
      }
      drawCtx.stroke();
      drawCtx.restore();
      } // end if simBends > 0 (согнутый контур)

      // Точки контура (только для согнутого контура)
      if (S.simBends.length > 0) {
      sim.pts.forEach(pt => {
        const c = w2c(pt.x, pt.y);
        drawCtx.beginPath();
        drawCtx.arc(c.cx, c.cy, 3, 0, Math.PI * 2);
        drawCtx.fillStyle = isDark ? '#f59e0baa' : '#d97706aa';
        drawCtx.fill();
      });
      } else {
      // Вершины развёртки (маленькие точки на плоской линии)
      flatPts.forEach(pt => {
        const c = w2c(pt.x, pt.y);
        drawCtx.beginPath();
        drawCtx.arc(c.cx, c.cy, 3, 0, Math.PI * 2);
        drawCtx.fillStyle = isDark ? '#22c55eaa' : '#16a34aaa';
        drawCtx.fill();
      });
      }

      // Маркеры точек гиба
      sim.bendMarkers.forEach(m => {
        const c = w2c(m.x, m.y);
        const isActive = S.simBends.includes(m.index);
        // Кольцо
        drawCtx.beginPath();
        drawCtx.arc(c.cx, c.cy, 10, 0, Math.PI * 2);
        drawCtx.fillStyle = isActive
          ? (isDark ? '#22c55e44' : '#16a34a33')
          : (isDark ? '#3b82f644' : '#3b82f633');
        drawCtx.fill();
        drawCtx.strokeStyle = isActive
          ? (isDark ? '#22c55e' : '#16a34a')
          : (isDark ? '#3b82f6' : '#3b82f6');
        drawCtx.lineWidth = 2;
        drawCtx.stroke();
        // Номер гиба
        drawCtx.fillStyle = isActive
          ? (isDark ? '#22c55e' : '#16a34a')
          : (isDark ? '#93c5fd' : '#2563eb');
        drawCtx.font = 'bold 10px sans-serif';
        drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'middle';
        drawCtx.fillText(String(m.index + 1), c.cx, c.cy);
      });

      // Подпись режима
      drawCtx.fillStyle = isDark ? '#f59e0b' : '#d97706';
      drawCtx.font = 'bold 11px sans-serif';
      drawCtx.textAlign = 'left'; drawCtx.textBaseline = 'top';
      drawCtx.fillText(S.lang === 'en'
        ? 'Bending simulation — click bend points to fold'
        : 'Симуляция гибки — кликайте по точкам гиба чтобы согнуть', 10, 10);
      drawCtx.font = '9px sans-serif';
      const activeCount = S.simBends.length;
      const totalBends = sim.bendMarkers.length;
      drawCtx.fillText(S.lang === 'en'
        ? 'Bent: ' + activeCount + ' / ' + totalBends + ' — click again to unfold'
        : 'Согнуто: ' + activeCount + ' / ' + totalBends + ' — повторный клик разгибает', 10, 26);
    }
    // В режиме симуляции не рисуем обычный контур и размеры
    drawDrawCanvasSimDone = true;
  } else {
    drawDrawCanvasSimDone = false;
  }

  // Profile lines
  if (S.points.length >= 2 && !drawDrawCanvasSimDone) {
    // Glow
    drawCtx.save();
    drawCtx.strokeStyle = isDark ? '#22c55e22' : '#16a34a22';
    drawCtx.lineWidth = 8;
    drawCtx.lineCap = 'round'; drawCtx.lineJoin = 'round';
    drawCtx.beginPath();
    const gf = w2c(S.points[0].x, S.points[0].y);
    drawCtx.moveTo(gf.cx, gf.cy);
    for (let i = 1; i < S.points.length; i++) {
      const p = w2c(S.points[i].x, S.points[i].y);
      drawCtx.lineTo(p.cx, p.cy);
    }
    drawCtx.stroke();
    drawCtx.restore();

    // Main line
    drawCtx.strokeStyle = isDark ? '#22c55e' : '#16a34a';
    drawCtx.lineWidth = 2.5;
    drawCtx.lineCap = 'round'; drawCtx.lineJoin = 'round';
    drawCtx.beginPath();
    const f = w2c(S.points[0].x, S.points[0].y);
    drawCtx.moveTo(f.cx, f.cy);
    for (let i = 1; i < S.points.length; i++) {
      const p = w2c(S.points[i].x, S.points[i].y);
      drawCtx.lineTo(p.cx, p.cy);
    }
    drawCtx.stroke();

    // ==================== DIMENSION LABELS WITH SMART PLACEMENT ====================
    if (S.showDimensions) {
      S._hitAreas = [];

      // Вспомогательные функции для умного размещения подписей
      function rectsOverlap(a, b, pad) {
        const p = pad || 3;
        const ox = Math.min(a.x + a.w / 2, b.x + b.w / 2) - Math.max(a.x - a.w / 2, b.x - b.w / 2);
        const oy = Math.min(a.y + a.h / 2, b.y + b.h / 2) - Math.max(a.y - a.h / 2, b.y - b.h / 2);
        return ox > p && oy > p;
      }

      // Генерация кандидатов вокруг базовой точки
      // prefX/prefY — предпочтительное направление, offsets — дистанции
      function genCandidates(bx, by, prefX, prefY, offsets, extraDirs) {
        const cands = [];
        const baseA = Math.atan2(prefY, prefX);
        // Основные направления — веер вокруг предпочтительного
        const dirs = [0, 0.35, -0.35, 0.7, -0.7, 1.05, -1.05, Math.PI];
        (extraDirs || []).forEach(ed => dirs.push(ed));
        for (const off of offsets) {
          for (const da of dirs) {
            const a = baseA + da;
            cands.push({
              x: bx + Math.cos(a) * off,
              y: by + Math.sin(a) * off,
              rank: Math.abs(da) * 20 + off * 0.5
            });
          }
        }
        cands.sort((x, y) => x.rank - y.rank);
        return cands;
      }

      const placed = [];
      const dimLabels = [];

      // 1. Подписи длин сегментов
      if (S.points.length >= 2) {
        drawCtx.font = '10px monospace';
        for (let i = 0; i < S.points.length - 1; i++) {
          const sl = dist(S.points[i], S.points[i + 1]);
          const mx = (S.points[i].x + S.points[i + 1].x) / 2;
          const my = (S.points[i].y + S.points[i + 1].y) / 2;
          const mc = w2c(mx, my);
          const a = Math.atan2(S.points[i + 1].y - S.points[i].y, S.points[i + 1].x - S.points[i].x);
          // Нормаль к сегменту (основная сторона)
          const nX = -Math.sin(a), nY = Math.cos(a);
          // Направление вдоль сегмента (экранное)
          const aX = Math.cos(a), aY = -Math.sin(a);
          const text = sl.toFixed(1);
          const tw = drawCtx.measureText(text).width + 8;

          // Идеальная позиция
          const ideal = { x: mc.cx + nX * 14, y: mc.cy + nY * 14 };

          // Кандидаты: обе стороны нормали, разные дистанции, сдвиги вдоль сегмента
          const cands = [];
          const dists = [14, 26, 38, 52];
          const sides = [1, -1];
          const shifts = [0, -28, 28];
          for (const side of sides) {
            for (const dist of dists) {
              for (const sh of shifts) {
                cands.push({
                  x: mc.cx + nX * dist * side + aX * sh,
                  y: mc.cy + nY * dist * side + aY * sh,
                  rank: dist * 3 + Math.abs(sh)
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
      }

      // 2. Дуги углов + подписи углов
      // Карта вершин: vertexIndex -> bend объект с полем feasible
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

        // Дуга показывает УГОЛ ПОВОРОТА контура (внутренний угол профиля = π − ba).
        // Она идёт от направления входа (продолжение входящего сегмента, aIn + π)
        // к направлению выхода (aOut) — то есть ложится «между двумя линиями»:
        // между прямой, вдоль которой шёл контур, и следующим сегментом.
        // В экранных углах (Y перевёрнут): cs = -aIn + π, ce = -aOut.
        const cs = -aIn + Math.PI;
        const ce = -aOut;
        let ds = ce - cs;
        while (ds > Math.PI) ds -= 2 * Math.PI;
        while (ds <= -Math.PI) ds += 2 * Math.PI;
        // |ds| = π − ba = угол поворота контура
        const ccw = ds < 0;

        drawCtx.beginPath();
        drawCtx.arc(p.cx, p.cy, ar, cs, ce, ccw);
        drawCtx.strokeStyle = infeasible ? '#ef4444' : (isDark ? '#fbbf24' : '#f59e0b');
        drawCtx.lineWidth = infeasible ? 3 : 1.5;
        drawCtx.stroke();
        // Красный ореол вокруг невозможного гиба
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

        // Кандидаты вокруг вершины
        const cands = [];
        const dists2 = [28, 38, 50, 64];
        for (const dist of dists2) {
          for (let k = 0; k < 8; k++) {
            const ang = mid + k * Math.PI / 4;
            cands.push({
              x: p.cx + Math.cos(ang) * dist,
              y: p.cy + Math.sin(ang) * dist,
              rank: Math.abs(normAngle(ang - mid)) * 40 + dist
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
        // Полупрозрачная плашка под текстом
        drawCtx.fillStyle = isDark ? 'rgba(26,26,46,0.82)' : 'rgba(255,255,255,0.88)';
        drawCtx.beginPath();
        drawCtx.roundRect(label.x - bw / 2, label.y - bh / 2, bw, bh, 3);
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
            // Добавляем значок ⚠ перед углом при невозможности
          }
          drawCtx.font = 'bold 9px sans-serif';
          drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'middle';
          drawCtx.fillText((label.infeasible ? '⚠ ' : '') + label.text, label.x, label.y);
        }
        drawCtx.restore();
      });
    }
  }

  // Points
  if (!drawDrawCanvasSimDone) {
  S._hitAreas = S._hitAreas || [];
  // Build bend number map: vertexIndex -> bendNumber (1-indexed)
  const bendNumMap = {};
  if (S.unfoldResult && S.unfoldResult.bendInfos) {
    S.unfoldResult.bendInfos.forEach((b, idx) => { bendNumMap[b.vertexIndex] = idx + 1; });
  }
  S.points.forEach((pt, i) => {
    const { cx, cy } = w2c(pt.x, pt.y);
    const hov = S.hoveredPt === i;
    const isF = i === 0, isL = i === S.points.length - 1;
    const isActive = S.toolMode === 'draw' && S.drawFromIdx === 0 && i === 0;
    if (hov || isActive) {
      drawCtx.beginPath();
      drawCtx.arc(cx, cy, hov ? 14 : 12, 0, Math.PI * 2);
      drawCtx.fillStyle = isActive ? '#3b82f620' : '#22c55e15';
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
    drawCtx.arc(cx, cy, hov ? 8 : 6, 0, Math.PI * 2);
    drawCtx.fillStyle = isF ? '#22c55e' : isL ? '#ef4444' : (isDark ? '#22c55e' : '#16a34a');
    drawCtx.fill();
    drawCtx.beginPath();
    drawCtx.arc(cx, cy, hov ? 3.5 : 2.5, 0, Math.PI * 2);
    drawCtx.fillStyle = isDark ? '#0a0a0a' : '#fff';
    drawCtx.fill();
    // Label — only bend vertices numbered to match unfold
    const bNum = bendNumMap[i];
    if (bNum) {
      const label = String(bNum);
      drawCtx.font = 'bold 8px monospace';
      const lw = drawCtx.measureText(label).width;
      const lx = cx + 10, ly = cy - 6;
      drawCtx.fillStyle = isDark ? '#2e1a0acc' : '#fff7edcc';
      drawCtx.beginPath();
      drawCtx.roundRect(lx - 2, ly - 7, lw + 4, 10, 2);
      drawCtx.fill();
      drawCtx.fillStyle = isDark ? '#fbbf24' : '#ea580c';
      drawCtx.textAlign = 'left'; drawCtx.textBaseline = 'middle';
      drawCtx.fillText(label, lx, ly - 2);
    }
    // Hit area for point (always, for dragging)
    S._hitAreas.push({ type: 'point', index: i, x: cx - 10, y: cy - 10, w: 20, h: 20 });
  });
  } // end if !drawDrawCanvasSimDone

  // Hem tool: highlight hovered segment
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

  // Hem hooks (візуальні "крючки" кайми)
  drawHemHooks2D();

  // Close indicator
  if ((S.toolMode === 'draw' || S.toolMode === 'select') && S.points.length >= 3 && S.mouseWorld) {
    // Индикатор замыкания: только при рисовании от конца — у первой точки (двойной клик)
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
        animFrame = requestAnimationFrame(drawDrawCanvas);
        return;
      }
    }
  }

  // Snap indicator
  if (S.toolMode === 'draw' && S.snapEndpoint >= 0 && S.snapEndpoint < S.points.length) {
    const sp = w2c(S.points[S.snapEndpoint].x, S.points[S.snapEndpoint].y);
    drawCtx.strokeStyle = '#06b6d4';
    drawCtx.lineWidth = 2.5;
    drawCtx.beginPath();
    drawCtx.arc(sp.cx, sp.cy, 12, 0, Math.PI * 2);
    drawCtx.stroke();
  }

  // Rubber band
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

  // Measure tool
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
    drawCtx.roundRect(mxc - lw2 / 2 - 4, myc - 18, lw2 + 8, 16, 3);
    drawCtx.fill();
    drawCtx.fillStyle = mc;
    drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'middle';
    drawCtx.fillText(lb, mxc, myc - 10);
  }

  // Mouse crosshair
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

  // ==================== TOOL OVERLAY (1:1 scale) ====================
  if (S.showToolsOnCanvas) {
    drawToolsOnCanvas(isDark);
  }

  // ==================== FOLDED PREVIEW ====================
  if (S.showToolsOnCanvas && S.previewBendIdx !== null && S.previewBendIdx >= 0) {
    const folded = computeFoldedPoints(S.previewBendIdx, S.previewFlip);
    if (folded && folded.length >= 2) {
      // Glow
      drawCtx.save();
      drawCtx.strokeStyle = isDark ? '#f59e0b33' : '#f59e0b22';
      drawCtx.lineWidth = 8;
      drawCtx.lineCap = 'round'; drawCtx.lineJoin = 'round';
      drawCtx.beginPath();
      const gf = w2c(folded[0].x, folded[0].y);
      drawCtx.moveTo(gf.cx, gf.cy);
      for (let i = 1; i < folded.length; i++) {
        const p = w2c(folded[i].x, folded[i].y);
        drawCtx.lineTo(p.cx, p.cy);
      }
      drawCtx.stroke();
      drawCtx.restore();

      // Main line
      drawCtx.strokeStyle = isDark ? '#f59e0b' : '#d97706';
      drawCtx.lineWidth = 2.5;
      drawCtx.lineCap = 'round'; drawCtx.lineJoin = 'round';
      drawCtx.beginPath();
      const f0 = w2c(folded[0].x, folded[0].y);
      drawCtx.moveTo(f0.cx, f0.cy);
      for (let i = 1; i < folded.length; i++) {
        const p = w2c(folded[i].x, folded[i].y);
        drawCtx.lineTo(p.cx, p.cy);
      }
      drawCtx.stroke();

      // Точки согнутого контура
      folded.forEach((pt, i) => {
        const c = w2c(pt.x, pt.y);
        drawCtx.beginPath();
        drawCtx.arc(c.cx, c.cy, 4, 0, Math.PI * 2);
        drawCtx.fillStyle = isDark ? '#f59e0baa' : '#d97706aa';
        drawCtx.fill();
      });

      // Подпись: какой гиб просматриваем + усилие гибки
      const bends = S.unfoldResult.bendInfos;
      const b = bends[S.previewBendIdx];
      const interiorRad = Math.PI - b.bendAngle;
      const bendDeg = (interiorRad * 180 / Math.PI).toFixed(0);
      // Усилие гибки
      const die = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
      const force = (die && typeof calcBendForce === 'function')
        ? calcBendForce(interiorRad, S.metal.thickness, S.metal.width, die, S.metal.metalTypeIndex)
        : null;
      drawCtx.fillStyle = isDark ? '#f59e0b' : '#d97706';
      drawCtx.font = 'bold 11px sans-serif';
      drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'top';
      const labelPt = w2c(0, 0);
      const flipTxt = S.previewFlip ? ' ←' : ' →';
      drawCtx.fillText('Гиб ' + (S.previewBendIdx + 1) + ' (' + bendDeg + '°)' + flipTxt + ' — клик ещё раз для смены направления', labelPt.cx, labelPt.cy - 54);
      drawCtx.font = '9px sans-serif';
      drawCtx.fillText('Тяни кружок ◉ чтобы задать точку сгиба на пуансоне, Esc — выход', labelPt.cx, labelPt.cy - 40);
      if (force) {
        drawCtx.font = 'bold 10px sans-serif';
        drawCtx.fillStyle = isDark ? '#60a5fa' : '#2563eb';
        const tonsStr = force.tons < 1 ? force.tons.toFixed(2) : force.tons.toFixed(1);
        drawCtx.fillText('Усилие: ' + tonsStr + ' тс (' + (force.newtons / 1000).toFixed(1) + ' кН)', labelPt.cx, labelPt.cy - 26);
      }

      // === Точка сгибания (перетаскиваемая) ===
      const bp = w2c(S.bendPointX || 0, S.bendPointY || 0);
      drawCtx.beginPath();
      drawCtx.arc(bp.cx, bp.cy, 9, 0, Math.PI * 2);
      drawCtx.fillStyle = isDark ? '#f59e0b' : '#d97706';
      drawCtx.fill();
      drawCtx.strokeStyle = isDark ? '#ffffff' : '#ffffff';
      drawCtx.lineWidth = 2;
      drawCtx.stroke();
      drawCtx.beginPath();
      drawCtx.arc(bp.cx, bp.cy, 3, 0, Math.PI * 2);
      drawCtx.fillStyle = '#ffffff';
      drawCtx.fill();
    }
  }
}

// Вычисляет точки согнутого контура для предпросмотра на станке.
// Деталь (профиль) уже согнута — это сечение. Предпросмотр = повернуть
// весь контур так, чтобы выбранный гиб встал на пуансон:
// вершина → (bendPointX, bendPointY), биссектриса угла коллинеарна оси Y,
// полки вверх (V в ручье матрицы). flip — зеркало по вертикали.
function computeFoldedPoints(bendIdx, flip) {
  if (!S.unfoldResult || !S.unfoldResult.bendInfos) return null;
  const bends = S.unfoldResult.bendInfos;
  if (bendIdx < 0 || bendIdx >= bends.length) return null;
  const b = bends[bendIdx];
  const v = b.vertexIndex;
  const pts = S.points;
  if (v < 1 || v >= pts.length - 1) return null;

  const pOX = S.bendPointX || 0;
  const pOY = S.bendPointY || 0;

  // Направления сегментов от вершины (к соседним точкам)
  const d1 = Math.atan2(pts[v - 1].y - pts[v].y, pts[v - 1].x - pts[v].x);
  const d2 = Math.atan2(pts[v + 1].y - pts[v].y, pts[v + 1].x - pts[v].x);

  // Внутренний угол между полками (угол детали)
  const interior = Math.PI - b.bendAngle;

  // Знак обхода: как повёрнут d2 относительно d1 в исходном контуре
  let s = d2 - d1;
  while (s > Math.PI) s -= 2 * Math.PI;
  while (s <= -Math.PI) s += 2 * Math.PI;
  s = s >= 0 ? 1 : -1;

  // Целевое направление для d1: полка «до» вверх, биссектриса вертикальна
  const d1Target = Math.PI / 2 - s * interior / 2;
  const rot = d1Target - d1; // угол поворота всего контура

  const cosR = Math.cos(rot), sinR = Math.sin(rot);
  const folded = pts.map(p => {
    const dx = p.x - pts[v].x;
    const dy = p.y - pts[v].y;
    let rx = dx * cosR - dy * sinR;
    let ry = dx * sinR + dy * cosR;
    return { x: rx + pOX, y: ry + pOY };
  });

  // Зеркало по вертикали (через bendPoint) при flip
  if (flip) {
    for (let i = 0; i < folded.length; i++) {
      folded[i].x = 2 * pOX - folded[i].x;
    }
  }

  return folded;
}

// ═══════════════════════════════════════════════════════════════
// СИМУЛЯЦИЯ ГИБКИ: плоская линия развёртки с точками гибов.
// Клик по точке гиба сгибает хвост контура в этом месте.
// ═══════════════════════════════════════════════════════════════
function computeSimPoints() {
  if (!S.unfoldResult || !S.points || S.points.length < 2) return null;
  const res = S.unfoldResult;
  const bends = res.bendInfos || [];
  const active = Array.isArray(S.simBends) ? S.simBends : [];

  // Строим согнутый контур каскадно по сегментам исходного профиля.
  // Каждый активный гиб поворачивает «хвост» ВВЕРХ (на пуансон).
  // Излом в вершине — острый (без фаски).
  const pts = S.points;
  const out = [{ x: pts[0].x, y: pts[0].y }];
  const bendMarkers = [];
  let angle = 0; // текущее направление контура (0 = вправо)
  const bendAtVertex = new Map();
  bends.forEach((b, idx) => bendAtVertex.set(b.vertexIndex, idx));

  for (let i = 0; i < pts.length - 1; i++) {
    const segLen = dist(pts[i], pts[i + 1]);
    const cur = out[out.length - 1];
    const nx = cur.x + Math.cos(angle) * segLen;
    const ny = cur.y + Math.sin(angle) * segLen;
    out.push({ x: nx, y: ny });

    const bi = bendAtVertex.get(i + 1);
    if (bi !== undefined) {
      bendMarkers.push({ x: nx, y: ny, index: bi, angle, outIdx: out.length - 1 });
      if (active.includes(bi)) {
        angle -= bends[bi].deflection;
      }
    }
  }

  // Якорь: последний кликнутый гиб (последний элемент в simBends).
  // Именно его вершина встаёт в центр V-ручья (0,0) с V-выравниванием.
  // Если активных нет — первый маркер.
  let anchorIndex = 0;
  if (active.length > 0) {
    const lastClicked = active[active.length - 1];
    anchorIndex = bendMarkers.findIndex(m => m.index === lastClicked);
    if (anchorIndex < 0) anchorIndex = 0;
  }
  const hasActive = bendMarkers.some(m => active.includes(m.index));
  if (bendMarkers.length) {
    const anchor = bendMarkers[anchorIndex];
    if (hasActive) {
      const vIdx = anchor.outIdx;
      const prevP = out[vIdx - 1];
      const nextP = out[vIdx + 1];
      if (prevP && nextP && bends[anchor.index]) {
        // Направления полок от вершины (к предыдущей и следующей точке)
        const d1 = Math.atan2(prevP.y - anchor.y, prevP.x - anchor.x);
        const d2 = Math.atan2(nextP.y - anchor.y, nextP.x - anchor.x);
        // Знак обхода контура
        let s = d2 - d1;
        while (s > Math.PI) s -= 2 * Math.PI;
        while (s <= -Math.PI) s += 2 * Math.PI;
        s = s >= 0 ? 1 : -1;
        // Внутренний угол между полками (угол детали)
        const interior = Math.PI - bends[anchor.index].bendAngle;
        // Целевое направление полки «до»: биссектриса вертикальна (π/2)
        const d1Target = Math.PI / 2 - s * interior / 2;
        const rot = d1Target - d1;
        // Поворачиваем весь контур вокруг вершины, чтобы угол встал V-образно
        const cosR = Math.cos(rot), sinR = Math.sin(rot);
        out.forEach(p => {
          const dx = p.x - anchor.x, dy = p.y - anchor.y;
          const rx = dx * cosR - dy * sinR;
          const ry = dx * sinR + dy * cosR;
          p.x = rx + anchor.x;
          p.y = ry + anchor.y;
        });
        bendMarkers.forEach(m => {
          const dx = m.x - anchor.x, dy = m.y - anchor.y;
          const rx = dx * cosR - dy * sinR;
          const ry = dx * sinR + dy * cosR;
          m.x = rx + anchor.x;
          m.y = ry + anchor.y;
        });
      }
    }
    // Сдвиг вершины якоря в (0,0)
    const dx = -anchor.x, dy = -anchor.y;
    out.forEach(p => { p.x += dx; p.y += dy; });
    bendMarkers.forEach(m => { m.x += dx; m.y += dy; });
  }

  return { pts: out, bendMarkers, bends, anchorIndex };
}

// Находит центр V-ручья матрицы по зазору на верхней грани DXF-профиля.
// V-ручей — это ВНУТРЕННИЙ зазор между точками верхней грани:
// его соседние точки НЕ являются крайними точками контура (minX/maxX).
// Для профиля «полка слева + ручей + полка справа» верхняя грань даёт 4 точки:
// [minX, внутр.1, внутр.2, maxX] — внутренний зазор это x3-x2.
function findDieGrooveCenter(profile) {
  if (!profile || !profile.chains) return (profile.minX || 0) + (profile.width || 0) / 2;
  const EPS = 1e-6;
  const maxY = profile.maxY;
  const xs = [];
  profile.chains.forEach(chain => {
    chain.forEach(p => {
      if (Math.abs(p.y - maxY) < EPS) xs.push(p.x);
    });
  });
  if (xs.length < 3) return (profile.minX || 0) + (profile.width || 0) / 2;
  xs.sort((a, b) => a - b);
  const minX = xs[0], maxX = xs[xs.length - 1];
  // Ищем ВНУТРЕННИЙ зазор: соседние точки не на краях профиля
  let gap = 0, gapStart = 0, gapEnd = 0;
  for (let i = 0; i < xs.length - 1; i++) {
    if (xs[i] <= minX + EPS) continue;          // точка на левом краю
    if (xs[i + 1] >= maxX - EPS) continue;       // точка на правом краю
    const g = xs[i + 1] - xs[i];
    if (g > gap) { gap = g; gapStart = xs[i]; gapEnd = xs[i + 1]; }
  }
  if (gap <= EPS) {
    // Фолбэк: центральный зазор
    const mid = Math.floor(xs.length / 2);
    gapStart = xs[mid - 1]; gapEnd = xs[mid];
    if (gapEnd - gapStart <= 0) return (minX + maxX) / 2;
  }
  return (gapStart + gapEnd) / 2;
}

// Рисует матрицу и пуансон в масштабе 1:1 в центре координатной сетки.
// (0,0) = центр ручья матрицы (ось гиба). Верхняя грань матрицы — на оси X.
// Пуансон сверху (Y+), матрица снизу (Y-).
// Для кастомных инструментов рисуется реальный DXF-профиль,
// для стандартных — упрощённая геометрия по размерам V/S/H.
function drawToolsOnCanvas(isDark) {
  const die = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
  const punch = (typeof getPunchByIndex === 'function') ? getPunchByIndex(S.metal.punchIndex) : null;
  if (!die || !punch) return;

  // === Матрица ===
  drawCtx.strokeStyle = isDark ? '#3b82f6aa' : '#3b82f6cc';
  drawCtx.fillStyle = isDark ? '#3b82f618' : '#3b82f615';
  drawCtx.lineWidth = 1.5;

  if (die.profile && die.profile.chains) {
    // Кастомная матрица — рисуем реальный DXF-профиль
    // Центр V-ручья на (0,0), верхняя грань на оси X (Y=0), тело вниз (Y-)
    // Находим центр V-ручья по зазору на верхней грани
    const vCenter = findDieGrooveCenter(die.profile);
    const offX = -vCenter;
    const offY = -(die.profile.minY + die.profile.height);
    die.profile.chains.forEach(chain => {
      drawCtx.beginPath();
      chain.forEach((p, pi) => {
        const c = w2c(p.x + offX, p.y + offY);
        if (pi === 0) drawCtx.moveTo(c.cx, c.cy);
        else drawCtx.lineTo(c.cx, c.cy);
      });
      drawCtx.closePath();
      drawCtx.fill();
      drawCtx.stroke();
    });
  } else {
    // Стандартная матрица — упрощённая геометрия
    const vW = die.vWidth, dH = die.height;
    const halfV = vW / 2;
    const sw = die.swidth || vW * 2;
    const halfS = sw / 2;
    const depth = dH * 0.5;
    const p = (x, y) => w2c(x, y);
    drawCtx.beginPath();
    let q = p(-halfS, 0);
    drawCtx.moveTo(q.cx, q.cy);
    q = p(-halfV, 0);
    drawCtx.lineTo(q.cx, q.cy);
    q = p(0, -depth);
    drawCtx.lineTo(q.cx, q.cy);
    q = p(halfV, 0);
    drawCtx.lineTo(q.cx, q.cy);
    q = p(halfS, 0);
    drawCtx.lineTo(q.cx, q.cy);
    q = p(halfS, -dH);
    drawCtx.lineTo(q.cx, q.cy);
    q = p(-halfS, -dH);
    drawCtx.lineTo(q.cx, q.cy);
    drawCtx.closePath();
    drawCtx.fill();
    drawCtx.stroke();
  }

  // Подпись матрицы
  const dH = die.height;
  const dl = w2c(0, -dH);
  drawCtx.fillStyle = isDark ? '#6085f0' : '#2563eb';
  drawCtx.font = '9px sans-serif';
  drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'bottom';
  drawCtx.fillText((S.lang === 'en' ? die.nameEn : die.nameRu) || 'Die', dl.cx, dl.cy - 3);

  // === Пуансон ===
  const pOX = S.punchOffsetX || 0;
  const pOY = S.punchOffsetY || 0;
  drawCtx.strokeStyle = isDark ? '#ef4444aa' : '#ef4444cc';
  drawCtx.fillStyle = isDark ? '#ef444418' : '#ef444415';
  drawCtx.lineWidth = 1.5;

  if (punch.profile && punch.profile.chains) {
    // Кастомный пуансон — рисуем реальный DXF-профиль
    const offX = -(punch.profile.minX + punch.profile.width / 2) + pOX;
    const offY = -punch.profile.minY + pOY;
    punch.profile.chains.forEach(chain => {
      drawCtx.beginPath();
      chain.forEach((p, pi) => {
        const c = w2c(p.x + offX, p.y + offY);
        if (pi === 0) drawCtx.moveTo(c.cx, c.cy);
        else drawCtx.lineTo(c.cx, c.cy);
      });
      drawCtx.closePath();
      drawCtx.fill();
      drawCtx.stroke();
    });
  } else {
    // Стандартный пуансон — упрощённая геометрия
    const punchR = punch.radius || 1;
    const pS = punch.swidth || 20;
    const pH = punch.height || 50;
    const halfS = pS / 2;
    const pTopY = pH;
    const sc = S.viewport.scale;
    const p = (x, y) => w2c(x + pOX, y + pOY);
    drawCtx.beginPath();
    // Вершина (центр, Y=0)
    let q = p(0, 0);
    drawCtx.moveTo(q.cx, q.cy);
    // Скругление радиусом R влево
    const pL = p(-halfS, 0);
    const pR = p(halfS, 0);
    const angleL = Math.atan2(pL.cy - q.cy, pL.cx - q.cx);
    const angleR = Math.atan2(pR.cy - q.cy, pR.cx - q.cx);
    drawCtx.arc(q.cx, q.cy, punchR * sc, angleL, angleR, false);
    // Правая грань вверх
    q = p(halfS, pTopY);
    drawCtx.lineTo(q.cx, q.cy);
    // Верх
    q = p(-halfS, pTopY);
    drawCtx.lineTo(q.cx, q.cy);
    // Левая грань вниз
    drawCtx.lineTo(pL.cx, pL.cy);
    drawCtx.closePath();
    drawCtx.fill();
    drawCtx.stroke();
  }

  // Подпись пуансона
  const pH = punch.height || 50;
  const pl = w2c(pOX, pH + pOY);
  drawCtx.fillStyle = isDark ? '#f06060' : '#dc2626';
  drawCtx.font = '9px sans-serif';
  drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'top';
  drawCtx.fillText((S.lang === 'en' ? punch.nameEn : punch.nameRu) || 'Punch', pl.cx, pl.cy + 3);

  // Осевая линия ручья (пунктир)
  drawCtx.strokeStyle = isDark ? '#88888888' : '#88888866';
  drawCtx.lineWidth = 1;
  drawCtx.setLineDash([4, 3]);
  drawCtx.beginPath();
  const o = w2c(0, 0);
  drawCtx.moveTo(o.cx, o.cy - pH * S.viewport.scale);
  drawCtx.lineTo(o.cx, o.cy + dH * S.viewport.scale);
  drawCtx.stroke();
  drawCtx.setLineDash([]);

  // Индикатор смещения пуансона
  if (Math.abs(pOX) > 0.01 || Math.abs(pOY) > 0.01) {
    const offPt = w2c(pOX, pOY);
    drawCtx.fillStyle = isDark ? '#f06060' : '#dc2626';
    drawCtx.font = '9px sans-serif';
    drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'top';
    drawCtx.fillText('Δ ' + pOX.toFixed(1) + ', ' + pOY.toFixed(1) + ' mm', offPt.cx, offPt.cy + 12);
  }
}

// ==================== UNFOLD CANVAS ====================
const unfoldCanvas = document.getElementById('unfold-canvas');
const unfoldCtx = unfoldCanvas.getContext('2d');
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

  // Outer rect
  unfoldCtx.strokeStyle = isDark ? '#22c55e' : '#16a34a';
  unfoldCtx.lineWidth = 2;
  unfoldCtx.strokeRect(ox, oy, L * sc, W * sc);

  // Trim margin
  unfoldCtx.save();
  unfoldCtx.strokeStyle = isDark ? '#22c55e' : '#16a34a';
  unfoldCtx.globalAlpha = .15;
  unfoldCtx.lineWidth = 1;
  unfoldCtx.setLineDash([4, 4]);
  unfoldCtx.strokeRect(ox + 5 * sc, oy + 5 * sc, (L - 10) * sc, (W - 10) * sc);
  unfoldCtx.setLineDash([]);
  unfoldCtx.restore();

  // Elements
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

  // Hems
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
      unfoldCtx.fillText(el.height.toFixed(1) + ' ' + arrow, ox + mx * sc, oy + W * sc / 2);
      unfoldCtx.restore();
    }
  });

  // Bend lines
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

    // Number
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

  // Hem bend lines (no numbers)
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

  // Tick marks
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

  // Dimensions
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

  // Scale bar
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

  // Legend
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

// ==================== BEND ANIMATION ====================
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

// ==================== 3D PREVIEW ====================
let view3dW = 300, view3dH = 256;
let view3dZoom = 1, view3dRotY = 0.5, view3dRotX = -0.5;
let view3dUserZoomed = false;
let isDragging3D = false, drag3dStart = null;
// Центр модели для центрирования 3D вида
let view3dCenterX = 0, view3dCenterY = 0;

// ==================== 3D MODAL ====================
let view3dModalOpen = false;
let view3dFullW = 800, view3dFullH = 600;
let isDragging3DFull = false, drag3dStartFull = null;

function toggle3DModal() {
  const modal = document.getElementById('view3d-modal');
  if (view3dModalOpen) {
    close3DModal();
  } else {
    open3DModal();
  }
}

function open3DModal() {
  const modal = document.getElementById('view3d-modal');
  modal.classList.remove('hidden');
  view3dModalOpen = true;
  
  // Resize full canvas
  requestAnimationFrame(() => {
    resizeView3dFull();
    draw3DPreviewFull();
  });
}

function close3DModal() {
  const modal = document.getElementById('view3d-modal');
  modal.classList.add('hidden');
  view3dModalOpen = false;
  isDragging3DFull = false;
}

function resizeView3dFull() {
  const cont = document.getElementById('view3d-modal-container');
  if (!cont) return;
  const r = cont.getBoundingClientRect();
  const border = 2;
  view3dFullW = Math.max(200, Math.floor(r.width - border * 2));
  view3dFullH = Math.max(200, Math.floor(r.height - border * 2));
  const dpr = window.devicePixelRatio || 1;
  const cv = document.getElementById('view3d-canvas-full');
  if (!cv) return;
  cv.width = view3dFullW * dpr;
  cv.height = view3dFullH * dpr;
  cv.style.width = view3dFullW + 'px';
  cv.style.height = view3dFullH + 'px';
}

function draw3DPreviewFull() {
  const cv = document.getElementById('view3d-canvas-full');
  if (!cv || S.points.length < 2) return;
  const ctx = cv.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  
  const isDark = S.isDark;
  ctx.fillStyle = isDark ? '#1a1a2e' : '#f5f5f5';
  ctx.fillRect(0, 0, view3dFullW, view3dFullH);
  
  draw3DProfile3D(true);
  
  // Контролы
  const ctrl = document.getElementById('view3d-controls-full');
  if (ctrl) {
    ctrl.textContent = t('dragToRotateEsc');
  }
}

function resizeView3d() {
  const cont = document.getElementById('view3d-container');
  if (!cont) return;
  const r = cont.getBoundingClientRect();
  // Учитываем border (2px с каждой стороны)
  const border = 2;
  view3dW = Math.max(100, Math.floor(r.width - border * 2));
  view3dH = Math.max(80, Math.floor(r.height - border * 2));
  const dpr = window.devicePixelRatio || 1;
  const cv = document.getElementById('view3d-canvas');
  if (!cv) return;
  cv.width = view3dW * dpr;
  cv.height = view3dH * dpr;
  cv.style.width = view3dW + 'px';
  cv.style.height = view3dH + 'px';
}

function project3D(x, y, z, useFull = false) {
  const cosY = Math.cos(view3dRotY), sinY = Math.sin(view3dRotY);
  const cosX = Math.cos(view3dRotX), sinX = Math.sin(view3dRotX);
  
  // Смещаем относительно центра модели
  let rx = x - view3dCenterX;
  let ry = y - view3dCenterY;
  let rz = z;
  
  let x1 = rx * cosY - rz * sinY;
  let z1 = rx * sinY + rz * cosY;
  let y1 = ry;
  
  let y2 = y1 * cosX - z1 * sinX;
  let z2 = y1 * sinX + z1 * cosX;
  
  const scale = view3dZoom * 0.5;
  const w = useFull ? view3dFullW : view3dW;
  const h = useFull ? view3dFullH : view3dH;
  
  return {
    x: w / 2 + x1 * scale,
    y: h / 2 - y2 * scale
  };
}

function draw3DProfile3D(useFull = false) {
  const cv = useFull
    ? document.getElementById('view3d-canvas-full')
    : document.getElementById('view3d-canvas');
  if (!cv || S.points.length < 2) return;
  const ctx = cv.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const isDark = S.isDark;
  const T = S.metal.thickness;
  const W = S.metal.width || 100;
  const hw = W / 2;
  
  const w = useFull ? view3dFullW : view3dW;
  const h = useFull ? view3dFullH : view3dH;
  
  // Вычисляем центр модели (среднее всех точек + учёт толщины)
  let sumX = 0, sumY = 0;
  S.points.forEach(p => { sumX += p.x; sumY += p.y; });
  view3dCenterX = sumX / S.points.length;
  view3dCenterY = sumY / S.points.length + T / 2;
  
  // Вычисляем бокс для автомасштаба
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  
  const finalPoints = [];
  for (let i = 0; i < S.points.length; i++) {
    const pt = S.points[i];
    const corners = [
      { x: pt.x, y: pt.y, z: -hw },
      { x: pt.x, y: pt.y, z: hw },
      { x: pt.x, y: pt.y + T, z: -hw },
      { x: pt.x, y: pt.y + T, z: hw }
    ];
    const corners3D = corners.map(c => project3D(c.x, c.y, c.z, useFull));
    corners3D.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });
    finalPoints.push(corners3D);
  }
  
  // Автомасштаб (только если пользователь не зумил вручную)
  if (!view3dUserZoomed && maxX - minX > 0 && maxY - minY > 0) {
    const pad = useFull ? 60 : 30;
    const autoScale = Math.min((w - pad * 2) / (maxX - minX), (h - pad * 2) / (maxY - minY), 3);
    view3dZoom = autoScale / 0.5;
  }
  
  // Пересчитываем точки с новым масштабом
  const pts = [];
  for (let i = 0; i < S.points.length; i++) {
    const pt = S.points[i];
    const corners = [
      { x: pt.x, y: pt.y, z: -hw },
      { x: pt.x, y: pt.y, z: hw },
      { x: pt.x, y: pt.y + T, z: -hw },
      { x: pt.x, y: pt.y + T, z: hw }
    ];
    pts.push(corners.map(c => project3D(c.x, c.y, c.z, useFull)));
  }
  
  // Рисуем сегменты
  for (let i = 0; i < S.points.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    
    // Верхняя грань
    ctx.beginPath();
    ctx.moveTo(p0[2].x, p0[2].y);
    ctx.lineTo(p0[3].x, p0[3].y);
    ctx.lineTo(p1[3].x, p1[3].y);
    ctx.lineTo(p1[2].x, p1[2].y);
    ctx.closePath();
    ctx.fillStyle = isDark ? '#4ade80' : '#22c55e';
    ctx.fill();
    ctx.strokeStyle = isDark ? '#86efac' : '#16a34a';
    ctx.lineWidth = useFull ? 1 : 0.5;
    ctx.stroke();
    
    // Передняя грань
    ctx.beginPath();
    ctx.moveTo(p0[1].x, p0[1].y);
    ctx.lineTo(p0[3].x, p0[3].y);
    ctx.lineTo(p1[3].x, p1[3].y);
    ctx.lineTo(p1[1].x, p1[1].y);
    ctx.closePath();
    ctx.fillStyle = isDark ? '#22c55e' : '#16a34a';
    ctx.fill();
    ctx.strokeStyle = isDark ? '#86efac' : '#16a34a';
    ctx.lineWidth = useFull ? 1 : 0.5;
    ctx.stroke();
    
    // Задняя грань
    ctx.beginPath();
    ctx.moveTo(p0[0].x, p0[0].y);
    ctx.lineTo(p0[2].x, p0[2].y);
    ctx.lineTo(p1[2].x, p1[2].y);
    ctx.lineTo(p1[0].x, p1[0].y);
    ctx.closePath();
    ctx.fillStyle = isDark ? '#15803d' : '#15803d';
    ctx.fill();
    ctx.strokeStyle = isDark ? '#4ade80' : '#16a34a';
    ctx.lineWidth = useFull ? 1 : 0.5;
    ctx.stroke();
    
    // Линии гибов
    if (i > 0 && i < S.points.length - 2) {
      if (isBendAtPoint(i)) {
        ctx.beginPath();
        ctx.moveTo(p0[2].x, p0[2].y);
        ctx.lineTo(p0[3].x, p0[3].y);
        ctx.strokeStyle = isDark ? '#fbbf24' : '#f59e0b';
        ctx.lineWidth = useFull ? 2 : 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        const midX = (p0[2].x + p0[3].x) / 2;
        const midY = (p0[2].y + p0[3].y) / 2 - (useFull ? 8 : 5);
        ctx.fillStyle = isDark ? '#fbbf24' : '#f59e0b';
        ctx.font = (useFull ? 'bold 10px' : 'bold 8px') + ' sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((i + 1), midX, midY);
      }
    }
  }

  // Hem 3D hooks — visual "hook" geometry
  drawHemHooks3D(ctx, pts, useFull, isDark);
}

// ==================== HEM HOOK 3D ====================
function drawHemHooks3D(ctx, pts, useFull, isDark) {
  if (!S.hems || S.hems.length === 0) return;
  if (S.points.length < 2) return;

  const T = S.metal.thickness;
  const W = S.metal.width || 100;
  const hw = W / 2;
  const lw = useFull ? 1 : 0.5;

  S.hems.forEach(hem => {
    const si = hem.segIndex;
    const numSegs = S.points.length - 1;
    if (si < 0 || si > numSegs) return;

    let pt, neighbor, isLeft;
    if (si >= numSegs - 1) {
      pt = S.points[S.points.length - 1];
      neighbor = S.points[S.points.length - 2];
    } else {
      pt = S.points[si];
      neighbor = S.points[si + 1];
    }
    isLeft = hem.side !== 'right';

    const segAngle = Math.atan2(neighbor.y - pt.y, neighbor.x - pt.x);
    // Перпендикуляр вниз (внутрь материала)
    const perpAngle = isLeft ? (segAngle - Math.PI / 2) : (segAngle + Math.PI / 2);
    const br = S.metal.bendRadius;
    const hemHeight = hem.height;

    // L-образная геометрия: перпендикуляр вниз, параллельно вперёд
    const h1 = { x: pt.x + Math.cos(perpAngle) * br, y: pt.y + Math.sin(perpAngle) * br };
    const h2 = { x: h1.x + Math.cos(segAngle) * hemHeight, y: h1.y + Math.sin(segAngle) * hemHeight };

    const hemPts3D = [pt, h1, h2].map(p => [
      project3D(p.x, p.y, -hw, useFull),
      project3D(p.x, p.y, hw, useFull),
      project3D(p.x, p.y + T, -hw, useFull),
      project3D(p.x, p.y + T, hw, useFull)
    ]);

    const col = isLeft ? '#3b82f6' : '#8b5cf6';
    const colLight = isLeft ? (isDark ? '#2563eb' : '#60a5fa') : (isDark ? '#7c3aed' : '#a78bfa');

    for (let i = 0; i < hemPts3D.length - 1; i++) {
      const c = hemPts3D[i], n = hemPts3D[i + 1];
      ctx.beginPath();
      ctx.moveTo(c[1].x, c[1].y); ctx.lineTo(c[3].x, c[3].y);
      ctx.lineTo(n[3].x, n[3].y); ctx.lineTo(n[1].x, n[1].y);
      ctx.closePath();
      ctx.fillStyle = colLight; ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(c[2].x, c[2].y); ctx.lineTo(c[3].x, c[3].y);
      ctx.lineTo(n[3].x, n[3].y); ctx.lineTo(n[2].x, n[2].y);
      ctx.closePath();
      ctx.fillStyle = col; ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(c[0].x, c[0].y); ctx.lineTo(c[2].x, c[2].y);
      ctx.lineTo(n[2].x, n[2].y); ctx.lineTo(n[0].x, n[0].y);
      ctx.closePath();
      ctx.fillStyle = isDark ? '#1e40af' : '#93c5fd'; ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(c[0].x, c[0].y); ctx.lineTo(c[1].x, c[1].y);
      ctx.lineTo(n[1].x, n[1].y); ctx.lineTo(n[0].x, n[0].y);
      ctx.closePath();
      ctx.fillStyle = isDark ? '#1e3a8a' : '#bfdbfe'; ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke();
    }
  });
}


function draw3DPreview() {
  const cv = document.getElementById('view3d-canvas');
  if (!cv || S.points.length < 2) return;
  const ctx = cv.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  
  const isDark = S.isDark;
  ctx.fillStyle = isDark ? '#1a1a2e' : '#f5f5f5';
  ctx.fillRect(0, 0, view3dW, view3dH);
  
  draw3DProfile3D(false);
  
  // Контролы
  const ctrl = document.getElementById('view3d-controls');
  if (ctrl) {
    ctrl.textContent = t('dragToRotate');
  }
}

function isBendAtPoint(idx) {
  if (idx < 1 || idx >= S.points.length - 1) return false;
  const prev = S.points[idx - 1], curr = S.points[idx], next = S.points[idx + 1];
  const aIn = Math.atan2(curr.y - prev.y, curr.x - prev.x);
  const aOut = Math.atan2(next.y - curr.y, next.x - curr.x);
  let def = aOut - aIn;
  while (def > Math.PI) def -= 2 * Math.PI;
  while (def <= -Math.PI) def += 2 * Math.PI;
  const ba = Math.abs(def);
  return ba >= 5 * Math.PI / 180 && ba <= Math.PI - 5 * Math.PI / 180;
}

// ==================== 3D CANVAS EVENTS ====================
(function() {
  const cv = document.getElementById('view3d-canvas');
  if (!cv) return;

  // Prevent sidebar scroll when hovering over 3D view
  const cont3d = document.getElementById('view3d-container');
  if (cont3d && rightSidebarEl) {
    cont3d.addEventListener('mouseenter', () => { rightSidebarEl.style.overflowY = 'hidden'; });
    cont3d.addEventListener('mouseleave', () => { rightSidebarEl.style.overflowY = 'auto'; });
  }
  cv.addEventListener('mousedown', e => {
    e.preventDefault();
    isDragging3D = true;
    drag3dStart = { x: e.clientX, y: e.clientY };
    cv.style.cursor = 'grabbing';
  });
  
  cv.addEventListener('mousemove', e => {
    if (!isDragging3D) return;
    const dx = e.clientX - drag3dStart.x;
    const dy = e.clientY - drag3dStart.y;
    view3dRotY += dx * 0.01;
    view3dRotX += dy * 0.01;
    view3dRotX = Math.max(-1.2, Math.min(1.2, view3dRotX));
    drag3dStart = { x: e.clientX, y: e.clientY };
    draw3DPreview();
  });
  
  cv.addEventListener('mouseup', () => {
    isDragging3D = false;
    cv.style.cursor = 'grab';
  });
  
  cv.addEventListener('mouseleave', () => {
    isDragging3D = false;
    cv.style.cursor = 'grab';
  });
  
  cv.addEventListener('wheel', e => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    view3dZoom = Math.max(0.3, Math.min(5, view3dZoom * factor));
    view3dUserZoomed = true;
    draw3DPreview();
  }, { passive: false });
  
  cv.style.cursor = 'grab';
})();

// ==================== CANVAS EVENTS ====================
function findNearPoint(cx, cy) {
  for (let i = 0; i < S.points.length; i++) {
    const p = w2c(S.points[i].x, S.points[i].y);
    const d = Math.sqrt((p.cx - cx) ** 2 + (p.cy - cy) ** 2);
    if (d < 12) return i;
  }
  return null;
}

function isNearFirst(cx, cy) {
  if (S.points.length < 3) return false;
  const f = w2c(S.points[0].x, S.points[0].y);
  return Math.sqrt((f.cx - cx) ** 2 + (f.cy - cy) ** 2) < 15;
}

// Проверка клика по точке сгибания (когда активен предпросмотр)
function isNearBendPoint(cx, cy) {
  if (S.previewBendIdx === null) return false;
  const bp = w2c(S.bendPointX || 0, S.bendPointY || 0);
  return Math.sqrt((bp.cx - cx) ** 2 + (bp.cy - cy) ** 2) < 14;
}

// Проверка клика по пуансону (когда инструменты показаны на канвас)
function isNearPunch(cx, cy) {
  if (!S.showToolsOnCanvas) return false;
  const punch = (typeof getPunchByIndex === 'function') ? getPunchByIndex(S.metal.punchIndex) : null;
  if (!punch) return false;
  const pOX = S.punchOffsetX || 0;
  const pH = punch.height || 50;
  const pS = punch.swidth || 20;
  const tip = w2c(pOX, 0);
  const top = w2c(pOX, pH);
  const halfW = (pS / 2) * S.viewport.scale;
  // Прямоугольник: от вершины (Y=0) до верха (Y=pH), ширина = pS
  const minX = tip.cx - halfW, maxX = tip.cx + halfW;
  const minY = Math.min(tip.cy, top.cy), maxY = Math.max(tip.cy, top.cy);
  return cx >= minX - 8 && cx <= maxX + 8 && cy >= minY - 8 && cy <= maxY + 8;
}

/**
 * Найти hit area по координатам мыши
 */
function findHitArea(cx, cy) {
  if (!S._hitAreas) return null;
  for (let i = S._hitAreas.length - 1; i >= 0; i--) {
    const a = S._hitAreas[i];
    if (cx >= a.x && cx <= a.x + a.w && cy >= a.y && cy <= a.y + a.h) {
      return a;
    }
  }
  return null;
}

drawCanvas.addEventListener('mousedown', e => {
  const r = drawCanvas.getBoundingClientRect();
  const cx = e.clientX - r.left, cy = e.clientY - r.top;

  if (e.button === 1 || (e.button === 0 && e.altKey)) {
    isPanning = true;
    panStart = { x: e.clientX, y: e.clientY, ox: S.viewport.offsetX, oy: S.viewport.offsetY };
    drawCanvas.style.cursor = 'grabbing';
    return;
  }

  if (e.button === 0 && S.toolMode === 'draw') {
    const w = c2w(cx, cy);
    let p = S.snapToGrid ? snapPoint(w) : w;
    if (S.points.length > 0) {
      // Проверяем клик по существующей точке
      let hitIdx = -1;
      for (let i = 0; i < S.points.length; i++) {
        const pp = w2c(S.points[i].x, S.points[i].y);
        if (Math.sqrt((pp.cx - cx) ** 2 + (pp.cy - cy) ** 2) < 12) {
          hitIdx = i;
          break;
        }
      }
      const lastIdx = S.points.length - 1;
      if (hitIdx === 0) {
        // Клик по первой точке → начинаем рисовать от неё (добавление в начало)
        S.drawFromIdx = 0;
        renderAll();
        return;
      } else if (hitIdx === lastIdx && lastIdx > 0) {
        // Клик по последней точке → рисуем от конца контура
        S.drawFromIdx = null;
        renderAll();
        return;
      } else if (hitIdx >= 0) {
        // Внутренняя точка — рисовать от неё нельзя
        renderAll();
        return;
      }
    }
    // Клик по пустому месту — добавляем точку
    addPoint(p);
    renderAll();
  } else if (e.button === 0 && S.toolMode === 'select') {
    // ══ Режим симуляции: клик по маркеру гиба сгибает/разгибает ══
    if (S.simMode && S.unfoldResult) {
      const sim = computeSimPoints();
      if (sim && sim.bendMarkers.length) {
        let best = null, bestDist = Infinity;
        for (const m of sim.bendMarkers) {
          const pc = w2c(m.x, m.y);
          const d = Math.sqrt((pc.cx - cx) ** 2 + (pc.cy - cy) ** 2);
          if (d < 14 && d < bestDist) { bestDist = d; best = m; }
        }
        if (best) {
          const i = S.simBends.indexOf(best.index);
          if (i >= 0) S.simBends.splice(i, 1);
          else S.simBends.push(best.index);
          drawDrawCanvas();
          return;
        }
      }
      // Клик мимо — ничего не делаем в симуляции
      drawDrawCanvas();
      return;
    }
    // Проверяем клик по точке сгибания (перетаскивание)
    if (isNearBendPoint(cx, cy)) {
      dragBendPoint = true;
      drawCanvas.style.cursor = 'grabbing';
      return;
    }
    // Проверяем клик по пуансону (перетаскивание)
    if (isNearPunch(cx, cy)) {
      dragPunch = true;
      drawCanvas.style.cursor = 'grabbing';
      return;
    }
    // Проверяем клик по вершине гиба (предпросмотр согнутой детали)
    if (S.showToolsOnCanvas && S.unfoldResult && S.unfoldResult.bendInfos) {
      const idx = findNearPoint(cx, cy);
      if (idx !== null) {
        const bendIdx = S.unfoldResult.bendInfos.findIndex(b => b.vertexIndex === idx);
        if (bendIdx >= 0) {
          // Клик на тот же гиб — переключаем направление (flip)
          if (S.previewBendIdx === bendIdx) {
            S.previewFlip = !S.previewFlip;
          } else {
            S.previewBendIdx = bendIdx;
            S.previewFlip = false;
            // Точка сгибания — на кончике пуансона
            S.bendPointX = S.punchOffsetX || 0;
            S.bendPointY = S.punchOffsetY || 0;
          }
          drawDrawCanvas();
          return;
        }
        // Клик по обычной точке — сброс предпросмотра
        if (S.previewBendIdx !== null) {
          S.previewBendIdx = null;
          drawDrawCanvas();
        }
      } else {
        // Клик мимо контура — сброс предпросмотра
        if (S.previewBendIdx !== null) {
          S.previewBendIdx = null;
          drawDrawCanvas();
        }
      }
    }
    // Проверяем клик по hit areas (только сегменты — для редактирования длины)
    const hit = findHitArea(cx, cy);
    if (hit && hit.type === 'segment') {
      editSegment(hit.index);
      renderAll();
    } else {
      // Перетаскиваем точку
      const idx = findNearPoint(cx, cy);
      if (idx !== null) {
        S.undoHistory = [...S.undoHistory, cloneState()];
        if (S.undoHistory.length > 50) S.undoHistory.shift();
        S.redoHistory = [];
        dragPtIdx = idx;
      }
    }
  } else if (e.button === 0 && S.toolMode === 'erase') {
    const idx = findNearPoint(cx, cy);
    if (idx !== null) { removePoint(idx); renderAll(); }
  } else if (e.button === 0 && S.toolMode === 'measure') {
    if (measureStep === 0) { measureStart = c2w(cx, cy); measureEnd = null; measureStep = 1; }
    else { measureEnd = c2w(cx, cy); measureStep = 2; }
    drawDrawCanvas();
  } else if (e.button === 0 && S.toolMode === 'hem') {
    const segIdx = findNearSegment(cx, cy, 15);
    if (segIdx >= 0) {
      showHemDialog(segIdx);
    }
  }
});

// Замыкание контура двойным кликом по первой точке
drawCanvas.addEventListener('dblclick', e => {
  if (S.toolMode !== 'draw' || S.points.length < 3) return;
  const r = drawCanvas.getBoundingClientRect();
  const cx = e.clientX - r.left, cy = e.clientY - r.top;
  const p0 = w2c(S.points[0].x, S.points[0].y);
  if (Math.sqrt((p0.cx - cx) ** 2 + (p0.cy - cy) ** 2) < 18) {
    e.preventDefault();
    closeContour();
    renderAll();
  }
});

drawCanvas.addEventListener('mousemove', e => {
  const r = drawCanvas.getBoundingClientRect();
  const cx = e.clientX - r.left, cy = e.clientY - r.top;
  S.mouseWorld = c2w(cx, cy);

  if (isPanning && panStart) {
    S.viewport.offsetX = panStart.ox + (e.clientX - panStart.x);
    S.viewport.offsetY = panStart.oy + (e.clientY - panStart.y);
    drawDrawCanvas();
    return;
  }

  if (dragPtIdx !== null) {
    const w = c2w(cx, cy);
    const p = S.snapToGrid ? snapPoint(w) : w;
    S.points = S.points.map((pt, i) => i === dragPtIdx ? { ...p } : pt);
    maybeAutoUnfold();
    drawDrawCanvas();
    renderUnfoldInfo();
    return;
  }

  if (dragPunch) {
    const w = c2w(cx, cy);
    const p = S.snapToGrid ? snapPoint(w) : w;
    S.punchOffsetX = p.x;
    S.punchOffsetY = p.y;
    drawDrawCanvas();
    return;
  }

  if (dragBendPoint) {
    const w = c2w(cx, cy);
    const p = S.snapToGrid ? snapPoint(w) : w;
    S.bendPointX = p.x;
    S.bendPointY = p.y;
    drawDrawCanvas();
    return;
  }

  // Check snap endpoint
  S.snapEndpoint = -1;
  if (S.toolMode === 'draw' && S.points.length > 0) {
    for (let i = 0; i < S.points.length; i++) {
      const pp = w2c(S.points[i].x, S.points[i].y);
      if (Math.sqrt((pp.cx - cx) ** 2 + (pp.cy - cy) ** 2) < 12) {
        S.snapEndpoint = i;
        break;
      }
    }
  }

  S.hoveredPt = findNearPoint(cx, cy);

  // Hem tool: track hovered segment
  S.hemHoveredSeg = -1;
  if (S.toolMode === 'hem') {
    S.hemHoveredSeg = findNearSegment(cx, cy, 15);
  }

  // Cursor
  if (S.toolMode === 'draw') drawCanvas.style.cursor = 'crosshair';
  else if (S.toolMode === 'select') drawCanvas.style.cursor = (S.hoveredPt !== null || isNearPunch(cx, cy) || isNearBendPoint(cx, cy)) ? 'grab' : 'default';
  else if (S.toolMode === 'erase') drawCanvas.style.cursor = S.hoveredPt !== null ? 'pointer' : 'default';
  else if (S.toolMode === 'measure') drawCanvas.style.cursor = 'crosshair';
  else if (S.toolMode === 'hem') drawCanvas.style.cursor = S.hemHoveredSeg >= 0 ? 'pointer' : 'default';

  drawDrawCanvas();
});

drawCanvas.addEventListener('mouseup', e => {
  if (isPanning) {
    isPanning = false;
    panStart = null;
    drawCanvas.style.cursor = S.toolMode === 'draw' ? 'crosshair' : 'default';
  }
  if (dragPtIdx !== null) {
    dragPtIdx = null;
    renderAll();
  }
  if (dragPunch) {
    dragPunch = false;
    drawCanvas.style.cursor = 'default';
    drawDrawCanvas();
  }
  if (dragBendPoint) {
    dragBendPoint = false;
    drawCanvas.style.cursor = 'default';
    drawDrawCanvas();
  }
});

drawCanvas.addEventListener('mouseleave', () => {
  S.mouseWorld = null;
  isPanning = false;
  panStart = null;
  dragPunch = false;
  dragBendPoint = false;
  S.hoveredPt = -1;
  S.snapEndpoint = -1;
  S.hemHoveredSeg = -1;
  drawDrawCanvas();
});

drawCanvas.addEventListener('wheel', e => {
  e.preventDefault();
  const r = drawCanvas.getBoundingClientRect();
  const cx = e.clientX - r.left, cy = e.clientY - r.top;
  const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
  const ns = Math.max(.1, Math.min(50, S.viewport.scale * factor));
  const wx = (cx - S.viewport.offsetX) / S.viewport.scale;
  const wy = -(cy - S.viewport.offsetY) / S.viewport.scale;
  S.viewport.offsetX = cx - wx * ns;
  S.viewport.offsetY = cy + wy * ns;
  S.viewport.scale = ns;
  drawDrawCanvas();
}, { passive: false });

drawCanvas.addEventListener('contextmenu', e => {
  e.preventDefault();
  const r = drawCanvas.getBoundingClientRect();
  const cx = e.clientX - r.left, cy = e.clientY - r.top;
  const w = c2w(cx, cy);
  const cm = document.getElementById('context-menu');
  cm.innerHTML = '';
  cm.classList.remove('hidden');
  cm.style.left = e.clientX + 'px';
  cm.style.top = e.clientY + 'px';
  const addBtn = (label, fn) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.onclick = () => { fn(); cm.classList.add('hidden'); };
    cm.appendChild(b);
  };
  // Проверяем, есть ли кайма на ближайшем сегменте
  const nearSeg = findNearSegment(cx, cy, 20);
  if (nearSeg >= 0 && S.hems.find(h => h.segIndex === nearSeg)) {
    addBtn(t('hemContextMenu'), () => {
      removeHem(nearSeg);
    });
  }
  addBtn(t('addPoint'), () => {
    const p = S.snapToGrid ? snapPoint(w) : w;
    addPoint(p);
    renderAll();
  });
  addBtn(t('centerView'), () => {
    S.viewport = { offsetX: canvasW / 2, offsetY: canvasH / 2, scale: 3 };
    drawDrawCanvas();
  });
  addBtn(t('copyCoords'), () => {
    const sn = S.snapToGrid ? snapPoint(w) : w;
    navigator.clipboard.writeText(sn.x.toFixed(1) + ', ' + sn.y.toFixed(1));
  });
});

document.addEventListener('click', e => {
  if (!e.target.closest('.context-menu')) {
    document.getElementById('context-menu').classList.add('hidden');
  }
});

// Unfold canvas zoom + pan
// Prevent sidebar scroll when hovering over unfold area
if (unfoldContEl && rightSidebarEl) {
  unfoldContEl.addEventListener('mouseenter', () => { rightSidebarEl.style.overflowY = 'hidden'; });
  unfoldContEl.addEventListener('mouseleave', () => { rightSidebarEl.style.overflowY = 'auto'; });
}

// --- Unfold pan state ---
let ufPanning = false;
let ufPanStart = null;

function ufGetAutoScale() {
  if (!S.unfoldResult) return { sc: 1, ox: 0, oy: 0 };
  const pad = 60;
  const sc = Math.min((ufW - pad * 2) / S.unfoldResult.totalLength, (ufH - pad * 2) / S.unfoldResult.width, 5);
  const ox = (ufW - S.unfoldResult.totalLength * sc) / 2;
  const oy = (ufH - S.unfoldResult.width * sc) / 2;
  return { sc, ox, oy };
}

function ufGetCurrentView() {
  if (ufManualZoom && ufManualZoom.scale > 0) {
    return { sc: ufManualZoom.scale, ox: ufManualZoom.ox, oy: ufManualZoom.oy };
  }
  return ufGetAutoScale();
}

unfoldCanvas.addEventListener('wheel', e => {
  e.preventDefault();
  e.stopPropagation();
  if (!S.unfoldResult) return;
  const r = unfoldCanvas.getBoundingClientRect();
  const cx = e.clientX - r.left, cy = e.clientY - r.top;
  const view = ufGetCurrentView();
  const curSc = view.sc, curOx = view.ox, curOy = view.oy;
  const f = e.deltaY < 0 ? 1.15 : 1 / 1.15;
  const ns = Math.max(.3, Math.min(15, curSc * f));
  const wx = (cx - curOx) / curSc, wy = (cy - curOy) / curSc;
  ufManualZoom = { scale: ns, ox: cx - wx * ns, oy: cy - wy * ns };
  drawUnfoldCanvas();
}, { passive: false });

unfoldCanvas.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  if (!S.unfoldResult) return;
  e.preventDefault();
  ufPanning = true;
  ufPanStart = { x: e.clientX, y: e.clientY };
  // Ensure we have a manual zoom to pan
  if (!ufManualZoom || ufManualZoom.scale <= 0) {
    const v = ufGetAutoScale();
    ufManualZoom = { scale: v.sc, ox: v.ox, oy: v.oy };
  }
  ufPanStart.ox = ufManualZoom.ox;
  ufPanStart.oy = ufManualZoom.oy;
  unfoldCanvas.style.cursor = 'grabbing';
});

unfoldCanvas.addEventListener('mousemove', e => {
  if (!ufPanning || !ufPanStart) return;
  const dx = e.clientX - ufPanStart.x;
  const dy = e.clientY - ufPanStart.y;
  ufManualZoom.ox = ufPanStart.ox + dx;
  ufManualZoom.oy = ufPanStart.oy + dy;
  drawUnfoldCanvas();
});

unfoldCanvas.addEventListener('mouseup', () => {
  ufPanning = false;
  ufPanStart = null;
  unfoldCanvas.style.cursor = 'grab';
});

unfoldCanvas.addEventListener('mouseleave', () => {
  ufPanning = false;
  ufPanStart = null;
  unfoldCanvas.style.cursor = 'default';
});

unfoldCanvas.style.cursor = 'grab';

// Double-click to reset zoom
unfoldCanvas.addEventListener('dblclick', () => {
  ufManualZoom = null;
  drawUnfoldCanvas();
});

// ==================== 3D MODAL EVENTS ====================
(function() {
  const cv = document.getElementById('view3d-canvas-full');
  if (!cv) return;
  
  cv.addEventListener('mousedown', e => {
    e.preventDefault();
    isDragging3DFull = true;
    drag3dStartFull = { x: e.clientX, y: e.clientY };
    cv.style.cursor = 'grabbing';
  });
  
  cv.addEventListener('mousemove', e => {
    if (!isDragging3DFull) return;
    const dx = e.clientX - drag3dStartFull.x;
    const dy = e.clientY - drag3dStartFull.y;
    view3dRotY += dx * 0.01;
    view3dRotX += dy * 0.01;
    view3dRotX = Math.max(-1.2, Math.min(1.2, view3dRotX));
    drag3dStartFull = { x: e.clientX, y: e.clientY };
    draw3DPreviewFull();
  });
  
  cv.addEventListener('mouseup', () => {
    isDragging3DFull = false;
    cv.style.cursor = 'grab';
  });
  
  cv.addEventListener('mouseleave', () => {
    isDragging3DFull = false;
    cv.style.cursor = 'grab';
  });
  
  cv.addEventListener('wheel', e => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    view3dZoom = Math.max(0.3, Math.min(5, view3dZoom * factor));
    view3dUserZoomed = true;
    draw3DPreviewFull();
    draw3DPreview();
  }, { passive: false });
  
  cv.style.cursor = 'grab';
  
  // Escape key to close modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && view3dModalOpen) {
      close3DModal();
    }
  });
  
  // Window resize handler for modal
  window.addEventListener('resize', () => {
    if (view3dModalOpen) {
      resizeView3dFull();
      draw3DPreviewFull();
    }
  });
})();
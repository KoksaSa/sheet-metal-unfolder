// ═══════════════════════════════════════════════════════════════
// CANVAS / VIEW3D — 3D-превью согнутой детали (миниатюра справа +
// полноэкранная модалка). Собственная проекция, вращение, зум,
// painter's algorithm с z-fighting-компаратором для тонкого металла
// ═══════════════════════════════════════════════════════════════

let view3dW = 300, view3dH = 256;
let view3dZoom = 1, view3dRotY = 0.5, view3dRotX = -0.5;
let view3dModalRotY = 0.5, view3dModalRotX = -0.5;
let view3dUserZoomed = false;
let isDragging3D = false, drag3dStart = null;
// Центр модели для центрирования 3D вида
let view3dCenterX = 0, view3dCenterY = 0;

// ==================== 3D MODAL ====================
let view3dModalOpen = false;
let view3dFullW = 800, view3dFullH = 600;
let isDragging3DFull = false, drag3dStartFull = null;

function toggle3DModal() {
  if (view3dModalOpen) {
    close3DModal();
  } else {
    open3DModal();
  }
}

function open3DModal() {
  const modal = document.getElementById('view3d-modal');
  if (!modal) return;
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
  if (!modal) return;
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

  // Вращение модалки (временно подменяем для project3D)
  const _savedRotY = view3dRotY, _savedRotX = view3dRotX;
  view3dRotY = view3dModalRotY;
  view3dRotX = view3dModalRotX;
  draw3DProfile3D(true);
  view3dRotY = _savedRotY;
  view3dRotX = _savedRotX;

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

// ==================== ПРОЕКЦИЯ ====================
// Возвращает {x, y, z}, где z — глубина после поворота
// (большая z = ближе к камере).
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
    y: h / 2 - y2 * scale,
    z: z2
  };
}

// ==================== ОТРИСОВКА 3D ПРОФИЛЯ ====================
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

  // Вычисляем центр модели (среднее всех точек + учёт толщины)
  let sumX = 0, sumY = 0;
  S.points.forEach(p => { sumX += p.x; sumY += p.y; });
  view3dCenterX = sumX / S.points.length;
  view3dCenterY = sumY / S.points.length + T / 2;

  // Вычисляем бокс для автомасштаба
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  const pts = [];
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
    pts.push(corners3D);
  }

  // Автомасштаб (только если пользователь не зумил вручную)
  if (!view3dUserZoomed && maxX - minX > 0 && maxY - minY > 0) {
    const pad = useFull ? 60 : 30;
    const autoScale = Math.min((w2dWidth(useFull) - pad * 2) / (maxX - minX), (h2dWidth(useFull) - pad * 2) / (maxY - minY), 3);
    view3dZoom = autoScale / 0.5;
  }

  // Re-project only if auto-scale changed the zoom
  if (!view3dUserZoomed && maxX - minX > 0 && maxY - minY > 0) {
    for (let i = 0; i < S.points.length; i++) {
      const pt = S.points[i];
      const corners = [
        { x: pt.x, y: pt.y, z: -hw },
        { x: pt.x, y: pt.y, z: hw },
        { x: pt.x, y: pt.y + T, z: -hw },
        { x: pt.x, y: pt.y + T, z: hw }
      ];
      pts[i] = corners.map(c => project3D(c.x, c.y, c.z, useFull));
    }
  }

  // Карта vertexIndex → bendNumber для нумерации гибов в 3D
  const bendNumMap3D = {};
  if (S.unfoldResult && S.unfoldResult.bendInfos) {
    S.unfoldResult.bendInfos.forEach((b, idx) => { bendNumMap3D[b.vertexIndex] = idx + 1; });
  }

  // Рисуем сегменты — собираем все грани, сортируем по глубине
  const faces = [];
  for (let i = 0; i < S.points.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];

    // Верхняя грань (indices 2,3 — верхняя кромка = ЛИЦЕВАЯ сторона)
    //   лицевая = синяя, обратная = серая, торцы = серая.
    const topPts = [p0[2], p0[3], p1[3], p1[2]];
    faces.push({
      pts: topPts,
      z: (topPts[0].z + topPts[1].z + topPts[2].z + topPts[3].z) / 4,
      fill: isDark ? '#3b82f6' : '#60a5fa',
      stroke: isDark ? '#60a5fa' : '#2563eb',
      isBend: i > 0 && isBendAtPoint(i),
      bendNum: bendNumMap3D[i] || (i + 1),
      isFace: true
    });
    // Нижняя грань (indices 0,1 — нижняя кромка = ОБРАТНАЯ сторона)
    const botPts = [p0[0], p1[0], p1[1], p0[1]];
    faces.push({
      pts: botPts,
      z: (botPts[0].z + botPts[1].z + botPts[2].z + botPts[3].z) / 4,
      fill: isDark ? '#4b5563' : '#6b7280',
      stroke: isDark ? '#6b7280' : '#374151',
      isBack: true
    });
    // Передняя грань (z=+hw, indices 1,3)
    faces.push({
      pts: [p0[1], p0[3], p1[3], p1[1]],
      z: (p0[1].z + p0[3].z + p1[3].z + p1[1].z) / 4,
      fill: isDark ? '#6b7280' : '#9ca3af',
      stroke: isDark ? '#9ca3af' : '#4b5563'
    });
    // Задняя грань (z=-hw, indices 0,2)
    faces.push({
      pts: [p0[0], p0[2], p1[2], p1[0]],
      z: (p0[0].z + p0[2].z + p1[2].z + p1[0].z) / 4,
      fill: isDark ? '#4b5563' : '#6b7280',
      stroke: isDark ? '#6b7280' : '#374151'
    });
  }
  // Торцевые крышки (левый и правый концы металла)
  if (pts.length >= 2) {
    const lf = pts[0];
    faces.push({
      pts: [lf[0], lf[1], lf[3], lf[2]],
      z: (lf[0].z + lf[1].z + lf[3].z + lf[2].z) / 4,
      fill: isDark ? '#6b7280' : '#9ca3af',
      stroke: isDark ? '#9ca3af' : '#4b5563'
    });
    const rf = pts[pts.length - 1];
    faces.push({
      pts: [rf[0], rf[2], rf[3], rf[1]],
      z: (rf[0].z + rf[2].z + rf[3].z + rf[1].z) / 4,
      fill: isDark ? '#4b5563' : '#6b7280',
      stroke: isDark ? '#6b7280' : '#374151'
    });
  }

  // Грани каймы — ДО сортировки (painter's algorithm)
  drawHemHooks3D(pts, useFull, isDark, faces);

  // Сортируем по глубине: ВОЗРАСТАНИЕ z2 (меньшая z2 = дальше —
  // рисуется первой). Спец-обработка z-fighting между лицевой
  // (isFace) и обратной (isBack) гранями тонкого металла:
  // rotX > 0 (вид сверху) → лицо поверх; rotX < 0 (вид снизу) → изнанка.
  const _rotX = view3dRotX;
  faces.sort((a, b) => {
    const aAvgZ = (a.pts[0].z + a.pts[1].z + a.pts[2].z + a.pts[3].z) / a.pts.length;
    const bAvgZ = (b.pts[0].z + b.pts[1].z + b.pts[2].z + b.pts[3].z) / b.pts.length;
    const dz = Math.abs(aAvgZ - bAvgZ);
    if (dz < 4 && ((a.isFace && b.isBack) || (a.isBack && b.isFace))) {
      if (_rotX > 0) {
        return a.isFace ? 1 : (a.isBack ? -1 : 0);
      } else {
        return a.isBack ? 1 : (a.isFace ? -1 : 0);
      }
    }
    return aAvgZ - bAvgZ;
  });

  // Рисуем грани в порядке глубины
  faces.forEach(f => {
    ctx.beginPath();
    ctx.moveTo(f.pts[0].x, f.pts[0].y);
    for (let k = 1; k < f.pts.length; k++) ctx.lineTo(f.pts[k].x, f.pts[k].y);
    ctx.closePath();
    ctx.fillStyle = f.fill;
    ctx.fill();
    ctx.strokeStyle = f.stroke;
    ctx.lineWidth = useFull ? 1 : 0.5;
    ctx.stroke();

    // Линии гибов на верхней грани
    if (f.isBend) {
      const a = f.pts[0], b = f.pts[1];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = isDark ? '#fbbf24' : '#f59e0b';
      ctx.lineWidth = useFull ? 2 : 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2 - (useFull ? 8 : 5);
      ctx.fillStyle = isDark ? '#fbbf24' : '#f59e0b';
      ctx.font = (useFull ? 'bold 10px' : 'bold 8px') + ' sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(f.bendNum), midX, midY);
    }
  });
}

// Вспомогательные размеры канваса для автомасштаба
function w2dWidth(useFull) { return useFull ? view3dFullW : view3dW; }
function h2dWidth(useFull) { return useFull ? view3dFullH : view3dH; }

// ==================== HEM HOOKS 3D ====================
// Добавляет грани каймы в массив faces (для z-сортировки вместе
// с основными гранями детали).
function drawHemHooks3D(pts, useFull, isDark, faces) {
  if (!S.hems || S.hems.length === 0) return;
  if (S.points.length < 2) return;
  if (!faces) return;

  const T = S.metal.thickness;
  const W = S.metal.width || 100;
  const hw = W / 2;

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
    const perpAngle = isLeft ? (segAngle - Math.PI / 2) : (segAngle + Math.PI / 2);
    const br = S.metal.bendRadius;
    const hemHeight = hem.height;

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
      faces.push({
        pts: [c[1], c[3], n[3], n[1]],
        z: (c[1].z + c[3].z + n[3].z + n[1].z) / 4,
        fill: colLight, stroke: col
      });
      faces.push({
        pts: [c[2], c[3], n[3], n[2]],
        z: (c[2].z + c[3].z + n[3].z + n[2].z) / 4,
        fill: col, stroke: col
      });
      faces.push({
        pts: [c[0], c[2], n[2], n[0]],
        z: (c[0].z + c[2].z + n[2].z + n[0].z) / 4,
        fill: isDark ? '#1e40af' : '#93c5fd', stroke: col
      });
      faces.push({
        pts: [c[0], c[1], n[1], n[0]],
        z: (c[0].z + c[1].z + n[1].z + n[0].z) / 4,
        fill: isDark ? '#1e3a8a' : '#bfdbfe', stroke: col
      });
    }
  });
}

// ==================== 3D PREVIEW (миниатюра) ====================
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

  const ctrl = document.getElementById('view3d-controls');
  if (ctrl) {
    ctrl.textContent = t('dragToRotate');
  }
}

// Является ли точка с индексом idx вершиной гиба
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

// ==================== СОБЫТИЯ 3D PREVIEW (миниатюра) ====================
(function() {
  const cv = document.getElementById('view3d-canvas');
  if (!cv) return;

  // Не прокручивать сайдбар при наведении на 3D-вид
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

// ==================== СОБЫТИЯ 3D MODAL (полный экран) ====================
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
    view3dModalRotY += dx * 0.01;
    view3dModalRotX += dy * 0.01;
    view3dModalRotX = Math.max(-1.2, Math.min(1.2, view3dModalRotX));
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

  // === TOUCH SUPPORT (планшеты/телефоны) ===
  let touch3DStart = null, pinch3DStart = null;
  cv.addEventListener('touchstart', e => {
    e.preventDefault();
    if (e.touches.length === 1) {
      touch3DStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      touch3DStart = null;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinch3DStart = { dist: Math.hypot(dx, dy), zoom: view3dZoom };
    }
  }, { passive: false });
  cv.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length === 1 && touch3DStart) {
      const dx = e.touches[0].clientX - touch3DStart.x;
      const dy = e.touches[0].clientY - touch3DStart.y;
      view3dModalRotY += dx * 0.01;
      view3dModalRotX += dy * 0.01;
      view3dModalRotX = Math.max(-1.2, Math.min(1.2, view3dModalRotX));
      touch3DStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      draw3DPreviewFull();
    } else if (e.touches.length === 2 && pinch3DStart) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (pinch3DStart.dist > 0) {
        const f = dist / pinch3DStart.dist;
        view3dZoom = Math.max(0.3, Math.min(5, pinch3DStart.zoom * f));
        view3dUserZoomed = true;
        draw3DPreviewFull();
        draw3DPreview();
      }
    }
  }, { passive: false });
  cv.addEventListener('touchend', e => {
    if (e.touches.length === 0) { touch3DStart = null; pinch3DStart = null; }
    else if (e.touches.length === 1) { pinch3DStart = null; touch3DStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }
  }, { passive: false });

  cv.style.cursor = 'grab';

  // Escape закрывает модалку
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

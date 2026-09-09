// ═══════════════════════════════════════════════════════════════
// CANVAS / TOOLING-2D — матрица, пуансон, упор на 2D-холсте.
// Режим симуляции: пуансон ОПУСКАЕТСЯ в матрицу при гибке (air
// bending), металл деформируется (см. simulation/).
// ═══════════════════════════════════════════════════════════════

// Находит центр V-ручья матрицы по зазору на верхней грани DXF-профиля.
// FIX: guard на null-профиль (раньше возможен TypeError).
function findDieGrooveCenter(profile) {
  if (!profile || !profile.chains) {
    return ((profile && profile.minX) || 0) + ((profile && profile.width) || 0) / 2;
  }
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

/**
 * Анимация погружения пуансона (air bending):
 * вершина пуансона опускается от уровня покоя (SIM_PUNCH_LIFT над
 * листом) до внутренней поверхности листа по прогрессу гибки.
 * В покое (нет анимации) пуансон отведён вверх — как на реальном
 * станке после выполнения гиба.
 * v5.0: цель погружения — ВНУТРЕННЯЯ (вогнутая) ПОВЕРХНОСТЬ ДУГИ ГИБА
 * (радиус по таблице металла): пуансон заканчивает ход касанием дуги
 * изнутри V-складки, а не прокалывает её насквозь к линии гиба.
 * Возвращает Y-координату вершины пуансона (мировая система).
 */
function punchTipWorldY(animInfo) {
  const T = S.metal.thickness || 1;
  const restY = T / 2 + SIM_PUNCH_LIFT;
  if (!animInfo || !animInfo.animating) return restY;
  const p = Math.max(0, Math.min(1, animInfo.progress));
  const e = easeInOutCubic(p);
  // Цель — внутренняя поверхность дуги активного гиба (v5.0);
  // фолбэк (нет данных) — прежнее −T/2
  let target = -T / 2;
  if (typeof activeBendArcInnerY === 'function') {
    const iy = activeBendArcInnerY(animInfo.bendIdx, p);
    if (iy !== null && Number.isFinite(iy)) target = iy;
  }
  return restY * (1 - e) + target * e;
}

// ═══════════════════════════════════════════════════════════════
// ОТРИСОВКА МАТРИЦЫ И ПУАНСОНА (2D, под профилем в режиме симуляции)
// Матрица: статичная, снизу (Y-), V-ручей направлен вниз от (0,0).
// Пуансон: сверху (Y+), опускается в матрицу при гибке.
// ═══════════════════════════════════════════════════════════════
function drawPressBrakeTooling(isDark, animInfo) {
  const die = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
  const punch = (typeof getPunchByIndex === 'function') ? getPunchByIndex(S.metal.punchIndex) : null;
  if (!die && !punch) return; // нет инструментов — не рисуем

  const dOX = S.dieOffsetX || 0;
  const dOY = S.dieOffsetY || 0;
  const pOX = S.punchOffsetX || 0;
  const pOY = S.punchOffsetY || 0;
  // Анимированное положение вершины пуансона (погружение в матрицу)
  const tipY = punchTipWorldY(animInfo);

  // === МАТРИЦА (статичная, снизу) ===
  if (die) {
    drawCtx.strokeStyle = isDark ? '#3b82f6aa' : '#3b82f6cc';
    drawCtx.fillStyle = isDark ? '#3b82f618' : '#3b82f615';
    drawCtx.lineWidth = 1.5;
    if (die.profile && die.profile.chains) {
      const vCenter = findDieGrooveCenter(die.profile);
      const offX = -vCenter + dOX;
      const offY = -(die.profile.minY + die.profile.height) + dOY;
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
      const vW = die.vWidth || 10;
      const dH = die.height || 40;
      const halfV = vW / 2;
      const sw = die.swidth || vW * 2;
      const halfS = sw / 2;
      const vDepth = dH * 0.5;
      const p = (x, y) => w2c(x + dOX, y + dOY);
      drawCtx.beginPath();
      let q = p(-halfS, 0); drawCtx.moveTo(q.cx, q.cy);
      q = p(-halfV, 0); drawCtx.lineTo(q.cx, q.cy);
      q = p(0, -vDepth); drawCtx.lineTo(q.cx, q.cy);
      q = p(halfV, 0); drawCtx.lineTo(q.cx, q.cy);
      q = p(halfS, 0); drawCtx.lineTo(q.cx, q.cy);
      q = p(halfS, -dH); drawCtx.lineTo(q.cx, q.cy);
      q = p(-halfS, -dH); drawCtx.lineTo(q.cx, q.cy);
      drawCtx.closePath();
      drawCtx.fill();
      drawCtx.stroke();
    }
    // Подпись матрицы
    const dH = die.height || 40;
    const dl = w2c(dOX, -dH + dOY);
    drawCtx.fillStyle = isDark ? '#6085f0' : '#2563eb';
    drawCtx.font = '9px sans-serif';
    drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'bottom';
    drawCtx.fillText((S.lang === 'en' ? die.nameEn : die.nameRu) || 'Die', dl.cx, dl.cy - 3);
  } // end if (die)

  // === ПУАНСОН (сверху, Y+), опускается при анимации ===
  if (punch) {
    drawCtx.strokeStyle = isDark ? '#ef4444aa' : '#ef4444cc';
    drawCtx.fillStyle = isDark ? '#ef444418' : '#ef444415';
    drawCtx.lineWidth = 1.5;

    if (punch.profile && punch.profile.chains) {
      // Пуансон с реальным профилем (стандартный или DXF) + анимация погружения.
      // v5.4: ось гиба — через ВЕРШИНУ профиля (tipX), а не центр bbox —
      // корректно для несимметричных (гусиная шея, Z-ступенчатый).
      const offX = -punchProfileAxisX(punch.profile) + pOX;
      const offY = -punch.profile.minY + pOY + tipY;
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
      const p = (x, y) => w2c(x + pOX, y + pOY + tipY);
      drawCtx.beginPath();
      let q = p(0, 0);
      drawCtx.moveTo(q.cx, q.cy);
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
    const pl = w2c(pOX, pH + pOY + tipY);
    drawCtx.fillStyle = isDark ? '#f06060' : '#dc2626';
    drawCtx.font = '9px sans-serif';
    drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'top';
    drawCtx.fillText((S.lang === 'en' ? punch.nameEn : punch.nameRu) || 'Punch', pl.cx, pl.cy + 3);
  } // end if (punch)

  // === Осевая линия ручья (пунктир) ===
  drawCtx.strokeStyle = isDark ? '#88888888' : '#88888866';
  drawCtx.lineWidth = 1;
  drawCtx.setLineDash([4, 3]);
  drawCtx.beginPath();
  const o = w2c(0, 0);
  const pH2 = punch ? (punch.height || 50) : 50;
  const dH2 = die ? (die.height || 40) : 40;
  drawCtx.moveTo(o.cx, o.cy - pH2 * S.viewport.scale);
  drawCtx.lineTo(o.cx, o.cy + dH2 * S.viewport.scale);
  drawCtx.stroke();
  drawCtx.setLineDash([]);

  // v5.5: подсветка активного инструмента (режим установки)
  if (typeof drawActiveToolHighlight === 'function') drawActiveToolHighlight(isDark);
}

// ═══════════════════════════════════════════════════════════════
// ИНСТРУМЕНТЫ В РЕЖИМЕ УСТАНОВКИ (1:1, без симуляции)
// (0,0) = центр ручья матрицы (ось гиба). Верхняя грань матрицы —
// на оси X. Пуансон сверху (Y+), матрица снизу (Y-).
// ═══════════════════════════════════════════════════════════════
function drawToolsOnCanvas(isDark) {
  const die = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
  const punch = (typeof getPunchByIndex === 'function') ? getPunchByIndex(S.metal.punchIndex) : null;
  if (!die && !punch) return;

  // === Матрица ===
  if (die) {
    const dOX = S.dieOffsetX || 0;
    const dOY = S.dieOffsetY || 0;
    drawCtx.strokeStyle = isDark ? '#3b82f6aa' : '#3b82f6cc';
    drawCtx.fillStyle = isDark ? '#3b82f618' : '#3b82f615';
    drawCtx.lineWidth = 1.5;

    if (die.profile && die.profile.chains) {
      const vCenter = findDieGrooveCenter(die.profile);
      const offX = -vCenter + dOX;
      const offY = -(die.profile.minY + die.profile.height) + dOY;
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
      const vW = die.vWidth, dH = die.height;
      const halfV = vW / 2;
      const sw = die.swidth || vW * 2;
      const halfS = sw / 2;
      const depth = dH * 0.5;
      const p = (x, y) => w2c(x + dOX, y + dOY);
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
    const dl = w2c(dOX, -dH + dOY);
    drawCtx.fillStyle = isDark ? '#6085f0' : '#2563eb';
    drawCtx.font = '9px sans-serif';
    drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'bottom';
    drawCtx.fillText((S.lang === 'en' ? die.nameEn : die.nameRu) || 'Die', dl.cx, dl.cy - 3);
    // Индикатор смещения матрицы (скрыт в режиме симуляции)
    if (Math.abs(dOX) > 0.01 || Math.abs(dOY) > 0.01) {
      if (!S.showToolsOnCanvas) {
        const offPt = w2c(dOX, dOY);
        drawCtx.fillStyle = isDark ? '#6085f0' : '#2563eb';
        drawCtx.font = '9px sans-serif';
        drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'top';
        drawCtx.fillText('Δ ' + dOX.toFixed(1) + ', ' + dOY.toFixed(1) + ' mm', offPt.cx, offPt.cy + 12);
      }
    }
  } // end if (die)

  // === Пуансон ===
  if (punch) {
    const pOX = S.punchOffsetX || 0;
    const pOY = S.punchOffsetY || 0;
    drawCtx.strokeStyle = isDark ? '#ef4444aa' : '#ef4444cc';
    drawCtx.fillStyle = isDark ? '#ef444418' : '#ef444415';
    drawCtx.lineWidth = 1.5;

    if (punch.profile && punch.profile.chains) {
      // v5.4: ось гиба — через вершину профиля (tipX)
      const offX = -punchProfileAxisX(punch.profile) + pOX;
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
      const punchR = punch.radius || 1;
      const pS = punch.swidth || 20;
      const pH = punch.height || 50;
      const halfS = pS / 2;
      const pTopY = pH;
      const sc = S.viewport.scale;
      const p = (x, y) => w2c(x + pOX, y + pOY);
      drawCtx.beginPath();
      let q = p(0, 0);
      drawCtx.moveTo(q.cx, q.cy);
      const pL = p(-halfS, 0);
      const pR = p(halfS, 0);
      const angleL = Math.atan2(pL.cy - q.cy, pL.cx - q.cx);
      const angleR = Math.atan2(pR.cy - q.cy, pR.cx - q.cx);
      drawCtx.arc(q.cx, q.cy, punchR * sc, angleL, angleR, false);
      q = p(halfS, pTopY);
      drawCtx.lineTo(q.cx, q.cy);
      q = p(-halfS, pTopY);
      drawCtx.lineTo(q.cx, q.cy);
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
    const dH = die ? die.height : (pH * 0.6);
    drawCtx.strokeStyle = isDark ? '#88888888' : '#88888866';
    drawCtx.lineWidth = 1;
    drawCtx.setLineDash([4, 3]);
    drawCtx.beginPath();
    const o = w2c(0, 0);
    drawCtx.moveTo(o.cx, o.cy - pH * S.viewport.scale);
    drawCtx.lineTo(o.cx, o.cy + dH * S.viewport.scale);
    drawCtx.stroke();
    drawCtx.setLineDash([]);

    // Индикатор смещения пуансона (скрыт в режиме симуляции)
    if (Math.abs(pOX) > 0.01 || Math.abs(pOY) > 0.01) {
      if (!S.showToolsOnCanvas) {
        const offPt = w2c(pOX, pOY);
        drawCtx.fillStyle = isDark ? '#f06060' : '#dc2626';
        drawCtx.font = '9px sans-serif';
        drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'top';
        drawCtx.fillText('Δ ' + pOX.toFixed(1) + ', ' + pOY.toFixed(1) + ' mm', offPt.cx, offPt.cy + 12);
      }
    }
  } // end if (punch)

  // v5.5: подсветка активного инструмента (режим установки)
  if (typeof drawActiveToolHighlight === 'function') drawActiveToolHighlight(isDark);
}

// ═══════════════════════════════════════════════════════════════
// v5.5: МИРОВЫЕ BBOX ИНСТРУМЕНТОВ — ровно там, где они НАРИСОВАНЫ
// (учитывают offset'ы, подъём пуансона над листом и bbox профиля).
// Используются хит-тестом мыши (events.js) и подсветкой активного
// инструмента.
// FIX v5.5: раньше isNearPunch проверял зону у (pOX, 0..pH),
// игнорируя punchOffsetY и подъём tipY — пуансон, поднятый над
// листом (или сдвинутый ранее), нельзя было взять мышкой, в отличие
// от матрицы, чья зона следовала за offset'ами.
// ═══════════════════════════════════════════════════════════════
function punchWorldBBox() {
  const punch = (typeof getPunchByIndex === 'function') ? getPunchByIndex(S.metal.punchIndex) : null;
  if (!punch) return null;
  const pOX = S.punchOffsetX || 0;
  const pOY = S.punchOffsetY || 0;
  // С профилем заготовки пуансон рисуется ПОВЁРХ листа с подъёмом
  // покоя (drawPressBrakeTooling, tipY); без профиля — прямой
  // установка (drawToolsOnCanvas: вершина на pOY, без подъёма).
  const lifted = (S.unfoldResult && S.points.length >= 2) ? punchTipWorldY(null) : 0;
  if (punch.profile && punch.profile.chains) {
    const offX = -punchProfileAxisX(punch.profile) + pOX;
    const offY = -punch.profile.minY + pOY + lifted;
    return {
      minX: offX + punch.profile.minX, maxX: offX + punch.profile.maxX,
      minY: offY + punch.profile.minY, maxY: offY + punch.profile.maxY,
      tool: punch, kind: 'punch'
    };
  }
  const halfS = (punch.swidth || 20) / 2;
  const pH = punch.height || 50;
  return {
    minX: pOX - halfS, maxX: pOX + halfS,
    minY: pOY + lifted, maxY: pOY + lifted + pH,
    tool: punch, kind: 'punch'
  };
}

function dieWorldBBox() {
  const die = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
  if (!die) return null;
  const dOX = S.dieOffsetX || 0;
  const dOY = S.dieOffsetY || 0;
  if (die.profile && die.profile.chains) {
    const vCenter = findDieGrooveCenter(die.profile);
    const offX = -vCenter + dOX;
    const offY = -(die.profile.minY + die.profile.height) + dOY;
    return {
      minX: offX + die.profile.minX, maxX: offX + die.profile.maxX,
      minY: offY + die.profile.minY, maxY: offY + die.profile.maxY,
      tool: die, kind: 'die'
    };
  }
  const vW = die.vWidth || 10;
  const sw = die.swidth || vW * 2;
  const dH = die.height || 40;
  return {
    minX: dOX - sw / 2, maxX: dOX + sw / 2,
    minY: dOY - dH, maxY: dOY,
    tool: die, kind: 'die'
  };
}

// v5.5: сдвиг АКТИВНОГО инструмента — стрелки клавиатуры двигают
// тот, по которому кликнули/тянули последним (S.toolKeyTarget;
// по умолчанию пуансон). Вызывается из app.js (←→↑↓, Shift — ×5).
function moveActiveTool(dx, dy) {
  const target = (S.toolKeyTarget === 'die') ? 'die' : 'punch';
  if (target === 'die') {
    S.dieOffsetX = (S.dieOffsetX || 0) + dx;
    S.dieOffsetY = (S.dieOffsetY || 0) + dy;
  } else {
    S.punchOffsetX = (S.punchOffsetX || 0) + dx;
    S.punchOffsetY = (S.punchOffsetY || 0) + dy;
  }
  if (typeof saveToolPositions === 'function') saveToolPositions();
}

// v5.5: подсветка АКТИВНОГО инструмента в режиме установки —
// пунктирная рамка + метка стрелок. Показывает, кого будут двигать
// клавиши ←→↑↓ (Shift — шаг 5 мм). Рисуется поверх инструментов
// (в обоих режимах отрисовки), только когда инструменты НЕ заблокированы.
function drawActiveToolHighlight(isDark) {
  if (!S.showToolsOnCanvas || S.toolLocked) return;
  const bb = (S.toolKeyTarget === 'die') ? dieWorldBBox() : punchWorldBBox();
  if (!bb) return;
  const c1 = w2c(bb.minX, bb.maxY);
  const c2 = w2c(bb.maxX, bb.minY);
  const x = Math.min(c1.cx, c2.cx) - 5;
  const y = Math.min(c1.cy, c2.cy) - 5;
  const w = Math.abs(c2.cx - c1.cx) + 10;
  const h = Math.abs(c2.cy - c1.cy) + 10;
  const col = isDark ? '#fbbf24' : '#d97706';
  drawCtx.save();
  drawCtx.strokeStyle = col;
  drawCtx.lineWidth = 1.5;
  drawCtx.setLineDash([5, 4]);
  drawCtx.strokeRect(x, y, w, h);
  drawCtx.setLineDash([]);
  // Метка «двигается стрелками» — над рамкой (или под ней, если упёрлись в верх холста)
  const hint = '←→↑↓';
  drawCtx.font = 'bold 11px sans-serif';
  const tw = drawCtx.measureText(hint).width;
  const labelY = (y - 16 >= 2) ? y - 16 : y + h + 3;
  drawCtx.fillStyle = isDark ? 'rgba(26,26,46,0.9)' : 'rgba(255,255,255,0.9)';
  drawCtx.fillRect(x + w / 2 - tw / 2 - 4, labelY, tw + 8, 14);
  drawCtx.fillStyle = col;
  drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'middle';
  drawCtx.fillText(hint, x + w / 2, labelY + 7);
  drawCtx.restore();
}

// ═══════════════════════════════════════════════════════════════
// УПОР (задний упор гибочного пресса), 2D
// Прямоугольник 20×8 мм, скользит по X ≤ 0, касается контура
// заготовки. При анимации отъезжает назад на 100 мм (easeInOut).
// ═══════════════════════════════════════════════════════════════
function drawStopper(prof, isDark) {
  if (!S.stopperVisible || !prof || !prof.pts || prof.pts.length < 1) return;
  // v4.7: касание упора — по НАРУЖНОЙ поверхности заготовки (учёт
  // толщины металла, клип по высоте упора) — единая функция
  // stopperTouchXThick (simulation/profile.js): 2D-упор, 3D-упор и
  // stopperDist в чертеже всегда показывают ОДНО И ТО ЖЕ число.
  const w = 20, h = 8;
  const touchX = (typeof stopperTouchXThick === 'function')
    ? stopperTouchXThick(prof, { height: h })
    : null;

  // Анимация отъезда упора: пока идёт анимация (S.simAnimRunning),
  // упор плавно переезжает от «отдыха» к «отдых-100» (100 мм назад).
  // После анимации: есть точка касания — упор переезжает к ней;
  // нет — возвращается на «отдых» (предгиб. позицию).
  let rightX;
  const hasRest = (S._stopperRestTouchX !== undefined && S._stopperRestTouchX !== null);
  if (S.simAnimRunning) {
    const rest = hasRest ? S._stopperRestTouchX : (touchX !== null ? touchX : 0);
    const p = Math.max(0, Math.min(1, S.simAnimProgress || 0));
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    rightX = rest - 100 * ease;
  } else {
    if (touchX !== null) {
      S._stopperRestTouchX = touchX;
      rightX = touchX;
    } else {
      rightX = hasRest ? S._stopperRestTouchX : 0;
    }
  }
  let centerX = rightX - w / 2;
  if (centerX > 0) centerX = 0; // не в X+
  const left = centerX - w / 2;
  const right = centerX + w / 2;
  const yTop = h / 2;
  const yBot = -h / 2;

  const cTL = w2c(left, yTop);
  const cRB = w2c(right, yBot);
  const cx = Math.min(cTL.cx, cRB.cx);
  const cy = Math.min(cTL.cy, cRB.cy);
  const cw = Math.abs(cRB.cx - cTL.cx);
  const ch = Math.abs(cRB.cy - cTL.cy);

  drawCtx.save();
  drawCtx.fillStyle = isDark ? '#9ca3af15' : '#6b728015';
  drawCtx.fillRect(cx, cy, cw, ch);
  drawCtx.save();
  drawCtx.beginPath();
  drawCtx.rect(cx, cy, cw, ch);
  drawCtx.clip();
  drawCtx.strokeStyle = isDark ? '#9ca3af88' : '#6b728088';
  drawCtx.lineWidth = 0.8;
  drawCtx.setLineDash([]);
  const pitch = 4;
  for (let s = -ch; s <= cw + ch; s += pitch) {
    drawCtx.beginPath();
    drawCtx.moveTo(cx + s, cy + ch);
    drawCtx.lineTo(cx + s + ch, cy);
    drawCtx.stroke();
  }
  drawCtx.restore();
  drawCtx.strokeStyle = isDark ? '#9ca3afcc' : '#6b7280cc';
  drawCtx.lineWidth = 1.5;
  drawCtx.setLineDash([]);
  drawCtx.strokeRect(cx, cy, cw, ch);
  const labelC = w2c(centerX, yTop);
  drawCtx.font = '9px sans-serif';
  drawCtx.textAlign = 'center';
  drawCtx.textBaseline = 'bottom';
  // Метка: расстояние от правого края упора (точка касания) до (0,0)
  const label = t('stopperWord') + ' ' + (Math.abs(right).toFixed(1)) + ' ' + t('mm');
  const tw = drawCtx.measureText(label).width;
  drawCtx.fillStyle = isDark ? 'rgba(26,26,46,0.85)' : 'rgba(255,255,255,0.85)';
  drawCtx.fillRect(labelC.cx - tw / 2 - 3, labelC.cy - 12, tw + 6, 12);
  drawCtx.fillStyle = isDark ? '#d1d5db' : '#4b5563';
  drawCtx.fillText(label, labelC.cx, labelC.cy - 2);
  drawCtx.restore();

  S._stopperCenterX = centerX;
  S._stopperCenterY = 0;
  S._stopperLeft = left;
  S._stopperRight = right;
  S._stopperTop = yTop;
  S._stopperBottom = yBot;
}

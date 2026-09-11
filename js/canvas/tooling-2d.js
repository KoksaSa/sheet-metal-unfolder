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
 * v5.9: ХОД пуансона при гибке — ровно SIM_PUNCH_TRAVEL (8 мм).
 * Позиция покоя = конечная точка касания дуги + 8 мм (в покое без
 * активного гиба — T/2 + 8, т.е. 8 мм над верхней поверхностью листа);
 * к концу анимации вершина опускается точно на внутреннюю (вогнутую)
 * поверхность дуги гиба (радиус по таблице металла, v5.0).
 * Возвращает Y-координату вершины пуансона (мировая система).
 */
function punchTipWorldY(animInfo) {
  const T = S.metal.thickness || 1;
  // Конечная цель: внутренняя поверхность дуги активного гиба (v5.0);
  // фолбэк — верхняя поверхность листа
  let finalTarget = T / 2;
  if (animInfo && animInfo.animating && typeof activeBendArcInnerY === 'function') {
    const iy = activeBendArcInnerY(animInfo.bendIdx, 1);
    if (iy !== null && Number.isFinite(iy)) finalTarget = iy;
  }
  // Покой: ровно SIM_PUNCH_TRAVEL над конечной целью, но не ниже 2 мм над листом
  const restY = Math.max(finalTarget + SIM_PUNCH_TRAVEL, T / 2 + 2);
  if (!animInfo || !animInfo.animating) return restY;
  const p = Math.max(0, Math.min(1, animInfo.progress));
  const e = easeInOutCubic(p);
  // Текущая цель (дуга «заворачивается» по мере гибки)
  let target = T / 2;
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
// v5.9: collision — результат detectPunchCollision(): пуансон
// подсвечивается КРАСНЫМ (контур касается тела пуансона на этом шаге).
// ═══════════════════════════════════════════════════════════════
function drawPressBrakeTooling(isDark, animInfo, collision) {
  const coll = !!collision;
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
    // v5.9: при коллизии контура с пуансоном — красная подсветка
    drawCtx.strokeStyle = coll ? '#dc2626' : (isDark ? '#ef4444aa' : '#ef4444cc');
    drawCtx.fillStyle = coll ? (isDark ? '#ef444440' : '#ef444438') : (isDark ? '#ef444418' : '#ef444415');
    drawCtx.lineWidth = coll ? 2.5 : 1.5;

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
    drawCtx.fillStyle = coll ? '#dc2626' : (isDark ? '#f06060' : '#dc2626');
    drawCtx.font = '9px sans-serif';
    drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'top';
    drawCtx.fillText((S.lang === 'en' ? punch.nameEn : punch.nameRu) || 'Punch', pl.cx, pl.cy + 3);

    // v5.9: красная плашка «КАСАНИЕ ПУАНСОНА» на корпусе при коллизии
    if (coll) {
      drawCtx.save();
      drawCtx.font = 'bold 10px sans-serif';
      const ctxt = '\u26A0 ' + t('punchCollisionShort');
      const tw = drawCtx.measureText(ctxt).width;
      const pc = w2c(pOX, pH * 0.4 + pOY + tipY);
      drawCtx.fillStyle = isDark ? 'rgba(50,8,8,0.92)' : 'rgba(254,226,226,0.95)';
      drawCtx.fillRect(pc.cx - tw / 2 - 6, pc.cy - 8, tw + 12, 16);
      drawCtx.strokeStyle = '#dc2626';
      drawCtx.lineWidth = 1.2;
      drawCtx.strokeRect(pc.cx - tw / 2 - 6, pc.cy - 8, tw + 12, 16);
      drawCtx.fillStyle = '#dc2626';
      drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'middle';
      drawCtx.fillText(ctxt, pc.cx, pc.cy);
      drawCtx.restore();
    }
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

// ═══════════════════════════════════════════════════════════════
// v5.9: КОЛЛИЗИЯ КОНТУРА ЗАГОТОВКИ С ПУАНСОНОМ
// Проверяем, попадает ли контур (машинные координаты — как нарисовано
// в симуляции) в ТВЁРДОЕ ТЕЛО пуансона при его текущем положении
// (вершина на высоте tipY). Используется:
//   • живая 2D-симуляция — пуансон подсвечивается красным;
//   • 3D-симуляция — корпус пуансона красный (canvas и three.js);
//   • чертёж «Последовательность гибки» — пометки, на каком шаге
//     контур касается пуансона (бейдж + красный контур инструмента).
// ═══════════════════════════════════════════════════════════════

// Твёрдое тело пуансона в мировых координатах: список замкнутых
// полигонов (цепочки профиля — как нарисовано, либо «обелиск» для
// упрощённой геометрии без профиля: нос-дуга + грани к корпусу).
function punchSolidPolygon(tipY) {
  const punch = (typeof getPunchByIndex === 'function') ? getPunchByIndex(S.metal.punchIndex) : null;
  if (!punch) return null;
  const pOX = S.punchOffsetX || 0;
  const pOY = S.punchOffsetY || 0;
  if (punch.profile && punch.profile.chains && punch.profile.chains.length) {
    const offX = -punchProfileAxisX(punch.profile) + pOX;
    const offY = -punch.profile.minY + pOY + tipY;
    const polys = [];
    punch.profile.chains.forEach(chain => {
      if (!chain || chain.length < 3) return;
      polys.push(chain.map(p => ({ x: p.x + offX, y: p.y + offY })));
    });
    return polys.length ? polys : null;
  }
  // Упрощённая геометрия (без профиля): нос радиусом r, вертикальный
  // корпус шириной swidth. НЕ «прямоугольник от самого носа» — иначе
  // ноги текущего гиба (крутые углы) дают ложные срабатывания.
  const r = Math.max(0.2, punch.radius || 1);
  const pH = Math.max(r * 2 + 1, punch.height || 50);
  const halfS = Math.max(r + 0.5, (punch.swidth || 20) / 2);
  const pts = [];
  const NARC = 10;
  for (let i = 0; i <= NARC; i++) {
    const a = Math.PI + Math.PI * i / NARC; // нижняя полуокружность носа
    pts.push({ x: pOX + r * Math.cos(a), y: tipY + r + r * Math.sin(a) });
  }
  pts.push({ x: pOX + halfS, y: tipY + pH });
  pts.push({ x: pOX - halfS, y: tipY + pH });
  return [pts];
}

// Строгое пересечение отрезков (внутри обоих, не на концах)
function _segCross(p1, p2, p3, p4) {
  const d1x = p2.x - p1.x, d1y = p2.y - p1.y;
  const d2x = p4.x - p3.x, d2y = p4.y - p3.y;
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < 1e-12) return null;
  const t = ((p3.x - p1.x) * d2y - (p3.y - p1.y) * d2x) / denom;
  const u = ((p3.x - p1.x) * d1y - (p3.y - p1.y) * d1x) / denom;
  if (t <= 1e-9 || t >= 1 - 1e-9 || u <= 1e-9 || u >= 1 - 1e-9) return null;
  return { x: p1.x + d1x * t, y: p1.y + d1y * t };
}

// Точка внутри полигона (луч, чётность пересечений)
function _ptInPoly(p, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y, xj = poly[j].x, yj = poly[j].y;
    if (((yi > p.y) !== (yj > p.y)) && (p.x < (xj - xi) * (p.y - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}

// Расстояние от точки до отрезка
function _ptSegDist(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const l2 = dx * dx + dy * dy;
  if (l2 < 1e-12) return Math.hypot(p.x - a.x, p.y - a.y);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t));
}

/**
 * Детекция коллизии контура с телом пуансона.
 * @param {Array} metalPts - точки контура (машинные координаты, prof.pts)
 * @param {number} tipY - мировая Y вершины пуансона (punchTipWorldY)
 * @returns {null|{pts:Array, count:number}} точки касания/проникновения
 */
function detectPunchCollision(metalPts, tipY) {
  if (!metalPts || metalPts.length < 2) return null;
  if (!Number.isFinite(tipY)) return null;
  const polys = (typeof punchSolidPolygon === 'function') ? punchSolidPolygon(tipY) : null;
  if (!polys) return null;
  const punch = (typeof getPunchByIndex === 'function') ? getPunchByIndex(S.metal.punchIndex) : null;
  const T = (S.metal && Number.isFinite(S.metal.thickness)) ? S.metal.thickness : 1;
  const noseR = (punch && Number.isFinite(punch.radius) && punch.radius > 0) ? punch.radius : 1;
  // Зона обёртывания носа: металл ЛЕГИТМНО касается носа пуансона при
  // гибке (дуга оборачивает вершину) — касания ближе этого радиуса
  // к вершине пуансона НЕ считаются коллизией.
  const wrapR = Math.max(noseR, T) * 1.5 + 2.5;
  const tipX = S.punchOffsetX || 0;
  const inWrap = function (x, y) { return Math.hypot(x - tipX, y - tipY) < wrapR; };
  const tol = 0.25; // допуск скользящего касания (грани пуансона, мм)

  const edges = [];
  polys.forEach(function (poly) {
    for (let i = 0; i < poly.length; i++) edges.push([poly[i], poly[(i + 1) % poly.length]]);
  });

  const hits = [];
  const pushHit = function (x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    if (inWrap(x, y)) return;
    for (let i = 0; i < hits.length; i++) {
      if (Math.hypot(hits[i].x - x, hits[i].y - y) < 0.8) return;
    }
    if (hits.length < 10) hits.push({ x: x, y: y });
  };

  // 1. Пересечение сегментов контура с рёбрами пуансона
  for (let i = 0; i < metalPts.length - 1; i++) {
    const A = metalPts[i], B = metalPts[i + 1];
    for (let k = 0; k < edges.length; k++) {
      const ip = _segCross(A, B, edges[k][0], edges[k][1]);
      if (ip) pushHit(ip.x, ip.y);
    }
  }
  // 2. Вершины контура ВНУТРИ тела пуансона (глубже допуска)
  metalPts.forEach(function (p) {
    for (let s = 0; s < polys.length; s++) {
      if (_ptInPoly(p, polys[s])) {
        let dMin = Infinity;
        for (let k = 0; k < edges.length; k++) dMin = Math.min(dMin, _ptSegDist(p, edges[k][0], edges[k][1]));
        if (dMin > tol) pushHit(p.x, p.y);
        break;
      }
    }
  });

  return hits.length ? { pts: hits, count: hits.length } : null;
}

// Красные маркеры точек касания на контуре (живая 2D-симуляция)
function drawPunchCollisionMarks(collision, isDark) {
  if (!collision || !collision.pts || !collision.pts.length) return;
  drawCtx.save();
  collision.pts.forEach(function (hp) {
    const c = w2c(hp.x, hp.y);
    drawCtx.beginPath();
    drawCtx.arc(c.cx, c.cy, 6, 0, Math.PI * 2);
    drawCtx.fillStyle = 'rgba(220,38,38,0.30)';
    drawCtx.fill();
    drawCtx.beginPath();
    drawCtx.arc(c.cx, c.cy, 3.2, 0, Math.PI * 2);
    drawCtx.fillStyle = '#dc2626';
    drawCtx.fill();
    drawCtx.strokeStyle = isDark ? '#fff' : '#fff';
    drawCtx.lineWidth = 1;
    drawCtx.stroke();
  });
  drawCtx.restore();
}

// ═══════════════════════════════════════════════════════════════
// CANVAS / EVENTS — события мыши/колеса на холсте рисования
// (рисование, выбор, симуляция, перетаскивание, контекстное меню)
// и события холста развёртки (зум/пан/двойной клик)
// ═══════════════════════════════════════════════════════════════

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

// Проверка клика по пуансону (когда инструменты показаны на канвас).
// v5.5 FIX: зона следует за РЕАЛЬНОЙ отрисовкой — bbox профиля +
// offset'ы + подъём пуансона над листом (punchWorldBBox). Раньше
// зона была «прибита» к (pOX, 0..pH): пуансон над листом/со сдвигом
// было НЕВОЗМОЖНО взять мышкой (матрица при этом бралась — её зона
// учитывала offset'ы).
function isNearPunch(cx, cy) {
  if (!S.showToolsOnCanvas) return false;
  const bb = (typeof punchWorldBBox === 'function') ? punchWorldBBox() : null;
  if (!bb) return false;
  const c1 = w2c(bb.minX, bb.maxY);
  const c2 = w2c(bb.maxX, bb.minY);
  const pad = 8;
  return cx >= Math.min(c1.cx, c2.cx) - pad && cx <= Math.max(c1.cx, c2.cx) + pad &&
         cy >= Math.min(c1.cy, c2.cy) - pad && cy <= Math.max(c1.cy, c2.cy) + pad;
}

// Проверка клика по матрице (когда инструменты показаны на канвас).
// v5.5: через dieWorldBBox — учитывает и профиль (DXF-матрицы),
// а не только swidth/fallback-прямоугольник.
function isNearDie(cx, cy) {
  if (!S.showToolsOnCanvas) return false;
  const bb = (typeof dieWorldBBox === 'function') ? dieWorldBBox() : null;
  if (!bb) return false;
  const c1 = w2c(bb.minX, bb.maxY);
  const c2 = w2c(bb.maxX, bb.minY);
  const pad = 8;
  return cx >= Math.min(c1.cx, c2.cx) - pad && cx <= Math.max(c1.cx, c2.cx) + pad &&
         cy >= Math.min(c1.cy, c2.cy) - pad && cy <= Math.max(c1.cy, c2.cy) + pad;
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

// ==================== СОБЫТИЯ ХОЛСТА РИСОВАНИЯ ====================
if (drawCanvas) {
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
  } else if (e.button === 0 && S.toolMode === 'arc') {
    // ══ РЕЖИМ «ДУГА» (v5.9, CAD-стиль: 3 клика) ══
    // 1-й клик — старт дуги (привязка к первой/последней точке цепи
    // или свободная точка), 2-й — конец, 3-й — точка НА ДУГЕ → диалог
    // числа сегментов. После 2-го клика живой предпросмотр дуги
    // следует за курсором (курсор = точка на дуге).
    const w = c2w(cx, cy);
    let p = S.snapToGrid ? snapPoint(w) : w;
    if (!S.arcDraft) {
      let attachIdx = null;
      if (S.points.length > 0) {
        let hitIdx = -1;
        for (let i = 0; i < S.points.length; i++) {
          const pp = w2c(S.points[i].x, S.points[i].y);
          if (Math.sqrt((pp.cx - cx) ** 2 + (pp.cy - cy) ** 2) < 12) { hitIdx = i; break; }
        }
        if (hitIdx === 0) attachIdx = 0;                              // рисуем «назад» от первой
        else if (hitIdx === S.points.length - 1) attachIdx = hitIdx;  // продолжаем от последней
        else if (hitIdx >= 0) { drawDrawCanvas(); return; }           // внутренняя точка — нельзя
      }
      if (attachIdx !== null) {
        S.arcDraft = { startPt: { x: S.points[attachIdx].x, y: S.points[attachIdx].y }, attachIdx: attachIdx };
      } else {
        S.arcDraft = { startPt: { x: p.x, y: p.y }, attachIdx: null };
      }
      drawDrawCanvas();
    } else if (!S.arcDraft.endPt) {
      // Второй клик — конец дуги (дальше ждём точку на дуге)
      if (Math.hypot(p.x - S.arcDraft.startPt.x, p.y - S.arcDraft.startPt.y) < 1e-6) return;
      S.arcDraft.endPt = { x: p.x, y: p.y };
      drawDrawCanvas();
    } else {
      // Третий клик — точка НА дуге → диалог числа сегментов
      if (Math.hypot(p.x - S.arcDraft.startPt.x, p.y - S.arcDraft.startPt.y) < 1e-6 ||
          Math.hypot(p.x - S.arcDraft.endPt.x, p.y - S.arcDraft.endPt.y) < 1e-6) return;
      S.arcDraft.midPt = { x: p.x, y: p.y };
      if (typeof showArcSegDialog === 'function') showArcSegDialog();
      drawDrawCanvas();
    }
  } else if (e.button === 0 && S.toolMode === 'tooldraw' && S.toolDraw) {
    // ══ РЕЖИМ РИСОВАНИЯ ИНСТРУМЕНТА (v5.7) ══
    // ЛКМ — точка контура своего пуансона/матрицы; клик по первой
    // точке (≥ 3 точек) — замкнуть контур и завершить рисование.
    const w = c2w(cx, cy);
    const p = snapToolDrawPoint(w);
    const pts = S.toolDraw.points || [];
    if (pts.length >= 3) {
      const f = w2c(pts[0].x, pts[0].y);
      if (Math.sqrt((f.cx - cx) ** 2 + (f.cy - cy) ** 2) < 15) {
        e.preventDefault();
        finishToolDraw();
        return;
      }
    }
    addToolDrawPoint(p);
  } else if (e.button === 2 && S.toolMode === 'tooldraw' && S.toolDraw) {
    // ПКМ — убрать последнюю точку черновика
    undoToolDrawPoint();
  } else if (e.button === 0 && S.toolMode === 'select') {
    // ══ РЕЖИМ СЕЛЕКТА ══

    // === SIMULATION CLICK (ЛКМ) — накопительный режим ===
    if (S.showToolsOnCanvas && S.unfoldResult && S.points.length >= 2) {
      const prof = computeAccumulatedProfile(getAnimInfo());
      if (prof && prof.bendMarkers) {
        const marker = findMarkerAt(prof.bendMarkers, cx, cy);
        if (marker) {
          if (S.simAnimRunning) return; // анимация идёт — игнорируем
          // Кайма (isHem) — всегда согнута, её можно только ВЫБИРАТЬ.
          if (marker.isHem) {
            S.selectedBendIndex = marker.index;
            drawDrawCanvas();
            return;
          }
          const bentSet = S.simBentMarkers || [];
          if (marker.isBent) {
            // Этот гиб уже согнут
            if (marker.index === bentSet[bentSet.length - 1]) {
              // Последний согнутый — разгибаем (анимация)
              startUnbendAnimation(marker.index);
            } else {
              // Не последний — только выбираем (нельзя разогнуть вне порядка)
              S.selectedBendIndex = marker.index;
              drawDrawCanvas();
            }
            return;
          }
          // Несогнутый гиб
          if (S.selectedBendIndex === marker.index) {
            // Повторный клик по выбранному — сгибаем (анимация, накопительно)
            startBendAnimation(marker.index);
          } else {
            // Первый клик — выбираем
            S.selectedBendIndex = marker.index;
            drawDrawCanvas();
          }
          return;
        }
      }
    }

    // Перетаскивание инструментов (только если НЕ заблокированы).
    // Сначала пуансон (его зона перекрывается с матрицей у начала координат).
    // v5.5: захват «без прыжка» — инструмент держится за точку, где
    // взяли (дельта от якоря); клик также ВЫБИРАЕТ инструмент как
    // активный для стрелок клавиатуры (S.toolKeyTarget).
    if (!S.toolLocked) {
      if (isNearPunch(cx, cy)) {
        dragPunch = true;
        S.toolKeyTarget = 'punch';
        const w = c2w(cx, cy);
        dragPunchGrab = { dx: w.x - (S.punchOffsetX || 0), dy: w.y - (S.punchOffsetY || 0) };
        drawCanvas.style.cursor = 'grabbing';
        drawDrawCanvas(); // перерисовать с подсветкой активного
        return;
      }
      if (isNearDie(cx, cy)) {
        dragDie = true;
        S.toolKeyTarget = 'die';
        const w = c2w(cx, cy);
        dragDieGrab = { dx: w.x - (S.dieOffsetX || 0), dy: w.y - (S.dieOffsetY || 0) };
        drawCanvas.style.cursor = 'grabbing';
        drawDrawCanvas();
        return;
      }
    }
  } else if (e.button === 2 && S.toolMode === 'select') {
    // === ПКМ — разгибание последнего согнутого гиба (с анимацией) ===
    if (S.showToolsOnCanvas && !S.simAnimRunning) {
      const bentSet = S.simBentMarkers || [];
      if (bentSet.length > 0) {
        const prof = computeAccumulatedProfile(null);
        if (prof && prof.bendMarkers) {
          const marker = findMarkerAt(prof.bendMarkers, cx, cy);
          const lastBentIdx = bentSet[bentSet.length - 1];
          if (marker && marker.index === lastBentIdx) {
            startUnbendAnimation(marker.index);
            return;
          }
        }
      }
    }
  }

  // Проверяем клик по вершине гиба (предпросмотр)
  if (S.toolMode === 'select') {
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
          }
          drawDrawCanvas();
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
    // Клик по hit areas (только сегменты — для редактирования длины)
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
  }

  if (e.button === 0 && S.toolMode === 'erase') {
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
// v5.7: двойной клик также завершает рисование инструмента (≥ 3 точек)
drawCanvas.addEventListener('dblclick', e => {
  if (S.toolMode === 'tooldraw' && S.toolDraw) {
    if ((S.toolDraw.points || []).length >= 3) {
      e.preventDefault();
      finishToolDraw();
    }
    return;
  }
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

  if (dragDie) {
    const w = c2w(cx, cy);
    let nx = w.x - (dragDieGrab ? dragDieGrab.dx : 0);
    let ny = w.y - (dragDieGrab ? dragDieGrab.dy : 0);
    if (S.snapToGrid) { const sp = snapPoint({ x: nx, y: ny }); nx = sp.x; ny = sp.y; }
    S.dieOffsetX = nx;
    S.dieOffsetY = ny;
    // v5.8: единая точка сохранения — localStorage + карта позиций
    // «своих» инструментов (перетаскивание запоминается сразу)
    if (typeof saveToolPositions === 'function') saveToolPositions();
    drawDrawCanvas();
    return;
  }

  if (dragPunch) {
    const w = c2w(cx, cy);
    let nx = w.x - (dragPunchGrab ? dragPunchGrab.dx : 0);
    let ny = w.y - (dragPunchGrab ? dragPunchGrab.dy : 0);
    if (S.snapToGrid) { const sp = snapPoint({ x: nx, y: ny }); nx = sp.x; ny = sp.y; }
    S.punchOffsetX = nx;
    S.punchOffsetY = ny;
    // v5.8: единая точка сохранения — localStorage + карта позиций
    if (typeof saveToolPositions === 'function') saveToolPositions();
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

  // === SIMULATION HOVER ===
  if (S.showToolsOnCanvas && S.unfoldResult && S.points.length >= 2 && !S.simAnimRunning) {
    const prof = computeAccumulatedProfile(getAnimInfo());
    if (prof && prof.bendMarkers) {
      const hoverIdx = findMarkerHover(prof.bendMarkers, cx, cy);
      S.hoveredBendMarkerIndex = hoverIdx;
      if (hoverIdx >= 0) {
        drawCanvas.style.cursor = 'pointer';
      }
    }
  }

  // Cursor (только если не установлен pointer выше)
  if (drawCanvas.style.cursor !== 'pointer') {
    if (S.toolMode === 'draw' || S.toolMode === 'tooldraw' || S.toolMode === 'arc') drawCanvas.style.cursor = 'crosshair';
    else if (S.toolMode === 'select') drawCanvas.style.cursor = (S.hoveredPt !== null || isNearPunch(cx, cy) || isNearDie(cx, cy)) ? 'grab' : 'default';
    else if (S.toolMode === 'erase') drawCanvas.style.cursor = S.hoveredPt !== null ? 'pointer' : 'default';
    else if (S.toolMode === 'measure') drawCanvas.style.cursor = 'crosshair';
    else if (S.toolMode === 'hem') drawCanvas.style.cursor = S.hemHoveredSeg >= 0 ? 'pointer' : 'default';
    else drawCanvas.style.cursor = S.toolMode === 'draw' ? 'crosshair' : 'default';
  }

  // Перерисовка (не во время анимации — там свой RAF)
  if (!S.simAnimRunning && !S._drawRAFPending) {
    S._drawRAFPending = true;
    requestAnimationFrame(() => {
      S._drawRAFPending = false;
      drawDrawCanvas();
    });
  }
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
    dragPunchGrab = null;
    drawCanvas.style.cursor = 'default';
    drawDrawCanvas();
  }
  if (dragDie) {
    dragDie = false;
    dragDieGrab = null;
    drawCanvas.style.cursor = 'default';
    drawDrawCanvas();
  }
});

drawCanvas.addEventListener('mouseleave', () => {
  S.mouseWorld = null;
  isPanning = false;
  panStart = null;
  dragPunch = false;
  dragDie = false;
  dragPunchGrab = null;
  dragDieGrab = null;
  dragPtIdx = null;
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

// ==================== КОНТЕКСТНОЕ МЕНЮ ====================
drawCanvas.addEventListener('contextmenu', e => {
  e.preventDefault();
  // v5.7: в режиме рисования инструмента ПКМ убирает последнюю точку
  // (обработчик mousedown) — контекстное меню не показываем
  if (S.toolMode === 'tooldraw') return;
  const r = drawCanvas.getBoundingClientRect();
  const cx = e.clientX - r.left, cy = e.clientY - r.top;
  const w = c2w(cx, cy);
  const cm = document.getElementById('context-menu');
  cm.innerHTML = '';
  cm.classList.remove('hidden');
  const cmMaxX = window.innerWidth - 160;
  const cmMaxY = window.innerHeight - 200;
  cm.style.left = Math.min(e.clientX, cmMaxX) + 'px';
  cm.style.top = Math.min(e.clientY, cmMaxY) + 'px';
  const addBtn = (label, fn) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.onclick = () => { fn(); cm.classList.add('hidden'); };
    cm.appendChild(b);
  };
  // Кайма на ближайшем сегменте?
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
} // end if (drawCanvas)

// Закрытие контекстного меню при клике мимо
document.addEventListener('click', e => {
  if (!e.target.closest('.context-menu')) {
    const cm = document.getElementById('context-menu');
    if (cm) cm.classList.add('hidden');
  }
});

// ==================== СОБЫТИЯ ХОЛСТА РАЗВЁРТКИ ====================
// Не прокручивать сайдбар при наведении на развёртку
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

if (unfoldCanvas) {
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

// Двойной клик — сброс масштаба
unfoldCanvas.addEventListener('dblclick', () => {
  ufManualZoom = null;
  drawUnfoldCanvas();
});
} // end if (unfoldCanvas)

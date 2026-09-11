// ═══════════════════════════════════════════════════════════════
// CANVAS / SIM3D — 3D-СИМУЛЯЦИЯ ГИБКИ (полноэкранная модалка):
// матрица, пуансон (опускается в матрицу!), упор и контур заготовки
// в 3D; вращение ЛКМ, панорама ПКМ, зум колёсиком/пинчем.
// Кнопки шагов: «Плоская» → «Шаг N» → «↺ Сброс» → «▶ Полная».
//
// ИСПРАВЛЕНО в v4.1:
//  • панорама (ПКМ/пинч) — раньше sim3dPanX/Y не применялись к проекции;
//  • «отскок» после завершения шага — профиль теперь включает
//    только что согнутый гиб (показывает состояние ПОСЛЕ шага);
//  • лицевая сторона (faceSignSim) — считается от числа согнутых
//    гибов ТЕКУЩЕГО шага, а не 2D-состояния (раньше на «Плоской»
//    рисовалась не с той стороны);
//  • пуансон опускается в матрицу при анимации шага (air bending).
// ═══════════════════════════════════════════════════════════════

let sim3dModalOpen = false;
let sim3dRotY = 0.5, sim3dRotX = 0.6, sim3dZoom = 1.0;
let sim3dW = 800, sim3dH = 500;
let isDragging3DSim = false;
let sim3dDragStart = null;
let sim3dUserZoomed = false;

function toggle3DSimModal() {
  if (sim3dModalOpen) close3DSimModal();
  else open3DSimModal();
}

function open3DSimModal() {
  const modal = document.getElementById('sim3d-modal');
  if (!modal) return;
  // v4.4: при открытии сверяем подпись профиля — если профиль изменился
  // с момента последнего открытия 3D (очищён/перерисован/пресет), шаги
  // сбрасываются: новая деталь всегда начинается с плоского листа.
  const sigOpen = (typeof simProfileSignature === 'function') ? simProfileSignature() : null;
  if (sim3dProfileSig !== null && sigOpen !== null && sigOpen !== sim3dProfileSig) {
    if (typeof sim3dResetForNewProfile === 'function') sim3dResetForNewProfile();
  }
  modal.classList.remove('hidden');
  sim3dModalOpen = true;
  sim3dUserZoomed = false;
  requestAnimationFrame(() => {
    resize3DSimCanvas();
    draw3DSimulation();
  });
  // v5.2: WebGL-рендер — three.js подгружается лениво при первом
  // открытии 3D-модалки (600 КБ не едут со старта страницы). Пока
  // не загрузился — рисует прежний canvas-рендер; после загрузки
  // кадр перерисовывается уже в WebGL. WebGL недоступен — навсегда
  // остаётся canvas-рендер (fallback).
  if (typeof three3DEnsure === 'function') {
    three3DEnsure(function (ok) {
      if (ok && sim3dModalOpen) {
        resize3DSimCanvas();
        draw3DSimulation();
      }
    });
  }
  // Setup events
  setup3DSimEvents();
}

function close3DSimModal() {
  const modal = document.getElementById('sim3d-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  sim3dModalOpen = false;
  isDragging3DSim = false;
  if (typeof sim3dStopAnim === 'function') sim3dStopAnim();
  sim3dFullSimRunning = false;
  // После закрытия 3D-модалки перерисовываем 2D-холст, чтобы он показывал
  // состояние, которое было до входа в 3D (с оригинальными simFlipX/simFlipY).
  if (typeof drawDrawCanvas === 'function' && S.showToolsOnCanvas) drawDrawCanvas();
}

function resize3DSimCanvas() {
  const cont = document.getElementById('sim3d-modal-container');
  if (!cont) return;
  const r = cont.getBoundingClientRect();
  sim3dW = Math.max(200, Math.floor(r.width));
  sim3dH = Math.max(200, Math.floor(r.height));
  const dpr = window.devicePixelRatio || 1;
  const cv = document.getElementById('sim3d-canvas');
  if (!cv) return;
  cv.width = sim3dW * dpr;
  cv.height = sim3dH * dpr;
  cv.style.width = sim3dW + 'px';
  cv.style.height = sim3dH + 'px';
  // v5.2: синхронный ресайз WebGL-канваса (three.js)
  if (typeof three3DResize === 'function' && typeof three3DIsActive === 'function' && three3DIsActive()) {
    three3DResize(sim3dW, sim3dH);
  }
}

// 3D-проекция для симуляции (отдельные углы/зум от 3D-превью).
// FIX: панорамирование — sim3dPanX/sim3dPanY теперь прибавляются
// к координатам проекции (раньше всегда было +0).
function project3DSim(x, y, z, cx, cy) {
  const cosY = Math.cos(sim3dRotY), sinY = Math.sin(sim3dRotY);
  const cosX = Math.cos(sim3dRotX), sinX = Math.sin(sim3dRotX);
  let x1 = x * cosY - z * sinY;
  let z1 = x * sinY + z * cosY;
  let y1 = y;
  let y2 = y1 * cosX - z1 * sinX;
  let z2 = y1 * sinX + z1 * cosX;
  const scale = sim3dZoom * 0.5;
  return {
    x: sim3dW / 2 + x1 * scale + cx,
    y: sim3dH / 2 - y2 * scale + cy,
    z: z2
  };
}

// v5.2: вычисление позиции упора для 3D-симуляции (мировые координаты
// + текст метки). Раньше — инлайн-IIFE в draw3DSimulation; вынесено, чтобы
// использовать и в canvas-рендере (проекция граней), и в WebGL-рендере
// (позиция меша + метка через камеру). Логика 1:1 с прежней (v4.7:
// касание наружной поверхности заготовки; при анимации — отъезд назад).
function compute3DStopperInfo(prof) {
  const sw = 20, sh = 8;
  function touchXOf(profile) {
    if (typeof stopperTouchXThick !== 'function') return null;
    return stopperTouchXThick(profile, { height: sh });
  }
  let stopperRightX;
  if (sim3dAnimRunning && sim3dStepIdx >= 0 && sim3dStepBends.length > 0) {
    const sb = S.simBentMarkers, sR = S.simAnimRunning, sB = S.simAnimBendIdx, sP = S.simAnimProgress, sS = S.selectedBendIndex, sFX = S.simFlipX, sFY = S.simFlipY;
    S.simBentMarkers = sim3dStepBends.slice(0, sim3dStepIdx);
    S.simAnimRunning = false; S.simAnimBendIdx = -1; S.simAnimProgress = 0;
    S.selectedBendIndex = sim3dStepBends[sim3dStepIdx];
    const stepMetaPre = (S.bendStepMeta || {})[sim3dStepBends[sim3dStepIdx]];
    if (stepMetaPre) { S.simFlipX = !!stepMetaPre.flipX; S.simFlipY = !!stepMetaPre.flipY; }
    const preProf = computeAccumulatedProfile({ bendIdx: sim3dStepBends[sim3dStepIdx], progress: 0, animating: false });
    S.simBentMarkers = sb; S.simAnimRunning = sR; S.simAnimBendIdx = sB; S.simAnimProgress = sP; S.selectedBendIndex = sS; S.simFlipX = sFX; S.simFlipY = sFY;
    const rest = touchXOf(preProf);
    const p = Math.max(0, Math.min(1, sim3dAnimProgress || 0));
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    stopperRightX = (rest !== null ? rest : 0) - 100 * ease;
  } else {
    const tx = touchXOf(prof);
    stopperRightX = (tx !== null) ? tx : 0;
  }
  let stopperCenterX = stopperRightX - sw / 2;
  if (stopperCenterX > 0) stopperCenterX = 0;
  const stopperRight = stopperCenterX + sw / 2;
  return {
    sw: sw, sh: sh,
    rightX: stopperRightX,
    centerX: stopperCenterX,
    left: stopperCenterX - sw / 2,
    right: stopperRight,
    top: sh / 2,
    bottom: -sh / 2,
    labelWorld: { x: stopperCenterX, y: sh / 2, z: 0 },
    text: t('stopperWord') + ' ' + Math.abs(stopperRight).toFixed(1) + ' ' + t('mm')
  };
}

// Главная функция 3D-симуляции: рисует матрицу, пуансон, упор и контур
// заготовки (из computeAccumulatedProfile) в 3D, который можно вращать.
function draw3DSimulation() {
  const cv = document.getElementById('sim3d-canvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const isDark = S.isDark;
  // v5.2: WebGL-путь (three.js) — сцена рисуется в WebGL-канвас позади
  // (#sim3d-gl-wrap), а этот 2D-канвас становится прозрачным оверлеем
  // (метка упора, HUD ориентации, кнопки шагов, подсказка). Пока three.js
  // не инициализирован/недоступен — прежний canvas-рендер без изменений.
  const useThree = (typeof three3DIsActive === 'function') && three3DIsActive();
  if (useThree) {
    ctx.clearRect(0, 0, sim3dW, sim3dH);
  } else {
    ctx.fillStyle = isDark ? '#1a1a2e' : '#f5f5f5';
    ctx.fillRect(0, 0, sim3dW, sim3dH);
  }
  // (v5.2) толщина/ширина/инструменты нужны и для пустого профиля (WebGL)
  const T0 = S.metal.thickness || 1;
  const W0 = S.metal.width || 100;
  const hw0 = W0 / 2;
  const die0 = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
  const punch0 = (typeof getPunchByIndex === 'function') ? getPunchByIndex(S.metal.punchIndex) : null;

  if (!S.unfoldResult || S.points.length < 2) {
    // v5.2: в WebGL-режиме матрица/пуансон/пол видны и без профиля
    if (useThree && typeof renderThree3DSim === 'function') {
      renderThree3DSim({
        prof: null, T: T0, hw: hw0, die: die0, punch: punch0,
        punchTipY: (typeof punchTipWorldY === 'function') ? punchTipWorldY(null) : 0,
        faceSignSim: 1, stopperInfo: null, isDark: isDark,
        usedFaceSide: S.simFaceSide || 'up', usedFlipX: !!S.simFlipX, usedFlipY: !!S.simFlipY
      });
    }
    ctx.fillStyle = isDark ? '#999' : '#666';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t('sim3dDrawProfile'), sim3dW / 2, sim3dH / 2);
    return;
  }

  // v4.5: построение sim3dStepBends — В НАЧАЛО функции (до расчёта
  // профиля): «Плоской» и шагам нужен ПЕРВЫЙ гиб ПОСЛЕДОВАТЕЛЬНОСТИ,
  // а не всегда индекс 0.
  const allBends = (S.unfoldResult && S.unfoldResult.bendInfos) ? S.unfoldResult.bendInfos.map((b, i) => i) : [];
  if (sim3dStepBends.length === 0 && (S.simBentMarkers || []).length > 0) sim3dStepBends = (S.simBentMarkers || []).slice();
  // v4.8: если 3D-шаги уже построены по КОРОТКОМУ префиксу, а в 2D
  // продолжили гнуть (последовательность удлинилась) — достраиваем хвост:
  // модалка всегда показывает ВСЮ выполненную последовательность.
  // (Раньше список шагов «замораживался» при первом открытии 3D: открыл
  // после 2 гибов из 4 — шаги 3-4 не появлялись, sim3dStartStepAnim(2)
  // попадал мимо списка.)
  if (sim3dStepBends.length > 0 && (S.simBentMarkers || []).length > sim3dStepBends.length) {
    const bmList = S.simBentMarkers;
    const isPrefix = sim3dStepBends.every((v, i) => bmList[i] === v);
    if (isPrefix) sim3dStepBends = bmList.slice();
  }
  if (sim3dStepBends.length === 0) sim3dStepBends = allBends.slice();
  // v4.4: фиксируем подпись профиля, на которой построены шаги; при смене
  // профиля (очистка/перерисовка/пресет) — полный сброс шагов и перестройка.
  const sigNow3d = (typeof simProfileSignature === 'function') ? simProfileSignature() : null;
  if (sim3dProfileSig !== null && sigNow3d !== null && sigNow3d !== sim3dProfileSig) {
    sim3dResetForNewProfile();
    if (sim3dStepBends.length === 0 && (S.simBentMarkers || []).length > 0) sim3dStepBends = (S.simBentMarkers || []).slice();
    if (sim3dStepBends.length === 0) sim3dStepBends = allBends.slice();
  }
  sim3dProfileSig = sigNow3d;

  // Step mode: sim3dStepIdx controls which bends are applied
  const savedBent = S.simBentMarkers, savedSel = S.selectedBendIndex, savedAnimR = S.simAnimRunning, savedAnimP = S.simAnimProgress, savedAnimB = S.simAnimBendIdx, savedFX = S.simFlipX, savedFY = S.simFlipY;
  // Запоминаем, какой flipX/flipY/faceSide реально использовался для расчёта
  // prof, чтобы faceSignSim в 3D был согласован с профилем (v4.5: faceSide
  // — тоже исторический, из meta шага).
  let usedFlipX = savedFX, usedFlipY = savedFY;
  let usedFaceSide = S.simFaceSide || 'up';
  let prof;
  if (sim3dStepIdx === -1) {
    // Плоский профиль — позиционируем по первому гибу (как в 2D-симуляции):
    // v4.5: якорь «Плоской» — первый гиб ПОСЛЕДОВАТЕЛЬНОСТИ (порядок гибки
    // мог начаться не с индекса 0), ориентация — из meta первого шага
    // (состояние ДО 1-го гиба), а НЕ текущие глобальные перевороты.
    const hasBends = S.unfoldResult && S.unfoldResult.bendInfos && S.unfoldResult.bendInfos.length > 0;
    if (hasBends && sim3dStepBends.length > 0) {
      const firstBendIdx = sim3dStepBends[0];
      const flatMeta = (S.bendStepMeta || {})[firstBendIdx];
      S.simBentMarkers = []; S.selectedBendIndex = firstBendIdx;
      S.simAnimRunning = false; S.simAnimBendIdx = -1; S.simAnimProgress = 0;
      // v4.5: перевороты на момент ДО первого гиба (из meta шага); нет meta
      // (первый гиб ещё не выполнялся в 2D) — текущие глобальные (последняя
      // известная ориентация). Дельта flipY обнуляется автоматически
      // (S.simFlipY=meta ⇒ XOR=0).
      S.simFlipX = flatMeta ? !!flatMeta.flipX : !!savedFX;
      S.simFlipY = flatMeta ? !!flatMeta.flipY : !!savedFY;
      usedFlipX = S.simFlipX; usedFlipY = S.simFlipY;
      usedFaceSide = flatMeta ? (flatMeta.faceSide || 'up') : (S.simFaceSide || 'up');
      prof = computeAccumulatedProfile({ bendIdx: firstBendIdx, progress: 0, animating: false });
    } else if (hasBends) {
      S.simBentMarkers = []; S.selectedBendIndex = 0;
      S.simAnimRunning = false; S.simAnimBendIdx = -1; S.simAnimProgress = 0;
      prof = computeAccumulatedProfile({ bendIdx: 0, progress: 0, animating: false });
    } else {
      const n = S.points.length;
      const flatPts = [];
      let xPos = 0;
      for (let i = 0; i < n; i++) {
        if (i === 0) flatPts.push({ x: 0, y: 0 });
        else { xPos += Math.hypot(S.points[i].x - S.points[i-1].x, S.points[i].y - S.points[i-1].y); flatPts.push({ x: xPos, y: 0 }); }
      }
      prof = { pts: flatPts, depth: 0, halfAngle: 0, interiorAngle: Math.PI, bendMarkers: [], bendAngles: {}, hemInfo: [], anchorV: 0, activeBendIdx: -1, bentCount: 0, totalBends: 0 };
    }
  } else if (sim3dStepIdx >= 0 && sim3dStepBends.length > 0) {
    // FIX («отскок»): состояние шага N = гибы 0..N-1 СОГНУТЫ + гиб N
    // анимируется. Раньше после завершения анимации согнутый гиб
    // НЕ входил в simBentMarkers → профиль «прыгал» обратно в плоский.
    // Теперь в покое показываем состояние ПОСЛЕ шага N: 0..N согнуты.
    // v5.9: фаза 'preview' — гиб N ещё НЕ согнут (1-й клик по шагу:
    // заготовка позиционирована у упора, видно расстояние до упора).
    const appliedCount = sim3dAnimRunning ? sim3dStepIdx
      : (sim3dStepPhase === 'preview' ? sim3dStepIdx : sim3dStepIdx + 1);
    S.simBentMarkers = sim3dStepBends.slice(0, Math.min(appliedCount, sim3dStepBends.length));
    S.selectedBendIndex = sim3dStepBends[sim3dStepIdx] !== undefined ? sim3dStepBends[sim3dStepIdx] : undefined;
    const stepBendIdx = sim3dStepBends[sim3dStepIdx];
    const stepMeta = (S.bendStepMeta || {})[stepBendIdx];
    // v4.5 FIX («первый шаг уже перевёрнут по X / разворот по Z на 180°»):
    // ориентация заготовки шага N берётся ИЗ ИСТОРИИ — bendStepMeta гиба
    // ЭТОГО шага (записана на момент гибки). Раньше ставились ТЕКУЩИЕ
    // глобальные simFlipX/simFlipY — финальный ↔X, нажатый ПОСЛЕ гиба,
    // применялся ко ВСЕМ шагам, включая первый. Нет meta (гиб не
    // выполнялся в 2D) — текущие глобальные (последняя известная
    // ориентация). Состояние ПОСЛЕ последнего шага («Полная» завершена,
    // stepIdx за пределами) — тоже текущие глобальные (= вид 2D сейчас).
    S.simFlipX = stepMeta ? !!stepMeta.flipX : !!savedFX;
    S.simFlipY = stepMeta ? !!stepMeta.flipY : !!savedFY;
    usedFlipX = S.simFlipX; usedFlipY = S.simFlipY;
    usedFaceSide = stepMeta ? (stepMeta.faceSide || 'up') : (S.simFaceSide || 'up');
    if (sim3dAnimRunning) {
      S.simAnimRunning = true; S.simAnimBendIdx = sim3dStepBends[sim3dStepIdx]; S.simAnimProgress = sim3dAnimProgress;
    } else { S.simAnimRunning = false; S.simAnimBendIdx = -1; S.simAnimProgress = 0; }
    let animInfo3d = getAnimInfo();
    if (animInfo3d) {
      animInfo3d._is3d = true; // flipY уже применён между гибами
      prof = computeAccumulatedProfile(animInfo3d);
    } else if (sim3dStepPhase === 'preview' && stepBendIdx !== undefined) {
      // v5.9: предпросмотр шага — позиция у упора ДО гибки (как в 2D
      // при выборе гиба): анкер по гибу шага, сам гиб не согнут,
      // предыдущие 0..N-1 согнуты. Пуансон в покое (не опускается).
      prof = computeAccumulatedProfile({ bendIdx: stepBendIdx, progress: 0, animating: false, _is3d: true });
    } else {
      // Нет анимации — пустой animInfo с меткой _is3d
      prof = computeAccumulatedProfile({ _is3d: true });
    }
  } else {
    prof = computeAccumulatedProfile(getAnimInfo());
    usedFlipX = !!S.simFlipX; usedFlipY = !!S.simFlipY;
  }
  // Восстанавливаем сохранённое состояние 2D-симуляции
  S.simBentMarkers = savedBent; S.selectedBendIndex = savedSel; S.simAnimRunning = savedAnimR; S.simAnimProgress = savedAnimP; S.simAnimBendIdx = savedAnimB; S.simFlipX = savedFX; S.simFlipY = savedFY;
  if (!prof || !prof.pts) return;
  // Гиб в начале координат — выровнен с пуансоном/матрицей (как в 2D).
  const cx = 0, cy = 0;
  const T = S.metal.thickness || 1;
  const W = S.metal.width || 100;
  const hw = W / 2;
  const die = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
  const punch = (typeof getPunchByIndex === 'function') ? getPunchByIndex(S.metal.punchIndex) : null;
  if (!sim3dUserZoomed) {
    // Автомасштаб по МИРОВЫМ координатам (не по проекциям — иначе zoom
    // пересчитывался от старого и получался feedback loop). Берём габариты
    // профиля + габариты матрицы/пуансона и подбираем zoom по сцене.
    let wMnX=Infinity, wMxX=-Infinity, wMnY=Infinity, wMxY=-Infinity;
    prof.pts.forEach(p => { if(p.x<wMnX)wMnX=p.x; if(p.x>wMxX)wMxX=p.x; if(p.y<wMnY)wMnY=p.y; if(p.y>wMxY)wMxY=p.y; });
    if (die) {
      let dH = die.height || 40;
      let dW = (die.swidth || (die.vWidth||10)*2) / 2;
      if (die.profile && die.profile.height) { dH = Math.max(dH, die.profile.height); }
      if (die.profile && die.profile.width) { dW = Math.max(dW, die.profile.width/2); }
      if (-dH < wMnY) wMnY = -dH;
      if (-dW < wMnX) wMnX = -dW;
      if (dW > wMxX) wMxX = dW;
    }
    if (punch) {
      let pH = punch.height || 50;
      let pW = (punch.swidth || 20) / 2;
      if (punch.profile && punch.profile.height) { pH = Math.max(pH, punch.profile.height); }
      if (punch.profile && punch.profile.width) { pW = Math.max(pW, punch.profile.width/2); }
      if (pH > wMxY) wMxY = pH;
      if (-pW < wMnX) wMnX = -pW;
      if (pW > wMxX) wMxX = pW;
    }
    const hwWorld = (S.metal.width || 100) / 2; // половина глубины (по Z)
    // Оценка габаритов проекции при текущих углах + запас
    const worldW = (wMxX - wMnX) || 1, worldH = (wMxY - wMnY) || 1, worldD = hwWorld * 2 || 1;
    const projW = worldW * 0.88 + worldD * 0.45 + (die ? 40 : 0) + (punch ? 30 : 0);
    const projH = worldH * 0.92 + worldD * 0.45 + 40;
    const pad = 100;
    sim3dZoom = Math.min((sim3dW - pad * 2) / (projW || 1), (sim3dH - pad * 2) / (projH || 1)) / 0.5;
  }
  const faces = [];
  const toolCx = 0, toolCy = 0; // инструменты статичны в начале координат
  // Панорамирование сцены (ПКМ / пинч) — FIX: применяется к проекции
  const panX = sim3dPanX, panY = sim3dPanY;
  // Пуансон: анимированное погружение (air bending) — вершина опускается
  // на SIM_PUNCH_TRAVEL (8 мм, v5.9) от позиции покоя до внутренней
  // поверхности дуги гиба (v5.0: радиус по таблице металла, касание
  // изнутри V-складки).
  let animInfoForPunch = null;
  if (sim3dAnimRunning && sim3dStepIdx >= 0) {
    animInfoForPunch = { animating: true, progress: sim3dAnimProgress, bendIdx: sim3dStepBends[sim3dStepIdx] };
  } else if (S.simAnimRunning && S.simAnimBendIdx >= 0) {
    // 2D-анимация идёт (живое зеркало) — пуансон следует за ней
    animInfoForPunch = { animating: true, progress: S.simAnimProgress, bendIdx: S.simAnimBendIdx };
  }
  const punchTipY = punchTipWorldY(animInfoForPunch);
  // v5.9: коллизия контура с телом пуансона на этом шаге — корпус
  // пуансона подсвечивается КРАСНЫМ (canvas- и WebGL-пути)
  const sim3dPunchCollision = (prof && prof.pts && typeof detectPunchCollision === 'function')
    ? detectPunchCollision(prof.pts, punchTipY)
    : null;

  // === МАТРИЦА (серо-синяя, V-ручей сверху) ===
  // Смещение: vCenter → 0 (ось гиба в начале координат), верх → y=0.
  if (die) {
    const dH = die.height || 40;
    const dOX = S.dieOffsetX || 0, dOY = S.dieOffsetY || 0;
    if (die.profile && die.profile.chains && die.profile.chains.length > 0) {
      // Кастомная матрица — DXF-контур как выдавленный профиль (по Z)
      const vCenter = (typeof findDieGrooveCenter === 'function') ? findDieGrooveCenter(die.profile) : 0;
      const offX = -vCenter + dOX;
      const offY = -(die.profile.minY + die.profile.height) + dOY;
      die.profile.chains.forEach(chain => {
        if (!chain || chain.length < 2) return;
        const front = chain.map(p => project3DSim(p.x + offX + toolCx, p.y + offY + toolCy, -hw, panX, panY));
        const back = chain.map(p => project3DSim(p.x + offX + toolCx, p.y + offY + toolCy, hw, panX, panY));
        // Торцевые крышки — показывают DXF-контур
        faces.push({ pts: front, z: Math.max.apply(null, front.map(p=>p.z)), fill: isDark?'#374151':'#4b5563', stroke: isDark?'#6b7280':'#374151' });
        faces.push({ pts: back, z: Math.max.apply(null, back.map(p=>p.z)), fill: isDark?'#1f2937':'#374151', stroke: isDark?'#374151':'#1f2937' });
        // Боковые грани (стенки контура)
        for (let i = 0; i < chain.length; i++) { const ni = (i+1)%chain.length;
          faces.push({ pts: [front[i],front[ni],back[ni],back[i]], z: Math.max(front[i].z,front[ni].z,back[ni].z,back[i].z), fill: isDark?'#1f2937':'#4b5563', stroke: isDark?'#6b7280':'#374151' }); }
      });
    } else {
      // Стандартная матрица — упрощённая V-образная геометрия
      const vW = die.vWidth || 10, sw = die.swidth || vW*2, halfV = vW/2, halfS = sw/2, vDepth = dH*0.5;
      const dieOutline = [
        {x:dOX-halfS,y:dOY},{x:dOX-halfV,y:dOY},{x:dOX,y:dOY-vDepth},{x:dOX+halfV,y:dOY},{x:dOX+halfS,y:dOY},
        {x:dOX+halfS,y:dOY-dH},{x:dOX-halfS,y:dOY-dH}
      ];
      const dieFront = dieOutline.map(p => project3DSim(p.x+toolCx, p.y+toolCy, -hw, panX, panY));
      const dieBack = dieOutline.map(p => project3DSim(p.x+toolCx, p.y+toolCy, hw, panX, panY));
      faces.push({ pts: dieFront, z: Math.max.apply(null, dieFront.map(p=>p.z)), fill: isDark?'#374151':'#4b5563', stroke: isDark?'#6b7280':'#374151' });
      faces.push({ pts: dieBack, z: Math.max.apply(null, dieBack.map(p=>p.z)), fill: isDark?'#1f2937':'#374151', stroke: isDark?'#374151':'#1f2937' });
      for (let i = 0; i < dieOutline.length; i++) { const ni = (i+1)%dieOutline.length;
        faces.push({ pts: [dieFront[i],dieFront[ni],dieBack[ni],dieBack[i]], z: Math.max(dieFront[i].z,dieFront[ni].z,dieBack[ni].z,dieBack[i].z), fill: isDark?'#1f2937':'#4b5563', stroke: isDark?'#6b7280':'#374151' }); }
      // Верхняя грань слева/справа от V-ручья + наклонные грани V-ручья
      const topL_front = [dieFront[0], dieFront[1], dieBack[1], dieBack[0]];
      faces.push({ pts: topL_front, z: Math.max.apply(null, topL_front.map(p=>p.z)), fill: isDark?'#4b5563':'#6b7280', stroke: isDark?'#6b7280':'#374151' });
      const topR_front = [dieFront[3], dieFront[4], dieBack[4], dieBack[3]];
      faces.push({ pts: topR_front, z: Math.max.apply(null, topR_front.map(p=>p.z)), fill: isDark?'#4b5563':'#6b7280', stroke: isDark?'#6b7280':'#374151' });
      const vLeft = [dieFront[1], dieFront[2], dieBack[2], dieBack[1]];
      faces.push({ pts: vLeft, z: Math.max.apply(null, vLeft.map(p=>p.z)), fill: isDark?'#1f2937':'#374151', stroke: isDark?'#374151':'#1f2937' });
      const vRight = [dieFront[2], dieFront[3], dieBack[3], dieBack[2]];
      faces.push({ pts: vRight, z: Math.max.apply(null, vRight.map(p=>p.z)), fill: isDark?'#1f2937':'#374151', stroke: isDark?'#374151':'#1f2937' });
    }
  }
  // === ПУАНСОН (серый, опускается при анимации; v5.9: КРАСНЫЙ при коллизии) ===
  // Смещение: центр по X → 0, вершина → punchTipY (анимация погружения).
  if (punch) {
    const pOX = S.punchOffsetX||0, pOY = S.punchOffsetY||0;
    // v5.9: цвета пуансона — красные, когда контур касается тела пуансона
    const punFillA = sim3dPunchCollision ? (isDark ? '#dc2626' : '#ef4444') : (isDark ? '#6b7280' : '#9ca3af');
    const punFillB = sim3dPunchCollision ? (isDark ? '#991b1b' : '#dc2626') : (isDark ? '#4b5563' : '#6b7280');
    const punStroke = sim3dPunchCollision ? '#ef4444' : (isDark ? '#9ca3af' : '#4b5563');
    if (punch.profile && punch.profile.chains && punch.profile.chains.length > 0) {
      // Пуансон с профилем — контур как выдавленный профиль (по Z).
      // v5.4: ось гиба — через вершину профиля (tipX)
      const offX = -punchProfileAxisX(punch.profile) + pOX;
      const offY = -punch.profile.minY + pOY + punchTipY;
      punch.profile.chains.forEach(chain => {
        if (!chain || chain.length < 2) return;
        const front = chain.map(p => project3DSim(p.x + offX + toolCx, p.y + offY + toolCy, -hw, panX, panY));
        const back = chain.map(p => project3DSim(p.x + offX + toolCx, p.y + offY + toolCy, hw, panX, panY));
        faces.push({ pts: front, z: Math.max.apply(null, front.map(p=>p.z)), fill: punFillA, stroke: punStroke });
        faces.push({ pts: back, z: Math.max.apply(null, back.map(p=>p.z)), fill: punFillB, stroke: punStroke });
        for (let i = 0; i < chain.length; i++) { const ni = (i+1)%chain.length;
          faces.push({ pts: [front[i],front[ni],back[ni],back[i]], z: Math.max(front[i].z,front[ni].z,back[ni].z,back[i].z), fill: punFillB, stroke: punStroke }); }
      });
    } else {
      // Стандартный пуансон — блок (низ = punchTipY, опускается при гибке)
      const pH = punch.height || 50;
      const pS = punch.swidth || 20, halfS = pS/2;
      const pBottomY = pOY + punchTipY, pTopY = pOY + punchTipY + pH;
      const pCorners = [
        {x:pOX-halfS,y:pBottomY,z:-hw},{x:pOX+halfS,y:pBottomY,z:-hw},{x:pOX+halfS,y:pTopY,z:-hw},{x:pOX-halfS,y:pTopY,z:-hw},
        {x:pOX-halfS,y:pBottomY,z:hw},{x:pOX+halfS,y:pBottomY,z:hw},{x:pOX+halfS,y:pTopY,z:hw},{x:pOX-halfS,y:pTopY,z:hw}
      ];
      const pp = pCorners.map(c => project3DSim(c.x+toolCx, c.y+toolCy, c.z, panX, panY));
      faces.push({ pts:[pp[0],pp[1],pp[2],pp[3]], z:Math.max(pp[0].z,pp[1].z,pp[2].z,pp[3].z), fill: punFillA, stroke: punStroke });
      faces.push({ pts:[pp[4],pp[5],pp[6],pp[7]], z:Math.max(pp[4].z,pp[5].z,pp[6].z,pp[7].z), fill: punFillB, stroke: punStroke });
      faces.push({ pts:[pp[0],pp[3],pp[7],pp[4]], z:Math.max(pp[0].z,pp[3].z,pp[7].z,pp[4].z), fill: punFillB, stroke: punStroke });
      faces.push({ pts:[pp[1],pp[2],pp[6],pp[5]], z:Math.max(pp[1].z,pp[2].z,pp[6].z,pp[5].z), fill: punFillB, stroke: punStroke });
      faces.push({ pts:[pp[0],pp[1],pp[5],pp[4]], z:Math.max(pp[0].z,pp[1].z,pp[5].z,pp[4].z), fill: punFillB, stroke: punStroke });
      faces.push({ pts:[pp[3],pp[2],pp[6],pp[7]], z:Math.max(pp[3].z,pp[2].z,pp[6].z,pp[7].z), fill: punFillA, stroke: punStroke });
    }
  }
  // === УПОР — v5.2: вычисление вынесено в compute3DStopperInfo
  // (мировые координаты + текст) — общий для canvas- и WebGL-рендера ===
  const stopperInfo = compute3DStopperInfo(prof);
  // === МЕТАЛЛ (серое тело, синяя лицевая сторона) ===
  // Чётность физического переворота для ЛИЦА должна совпадать с
  // ОТОБРАЖАЕМОЙ геометрией (v4.2): в режиме шагов геометрия содержит
  // только перевороты из bendStepMeta (дельта не применяется) → берём
  // чётность из meta гиба текущего шага; в «плоской»/живом режиме —
  // текущий S.simFlipY. Раньше лицо бралось от глобального S.simFlipY
  // и на исторических шагах рисовалось не с той стороны.
  let faceParity3d;
  if (sim3dStepIdx >= 0 && sim3dStepBends.length > 0 && sim3dStepIdx < sim3dStepBends.length) {
    faceParity3d = getBendStepFlipY(sim3dStepBends[sim3dStepIdx]);
  } else {
    // v4.5: для «Плоской» — тоже из meta, исторический (usedFlipY).
    faceParity3d = !!usedFlipY;
  }
  const faceSignSim = ((usedFaceSide||'up')==='up'?1:-1)
    * (usedFlipX?-1:1)
    * (faceParity3d ? -1 : 1);

  // v5.2: WebGL-ветка — сцена в three.js (перспективная камера, PBR-металл,
  // мягкие тени, сглаживание, ACES-тонмаппинг); оверлей (метка упора/HUD/
  // кнопки) рисуется на этом же 2D-канвасе поверх. Вся логика шагов,
  // анимации, упора, лицевой стороны — общая с canvas-путём.
  if (useThree && typeof renderThree3DSim === 'function') {
    const rendered3D = renderThree3DSim({
      prof: prof, T: T, hw: hw, die: die, punch: punch,
      punchTipY: punchTipY, faceSignSim: faceSignSim,
      stopperInfo: stopperInfo, isDark: isDark,
      usedFaceSide: usedFaceSide, usedFlipX: usedFlipX, usedFlipY: usedFlipY,
      // v5.9: коллизия контура с пуансоном — красный корпус в WebGL
      punchCollision: !!sim3dPunchCollision
    });
    if (rendered3D) {
      let stopperLabel3D = null;
      if (stopperInfo) {
        const scr = (typeof three3DProjectToScreen === 'function') ? three3DProjectToScreen(stopperInfo.labelWorld) : null;
        if (scr) stopperLabel3D = { x: scr.x, y: scr.y, text: stopperInfo.text };
      }
      draw3DSimOverlay(ctx, stopperLabel3D, usedFaceSide, usedFlipX, usedFlipY);
      return;
    }
    // three.js внезапно недоступен — продолжаем canvas-путём ниже
  }

  // === УПОР (canvas-путь): грани из мировых координат stopperInfo ===
  let stopperLabelInfo = null;
  if (stopperInfo) {
    const sc = [[stopperInfo.left, stopperInfo.bottom, -hw], [stopperInfo.right, stopperInfo.bottom, -hw], [stopperInfo.right, stopperInfo.top, -hw], [stopperInfo.left, stopperInfo.top, -hw],
      [stopperInfo.left, stopperInfo.bottom, hw], [stopperInfo.right, stopperInfo.bottom, hw], [stopperInfo.right, stopperInfo.top, hw], [stopperInfo.left, stopperInfo.top, hw]];
    const sp = sc.map(p => project3DSim(p[0] + toolCx, p[1] + toolCy, p[2], panX, panY));
    [[sp[0], sp[1], sp[2], sp[3]], [sp[4], sp[5], sp[6], sp[7]], [sp[0], sp[4], sp[7], sp[3]], [sp[1], sp[5], sp[6], sp[2]], [sp[0], sp[1], sp[5], sp[4]], [sp[3], sp[2], sp[6], sp[7]]].forEach(s =>
      faces.push({ pts: s, z: Math.max.apply(null, s.map(p => p.z)), fill: isDark ? '#6b7280' : '#9ca3af', stroke: isDark ? '#9ca3af' : '#4b5563' }));
    const labelC = project3DSim(stopperInfo.centerX + toolCx, stopperInfo.top + toolCy, 0, panX, panY);
    stopperLabelInfo = { x: labelC.x, y: labelC.y, text: stopperInfo.text };
  }
  for (let i = 0; i < prof.pts.length - 1; i++) {
    const dx = prof.pts[i+1].x - prof.pts[i].x, dy = prof.pts[i+1].y - prof.pts[i].y;
    const len = Math.hypot(dx, dy);
    const nx = len > 0 ? -dy/len*faceSignSim*(T/2) : 0;
    const ny = len > 0 ? dx/len*faceSignSim*(T/2) : 0;
    // v4.4 FIX («лицевая сторона залипает»): знак глубины нормали сегмента
    // относительно направления взгляда — ГРАДИЕНТ z2 по мировым осям
    // (из project3DSim): d(z2)/dx = sinY·cosX, d(z2)/dy = sinX. Для
    // горизонтальных полок достаточно знака rotX (старое поведение),
    // но для вертикальных/наклонных полок нужен учёт rotY — иначе синяя
    // грань «залипает» при обходе камеры. Грань видна ⇔ её нормаль
    // смотрит НА камеру (положительный градиент глубины = ближе).
    const nux = len > 0 ? -dy/len : 0, nuy = len > 0 ? dx/len : 0;
    const nDepth = nux*Math.sin(sim3dRotY)*Math.cos(sim3dRotX) + nuy*Math.sin(sim3dRotX);
    const fb = (faceSignSim * nDepth > 0) ? 1 : -1; // +1 = лицевая видна
    const metalFill = isDark ? '#6b7280' : '#9ca3af';
    const metalStroke = isDark ? '#9ca3af' : '#4b5563';
    const faceFill = isDark ? '#3b82f6' : '#60a5fa';
    const faceStroke = isDark ? '#60a5fa' : '#2563eb';
    // Точки основания = pts - смещение лицевой (обратная сторона)
    const p0 = project3DSim(prof.pts[i].x+cx-nx, prof.pts[i].y+cy-ny, -hw, panX, panY);
    const p1 = project3DSim(prof.pts[i].x+cx-nx, prof.pts[i].y+cy-ny, hw, panX, panY);
    const p2 = project3DSim(prof.pts[i+1].x+cx-nx, prof.pts[i+1].y+cy-ny, hw, panX, panY);
    const p3 = project3DSim(prof.pts[i+1].x+cx-nx, prof.pts[i+1].y+cy-ny, -hw, panX, panY);
    // Точки лицевой = pts + смещение
    const p0f = project3DSim(prof.pts[i].x+cx+nx, prof.pts[i].y+cy+ny, -hw, panX, panY);
    const p1f = project3DSim(prof.pts[i].x+cx+nx, prof.pts[i].y+cy+ny, hw, panX, panY);
    const p2f = project3DSim(prof.pts[i+1].x+cx+nx, prof.pts[i+1].y+cy+ny, hw, panX, panY);
    const p3f = project3DSim(prof.pts[i+1].x+cx+nx, prof.pts[i+1].y+cy+ny, -hw, panX, panY);
    // v5.6 FIX («у каймы нет одной плоскости», canvas-путь): на дуге/ноге
    // каймы вырождается грань со стороны ЦЕНТРА дуги (r − T/2 ≤ 0 —
    // «плавник» через ось заворота; нога — грань вплотную на грани
    // основы), а НЕ «лицевая» безусловно. До v5.6 лицевая пропускалась
    // всегда: при зеркальных конфигурациях (отражение накопленного
    // профиля, сторона каймы × лицевая сторона) пропускалась именно
    // ВАЛИДНАЯ внешняя грань — кайма была «полой». Сторона вырождения —
    // геометрически, по знаку поворота хорд (hemDegenerateSide):
    // лицевая грань слева по ходу ⇔ faceSignSim > 0.
    const hemArcSeg = !!(prof.pts[i]._hemArc || prof.pts[i+1]._hemArc);
    let hemSkipFront = false, hemSkipBack = false;
    if (hemArcSeg) {
      const degSide = (typeof hemDegenerateSide === 'function') ? hemDegenerateSide(prof.pts, i) : null;
      if (degSide) {
        hemSkipFront = (degSide === (faceSignSim > 0 ? 'left' : 'right'));
        hemSkipBack = !hemSkipFront;
      }
    }
    // Лицевая поверхность (синяя) — isFace для direction-aware сортировки
    if (!hemSkipFront) faces.push({ pts: [p0f,p1f,p2f,p3f], z: Math.max(p0f.z,p1f.z,p2f.z,p3f.z), fill: faceFill, stroke: faceStroke, isFace: true, fb: fb });
    // Обратная поверхность (серая) — isBack
    if (!hemSkipBack) faces.push({ pts: [p0,p1,p2,p3], z: Math.max(p0.z,p1.z,p2.z,p3.z), fill: isDark?'#4b5563':'#6b7280', stroke: metalStroke, isBack: true, fb: -fb });
    // Торцы (серые)
    faces.push({ pts: [p0,p1,p1f,p0f], z: Math.max(p0.z,p1.z,p1f.z,p0f.z), fill: metalFill, stroke: metalStroke });
    faces.push({ pts: [p3,p2,p2f,p3f], z: Math.max(p3.z,p2.z,p2f.z,p3f.z), fill: isDark?'#4b5563':'#6b7280', stroke: metalStroke });
  }
  // Сортировка по глубине (painter's algorithm): ВОЗРАСТАНИЕ z2.
  // z2 = -(depth), большая z2 = ближе к камере.
  // z-fighting для тонкого металла (v4.4): пара лицо/изнанка
  // упорядочивается по знаку глубины НОРМАЛИ (a.fb − b.fb) — грань видна
  // тогда и только тогда, когда её нормаль смотрит на камеру: переключение
  // при любом минимальном наклоне от плоскости сегмента (учёт rotX И rotY).
  const _simRotX = sim3dRotX;
  faces.sort((a,b) => {
    let as=0,bs=0; for(let k=0;k<a.pts.length;k++)as+=a.pts[k].z; for(let k=0;k<b.pts.length;k++)bs+=b.pts[k].z;
    const aAvg=as/a.pts.length, bAvg=bs/b.pts.length;
    const dz = Math.abs(aAvg - bAvg);
    if (dz < 4 && ((a.isFace && b.isBack) || (a.isBack && b.isFace))) {
      // v4.4: упорядочивание по знаку видимости грани (fb), а не только rotX
      if (typeof a.fb === 'number' && typeof b.fb === 'number' && a.fb !== b.fb) return a.fb - b.fb;
      if (_simRotX > 0) return a.isFace ? 1 : (a.isBack ? -1 : 0);
      else return a.isBack ? 1 : (a.isFace ? -1 : 0);
    }
    return aAvg - bAvg;
  });
  faces.forEach(f => { ctx.beginPath(); ctx.moveTo(f.pts[0].x,f.pts[0].y); for(let k=1;k<f.pts.length;k++)ctx.lineTo(f.pts[k].x,f.pts[k].y); ctx.closePath(); ctx.fillStyle=f.fill; ctx.fill(); ctx.strokeStyle=f.stroke; ctx.lineWidth=1; ctx.stroke(); });
  // v5.2: метка упора/HUD ориентации/кнопки шагов — общий оверлей
  // (canvas- и WebGL-путь), см. draw3DSimOverlay ниже.
  draw3DSimOverlay(ctx, stopperLabelInfo, usedFaceSide, usedFlipX, usedFlipY);
}

// v5.2: оверлей 3D-симуляции (метка упора, HUD ориентации, кнопки
// шагов, подсказка) — общий для canvas- и WebGL-рендера. Раньше был
// хвостом draw3DSimulation; вынесен, чтобы sim3dRenderView мог
// перерисовывать оверлей при движении камеры в WebGL-режиме без
// пересчёта профиля.
function draw3DSimOverlay(ctx, stopperLabelInfo, usedFaceSide, usedFlipX, usedFlipY) {
  const isDark = S.isDark;
  // Метка расстояния упора (поверх всех граней)
  if (stopperLabelInfo) {
    ctx.save();
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const tw = ctx.measureText(stopperLabelInfo.text).width;
    ctx.fillStyle = isDark ? 'rgba(26,26,46,0.88)' : 'rgba(255,255,255,0.88)';
    ctx.fillRect(stopperLabelInfo.x - tw / 2 - 3, stopperLabelInfo.y - 14, tw + 6, 14);
    ctx.fillStyle = isDark ? '#d1d5db' : '#4b5563';
    ctx.fillText(stopperLabelInfo.text, stopperLabelInfo.x, stopperLabelInfo.y - 2);
    ctx.restore();
  }
  // v5.9: бейдж фазы 'preview' — подсказка, что заготовка стоит у упора
  // (расстояние показано) и повторный клик по шагу выполнит гибку
  if (sim3dStepIdx >= 0 && sim3dStepIdx < sim3dStepBends.length &&
      sim3dStepPhase === 'preview' && !sim3dAnimRunning && typeof t === 'function') {
    ctx.save();
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const txt = t('sim3dPhasePreview');
    const tw2 = ctx.measureText(txt).width;
    const bx = 10, by = 26;
    ctx.fillStyle = 'rgba(13,148,136,0.92)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx, by, tw2 + 16, 20, 5); else ctx.rect(bx, by, tw2 + 16, 20);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText(txt, bx + 8, by + 4);
    ctx.restore();
  }
  // v4.8: HUD ОРИЕНТАЦИИ ЗАГОТОВКИ (правый верхний угол) — лицевая сторона
  // + развороты ↔/↕ текущего шага. Геометрия заготовки физически
  // переворачивается между шагами, но раньше это никак не подписывалось
  // («не вижу разворот по вертикали, даже если заготовка развернулась по Y»).
  // Источник — те же usedFlipX/usedFlipY/usedFaceSide, по которым построен
  // текущий кадр (исторические из bendStepMeta шага, как в чертеже).
  (function drawOrientationHUD() {
    if (!(S.unfoldResult && S.unfoldResult.bendInfos && S.unfoldResult.bendInfos.length > 0)) return;
    const lines = [];
    lines.push({ text: usedFaceSide === 'down' ? t('orientFaceDown') : t('orientFaceUp'), color: usedFaceSide === 'down' ? '#9333ea' : '#2563eb' });
    if (usedFlipX) lines.push({ text: '↔ ' + t('orientFlipH'), color: '#0d9488' });
    if (usedFlipY) lines.push({ text: '↕ ' + t('orientFlipV'), color: '#0d9488' });
    ctx.save();
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    let maxW = 0;
    lines.forEach(l => { maxW = Math.max(maxW, ctx.measureText(l.text).width); });
    const padX = 7, padY = 5, lineH = 13;
    const bx1 = sim3dW - 8, by = 8;               // правый край бокса
    const bw = maxW + padX * 2, bh = lines.length * lineH + padY * 2;
    ctx.fillStyle = isDark ? 'rgba(26,26,46,0.88)' : 'rgba(255,255,255,0.88)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx1 - bw, by, bw, bh, 5); else ctx.rect(bx1 - bw, by, bw, bh);
    ctx.fill();
    ctx.strokeStyle = isDark ? '#2a2a4a' : '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();
    lines.forEach((l, i) => {
      ctx.fillStyle = l.color;
      ctx.fillText(l.text, bx1 - padX, by + padY + i * lineH);
    });
    ctx.restore();
  })();
  // === КНОПКИ ШАГОВ ===
  // (v4.5: построение sim3dStepBends перенесено В НАЧАЛО draw3DSimulation —
  // здесь остаётся только отрисовка кнопок)
  sim3dStepBtnRects = [];
  const nBtns = sim3dStepBends.length + 3;
  // Кнопки шагов адаптируются к ширине канваса (планшет/телефон)
  const maxBtnW = 60, minBtnW = 38;
  const btnH = 26, btnGap = 4, extraW = 30;
  const availW = sim3dW - 20;
  const desiredW = Math.min(maxBtnW, (availW - (nBtns - 1) * btnGap - extraW) / nBtns);
  const btnW = Math.max(minBtnW, Math.floor(desiredW));
  const btnsTotalW = nBtns*btnW + (nBtns-1)*btnGap + extraW;
  const btnsX0 = Math.max(10, (sim3dW - btnsTotalW) / 2);
  const btnsY = sim3dH - btnH - 8;
  function drawStepBtn(x, y, w, h, label, isActive, stepIdx) {
    // v5.9: фаза 'preview' текущего шага — бирюзовая кнопка (позиция
    // у упора показана, гибка ещё не выполнялась); 'bent'/анимация — фиолетовая
    const isPreview = isActive && stepIdx === sim3dStepIdx && sim3dStepPhase === 'preview' && !sim3dAnimRunning;
    ctx.fillStyle = isPreview ? '#0d9488' : (isActive ? '#7c3aed' : (isDark ? '#374151' : '#e5e7eb'));
    ctx.strokeStyle = isPreview ? '#2dd4bf' : (isActive ? '#a855f7' : (isDark ? '#4b5563' : '#9ca3af'));
    ctx.lineWidth = 1.5; ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, 4); else ctx.rect(x, y, w, h);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = (isActive || isPreview) ? '#fff' : (isDark ? '#d1d5db' : '#374151');
    ctx.font = 'bold ' + (w < 48 ? 9 : 11) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, x+w/2, y+h/2);
    sim3dStepBtnRects.push({x, y, w, h, step: stepIdx});
  }
  const short = btnW < 48;
  drawStepBtn(btnsX0, btnsY, btnW, btnH, short ? '⏵' : '⏵ ' + t('sim3dFlat'), sim3dStepIdx===-1, -1);
  for (let si = 0; si < sim3dStepBends.length; si++) drawStepBtn(btnsX0+(si+1)*(btnW+btnGap), btnsY, btnW, btnH, short ? (''+(si+1)) : (t('sim3dStep') + ' ' + (si+1)), sim3dStepIdx===si, si);
  drawStepBtn(btnsX0+(sim3dStepBends.length+1)*(btnW+btnGap), btnsY, btnW, btnH, short ? '↺' : '↺ ' + t('sim3dReset'), false, -2);
  drawStepBtn(btnsX0+(sim3dStepBends.length+2)*(btnW+btnGap), btnsY, btnW+extraW, btnH, short ? '▶' : '▶ ' + t('sim3dFull'), false, -3);
  ctx.fillStyle = isDark?'#666':'#999'; ctx.font='10px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top';
  const hint = sim3dW < 500
    ? t('sim3dHintTouch')
    : t('sim3dHintMouse');
  ctx.fillText(hint, 10, 10);
}

// v5.2: перерисовка ТОЛЬКО вида (вращение/пан/зум) — в WebGL-режиме без
// пересчёта профиля: обновляется камера three.js + render + оверлей
// (метка упора проецируется через камеру, кнопки/HUD перерисовываются).
// В canvas-режиме — обычная полная отрисовка draw3DSimulation.
function sim3dRenderView() {
  if ((typeof three3DIsActive === 'function') && three3DIsActive() &&
      (typeof three3DRenderFrame === 'function') && three3DRenderFrame()) {
    const cv = document.getElementById('sim3d-canvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, sim3dW, sim3dH);
    // пустой профиль → полный кадр (сообщение «нарисуйте профиль»)
    if (!S.unfoldResult || S.points.length < 2) { draw3DSimulation(); return; }
    let stopperLabelInfo = null;
    const o = (typeof three3DGetOverlay === 'function') ? three3DGetOverlay() : null;
    if (o && o.labelWorld) {
      const scr = (typeof three3DProjectToScreen === 'function') ? three3DProjectToScreen(o.labelWorld) : null;
      if (scr) stopperLabelInfo = { x: scr.x, y: scr.y, text: o.labelText };
    }
    draw3DSimOverlay(ctx, stopperLabelInfo, o ? (o.faceSide || 'up') : 'up', !!(o && o.flipX), !!(o && o.flipY));
    return;
  }
  draw3DSimulation();
}

// ==================== АНИМАЦИЯ ШАГОВ ====================
let sim3dStepBends = [], sim3dStepIdx = -1, sim3dAnimProgress = 0, sim3dAnimRunning = false, sim3dAnimStartT = 0, sim3dAnimRAF = null;
// v5.9: фаза текущего шага — цикл как в 2D-симуляции:
// 'preview' — заготовка позиционирована у упора, расстояние показано,
//             гибка НЕ выполняется (1-й клик по шагу);
// 'bent'    — гиб шага согнут (после анимации гибки).
// Повторный клик по шагу: preview → гибка, bent → разгибание.
let sim3dStepPhase = 'bent';
// Направление анимации шага: +1 гибка, −1 разгибание
let sim3dAnimDir = 1;
let sim3dStepBtnRects = [];
let sim3dPanX = 0, sim3dPanY = 0, isPanning3DSim = false, sim3dPanStart = null;
let sim3dFullSimRunning = false, sim3dFullSimStep = 0, sim3dFullSimTimer = null;
// v4.4: подпись профиля, на которой построены шаги 3D (сверяется при
// открытии модалки и при каждой отрисовке — смена профиля ⇒ сброс шагов)
let sim3dProfileSig = null;

// v4.4: сброс шагов 3D-симуляции для нового профиля (вызывается также
// из state.js resetSimulationState — «Очистить»/пресеты/правка точек).
function sim3dResetForNewProfile() {
  sim3dStepBends = [];
  sim3dStepIdx = -1;
  sim3dAnimProgress = 0;
  sim3dAnimRunning = false;
  sim3dStepPhase = 'bent';
  sim3dFullSimRunning = false;
  sim3dFullSimStep = 0;
  if (sim3dFullSimTimer) { clearTimeout(sim3dFullSimTimer); sim3dFullSimTimer = null; }
  if (sim3dAnimRAF) cancelAnimationFrame(sim3dAnimRAF);
  sim3dAnimRAF = null;
}

// v4.4/v4.5: пресеты видов «слева»/«справа» — боковые виды С КОНЦОВ ЛИНИИ
// ГИБА (ось Z, ширина листа): «Вид слева» — камера с +Z (сечение профиля
// как на 2D-чертеже: X вправо, Y вверх); «Вид справа» — с −Z (зеркально).
// (v4.4 сначала ставила камеру на концах оси X — это взгляды «спереди/
// сзади» для оператора; v4.5 исправила на настоящие боковые плоскости.)
// Небольшой подъём камеры (rotX) сохранён, панорама/зум сбрасываются.
function sim3dSetView(view) {
  if (view === 'left') sim3dRotY = 0;          // камера с +Z
  else if (view === 'right') sim3dRotY = Math.PI; // камера с −Z
  else return;
  sim3dRotX = 0.35;
  sim3dPanX = 0; sim3dPanY = 0;
  sim3dUserZoomed = false;
  if (typeof draw3DSimulation === 'function') draw3DSimulation();
}

function sim3dStartStepAnim(stepIdx) {
  if (stepIdx < 0 || stepIdx >= sim3dStepBends.length) return;
  sim3dStepIdx = stepIdx; sim3dAnimProgress = 0; sim3dAnimRunning = true; sim3dAnimStartT = performance.now();
  sim3dAnimDir = 1;          // гибка
  sim3dStepPhase = 'bent';   // после анимации — гиб согнут
  if (sim3dAnimRAF) cancelAnimationFrame(sim3dAnimRAF);
  // НЕ модифицируем глобальные S.simFlipX/simFlipY здесь — draw3DSimulation
  // временно ставит их и восстанавливает после отрисовки.
  sim3dAnimTick();
}

// v5.9: разгибание текущего шага (3-й клик по кнопке шага — как в 2D).
// Анимация прогресса 1 → 0, по завершении — фаза 'preview'
// (заготовка снова у упора, видно расстояние до упора).
function sim3dStartUnbendAnim() {
  if (sim3dStepIdx < 0 || sim3dStepIdx >= sim3dStepBends.length) return;
  sim3dAnimDir = -1;         // разгибание
  sim3dAnimProgress = 1;
  sim3dAnimRunning = true;
  sim3dAnimStartT = performance.now();
  if (sim3dAnimRAF) cancelAnimationFrame(sim3dAnimRAF);
  sim3dAnimTick();
}

// v5.9: клик по кнопке шага — трёхстадийный цикл как в 2D-симуляции:
// 1-й клик — предпросмотр позиции у упора (расстояние до упора, без гибки);
// 2-й клик (или клик по уже выбранному шагу в фазе preview) — гибка;
// 3-й клик по согнутому шагу — разгибание обратно в предпросмотр.
function sim3dStepClick(stepIdx) {
  sim3dStopAnim();
  sim3dFullSimRunning = false;
  if (sim3dFullSimTimer) { clearTimeout(sim3dFullSimTimer); sim3dFullSimTimer = null; }
  if (sim3dStepIdx === stepIdx && sim3dStepBends.length > 0) {
    // Повторный клик по ТЕКУЩЕМУ шагу: bent → разогнуть, preview → согнуть
    if (sim3dStepPhase === 'bent') { sim3dStartUnbendAnim(); return; }
    sim3dStartStepAnim(stepIdx);
    return;
  }
  // Первый клик по шагу — предпросмотр позиции у упора (без гибки)
  sim3dStepIdx = stepIdx;
  sim3dStepPhase = 'preview';
  sim3dAnimProgress = 0;
  draw3DSimulation();
}

function sim3dAnimTick() {
  if (!sim3dAnimRunning) return;
  const elapsed = performance.now() - sim3dAnimStartT;
  // Длительность шага 1800мс — комфортный темп
  const raw = Math.max(0, Math.min(1, elapsed / 1800));
  sim3dAnimProgress = (sim3dAnimDir === -1) ? (1 - raw) : raw;
  draw3DSimulation();
  if (raw >= 1) {
    // Шаг завершён: гибка → состояние ПОСЛЕ шага (фаза 'bent'),
    // разгибание → возврат в предпросмотр (фаза 'preview')
    sim3dAnimRunning = false;
    sim3dAnimProgress = 0;
    if (sim3dAnimDir === -1) sim3dStepPhase = 'preview';
    draw3DSimulation();
  }
  else sim3dAnimRAF = requestAnimationFrame(sim3dAnimTick);
}
function sim3dStopAnim() { sim3dAnimRunning = false; if (sim3dAnimRAF) cancelAnimationFrame(sim3dAnimRAF); sim3dAnimRAF = null; }
function sim3dStartFullSim() {
  if (sim3dStepBends.length === 0) return;
  sim3dFullSimRunning = true; sim3dFullSimStep = 0; sim3dStepIdx = -1;
  if (sim3dFullSimTimer) { clearTimeout(sim3dFullSimTimer); sim3dFullSimTimer = null; }
  sim3dFullSimNextStep();
}
function sim3dFullSimNextStep() {
  if (!sim3dFullSimRunning) return;
  if (sim3dFullSimStep >= sim3dStepBends.length) { sim3dFullSimRunning = false; sim3dStepIdx = sim3dStepBends.length; sim3dStepPhase = 'bent'; draw3DSimulation(); return; }
  const step = sim3dFullSimStep;
  // v5.9: стадия 1 — предпросмотр позиции у упора (расстояние, без гибки)
  sim3dStepIdx = step; sim3dStepPhase = 'preview'; sim3dAnimProgress = 0;
  draw3DSimulation();
  // стадия 2 — через паузу гибка (1800мс) + пауза 700мс ≈ 3.4с на шаг
  sim3dFullSimTimer = setTimeout(function () {
    sim3dFullSimTimer = null;
    if (!sim3dFullSimRunning) return;
    sim3dStartStepAnim(step);
    sim3dFullSimTimer = setTimeout(function () {
      sim3dFullSimTimer = null;
      sim3dFullSimStep++;
      sim3dFullSimNextStep();
    }, 1800 + 700);
  }, 900);
}

// ==================== СОБЫТИЯ 3D-СИМУЛЯЦИИ ====================
let sim3dEventsSetup = false;
function setup3DSimEvents() {
  if (sim3dEventsSetup) return;
  sim3dEventsSetup = true;
  const cv = document.getElementById('sim3d-canvas');
  if (!cv) return;
  cv.addEventListener('mousedown', e => {
    if (e.button === 0 && sim3dStepBtnRects.length > 0) {
      const r = cv.getBoundingClientRect(); const mx = e.clientX-r.left, my = e.clientY-r.top;
      for (const btn of sim3dStepBtnRects) {
        if (mx >= btn.x && mx <= btn.x+btn.w && my >= btn.y && my <= btn.y+btn.h) {
          sim3dStopAnim(); sim3dFullSimRunning = false;
          if (btn.step === -2) { sim3dStepIdx = -1; sim3dStepPhase = 'bent'; sim3dStepBends = []; draw3DSimulation(); }
          else if (btn.step === -3) sim3dStartFullSim();
          else if (btn.step === -1) { sim3dStepIdx = -1; sim3dStepPhase = 'bent'; sim3dStopAnim(); draw3DSimulation(); }
          else sim3dStepClick(btn.step);
          return;
        }
      }
    }
    if (e.button === 2) { e.preventDefault(); isPanning3DSim = true; sim3dPanStart = { x:e.clientX, y:e.clientY, panX:sim3dPanX, panY:sim3dPanY }; cv.style.cursor = 'move'; }
    else if (e.button === 0) { isDragging3DSim = true; sim3dDragStart = { x:e.clientX, y:e.clientY, rotY:sim3dRotY, rotX:sim3dRotX }; cv.style.cursor = 'grabbing'; }
  });
  cv.addEventListener('contextmenu', e => e.preventDefault());
  window.addEventListener('mouseup', () => { if (isPanning3DSim) { isPanning3DSim = false; cv.style.cursor = 'grab'; } if (isDragging3DSim) { isDragging3DSim = false; cv.style.cursor = 'grab'; } });
  window.addEventListener('mousemove', e => {
    if (isPanning3DSim && sim3dPanStart) { sim3dPanX = sim3dPanStart.panX + (e.clientX-sim3dPanStart.x); sim3dPanY = sim3dPanStart.panY + (e.clientY-sim3dPanStart.y); sim3dRenderView(); }
    else if (isDragging3DSim && sim3dDragStart) { sim3dRotY = sim3dDragStart.rotY + (e.clientX-sim3dDragStart.x)*0.01; sim3dRotX = Math.max(-Math.PI/2+0.1, Math.min(Math.PI/2-0.1, sim3dDragStart.rotX + (e.clientY-sim3dDragStart.y)*0.01)); sim3dRenderView(); }
  });
  cv.addEventListener('wheel', e => { e.preventDefault(); const f = e.deltaY < 0 ? 1.15 : 1/1.15; sim3dZoom = Math.max(0.1, Math.min(10, sim3dZoom*f)); sim3dUserZoomed = true; sim3dRenderView(); }, { passive: false });
  cv.style.cursor = 'grab';
  // === TOUCH SUPPORT (планшеты/телефоны) ===
  let touchDragStart = null, pinchStart = null;
  cv.addEventListener('touchstart', e => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const t = e.touches[0];
      if (sim3dStepBtnRects.length > 0) {
        const r = cv.getBoundingClientRect(); const mx = t.clientX-r.left, my = t.clientY-r.top;
        for (const btn of sim3dStepBtnRects) {
          if (mx >= btn.x && mx <= btn.x+btn.w && my >= btn.y && my <= btn.y+btn.h) {
            sim3dStopAnim(); sim3dFullSimRunning = false;
            if (btn.step === -2) { sim3dStepIdx = -1; sim3dStepPhase = 'bent'; sim3dStepBends = []; draw3DSimulation(); }
            else if (btn.step === -3) sim3dStartFullSim();
            else if (btn.step === -1) { sim3dStepIdx = -1; sim3dStepPhase = 'bent'; sim3dStopAnim(); draw3DSimulation(); }
            else sim3dStepClick(btn.step);
            return;
          }
        }
      }
      touchDragStart = { x: t.clientX, y: t.clientY, rotY: sim3dRotY, rotX: sim3dRotX };
    } else if (e.touches.length === 2) {
      touchDragStart = null;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStart = { dist: Math.hypot(dx, dy), zoom: sim3dZoom, cx: (e.touches[0].clientX+e.touches[1].clientX)/2, cy: (e.touches[0].clientY+e.touches[1].clientY)/2, panX: sim3dPanX, panY: sim3dPanY };
    }
  }, { passive: false });
  cv.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length === 1 && touchDragStart) {
      const t = e.touches[0];
      sim3dRotY = touchDragStart.rotY + (t.clientX - touchDragStart.x) * 0.01;
      sim3dRotX = Math.max(-Math.PI/2+0.1, Math.min(Math.PI/2-0.1, touchDragStart.rotX + (t.clientY - touchDragStart.y) * 0.01));
      sim3dRenderView();
    } else if (e.touches.length === 2 && pinchStart) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (pinchStart.dist > 0) {
        const f = dist / pinchStart.dist;
        sim3dZoom = Math.max(0.1, Math.min(10, pinchStart.zoom * f));
        sim3dUserZoomed = true;
      }
      const cxNow = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const cyNow = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      sim3dPanX = pinchStart.panX + (cxNow - pinchStart.cx);
      sim3dPanY = pinchStart.panY + (cyNow - pinchStart.cy);
      sim3dRenderView();
    }
  }, { passive: false });
  cv.addEventListener('touchend', e => {
    if (e.touches.length === 0) { touchDragStart = null; pinchStart = null; }
    else if (e.touches.length === 1) { pinchStart = null; touchDragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, rotY: sim3dRotY, rotX: sim3dRotX }; }
  }, { passive: false });
}

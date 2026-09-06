// ═══════════════════════════════════════════════════════════════
// UI / Y-CALC — доступ к эмпирической базе Y калькулятора гибов
// (y-calculator.html; общий localStorage-ключ 'bendYCalculator_v1',
// тот же origin). Позволяет основному приложению — не открывая
// калькулятор — получить рекомендованное положение Y на станке для
// нужного угла гиба по РЕАЛЬНЫМ испытаниям оператора.
//
// Логика — точный порт calculate()/similarity()/yForTarget() из
// y-calculator.html (v5.0): кандидаты по схожести > 0.05, взвешенный
// скор 0.65·sim + 0.35·angleWeight, топ-30, кривая «Y → фактический
// угол» по испытаниям с тем же углом либо взвешенная регрессия
// angle = a + b·Y с обращением, калибровочная поправка станка,
// уровни доверия. Все функции защитные — не бросают исключений.
// ═══════════════════════════════════════════════════════════════

// Загрузка базы калькулятора из localStorage.
// Возвращает {machines:[], tests:[]} или null (нет базы / битый JSON).
function loadBendYDB() {
  try {
    const x = JSON.parse(localStorage.getItem('bendYCalculator_v1'));
    if (x && Array.isArray(x.machines) && Array.isArray(x.tests)) return x;
  } catch (e) { /* битый JSON — считаем, что базы нет */ }
  return null;
}

// Id первого станка базы (станок по умолчанию) или null.
function bendYDefaultMachineId() {
  const db = loadBendYDB();
  return (db && db.machines.length && db.machines[0] && db.machines[0].id) ? db.machines[0].id : null;
}

// Схожесть испытания t с параметрами запроса p — точный порт
// similarity() из y-calculator.html: станок обязан совпадать точно,
// материал — совпадение без учёта регистра обязательно (иначе 0);
// далее взвешенные оценки толщины (25), волокон (15), V (15), длины (10).
function yCalcSimilarity(t, p) {
  try {
    if (!t || !p) return 0;
    if (t.machine !== p.machine) return 0;
    let score = 0, total = 0;
    // Материал: точное/близкое совпадение обязательно.
    if (String(t.material || '').toLowerCase() === String(p.material || '').toLowerCase()) { score += 25; }
    else return 0;
    total += 25;
    const td = Math.abs(t.thickness - p.thickness);
    score += Math.max(0, 25 * (1 - Math.min(td / Math.max(p.thickness, 0.1), 1))); total += 25;
    if (t.grain === p.grain) score += 15; else if (t.grain === 'unknown' || p.grain === 'unknown') score += 6; total += 15;
    const vd = Math.abs(t.v - p.v) / Math.max(p.v, 1);
    score += Math.max(0, 15 * (1 - Math.min(vd, 1))); total += 15;
    const ld = Math.abs(t.length - p.length) / Math.max(p.length, 1);
    score += Math.max(0, 10 * (1 - Math.min(ld, 1))); total += 10;
    return score / total;
  } catch (e) { return 0; }
}

// Y для требуемого угла по облаку точек {y, angle} — точный порт
// yForTarget() из y-calculator.html: группировка почти равных углов
// (<0.05°) со средним Y, линейная интерполяция между соседними
// группами, при выходе за диапазон — осторожная экстраполяция по
// двум ближайшим точкам. Возвращает {y, mode} (mode: single /
// interpolation / extrapolation; при пустых данных — NaN).
function yCalcYForTarget(points, target) {
  try {
    const pts = points.slice().sort((a, b) => a.angle - b.angle);
    // Схлопываем почти одинаковые углы — усредняем Y.
    const groups = [];
    pts.forEach(p => {
      let g = groups.find(x => Math.abs(x.angle - p.angle) < 0.05);
      if (!g) groups.push({ angle: p.angle, ys: [p.y] });
      else g.ys.push(p.y);
    });
    groups.forEach(g => g.y = g.ys.reduce((a, b) => a + b, 0) / g.ys.length);
    if (groups.length === 1) return { y: groups[0].y, mode: 'single' };
    if (groups.length < 2) return { y: NaN, mode: 'none' };
    for (let i = 0; i < groups.length - 1; i++) {
      const a = groups[i], b = groups[i + 1];
      if ((target >= a.angle && target <= b.angle) || (target >= b.angle && target <= a.angle)) {
        if (Math.abs(b.angle - a.angle) < 0.001) return { y: (a.y + b.y) / 2, mode: 'interpolation' };
        return { y: a.y + (target - a.angle) * (b.y - a.y) / (b.angle - a.angle), mode: 'interpolation' };
      }
    }
    // Линейная экстраполяция по двум ближайшим точкам.
    let pair;
    if (target < groups[0].angle) pair = [groups[0], groups[1]];
    else pair = [groups[groups.length - 2], groups[groups.length - 1]];
    const a = pair[0], b = pair[1];
    if (Math.abs(b.angle - a.angle) < 0.001) return { y: b.y, mode: 'extrapolation' };
    return { y: a.y + (target - a.angle) * (b.y - a.y) / (b.angle - a.angle), mode: 'extrapolation' };
  } catch (e) { return { y: NaN, mode: 'none' }; }
}

// Рекомендация положения Y для гиба — точный порт ядра calculate()
// из y-calculator.html (без DOM: результат возвращается объектом).
// p = { machine, material, thickness, grain, v, length, angle(°) }.
// Возвращает { y, finalY, method, confidence, usedTests, exactCount,
// nearest } или null (нет станка/базы/подходящих испытаний/устойчивой
// зависимости).
function recommendBendY(p) {
  try {
    if (!p || !p.machine) return null;
    const db = loadBendYDB();
    if (!db || !db.tests.length) return null;
    // Кандидаты: схожесть с запросом > 0.05 (как в calculate()).
    const candidates = db.tests.map(t => Object.assign({}, t, { sim: yCalcSimilarity(t, p) })).filter(t => t.sim > 0.05);
    if (!candidates.length) return null;
    // Взвешенный скор: близость параметров + близость требуемого угла.
    const scored = candidates.map(t => {
      const angleDist = Math.abs(t.target - p.angle);
      const angleWeight = 1 / (1 + angleDist / 15);
      return Object.assign({}, t, { weight: t.sim * 0.65 + angleWeight * 0.35 });
    }).sort((a, b) => b.weight - a.weight);
    const selected = scored.slice(0, 30);
    let estimate = null, method = '';
    // 1) Есть >= 2 испытания с тем же требуемым углом → их кривая
    //    «Y → фактический угол».
    const exactTarget = selected.filter(t => Math.abs(t.target - p.angle) <= 0.25);
    if (exactTarget.length >= 2) {
      const r = yCalcYForTarget(exactTarget.map(t => ({ y: t.y, angle: t.actual })), p.angle);
      estimate = r.y; method = 'по испытаниям с тем же углом';
    } else {
      // 2) Взвешенная локальная регрессия angle = a + b·Y, затем
      //    обращение: Y = my + (angle − ma)/b.
      const usable = selected.filter(t => Number.isFinite(t.actual) && Number.isFinite(t.y));
      if (usable.length >= 2) {
        const wsum = usable.reduce((s, t) => s + t.weight, 0);
        const my = usable.reduce((s, t) => s + t.weight * t.y, 0) / wsum;
        const ma = usable.reduce((s, t) => s + t.weight * t.actual, 0) / wsum;
        let cov = 0, varY = 0;
        usable.forEach(t => { cov += t.weight * (t.y - my) * (t.actual - ma); varY += t.weight * (t.y - my) * (t.y - my); });
        const b = varY > 1e-9 ? cov / varY : 0;
        if (Math.abs(b) < 0.01) {
          // Зависимость слишком пологая — интерполяция/экстраполяция
          // по точкам напрямую.
          const r = yCalcYForTarget(usable.map(t => ({ y: t.y, angle: t.actual })), p.angle);
          estimate = r.y; method = r.mode === 'extrapolation' ? 'экстраполяция' : 'интерполяция';
        } else {
          estimate = my + (p.angle - ma) / b;
          const minY = Math.min.apply(null, usable.map(t => t.y)), maxY = Math.max.apply(null, usable.map(t => t.y));
          method = (estimate < minY || estimate > maxY) ? 'линейная экстраполяция' : 'линейная интерполяция';
        }
      }
    }
    if (!Number.isFinite(estimate)) return null;
    // Калибровочная поправка выбранного станка.
    const machine = db.machines.find(m => m.id === p.machine);
    const correction = (machine && machine.correction) || 0;
    const finalY = estimate + correction;
    // Доверие: точные попадания по параметрам + средний вес выбранных
    // испытаний (avgSim по t.weight — как в калькуляторе); экстраполяция
    // понижает уровень (последовательные if — поведение калькулятора).
    const avgSim = selected.reduce((s, t) => s + t.weight, 0) / selected.length;
    const exact = selected.filter(t => t.sim >= 0.92).length;
    let confidence = 'low';
    if (exact >= 4 && avgSim >= 0.82) confidence = 'high';
    else if (exact >= 2 && avgSim >= 0.62) confidence = 'medium';
    const extrap = method.indexOf('экстраполя') !== -1;
    if (extrap && confidence === 'high') confidence = 'medium';
    if (extrap && confidence === 'medium') confidence = 'low';
    return {
      y: estimate,
      finalY: finalY,
      method: method,
      confidence: confidence,
      usedTests: selected.length,
      exactCount: exact,
      nearest: selected.slice(0, 3)
    };
  } catch (e) { return null; }
}

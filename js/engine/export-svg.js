// ═══════════════════════════════════════════════════════════════
// ENGINE / ЭКСПОРТ SVG — плоская развёртка с размерами
// FIX: элементы каймы (hem) больше не рисуются как гибы («NaN°»)
// ═══════════════════════════════════════════════════════════════

function generateSVG(res, br, kf, th, mtName) {
  const L = res.totalLength, W = res.width;
  const pad = 10;
  const svgW = L + pad * 2 + 80, svgH = W + pad * 2 + 50;
  let s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + svgW + '" height="' + svgH + '" viewBox="0 0 ' + svgW + ' ' + svgH + '">';
  s += '<rect x="' + pad + '" y="' + pad + '" width="' + L + '" height="' + W + '" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>';

  res.elements.forEach(el => {
    if (el.type === 'straight') {
      s += '<rect x="' + (pad + el.startX) + '" y="' + pad + '" width="' + (el.endX - el.startX) + '" height="' + W + '" fill="#dcfce7" stroke="#16a34a33" stroke-width="0.5"/>';
      if (el.length > 5) {
        const mx = (el.startX + el.endX) / 2;
        s += '<text x="' + (pad + mx) + '" y="' + (pad + W / 2) + '" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="bold" fill="#15803d">' + el.length.toFixed(1) + '</text>';
      }
    } else if (el.type === 'hem') {
      // Кайма — синий пунктир (как на холсте развёртки)
      s += '<rect x="' + (pad + el.startX) + '" y="' + pad + '" width="' + (el.endX - el.startX) + '" height="' + W + '" fill="#bfdbfe" stroke="#2563eb" stroke-width="1" stroke-dasharray="2 2"/>';
      const mx = (el.startX + el.endX) / 2;
      s += '<text x="' + (pad + mx) + '" y="' + (pad + W / 2) + '" text-anchor="middle" dominant-baseline="central" font-size="9" fill="#1d4ed8">' + el.length.toFixed(1) + '</text>';
    } else {
      // Гиб
      s += '<rect x="' + (pad + el.startX) + '" y="' + pad + '" width="' + (el.endX - el.startX) + '" height="' + W + '" fill="#fed7aa" stroke="#ea580c33" stroke-width="0.5"/>';
      const mx = (el.startX + el.endX) / 2;
      s += '<text x="' + (pad + mx) + '" y="' + (pad + W / 2) + '" text-anchor="middle" dominant-baseline="central" font-size="9" fill="#c2410c">' + (el.angle * 180 / Math.PI).toFixed(0) + '°</text>';
    }
  });

  res.bendLinePositions.forEach((x, i) => {
    s += '<line x1="' + (pad + x) + '" y1="' + pad + '" x2="' + (pad + x) + '" y2="' + (pad + W) + '" stroke="#ea580c" stroke-width="1.5" stroke-dasharray="4 3"/>';
    s += '<circle cx="' + (pad + x) + '" cy="' + (pad + 20) + '" r="8" fill="#f97316" stroke="#fff" stroke-width="1.5"/>';
    s += '<text x="' + (pad + x) + '" y="' + (pad + 20) + '" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="bold" fill="#fff">' + (i + 1) + '</text>';
  });

  const dy = pad + W + 15;
  s += '<line x1="' + pad + '" y1="' + dy + '" x2="' + (pad + L) + '" y2="' + dy + '" stroke="#737373" stroke-width="0.8"/>';
  s += '<line x1="' + pad + '" y1="' + (dy - 4) + '" x2="' + pad + '" y2="' + (dy + 4) + '" stroke="#737373" stroke-width="0.8"/>';
  s += '<line x1="' + (pad + L) + '" y1="' + (dy - 4) + '" x2="' + (pad + L) + '" y2="' + (dy + 4) + '" stroke="#737373" stroke-width="0.8"/>';
  s += '<text x="' + (pad + L / 2) + '" y="' + (dy + 14) + '" text-anchor="middle" font-size="10" font-family="monospace" fill="#525252">' + L.toFixed(1) + ' mm</text>';
  s += '<text x="' + pad + '" y="' + (dy + 30) + '" font-size="8" fill="#a3a3a3">Metal: ' + mtName + ' | T: ' + th + ' mm | K: ' + kf + ' | R: ' + br + ' mm</text>';
  return s + '</svg>';
}

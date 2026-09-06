// ═══════════════════════════════════════════════════════════════
// ENGINE / ЭКСПОРТ DXF (R12 / AC1009 — максимальная совместимость)
// Учитывает настройки слоёв из диалога экспорта (S.dxfOpts.layers)
// ═══════════════════════════════════════════════════════════════

function generateDXF(res, br, kf, th, mtName, opts) {
  const L = res.totalLength, W = res.width;
  const layers = (opts && opts.layers) || { outline: true, bend: true };

  function n(v) {
    return parseFloat(Number(v).toFixed(6)).toString();
  }

  const dxf = [];

  // ══ HEADER ══
  dxf.push('0', 'SECTION', '2', 'HEADER');
  dxf.push('9', '$ACADVER', '1', 'AC1009');
  dxf.push('9', '$INSUNITS', '70', '4');
  dxf.push('9', '$HANDSEED', '5', 'FFFF');
  dxf.push('0', 'ENDSEC');

  // ══ TABLES ══
  dxf.push('0', 'SECTION', '2', 'TABLES');

  // LTYPE
  dxf.push('0', 'TABLE', '2', 'LTYPE', '70', '2');
  dxf.push('0', 'LTYPE', '2', 'CONTINUOUS', '70', '0', '3', 'Solid line', '72', '65', '73', '0', '40', '0');
  dxf.push('0', 'LTYPE', '2', 'DASHED', '70', '0', '3', 'Dashed line __ __ __ __ __ __ __ __ __ __', '72', '65', '73', '0', '40', '5');
  dxf.push('0', 'ENDTAB');

  // LAYER
  dxf.push('0', 'TABLE', '2', 'LAYER', '70', '2');
  dxf.push('0', 'LAYER', '2', 'OUTLINE', '70', '0', '62', '7', '6', 'CONTINUOUS');
  dxf.push('0', 'LAYER', '2', 'BEND', '70', '0', '62', '1', '6', 'DASHED');
  dxf.push('0', 'ENDTAB');

  // STYLE
  dxf.push('0', 'TABLE', '2', 'STYLE', '70', '1');
  dxf.push('0', 'STYLE', '2', 'STANDARD', '70', '0', '40', '0', '41', '1', '50', '0', '71', '0', '42', '5', '3', 'txt', '4', '');
  dxf.push('0', 'ENDTAB');

  dxf.push('0', 'ENDSEC');

  // ══ ENTITIES ══
  dxf.push('0', 'SECTION', '2', 'ENTITIES');

  // Контур заготовки (OUTLINE)
  if (layers.outline !== false) {
    dxf.push(
      '0', 'LINE', '8', 'OUTLINE',
      '10', n(0), '20', n(0), '30', '0',
      '11', n(L), '21', n(0), '31', '0'
    );
    dxf.push(
      '0', 'LINE', '8', 'OUTLINE',
      '10', n(L), '20', n(0), '30', '0',
      '11', n(L), '21', n(W), '31', '0'
    );
    dxf.push(
      '0', 'LINE', '8', 'OUTLINE',
      '10', n(L), '20', n(W), '30', '0',
      '11', n(0), '21', n(W), '31', '0'
    );
    dxf.push(
      '0', 'LINE', '8', 'OUTLINE',
      '10', n(0), '20', n(W), '30', '0',
      '11', n(0), '21', n(0), '31', '0'
    );
  }

  // Линии гиба (включая кайму)
  if (layers.bend !== false) {
    res.bendLinePositions.forEach(x => {
      dxf.push(
        '0', 'LINE', '8', 'BEND',
        '10', n(x), '20', n(0), '30', '0',
        '11', n(x), '21', n(W), '31', '0'
      );
    });
    res.hemBendLinePositions.forEach(x => {
      dxf.push(
        '0', 'LINE', '8', 'BEND',
        '10', n(x), '20', n(0), '30', '0',
        '11', n(x), '21', n(W), '31', '0'
      );
    });
  }

  dxf.push('0', 'ENDSEC', '0', 'EOF');

  return dxf.join('\n');
}

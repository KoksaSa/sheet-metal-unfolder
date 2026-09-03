(function() {
// ==================== INTERNATIONALIZATION ====================
const STRINGS = {
  ru: {
    title: 'Развёртка листового металла',
    subtitle: 'Sheet Metal Unfolder v4.6',
    unfold: 'Развернуть',
    downloadDxf: 'Скачать DXF',
    downloadSvg: 'Скачать SVG',
    downloadPng: 'Скачать PNG',
    whitePng: 'Белый PNG',
    whitePngTooltip: 'PNG для печати (белый фон)',
    unfoldTitle: 'Развёртка',
    flatBlankSubtitle: 'Плоская заготовка для гибки',
    templates: 'Шаблоны',
    weightTitle: 'Масса детали',
    weightKg: 'кг',
    weightG: 'г',
    noUnfold: 'Нет результата развёртки',
    noUnfoldHint: '',
    areaLabel: 'Площадь',
    areaSuffix: ' мм²',
    footerControls: 'Координаты в миллиметрах • Масштаб: колёсико мыши • Панорама: Alt + ЛКМ',
    footerVersion: 'Развёртка листового металла v4.6',
    paramsSection: 'ПАРАМЕТРЫ',
    bendWord1: 'гиб',
    bendWord2: 'гиба',
    bendWord5: 'гибов',
    lengthLabel: 'Длина (L)',
    widthLabel: 'Ширина (W)',
    mm: 'мм',
    savedOk: 'Проект сохранён',
    loadedOk: 'Проект загружен',
    autoUnfold: 'Авто-развёртка',
    shortcuts: 'Горячие клавиши',
    shortcutDraw: 'Рисование (Карандаш)',
    shortcutSelect: 'Выбор',
    shortcutErase: 'Ластик',
    shortcutMeasure: 'Измерение',
    shortcutHem: 'Кайма (выбор сегмента)',
    shortcutCoordInput: 'Ввод координат',
    shortcutCenter: 'Центр вида',
    shortcutUnfold: 'Развернуть',
    shortcutUndoPoints: 'Отмена (точки)',
    shortcutRedoPoints: 'Повторить (точки)',
    shortcutUndoParams: 'Отмена (параметры)',
    shortcutRedoParams: 'Повторить (параметры)',
    shortcutSave: 'Сохранить',
    shortcutMouse1: 'ЛКМ — точка, Alt+ЛКМ — перенос',
    shortcutMouse2: 'Колёсико мыши — масштаб',
    shortcutCloseContour: 'Привязка к первой точке — закрыть контур',
    noSaved: 'Нет сохранённого проекта',
    widthError: 'Ширина должна быть больше 0',
    segmentsTitle: 'Сегменты развёртки',
    segStraight: 'Прямой',
    segBend: 'Гиб',
    segCumul: 'Накопл',
    save: 'Сохранить',
    load: 'Загрузить',
    exportJson: 'Экспорт JSON',
    importJson: 'Импорт JSON',
    exportOk: 'Проект экспортирован',
    importError: 'Ошибка чтения файла',
    importFormatError: 'Неверный формат файла',
    tools: 'ИНСТРУМЕНТЫ',
    draw: 'Рисование',
    select: 'Выбор',
    erase: 'Ластик',
    measure: 'Измерение',
    undo: 'Отмена',
    redo: 'Повтор',
    clear: 'Очистить',
    metalType: 'Тип металла',
    thickness: 'Толщина',
    bendRadius: 'Радиус гиба',
    kFactor: 'K-фактор',
    kFactorTooltip: 'Коэффициент положения нейтральной линии (0.1-0.7)',
    blankWidth: 'Ширина заготовки',
    dieSelect: 'Матрица (V)',
    punchSelect: 'Пуансон (R)',
    bendTool: 'Инструмент гибки',
    installTool: 'Установить инструмент',
    installToolHint: 'ВКЛ — инструменты можно двигать на холсте (установка). ВЫКЛ — инструменты заблокированы (симуляция)',
    simOn: 'ВКЛ',
    simOff: 'ВЫКЛ',
    bendNotFeasible: 'Невозможно согнуть',
    bendFeasible: 'Возможно',
    bendWarningsTitle: 'Проблемы гибки',
    bendWarnings: 'Предупреждения гибки',
    checkDieHeight: 'Учитывать толщину матрицы',
    customDie: 'Своя матрица',
    customPunch: 'Свой пуансон',
    customDieName: 'Название',
    customDieVWidth: 'Ширина V (мм)',
    customDieHeight: 'Высота (мм)',
    customDieMaxAngle: 'Макс. угол (°)',
    customPunchName: 'Название',
    customPunchRadius: 'Радиус (мм)',
    customPunchMaxAngle: 'Макс. угол (°)',
    customDiesList: 'Ваши матрицы:',
    customPunchesList: 'Ваши пуансоны:',
    dxfImport: 'Загрузите DXF с чертежом инструмента',
    dxfNoFile: 'Файл не выбран',
    dxfNoContour: 'Контур не найден — проверьте DXF (нужны LINE/LWPOLYLINE)',
    dxfError: 'Ошибка чтения DXF',
    dxfPleaseImport: 'Сначала загрузите DXF файл',
    toolPreview: 'Профиль инструмента',
    toolParams: 'Параметры инструмента',
    dieVLabel: 'V — ручей (мм)',
    punchRLabel: 'R — радиус (мм)',
    toolSLabel: 'S — ширина (мм)',
    toolHLabel: 'H — высота (мм)',
    toolMaxAngleLabel: 'Макс. угол (°)',
    widthShort: 'Ш',
    heightShort: 'В',
    snapToGrid: 'Привязка к сетке',
    gridStep: 'Шаг сетки',
    angleSnap: 'Угол привязки',
    dimensionsOnCanvas: 'Размеры на холсте',
    showToolsOnCanvas: 'Инструменты на холсте',
    profileStats: 'Статистика профиля',
    pointsLabel: 'Точки',
    points: 'точки',
    point: 'точка',
    points5: 'точек',
    profileLength: 'Длина профиля',
    total: 'Итого:',
    material: 'Материал',
    density: 'Плотн.',
    densityUnit: 'г/см³',
    thickShort: 'Толщ.',
    coordInput: 'Ввод координат',
    coordInputX: 'X (мм)',
    coordInputY: 'Y (мм)',
    snapGridCheck: 'Привязать к сетке',
    cancel: 'Отмена',
    add: 'Добавить',
    pointAdded: 'Точка добавлена',
    enterCoordsError: 'Введите корректные координаты',
    paramUndo: 'Парам.',
    paramRedo: 'Парам.',
    paramUndoTitle: 'Отмена параметров металла',
    paramRedoTitle: 'Повтор параметров металла',
    shortFlanges: 'Короткие полки',
    flangesShorter: 'полк(и) меньше мин.',
    minFlangeWarning: 'Мин. полка: ',
    bendDetails: 'Детали гибов',
    bend: 'Гиб ',
    ba: 'ДП: ',
    dxfOptions: 'Параметры экспорта DXF',
    dxfFilename: 'Имя файла',
    dxfAutoName: 'Автоматическое (unfold-дата.dxf)',
    dxfLayers: 'Слои',
    dxfLayerOutline: 'Контур (OUTLINE)',
    dxfLayerBend: 'Линии гибов (BEND)',
    dxfLayerDim: 'Размеры (DIMENSION)',
    dxfLayerText: 'Углы (TEXT)',
    dxfLayerInfo: 'Информация (INFO)',
    dxfLayerTick: 'Отметки (TICK)',
    dxfDownload: 'Скачать',
    centerView: 'Центр вида',
    copyCoords: 'Копировать координаты',
    addPoint: 'Добавить точку',
    segments: 'Сегменты: ',
    lightTheme: 'Светлое оформление',
    darkTheme: 'Тёмное оформление',
    pdf: 'PDF',
    pdfTooltip: 'Экспорт PDF',
    profileHeader: 'Профиль детали',
    drawProfile: 'Нарисуйте профиль',
    drawProfileHint: 'ЛКМ — точка • Колёсико — масштаб • Alt+ЛКМ — перенос',
    coordInputN: 'Координаты',
    axisLabels: 'Метки осей',
    importProfile: 'Импорт профиля',
    partNumber: 'Номер детали',
    hem: 'Кайма',
    hemTool: 'Кайма',
    simulate: 'Симуляция',
    faceSide: 'Лицевая',
    simManual: 'Ручной',
    simAuto: 'Авто',
    runSequence: 'Запуск',
    stopSim: 'Стоп',
    resetBends: 'Сброс',
    hemHeight: 'Высота каймы (мм)',
    hemSide: 'Сторона',
    hemSideLeft: 'Лево',
    hemSideRight: 'Право',
    hemApply: 'Применить (Enter)',
    hemCancel: 'Отмена (Esc)',
    hemSelectSeg: 'Нажмите на сегмент для каймы',
    hemRemove: 'Удалить кайму',
    hemRemoved: 'Кайма удалена',
    hemContextMenu: 'Удалить кайму',
    hemBottom: 'Нижняя (мм)',
    hemTop: 'Верхняя (мм)',
    bomTitle: 'Спецификация',
    partNo: 'Деталь №',
    straightLegend: 'Прямой',
    bendLegend: 'Гиб',
    resetZoom: 'Сбросить масштаб',
    edit: 'Редактировать',
    delete: 'Удалить',
    segment: 'Сегмент',
    view3d: '3D Вид',
    expanded3d: 'Полный экран',
    editPoint: 'Редактировать точку',
    editPointHint: 'Измените координаты. Длина и угол пересчитаются.',
    editSegmentHint: 'Измените длину и угол. Следующая точка сдвинется.',
    pointMoveHint: 'Точка #N2 сдвинется. Точка #N1 остаётся на месте.',
    segmentLabel: 'Сегмент',
    dragToRotate: 'Тяните для вращения • Колёсико — зум',
    dragToRotateEsc: 'Тяните для вращения • Колёсико — зум • Esc — закрыть',
    lengthShort: 'Длина',
    angleShort: 'Угол',
    blankWeight: 'Вес заготовки',
    drawingBtn: 'Чертёж',
    drawingTitle: 'Чертёж',
    drawingProfile: 'Профиль детали',
    drawingUnfold: 'Развертка',
    drawingDownload: 'Скачать PNG',
    drawingPrint: 'Печать',
    sim3dTitle: '3D Симуляция гибки',
    viewLeft: 'Вид слева',
    viewRight: 'Вид справа',
    popupBlocked: 'Блокировка всплывающих окон — разрешите popups',
    hemLegendSuffix: ''
  },
  en: {
    title: 'Sheet Metal Unfolder',
    subtitle: 'Sheet Metal Unfolder v4.6',
    unfold: 'Unfold',
    downloadDxf: 'Download DXF',
    downloadSvg: 'Download SVG',
    downloadPng: 'Download PNG',
    whitePng: 'White PNG',
    whitePngTooltip: 'PNG for printing (white background)',
    unfoldTitle: 'Flat Pattern',
    flatBlankSubtitle: 'Flat blank for bending',
    templates: 'Templates',
    weightTitle: 'Part Weight',
    weightKg: 'kg',
    weightG: 'g',
    noUnfold: 'No unfold result',
    noUnfoldHint: '',
    areaLabel: 'Area',
    areaSuffix: ' mm²',
    footerControls: 'Coordinates in mm \u2022 Zoom: mouse wheel \u2022 Pan: Alt + LMB',
    footerVersion: 'Sheet Metal Unfolder v4.6',
    paramsSection: 'PARAMETERS',
    bendWord1: 'bend',
    bendWord2: 'bends',
    bendWord5: 'bends',
    lengthLabel: 'Length (L)',
    widthLabel: 'Width (W)',
    mm: 'mm',
    savedOk: 'Project saved',
    loadedOk: 'Project loaded',
    autoUnfold: 'Auto-unfold',
    shortcuts: 'Keyboard Shortcuts',
    shortcutDraw: 'Draw (Pencil)',
    shortcutSelect: 'Select',
    shortcutErase: 'Eraser',
    shortcutMeasure: 'Measure',
    shortcutHem: 'Hem (segment select)',
    shortcutCoordInput: 'Coordinate Input',
    shortcutCenter: 'Center View',
    shortcutUnfold: 'Unfold',
    shortcutUndoPoints: 'Undo (points)',
    shortcutRedoPoints: 'Redo (points)',
    shortcutUndoParams: 'Undo (params)',
    shortcutRedoParams: 'Redo (params)',
    shortcutSave: 'Save',
    shortcutMouse1: 'LMB \u2014 point, Alt+LMB \u2014 pan',
    shortcutMouse2: 'Mouse wheel \u2014 zoom',
    shortcutCloseContour: 'Snap to first point \u2014 close contour',
    noSaved: 'No saved project',
    widthError: 'Width must be greater than 0',
    segmentsTitle: 'Flat Pattern Segments',
    segStraight: 'Straight',
    segBend: 'Bend',
    segCumul: 'Cumul',
    save: 'Save',
    load: 'Load',
    exportJson: 'Export JSON',
    importJson: 'Import JSON',
    exportOk: 'Project exported',
    importError: 'Error reading file',
    importFormatError: 'Invalid file format',
    tools: 'TOOLS',
    draw: 'Draw',
    select: 'Select',
    erase: 'Eraser',
    measure: 'Measure',
    undo: 'Undo',
    redo: 'Redo',
    clear: 'Clear',
    metalType: 'Metal Type',
    thickness: 'Thickness',
    bendRadius: 'Bend Radius',
    kFactor: 'K-factor',
    kFactorTooltip: 'Neutral axis position coefficient (0.1-0.7)',
    blankWidth: 'Blank Width',
    dieSelect: 'Die (V)',
    punchSelect: 'Punch (R)',
    bendTool: 'Bending tool',
    installTool: 'Install tool',
    installToolHint: 'ON — tools can be moved on canvas (install). OFF — tools locked (simulation)',
    simOn: 'ON',
    simOff: 'OFF',
    bendNotFeasible: 'Cannot bend',
    bendFeasible: 'Feasible',
    bendWarningsTitle: 'Bending problems',
    bendWarnings: 'Bending warnings',
    checkDieHeight: 'Account for die height',
    customDie: 'Custom die',
    customPunch: 'Custom punch',
    customDieName: 'Name',
    customDieVWidth: 'V-width (mm)',
    customDieHeight: 'Height (mm)',
    customDieMaxAngle: 'Max angle (°)',
    customPunchName: 'Name',
    customPunchRadius: 'Radius (mm)',
    customPunchMaxAngle: 'Max angle (°)',
    customDiesList: 'Your dies:',
    customPunchesList: 'Your punches:',
    dxfImport: 'Load DXF with tool drawing',
    dxfNoFile: 'No file selected',
    dxfNoContour: 'Contour not found \u2014 check DXF (LINE/LWPOLYLINE required)',
    dxfError: 'DXF read error',
    dxfPleaseImport: 'Load a DXF file first',
    toolPreview: 'Tool profile',
    toolParams: 'Tool parameters',
    dieVLabel: 'V \u2014 groove (mm)',
    punchRLabel: 'R \u2014 radius (mm)',
    toolSLabel: 'S \u2014 width (mm)',
    toolHLabel: 'H \u2014 height (mm)',
    toolMaxAngleLabel: 'Max angle (°)',
    widthShort: 'W',
    heightShort: 'H',
    snapToGrid: 'Snap to Grid',
    gridStep: 'Grid Step',
    angleSnap: 'Angle Snap',
    dimensionsOnCanvas: 'Dimensions on Canvas',
    showToolsOnCanvas: 'Tools on Canvas',
    profileStats: 'Profile Statistics',
    pointsLabel: 'Points',
    points: 'points',
    point: 'point',
    points5: 'points',
    profileLength: 'Profile Length',
    total: 'Total:',
    material: 'Material',
    density: 'Dens.',
    densityUnit: 'g/cm\u00b3',
    thickShort: 'Thick.',
    coordInput: 'Coordinate Input',
    coordInputX: 'X (mm)',
    coordInputY: 'Y (mm)',
    snapGridCheck: 'Snap to grid',
    cancel: 'Cancel',
    add: 'Add',
    pointAdded: 'Point added',
    enterCoordsError: 'Enter valid coordinates',
    paramUndo: 'Params',
    paramRedo: 'Params',
    paramUndoTitle: 'Undo metal parameters',
    paramRedoTitle: 'Redo metal parameters',
    shortFlanges: 'Short Flanges',
    flangesShorter: 'flange(s) below min.',
    minFlangeWarning: 'Min. flange: ',
    bendDetails: 'Bend Details',
    bend: 'Bend ',
    ba: 'BA: ',
    dxfOptions: 'DXF Export Options',
    dxfFilename: 'Filename',
    dxfAutoName: 'Auto (unfold-timestamp.dxf)',
    dxfLayers: 'Layers',
    dxfLayerOutline: 'Outline (OUTLINE)',
    dxfLayerBend: 'Bend Lines (BEND)',
    dxfLayerDim: 'Dimensions (DIMENSION)',
    dxfLayerText: 'Angles (TEXT)',
    dxfLayerInfo: 'Information (INFO)',
    dxfLayerTick: 'Tick Marks (TICK)',
    dxfDownload: 'Download',
    centerView: 'Center View',
    copyCoords: 'Copy Coordinates',
    addPoint: 'Add Point',
    segments: 'Segments: ',
    lightTheme: 'Light theme',
    darkTheme: 'Dark theme',
    pdf: 'PDF',
    pdfTooltip: 'Export PDF',
    profileHeader: 'Part Profile',
    drawProfile: 'Draw the profile',
    drawProfileHint: 'LMB \u2014 point \u2022 Wheel \u2014 zoom \u2022 Alt+LMB \u2014 pan',
    coordInputN: 'Coords',
    axisLabels: 'Axis Labels',
    importProfile: 'Import Profile',
    partNumber: 'Part Number',
    hem: 'Hem',
    hemTool: 'Hem',
    simulate: 'Simulate',
    faceSide: 'Face',
    simManual: 'Manual',
    simAuto: 'Auto',
    runSequence: 'Run',
    stopSim: 'Stop',
    resetBends: 'Reset',
    hemHeight: 'Hem Height (mm)',
    hemSide: 'Side',
    hemSideLeft: 'Left',
    hemSideRight: 'Right',
    hemApply: 'Apply (Enter)',
    hemCancel: 'Cancel (Esc)',
    hemSelectSeg: 'Click a segment to add hem',
    hemRemove: 'Remove hem',
    hemRemoved: 'Hem removed',
    hemContextMenu: 'Remove hem',
    hemBottom: 'Bottom (mm)',
    hemTop: 'Top (mm)',
    bomTitle: 'BOM',
    partNo: 'Part No.',
    straightLegend: 'Straight',
    bendLegend: 'Bend',
    resetZoom: 'Reset Zoom',
    edit: 'Edit',
    delete: 'Delete',
    segment: 'Segment',
    view3d: '3D View',
    expanded3d: 'Full Screen',
    editPoint: 'Edit point',
    editPointHint: 'Change coordinates. Length and angle will be recalculated.',
    editSegmentHint: 'Change length and angle. Next point will move.',
    pointMoveHint: 'Point #N2 will move. Point #N1 stays.',
    segmentLabel: 'Segment',
    dragToRotate: 'Drag to rotate • Wheel — zoom',
    dragToRotateEsc: 'Drag to rotate • Wheel — zoom • Esc — close',
    lengthShort: 'Length',
    angleShort: 'Angle',
    blankWeight: 'Blank Weight',
    drawingBtn: 'Drawing',
    drawingTitle: 'Drawing',
    drawingProfile: 'Part Profile',
    drawingUnfold: 'Flat Pattern',
    drawingDownload: 'Download PNG',
    drawingPrint: 'Print',
    sim3dTitle: '3D Bending Simulation',
    viewLeft: 'Left view',
    viewRight: 'Right view',
    popupBlocked: 'Popup blocked — allow popups',
    hemLegendSuffix: ''
  }
};

function t(key) {
  return STRINGS[S.lang][key] || key;
}

function bendWord(n) {
  if (S.lang === 'en') return n === 1 ? 'bend' : 'bends';
  if (n === 1) return 'гиб';
  if (n < 5) return 'гиба';
  return 'гибов';
}

function pointWord(n) {
  if (S.lang === 'en') return n === 1 ? 'point' : 'points';
  if (n === 1) return 'точка';
  if (n >= 2 && n < 5) return 'точки';
  return 'точек';
}
// ==================== METAL TYPES & PRESETS ====================
const METAL_TYPES = [
  {
    nameRu: 'Сталь', nameEn: 'Steel', kFactor: 0.38, tensile: 400,
    defaultThickness: 1.5,
    densities: { 0.5: 7.85e-6, 1: 7.85e-6, 1.5: 7.85e-6, 2: 7.85e-6, 3: 7.85e-6 }
  },
  {
    nameRu: 'Нержавеющая сталь', nameEn: 'Stainless Steel', kFactor: 0.5, tensile: 600,
    defaultThickness: 0.8,
    densities: { 0.5: 7.93e-6, 1: 7.93e-6, 1.5: 7.93e-6, 2: 7.93e-6 }
  },
  {
    nameRu: 'Алюминий', nameEn: 'Aluminum', kFactor: 0.33, tensile: 200,
    defaultThickness: 1.5,
    densities: { 0.5: 2.7e-6, 1: 2.7e-6, 1.5: 2.7e-6, 2: 2.7e-6, 3: 2.7e-6 }
  },
  {
    nameRu: 'Медь', nameEn: 'Copper', kFactor: 0.35, tensile: 250,
    defaultThickness: 1,
    densities: { 0.5: 8.96e-6, 1: 8.96e-6, 1.5: 8.96e-6, 2: 8.96e-6 }
  },
  {
    nameRu: 'Латунь', nameEn: 'Brass', kFactor: 0.35, tensile: 350,
    defaultThickness: 1,
    densities: { 0.5: 8.5e-6, 1: 8.5e-6, 1.5: 8.5e-6, 2: 8.5e-6 }
  },
  {
    nameRu: 'Оцинкованная сталь', nameEn: 'Galvanized Steel', kFactor: 0.40, tensile: 400,
    defaultThickness: 0.8,
    densities: { 0.5: 7.85e-6, 0.8: 7.85e-6, 1: 7.85e-6, 1.2: 7.85e-6, 1.5: 7.85e-6 }
  },
  {
    nameRu: 'Пользовательский', nameEn: 'Custom', kFactor: 0.38, tensile: 400,
    defaultThickness: 1.5,
    densities: { 0.5: 7.85e-6, 1: 7.85e-6, 1.5: 7.85e-6, 2: 7.85e-6, 3: 7.85e-6 }
  }
];

const THICKNESS_OPTIONS = [0.3, 0.5, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4, 5];

// ==================== BENDING TOOLS (MATRITSY I PUNSONY) ====================
// V-матрицы (die): vWidth — ширина канавки V, height — толщина матрицы, maxAngle — макс. угол
const DIES = [
  { id: 'V8',  nameRu: 'V8',  nameEn: 'V8',  vWidth: 8,  height: 30,  maxAngle: 140 },
  { id: 'V10', nameRu: 'V10', nameEn: 'V10', vWidth: 10, height: 35,  maxAngle: 140 },
  { id: 'V12', nameRu: 'V12', nameEn: 'V12', vWidth: 12, height: 40,  maxAngle: 140 },
  { id: 'V16', nameRu: 'V16', nameEn: 'V16', vWidth: 16, height: 50,  maxAngle: 140 },
  { id: 'V20', nameRu: 'V20', nameEn: 'V20', vWidth: 20, height: 60,  maxAngle: 140 },
  { id: 'V25', nameRu: 'V25', nameEn: 'V25', vWidth: 25, height: 70,  maxAngle: 140 },
  { id: 'V32', nameRu: 'V32', nameEn: 'V32', vWidth: 32, height: 80,  maxAngle: 140 },
  { id: 'V40', nameRu: 'V40', nameEn: 'V40', vWidth: 40, height: 100, maxAngle: 140 },
  { id: 'V50', nameRu: 'V50', nameEn: 'V50', vWidth: 50, height: 120, maxAngle: 140 },
  { id: 'V63', nameRu: 'V63', nameEn: 'V63', vWidth: 63, height: 140, maxAngle: 140 },
  { id: 'V80', nameRu: 'V80', nameEn: 'V80', vWidth: 80, height: 160, maxAngle: 140 }
];

// Пуансоны (punch): радиус вершины, ширина S, высота H, максимальный угол гиба
const PUNCHES = [
  { id: 'R0.5', nameRu: 'R0.5', nameEn: 'R0.5', radius: 0.5, swidth: 20, height: 50, maxAngle: 90 },
  { id: 'R1',   nameRu: 'R1',   nameEn: 'R1',   radius: 1,   swidth: 20, height: 50, maxAngle: 90 },
  { id: 'R1.5', nameRu: 'R1.5', nameEn: 'R1.5', radius: 1.5, swidth: 20, height: 50, maxAngle: 90 },
  { id: 'R2',   nameRu: 'R2',   nameEn: 'R2',   radius: 2,   swidth: 20, height: 50, maxAngle: 90 },
  { id: 'R3',   nameRu: 'R3',   nameEn: 'R3',   radius: 3,   swidth: 25, height: 60, maxAngle: 90 },
  { id: 'R5',   nameRu: 'R5',   nameEn: 'R5',   radius: 5,   swidth: 30, height: 70, maxAngle: 90 },
  { id: 'R8',   nameRu: 'R8',   nameEn: 'R8',   radius: 8,   swidth: 40, height: 80, maxAngle: 90 },
  { id: 'R10',  nameRu: 'R10',  nameEn: 'R10',  radius: 10,  swidth: 40, height: 80, maxAngle: 90 }
];

// ==================== CUSTOM TOOLS (USER DEFINED) ====================
function loadCustomTools() {
  try {
    const raw = localStorage.getItem('custom-tools');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { customDies: [], customPunches: [] };
}

function saveCustomTools(tools) {
  localStorage.setItem('custom-tools', JSON.stringify(tools));
}

function addCustomDie(die) {
  const tools = loadCustomTools();
  die.id = 'CUST-D-' + Date.now();
  die.isCustom = true;
  tools.customDies.push(die);
  saveCustomTools(tools);
}

function addCustomPunch(punch) {
  const tools = loadCustomTools();
  punch.id = 'CUST-P-' + Date.now();
  punch.isCustom = true;
  tools.customPunches.push(punch);
  saveCustomTools(tools);
}

function deleteCustomDie(id) {
  const tools = loadCustomTools();
  tools.customDies = tools.customDies.filter(d => d.id !== id);
  saveCustomTools(tools);
}

function deleteCustomPunch(id) {
  const tools = loadCustomTools();
  tools.customPunches = tools.customPunches.filter(p => p.id !== id);
  saveCustomTools(tools);
}

// ═══════════════════════════════════════════════════════════════
// ЕДИНЫЙ РЕЕСТР ИНСТРУМЕНТОВ (встроенные пресеты + свои)
// Индексация: [0 .. N-1] — встроенные DIES/PUNCHES,
//             [N .. ] — пользовательские (customDies/customPunches).
// ═══════════════════════════════════════════════════════════════
function getAllDies() {
  const tools = loadCustomTools();
  return DIES.concat(tools.customDies || []);
}

function getAllPunches() {
  const tools = loadCustomTools();
  return PUNCHES.concat(tools.customPunches || []);
}

function getDieByIndex(idx) {
  if (idx === undefined || idx === null || isNaN(idx)) idx = 0;
  const all = getAllDies();
  return all[idx] || null;
}

function getPunchByIndex(idx) {
  if (idx === undefined || idx === null || isNaN(idx)) idx = 0;
  const all = getAllPunches();
  return all[idx] || null;
}

const PRESET_SHAPES = [
  { nameRu: 'L-образный', nameEn: 'L-shape', icon: 'L', points: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: -60 }] },
  { nameRu: 'U-образный', nameEn: 'U-shape', icon: 'U', points: [{ x: 0, y: 0 }, { x: 120, y: 0 }, { x: 120, y: -80 }, { x: 0, y: -80 }] },
  { nameRu: 'Z-образный', nameEn: 'Z-shape', icon: 'Z', points: [{ x: 0, y: 0 }, { x: 80, y: 0 }, { x: 80, y: -50 }, { x: 160, y: -50 }] },
  { nameRu: 'Коробка', nameEn: 'Box', icon: '⎓', points: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: -80 }, { x: 0, y: -80 }] },
  { nameRu: 'Шляпа', nameEn: 'Hat', icon: '⌶', points: [{ x: 0, y: 0 }, { x: 40, y: 0 }, { x: 40, y: -60 }, { x: 120, y: -60 }, { x: 120, y: 0 }, { x: 160, y: 0 }] },
  { nameRu: 'Загиб', nameEn: 'Hem', icon: '⌟', points: [{ x: 0, y: 0 }, { x: 80, y: 0 }, { x: 80, y: -20 }] },
  { nameRu: 'Ступень', nameEn: 'Step', icon: 'Π', points: [{ x: 0, y: 0 }, { x: 60, y: 0 }, { x: 60, y: -40 }, { x: 140, y: -40 }, { x: 140, y: -80 }, { x: 200, y: -80 }] },
  { nameRu: 'Канал', nameEn: 'Channel', icon: '⊂', points: [{ x: 0, y: -40 }, { x: 0, y: 0 }, { x: 40, y: 0 }, { x: 40, y: -40 }, { x: 80, y: -40 }, { x: 80, y: 0 }, { x: 120, y: 0 }, { x: 120, y: -40 }] },
  { nameRu: 'Зигзаг', nameEn: 'Zigzag', icon: '⌟', points: [{ x: 0, y: 0 }, { x: 50, y: 0 }, { x: 50, y: -30 }, { x: 100, y: -30 }, { x: 100, y: 0 }, { x: 150, y: 0 }, { x: 150, y: -30 }, { x: 200, y: -30 }] },
  { nameRu: 'Скоба', nameEn: 'Bracket', icon: '{', points: [{ x: 0, y: 0 }, { x: 150, y: 0 }, { x: 150, y: -30 }, { x: 30, y: -30 }, { x: 30, y: -60 }, { x: 0, y: -60 }] },
  { nameRu: 'Жалюзи', nameEn: 'Louver', icon: '≡', points: [{ x: 0, y: 0 }, { x: 30, y: 0 }, { x: 30, y: -15 }, { x: 60, y: -15 }, { x: 60, y: 0 }, { x: 90, y: 0 }, { x: 90, y: -15 }, { x: 120, y: -15 }, { x: 120, y: 0 }, { x: 150, y: 0 }] },
  { nameRu: 'Трапеция', nameEn: 'Trapezoid', icon: '△', points: [{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 80, y: -40 }, { x: 120, y: -40 }, { x: 100, y: 0 }, { x: 140, y: 0 }] },
  { nameRu: 'Рёбро', nameEn: 'Stiffener', icon: '⊕', points: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: -5 }, { x: 60, y: -5 }, { x: 60, y: -20 }, { x: 0, y: -20 }] },
  { nameRu: 'Замок', nameEn: 'Lock Seam', icon: '⊝', points: [{ x: 0, y: 0 }, { x: 80, y: 0 }, { x: 80, y: -10 }, { x: 90, y: -10 }, { x: 90, y: -30 }, { x: 80, y: -30 }, { x: 80, y: -40 }, { x: 0, y: -40 }] },
  { nameRu: 'Полка', nameEn: 'Shelf', icon: '⊣', points: [{ x: 0, y: 0 }, { x: 120, y: 0 }, { x: 120, y: -80 }, { x: 0, y: -80 }] }
];

// SVG path points for preset thumbnails
const PRESET_SVG_PTS = {
  'L-образный': '2,14 10,14 10,2',
  'U-образный': '2,14 2,2 10,2 10,14',
  'Z-образный': '2,14 7,14 7,8 12,8',
  'Коробка': '2,14 2,2 10,2 10,14',
  'Шляпа': '2,14 4,14 4,6 8,6 8,14 10,14',
  'Загиб': '2,14 10,14 10,10',
  'Ступень': '2,14 5,14 5,8 9,8 9,2 12,2',
  'Канал': '2,8 2,14 5,14 5,8 7,8 7,14 10,14 10,8',
  'Зигзаг': '2,14 4,14 4,10 7,10 7,14 9,14 9,10 12,10',
  'Скоба': '2,14 10,14 10,11 3,11 3,8 2,8',
  'Жалюзи': '2,14 4,14 4,12 6,12 6,14 7,14 7,12 9,12 9,14 10,14',
  'Трапеция': '2,14 3,14 7,8 9,8 8,14 11,14',
  'Рёбро': '2,14 10,14 10,13 7,13 7,10 2,10',
  'Замок': '2,14 7,14 7,12 8,12 8,7 7,7 7,5 2,5',
  'Полка': '2,14 10,14 10,2 2,2'
};
// ═══════════════════════════════════════════════════════════════
// ИМПОРТ ПРОФИЛЯ ИНСТРУМЕНТА (МАТРИЦА / ПУАНСОН) ИЗ DXF
// Минимальный самодостаточный парсер: LINE, LWPOLYLINE, POLYLINE, ARC, CIRCLE
// ═══════════════════════════════════════════════════════════════

/**
 * Разбирает DXF-текст на примитивы.
 * @param {string} text - содержимое .dxf файла
 * @returns {Array} массив примитивов {type, ...}
 */
function parseDXFEntities(text) {
  const ls = String(text || '').replace(/^\uFEFF/, '').split(/\r?\n/);
  const entities = [];
  let i = 0;

  while (i < ls.length - 1) {
    let code = parseInt(ls[i], 10);
    const value = (ls[i + 1] === undefined ? '' : String(ls[i + 1])).trim();
    if (code !== 0) { i += 2; continue; }

    const type = value.toUpperCase();
    i += 2;

    if (type === 'LINE') {
      const e = { type: 'LINE', x1: 0, y1: 0, x2: 0, y2: 0 };
      while (i < ls.length - 1) {
        code = parseInt(ls[i], 10);
        if (code === 0) break;
        const v = parseFloat(ls[i + 1]);
        if (code === 10) e.x1 = v;
        else if (code === 20) e.y1 = v;
        else if (code === 11) e.x2 = v;
        else if (code === 21) e.y2 = v;
        i += 2;
      }
      entities.push(e);
    } else if (type === 'ARC' || type === 'CIRCLE') {
      const e = { type: 'ARC', cx: 0, cy: 0, r: 0, a1: 0, a2: type === 'ARC' ? 180 : 360 };
      while (i < ls.length - 1) {
        code = parseInt(ls[i], 10);
        if (code === 0) break;
        const v = parseFloat(ls[i + 1]);
        if (code === 10) e.cx = v;
        else if (code === 20) e.cy = v;
        else if (code === 40) e.r = v;
        else if (code === 50) e.a1 = v;
        else if (code === 51) e.a2 = v;
        i += 2;
      }
      if (e.r > 0) entities.push(e);
    } else if (type === 'LWPOLYLINE') {
      const pts = [];
      let closed = false;
      while (i < ls.length - 1) {
        code = parseInt(ls[i], 10);
        if (code === 0) break;
        const raw = (ls[i + 1] || '').trim();
        if (code === 70) closed = (parseInt(raw, 10) & 1) === 1;
        else if (code === 10) {
          const x = parseFloat(raw);
          let y = 0;
          if (i + 2 < ls.length - 1 && parseInt(ls[i + 2], 10) === 20) {
            y = parseFloat(ls[i + 3]);
            i += 2;
          }
          pts.push({ x, y });
        }
        i += 2;
      }
      if (pts.length >= 2) entities.push({ type: 'POLYLINE', points: pts, closed });
    } else if (type === 'POLYLINE') {
      // Ищем следующие VERTEX до ENDSEQ
      const pts = [];
      let closed = false;
      // пропускаем заголовочные поля полилинии
      while (i < ls.length - 1) {
        code = parseInt(ls[i], 10);
        if (code === 0) break;
        if (code === 70) closed = (parseInt(ls[i + 1], 10) & 1) === 1;
        i += 2;
      }
      // читаем VERTEX'ы
      while (i < ls.length - 1 && parseInt(ls[i], 10) === 0) {
        const subType = (ls[i + 1] || '').trim().toUpperCase();
        i += 2;
        if (subType === 'VERTEX') {
          let x = 0, y = 0;
          while (i < ls.length - 1) {
            code = parseInt(ls[i], 10);
            if (code === 0) break;
            const v = parseFloat(ls[i + 1]);
            if (code === 10) x = v;
            else if (code === 20) y = v;
            i += 2;
          }
          pts.push({ x, y });
        } else if (subType === 'SEQEND') {
          while (i < ls.length - 1 && parseInt(ls[i], 10) !== 0) i += 2;
          break;
        } else {
          while (i < ls.length - 1 && parseInt(ls[i], 10) !== 0) i += 2;
        }
      }
      // не выходим за границы: возвращаемся на entity boundary позже
      if (pts.length >= 2) entities.push({ type: 'POLYLINE', points: pts, closed });
    } else {
      // Пропускаем нерелевантные сущности (TEXT, HATCH, INSERT и т.д.)
      while (i < ls.length - 1) {
        if (parseInt(ls[i], 10) === 0) break;
        i += 2;
      }
    }
  }
  return entities;
}

/**
 * Собирает цепочки точек из примитивов.
 * @param {Array} entities примитивы из parseDXFEntities
 * @returns {Array<Array<{x,y}>>} массив цепочек (ломаных)
 */
function buildChainsFromDXF(entities) {
  // 1. Разбиваем все сущности на рёбра
  const segs = [];
  entities.forEach(e => {
    if (!e) return;
    if (e.type === 'LINE') {
      segs.push([{ x: e.x1, y: e.y1 }, { x: e.x2, y: e.y2 }]);
    } else if (e.type === 'POLYLINE') {
      const pts = e.points.slice();
      if (e.closed && pts.length > 1) pts.push({ ...pts[0] });
      for (let k = 0; k < pts.length - 1; k++) segs.push([pts[k], pts[k + 1]]);
    } else if (e.type === 'ARC') {
      const from = Math.min(e.a1, e.a2) * Math.PI / 180;
      const to = Math.max(e.a1, e.a2) * Math.PI / 180;
      const sweep = Math.max(0.0001, to - from);
      const steps = Math.max(8, Math.ceil(sweep / (Math.PI / 18)));
      let prev = null;
      for (let k = 0; k <= steps; k++) {
        const a = from + sweep * k / steps;
        const pt = { x: e.cx + Math.cos(a) * e.r, y: e.cy + Math.sin(a) * e.r };
        if (prev) segs.push([prev, pt]);
        prev = pt;
      }
    }
  });
  if (segs.length === 0) return [];

  // 2) Сшиваем рёбра в цепочки по совпадению концов
  const eps = 1e-4;
  const keyOf = p => Math.round(p.x / eps) + '_' + Math.round(p.y / eps);
  const adj = new Map();
  segs.forEach((s, idx) => {
    const k0 = keyOf(s[0]), k1 = keyOf(s[1]);
    if (!adj.has(k0)) adj.set(k0, []);
    if (!adj.has(k1)) adj.set(k1, []);
    adj.get(k0).push({ idx, end: 0 }); // конец 0 (s[0]) находится в точке k0
    adj.get(k1).push({ idx, end: 1 }); // конец 1 (s[1]) находится в точке k1
  });

  const used = new Array(segs.length).fill(false);
  const chains = [];

  const pointAt = (s, end) => s[end];

  const seekPt = (key, curIdx, point) => {
    const list = adj.get(key) || [];
    for (const cand of list) {
      if (cand.idx === curIdx || used[cand.idx]) continue;
      const d0 = pointAt(segs[cand.idx], cand.end);
      if (Math.abs(d0.x - point.x) < eps && Math.abs(d0.y - point.y) < eps) {
        return { idx: cand.idx, nextPoint: pointAt(segs[cand.idx], cand.end === 1 ? 0 : 1) };
      }
    }
    return null;
  };

  for (let s0 = 0; s0 < segs.length; s0++) {
    if (used[s0]) continue;
    // начинаем новую цепочку
    used[s0] = true;
    const chain = [segs[s0][0], segs[s0][1]];
    // продлеваем вперёд
    let curIdx = s0;
    let curPt = segs[s0][1];
    for (;;) {
      const next = seekPt(keyOf(curPt), curIdx, curPt);
      if (!next) break;
      used[next.idx] = true;
      chain.push(next.nextPoint);
      curIdx = next.idx;
      curPt = next.nextPoint;
    }
    // назад
    curPt = segs[s0][0];
    let backIdx = s0;
    for (;;) {
      const list = adj.get(keyOf(curPt)) || [];
      let found = false;
      for (const cand of list) {
        if (cand.idx === backIdx || used[cand.idx]) continue;
        const d0 = pointAt(segs[cand.idx], cand.end);
        if (Math.abs(d0.x - curPt.x) < eps && Math.abs(d0.y - curPt.y) < eps) {
          const other = pointAt(segs[cand.idx], cand.end === 1 ? 0 : 1);
          chain.unshift(other);
          used[cand.idx] = true;
          backIdx = cand.idx;
          curPt = other;
          found = true;
          break;
        }
      }
      if (!found) break;
    }
    chains.push(chain);
  }
  // сортируем: самая длинная цепочка первая (это, скорее всего, контур инструмента)
  chains.sort((a, b) => b.length - a.length);
  return chains;
}

/**
 * Строит профиль инструмента из DXF.
 * @returns {{chains:Array, width:number, height:number}|null}
 */
function profileFromDXF(dxfText) {
  const entities = parseDXFEntities(dxfText);
  const chains = buildChainsFromDXF(entities);
  if (chains.length === 0) return null;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  chains.forEach(chain => chain.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }));
  if (!isFinite(minX) || !isFinite(maxX)) return null;

  // Нормируем координаты в систему с Y вверх (как в DXF)
  return {
    chains,
    width: maxX - minX,
    height: maxY - minY,
    minX, maxX, minY, maxY
  };
}

/**
 * Оценка ширины ручья V-матрицы по профилю.
 * Ищет наибольший разрыв между точками на верхней границе контура —
 * это и есть "рот" V-канавки (расстояние между верхними концами скосов).
 * @param {{chains:Array, minX:number, maxX:number, maxY:number, width:number}} profile
 * @returns {number|null} ширина ручья в мм или null, если определить нельзя
 */
function estimateDieVWidth(profile) {
  if (!profile || !profile.chains) return null;
  const EPS = 1e-6;
  const maxY = profile.maxY;
  // Точки на верхней границе контура (должны быть верхние грани матрицы)
  const xs = [];
  profile.chains.forEach(chain => {
    chain.forEach(p => {
      if (Math.abs(p.y - maxY) < EPS) xs.push(p.x);
    });
  });
  if (xs.length < 2) return null;
  xs.sort((a, b) => a - b);
  // Наибольший зазор между соседними x — это V-отверстие
  let gap = 0;
  for (let i = 0; i < xs.length - 1; i++) {
    const g = xs[i + 1] - xs[i];
    if (g > gap) gap = g;
  }
  // Зазор должен быть заметной частью ширины (но не всей шириной — иначе контур разорван)
  if (gap < profile.width * 0.02 || gap > profile.width * 0.95) return null;
  return gap;
}
// ═══════════════════════════════════════════════════════════════
// ENGINE / ГЕОМЕТРИЯ — базовые геометрические helpers,
// масса детали, плотность, усилие гибки (air bending)
// ═══════════════════════════════════════════════════════════════

function dist(a, b) {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

function normAngle(a) {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a <= -Math.PI) a += 2 * Math.PI;
  return a;
}

function calcWeight(area, thick, mtIdx) {
  const mt = METAL_TYPES[mtIdx] || METAL_TYPES[0];
  const ts = Object.keys(mt.densities).map(Number).sort((a, b) => a - b);
  let d = 7.85e-6;
  for (const tt of ts) {
    d = mt.densities[tt];
    if (tt >= thick) break;
  }
  return area * thick * d;
}

function getMetalDensity(mtIdx, thick) {
  const mt = METAL_TYPES[mtIdx] || METAL_TYPES[0];
  const ts = Object.keys(mt.densities).map(Number).sort((a, b) => a - b);
  let d = 7.85e-6;
  for (const tt of ts) {
    d = mt.densities[tt];
    if (tt >= thick) break;
  }
  return d;
}

/**
 * Расчёт усилия свободной гибки (air bending) на V-матрице.
 * Формула: F = 1.33 × σв × L × t² / V — для угла 90°.
 * Поправка на угол (чем острее внутренний угол, тем больше усилие):
 *   F(α) = F(90°) × sin(45°) / sin(α/2)
 * Итог: F = 0.94 × σв × L × t² / (V × sin(α/2)), Н.
 * @param {number} interiorAngleRad - внутренний угол гиба (угол между полками), рад
 * @param {number} thickness - толщина металла, мм
 * @param {number} width - длина гиба (ширина заготовки), мм
 * @param {object} die - матрица {vWidth}
 * @param {number} mtIdx - индекс металла (для предела прочности)
 * @returns {{newtons: number, tons: number, tensile: number}} усилие
 */
function calcBendForce(interiorAngleRad, thickness, width, die, mtIdx) {
  const mt = METAL_TYPES[mtIdx] || METAL_TYPES[0];
  const tensile = mt.tensile || 400;
  const V = die.vWidth;
  const t = Math.max(0.01, thickness);
  const L = Math.max(1, width);
  const alpha = Math.max(0.05, Math.min(Math.PI - 0.05, interiorAngleRad));
  const forceN = 0.94 * tensile * L * t * t / (V * Math.sin(alpha / 2));
  const tons = forceN / 9810; // 1 тс ≈ 9.81 кН
  return { newtons: forceN, tons: tons, tensile: tensile };
}

// ==================== ПРОВЕРКА ВОЗМОЖНОСТИ ГИБА ====================
/**
 * Проверка возможности гибки на выбранных матрице и пуансоне.
 * ВНИМАНИЕ: подробные предупреждения гибов отключены по требованию
 * пользователя — функция всегда возвращает «возможно».
 * Полная сигнатура оставлена для совместимости вызовов (engine/unfold.js).
 */
function checkBendFeasibility(bend, segBeforeLen, segAfterLen, segBeforeFull, segAfterFull, bendRadius, die, punch, hasBendBefore, hasBendAfter, checkDieHeight, prevInward, nextInward, segBeforeOuter, segAfterOuter) {
  return { ok: true, problems: [], warnings: [] };
}

// ═══════════════════════════════════════════════════════════════
// ENGINE / РАЗВЁРТКА — расчёт плоской заготовки профиля
// ( bend allowance, K-фактор, каймы/hems, проверка гибов )
// ═══════════════════════════════════════════════════════════════

/**
 * Расчёт развёртки профиля
 * @param {Array} points - массив точек профиля
 * @param {number} bendRadius - радиус гиба
 * @param {number} kFactor - K-фактор
 * @param {number} thickness - толщина
 * @param {number} width - ширина заготовки
 * @param {object} [die] - матрица (необязательно)
 * @param {object} [punch] - пуансон (необязательно)
 * @returns {object|null} результат развёртки или null
 */
function unfoldProfile(points, bendRadius, kFactor, thickness, width, die, punch) {
  if (points.length < 2) return null;

  // Вычислить сегменты между точками
  const segs = [];
  for (let i = 0; i < points.length - 1; i++) {
    const s = points[i], e = points[i + 1];
    segs.push({
      start: s, end: e,
      length: dist(s, e),
      angle: Math.atan2(e.y - s.y, e.x - s.x)
    });
  }
  if (!segs.length) return null;

  // Радиус нейтральной линии
  const nr = bendRadius + kFactor * thickness;

  // Найти гибы
  const bends = [];
  if (segs.length >= 2) {
    for (let i = 0; i < segs.length - 1; i++) {
      let def = normAngle(segs[i + 1].angle - segs[i].angle);
      const ba = Math.abs(def);
      // Пропустить почти прямые или почти 180° сегменты
      if (ba < 5 * Math.PI / 180 || ba > Math.PI - 5 * Math.PI / 180) continue;
      // Касательное расстояние по внешнему радиусу (как в SolidWorks: R + t)
      const td = (bendRadius + thickness) * Math.tan(ba / 2);
      const bl = nr * ba;
      const cross = Math.cos(segs[i].angle) * Math.sin(segs[i + 1].angle)
                  - Math.sin(segs[i].angle) * Math.cos(segs[i + 1].angle);
      bends.push({
        vertexIndex: i + 1,
        vertex: points[i + 1],
        bendAngle: ba,
        deflection: def,
        bendAllowance: bl,
        tangentDistance: td,
        neutralRadius: nr,
        isInward: cross > 0,
        segBeforeIndex: i,
        segAfterIndex: i + 1
      });
    }
  }

  // Проверка возможности гибки на выбранных инструментах
  if (die && punch) {
    bends.forEach(b => {
      // Длины полок: длина сегмента минус касательные расстояния соседних гибов
      const prevBend = bends.find(bb => bb.segAfterIndex === b.segBeforeIndex);
      const nextBend = bends.find(bb => bb.segBeforeIndex === b.segAfterIndex);
      let beforeLen = segs[b.segBeforeIndex].length - b.tangentDistance;
      if (prevBend) beforeLen -= prevBend.tangentDistance;
      let afterLen = segs[b.segAfterIndex].length - b.tangentDistance;
      if (nextBend) afterLen -= nextBend.tangentDistance;
      beforeLen = Math.max(0, beforeLen);
      afterLen = Math.max(0, afterLen);
      const checkDH = typeof S !== 'undefined' && S.checkDieHeight;
      const prevInward = prevBend ? prevBend.isInward : false;
      const nextInward = nextBend ? nextBend.isInward : false;
      const segBeforeFull = segs[b.segBeforeIndex].length;
      const segAfterFull = segs[b.segAfterIndex].length;
      // Длины внешних полок (за соседними гибами) — для проверки столкновения полок
      const segBeforeOuterFull = prevBend ? segs[prevBend.segBeforeIndex].length : 0;
      const segAfterOuterFull = nextBend ? segs[nextBend.segAfterIndex].length : 0;
      const result = checkBendFeasibility(b, beforeLen, afterLen, segBeforeFull, segAfterFull, bendRadius, die, punch, !!prevBend, !!nextBend, checkDH, prevInward, nextInward, segBeforeOuterFull, segAfterOuterFull);
      b.feasible = result.ok;
      b.problems = result.problems;
      b.warnings = result.warnings;
      b.flangeBefore = beforeLen;
      b.flangeAfter = afterLen;
    });
  }

  // Расчёт каймы (180° загиб)
  // При 180° металл загибается обратно на лист — учитываем перекрытие (2T вместо T).
  // Прямой участок: h - (R + T), минус T за перекрытие = h - R - 2T.
  // Дуга 90° по нейтральной линии: π/2 * (R + K*T).
  function calcHem(h) {
    if (!h || h <= 0) return 0;
    const R = bendRadius;
    return h - R - 2 * thickness + (Math.PI / 2) * (R + kFactor * thickness);
  }

  // Build a map of hems by segment index
  const hemMap = new Map();
  (S.hems || []).forEach(h => {
    let si = h.segIndex;
    // Last segment hem → place AFTER last segment (at the edge of the contour)
    if (si === segs.length - 1) si = segs.length;
    if (si >= 0 && si <= segs.length && h.height > 0) {
      hemMap.set(si, h);
    }
  });

  // Построить развёртку
  const elements = [];
  const bendLinePositions = [];
  const hemBendLinePositions = [];
  let cx = 0;
  const bendMap = new Map();
  bends.forEach(b => bendMap.set(b.vertexIndex, b));

  for (let i = 0; i < segs.length; i++) {
    // Hem before this segment (at its start point)
    const hemBefore = hemMap.get(i);
    if (hemBefore) {
      const hemAdd = calcHem(hemBefore.height);
      if (hemAdd > 0) {
        elements.push({ type: 'hem', edge: hemBefore.side || 'left', segIndex: i, height: hemBefore.height, length: hemAdd, startX: cx, endX: cx + hemAdd });
        cx += hemAdd;
        hemBendLinePositions.push(cx);
      }
    }

    let sl = segs[i].length;
    const sb = bendMap.get(i);
    if (sb) sl -= sb.tangentDistance;
    const eb = bendMap.get(i + 1);
    if (eb) sl -= eb.tangentDistance;
    sl = Math.max(0, sl);
    elements.push({ type: 'straight', length: sl, startX: cx, endX: cx + sl });
    cx += sl;
    if (eb) {
      elements.push({
        type: 'bend',
        angle: eb.bendAngle,
        bendAllowance: eb.bendAllowance,
        startX: cx,
        endX: cx + eb.bendAllowance,
        direction: eb.isInward ? 1 : -1,
        feasible: eb.feasible,
        problems: eb.problems,
        bendNumber: eb.vertexIndex
      });
      bendLinePositions.push(cx);
      cx += eb.bendAllowance;
    }
  }

  // Hem after last segment (bend line at the START of the hem fold to avoid overlapping with outline edge)
  const hemAfterLast = hemMap.get(segs.length);
  if (hemAfterLast) {
    const hemAdd = calcHem(hemAfterLast.height);
    if (hemAdd > 0) {
      hemBendLinePositions.push(cx);
      elements.push({ type: 'hem', edge: hemAfterLast.side || 'left', segIndex: segs.length, height: hemAfterLast.height, length: hemAdd, startX: cx, endX: cx + hemAdd });
      cx += hemAdd;
    }
  }

  return {
    elements,
    totalLength: cx,
    width,
    bendInfos: bends,
    bendLinePositions,
    hemBendLinePositions
  };
}

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

// ═══════════════════════════════════════════════════════════════
// STATE / СОСТОЯНИЕ — глобальный объект S, операции с точками,
// undo/redo для точек и параметров металла
// ═══════════════════════════════════════════════════════════════

const S = {
  points: [],
  metal: { metalTypeIndex: 1, thickness: 0.8, bendRadius: 1.6, kFactor: 0.5, width: 600, partNumber: '', dieIndex: 0, punchIndex: 0 },
  hems: [], // [{segIndex, height, side:'left'|'right'}]
  hemEditing: null, // {segIndex} when hem dialog is open
  hemHoveredSeg: -1,
  toolMode: 'draw',
  lang: localStorage.getItem('sheet-metal-lang') || 'ru',
  snapToGrid: true,
  gridSize: 5,
  angleSnap: 'none',
  showDimensions: true,
  showAxisLabels: true,
  showToolsOnCanvas: false,
  simMode: false,
  simFaceSide: 'up', // лицевая сторона: 'up' или 'down'
  simFlipX: false, // переворот по X (лево↔право)
  simFlipY: false, // переворот по Y (верх↔низ)
  simBentMarkers: [], // индексы согнутых гибов в порядке выполнения
  toolLocked: false, // инструменты заблокированы (режим симуляции) — нельзя перетащить
  // === Анимация гибки (2D) ===
  simAnimRunning: false,
  simAnimBendIdx: -1,
  simAnimProgress: 0,
  simAnimDirection: 1,
  simAnimStartT: 0,
  simAnimOnDone: null,
  simSequenceRAF: null,
  simSequenceTimer: null,
  simSequence: [],
  simSequenceStep: -1,
  punchOffsetX: parseFloat(localStorage.getItem('punchOffsetX')) || 0,
  punchOffsetY: parseFloat(localStorage.getItem('punchOffsetY')) || 0,
  dieOffsetX: parseFloat(localStorage.getItem('dieOffsetX')) || 0,
  dieOffsetY: parseFloat(localStorage.getItem('dieOffsetY')) || 0,
  bendPointX: parseFloat(localStorage.getItem('bendPointX')) || 0,
  bendPointY: parseFloat(localStorage.getItem('bendPointY')) || 0,
  previewBendIdx: null,
  previewFlip: false,
  selectedBendIndex: undefined, // выбранный гиб в режиме симуляции
  simProfileSig: null, // v4.4: подпись профиля, на которой накоплена последовательность гибов
  stopperVisible: true,          // упор (задний упор гибочного пресса) показан в симуляции
  // Для каждого выполненного гиба: {stopperDist, faceOrient} — позиция упора
  // ДО гибки и ориентация лицевой стороны в момент гибки. Индексируется по bendIdx.
  // Используется в чертеже «Последовательность гибки».
  bendStepMeta: {},
  checkDieHeight: true,
  viewport: { offsetX: 0, offsetY: 0, scale: 3 },
  unfoldResult: null,
  autoUnfold: true,
  undoHistory: [],
  redoHistory: [],
  metalUndoHistory: [],
  metalRedoHistory: [],
  isDark: localStorage.getItem('theme') === 'dark',
  showSegments: false,
  animBendIdx: -1,
  dxfOpts: { layers: { outline: true, bend: true, dimension: true, text: true, info: true, tick: true } },
  mouseWorld: null,
  hoveredPt: -1,
  snapEndpoint: -1,
  drawFromIdx: null // индекс точки, от которой продолжается рисование (null = последняя)
};

// ==================== ХЕЛПЕРЫ СОСТОЯНИЯ ====================
function cloneState() {
  return {
    points: S.points.map(pt => ({ ...pt })),
    hems: S.hems.map(h => ({ ...h }))
  };
}

function snapPoint(p) {
  const gs = S.gridSize;
  if (S.angleSnap === 'none') {
    return { x: Math.round(p.x / gs) * gs, y: Math.round(p.y / gs) * gs };
  }
  const pts = S.points;
  if (!pts.length) return { x: Math.round(p.x / gs) * gs, y: Math.round(p.y / gs) * gs };
  // При рисовании от первой точки угол отсчитываем от неё
  const last = S.drawFromIdx === 0 ? pts[0] : pts[pts.length - 1];
  const dx = p.x - last.x, dy = p.y - last.y;
  const rawA = Math.atan2(dy, dx);
  const snapDeg = Number(S.angleSnap);
  const snapRad = snapDeg * Math.PI / 180;
  const snappedA = Math.round(rawA / snapRad) * snapRad;
  const d = Math.max(gs, Math.round(Math.sqrt(dx * dx + dy * dy) / gs) * gs);
  return {
    x: Math.round((last.x + Math.cos(snappedA) * d) / gs) * gs,
    y: Math.round((last.y + Math.sin(snappedA) * d) / gs) * gs
  };
}

function addPoint(p) {
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  // drawFromIdx === 0 → вставка в начало (рисуем от первой точки)
  // drawFromIdx === null → вставка в конец (рисуем от последней точки)
  if (S.drawFromIdx === 0 && S.points.length > 0) {
    S.points = [p, ...S.points];
  } else {
    S.points = [...S.points, p];
  }
  S.redoHistory = [];
  maybeAutoUnfold();
}

function removePoint(idx) {
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  // Если удалили первую точку в режиме рисования от неё — сброс
  if (S.drawFromIdx === 0 && idx === 0) S.drawFromIdx = null;
  S.points = S.points.filter((_, i) => i !== idx);
  S.redoHistory = [];
  maybeAutoUnfold();
}

// Замыкание контура: добавляем дубликат первой точки в конец
function closeContour() {
  if (S.points.length < 3) return;
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  const fp = S.points[0];
  S.points = [...S.points, { x: fp.x, y: fp.y }];
  S.redoHistory = [];
  S.drawFromIdx = null;
  maybeAutoUnfold();
}

function clearDrawing() {
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  S.points = [];
  S.redoHistory = [];
  S.hems = [];
  S.hemEditing = null;
  S.hemHoveredSeg = -1;
  S.drawFromIdx = null;
  S.unfoldResult = null;
  // v4.4 FIX: полный сброс состояния симуляции. Раньше «Очистить» оставляла
  // simBentMarkers/bendStepMeta от старого профиля — после рисования новой
  // детали и входа в «Симуляцию» заготовка показывалась уже частично
  // согнутой (помогало только обновление страницы).
  if (typeof resetSimulationState === 'function') resetSimulationState();
  if (typeof view3dUserZoomed !== 'undefined') view3dUserZoomed = false;
  localStorage.removeItem('sheet-metal-project');
  renderAll();
}

// v4.4: подпись текущего профиля (координаты точек с округлением 0.1мм).
// Если профиль изменился (очищён/перерисован/отредактирован), накопленная
// последовательность гибов бессмысленна — симуляция должна начаться заново.
function simProfileSignature() {
  return (S.points || []).map(p => Math.round(p.x * 10) + ',' + Math.round(p.y * 10)).join(';');
}

// v4.4: полный сброс состояния симуляции — маркеры согнутых гибов, меты
// шагов, перевороты, лицевая сторона, предпросмотры, анимации и шаги 3D.
// Вызывается из «Очистить» (clearDrawing) и при смене профиля.
function resetSimulationState() {
  if (S.simAnimRunning && typeof stopAnimation === 'function') stopAnimation();
  else if (typeof _simClearTimers === 'function') _simClearTimers();
  S.simBentMarkers = [];
  S.bendStepMeta = {};
  S.simFlipX = false;
  S.simFlipY = false;
  S.simFaceSide = 'up';
  S.selectedBendIndex = undefined;
  S.previewBendIdx = null;
  S.previewFlip = false;
  S.simMode = false;
  S.showToolsOnCanvas = false;
  S.toolLocked = false;
  S.simProfileSig = null;
  // Шаги 3D-симуляции тоже привязаны к профилю — сбрасываем
  if (typeof sim3dResetForNewProfile === 'function') sim3dResetForNewProfile();
}

function doUndo() {
  if (!S.undoHistory.length) return;
  const current = cloneState();
  const prev = S.undoHistory.pop();
  S.redoHistory = [...S.redoHistory, current];
  if (S.redoHistory.length > 50) S.redoHistory.shift();
  S.points = prev.points;
  S.hems = prev.hems || [];
  if (S.drawFromIdx !== null && S.drawFromIdx >= S.points.length) S.drawFromIdx = S.points.length - 1;
  maybeAutoUnfold();
  renderAll();
}

function doRedo() {
  if (!S.redoHistory.length) return;
  const current = cloneState();
  const next = S.redoHistory.pop();
  S.undoHistory = [...S.undoHistory, current];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  S.points = next.points;
  S.hems = next.hems || [];
  if (S.drawFromIdx !== null && S.drawFromIdx >= S.points.length) S.drawFromIdx = S.points.length - 1;
  maybeAutoUnfold();
  renderAll();
}

function setMetalWithUndo(partial) {
  S.metalUndoHistory = [...S.metalUndoHistory, { ...S.metal }];
  if (S.metalUndoHistory.length > 20) S.metalUndoHistory.shift();
  Object.assign(S.metal, partial);
  S.metalRedoHistory = [];
  maybeAutoUnfold();
  renderUnfoldInfo();
  renderHeader();
}

function undoMetal() {
  if (!S.metalUndoHistory.length) return;
  S.metalRedoHistory = [...S.metalRedoHistory, { ...S.metal }];
  Object.assign(S.metal, S.metalUndoHistory.pop());
  maybeAutoUnfold();
}

function redoMetal() {
  if (!S.metalRedoHistory.length) return;
  S.metalUndoHistory = [...S.metalUndoHistory, { ...S.metal }];
  Object.assign(S.metal, S.metalRedoHistory.pop());
  maybeAutoUnfold();
}

function selectMetalType(idx) {
  const mt = METAL_TYPES[idx] || METAL_TYPES[0];
  setMetalWithUndo({ metalTypeIndex: idx, kFactor: mt.kFactor, thickness: mt.defaultThickness });
}

function maybeAutoUnfold() {
  if (!S.autoUnfold || S.points.length < 2 || S.metal.width <= 0) return;
  const die = getDieByIndex(S.metal.dieIndex);
  const punch = getPunchByIndex(S.metal.punchIndex);
  S.unfoldResult = unfoldProfile(S.points, S.metal.bendRadius, S.metal.kFactor, S.metal.thickness, S.metal.width, die, punch);
  // Reset unfold zoom to auto-fit when profile changes
  if (typeof ufManualZoom !== 'undefined') ufManualZoom = null;
}

function doUnfold() {
  if (S.points.length < 2 || S.metal.width <= 0) {
    toast(S.lang === 'ru' ? 'Ширина должна быть больше 0' : 'Width must be > 0', 'error');
    return;
  }
  const die = getDieByIndex(S.metal.dieIndex);
  const punch = getPunchByIndex(S.metal.punchIndex);
  S.unfoldResult = unfoldProfile(S.points, S.metal.bendRadius, S.metal.kFactor, S.metal.thickness, S.metal.width, die, punch);
}

// ═══════════════════════════════════════════════════════════════
// STATE / ТЕМА, ЯЗЫК, TOAST — переключатели оформления и
// всплывающие уведомления
// ═══════════════════════════════════════════════════════════════

// ==================== TOAST ====================
function toast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const d = document.createElement('div');
  d.className = 'toast toast-' + type;
  d.textContent = msg;
  c.appendChild(d);
  setTimeout(() => d.remove(), 2500);
}

// ==================== ТЕМА И ЯЗЫК ====================
function applyTheme() {
  document.documentElement.classList.toggle('dark', S.isDark);
  const sun = document.getElementById('icon-sun');
  const moon = document.getElementById('icon-moon');
  if (sun) sun.classList.toggle('hidden', S.isDark);
  if (moon) moon.classList.toggle('hidden', !S.isDark);
  localStorage.setItem('theme', S.isDark ? 'dark' : 'light');
}

function toggleTheme() {
  S.isDark = !S.isDark;
  applyTheme();
}

function toggleLang() {
  S.lang = S.lang === 'ru' ? 'en' : 'ru';
  localStorage.setItem('sheet-metal-lang', S.lang);
  renderAll();
}

function toggleAutoUnfold() {
  S.autoUnfold = !S.autoUnfold;
  if (S.autoUnfold) maybeAutoUnfold();
  renderAll();
}

function toggleLeftSidebar() {
  const sb = document.getElementById('mobile-sidebar');
  if (sb) sb.classList.toggle('hidden');
}

// ═══════════════════════════════════════════════════════════════
// STATE / СОХРАНЕНИЕ — экспорт DXF/SVG/PNG/JSON, импорт JSON,
// автосохранение в localStorage, позиции инструментов
// ═══════════════════════════════════════════════════════════════

// ==================== ЗАГРУЗКА ФАЙЛОВ ====================
function downloadBlob(content, type, fn) {
  const b = new Blob([content], { type });
  const u = URL.createObjectURL(b);
  const a = document.createElement('a');
  a.href = u; a.download = fn;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(u);
}

function exportDXF() {
  if (!S.unfoldResult) return;
  const mt = METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0];
  const mtName = S.lang === 'en' ? mt.nameEn : mt.nameRu;
  const dxf = generateDXF(S.unfoldResult, S.metal.bendRadius, S.metal.kFactor, S.metal.thickness, mtName, S.dxfOpts);
  const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  downloadBlob(dxf, 'application/dxf', 'unfold-' + ts + '.dxf');
  toast(t('exportOk'));
}

function exportSVG() {
  if (!S.unfoldResult) return;
  const mt = METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0];
  const mtName = S.lang === 'en' ? mt.nameEn : mt.nameRu;
  const svg = generateSVG(S.unfoldResult, S.metal.bendRadius, S.metal.kFactor, S.metal.thickness, mtName);
  downloadBlob(svg, 'image/svg+xml', 'unfold-pattern.svg');
  toast(t('exportOk'));
}

function exportPNG(whiteBg) {
  const cv = document.getElementById('unfold-canvas');
  if (!cv) return;
  const exp = document.createElement('canvas');
  exp.width = cv.width; exp.height = cv.height;
  const ctx = exp.getContext('2d');
  ctx.drawImage(cv, 0, 0);
  if (whiteBg) {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, exp.width, exp.height);
  }
  exp.toBlob(b => {
    if (!b) return;
    downloadBlob(b, 'image/png', 'unfold-pattern.png');
    toast(t('exportOk'));
  }, 'image/png');
}

function exportJSON() {
  const data = {
    version: '4.6',
    points: S.points,
    metal: S.metal,
    hems: S.hems,
    toolMode: S.toolMode,
    snapToGrid: S.snapToGrid,
    gridSize: S.gridSize,
    angleSnap: S.angleSnap
  };
  const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  downloadBlob(JSON.stringify(data, null, 2), 'application/json', 'sheet-metal-' + ts + '.json');
  toast(t('exportOk'));
}

function triggerImport() {
  document.getElementById('file-import').click();
}

// FIX: после импорта проекта сразу выполняем авто-развёртку —
// раньше кнопки экспорта оставались заблокированными до изменения параметров.
function importJSON(e) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    try {
      const d = JSON.parse(ev.target.result);
      if (!d.points || !d.metal) { toast(t('importFormatError'), 'error'); return; }
      S.points = d.points;
      Object.assign(S.metal, d.metal);
      if (d.hems) S.hems = d.hems; else S.hems = [];
      S.unfoldResult = null;
      S.undoHistory = [];
      S.redoHistory = [];
      // Сброс симуляции: другой профиль — старые гибы бессмысленны
      S.simBentMarkers = [];
      S.bendStepMeta = {};
      S.selectedBendIndex = undefined;
      S.simFlipX = false;
      S.simFlipY = false;
      maybeAutoUnfold();
      toast(t('loadedOk'));
      renderAll();
    } catch (err) {
      console.error('Import error:', err);
      toast(t('importError'), 'error');
    }
  };
  r.readAsText(f);
  e.target.value = '';
}

function saveProject() {
  try {
    localStorage.setItem('sheet-metal-project', JSON.stringify({ points: S.points, metal: S.metal, hems: S.hems }));
    toast(t('savedOk'));
  } catch (err) {
    console.error('Save error:', err);
    toast(t('importError'), 'error');
  }
}

// ==================== ПОЗИЦИИ ИНСТРУМЕНТОВ НА ХОЛСТЕ ====================
function saveToolPositions() {
  try {
    localStorage.setItem('sheet-metal-tool-positions', JSON.stringify({
      punchOffsetX: S.punchOffsetX || 0,
      punchOffsetY: S.punchOffsetY || 0,
      dieOffsetX: S.dieOffsetX || 0,
      dieOffsetY: S.dieOffsetY || 0,
      bendPointX: S.bendPointX || 0,
      bendPointY: S.bendPointY || 0
    }));
  } catch (err) { console.error('Save tool positions error:', err); }
}

function loadToolPositions() {
  try {
    const raw = localStorage.getItem('sheet-metal-tool-positions');
    if (!raw) return;
    const d = JSON.parse(raw);
    if (d.punchOffsetX !== undefined) S.punchOffsetX = d.punchOffsetX;
    if (d.punchOffsetY !== undefined) S.punchOffsetY = d.punchOffsetY;
    if (d.dieOffsetX !== undefined) S.dieOffsetX = d.dieOffsetX;
    if (d.dieOffsetY !== undefined) S.dieOffsetY = d.dieOffsetY;
    if (d.bendPointX !== undefined) S.bendPointX = d.bendPointX;
    if (d.bendPointY !== undefined) S.bendPointY = d.bendPointY;
  } catch (err) { console.error('Load tool positions error:', err); }
}

function loadProject() {
  try {
    const raw = localStorage.getItem('sheet-metal-project');
    if (!raw) { toast(t('noSaved'), 'error'); return; }
    const d = JSON.parse(raw);
    if (!d.points || !d.metal) { toast(t('importFormatError'), 'error'); return; }
    S.points = d.points;
    Object.assign(S.metal, d.metal);
    if (d.hems) S.hems = d.hems; else S.hems = [];
    S.unfoldResult = null;
    S.undoHistory = [];
    S.redoHistory = [];
    maybeAutoUnfold();
    toast(t('loadedOk'));
    renderAll();
  } catch (err) {
    console.error('Load error:', err);
    toast(t('importError'), 'error');
  }
}

// ═══════════════════════════════════════════════════════════════
// SIMULATION / ПРОФИЛЬ — накопительная модель гибки:
// каждый гиб применяется поверх предыдущих (как на реальном станке)
//
// Идентификатор гиба = ИНДЕКС в массиве S.unfoldResult.bendInfos
// (в engine/unfold.js у bendInfos нет поля .index — только vertexIndex)
//
// Правило направления: ГИБ ВСЕГДА ВВЕРХ.
//   • deflection > 0 — контур поворачивает влево/вверх → гнём напрямую
//   • deflection < 0 — отражаем геометрию так, чтобы гиб пошёл вверх
// ═══════════════════════════════════════════════════════════════

// ==================== КОНСТАНТЫ ====================
const MARKER_HIT_RADIUS       = 16;
const MARKER_RADIUS           = 11;
const SELECTED_MARKER_RADIUS  = 13;
const HOVER_MARKER_RADIUS     = 15;

const SIM_BEND_DURATION   = 900;  // мс на один гиб (2D)
const SIM_BETWEEN_DELAY   = 350;  // пауза между гибами в последовательности
const SIM_PUNCH_LIFT      = 14;   // высота покоя пуансона над листом (мм)

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// ==================== ГЕОМЕТРИЯ ====================

// halfAngle = половина угла прогиба (bendAngle = |deflection| = отклонение от плоскости).
// Внутренний угол между полками = π − 2·halfAngle = π − bendAngle.
//   • Интерьер 74° → прогиб 106° → halfAngle 53° → V-форма 74° ✓
//   • Интерьер 90° → прогиб 90°  → halfAngle 45° → V-форма 90° ✓
function targetHalfAngleForBend(bend) {
  return bend.bendAngle / 2;
}

// Air bending: глубина погружения пуансона в V-матрицу
function punchDepthForHalfAngle(halfAngle, vWidth) {
  const V = Math.max(1, vWidth || 10);
  return (V / 2) * Math.tan(halfAngle);
}

function interiorAngleFromHalfAngle(halfAngle) {
  return Math.PI - 2 * halfAngle;
}

/**
 * Направление V-fold ОТНОСИТЕЛЬНО ДЕТАЛИ: +1 = вверх, -1 = вниз.
 * world y>0 = ВВЕРХ на экране (w2c инвертирует).
 */
function bendDirection(bend) {
  return bend.deflection < 0 ? 1 : -1;
}

/**
 * Эффективное направление гиба В СИСТЕМЕ СТАНКА (v4.2).
 * На реальном прессе пуансон всегда давит СВЕРХУ, и обе полки
 * поднимаются вверх — независимо от того, перевёрнута ли заготовка.
 * Поэтому при перевёрнутой заготовке (flipY) направление гиба
 * относительно ДЕТАЛИ инвертируется: eff = dir × (−1) при перевороте.
 * Зеркало между гибами сопрягает поворот, и накопленная геометрия
 * детали остаётся верной (см. шаг 2 computeAccumulatedProfile).
 */
function effectiveBendDirection(bend, bendIdx) {
  return bendDirection(bend) * (getBendStepFlipY(bendIdx) ? -1 : 1);
}

/**
 * flipY для конкретного шага из bendStepMeta.
 * flipY=true — оператор физически перевернул заготовку после гиба.
 */
function getBendStepFlipY(bendIdx) {
  const meta = (S.bendStepMeta || {})[bendIdx];
  if (meta && typeof meta.flipY === 'boolean') {
    return meta.flipY;
  }
  return false;
}

/**
 * Список гибов для применения, в порядке выполнения.
 * Каждый элемент: { bendIdx, progress }
 */
function getApplyList(animInfo) {
  const bentSet = S.simBentMarkers || [];
  const list = [];
  bentSet.forEach(bIdx => {
    if (animInfo && animInfo.bendIdx === bIdx) {
      list.push({ bendIdx: bIdx, progress: animInfo.progress });
    } else {
      list.push({ bendIdx: bIdx, progress: 1 });
    }
  });
  if (animInfo && animInfo.bendIdx >= 0 && !bentSet.includes(animInfo.bendIdx)) {
    list.push({ bendIdx: animInfo.bendIdx, progress: animInfo.progress });
  }
  return list;
}

/**
 * Вычисляет накопительный профиль со всеми выполненными гибами
 * + анимируемым гибом (если есть).
 *
 * Правило: ГИБ ВСЕГДА ВВЕРХ. При позиционировании входная полка лежит
 * на матрице (горизонтально, -X), выходная поднимается ВВЕРХ (+Y).
 *
 * @param {object|null} animInfo — из getAnimInfo() или null
 *   (допускается поле _is3d = true для 3D-симуляции)
 * @returns {object|null}
 */
function computeAccumulatedProfile(animInfo) {
  if (!S.unfoldResult || !S.points || S.points.length < 2) return null;
  let bends = S.unfoldResult.bendInfos || [];
  const n = S.points.length;
  const numSegs = n - 1;
  const bentSet = S.simBentMarkers || [];
  const hasHems = S.hems && S.hems.length > 0;
  if (bends.length === 0 && !hasHems) return null;

  // === ОБРАБОТКА КАЙМЫ (HEM) ===
  // Кайма = гиб 180° на ребре профиля. В плоской развёртке добавляет длину,
  // в симуляции всегда согнута (сложена пополам). Маркер гиба с углом 180°.
  const hemMap = new Map();
  if (hasHems) {
    S.hems.forEach(h => {
      let si = h.segIndex;
      if (si >= numSegs - 1) si = numSegs; // after last segment = at last point
      if (si >= 0 && si <= numSegs && h.height > 0) {
        hemMap.set(si, h);
      }
    });
  }
  // Плоская длина каймы (как calcHem в engine/unfold.js)
  function calcHemFlat(height) {
    const R = S.metal.bendRadius;
    const T = S.metal.thickness;
    const k = S.metal.kFactor;
    return Math.max(0, height - R - 2 * T + (Math.PI / 2) * (R + k * T));
  }

  // Длины сегментов исходного профиля
  const segLengths = [];
  for (let i = 0; i < n - 1; i++) {
    segLengths.push(Math.hypot(
      S.points[i + 1].x - S.points[i].x,
      S.points[i + 1].y - S.points[i].y
    ));
  }

  // 1. Плоская развёртка (все точки на оси X от P0) + расширения каймы.
  //    origToFlat[i] = индекс точки S.points[i] в массиве pts.
  const pts = [{ x: 0, y: 0 }];
  const origToFlat = [0];
  const hemInfo = []; // { flatIdx, hemLength, side, height, origVertex }

  // Кайма на вершине 0 (перед первым сегментом)
  const hemAt0 = hemMap.get(0);
  if (hemAt0) {
    const hemLen = calcHemFlat(hemAt0.height);
    if (hemLen > 0) {
      hemInfo.push({ flatIdx: 0, hemLength: hemLen, side: hemAt0.side || 'left', height: hemAt0.height, origVertex: 0 });
      pts.push({ x: pts[0].x + hemLen, y: 0 });
    }
  }

  for (let i = 0; i < n - 1; i++) {
    // Добавляем сегмент i
    const lastPt = pts[pts.length - 1];
    pts.push({ x: lastPt.x + segLengths[i], y: 0 });
    origToFlat[i + 1] = pts.length - 1;

    // Кайма на вершине i+1 (перед сегментом i+1, если не последний сегмент)
    if (i + 1 < numSegs) {
      const hem = hemMap.get(i + 1);
      if (hem) {
        const hemLen = calcHemFlat(hem.height);
        if (hemLen > 0) {
          const flatIdx = pts.length - 1;
          hemInfo.push({ flatIdx, hemLength: hemLen, side: hem.side || 'left', height: hem.height, origVertex: i + 1 });
          pts.push({ x: pts[flatIdx].x + hemLen, y: 0 });
        }
      }
    }
  }

  // Кайма после последнего сегмента (на последней точке)
  const hemAfterLast = hemMap.get(numSegs);
  if (hemAfterLast) {
    const hemLen = calcHemFlat(hemAfterLast.height);
    if (hemLen > 0) {
      const flatIdx = origToFlat[n - 1];
      hemInfo.push({ flatIdx, hemLength: hemLen, side: hemAfterLast.side || 'left', height: hemAfterLast.height, origVertex: n - 1 });
      pts.push({ x: pts[flatIdx].x + hemLen, y: 0 });
    }
  }

  // Фальцовка каймы (всегда 180°): расширение поворачивается на 180°
  // вокруг вершины каймы и смещается на ±T по Y.
  // side='left' → -T (вниз), side='right' → +T (вверх).
  hemInfo.forEach(hem => {
    const vi = hem.flatIdx;
    const px = pts[vi].x, py = pts[vi].y;
    const T = S.metal.thickness || 1;
    const yOffset = (hem.side === 'right') ? T : -T;
    if (vi + 1 < pts.length) {
      const ext = pts[vi + 1];
      // 180° поворот вокруг (px, py): (x,y) → (2px-x, 2py-y)
      const rx = 2 * px - ext.x;
      const ry = 2 * py - ext.y;
      ext.x = rx;
      ext.y = ry + yOffset;
    }
  });

  // Корректируем vertexIndex реальных гибов на плоский профиль (с каймами)
  bends = bends.map(b => ({
    ...b,
    _origVertexIndex: b.vertexIndex,
    vertexIndex: origToFlat[b.vertexIndex] !== undefined ? origToFlat[b.vertexIndex] : b.vertexIndex
  }));

  // Определяем активный гиб (для позиционирования).
  let activeBendIdx = -1;
  let activeBend = null;
  let activeProg = 0;
  // Поддержка каймы: selectedBendIndex — строка 'hemN'.
  let activeIsHem = false;
  if (animInfo && animInfo.bendIdx >= 0 && bends[animInfo.bendIdx]) {
    activeBendIdx = animInfo.bendIdx;
    activeBend = bends[activeBendIdx];
    activeProg = animInfo.progress;
  } else if (S.selectedBendIndex !== undefined && typeof S.selectedBendIndex === 'string' && S.selectedBendIndex.indexOf('hem') === 0) {
    // Выбрана кайма — позиционируем по её вершине, без V-fold.
    const hemNum = parseInt(S.selectedBendIndex.slice(3), 10);
    if (hemInfo[hemNum]) {
      activeBend = { vertexIndex: hemInfo[hemNum].flatIdx, bendAngle: Math.PI, deflection: 0, isInward: false };
      activeBendIdx = -2; // признак каймы
      activeIsHem = true;
      activeProg = 1;
    }
  } else if (S.selectedBendIndex !== undefined && bends[S.selectedBendIndex]) {
    activeBendIdx = S.selectedBendIndex;
    activeBend = bends[activeBendIdx];
    activeProg = bentSet.includes(activeBendIdx) ? 1 : 0;
  } else if (bentSet.length > 0) {
    activeBendIdx = bentSet[bentSet.length - 1];
    activeBend = bends[activeBendIdx];
    activeProg = 1;
  } else if (bends.length > 0) {
    // Нет ни выбора, ни согнутых гибов, ни анимации — позиционируем по
    // первому гибу (индекс 0), чтобы заготовка встала первым маркером
    // гибки в (0,0) сразу при входе в симуляцию.
    activeBendIdx = 0;
    activeBend = bends[0];
    activeProg = 0;
  }

  // 2. Применяем ПРЕДЫДУЩИЕ гибы — V-FOLD (наклон всей заготовки + правая сторона).
  //    ФИЗИКА ПЕРЕВОРОТА ЗАГОТОВКИ (v4.2, FIX «зеркалился и гнулся вниз»):
  //    • «↕Y» = физический поворот детали вокруг оси гиба (лицом вниз/вверх);
  //    • чётность переворота на момент каждого гиба хранится в
  //      bendStepMeta[k].flipY (P_k);
  //    • между гибами применяется зеркало y→−y, только если чётность
  //      ИЗМЕНИЛАСЬ (XOR): переворот и возврат = два зеркала = без
  //      изменения — раньше сравнение было не XOR, из-за чего переворот
  //      + возврат между гибами ломали геометрию;
  //    • направление гиба — в системе станка (effectiveBendDirection):
  //      при перевёрнутой заготовке гиб относительно детали инвертируется,
  //      и на станке он ВСЕГДА выполняется вверх (пуансон сверху).
  const applyList = getApplyList(animInfo);
  applyList.forEach(({ bendIdx, progress }, listIdx) => {
    if (bendIdx === activeBendIdx) return;
    const b = bends[bendIdx];
    if (!b) return;
    const vi = b.vertexIndex;
    if (vi < 0 || vi >= pts.length) return;
    const easedProg = easeInOutCubic(Math.max(0, Math.min(1, progress)));
    const halfAngle = targetHalfAngleForBend(b) * easedProg;
    const dir = effectiveBendDirection(b, bendIdx);
    const px = pts[vi].x, py = pts[vi].y;
    // Наклон ВСЕЙ заготовки
    const tiltAngle = -halfAngle * dir;
    const cosT = Math.cos(tiltAngle), sinT = Math.sin(tiltAngle);
    for (let i = 0; i < pts.length; i++) {
      const dx = pts[i].x - px, dy = pts[i].y - py;
      pts[i].x = px + dx * cosT - dy * sinT;
      pts[i].y = py + dx * sinT + dy * cosT;
    }
    // Правая сторона: +2*halfAngle*dir
    const angR = 2 * halfAngle * dir;
    const cosR = Math.cos(angR), sinR = Math.sin(angR);
    for (let i = vi + 1; i < pts.length; i++) {
      const dx = pts[i].x - px, dy = pts[i].y - py;
      pts[i].x = px + dx * cosR - dy * sinR;
      pts[i].y = py + dx * sinR + dy * cosR;
    }
    // Физический переворот заготовки ПЕРЕД следующим гибом — если
    // чётность переворота ИЗМЕНИЛАСЬ (XOR), а не просто «включена».
    const nextItem = applyList[listIdx + 1];
    if (nextItem && progress >= 0.999999) {
      const curFlipY = getBendStepFlipY(bendIdx);
      const nextFlipY = getBendStepFlipY(nextItem.bendIdx);
      if (curFlipY !== nextFlipY) {
        for (let i = 0; i < pts.length; i++) {
          pts[i].y = -pts[i].y;
        }
      }
    }
  });

  // 3. Позиционирование: точка гиба в (0,0), входная полка горизонтальна.
  let anchorV = activeBend ? activeBend.vertexIndex : 0;
  if (anchorV < 0) anchorV = 0;
  if (anchorV >= n) anchorV = n - 1;

  if (anchorV > 0) {
    const preAngle = Math.atan2(
      pts[anchorV].y - pts[anchorV - 1].y,
      pts[anchorV].x - pts[anchorV - 1].x
    );
    const tryRotation = (targetAngle) => {
      const rotAngle = targetAngle - preAngle;
      const cosR = Math.cos(rotAngle), sinR = Math.sin(rotAngle);
      let sumY = 0, count = 0;
      for (let i = anchorV + 1; i < pts.length; i++) {
        const x = pts[i].x - pts[anchorV].x, y = pts[i].y - pts[anchorV].y;
        sumY += x * sinR + y * cosR;
        count++;
      }
      const afterY = count > 0 ? sumY / count : 0;
      let sumY2 = 0, count2 = 0;
      for (let i = 0; i < anchorV; i++) {
        const x = pts[i].x - pts[anchorV].x, y = pts[i].y - pts[anchorV].y;
        sumY2 += x * sinR + y * cosR;
        count2++;
      }
      const beforeY = count2 > 0 ? sumY2 / count2 : 0;
      return { rotAngle, afterY, beforeY };
    };
    const v1 = tryRotation(Math.PI);
    const v2 = tryRotation(0);
    let best;
    // v4.3 FIX («после поворотов заготовки гиб идёт вниз, деталь
    // зеркалится»): якорь v1/v2 СТРОГО согласован с направлением
    // АКТИВНОГО гиба в системе станка. На реальном прессе пуансон
    // всегда давит СВЕРХУ, заготовка складывается В МАТРИЦУ снизу —
    // гиб ВСЕГДА вверх:
    //   • effDir > 0 → входная полка СЛЕВА (v2), выходная справа
    //     поднимается вверх;
    //   • effDir < 0 → входная полка СПРАВА (v1), выходная слева
    //     поднимается вверх.
    // Прежняя эвристика (направление первого согнутого гиба + beforeY)
    // выбирала якорь по геометрии и при переворотах (flipY на активном
    // гибе, повороты ↔X между гибами) входила в противоречие с effDir:
    // V-складка рендерилась ВНИЗ — полки уходили в тело матрицы, а
    // переворот якоря выглядел как «зеркало» детали. Согласование по
    // effDir делает V всегда раскрытым вверх (апекс у пуансона) — при
    // ЛЮБОЙ истории переворотов. Кромка (hem) — V-fold не применяется,
    // для неё остаётся прежняя эвристика «полки не в воздухе».
    if (activeBendIdx >= 0 && activeBend && !activeIsHem) {
      const effDirActive = effectiveBendDirection(activeBend, activeBendIdx);
      best = (effDirActive < 0) ? v1 : v2;
    } else if (Math.abs(v1.beforeY - v2.beforeY) > 0.01) {
      const firstBentBend = (S.simBentMarkers || [])[0];
      // Отображаемое направление первого гиба, сопряжённое чётностью
      // переворота ТЕКУЩЕГО шага (v4.2): при перевёрнутой заготовке
      // согнутая полка физически свисает ВНИЗ (ниже плоскости матрицы),
      // поэтому сторона подачи инвертируется — иначе полка рисуется
      // «в воздухе» над пуансоном.
      const flipParity = activeBendIdx >= 0 ? getBendStepFlipY(activeBendIdx) : false;
      const prevDir = firstBentBend !== undefined
        ? bendDirection(bends[firstBentBend]) * (flipParity ? -1 : 1)
        : 1;
      best = (prevDir > 0 ? v1.beforeY >= v2.beforeY : v1.beforeY <= v2.beforeY) ? v1 : v2;
    } else {
      best = v2;
    }
    const cosR = Math.cos(best.rotAngle), sinR = Math.sin(best.rotAngle);
    for (let i = 0; i < pts.length; i++) {
      const x = pts[i].x, y = pts[i].y;
      pts[i].x = x * cosR - y * sinR;
      pts[i].y = x * sinR + y * cosR;
    }
  }

  // Сдвиг: вершина активного гиба в (0,0).
  if (anchorV >= 0 && anchorV < n) {
    const dx = -pts[anchorV].x, dy = -pts[anchorV].y;
    pts.forEach(p => { p.x += dx; p.y += dy; });
  }

  // 4. Активный V-fold (после позиционирования).
  //    Наклон ВСЕЙ заготовки на -halfAngle*dir, затем правая сторона
  //    на +2*halfAngle*dir → V-форма. Направление — в системе станка
  //    (effectiveBendDirection): при перевёрнутой заготовке гиб идёт
  //    вверх на станке (пуансон сверху), как в реальности (v4.2).
  //    Для каймы V-fold не делаем.
  if (activeBend && activeProg > 0 && !activeIsHem) {
    const b = activeBend;
    const vi = b.vertexIndex;
    if (vi >= 0 && vi < pts.length) {
      const easedProg = easeInOutCubic(Math.max(0, Math.min(1, activeProg)));
      const halfAngle = targetHalfAngleForBend(b) * easedProg;
      const dir = effectiveBendDirection(b, activeBendIdx);
      const px = pts[vi].x, py = pts[vi].y;
      const tiltAngle = -halfAngle * dir;
      const cosT = Math.cos(tiltAngle), sinT = Math.sin(tiltAngle);
      for (let i = 0; i < pts.length; i++) {
        const dx = pts[i].x - px, dy = pts[i].y - py;
        pts[i].x = px + dx * cosT - dy * sinT;
        pts[i].y = py + dx * sinT + dy * cosT;
      }
      const angR = 2 * halfAngle * dir;
      const cosR = Math.cos(angR), sinR = Math.sin(angR);
      for (let i = vi + 1; i < pts.length; i++) {
        const dx = pts[i].x - px, dy = pts[i].y - py;
        pts[i].x = px + dx * cosR - dy * sinR;
        pts[i].y = py + dx * sinR + dy * cosR;
      }
      const dx = -pts[vi].x, dy = -pts[vi].y;
      pts.forEach(p => { p.x += dx; p.y += dy; });
    }
  }

  // 5. Глубина погружения пуансона (air bending) для активного гиба.
  let depth = 0;
  let halfAngle = 0;
  if (activeBend && activeProg > 0) {
    halfAngle = easeInOutCubic(activeProg) * targetHalfAngleForBend(activeBend);
    const die = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
    const vWidth = die ? (die.vWidth || 10) : 10;
    depth = punchDepthForHalfAngle(halfAngle, vWidth);
  }

  // 6. Визуальные/физические перевороты заготовки (зеркалирование геометрии).
  //    simFlipX — видовое зеркало лево↔право (x → -x).
  //    simFlipY — ТЕКУЩАЯ ориентация заготовки. Перевороты, сделанные
  //    ДО последнего выполненного гиба, УЖЕ учтены между гибами (шаг 2),
  //    поэтому здесь применяется только ДЕЛЬТА — заготовку перевернули
  //    ПОСЛЕ последнего гиба. Раньше глобальный simFlipY применялся
  //    безусловно → переворот действовал ДВАЖДЫ (между гибами + здесь),
  //    заготовка «зеркалилась обратно», а активный гиб шёл вниз вместо
  //    вверх (v4.1, баг: Z-профиль → 1-й гиб → «↕Y» → 2-й гиб).
  //    Для 3D (_is3d) дельта не применяется: шаги показывают состояние
  //    на момент гиба, а осмотр детали — вращением камеры.
  if (S.simFlipX) {
    pts.forEach(p => { p.x = -p.x; });
  }
  if (!(animInfo && animInfo._is3d)) {
    // Дельта переворота: текущая ориентация (S.simFlipY) XOR чётность
    // на момент последнего гиба. Покрывает ОБА направления:
    // • тумблер включён после гибов → показать перевёрнутую деталь;
    // • переворот был «запечён» в meta, тумблер выключен (деталь
    //   вернули) → показать исходную ориентацию (зеркало назад).
    const lastItem = applyList.length > 0 ? applyList[applyList.length - 1] : null;
    const lastParity = lastItem ? getBendStepFlipY(lastItem.bendIdx) : false;
    if (!!S.simFlipY !== lastParity) {
      pts.forEach(p => { p.y = -p.y; });
    }
  }

  // 7. Маркеры гибов (index — индекс в массиве bendInfos)
  const bendMarkers = bends.map((b, i) => ({
    x: pts[b.vertexIndex].x,
    y: pts[b.vertexIndex].y,
    index: i,
    vertexIndex: b.vertexIndex,
    origVertexIndex: b._origVertexIndex,
    isBent: bentSet.includes(i),
    bendOrder: bentSet.indexOf(i) + 1, // 0 если не согнут
    label: 'P' + b._origVertexIndex
  }));

  // Маркеры каймы (всегда согнуты, угол 180°)
  hemInfo.forEach((hem, hi) => {
    bendMarkers.push({
      x: pts[hem.flatIdx].x,
      y: pts[hem.flatIdx].y,
      index: 'hem' + hi,
      vertexIndex: hem.flatIdx,
      origVertexIndex: hem.origVertex,
      isHem: true,
      isBent: true,
      bendOrder: 0,
      label: 'К' + (hi + 1)
    });
  });

  // Вычисляем внутренние углы для каждого согнутого гиба
  const bendAngles = {};
  for (const bIdx of bentSet) {
    const b = bends[bIdx];
    if (!b) continue; // защита: bIdx вне диапазона (изменён профиль)
    const vi = b.vertexIndex;
    if (vi > 0 && vi < pts.length - 1) {
      const vIn = { x: pts[vi - 1].x - pts[vi].x, y: pts[vi - 1].y - pts[vi].y };
      const vOut = { x: pts[vi + 1].x - pts[vi].x, y: pts[vi + 1].y - pts[vi].y };
      const angIn = Math.atan2(vIn.y, vIn.x);
      const angOut = Math.atan2(vOut.y, vOut.x);
      let diff = Math.abs(angOut - angIn);
      while (diff > Math.PI) diff = 2 * Math.PI - diff;
      bendAngles[bIdx] = diff;
    }
  }

  // Углы каймы — всегда 180°
  hemInfo.forEach((hem, hi) => {
    bendAngles['hem' + hi] = Math.PI;
  });

  return {
    pts, bendMarkers, depth, halfAngle,
    interiorAngle: activeBend ? Math.PI - 2 * halfAngle : Math.PI,
    bendAngles,
    hemInfo,
    anchorV,
    activeBendIdx,
    bentCount: bentSet.length,
    totalBends: bends.length
  };
}

// Совместимость со старыми вызовами
function computeSimPoints() {
  return computeAccumulatedProfile(null);
}
function computeBentProfile(markerIdx) {
  return computeAccumulatedProfile({ bendIdx: markerIdx, progress: 1, animating: false });
}

// ═══════════════════════════════════════════════════════════════
// SIMULATION / ОТРИСОВКА — профиль (согнутый/несогнутый), лицевая
// сторона, маркеры гибов, углы, усилие гибки, hit-тестирование
// ═══════════════════════════════════════════════════════════════

function drawPolyline(ctx, pts) {
  if (!pts || pts.length < 2) return;
  ctx.beginPath();
  const first = w2c(pts[0].x, pts[0].y);
  ctx.moveTo(first.cx, first.cy);
  for (let i = 1; i < pts.length; i++) {
    const p = w2c(pts[i].x, pts[i].y);
    ctx.lineTo(p.cx, p.cy);
  }
  ctx.stroke();
}

/**
 * Рисует линию толщи металла — смещение по нормали к каждому сегменту.
 * Использует ту же логику, что drawFaceSide: одна нормаль на сегмент,
 * без miter-join на вершинах → линия всегда параллельна контуру.
 */
function drawOffsetProfile(ctx, pts, offset, color, lineWidth) {
  if (!pts || pts.length < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i + 1].x - pts[i].x;
    const dy = pts[i + 1].y - pts[i].y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) continue;
    // Нормаль, направленная «вниз» (по Y мира)
    const nx = -dy / len * offset;
    const ny = dx / len * offset;
    const a = w2c(pts[i].x + nx, pts[i].y + ny);
    const b = w2c(pts[i + 1].x + nx, pts[i + 1].y + ny);
    if (i === 0) {
      ctx.moveTo(a.cx, a.cy);
    } else {
      ctx.lineTo(a.cx, a.cy);
    }
    ctx.lineTo(b.cx, b.cy);
  }
  ctx.stroke();
  ctx.restore();
}

// Согнутый профиль — оранжевый, с толщиной металла и точками вершин
function drawBentProfile(pts, ctx, isDark) {
  if (!pts || pts.length < 2) return;
  const T = S.metal.thickness || 1;
  ctx.save();
  ctx.strokeStyle = isDark ? '#f9731622' : '#ea580c22';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  drawPolyline(ctx, pts);
  ctx.restore();
  ctx.strokeStyle = isDark ? '#f97316' : '#ea580c';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  drawPolyline(ctx, pts);
  // Толщина — смещение по нормали к сегментам (как faceSide)
  drawOffsetProfile(ctx, pts, T, isDark ? '#f9731666' : '#ea580c66', 1.5);
  pts.forEach(pt => {
    const c = w2c(pt.x, pt.y);
    ctx.beginPath();
    ctx.arc(c.cx, c.cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#f97316aa' : '#ea580caa';
    ctx.fill();
  });
}

// Несогнутый (плоский) профиль — зелёный
function drawSimProfile(pts, ctx, isDark) {
  if (!pts || pts.length < 2) return;
  const T = S.metal.thickness || 1;
  ctx.save();
  ctx.strokeStyle = isDark ? '#22c55e22' : '#16a34a22';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  drawPolyline(ctx, pts);
  ctx.restore();
  ctx.strokeStyle = isDark ? '#22c55e' : '#16a34a';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  drawPolyline(ctx, pts);
  // Толщина — смещение по нормали к сегментам (как faceSide)
  drawOffsetProfile(ctx, pts, T, isDark ? '#22c55e66' : '#16a34a66', 1.5);
  pts.forEach(pt => {
    const c = w2c(pt.x, pt.y);
    ctx.beginPath();
    ctx.arc(c.cx, c.cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#22c55eaa' : '#16a34aaa';
    ctx.fill();
  });
}

/**
 * Внутренние углы согнутых гибов: «90°», «59°» или «180°» (кайма).
 * Кайма — фиолетовый цвет, ключи вида 'hem0', 'hem1'…
 */
function drawBendAngles(prof, ctx, isDark) {
  if (!prof || !prof.bendAngles || !prof.pts) return;
  const bends = (S.unfoldResult && S.unfoldResult.bendInfos) ? S.unfoldResult.bendInfos : [];
  const hemViMap = {};
  if (prof.bendMarkers) {
    prof.bendMarkers.forEach(m => {
      if (m.isHem) hemViMap[m.index] = m.vertexIndex;
    });
  }
  for (const bIdx in prof.bendAngles) {
    const angle = prof.bendAngles[bIdx];
    const angleDeg = (angle * 180 / Math.PI).toFixed(0);
    const isHem = typeof bIdx === 'string' && bIdx.indexOf('hem') === 0;
    let vi;
    if (isHem) {
      vi = hemViMap[bIdx];
    } else {
      vi = bends[bIdx] ? bends[bIdx].vertexIndex : 0;
      const marker = prof.bendMarkers ? prof.bendMarkers.find(m => m.index === parseInt(bIdx)) : null;
      if (marker) vi = marker.vertexIndex;
    }
    if (vi === undefined || vi < 0 || vi >= prof.pts.length) continue;
    const c = w2c(prof.pts[vi].x, prof.pts[vi].y);
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const text = angleDeg + '°';
    const tw = ctx.measureText(text).width;
    ctx.fillStyle = isDark ? 'rgba(26,26,46,0.85)' : 'rgba(255,255,255,0.85)';
    ctx.fillRect(c.cx + 14, c.cy - 7, tw + 6, 14);
    ctx.fillStyle = isHem ? '#a855f7' : (isDark ? '#fbbf24' : '#d97706');
    ctx.fillText(text, c.cx + 17, c.cy);
  }
}

/**
 * Лицевая сторона заготовки — голубая линия вдоль исходной «верхней»
 * грани металла, которая при гибке разворачивается вместе с металлом.
 *
 * Физика: лицевая сторона = исходная +Y поверхность плоского листа.
 * simFlipX — видовое зеркало (X-зеркало меняет направление обхода).
 * simFlipY — ФИЗИЧЕСКИЙ переворот заготовки вокруг оси гиба: лицо
 * оказывается с другой стороны ВСЕГДА (и на плоской заготовке),
 * т.к. отображаемая геометрия зеркалится с той же чётностью (v4.2).
 */
function drawFaceSide(pts, ctx, isDark) {
  if (!pts || pts.length < 2) return;
  const T = S.metal.thickness || 1;
  let faceUp = (S.simFaceSide || 'up') === 'up';
  if (S.simFlipX) faceUp = !faceUp;
  if (S.simFlipY) faceUp = !faceUp;
  const sign = faceUp ? 1 : -1;
  const off = T / 2;
  ctx.save();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  let started = false;
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i + 1].x - pts[i].x;
    const dy = pts[i + 1].y - pts[i].y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) continue;
    const nx = -dy / len * sign * off;
    const ny = dx / len * sign * off;
    const a = w2c(pts[i].x + nx, pts[i].y + ny);
    const b = w2c(pts[i + 1].x + nx, pts[i + 1].y + ny);
    if (!started) { ctx.moveTo(a.cx, a.cy); started = true; }
    else ctx.lineTo(a.cx, a.cy);
    ctx.lineTo(b.cx, b.cy);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * Маркеры точек гиба:
 *   кайма — фиолетовые, согнутые — зелёные с галочкой + №,
 *   выбранный — жёлтый, прочие — синие с №.
 */
function drawSimMarkers(markers, selectedBendIdx, ctx, isDark) {
  if (!markers || markers.length === 0) return;
  markers.forEach(m => {
    const c = w2c(m.x, m.y);
    const isSelected = (m.index === selectedBendIdx);
    const isBent = m.isBent;
    const isHem = !!m.isHem;

    ctx.beginPath();
    ctx.arc(c.cx, c.cy, isSelected ? SELECTED_MARKER_RADIUS : MARKER_RADIUS, 0, Math.PI * 2);

    if (isHem) {
      ctx.fillStyle = isDark ? '#a855f755' : '#a855f744';
      ctx.fill();
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(c.cx - 4, c.cy + 2);
      ctx.lineTo(c.cx, c.cy - 3);
      ctx.lineTo(c.cx + 4, c.cy + 2);
      ctx.stroke();
    } else if (isBent) {
      ctx.fillStyle = isDark ? '#22c55e55' : '#22c55e44';
      ctx.fill();
      ctx.strokeStyle = isDark ? '#22c55e' : '#16a34a';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(c.cx - 4, c.cy);
      ctx.lineTo(c.cx - 1, c.cy + 3);
      ctx.lineTo(c.cx + 4, c.cy - 3);
      ctx.stroke();
      ctx.fillStyle = isDark ? '#22c55e' : '#16a34a';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('№' + m.bendOrder, c.cx, c.cy - MARKER_RADIUS - 2);
    } else if (isSelected) {
      ctx.fillStyle = isDark ? '#f59e0b66' : '#f59e0b44';
      ctx.fill();
      ctx.strokeStyle = isDark ? '#f59e0b' : '#d97706';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(c.cx, c.cy, HOVER_MARKER_RADIUS, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? '#f59e0b88' : '#d9770666';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      ctx.fillStyle = isDark ? '#3b82f644' : '#3b82f633';
      ctx.fill();
      ctx.strokeStyle = isDark ? '#3b82f6' : '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Кайма (hem) сохраняет подпись К1, К2…
    if (isHem) {
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(m.label, c.cx, c.cy + MARKER_RADIUS + 2);
    }

    // № гиба над маркером (для согнутых — порядок выполнения)
    if (!isBent) {
      ctx.fillStyle = isDark ? '#8888aa' : '#737373';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('\u2116' + (m.index + 1), c.cx, c.cy - MARKER_RADIUS - 2);
    } else {
      ctx.fillStyle = isDark ? '#22c55e' : '#16a34a';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('\u2116' + m.bendOrder, c.cx, c.cy - MARKER_RADIUS - 2);
    }
  });
}

// Статусная строка симуляции (режим, прогресс, подсказки)
function drawSimLabels(totalBends, ctx, isDark, animInfo, bentCount) {
  const isRu = S.lang === 'ru';
  ctx.fillStyle = isDark ? '#f59e0b' : '#d97706';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  if (animInfo && animInfo.animating) {
    const interiorDeg = (animInfo.interiorAngle * 180 / Math.PI).toFixed(0);
    const depthMm = animInfo.depth.toFixed(1);
    const stepInfo = animInfo.sequenceStep >= 0
      ? (isRu ? 'Шаг ' + (animInfo.sequenceStep + 1) + '/' + animInfo.sequenceTotal + ' • ' : 'Step ' + (animInfo.sequenceStep + 1) + '/' + animInfo.sequenceTotal + ' • ')
      : '';
    ctx.fillText(
      isRu
        ? '⚙ V-гибка ' + stepInfo + 'гиб ' + (animInfo.bendIdx + 1) + ' • угол ' + interiorDeg + '° • глубина ' + depthMm + ' мм'
        : '⚙ V-bending ' + stepInfo + 'bend ' + (animInfo.bendIdx + 1) + ' • angle ' + interiorDeg + '° • depth ' + depthMm + ' mm',
      10, 10
    );
    ctx.font = '9px sans-serif';
    ctx.fillStyle = isDark ? '#93c5fd' : '#3b82f6';
    ctx.fillText(isRu ? 'Заготовка сгибается вверх…' : 'Blank bending upward…', 10, 26);
    return;
  }

  const mode = isRu ? 'РУЧНОЙ режим' : 'MANUAL mode';
  if (bentCount > 0) {
    ctx.fillText(
      isRu
        ? '[' + mode + '] Согнуто: ' + bentCount + '/' + totalBends + ' гибов'
        : '[' + mode + '] Bent: ' + bentCount + '/' + totalBends + ' bends',
      10, 10
    );
    ctx.font = '9px sans-serif';
    ctx.fillStyle = isDark ? '#93c5fd' : '#3b82f6';
    ctx.fillText(
      isRu
        ? 'ЛКМ по точке — выбрать гиб • ещё ЛКМ — согнуть V вверх • ПКМ по последнему — разогнуть'
        : 'LMB point — select bend • LMB again — bend V up • RMB last — unbend',
      10, 26
    );
  } else {
    ctx.fillText(
      isRu ? '[' + mode + '] ЛКМ по точке гиба — выбрать' : '[' + mode + '] LMB bend point — select',
      10, 10
    );
    ctx.font = '9px sans-serif';
    ctx.fillStyle = isDark ? '#93c5fd' : '#3b82f6';
    ctx.fillText(
      isRu
        ? 'Гибов: ' + totalBends + ' • ЛКМ выбрать • ещё ЛКМ согнуть вверх • порядок любой'
        : 'Bends: ' + totalBends + ' • LMB select • LMB again bend up • any order',
      10, 26
    );
  }
}

/**
 * Усилие гибки (в тоннах) для выбранного/анимируемого гиба.
 * Формула air bending — см. calcBendForce в engine/geometry.js.
 */
function drawBendForceLabel(ctx, isDark, animInfo, activeBendIdx) {
  if (!S.unfoldResult || !S.unfoldResult.bendInfos) return;
  const isRu = S.lang === 'ru';
  let bendIdx = -1, interiorAngle = Math.PI;
  if (animInfo && animInfo.animating) {
    bendIdx = animInfo.bendIdx;
    interiorAngle = animInfo.interiorAngle;
  } else if (activeBendIdx >= 0 && S.selectedBendIndex !== undefined) {
    bendIdx = S.selectedBendIndex;
    const b = S.unfoldResult.bendInfos[bendIdx];
    if (!b) return;
    // Целевой внутренний угол (π - bendAngle), до которого нужно согнуть
    interiorAngle = Math.PI - b.bendAngle;
  } else {
    return;
  }
  const b = S.unfoldResult.bendInfos[bendIdx];
  if (!b) return;
  const die = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
  if (!die || !die.vWidth) return;
  const force = calcBendForce(interiorAngle, S.metal.thickness, S.metal.width, die, S.metal.metalTypeIndex);
  const tons = force.tons;
  const tonsStr = tons < 1 ? tons.toFixed(2) : tons < 10 ? tons.toFixed(1) : Math.round(tons);
  const mt = METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0];
  const mtName = isRu ? mt.nameRu : mt.nameEn;
  const x = canvasW - 10;
  const y = 10;
  ctx.save();
  ctx.textAlign = 'right'; ctx.textBaseline = 'top';
  const lines = [
    (isRu ? 'Усилие гиба: ' : 'Bend force: ') + tonsStr + (isRu ? ' т' : ' t'),
    (isRu ? 'Металл: ' : 'Metal: ') + mtName + '  T=' + S.metal.thickness + '  V=' + die.vWidth,
    (isRu ? 'Угол: ' : 'Angle: ') + Math.round(interiorAngle * 180 / Math.PI) + '°  ' +
      (isRu ? 'Ширина: ' : 'Width: ') + S.metal.width + ' мм'
  ];
  ctx.font = 'bold 12px sans-serif';
  const bgH = lines.length * 16 + 8;
  const maxW = Math.max.apply(null, lines.map(function(l) { return ctx.measureText(l).width; }));
  ctx.fillStyle = isDark ? 'rgba(26,26,46,0.85)' : 'rgba(255,255,255,0.85)';
  ctx.fillRect(x - maxW - 8, y - 2, maxW + 16, bgH);
  ctx.strokeStyle = isDark ? '#f59e0b66' : '#d9770666';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - maxW - 8, y - 2, maxW + 16, bgH);
  ctx.fillStyle = isDark ? '#fbbf24' : '#b45309';
  ctx.fillText(lines[0], x, y + 2);
  ctx.font = '9px sans-serif';
  ctx.fillStyle = isDark ? '#d1d5db' : '#666';
  ctx.fillText(lines[1], x, y + 18);
  ctx.fillText(lines[2], x, y + 32);
  ctx.restore();
}

// ==================== HIT-TESTING МАРКЕРОВ ====================

function findMarkerAt(markers, cx, cy) {
  if (!markers || markers.length === 0) return null;
  let best = null, bestDist = Infinity;
  for (const m of markers) {
    const c = w2c(m.x, m.y);
    const d = Math.sqrt((c.cx - cx) ** 2 + (c.cy - cy) ** 2);
    if (d < MARKER_HIT_RADIUS && d < bestDist) { bestDist = d; best = m; }
  }
  return best;
}

function findMarkerHover(markers, cx, cy) {
  if (!markers || markers.length === 0) return -1;
  let bestIdx = -1, bestDist = Infinity;
  for (let mi = 0; mi < markers.length; mi++) {
    const m = markers[mi];
    const c = w2c(m.x, m.y);
    const d = Math.sqrt((c.cx - cx) ** 2 + (c.cy - cy) ** 2);
    if (d < MARKER_HIT_RADIUS && d < bestDist) { bestDist = d; bestIdx = mi; }
  }
  return bestIdx;
}

// ═══════════════════════════════════════════════════════════════
// SIMULATION / АНИМАЦИЯ — сгибание/разгибание отдельного гиба,
// последовательная гибка всех гибов, сброс состояния
// ═══════════════════════════════════════════════════════════════

function _simClearTimers() {
  if (S.simSequenceRAF) { cancelAnimationFrame(S.simSequenceRAF); S.simSequenceRAF = null; }
  if (S.simSequenceTimer) { clearTimeout(S.simSequenceTimer); S.simSequenceTimer = null; }
}

/**
 * Запустить анимацию сгибания гиба.
 * По завершении гиб добавляется в simBentMarkers (накопительный эффект).
 * Перед анимацией записывает метаданные шага (позиция упора, ориентация
 * лицевой стороны, перевороты) для чертежа «Последовательность гибки».
 */
function startBendAnimation(bendIdx, onDone) {
  if (!S.unfoldResult || !S.unfoldResult.bendInfos || bendIdx < 0 || bendIdx >= S.unfoldResult.bendInfos.length) {
    if (onDone) onDone();
    return;
  }
  if ((S.simBentMarkers || []).includes(bendIdx)) {
    if (onDone) onDone();
    return;
  }
  const b = S.unfoldResult.bendInfos[bendIdx];
  const dir = bendDirection(b);

  // Записать ПОЗИЦИЮ УПОРА ДО гибки: профиль ПОСЛЕ всех ранее выполненных
  // гибов (без текущего), позиционированный по текущему гибу, и точка
  // касания упора с контуром. Плюс ориентация лицевой стороны.
  (function recordPreBendMeta() {
    // СНАЧАЛА записываем метаданные шага (v4.2): тогда расчёт профиля
    // ДО гиба увидит переворот ТЕКУЩЕГО гиба — переход XOR между гибами
    // применится, а дельта шага 6 станет нулевой. Раньше meta писалась
    // ПОСЛЕ расчёта: переворот текущего гиба не учитывался, и упор со
    // stopperDist ставились по НЕперевёрнутой заготовке.
    // Ориентация лицевой стороны: faceOrient — РЕКОМЕНДАЦИЯ оператору
    // (исходная сторона лица + знак гиба детали), не зависит от текущего
    // переворота. Гиб вверх (dir+1) и лицо сверху → «вверх».
    let effFaceUp = (S.simFaceSide || 'up') === 'up';
    const faceOrient = (dir > 0) === effFaceUp ? 'up' : 'down';
    S.bendStepMeta = S.bendStepMeta || {};
    S.bendStepMeta[bendIdx] = {
      stopperDist: null, // заполняется ниже, после расчёта профиля
      faceOrient: faceOrient,
      // v4.5: сторона лицевой стороны НА МОМЕНТ гибки — для исторического
      // показа в 3D-симуляции (каждый шаг показывает своё состояние,
      // «Лицевая» могла переключаться между гибами). Чертёж
      // последовательности по-прежнему использует faceOrient
      // (рекомендация оператору).
      faceSide: (S.simFaceSide || 'up'),
      // Перевороты на момент гибки — для чертежа последовательности
      // и для накопительной геометрии (см. simulation/profile.js)
      flipX: !!S.simFlipX,
      flipY: !!S.simFlipY
    };
    const savedSel = S.selectedBendIndex, savedBent = S.simBentMarkers;
    S.selectedBendIndex = bendIdx;
    S.simBentMarkers = (savedBent || []).slice(); // уже согнутые (без текущего)
    const prof = computeAccumulatedProfile({ bendIdx: bendIdx, progress: 0, animating: false });
    S.selectedBendIndex = savedSel; S.simBentMarkers = savedBent;
    let touchX = null;
    if (prof && prof.pts) {
      const T = S.metal.thickness || 1;
      const pts = prof.pts;
      const yLo = -4, yHi = 4;
      // Ищем самую левую точку касания по всем трём линиям контура
      // 1. Основной контур
      for (let i = 0; i < pts.length - 1; i++) {
        const A = pts[i], B = pts[i + 1];
        const dy = B.y - A.y;
        let tLo, tHi;
        if (Math.abs(dy) < 1e-6) {
          if (A.y >= yLo - 0.01 && A.y <= yHi + 0.01) { tLo = 0; tHi = 1; } else continue;
        } else if (dy > 0) { tLo = (yLo - A.y) / dy; tHi = (yHi - A.y) / dy; }
        else { tLo = (yHi - A.y) / dy; tHi = (yLo - A.y) / dy; }
        if (tLo > tHi) { const tmp = tLo; tLo = tHi; tHi = tmp; }
        tLo = Math.max(0, tLo); tHi = Math.min(1, tHi);
        if (tLo > tHi) continue;
        const xLo = A.x + tLo * (B.x - A.x);
        const xHi = A.x + tHi * (B.x - A.x);
        const segMin = Math.min(xLo, xHi);
        if (touchX === null || segMin < touchX) touchX = segMin;
      }
      // 2. Линия толщи — смещена на T «вниз» по нормали
      let touchThick = null;
      for (let i = 0; i < pts.length - 1; i++) {
        const A = pts[i], B = pts[i + 1];
        const dx = B.x - A.x, dy = B.y - A.y;
        const len = Math.hypot(dx, dy);
        if (len < 1e-6) continue;
        const nx = -dy / len, ny = dx / len;
        const Ax = A.x + nx * T, Ay = A.y + ny * T;
        const Bx = B.x + nx * T, By = B.y + ny * T;
        const ddy = By - Ay;
        let tLo, tHi;
        if (Math.abs(ddy) < 1e-6) {
          if (Ay >= yLo - 0.01 && Ay <= yHi + 0.01) { tLo = 0; tHi = 1; } else continue;
        } else if (ddy > 0) { tLo = (yLo - Ay) / ddy; tHi = (yHi - Ay) / ddy; }
        else { tLo = (yHi - Ay) / ddy; tHi = (yLo - Ay) / ddy; }
        if (tLo > tHi) { const tmp = tLo; tLo = tHi; tHi = tmp; }
        tLo = Math.max(0, tLo); tHi = Math.min(1, tHi);
        if (tLo > tHi) continue;
        const xLo = Ax + tLo * (Bx - Ax);
        const xHi = Ax + tHi * (Bx - Ax);
        const segMin = Math.min(xLo, xHi);
        if (touchThick === null || segMin < touchThick) touchThick = segMin;
      }
      if (touchThick !== null && (touchX === null || touchThick < touchX)) touchX = touchThick;
      // 3. Лицевая сторона — смещена на T/2 «вверх» по нормали
      let touchFace = null;
      for (let i = 0; i < pts.length - 1; i++) {
        const A = pts[i], B = pts[i + 1];
        const dx = B.x - A.x, dy = B.y - A.y;
        const len = Math.hypot(dx, dy);
        if (len < 1e-6) continue;
        const nx = -dy / len, ny = dx / len;
        const Ax = A.x + nx * (-T / 2), Ay = A.y + ny * (-T / 2);
        const Bx = B.x + nx * (-T / 2), By = B.y + ny * (-T / 2);
        const ddy = By - Ay;
        let tLo, tHi;
        if (Math.abs(ddy) < 1e-6) {
          if (Ay >= yLo - 0.01 && Ay <= yHi + 0.01) { tLo = 0; tHi = 1; } else continue;
        } else if (ddy > 0) { tLo = (yLo - Ay) / ddy; tHi = (yHi - Ay) / ddy; }
        else { tLo = (yHi - Ay) / ddy; tHi = (yLo - Ay) / ddy; }
        if (tLo > tHi) { const tmp = tLo; tLo = tHi; tHi = tmp; }
        tLo = Math.max(0, tLo); tHi = Math.min(1, tHi);
        if (tLo > tHi) continue;
        const xLo = Ax + tLo * (Bx - Ax);
        const xHi = Ax + tHi * (Bx - Ax);
        const segMin = Math.min(xLo, xHi);
        if (touchFace === null || segMin < touchFace) touchFace = segMin;
      }
      if (touchFace !== null && (touchX === null || touchFace < touchX)) touchX = touchFace;
    }
    S.bendStepMeta[bendIdx].stopperDist = touchX !== null ? Math.abs(touchX) : null;
  })();

  _simClearTimers();
  S.simAnimRunning = true;
  S.simAnimBendIdx = bendIdx;
  S.simAnimDirection = 1;
  S.simAnimProgress = 0;
  S.simAnimStartT = performance.now();
  S.simAnimOnDone = function () {
    S.simBentMarkers = S.simBentMarkers || [];
    if (!S.simBentMarkers.includes(bendIdx)) {
      S.simBentMarkers.push(bendIdx);
    }
    // v4.4: фиксируем подпись профиля, на которой накоплена последовательность.
    // При смене профиля (очистка/перерисовка) следующий вход в «Симуляцию»
    // обнаружит расхождение и начнёт с плоского листа.
    if (typeof simProfileSignature === 'function') S.simProfileSig = simProfileSignature();
    if (typeof updateSimButton === 'function') updateSimButton();
    if (onDone) onDone();
  };
  if (typeof updateSimButton === 'function') updateSimButton();
  _simRAF();
}

/**
 * Запустить анимацию разгибания гиба (только последнего).
 */
function startUnbendAnimation(bendIdx, onDone) {
  _simClearTimers();
  S.simAnimRunning = true;
  S.simAnimBendIdx = bendIdx;
  S.simAnimDirection = -1;
  S.simAnimProgress = 1;
  S.simAnimStartT = performance.now();
  S.simAnimOnDone = function () {
    S.simBentMarkers = (S.simBentMarkers || []).filter(i => i !== bendIdx);
    // Удалить метаданные этого гиба — он больше не входит в последовательность
    if (S.bendStepMeta) delete S.bendStepMeta[bendIdx];
    if (typeof updateSimButton === 'function') updateSimButton();
    if (onDone) onDone();
  };
  if (typeof updateSimButton === 'function') updateSimButton();
  _simRAF();
}

function _simRAF() {
  S.simSequenceRAF = requestAnimationFrame(_simTick);
}

function _simTick(now) {
  if (!S.simAnimRunning) return;
  const elapsed = now - S.simAnimStartT;
  const raw = Math.max(0, Math.min(1, elapsed / SIM_BEND_DURATION));
  S.simAnimProgress = (S.simAnimDirection === 1) ? raw : (1 - raw);

  if (typeof drawDrawCanvas === 'function') drawDrawCanvas();

  if (raw >= 1) {
    // ВАЖНО: сначала вызываем cb (добавляет bend в simBentMarkers),
    // потом сбрасываем состояние анимации и перерисовываем — иначе
    // заготовка визуально «отпрыгивает» обратно.
    S.simAnimRunning = false;
    S.simSequenceRAF = null;
    const cb = S.simAnimOnDone;
    S.simAnimOnDone = null;
    S.simAnimBendIdx = -1;
    S.simAnimProgress = 0;
    if (cb) cb();
    if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
  } else {
    _simRAF();
  }
}

function stopAnimation() {
  _simClearTimers();
  S.simAnimRunning = false;
  S.simAnimBendIdx = -1;
  S.simAnimProgress = 0;
  S.simSequenceStep = -1;
  S.simSequence = [];
  S.simAnimOnDone = null;
  if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
  if (typeof updateSimButton === 'function') updateSimButton();
}

function resetAllBends() {
  stopAnimation();
  S.simBentMarkers = [];
  S.selectedBendIndex = undefined;
  S.bendStepMeta = {};
  if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
  if (typeof renderToolButtons === 'function') renderToolButtons();
}

/**
 * Последовательная гибка всех ОСТАВШИХСЯ гибов в естественном порядке.
 */
function startSequenceAnimation() {
  if (!S.unfoldResult || !S.unfoldResult.bendInfos || S.unfoldResult.bendInfos.length === 0) return;
  _simClearTimers();
  const bentSet = S.simBentMarkers || [];
  const remaining = S.unfoldResult.bendInfos.map((b, i) => i).filter(i => !bentSet.includes(i));
  if (remaining.length === 0) {
    return;
  }
  S.simSequence = remaining;
  S.simSequenceStep = -1;
  _simSequenceNext();
  if (typeof updateSimButton === 'function') updateSimButton();
}

function _simSequenceNext() {
  if (!S.simSequence || S.simSequenceStep >= S.simSequence.length - 1) {
    S.simSequenceStep = -1;
    S.simSequence = [];
    if (typeof updateSimButton === 'function') updateSimButton();
    if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
    return;
  }
  S.simSequenceStep++;
  const bendIdx = S.simSequence[S.simSequenceStep];
  S.selectedBendIndex = bendIdx;
  startBendAnimation(bendIdx, function () {
    S.simSequenceTimer = setTimeout(_simSequenceNext, SIM_BETWEEN_DELAY);
  });
}

/**
 * Текущее состояние анимации для отрисовки.
 */
function getAnimInfo() {
  if (!S.simAnimRunning || S.simAnimBendIdx < 0) return null;
  const bends = S.unfoldResult ? (S.unfoldResult.bendInfos || []) : [];
  const bend = bends[S.simAnimBendIdx];
  if (!bend) return null;
  const targetHalf = targetHalfAngleForBend(bend);
  const halfAngle = easeInOutCubic(S.simAnimProgress) * targetHalf;
  const die = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
  const vWidth = die ? (die.vWidth || 10) : 10;
  const depth = punchDepthForHalfAngle(halfAngle, vWidth);
  return {
    animating: true,
    bendIdx: S.simAnimBendIdx,
    progress: S.simAnimProgress,
    direction: S.simAnimDirection,
    halfAngle,
    depth,
    interiorAngle: interiorAngleFromHalfAngle(halfAngle),
    sequenceStep: S.simSequenceStep,
    sequenceTotal: S.simSequence ? S.simSequence.length : 0
  };
}

// ==================== СБРОС СОСТОЯНИЯ ====================

function resetSimulation() {
  _simClearTimers();
  S.simAnimRunning = false;
  S.simAnimBendIdx = -1;
  S.simAnimProgress = 0;
  S.simAnimDirection = 1;
  S.simAnimOnDone = null;
  S.simSequence = [];
  S.simSequenceStep = -1;
  S.simBentMarkers = [];
  S.selectedBendIndex = undefined;
  S.simBentMarkers = [];
  S.bendStepMeta = {};
}

// ═══════════════════════════════════════════════════════════════
// CANVAS / VIEWPORT — холст рисования (draw-canvas): размеры,
// преобразование мир↔экран, поиск ближайшего сегмента
// ═══════════════════════════════════════════════════════════════

// Массив кликабельных областей для сегментов и точек
S._hitAreas = [];

// ==================== DRAWING CANVAS ====================
const drawCanvas = document.getElementById('draw-canvas');
const drawCtx = drawCanvas ? drawCanvas.getContext('2d') : null;
let canvasW = 400, canvasH = 300;
let isPanning = false, panStart = null, dragPtIdx = null;
let dragPunch = false;
let dragDie = false;
let measureStart = null, measureEnd = null, measureStep = 0;
let animFrame = 0;

// Мир → экран (Y инвертирован: мировой +Y вверх)
function w2c(wx, wy) {
  return { cx: wx * S.viewport.scale + S.viewport.offsetX, cy: -wy * S.viewport.scale + S.viewport.offsetY };
}
// Экран → мир
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

// Поиск сегмента рядом с курсором (для каймы/контекстного меню)
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

// ═══════════════════════════════════════════════════════════════
// CANVAS / HEM-2D — визуальные «крючки» каймы на холсте рисования
// и лицевая сторона профиля в режиме рисования
// ═══════════════════════════════════════════════════════════════

// ==================== HEM HOOKS (2D) ====================
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

// ==================== ЛИЦЕВАЯ СТОРОНА (режим рисования) ====================
/**
 * Голубая полоска вдоль профиля на ИСХОДНОЙ «верхней» грани.
 * Смещение = левая нормаль к направлению сегмента × (faceUp ? +1 : -1).
 * На вершинах — miter-join (усреднение нормалей соседних сегментов).
 */
function drawFaceSideDrawing(pts, ctx) {
  if (!pts || pts.length < 2) return;
  const T = S.metal.thickness || 1;
  const faceUp = (S.simFaceSide || 'up') === 'up';
  const sign = faceUp ? 1 : -1; // +1 = left normal, -1 = right normal
  const offset = (T / 2) * sign;

  // Нормали сегментов (left normal = поворот направления на +90° CCW в world coords)
  const segNormals = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i + 1].x - pts[i].x;
    const dy = pts[i + 1].y - pts[i].y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) {
      segNormals.push({ x: 0, y: 0 });
    } else {
      segNormals.push({ x: -dy / len, y: dx / len });
    }
  }

  // Смещённые точки (miter-join на вершинах)
  const facePts = [];
  for (let i = 0; i < pts.length; i++) {
    let nx, ny;
    if (i === 0) {
      nx = segNormals[0].x; ny = segNormals[0].y;
    } else if (i === pts.length - 1) {
      nx = segNormals[pts.length - 2].x;
      ny = segNormals[pts.length - 2].y;
    } else {
      const n1 = segNormals[i - 1], n2 = segNormals[i];
      nx = (n1.x + n2.x) / 2;
      ny = (n1.y + n2.y) / 2;
      const len = Math.hypot(nx, ny);
      if (len > 1e-6) { nx /= len; ny /= len; }
      else { nx = n1.x; ny = n1.y; }
    }
    facePts.push({ x: pts[i].x + nx * offset, y: pts[i].y + ny * offset });
  }

  // Голубая линия
  ctx.save();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  const first = w2c(facePts[0].x, facePts[0].y);
  ctx.moveTo(first.cx, first.cy);
  for (let i = 1; i < facePts.length; i++) {
    const c = w2c(facePts[i].x, facePts[i].y);
    ctx.lineTo(c.cx, c.cy);
  }
  ctx.stroke();
  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// CANVAS / DRAW — главный холст рисования: сетка, оси, профиль,
// размеры, точки, кайма, симуляция гибочного станка (2D)
// ═══════════════════════════════════════════════════════════════

function drawDrawCanvas() {
  if (!drawCtx) return;
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

  // ==================== РЕЖИМ СИМУЛЯЦИИ ====================
  // Накопительная симуляция гибочного станка:
  //  • Матрица снизу с V-ручьём (статичная)
  //  • Пуансон сверху — опускается в матрицу при гибке
  //  • Металл плавно деформируется: V-сгиб с углом = f(глубины)
  //  • Гибы НАКАПЛИВАЮТСЯ: каждый выполненный гиб сохраняется
  if (S.showToolsOnCanvas && S.unfoldResult && S.points.length >= 2) {
    const animInfo = getAnimInfo();
    const isAnimating = animInfo && animInfo.animating;
    const bentCount = (S.simBentMarkers || []).length;

    // Накопительный профиль (все выполненные гибы + анимируемый)
    const prof = computeAccumulatedProfile(animInfo);

    // === МАТРИЦА И ПУАНСОН (рисуются под профилем) ===
    drawPressBrakeTooling(isDark, animInfo);

    if (prof && prof.pts) {
      // Профиль: если есть согнутые гибы или анимация — оранжевым,
      // иначе (плоский) — зелёным
      if (bentCount > 0 || isAnimating) {
        drawBentProfile(prof.pts, drawCtx, isDark);
      } else {
        drawSimProfile(prof.pts, drawCtx, isDark);
      }
      // Лицевая сторона (голубой контур)
      if (typeof drawFaceSide === 'function') drawFaceSide(prof.pts, drawCtx, isDark);
      // Углы согнутых гибов (внутренний угол)
      if (typeof drawBendAngles === 'function') drawBendAngles(prof, drawCtx, isDark);
      // Маркеры с порядковыми номерами для согнутых
      drawSimMarkers(prof.bendMarkers, S.selectedBendIndex, drawCtx, isDark);
      // Подписи
      drawSimLabels(prof.bendMarkers.length, drawCtx, isDark, animInfo, bentCount);
      // Усилие гибки (в тоннах) — для выбранного/анимируемого гиба
      drawBendForceLabel(drawCtx, isDark, animInfo, prof.activeBendIdx);
      // Упор (задний упор гибочного пресса)
      if (typeof drawStopper === 'function') drawStopper(prof, isDark);
    }

    drawDrawCanvasSimDone = true;
  }

  // ==================== ПРОФИЛЬ (режим рисования) ====================
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

    // === Лицевая сторона (голубая полоска вдоль профиля) ===
    drawFaceSideDrawing(S.points, drawCtx);

    // ==================== РАЗМЕРЫ С УМНЫМ РАЗМЕЩЕНИЕМ ====================
    if (S.showDimensions) {

      function rectsOverlap(a, b, pad) {
        const p = pad || 3;
        const ox = Math.min(a.x + a.w / 2, b.x + b.w / 2) - Math.max(a.x - a.w / 2, b.x - b.w / 2);
        const oy = Math.min(a.y + a.h / 2, b.y + b.h / 2) - Math.max(a.y - a.h / 2, b.y - b.h / 2);
        return ox > p && oy > p;
      }

      const placed = [];
      const dimLabels = [];

      // 1. Подписи длин сегментов
      drawCtx.font = '10px monospace';
      for (let i = 0; i < S.points.length - 1; i++) {
        const sl = dist(S.points[i], S.points[i + 1]);
        const mx = (S.points[i].x + S.points[i + 1].x) / 2;
        const my = (S.points[i].y + S.points[i + 1].y) / 2;
        const mc = w2c(mx, my);
        const a = Math.atan2(S.points[i + 1].y - S.points[i].y, S.points[i + 1].x - S.points[i].x);
        const nX = -Math.sin(a), nY = Math.cos(a);
        const aX = Math.cos(a), aY = -Math.sin(a);
        const text = sl.toFixed(1);
        const tw = drawCtx.measureText(text).width + 8;

        const ideal = { x: mc.cx + nX * 14, y: mc.cy + nY * 14 };

        // Кандидаты: обе стороны нормали, разные дистанции, сдвиги вдоль сегмента
        const cands = [];
        const dists = [14, 26, 38, 52];
        const sides = [1, -1];
        const shifts = [0, -28, 28];
        for (const side of sides) {
          for (const d of dists) {
            for (const sh of shifts) {
              cands.push({
                x: mc.cx + nX * d * side + aX * sh,
                y: mc.cy + nY * d * side + aY * sh,
                rank: d * 3 + Math.abs(sh)
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

      // 2. Дуги углов + подписи углов
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

        // Дуга показывает угол поворота контура (внутренний угол = π − ba)
        const cs = -aIn + Math.PI;
        const ce = -aOut;
        let ds = ce - cs;
        while (ds > Math.PI) ds -= 2 * Math.PI;
        while (ds <= -Math.PI) ds += 2 * Math.PI;
        const ccw = ds < 0;

        drawCtx.beginPath();
        drawCtx.arc(p.cx, p.cy, ar, cs, ce, ccw);
        drawCtx.strokeStyle = infeasible ? '#ef4444' : (isDark ? '#fbbf24' : '#f59e0b');
        drawCtx.lineWidth = infeasible ? 3 : 1.5;
        drawCtx.stroke();
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

        const cands = [];
        const dists2 = [28, 38, 50, 64];
        for (const d of dists2) {
          for (let k = 0; k < 8; k++) {
            const ang = mid + k * Math.PI / 4;
            cands.push({
              x: p.cx + Math.cos(ang) * d,
              y: p.cy + Math.sin(ang) * d,
              rank: Math.abs(Math.atan2(Math.sin(ang - mid), Math.cos(ang - mid))) * 40 + d
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
        drawCtx.fillStyle = isDark ? 'rgba(26,26,46,0.82)' : 'rgba(255,255,255,0.88)';
        drawCtx.beginPath();
        if (drawCtx.roundRect) drawCtx.roundRect(label.x - bw / 2, label.y - bh / 2, bw, bh, 3);
        else drawCtx.rect(label.x - bw / 2, label.y - bh / 2, bw, bh);
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
          }
          drawCtx.font = 'bold 9px sans-serif';
          drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'middle';
          drawCtx.fillText((label.infeasible ? '⚠ ' : '') + label.text, label.x, label.y);
        }
        drawCtx.restore();
      });
    }
  }

  // ==================== ТОЧКИ ====================
  if (!drawDrawCanvasSimDone) {
    S._hitAreas = S._hitAreas || [];
    // Карта: vertexIndex -> номер гиба (1-indexed)
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
      // Label — только вершины гибов (совпадает с нумерацией развёртки)
      const bNum = bendNumMap[i];
      if (bNum) {
        const label = String(bNum);
        drawCtx.font = 'bold 8px monospace';
        const lw = drawCtx.measureText(label).width;
        const lx = cx + 10, ly = cy - 6;
        drawCtx.fillStyle = isDark ? '#2e1a0acc' : '#fff7edcc';
        drawCtx.beginPath();
        if (drawCtx.roundRect) drawCtx.roundRect(lx - 2, ly - 7, lw + 4, 10, 2);
        else drawCtx.rect(lx - 2, ly - 7, lw + 4, 10);
        drawCtx.fill();
        drawCtx.fillStyle = isDark ? '#fbbf24' : '#ea580c';
        drawCtx.textAlign = 'left'; drawCtx.textBaseline = 'middle';
        drawCtx.fillText(label, lx, ly - 2);
      }
      // Hit area для точки (для перетаскивания)
      S._hitAreas.push({ type: 'point', index: i, x: cx - 10, y: cy - 10, w: 20, h: 20 });
    });
  }

  // Кайма: подсветка наведённого сегмента
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

  // Кайма: «крючки» — только в режиме рисования (не симуляции).
  // В симуляции кайма отображается в согнутом профиле.
  if (!drawDrawCanvasSimDone) drawHemHooks2D();

  // Индикатор замыкания контура
  if ((S.toolMode === 'draw' || S.toolMode === 'select') && S.points.length >= 3 && S.mouseWorld) {
    // Только при рисовании от конца — у первой точки (двойной клик)
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
        cancelAnimationFrame(animFrame);
        animFrame = requestAnimationFrame(drawDrawCanvas);
        return;
      }
    }
  }

  // Индикатор привязки к точке
  if (S.toolMode === 'draw' && S.snapEndpoint >= 0 && S.snapEndpoint < S.points.length) {
    const sp = w2c(S.points[S.snapEndpoint].x, S.points[S.snapEndpoint].y);
    drawCtx.strokeStyle = '#06b6d4';
    drawCtx.lineWidth = 2.5;
    drawCtx.beginPath();
    drawCtx.arc(sp.cx, sp.cy, 12, 0, Math.PI * 2);
    drawCtx.stroke();
  }

  // Резинка (rubber band)
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

  // Инструмент измерения
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
    if (drawCtx.roundRect) drawCtx.roundRect(mxc - lw2 / 2 - 4, myc - 18, lw2 + 8, 16, 3);
    else drawCtx.rect(mxc - lw2 / 2 - 4, myc - 18, lw2 + 8, 16);
    drawCtx.fill();
    drawCtx.fillStyle = mc;
    drawCtx.textAlign = 'center'; drawCtx.textBaseline = 'middle';
    drawCtx.fillText(lb, mxc, myc - 10);
  }

  // Крестик мыши
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

  // ==================== ИНСТРУМЕНТЫ НА ХОЛСТЕ (масштаб 1:1) ====================
  // Во время симуляции инструменты рисуются в drawPressBrakeTooling —
  // здесь только при включённых инструментах БЕЗ активной симуляции,
  // иначе матрица задвоится.
  if (S.showToolsOnCanvas && !drawDrawCanvasSimDone) {
    drawToolsOnCanvas(isDark);
  }
}

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
 * листом) до внутренней поверхности листа (-T/2) по прогрессу гибки.
 * В покое (нет анимации) пуансон отведён вверх — как на реальном
 * станке после выполнения гиба.
 * Возвращает Y-координату вершины пуансона (мировая система).
 */
function punchTipWorldY(animInfo) {
  const T = S.metal.thickness || 1;
  const restY = T / 2 + SIM_PUNCH_LIFT;
  if (!animInfo || !animInfo.animating) return restY;
  const p = Math.max(0, Math.min(1, animInfo.progress));
  const e = easeInOutCubic(p);
  return restY * (1 - e) + (-T / 2) * e;
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
      // Кастомный пуансон — реальный DXF-профиль + анимация погружения
      const offX = -(punch.profile.minX + punch.profile.width / 2) + pOX;
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
}

// ═══════════════════════════════════════════════════════════════
// УПОР (задний упор гибочного пресса), 2D
// Прямоугольник 20×8 мм, скользит по X ≤ 0, касается контура
// заготовки. При анимации отъезжает назад на 100 мм (easeInOut).
// ═══════════════════════════════════════════════════════════════

/**
 * Находит минимальную X-координату в полосе [yLo, yHi] для контура,
 * смещённого по нормали на offset мм.
 * offset > 0 — смещение «вниз» (по Y мира), offset < 0 — «вверх».
 */
function findMinXInBand(pts, yLo, yHi, offset) {
  let minX = null;
  for (let i = 0; i < pts.length - 1; i++) {
    const A = pts[i], B = pts[i + 1];
    const dx = B.x - A.x, dy = B.y - A.y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) continue;
    // Нормаль, направленная «вниз» (по Y мира)
    const nx = -dy / len, ny = dx / len;
    // Смещённые концы сегмента
    const Ax = A.x + nx * offset, Ay = A.y + ny * offset;
    const Bx = B.x + nx * offset, By = B.y + ny * offset;
    // Пересечение со полосой
    const ddy = By - Ay;
    let tLo, tHi;
    if (Math.abs(ddy) < 1e-6) {
      if (Ay >= yLo - 0.01 && Ay <= yHi + 0.01) { tLo = 0; tHi = 1; }
      else continue;
    } else if (ddy > 0) {
      tLo = (yLo - Ay) / ddy;
      tHi = (yHi - Ay) / ddy;
    } else {
      tLo = (yHi - Ay) / ddy;
      tHi = (yLo - Ay) / ddy;
    }
    if (tLo > tHi) { const tmp = tLo; tLo = tHi; tHi = tmp; }
    tLo = Math.max(0, tLo);
    tHi = Math.min(1, tHi);
    if (tLo > tHi) continue;
    const xLo = Ax + tLo * (Bx - Ax);
    const xHi = Ax + tHi * (Bx - Ax);
    const segMin = Math.min(xLo, xHi);
    if (minX === null || segMin < minX) minX = segMin;
  }
  return minX;
}

function drawStopper(prof, isDark) {
  if (!S.stopperVisible || !prof || !prof.pts || prof.pts.length < 1) return;
  // Правый край упора = самая левая точка касания с ЛЮБОЙ линией контура:
  // основной контур, линия толщи, лицевая сторона.
  const w = 20, h = 8;
  const yLo = -h / 2, yHi = h / 2;
  const T = S.metal.thickness || 1;
  const pts = prof.pts;

  // 1. Основной контур (offset = 0)
  let touchX = findMinXInBand(pts, yLo, yHi, 0);
  // 2. Линия толщи — смещена на T «вниз» по нормали
  let touchThick = findMinXInBand(pts, yLo, yHi, T);
  // 3. Лицевая сторона — смещена на T/2 «вверх» по нормали
  let touchFace = findMinXInBand(pts, yLo, yHi, -T / 2);

  // Берём самую левую точку касания среди всех трёх линий
  if (touchThick !== null && (touchX === null || touchThick < touchX)) touchX = touchThick;
  if (touchFace !== null && (touchX === null || touchFace < touchX)) touchX = touchFace;

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
  const label = (S.lang === 'ru' ? 'Упор ' : 'Stop ') + (Math.abs(right).toFixed(1)) + ' мм';
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
  // v4.4 FIX: если профиль изменился с последнего открытия 3D — сброс
  // шагов (раньше модалка открывалась «уже частично согнутой» по старой
  // детали, помогало только обновление страницы).
  const sigOpen = (typeof simProfileSignature === 'function') ? simProfileSignature() : null;
  if (sim3dStepBends.length > 0 && sim3dProfileSig && sigOpen !== sim3dProfileSig) {
    if (typeof sim3dResetForNewProfile === 'function') sim3dResetForNewProfile();
  }
  sim3dProfileSig = sigOpen;
  modal.classList.remove('hidden');
  sim3dModalOpen = true;
  sim3dUserZoomed = false;
  requestAnimationFrame(() => {
    resize3DSimCanvas();
    draw3DSimulation();
  });
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

// Главная функция 3D-симуляции: рисует матрицу, пуансон, упор и контур
// заготовки (из computeAccumulatedProfile) в 3D, который можно вращать.
function draw3DSimulation() {
  const cv = document.getElementById('sim3d-canvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const isDark = S.isDark;

  ctx.fillStyle = isDark ? '#1a1a2e' : '#f5f5f5';
  ctx.fillRect(0, 0, sim3dW, sim3dH);

  if (!S.unfoldResult || S.points.length < 2) {
    ctx.fillStyle = isDark ? '#999' : '#666';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(S.lang === 'ru' ? 'Нарисуйте профиль для 3D-симуляции' : 'Draw a profile for 3D simulation', sim3dW / 2, sim3dH / 2);
    return;
  }

  // v4.5: шаги строим ДО расчёта профиля — «Плоской» и шагам нужен первый
  // гиб последовательности и его meta (ориентация заготовки ДО 1-го гиба).
  const allBends = (S.unfoldResult && S.unfoldResult.bendInfos) ? S.unfoldResult.bendInfos.map((b, i) => i) : [];
  if (sim3dStepBends.length === 0 && (S.simBentMarkers || []).length > 0) sim3dStepBends = (S.simBentMarkers || []).slice();
  if (sim3dStepBends.length === 0) sim3dStepBends = allBends.slice();
  // v4.4: шаги (пере)строены — фиксируем подпись профиля, для которого
  // они построены (для детекта смены детали при следующем открытии).
  if (sim3dStepBends.length > 0) sim3dProfileSig = (typeof simProfileSignature === 'function') ? simProfileSignature() : null;

  // Step mode: sim3dStepIdx controls which bends are applied
  const savedBent = S.simBentMarkers, savedSel = S.selectedBendIndex, savedAnimR = S.simAnimRunning, savedAnimP = S.simAnimProgress, savedAnimB = S.simAnimBendIdx, savedFX = S.simFlipX, savedFY = S.simFlipY;
  // Запоминаем, какой flipX/flipY/faceSide реально использовался для расчёта
  // prof, чтобы faceSignSim в 3D был согласован с профилем.
  let usedFlipX = savedFX, usedFlipY = savedFY, usedFaceSide = S.simFaceSide || 'up';
  let prof;
  if (sim3dStepIdx === -1) {
    // Плоский профиль — позиционируем по первому гибу (как в 2D-симуляции):
    // первый гиб в (0,0), входная полка горизонтальна в -X.
    const hasBends = S.unfoldResult && S.unfoldResult.bendInfos && S.unfoldResult.bendInfos.length > 0;
    if (hasBends) {
      // v4.5: якорь «Плоской» — первый гиб ПОСЛЕДОВАТЕЛЬНОСТИ (порядок
      // гибки может отличаться от индексов 0,1,2…), а ориентация —
      // состояние ДО первого гиба из bendStepMeta его шага. Раньше
      // наследовались ТЕКУЩИЕ глобальные simFlipX/simFlipY — включённый
      // перед вторым гибом ↔X зеркалил и плоскую заготовку.
      const firstStepBend = sim3dStepBends.length > 0 ? sim3dStepBends[0] : 0;
      S.simBentMarkers = []; S.selectedBendIndex = firstStepBend;
      S.simAnimRunning = false; S.simAnimBendIdx = -1; S.simAnimProgress = 0;
      const flatMeta = (S.bendStepMeta || {})[firstStepBend];
      if (flatMeta) {
        S.simFlipX = !!flatMeta.flipX; S.simFlipY = !!flatMeta.flipY;
        usedFlipX = S.simFlipX; usedFlipY = S.simFlipY;
        if (flatMeta.faceSide === 'up' || flatMeta.faceSide === 'down') usedFaceSide = flatMeta.faceSide;
      }
      prof = computeAccumulatedProfile({ bendIdx: firstStepBend, progress: 0, animating: false });
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
    const appliedCount = sim3dAnimRunning ? sim3dStepIdx : sim3dStepIdx + 1;
    S.simBentMarkers = sim3dStepBends.slice(0, Math.min(appliedCount, sim3dStepBends.length));
    S.selectedBendIndex = sim3dStepBends[sim3dStepIdx] !== undefined ? sim3dStepBends[sim3dStepIdx] : undefined;
    const stepBendIdx = sim3dStepBends[sim3dStepIdx];
    const stepMeta = (S.bendStepMeta || {})[stepBendIdx];
    // v4.5 FIX («первый шаг уже перевёрнут по X»): ориентация заготовки
    // шага N — из bendStepMeta гиба ЭТОГО шага (записана на момент гибки),
    // а НЕ текущие глобальные simFlipX/simFlipY. Раньше финальный ↔X
    // применялся ко ВСЕМ шагам: «лицевая → гиб 1 → ↔X → гиб 2» — и 3D
    // показывал шаг 1 уже перевёрнутым по X («разворот по Z на 180°»),
    // хотя переворот был сделан только перед вторым гибом. Если meta нет
    // (гиб ещё не выполнялся в 2D) — берём текущие глобальные (последняя
    // известная ориентация). simFlipY не меняет направление гиба — только
    // отражает геометрию; направление гиба определяется только
    // bend.deflection. Состояние восстанавливается после отрисовки.
    if (stepMeta) {
      S.simFlipX = !!stepMeta.flipX; S.simFlipY = !!stepMeta.flipY;
      usedFlipX = S.simFlipX; usedFlipY = S.simFlipY;
      if (stepMeta.faceSide === 'up' || stepMeta.faceSide === 'down') usedFaceSide = stepMeta.faceSide;
    } else {
      S.simFlipX = !!savedFX; S.simFlipY = !!savedFY;
    }
    if (sim3dAnimRunning) {
      S.simAnimRunning = true; S.simAnimBendIdx = sim3dStepBends[sim3dStepIdx]; S.simAnimProgress = sim3dAnimProgress;
    } else { S.simAnimRunning = false; S.simAnimBendIdx = -1; S.simAnimProgress = 0; }
    let animInfo3d = getAnimInfo();
    if (animInfo3d) {
      animInfo3d._is3d = true; // flipY уже применён между гибами
      prof = computeAccumulatedProfile(animInfo3d);
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
  // от уровня покоя (T/2 + SIM_PUNCH_LIFT) до внутренней поверхности -T/2.
  let animInfoForPunch = null;
  if (sim3dAnimRunning && sim3dStepIdx >= 0) {
    animInfoForPunch = { animating: true, progress: sim3dAnimProgress };
  } else if (S.simAnimRunning && S.simAnimBendIdx >= 0) {
    // 2D-анимация идёт (живое зеркало) — пуансон следует за ней
    animInfoForPunch = { animating: true, progress: S.simAnimProgress };
  }
  const punchTipY = punchTipWorldY(animInfoForPunch);

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
  // === ПУАНСОН (серый, опускается при анимации) ===
  // Смещение: центр по X → 0, вершина → punchTipY (анимация погружения).
  if (punch) {
    const pOX = S.punchOffsetX||0, pOY = S.punchOffsetY||0;
    if (punch.profile && punch.profile.chains && punch.profile.chains.length > 0) {
      // Кастомный пуансон — DXF-контур как выдавленный профиль (по Z)
      const offX = -(punch.profile.minX + punch.profile.width / 2) + pOX;
      const offY = -punch.profile.minY + pOY + punchTipY;
      punch.profile.chains.forEach(chain => {
        if (!chain || chain.length < 2) return;
        const front = chain.map(p => project3DSim(p.x + offX + toolCx, p.y + offY + toolCy, -hw, panX, panY));
        const back = chain.map(p => project3DSim(p.x + offX + toolCx, p.y + offY + toolCy, hw, panX, panY));
        faces.push({ pts: front, z: Math.max.apply(null, front.map(p=>p.z)), fill: isDark?'#6b7280':'#9ca3af', stroke:isDark?'#9ca3af':'#4b5563' });
        faces.push({ pts: back, z: Math.max.apply(null, back.map(p=>p.z)), fill: isDark?'#4b5563':'#6b7280', stroke:isDark?'#6b7280':'#374151' });
        for (let i = 0; i < chain.length; i++) { const ni = (i+1)%chain.length;
          faces.push({ pts: [front[i],front[ni],back[ni],back[i]], z: Math.max(front[i].z,front[ni].z,back[ni].z,back[i].z), fill: isDark?'#4b5563':'#6b7280', stroke:isDark?'#6b7280':'#374151' }); }
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
      faces.push({ pts:[pp[0],pp[1],pp[2],pp[3]], z:Math.max(pp[0].z,pp[1].z,pp[2].z,pp[3].z), fill:isDark?'#6b7280':'#9ca3af', stroke:isDark?'#9ca3af':'#4b5563' });
      faces.push({ pts:[pp[4],pp[5],pp[6],pp[7]], z:Math.max(pp[4].z,pp[5].z,pp[6].z,pp[7].z), fill:isDark?'#4b5563':'#6b7280', stroke:isDark?'#6b7280':'#374151' });
      faces.push({ pts:[pp[0],pp[3],pp[7],pp[4]], z:Math.max(pp[0].z,pp[3].z,pp[7].z,pp[4].z), fill:isDark?'#4b5563':'#6b7280', stroke:isDark?'#6b7280':'#374151' });
      faces.push({ pts:[pp[1],pp[2],pp[6],pp[5]], z:Math.max(pp[1].z,pp[2].z,pp[6].z,pp[5].z), fill:isDark?'#4b5563':'#6b7280', stroke:isDark?'#6b7280':'#374151' });
      faces.push({ pts:[pp[0],pp[1],pp[5],pp[4]], z:Math.max(pp[0].z,pp[1].z,pp[5].z,pp[4].z), fill:isDark?'#374151':'#4b5563', stroke:isDark?'#6b7280':'#374151' });
      faces.push({ pts:[pp[3],pp[2],pp[6],pp[7]], z:Math.max(pp[3].z,pp[2].z,pp[6].z,pp[7].z), fill:isDark?'#6b7280':'#9ca3af', stroke:isDark?'#9ca3af':'#4b5563' });
    }
  }
  // === УПОР (серый) — позиция из профиля ШАГА ===
  let stopperLabelInfo = null;
  (function draw3DStopper() {
    const sw = 20, sh = 8;
    const yLo = -sh / 2, yHi = sh / 2;
    function touchXOf(profile) {
      if (!profile || !profile.pts || profile.pts.length < 1) return null;
      const T = S.metal.thickness || 1;
      const pts = profile.pts;
      let tx = null;
      // 1. Основной контур
      for (let i = 0; i < pts.length - 1; i++) {
        const A = pts[i], B = pts[i + 1];
        const dy = B.y - A.y;
        let tLo, tHi;
        if (Math.abs(dy) < 1e-6) {
          if (A.y >= yLo - 0.01 && A.y <= yHi + 0.01) { tLo = 0; tHi = 1; } else continue;
        } else if (dy > 0) { tLo = (yLo - A.y) / dy; tHi = (yHi - A.y) / dy; }
        else { tLo = (yHi - A.y) / dy; tHi = (yLo - A.y) / dy; }
        if (tLo > tHi) { const tmp = tLo; tLo = tHi; tHi = tmp; }
        tLo = Math.max(0, tLo); tHi = Math.min(1, tHi);
        if (tLo > tHi) continue;
        const xLo = A.x + tLo * (B.x - A.x);
        const xHi = A.x + tHi * (B.x - A.x);
        const segMin = Math.min(xLo, xHi);
        if (tx === null || segMin < tx) tx = segMin;
      }
      // 2. Линия толщи — смещена на T «вниз» по нормали
      for (let i = 0; i < pts.length - 1; i++) {
        const A = pts[i], B = pts[i + 1];
        const dx = B.x - A.x, dy = B.y - A.y;
        const len = Math.hypot(dx, dy);
        if (len < 1e-6) continue;
        const nx = -dy / len, ny = dx / len;
        const Ax = A.x + nx * T, Ay = A.y + ny * T;
        const Bx = B.x + nx * T, By = B.y + ny * T;
        const ddy = By - Ay;
        let tLo, tHi;
        if (Math.abs(ddy) < 1e-6) {
          if (Ay >= yLo - 0.01 && Ay <= yHi + 0.01) { tLo = 0; tHi = 1; } else continue;
        } else if (ddy > 0) { tLo = (yLo - Ay) / ddy; tHi = (yHi - Ay) / ddy; }
        else { tLo = (yHi - Ay) / ddy; tHi = (yLo - Ay) / ddy; }
        if (tLo > tHi) { const tmp = tLo; tLo = tHi; tHi = tmp; }
        tLo = Math.max(0, tLo); tHi = Math.min(1, tHi);
        if (tLo > tHi) continue;
        const xLo = Ax + tLo * (Bx - Ax);
        const xHi = Ax + tHi * (Bx - Ax);
        const segMin = Math.min(xLo, xHi);
        if (tx === null || segMin < tx) tx = segMin;
      }
      // 3. Лицевая сторона — смещена на T/2 «вверх» по нормали
      for (let i = 0; i < pts.length - 1; i++) {
        const A = pts[i], B = pts[i + 1];
        const dx = B.x - A.x, dy = B.y - A.y;
        const len = Math.hypot(dx, dy);
        if (len < 1e-6) continue;
        const nx = -dy / len, ny = dx / len;
        const Ax = A.x + nx * (-T / 2), Ay = A.y + ny * (-T / 2);
        const Bx = B.x + nx * (-T / 2), By = B.y + ny * (-T / 2);
        const ddy = By - Ay;
        let tLo, tHi;
        if (Math.abs(ddy) < 1e-6) {
          if (Ay >= yLo - 0.01 && Ay <= yHi + 0.01) { tLo = 0; tHi = 1; } else continue;
        } else if (ddy > 0) { tLo = (yLo - Ay) / ddy; tHi = (yHi - Ay) / ddy; }
        else { tLo = (yHi - Ay) / ddy; tHi = (yLo - Ay) / ddy; }
        if (tLo > tHi) { const tmp = tLo; tLo = tHi; tHi = tmp; }
        tLo = Math.max(0, tLo); tHi = Math.min(1, tHi);
        if (tLo > tHi) continue;
        const xLo = Ax + tLo * (Bx - Ax);
        const xHi = Ax + tHi * (Bx - Ax);
        const segMin = Math.min(xLo, xHi);
        if (tx === null || segMin < tx) tx = segMin;
      }
      return tx;
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
    const stopperLeft = stopperCenterX - sw / 2;
    const stopperRight = stopperCenterX + sw / 2;
    const stopperTop = sh / 2;
    const stopperBottom = -sh / 2;
    const sc = [[stopperLeft, stopperBottom, -hw], [stopperRight, stopperBottom, -hw], [stopperRight, stopperTop, -hw], [stopperLeft, stopperTop, -hw],
      [stopperLeft, stopperBottom, hw], [stopperRight, stopperBottom, hw], [stopperRight, stopperTop, hw], [stopperLeft, stopperTop, hw]];
    const sp = sc.map(p => project3DSim(p[0] + toolCx, p[1] + toolCy, p[2], panX, panY));
    [[sp[0], sp[1], sp[2], sp[3]], [sp[4], sp[5], sp[6], sp[7]], [sp[0], sp[4], sp[7], sp[3]], [sp[1], sp[5], sp[6], sp[2]], [sp[0], sp[1], sp[5], sp[4]], [sp[3], sp[2], sp[6], sp[7]]].forEach(s =>
      faces.push({ pts: s, z: Math.max.apply(null, s.map(p => p.z)), fill: isDark ? '#6b7280' : '#9ca3af', stroke: isDark ? '#9ca3af' : '#4b5563' }));
    const labelC = project3DSim(stopperCenterX + toolCx, stopperTop + toolCy, 0, panX, panY);
    stopperLabelInfo = { x: labelC.x, y: labelC.y, text: (S.lang === 'ru' ? 'Упор ' : 'Stop ') + Math.abs(stopperRight).toFixed(1) + ' мм' };
  })();
  // === МЕТАЛЛ (серое тело, синяя лицевая сторона) ===
  // Чётность физического переворота для ЛИЦА должна совпадать с
  // ОТОБРАЖАЕМОЙ геометрией (v4.2): в режиме шагов геометрия содержит
  // только перевороты из bendStepMeta (дельта не применяется) → берём
  // чётность из meta гиба текущего шага; в «плоской»/живом режиме —
  // usedFlipY (v4.5: для «Плоской» — тоже из meta, исторический).
  // Раньше лицо бралось от глобального S.simFlipY и на исторических
  // шагах рисовалось не с той стороны.
  let faceParity3d;
  if (sim3dStepIdx >= 0 && sim3dStepBends.length > 0) {
    faceParity3d = getBendStepFlipY(sim3dStepBends[Math.min(sim3dStepIdx, sim3dStepBends.length - 1)]);
  } else {
    faceParity3d = !!usedFlipY;
  }
  // v4.5: faceSide — исторический (из meta шага), не текущий глобальный
  const faceSignSim = (usedFaceSide === 'up' ? 1 : -1)
    * (usedFlipX ? -1 : 1)
    * (faceParity3d ? -1 : 1);
  for (let i = 0; i < prof.pts.length - 1; i++) {
    const dx = prof.pts[i+1].x - prof.pts[i].x, dy = prof.pts[i+1].y - prof.pts[i].y;
    const len = Math.hypot(dx, dy);
    const nx = len > 0 ? -dy/len*faceSignSim*(T/2) : 0;
    const ny = len > 0 ? dx/len*faceSignSim*(T/2) : 0;
    // v4.4 FIX: знак глубины нормали сегмента относительно направления
    // взгляда. Проекция: z2 = y·sinX + (x·sinY + z·cosY)·cosX → градиент
    // глубины по мировым осям: ∂z2/∂x = sinY·cosX, ∂z2/∂y = sinX.
    // Если (nx,ny)·grad > 0 — лицевая поверхность (смещение +n) ближе
    // к камере. Раньше порядок «лицо/изнанка» задавался только знаком
    // rotX — это верно лишь для горизонтальных полок, а на вертикальных
    // и наклонных лицевая «залипала» при обходе камеры вокруг детали.
    // Теперь ЛЮБОЙ минимальный наклон камеры от плоскости сегмента
    // сразу меняет видимую сторону.
    const nDepth = len > 0 ? (nx * Math.sin(sim3dRotY) * Math.cos(sim3dRotX) + ny * Math.sin(sim3dRotX)) : 0;
    const fb = nDepth > 0 ? 1 : -1; // +1 — лицевая поверхность ближе к камере
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
    // Лицевая поверхность (синяя) — isFace для direction-aware сортировки
    faces.push({ pts: [p0f,p1f,p2f,p3f], z: Math.max(p0f.z,p1f.z,p2f.z,p3f.z), fill: faceFill, stroke: faceStroke, isFace: true, fb: fb });
    // Обратная поверхность (серая) — isBack
    faces.push({ pts: [p0,p1,p2,p3], z: Math.max(p0.z,p1.z,p2.z,p3.z), fill: isDark?'#4b5563':'#6b7280', stroke: metalStroke, isBack: true, fb: -fb });
    // Торцы (серые)
    faces.push({ pts: [p0,p1,p1f,p0f], z: Math.max(p0.z,p1.z,p1f.z,p0f.z), fill: metalFill, stroke: metalStroke });
    faces.push({ pts: [p3,p2,p2f,p3f], z: Math.max(p3.z,p2.z,p2f.z,p3f.z), fill: isDark?'#4b5563':'#6b7280', stroke: metalStroke });
  }
  // Сортировка по глубине (painter's algorithm): ВОЗРАСТАНИЕ z2.
  // z2 = -(depth), большая z2 = ближе к камере.
  // v4.4: пара «лицо/изнанка» тонкого металла упорядочивается по
  // ГЕОМЕТРИЧЕСКОМУ знаку нормали сегмента (fb) — видимая сторона
  // меняется при минимальном наклоне камеры от плоскости листа
  // (раньше — только по знаку rotX, что неверно для вертикальных/
  // наклонных полок: лицевая показывалась даже при взгляде на изнанку).
  faces.sort((a,b) => {
    let as=0,bs=0; for(let k=0;k<a.pts.length;k++)as+=a.pts[k].z; for(let k=0;k<b.pts.length;k++)bs+=b.pts[k].z;
    const aAvg=as/a.pts.length, bAvg=bs/b.pts.length;
    const dz = Math.abs(aAvg - bAvg);
    if (dz < 4 && ((a.isFace && b.isBack) || (a.isBack && b.isFace))) {
      return (a.fb || 0) - (b.fb || 0);
    }
    return aAvg - bAvg;
  });
  faces.forEach(f => { ctx.beginPath(); ctx.moveTo(f.pts[0].x,f.pts[0].y); for(let k=1;k<f.pts.length;k++)ctx.lineTo(f.pts[k].x,f.pts[k].y); ctx.closePath(); ctx.fillStyle=f.fill; ctx.fill(); ctx.strokeStyle=f.stroke; ctx.lineWidth=1; ctx.stroke(); });
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
  // === КНОПКИ ШАГОВ ===
  // v4.5: построение sim3dStepBends перенесено В НАЧАЛО draw3DSimulation
  // (до расчёта профиля) — «Плоская» и шаги используют первый гиб
  // последовательности и его meta.
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
    ctx.fillStyle = isActive ? '#7c3aed' : (isDark ? '#374151' : '#e5e7eb');
    ctx.strokeStyle = isActive ? '#a855f7' : (isDark ? '#4b5563' : '#9ca3af');
    ctx.lineWidth = 1.5; ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, 4); else ctx.rect(x, y, w, h);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = isActive ? '#fff' : (isDark ? '#d1d5db' : '#374151');
    ctx.font = 'bold ' + (w < 48 ? 9 : 11) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, x+w/2, y+h/2);
    sim3dStepBtnRects.push({x, y, w, h, step: stepIdx});
  }
  const short = btnW < 48;
  drawStepBtn(btnsX0, btnsY, btnW, btnH, short ? '⏵' : '⏵ Плоская', sim3dStepIdx===-1, -1);
  for (let si = 0; si < sim3dStepBends.length; si++) drawStepBtn(btnsX0+(si+1)*(btnW+btnGap), btnsY, btnW, btnH, short ? (''+(si+1)) : ('Шаг '+(si+1)), sim3dStepIdx===si, si);
  drawStepBtn(btnsX0+(sim3dStepBends.length+1)*(btnW+btnGap), btnsY, btnW, btnH, short ? '↺' : '↺ Сброс', false, -2);
  drawStepBtn(btnsX0+(sim3dStepBends.length+2)*(btnW+btnGap), btnsY, btnW+extraW, btnH, short ? '▶' : '▶ Полная', false, -3);
  ctx.fillStyle = isDark?'#666':'#999'; ctx.font='10px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top';
  const hint = sim3dW < 500
    ? (S.lang==='ru' ? 'Палец — вращение • Клик по шагу — гибка' : 'Touch rotate • Tap step')
    : (S.lang==='ru' ? 'ЛКМ — вращение • ПКМ — панорама • Колёсико — зум • Клик по шагу — гибка' : 'LMB rotate • RMB pan • Wheel zoom • Click step');
  ctx.fillText(hint, 10, 10);
}

// ==================== АНИМАЦИЯ ШАГОВ ====================
let sim3dStepBends = [], sim3dStepIdx = -1, sim3dAnimProgress = 0, sim3dAnimRunning = false, sim3dAnimStartT = 0, sim3dAnimRAF = null;
let sim3dStepBtnRects = [];
let sim3dPanX = 0, sim3dPanY = 0, isPanning3DSim = false, sim3dPanStart = null;
let sim3dFullSimRunning = false, sim3dFullSimStep = 0;
let sim3dProfileSig = null; // v4.4: подпись профиля, для которой построены шаги 3D

// v4.4: сброс шагов 3D-симуляции при смене профиля — модалка не должна
// открываться «уже частично согнутой» по старой детали.
function sim3dResetForNewProfile() {
  sim3dStopAnim();
  sim3dFullSimRunning = false;
  sim3dStepBends = [];
  sim3dStepIdx = -1;
  sim3dAnimProgress = 0;
  sim3dPanX = 0; sim3dPanY = 0;
  sim3dProfileSig = (typeof simProfileSignature === 'function') ? simProfileSignature() : null;
}

// v4.5 FIX: виды «слева»/«справа» — ДРУГИЕ плоскости. «Спереди/сзади»
// для оператора станка — взгляды вдоль оси ПОДАЧИ X (оператор со стороны
// +X: матрица и пуансон тянутся слева-направо по Z, заготовка подаётся
// от него). v4.4 ставила rotY=∓π/2 — камера с концов оси X, т.е. именно
// «спереди/сзади», что пользователь и наблюдал («вид справа сейчас это
// вид спереди, а слева — сзади»). Настоящие виды СБОКУ — с концов ЛИНИИ
// ГИБА (ось Z, ширина листа), слева/справа от оператора:
//   • вид СЛЕВА = камера со стороны +Z (слева от оператора): сечение
//     профиля видно как на 2D-чертеже — X вправо, Y вверх (rotY=0);
//   • вид СПРАВА = камера со стороны −Z (справа от оператора): то же
//     сечение зеркально (rotY=π).
// Небольшой подъём rotX, чтобы поверхности не были строго «на ребро»,
// панорама/зум сбрасываются для чистого ракурса.
function sim3dSetView(dir) {
  if (dir === 'left') sim3dRotY = 0;
  else if (dir === 'right') sim3dRotY = Math.PI;
  else return;
  sim3dRotX = 0.35;
  sim3dPanX = 0; sim3dPanY = 0;
  sim3dUserZoomed = false; // авто-вписать сцену в новый вид
  if (sim3dModalOpen) draw3DSimulation();
}

function sim3dStartStepAnim(stepIdx) {
  if (stepIdx < 0 || stepIdx >= sim3dStepBends.length) return;
  sim3dStepIdx = stepIdx; sim3dAnimProgress = 0; sim3dAnimRunning = true; sim3dAnimStartT = performance.now();
  if (sim3dAnimRAF) cancelAnimationFrame(sim3dAnimRAF);
  // НЕ модифицируем глобальные S.simFlipX/simFlipY здесь — draw3DSimulation
  // временно ставит их и восстанавливает после отрисовки.
  sim3dAnimTick();
}
function sim3dAnimTick() {
  if (!sim3dAnimRunning) return;
  const elapsed = performance.now() - sim3dAnimStartT;
  // Длительность шага 1800мс — комфортный темп
  sim3dAnimProgress = Math.max(0, Math.min(1, elapsed / 1800));
  draw3DSimulation();
  if (sim3dAnimProgress >= 1) {
    // Шаг завершён: фиксируем состояние ПОСЛЕ шага (гиб входит в набор)
    sim3dAnimRunning = false;
    sim3dAnimProgress = 0;
    draw3DSimulation();
  }
  else sim3dAnimRAF = requestAnimationFrame(sim3dAnimTick);
}
function sim3dStopAnim() { sim3dAnimRunning = false; if (sim3dAnimRAF) cancelAnimationFrame(sim3dAnimRAF); sim3dAnimRAF = null; }
function sim3dStartFullSim() {
  if (sim3dStepBends.length === 0) return;
  sim3dFullSimRunning = true; sim3dFullSimStep = 0; sim3dStepIdx = -1;
  sim3dFullSimNextStep();
}
function sim3dFullSimNextStep() {
  if (!sim3dFullSimRunning) return;
  if (sim3dFullSimStep >= sim3dStepBends.length) { sim3dFullSimRunning = false; sim3dStepIdx = sim3dStepBends.length; draw3DSimulation(); return; }
  sim3dStartStepAnim(sim3dFullSimStep);
  // Пауза между шагами: анимация 1800мс + пауза 700мс ≈ 2.5с на шаг
  setTimeout(function() { sim3dFullSimStep++; sim3dFullSimNextStep(); }, 1800 + 700);
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
          if (btn.step === -2) { sim3dStepIdx = -1; sim3dStepBends = []; draw3DSimulation(); }
          else if (btn.step === -3) sim3dStartFullSim();
          else if (btn.step === -1) { sim3dStepIdx = -1; sim3dStopAnim(); draw3DSimulation(); }
          else sim3dStartStepAnim(btn.step);
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
    if (isPanning3DSim && sim3dPanStart) { sim3dPanX = sim3dPanStart.panX + (e.clientX-sim3dPanStart.x); sim3dPanY = sim3dPanStart.panY + (e.clientY-sim3dPanStart.y); draw3DSimulation(); }
    else if (isDragging3DSim && sim3dDragStart) { sim3dRotY = sim3dDragStart.rotY + (e.clientX-sim3dDragStart.x)*0.01; sim3dRotX = Math.max(-Math.PI/2+0.1, Math.min(Math.PI/2-0.1, sim3dDragStart.rotX + (e.clientY-sim3dDragStart.y)*0.01)); draw3DSimulation(); }
  });
  cv.addEventListener('wheel', e => { e.preventDefault(); const f = e.deltaY < 0 ? 1.15 : 1/1.15; sim3dZoom = Math.max(0.1, Math.min(10, sim3dZoom*f)); sim3dUserZoomed = true; draw3DSimulation(); }, { passive: false });
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
            if (btn.step === -2) { sim3dStepIdx = -1; sim3dStepBends = []; draw3DSimulation(); }
            else if (btn.step === -3) sim3dStartFullSim();
            else if (btn.step === -1) { sim3dStepIdx = -1; sim3dStopAnim(); draw3DSimulation(); }
            else sim3dStartStepAnim(btn.step);
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
      draw3DSimulation();
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
      draw3DSimulation();
    }
  }, { passive: false });
  cv.addEventListener('touchend', e => {
    if (e.touches.length === 0) { touchDragStart = null; pinchStart = null; }
    else if (e.touches.length === 1) { pinchStart = null; touchDragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, rotY: sim3dRotY, rotX: sim3dRotX }; }
  }, { passive: false });
}

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
  const minX = tip.cx - halfW, maxX = tip.cx + halfW;
  const minY = Math.min(tip.cy, top.cy), maxY = Math.max(tip.cy, top.cy);
  return cx >= minX - 8 && cx <= maxX + 8 && cy >= minY - 8 && cy <= maxY + 8;
}

// Проверка клика по матрице (когда инструменты показаны на канвас)
function isNearDie(cx, cy) {
  if (!S.showToolsOnCanvas) return false;
  const die = (typeof getDieByIndex === 'function') ? getDieByIndex(S.metal.dieIndex) : null;
  if (!die) return false;
  const dOX = S.dieOffsetX || 0;
  const dOY = S.dieOffsetY || 0;
  const dH = die.height || 40;
  const sw = die.swidth || (die.vWidth ? die.vWidth * 2 : 40);
  const halfW = (sw / 2) * S.viewport.scale;
  const top = w2c(dOX, dOY);
  const bot = w2c(dOX, -dH + dOY);
  const minX = top.cx - halfW, maxX = top.cx + halfW;
  const minY = Math.min(top.cy, bot.cy), maxY = Math.max(top.cy, bot.cy);
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
    if (!S.toolLocked) {
      if (isNearPunch(cx, cy)) {
        dragPunch = true;
        drawCanvas.style.cursor = 'grabbing';
        return;
      }
      if (isNearDie(cx, cy)) {
        dragDie = true;
        drawCanvas.style.cursor = 'grabbing';
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

  if (dragDie) {
    const w = c2w(cx, cy);
    const p = S.snapToGrid ? snapPoint(w) : w;
    S.dieOffsetX = p.x;
    S.dieOffsetY = p.y;
    localStorage.setItem('dieOffsetX', p.x);
    localStorage.setItem('dieOffsetY', p.y);
    drawDrawCanvas();
    return;
  }

  if (dragPunch) {
    const w = c2w(cx, cy);
    const p = S.snapToGrid ? snapPoint(w) : w;
    S.punchOffsetX = p.x;
    S.punchOffsetY = p.y;
    localStorage.setItem('punchOffsetX', p.x);
    localStorage.setItem('punchOffsetY', p.y);
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
    if (S.toolMode === 'draw') drawCanvas.style.cursor = 'crosshair';
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
    drawCanvas.style.cursor = 'default';
    drawDrawCanvas();
  }
  if (dragDie) {
    dragDie = false;
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

// ═══════════════════════════════════════════════════════════════
// UI / RENDER — renderAll (полная перерисовка), шапка, статус-бар,
// мобильные параметры, безопасное обновление иконок Lucide
// ═══════════════════════════════════════════════════════════════

// Обновление иконок Lucide с защитой от отсутствия библиотеки
// (раньше прямой вызов lucide.createIcons() ронял весь UI при сбое CDN)
function refreshIcons() {
  if (typeof lucide !== 'undefined' && lucide && typeof lucide.createIcons === 'function') {
    try { lucide.createIcons(); } catch (e) { /* ignore */ }
  }
}

// Скрыть диалог сразу (до DOMContentLoaded)
(function() {
  const overlay = document.getElementById('dialog-overlay');
  if (overlay) overlay.classList.add('hidden');
})();

// ==================== RENDER ALL ====================
function renderAll() {
  renderHeader();
  renderToolButtons();
  renderMetalParams();
  renderSnapSettings();
  renderStats();
  renderPointsTable();
  renderPresets();
  renderUnfoldInfo();
  renderMobileParams();
  renderMobileUnfold();
  resizeView3d();
  draw3DPreview();
  drawDrawCanvas();
  drawUnfoldCanvas();
  refreshIcons();
}

// Копия параметров левой панели в мобильный drawer (#mobile-params),
// чтобы на мобильных (<lg) были доступны все контролы.
// Инлайн-обработчики самодостаточны (this.value / S.xxx), поэтому
// клон работает. Дубликаты id удаляются.
function renderMobileParams() {
  const mp = document.getElementById('mobile-params');
  if (!mp) return;
  const left = document.getElementById('left-sidebar');
  if (!left) { mp.innerHTML = ''; return; }
  const inner = left.querySelector('.p-3');
  if (!inner) { mp.innerHTML = ''; return; }
  mp.innerHTML = inner.innerHTML;
  mp.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
  refreshIcons();
}

function renderHeader() {
  const titleEl = document.getElementById('h-title');
  if (titleEl) titleEl.textContent = t('title');
  const langEl = document.getElementById('lang-label');
  if (langEl) langEl.textContent = S.lang.toUpperCase();
  const footerEl = document.getElementById('footer-controls');
  if (footerEl) footerEl.textContent = t('footerControls');
  // Перевод всех статических data-i18n элементов
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
  ['btn-drawing', 'btn-dxf', 'btn-svg', 'btn-pngw', 'btn-png', 'btn-pdf'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = !S.unfoldResult;
  });
  const autoBtn = document.getElementById('btn-auto');
  if (autoBtn) autoBtn.className = 'h-8 w-8 flex items-center justify-center rounded-md ' +
    (S.autoUnfold ? 'text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400' : 'text-gray-600 dark:text-gray-400');
  // Status bar
  const st = document.getElementById('status-bar');
  if (!st) return;
  if (S.points.length > 0) {
    const toolLabel = t(S.toolMode);
    const totalLen = S.points.length >= 2
      ? S.points.slice(0, -1).reduce((s, p, i) => {
          const dx = S.points[i + 1].x - p.x, dy = S.points[i + 1].y - p.y;
          return s + Math.sqrt(dx * dx + dy * dy);
        }, 0) : 0;
    st.textContent = t('segments') + S.points.length +
      (S.points.length > 1 ? ' | ' + t('profileLength') + ': ' + totalLen.toFixed(1) + t('mm') : '') +
      ' | ' + toolLabel;
    const colors = { draw: '#22c55e', select: '#3b82f6', erase: '#ef4444', measure: '#f59e0b', hem: '#8b5cf6' };
    st.style.borderLeft = '3px solid';
    st.style.borderLeftColor = colors[S.toolMode];
  } else {
    st.textContent = t('profileHeader');
  }
}

// Обновление кнопок симуляции (без полного renderAll) — вызывается
// из animation tick
function updateSimButton() {
  if (typeof renderToolButtons === 'function') renderToolButtons();
  refreshIcons();
}

// ═══════════════════════════════════════════════════════════════
// UI / DIALOGS — базовые диалоги: show/close, горячие клавиши,
// ввод координат, параметры экспорта DXF
// ═══════════════════════════════════════════════════════════════

function showShortcuts() {
  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/></svg>' + t('shortcuts') + '</h3><div class="space-y-2">';
  [
    ['D', t('shortcutDraw')],
    ['V', t('shortcutSelect')],
    ['E', t('shortcutErase')],
    ['M', t('shortcutMeasure')],
    ['H', t('shortcutHem')],
    ['N', t('shortcutCoordInput')],
    ['F', t('shortcutCenter')],
    ['Enter', t('shortcutUnfold')],
    ['Ctrl+Z', t('shortcutUndoPoints')],
    ['Ctrl+Y', t('shortcutRedoPoints')],
    ['Ctrl+Shift+Z', t('shortcutUndoParams')],
    ['Ctrl+Shift+Y', t('shortcutRedoParams')],
    ['Ctrl+S', t('shortcutSave')]
  ].forEach(([k, v]) => {
    h += '<div class="flex items-center justify-between"><span class="text-sm text-gray-600 dark:text-gray-400">' + v + '</span><kbd class="text-[10px] font-mono bg-gray-100 dark:bg-gray-700 rounded px-1.5 py-0.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">' + k + '</kbd></div>';
  });
  h += '<hr class="my-2 border-gray-200 dark:border-gray-700"><div class="text-[10px] text-gray-500 dark:text-gray-400 space-y-0.5"><p>' + t('shortcutMouse1') + '</p><p>' + t('shortcutMouse2') + '</p><p>' + t('shortcutCloseContour') + '</p></div></div>';
  showDialog(h);
}

function showCoordInput() {
  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/></svg>' + t('coordInput') + '</h3>';
  h += '<div class="grid grid-cols-2 gap-3"><div><label class="text-xs font-medium">' + t('coordInputX') + '</label><input type="number" id="ci-x" step="any" class="w-full h-8 text-xs border border-gray-200 dark:border-gray-700 rounded-md px-2 mt-1 bg-white dark:bg-gray-800" autofocus></div>';
  h += '<div><label class="text-xs font-medium">' + t('coordInputY') + '</label><input type="number" id="ci-y" step="any" class="w-full h-8 text-xs border border-gray-200 dark:border-gray-700 rounded-md px-2 mt-1 bg-white dark:bg-gray-800"></div></div>';
  h += '<div class="flex items-center gap-2 mt-3"><div class="switch' + (S.snapToGrid ? ' active' : '') + '" id="ci-snap" onclick="this.classList.toggle(\'active\')"></div><label class="text-xs cursor-pointer">' + t('snapGridCheck') + '</label></div>';
  h += '<div class="flex justify-end gap-2 mt-4"><button onclick="closeDialog()" class="text-xs h-8 px-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">' + t('cancel') + '</button>';
  h += '<button onclick="submitCoordInput()" class="text-xs h-8 px-3 bg-green-600 text-white rounded-md hover:bg-green-700">' + t('add') + '</button></div>';
  showDialog(h);
  setTimeout(() => { const el = document.getElementById('ci-x'); if (el) el.focus(); }, 100);
}

function submitCoordInput() {
  const xv = parseFloat(document.getElementById('ci-x').value);
  const yv = parseFloat(document.getElementById('ci-y').value);
  if (isNaN(xv) || isNaN(yv)) { toast(t('enterCoordsError'), 'error'); return; }
  let p = { x: xv, y: yv };
  const snapEl = document.getElementById('ci-snap');
  if (snapEl && snapEl.classList.contains('active')) p = snapPoint(p);
  addPoint(p);
  closeDialog();
  toast(t('pointAdded'));
  renderAll();
}

function showDxfOptions() {
  const l = S.dxfOpts.layers;
  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' + t('dxfOptions') + '</h3>';
  h += '<div class="space-y-2"><label class="text-xs font-medium">' + t('dxfLayers') + '</label>';
  [
    ['outline', t('dxfLayerOutline')],
    ['bend', t('dxfLayerBend')],
    ['dimension', t('dxfLayerDim')],
    ['text', t('dxfLayerText')],
    ['info', t('dxfLayerInfo')],
    ['tick', t('dxfLayerTick')]
  ].forEach(([k, v]) => {
    h += '<label class="flex items-center gap-2.5 cursor-pointer"><input type="checkbox" ' + (l[k] ? 'checked' : '') + ' onchange="S.dxfOpts.layers[\'' + k + '\']=this.checked" class="w-4 h-4 accent-green-600"><span class="text-xs text-gray-600 dark:text-gray-400">' + v + '</span></label>';
  });
  h += '</div><div class="flex justify-end gap-2 mt-4"><button onclick="closeDialog()" class="text-xs h-8 px-3 border border-gray-200 dark:border-gray-700 rounded-md">' + t('cancel') + '</button>';
  h += '<button onclick="exportDXF();closeDialog()" class="text-xs h-8 px-3 bg-green-600 text-white rounded-md hover:bg-green-700">' + t('dxfDownload') + '</button></div>';
  showDialog(h);
}

// ==================== БАЗОВЫЕ ДИАЛОГИ ====================
function showDialog(html, extraClass) {
  const box = document.getElementById('dialog-content');
  const overlay = document.getElementById('dialog-overlay');
  if (!html || html.trim() === '') return;
  if (!overlay || !box) return;
  box.innerHTML = html;
  box.className = extraClass ? 'dialog-box ' + extraClass : 'dialog-box';
  overlay.classList.remove('hidden'); // важно: снимаем !important-правило из CSS
  overlay.style.display = 'flex';
}

function closeDialog() {
  const overlay = document.getElementById('dialog-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.style.display = 'none';
  }
}

// ═══════════════════════════════════════════════════════════════
// UI / TOOL-IMPORT-DIALOG — импорт своих матриц/пуансонов из DXF:
// диалог с превью профиля, параметрами и списком своих инструментов
// ═══════════════════════════════════════════════════════════════

// Временные данные импорта
let _importProfile = null;   // { chains, width, height, minX, maxX, minY, maxY }
let _importType = 'die';     // 'die' | 'punch'
let _importFileName = '';

function showCustomDieDialog() { showToolImportDialog('die'); }
function showCustomPunchDialog() { showToolImportDialog('punch'); }

function drawToolProfileSVG(profile, viewW, viewH) {
  // Рисуем все цепочки профиля, масштабируя под viewBox
  if (!profile || !profile.chains || !profile.chains.length) {
    return '<svg width="' + viewW + '" height="' + viewH + '" viewBox="0 0 ' + viewW + ' ' + viewH + '"></svg>';
  }
  const pad = 6;
  const usableW = viewW - pad * 2;
  const usableH = viewH - pad * 2;
  const scale = Math.min(usableW / profile.width, usableH / profile.height) || 1;
  const offX = pad + (usableW - profile.width * scale) / 2;
  const offY = pad + (usableH - profile.height * scale) / 2;
  let d = '';
  profile.chains.forEach(chain => {
    chain.forEach((p, pi) => {
      const sx = offX + (p.x - profile.minX) * scale;
      const sy = offY + (profile.height - (p.y - profile.minY)) * scale;
      d += (pi === 0 ? 'M' : 'L') + sx.toFixed(2) + ' ' + sy.toFixed(2) + ' ';
    });
  });
  const color = _importType === 'punch' ? '#ef4444' : '#3b82f6';
  return '<svg width="' + viewW + '" height="' + viewH + '" viewBox="0 0 ' + viewW + ' ' + viewH + '" style="display:block">' +
    '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '</svg>';
}

function showToolImportDialog(type) {
  _importType = type;
  _importProfile = null;
  _importFileName = '';
  const tools = loadCustomTools();
  const isDie = type === 'die';
  const title = isDie ? t('customDie') : t('customPunch');
  const list = isDie ? tools.customDies : tools.customPunches;
  const listLabel = isDie ? t('customDiesList') : t('customPunchesList');

  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><i data-lucide="hammer" class="h-4 w-4 text-blue-600"></i>' + title + '</h3>';
  h += '<div class="space-y-3">';

  // Имя
  h += '<div><label class="text-xs font-medium">' + t('customDieName') + '</label>';
  h += '<input type="text" id="tool-name" placeholder="V-custom" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 mt-1"></div>';

  // Импорт файла DXF
  h += '<div class="rounded-md border border-dashed border-gray-300 dark:border-gray-600 p-2"><div class="text-[10px] font-medium text-gray-500 mb-1">' + t('dxfImport') + '</div>';
  h += '<input type="file" accept=".dxf" id="tool-dxf-file" onchange="importToolDXF(this)" class="text-[10px] w-full text-gray-600 dark:text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer">';
  h += '<div id="tool-dxf-info" class="mt-1 text-[10px] text-gray-400">' + t('dxfNoFile') + '</div>';
  h += '</div>';

  // Превью профиля
  h += '<div><label class="text-xs font-medium">' + t('toolPreview') + '</label>';
  h += '<div id="tool-preview" class="mt-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-28 flex items-center justify-center overflow-hidden"></div>';
  h += '<div id="tool-dims" class="mt-1 text-[10px] font-mono text-gray-500">\u2014</div>';
  h += '</div>';

  // Параметры инструмента: V — ручей, S — ширина, H — высота, макс. угол
  h += '<div class="rounded-md border border-gray-200 dark:border-gray-700 p-2"><div class="text-[10px] font-semibold text-gray-500 mb-1.5">' + t('toolParams') + '</div>';
  h += '<div class="grid grid-cols-2 gap-2">';
  if (isDie) {
    h += '<div><label class="text-[10px] text-gray-500">' + t('dieVLabel') + '</label><input type="number" id="tool-vwidth" min="1" step="0.5" placeholder="8" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 mt-0.5"></div>';
  } else {
    h += '<div><label class="text-[10px] text-gray-500">' + t('punchRLabel') + '</label><input type="number" id="tool-radius" min="0.1" step="0.1" placeholder="1.5" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 mt-0.5"></div>';
  }
  h += '<div><label class="text-[10px] text-gray-500">' + t('toolSLabel') + '</label><input type="number" id="tool-swidth" min="1" step="0.5" placeholder="40" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 mt-0.5"></div>';
  h += '<div><label class="text-[10px] text-gray-500">' + t('toolHLabel') + '</label><input type="number" id="tool-height" min="1" step="0.5" placeholder="30" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 mt-0.5"></div>';
  h += '<div><label class="text-[10px] text-gray-500">' + t('toolMaxAngleLabel') + '</label><input type="number" id="tool-maxangle" min="1" max="180" step="1" value="' + (isDie ? '140' : '90') + '" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 mt-0.5"></div>';
  h += '</div></div>';

  // Список существующих
  if (list.length > 0) {
    h += '<div class="pt-3 border-t border-gray-200 dark:border-gray-700"><p class="text-[10px] font-semibold text-gray-500 mb-2">' + listLabel + '</p>';
    list.forEach(tool => {
      h += '<div class="flex items-center justify-between text-[10px] py-1 border-b border-gray-100 dark:border-gray-800">';
      h += '<div class="flex items-center gap-2 min-w-0">';
      h += '<div class="w-10 h-8 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700 shrink-0 overflow-hidden">' + drawProfileSVG(tool.profile, 40, 32, isDie ? '#3b82f6' : '#ef4444', 2) + '</div>';
      h += '<div class="min-w-0"><div class="font-mono truncate">' + tool.nameRu + '</div><div class="text-[9px] text-gray-400 font-mono">' + toolSizeLabel(tool, isDie) + '</div></div>';
      h += '</div>';
      h += '<button onclick="' + (isDie ? 'deleteCustomDie' : 'deleteCustomPunch') + '(\'' + tool.id + '\');showCustom' + (isDie ? 'Die' : 'Punch') + 'Dialog();" class="text-red-500 hover:text-red-700 px-1 text-sm leading-none">×</button>';
      h += '</div>';
    });
    h += '</div>';
  }

  // Закреплённый футер с кнопками
  h += '<div class="sticky bottom-0 -mx-5 -mb-5 px-5 py-3 mt-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2 rounded-b-xl">';
  h += '<button onclick="closeDialog()" class="text-xs h-8 px-3 border border-gray-200 dark:border-gray-700 rounded-md">' + t('cancel') + '</button>';
  h += '<button onclick="applyCustomTool()" class="text-xs h-8 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">' + t('save') + '</button></div>';

  h += '</div>';
  showDialog(h);
  refreshIcons();
  // Превью по умолчанию
  const prev = document.getElementById('tool-preview');
  if (prev) prev.innerHTML = drawToolProfileSVG(null, 280, 100);
  setTimeout(() => { const el = document.getElementById('tool-name'); if (el) el.focus(); }, 100);
}

async function importToolDXF(input) {
  if (!input || !input.files || !input.files.length) return;
  const file = input.files[0];
  _importFileName = file.name.replace(/\.dxf$/i, '');
  try {
    const text = await file.text();
    const profile = profileFromDXF(text);
    if (profile && profile.chains && profile.chains.length) {
      _importProfile = profile;
      const prev = document.getElementById('tool-preview');
      if (prev) prev.innerHTML = drawToolProfileSVG(profile, 280, 100);
      const dims = document.getElementById('tool-dims');
      if (dims) dims.textContent =
        t('widthShort') + ': ' + profile.width.toFixed(1) + ' ' + t('mm') +
        '   ' + t('heightShort') + ': ' + profile.height.toFixed(1) + ' ' + t('mm');
      const info = document.getElementById('tool-dxf-info');
      if (info) info.textContent = '✓ ' + _importFileName;
      // Подставляем имя по умолчанию
      const nameEl = document.getElementById('tool-name');
      if (nameEl && !nameEl.value.trim()) {
        nameEl.value = _importFileName.replace(/[_\-\s]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      }
      // Автозаполнение параметров из габаритов DXF:
      // S — ширина, H — высота, V — автоопределение ручья (для матрицы)
      const swEl = document.getElementById('tool-swidth');
      if (swEl && !swEl.value) swEl.value = Math.max(1, Math.round(profile.width));
      const htEl = document.getElementById('tool-height');
      if (htEl && !htEl.value) htEl.value = Math.max(1, Math.round(profile.height));
      const vwEl = document.getElementById('tool-vwidth');
      if (vwEl && !vwEl.value) {
        const vEst = estimateDieVWidth(profile);
        if (vEst) vwEl.value = Math.max(1, Math.round(vEst));
      }
      const rdEl = document.getElementById('tool-radius');
      if (rdEl && !rdEl.value) rdEl.value = Math.max(0.5, Math.round(profile.width * 5) / 10);
      return;
    }
    const info = document.getElementById('tool-dxf-info');
    if (info) info.textContent = t('dxfNoContour');
    toast(t('dxfNoContour'), 'error');
  } catch (err) {
    console.error('DXF import error:', err);
    const info = document.getElementById('tool-dxf-info');
    if (info) info.textContent = t('dxfError') + ': ' + err.message;
    toast(t('dxfError'), 'error');
  }
}

function applyCustomTool() {
  try {
    const nameRu = (document.getElementById('tool-name').value || '').trim();
    if (!_importProfile) { toast(t('dxfPleaseImport'), 'error'); return; }
    const profile = _importProfile;
    // Читаем параметры из полей ввода (автозаполняются из DXF, редактируемы)
    const numVal = (id, fallback) => {
      const el = document.getElementById(id);
      if (!el) return fallback;
      const v = parseFloat(el.value);
      return isNaN(v) || v <= 0 ? fallback : v;
    };
    if (_importType === 'die') {
      const vWidth = numVal('tool-vwidth', estimateDieVWidth(profile) || Math.round(profile.width));
      const swidth = numVal('tool-swidth', Math.round(profile.width));
      const height = numVal('tool-height', Math.round(profile.height));
      const maxAngle = numVal('tool-maxangle', 140);
      addCustomDie({
        nameRu: nameRu || ('V' + vWidth),
        nameEn: nameRu || ('V' + vWidth),
        vWidth: vWidth,
        swidth: swidth,
        height: height,
        maxAngle: maxAngle,
        profile
      });
      // Выбираем только что добавленную матрицу
      S.metal.dieIndex = DIES.length + (loadCustomTools().customDies.length - 1);
    } else {
      const swidth = numVal('tool-swidth', Math.round(profile.width));
      const height = numVal('tool-height', Math.round(profile.height));
      const radius = numVal('tool-radius', Math.max(0.5, Math.round(profile.width * 5) / 10));
      const maxAngle = numVal('tool-maxangle', 90);
      addCustomPunch({
        nameRu: nameRu || ('R' + radius),
        nameEn: nameRu || ('R' + radius),
        swidth: swidth,
        height: height,
        radius: radius,
        maxAngle: maxAngle,
        profile
      });
      // Выбираем только что добавленный пуансон
      S.metal.punchIndex = PUNCHES.length + (loadCustomTools().customPunches.length - 1);
    }
    closeDialog();
    doUnfold();
    renderAll();
  } catch (err) {
    console.error('applyCustomTool error:', err);
    toast(t('importError') + ': ' + err.message, 'error');
  }
}

// ═══════════════════════════════════════════════════════════════
// UI / HEM-DIALOG — диалог каймы (высота, сторона), применение,
// удаление, отмена
// ═══════════════════════════════════════════════════════════════

function showHemDialog(segIndex) {
  S.hemEditing = { segIndex };
  const existing = S.hems.find(h => h.segIndex === segIndex);
  const height = existing ? existing.height : 10;
  const side = existing ? existing.side : 'left';
  const numSegs = S.points.length - 1;
  const isEndHem = segIndex === numSegs;
  const segLabel = isEndHem
    ? t('segmentLabel') + ' ' + numSegs + ' → ' + t('hem')
    : t('segmentLabel') + ' ' + (segIndex + 1);

  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v10l4-4"/><path d="M12 12l-4-4"/><path d="M4 20h16"/></svg>' + segLabel + '</h3>';

  // Высота
  h += '<div class="space-y-1 mb-3"><label class="text-xs font-medium">' + t('hemHeight') + '</label>';
  h += '<input type="number" id="hem-dialog-height" min="0.5" max="50" step="0.5" value="' + height + '" class="w-full h-9 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500/30 font-mono">';
  h += '</div>';

  // Сторона
  h += '<div class="space-y-1 mb-4"><label class="text-xs font-medium">' + t('hemSide') + '</label>';
  h += '<div class="flex gap-2">';
  h += '<button id="hem-side-left" onclick="setHemSide(\'left\')" class="flex-1 h-9 text-xs rounded-md border-2 transition-all ' + (side === 'left' ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30 text-purple-700 font-semibold' : 'border-gray-200 dark:border-gray-700 text-gray-600 hover:border-purple-300') + '">' + t('hemSideLeft') + '</button>';
  h += '<button id="hem-side-right" onclick="setHemSide(\'right\')" class="flex-1 h-9 text-xs rounded-md border-2 transition-all ' + (side === 'right' ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30 text-purple-700 font-semibold' : 'border-gray-200 dark:border-gray-700 text-gray-600 hover:border-purple-300') + '">' + t('hemSideRight') + '</button>';
  h += '</div></div>';

  // Кнопки
  h += '<div class="flex justify-between gap-2">';
  if (existing) {
    h += '<button onclick="removeHem(S.hemEditing.segIndex)" class="text-xs h-8 px-3 border border-red-200 dark:border-red-800 text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30">' + t('hemRemove') + '</button>';
  } else {
    h += '<button onclick="cancelHem()" class="text-xs h-8 px-3 border border-gray-200 dark:border-gray-700 rounded-md">' + t('hemCancel') + '</button>';
  }
  h += '<button onclick="applyHemFromDialog()" class="text-xs h-8 px-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-semibold">' + t('hemApply') + '</button>';
  h += '</div>';

  showDialog(h);
  // Фокус в поле
  setTimeout(() => {
    const inp = document.getElementById('hem-dialog-height');
    if (inp) { inp.focus(); inp.select(); }
  }, 50);
}

function setHemSide(side) {
  const leftBtn = document.getElementById('hem-side-left');
  const rightBtn = document.getElementById('hem-side-right');
  const active = 'flex-1 h-9 text-xs rounded-md border-2 transition-all border-purple-600 bg-purple-50 dark:bg-purple-950/30 text-purple-700 font-semibold';
  const inactive = 'flex-1 h-9 text-xs rounded-md border-2 transition-all border-gray-200 dark:border-gray-700 text-gray-600 hover:border-purple-300';
  if (leftBtn) leftBtn.className = side === 'left' ? active : inactive;
  if (rightBtn) rightBtn.className = side === 'right' ? active : inactive;
}

function applyHemFromDialog() {
  if (!S.hemEditing) return;
  const height = parseFloat(document.getElementById('hem-dialog-height').value);
  if (isNaN(height) || height <= 0) return;
  const leftBtn = document.getElementById('hem-side-left');
  const isLeftActive = leftBtn && leftBtn.className.includes('border-purple-600');
  const side = isLeftActive ? 'left' : 'right';
  applyHem(S.hemEditing.segIndex, height, side);
  closeDialog();
}

function applyHem(segIndex, height, side) {
  // Undo-состояние (включая каймы)
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  S.redoHistory = [];
  // Удаляем существующую кайму этого сегмента
  S.hems = S.hems.filter(h => h.segIndex !== segIndex);
  if (height > 0) {
    S.hems.push({ segIndex, height, side });
  }
  S.hemEditing = null;
  if (S.autoUnfold) maybeAutoUnfold();
  renderAll();
}

function removeHem(segIndex) {
  const si = segIndex !== undefined ? segIndex : (S.hemEditing ? S.hemEditing.segIndex : -1);
  if (si < 0) return;
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  S.redoHistory = [];
  S.hems = S.hems.filter(h => h.segIndex !== si);
  S.hemEditing = null;
  closeDialog();
  if (S.autoUnfold) maybeAutoUnfold();
  renderAll();
  toast(t('hemRemoved'));
}

function cancelHem() {
  S.hemEditing = null;
  closeDialog();
  drawDrawCanvas();
}

// ═══════════════════════════════════════════════════════════════
// UI / EDIT-DIALOGS — редактирование точки и сегмента
// ═══════════════════════════════════════════════════════════════

// ==================== EDIT POINT ====================
function editPoint(idx) {
  if (idx < 0 || idx >= S.points.length) return;
  const pt = S.points[idx];
  const len = idx < S.points.length - 1 ? dist(S.points[idx], S.points[idx + 1]) : 0;
  const ang = idx < S.points.length - 1 ? Math.atan2(S.points[idx + 1].y - pt.y, S.points[idx + 1].x - pt.x) * 180 / Math.PI : 0;

  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/></svg>' + t('editPoint') + ' #' + (idx + 1) + '</h3>';
  h += '<div class="space-y-2">';

  // Координаты
  h += '<div class="grid grid-cols-2 gap-2"><div><label class="text-xs font-medium">' + t('coordInputX') + '</label><input type="number" id="ep-x" step="any" value="' + pt.x.toFixed(1) + '" class="w-full h-7 text-xs border border-gray-200 dark:border-gray-700 rounded px-2 mt-1 bg-white dark:bg-gray-800"></div>';
  h += '<div><label class="text-xs font-medium">' + t('coordInputY') + '</label><input type="number" id="ep-y" step="any" value="' + pt.y.toFixed(1) + '" class="w-full h-7 text-xs border border-gray-200 dark:border-gray-700 rounded px-2 mt-1 bg-white dark:bg-gray-800"></div></div>';

  // Настройки сегмента
  if (idx < S.points.length - 1) {
    h += '<hr class="border-gray-200 dark:border-gray-700"><div class="space-y-1"><label class="text-xs font-medium flex items-center gap-1"><i data-lucide="move-diagonal" class="h-3 w-3"></i>' + t('segmentLabel') + ' #' + (idx + 1) + '</label>';
    h += '<div class="grid grid-cols-2 gap-2"><div><label class="text-[10px] text-gray-500">' + t('lengthShort') + ' (' + t('mm') + ')</label><input type="number" id="ep-len" step="any" value="' + len.toFixed(1) + '" class="w-full h-7 text-xs border border-gray-200 dark:border-gray-700 rounded px-2 mt-1 bg-white dark:bg-gray-800"></div>';
    h += '<div><label class="text-[10px] text-gray-500">' + t('angleShort') + ' (°)</label><input type="number" id="ep-ang" step="any" value="' + ang.toFixed(1) + '" class="w-full h-7 text-xs border border-gray-200 dark:border-gray-700 rounded px-2 mt-1 bg-white dark:bg-gray-800"></div></div>';
    h += '</div>';
  }

  h += '<div class="flex justify-end gap-2 mt-3"><button onclick="closeDialog()" class="text-xs h-7 px-3 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700">' + t('cancel') + '</button>';
  h += '<button onclick="applyEditPoint(' + idx + ')" class="text-xs h-7 px-3 bg-green-600 text-white rounded hover:bg-green-700">' + t('add') + '</button></div>';
  h += '</div>';
  showDialog(h);
  refreshIcons();
  setTimeout(() => { const el = document.getElementById('ep-x'); if (el) el.focus(); }, 100);
}

function applyEditPoint(idx) {
  const xv = parseFloat(document.getElementById('ep-x').value);
  const yv = parseFloat(document.getElementById('ep-y').value);
  if (isNaN(xv) || isNaN(yv)) { toast(t('enterCoordsError'), 'error'); return; }

  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();

  S.points[idx] = { x: xv, y: yv };

  // Если есть следующий сегмент, изменяем длину/угол
  if (idx < S.points.length - 1) {
    const len = parseFloat(document.getElementById('ep-len').value);
    const ang = parseFloat(document.getElementById('ep-ang').value);
    if (!isNaN(len) && !isNaN(ang)) {
      const rad = ang * Math.PI / 180;
      S.points[idx + 1] = {
        x: xv + Math.cos(rad) * len,
        y: yv + Math.sin(rad) * len
      };
    }
  }

  S.redoHistory = [];
  closeDialog();
  maybeAutoUnfold();
  renderAll();
  toast(t('pointAdded'));
}

// ==================== EDIT SEGMENT ====================
function editSegment(idx) {
  if (idx < 0 || idx >= S.points.length - 1) return;
  const p1 = S.points[idx];
  const p2 = S.points[idx + 1];
  const len = dist(p1, p2);
  const ang = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>' + t('edit') + ' ' + t('segment') + ' #' + (idx + 1) + '</h3>';
  h += '<div class="space-y-3">';
  h += '<p class="text-[10px] text-gray-500 dark:text-gray-400">' + t('editSegmentHint') + '</p>';
  h += '<div class="grid grid-cols-2 gap-3"><div><label class="text-xs font-medium">' + t('lengthShort') + ' (' + t('mm') + ')</label><input type="number" id="es-len" step="any" value="' + len.toFixed(1) + '" class="w-full h-8 text-xs border border-gray-200 dark:border-gray-700 rounded-md px-2 mt-1 bg-white dark:bg-gray-800"></div>';
  h += '<div><label class="text-xs font-medium">' + t('angleShort') + ' (°)</label><input type="number" id="es-ang" step="any" value="' + ang.toFixed(1) + '" class="w-full h-8 text-xs border border-gray-200 dark:border-gray-700 rounded-md px-2 mt-1 bg-white dark:bg-gray-800"></div></div>';
  h += '<p class="text-[9px] text-gray-400">' + t('pointMoveHint').replace('#N2', '#' + (idx + 2)).replace('#N1', '#' + (idx + 1)) + '</p>';

  h += '<div class="flex justify-end gap-2 mt-4"><button onclick="closeDialog()" class="text-xs h-8 px-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">' + t('cancel') + '</button>';
  h += '<button onclick="applyEditSegment(' + idx + ')" class="text-xs h-8 px-3 bg-green-600 text-white rounded-md hover:bg-green-700">' + t('add') + '</button></div>';
  showDialog(h);
  setTimeout(() => { const el = document.getElementById('es-len'); if (el) el.focus(); }, 100);
}

function applyEditSegment(idx) {
  const len = parseFloat(document.getElementById('es-len').value);
  const ang = parseFloat(document.getElementById('es-ang').value);
  if (isNaN(len) || isNaN(ang)) { toast(t('enterCoordsError'), 'error'); return; }

  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();

  const p1 = S.points[idx];
  const rad = ang * Math.PI / 180;
  const dirX = Math.cos(rad), dirY = Math.sin(rad);

  // Удлинение должно идти в сторону свободного края контура,
  // а не к пересечению с другой точкой (гибом).
  const isLeftFree = idx === 0;
  const isRightFree = idx + 1 === S.points.length - 1;

  if (isLeftFree && !isRightFree && S.points.length > 2) {
    // Левый конец — свободный край: двигаем НАЧАЛЬНУЮ точку в обратном
    // направлении, сохраняя точку гиба (idx+1) на месте.
    S.points[idx] = {
      x: S.points[idx + 1].x - dirX * len,
      y: S.points[idx + 1].y - dirY * len
    };
  } else {
    // Правый конец — свободный край (или контур из двух точек):
    // двигаем КОНЕЧНУЮ точку по направлению сегмента.
    S.points[idx + 1] = {
      x: p1.x + dirX * len,
      y: p1.y + dirY * len
    };
  }

  S.redoHistory = [];
  closeDialog();
  maybeAutoUnfold();
  renderAll();
  toast(t('pointAdded'));
}

// ═══════════════════════════════════════════════════════════════
// UI / TOOL-BUTTONS — плитки инструментов (рисование/выбор/ластик/
// измерение/кайма) + кнопки управления симуляцией (перевороты,
// лицевая сторона, сброс, 3D-симуляция)
// ═══════════════════════════════════════════════════════════════

function renderToolButtons() {
  const c = document.getElementById('tool-buttons');
  if (!c) return;
  const tools = [
    { mode: 'draw', icon: 'pencil', key: 'D', label: 'draw' },
    { mode: 'select', icon: 'mouse-pointer-2', key: 'V', label: 'select' },
    { mode: 'erase', icon: 'eraser', key: 'E', label: 'erase' },
    { mode: 'measure', icon: 'ruler', key: 'M', label: 'measure' },
    { mode: 'hem', icon: 'git-branch', key: 'H', label: 'hemTool' }
  ];
  c.className = 'grid grid-cols-3 gap-1';
  const btnBase = 'w-full h-12 text-sm rounded-md flex items-center justify-center border transition-all gap-2';
  const btnActive = 'bg-green-600 hover:bg-green-700 text-white border-green-600';
  const btnInactive = 'border-gray-200 dark:border-gray-700 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950/30';
  c.innerHTML = tools.map(tl => {
    const active = S.toolMode === tl.mode;
    return '<button onclick="S.toolMode=\'' + tl.mode + '\';S.drawFromIdx=null;renderAll()" class="' + btnBase + ' ' + (active ? btnActive : btnInactive) + '"><i data-lucide="' + tl.icon + '" class="h-5 w-5 shrink-0"></i><span class="truncate">' + t(tl.label) + '</span></button>';
  }).join('');

  // Кнопка-тумблер «Симуляция гибки» (включает режим симуляции).
  // Активное состояние из S.showToolsOnCanvas.
  const simBtn = document.createElement('button');
  const simActive = !!S.showToolsOnCanvas;
  simBtn.className = btnBase + ' ' + (simActive
    ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600 ring-2 ring-purple-300 dark:ring-purple-500'
    : 'border-dashed border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30');
  simBtn.innerHTML = '<i data-lucide="sparkles" class="h-5 w-5 shrink-0"></i><span class="truncate">' + t('simulate') + (simActive ? ' • ' + t('simOn') : ' • ' + t('simOff')) + '</span>';
  simBtn.title = simActive ? t('simOn') : t('simOff');
  simBtn.onclick = function () {
    S.showToolsOnCanvas = !S.showToolsOnCanvas;
    S.simMode = S.showToolsOnCanvas;
    if (S.showToolsOnCanvas) {
      S.toolMode = 'select';
      // При входе в симуляцию «Установить инструмент» по умолчанию ВЫКЛ:
      // инструменты видны, но заблокированы. Пользователь должен явно
      // включить чек «Установить инструмент», чтобы двигать пуансон/матрицу.
      S.toolLocked = true;
      // v4.4 FIX: если профиль изменился с момента накопления гибов
      // (очищён и перерисован / точки отредактированы) — старая
      // последовательность бессмысленна, сбрасываем: симуляция всегда
      // начинается с плоского листа для НЫНЕШНЕГО профиля.
      const sigNow = (typeof simProfileSignature === 'function') ? simProfileSignature() : null;
      if ((S.simBentMarkers || []).length > 0 && S.simProfileSig && sigNow !== S.simProfileSig) {
        S.simBentMarkers = [];
        S.bendStepMeta = {};
        S.simFlipX = false;
        S.simFlipY = false;
        S.simFaceSide = 'up';
        S.selectedBendIndex = undefined;
      }
      S.simProfileSig = sigNow;
      // Заготовка встаёт первым маркером гибки в (0,0): ставим
      // selectedBendIndex=0, перерисовываем, затем сбрасываем выбор —
      // иначе 1-й клик по маркеру 0 сразу бы сгибал.
      S.simBentMarkers = S.simBentMarkers || [];
      S.selectedBendIndex = 0;
      if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
      S.selectedBendIndex = undefined;
      if (S.bendPointX === 0 && S.bendPointY === 0) {
        S.bendPointX = S.punchOffsetX || 0;
        S.bendPointY = S.punchOffsetY || 0;
        localStorage.setItem('bendPointX', S.bendPointX);
        localStorage.setItem('bendPointY', S.bendPointY);
      }
      S.previewBendIdx = null;
      S.previewFlip = false;
    } else {
      if (typeof stopAnimation === 'function') stopAnimation();
      // НЕ сбрасываем simBentMarkers при выходе — последовательность
      // гибки сохраняется для чертежа «Последовательность гибки».
      S.previewBendIdx = null;
      S.previewFlip = false;
      S.selectedBendIndex = undefined;
      S.simFlipX = false;
      S.simFlipY = false;
      // Лицевая сторона сбрасывается в 'up' (кнопка неактивна при след. входе)
      S.simFaceSide = 'up';
      // При выходе из симуляции разблокируем инструменты
      S.toolLocked = false;
    }
    renderAll();
  };
  c.appendChild(simBtn);

  // Кнопки управления симуляцией (только в режиме симуляции, ручной режим)
  if (S.showToolsOnCanvas && S.unfoldResult && S.unfoldResult.bendInfos && S.unfoldResult.bendInfos.length > 0) {
    const bentCount = (S.simBentMarkers || []).length;

    // ↕Y — переворот по Y (верх↔низ)
    const flipYBtn = document.createElement('button');
    flipYBtn.id = 'btn-sim-flipy';
    flipYBtn.className = btnBase + ' border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30';
    flipYBtn.innerHTML = '<i data-lucide="flip-vertical" class="h-5 w-5 shrink-0"></i><span class="truncate">↕Y</span>';
    flipYBtn.title = S.lang === 'ru' ? 'Перевернуть по Y (отразить верх/низ)' : 'Flip by Y axis';
    flipYBtn.onclick = function () {
      S.simFlipY = !S.simFlipY;
      if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
    };
    c.appendChild(flipYBtn);

    // ↔X — переворот по X (лево↔право)
    const flipXBtn = document.createElement('button');
    flipXBtn.id = 'btn-sim-flipx';
    flipXBtn.className = btnBase + ' border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30';
    flipXBtn.innerHTML = '<i data-lucide="flip-horizontal" class="h-5 w-5 shrink-0"></i><span class="truncate">↔X</span>';
    flipXBtn.title = S.lang === 'ru' ? 'Перевернуть по X (отразить лево/право)' : 'Flip by X axis';
    flipXBtn.onclick = function () {
      S.simFlipX = !S.simFlipX;
      if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
    };
    c.appendChild(flipXBtn);

    // «Лицевая» — инвертирует сторону лицевой линии (синяя полоска)
    const faceBtn = document.createElement('button');
    faceBtn.id = 'btn-sim-face';
    const faceActive = (S.simFaceSide || 'up') === 'down';
    faceBtn.className = btnBase + ' ' + (faceActive
      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
      : 'border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30');
    faceBtn.innerHTML = '<i data-lucide="paintbrush" class="h-5 w-5 shrink-0"></i><span class="truncate">' + t('faceSide') + '</span>';
    faceBtn.title = S.lang === 'ru' ? 'Развернуть лицевую сторону заготовки' : 'Flip face side';
    faceBtn.onclick = function () {
      S.simFaceSide = ((S.simFaceSide || 'up') === 'up') ? 'down' : 'up';
      if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
      // Если 3D-симуляция открыта — перерисовать её
      if (sim3dModalOpen && typeof draw3DSimulation === 'function') draw3DSimulation();
      // Обновить кнопку (активное состояние) без полного renderAll
      const cur = document.getElementById('btn-sim-face');
      if (cur) {
        const on = (S.simFaceSide === 'down');
        cur.className = btnBase + ' ' + (on
          ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
          : 'border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30');
      }
    };
    c.appendChild(faceBtn);

    // ↺ «Сброс» — очистить все согнутые гибы
    if (bentCount > 0) {
      const resetBtn = document.createElement('button');
      resetBtn.id = 'btn-sim-reset';
      resetBtn.className = btnBase + ' border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30';
      resetBtn.innerHTML = '<i data-lucide="rotate-ccw" class="h-5 w-5 shrink-0"></i><span class="truncate">' + t('resetBends') + '</span>';
      resetBtn.onclick = function () {
        if (typeof resetAllBends === 'function') resetAllBends();
      };
      c.appendChild(resetBtn);
    }

    // «3D Сим» — 3D-симуляция (матрица, пуансон, упор, контур — вращается)
    const sim3DBtn = document.createElement('button');
    sim3DBtn.id = 'btn-sim-3d';
    sim3DBtn.className = btnBase + ' border-purple-600 bg-purple-600 hover:bg-purple-700 text-white border-purple-600';
    sim3DBtn.innerHTML = '<i data-lucide="box" class="h-5 w-5 shrink-0"></i><span class="truncate">3D ' + t('simulate') + '</span>';
    sim3DBtn.title = S.lang === 'ru' ? '3D симуляция гибки (матрица, пуансон, упор, контур — можно вращать)' : '3D bending simulation (rotatable)';
    sim3DBtn.onclick = function () { if (typeof toggle3DSimModal === 'function') toggle3DSimModal(); };
    c.appendChild(sim3DBtn);
  }
  // Перерисовываем иконки Lucide для добавленных плейсхолдеров.
  refreshIcons();
}

// ═══════════════════════════════════════════════════════════════
// UI / PARAMS — левая панель: параметры металла (ширина, тип,
// толщина, радиус, K-фактор, инструменты гибки) и настройки
// привязки. Плюс миниатюры инструментов (SVG).
// ═══════════════════════════════════════════════════════════════

// ==================== МИНИАТЮРЫ ИНСТРУМЕНТОВ (SVG) ====================
// Подпись размеров инструмента: V — ручей, S — ширина, H — высота (R для пуансона)
function toolSizeLabel(tool, isDie) {
  if (!tool) return '';
  const parts = [];
  if (isDie) {
    if (tool.vWidth && tool.vWidth > 0) parts.push('V' + tool.vWidth);
  } else {
    if (tool.radius && tool.radius > 0) parts.push('R' + tool.radius);
  }
  if (tool.swidth && tool.swidth > 0) parts.push('S' + tool.swidth);
  if (tool.height && tool.height > 0) parts.push('H' + tool.height);
  return parts.length ? '(' + parts.join(' ') + ')' : '';
}

function toolThumbSVG(tool, kind, w, h) {
  w = w || 70; h = h || 34;
  const pad = 4;
  if (!tool) return '';

  // Кастомный инструмент с профилем — рисуем его
  if (tool.isCustom && tool.profile && tool.profile.chains && tool.profile.chains.length) {
    return drawProfileSVG(tool.profile, w, h, kind === 'punch' ? '#ef4444' : '#3b82f6', pad);
  }
  // Старый формат (массив точек) — конвертируем на лету
  if (tool.isCustom && Array.isArray(tool.profile) && tool.profile.length) {
    const prof = {
      chains: [tool.profile],
      minX: Math.min(...tool.profile.map(p => p.x)),
      maxX: Math.max(...tool.profile.map(p => p.x)),
      minY: Math.min(...tool.profile.map(p => p.y)),
      maxY: Math.max(...tool.profile.map(p => p.y)),
      width: Math.max(...tool.profile.map(p => p.x)) - Math.min(...tool.profile.map(p => p.x)),
      height: Math.max(...tool.profile.map(p => p.y)) - Math.min(...tool.profile.map(p => p.y))
    };
    return drawProfileSVG(prof, w, h, kind === 'punch' ? '#ef4444' : '#3b82f6', pad);
  }

  // Стандартный инструмент — схематично
  const color = kind === 'punch' ? '#ef4444' : '#3b82f6';
  const usableW = w - pad * 2, usableH = h - pad * 2;
  if (kind === 'punch') {
    if (tool.radius) {
      return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '"><path d="M' + pad + ' ' + (h - pad) + ' L' + pad + ' ' + (h - tool.radius * 0.5) + ' A' + tool.radius * 0.5 + ' ' + tool.radius * 0.5 + ' 0 0 1 ' + (w - pad) + ' ' + (h - tool.radius * 0.5) + ' L' + (w - pad) + ' ' + (h - pad) + '" fill="none" stroke="' + color + '" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    }
  } else {
    const mid = w / 2;
    const depth = Math.min(usableH * 0.9, tool.vWidth * 0.45 || 6);
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '"><path d="M' + pad + ' ' + (h - pad) + ' L' + pad + ' ' + (h - pad - usableH * 0.5) + ' L' + mid + ' ' + (h - pad - depth) + ' L' + (w - pad) + ' ' + (h - pad - usableH * 0.5) + ' L' + (w - pad) + ' ' + (h - pad) + '" fill="none" stroke="' + color + '" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  }
  return '';
}

function drawProfileSVG(profile, w, h, color, pad) {
  // Поддержка обоих форматов: { chains } или массив точек
  let chains = null, minX = 0, minY = 0, pw = 0, ph = 0;
  if (profile && Array.isArray(profile.chains)) {
    chains = profile.chains;
    minX = profile.minX || 0; minY = profile.minY || 0;
    pw = profile.width; ph = profile.height;
  } else if (Array.isArray(profile) && profile.length) {
    chains = [profile];
    minX = Math.min(...profile.map(p => p.x));
    minY = Math.min(...profile.map(p => p.y));
    const maxX = Math.max(...profile.map(p => p.x));
    const maxY = Math.max(...profile.map(p => p.y));
    pw = maxX - minX; ph = maxY - minY;
  }
  if (!chains || pw <= 0 || ph <= 0) return '';
  pad = pad || 4;
  color = color || '#3b82f6';
  const usableW = w - pad * 2, usableH = h - pad * 2;
  const scale = Math.min(usableW / pw, usableH / ph) || 1;
  const offX = pad + (usableW - pw * scale) / 2;
  const offY = pad + (usableH - ph * scale) / 2;
  let d = '';
  chains.forEach(chain => {
    chain.forEach((p, pi) => {
      const sx = offX + (p.x - minX) * scale;
      const sy = offY + (ph - (p.y - minY)) * scale;
      d += (pi === 0 ? 'M' : 'L') + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' ';
    });
  });
  if (!d) return '';
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" style="display:block;max-width:100%"><path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></svg>';
}

// ==================== ПАРАМЕТРЫ МЕТАЛЛА ====================
function renderMetalParams() {
  const c = document.getElementById('metal-params-container');
  if (!c) return;
  const mt = METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0];
  const mtName = S.lang === 'en' ? mt.nameEn : mt.nameRu;
  let h = '';
  // Ширина заготовки — первый блок левой панели. Влияет на развёртку и вес.
  h += '<div class="space-y-1"><label class="text-xs font-medium">' + t('blankWidth') + ' <span class="text-gray-500">(mm)</span></label><input type="number" min="1" max="10000" step="1" value="' + S.metal.width + '" onchange="const v=parseFloat(this.value);if(!isNaN(v)&&v>0){setMetalWithUndo({width:v});doUnfold();renderAll()}" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2"></div>';
  // Тип металла
  h += '<div class="space-y-1"><label class="text-xs font-medium">' + t('metalType') + '</label><select onchange="selectMetalType(Number(this.value))" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 focus:outline-none focus:ring-2 focus:ring-green-500/30">';
  METAL_TYPES.forEach((m, i) => {
    h += '<option value="' + i + '"' + (i === S.metal.metalTypeIndex ? ' selected' : '') + '>' + (S.lang === 'en' ? m.nameEn : m.nameRu) + '</option>';
  });
  h += '</select></div>';
  // Толщина
  h += '<div class="space-y-1"><label class="text-xs font-medium">' + t('thickness') + ' <span class="text-gray-500">(mm)</span></label><select onchange="setMetalWithUndo({thickness:Number(this.value)})" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2">';
  THICKNESS_OPTIONS.forEach(th => {
    h += '<option value="' + th + '"' + (th === S.metal.thickness ? ' selected' : '') + '>' + th + ' mm</option>';
  });
  h += '</select></div>';
  // Радиус гиба
  h += '<div class="space-y-1"><label class="text-xs font-medium">' + t('bendRadius') + ' <span class="text-gray-500">(mm)</span></label><input type="number" min="0.1" max="100" step="0.5" value="' + S.metal.bendRadius + '" onchange="const v=parseFloat(this.value);if(!isNaN(v)&&v>0){setMetalWithUndo({bendRadius:v});doUnfold();renderAll()}" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2"></div>';
  // Матрица и пуансон — единый реестр: встроенные + свои инструменты
  const die = getDieByIndex(S.metal.dieIndex);
  const punch = getPunchByIndex(S.metal.punchIndex);
  const allDies = getAllDies();
  const allPunches = getAllPunches();
  h += '<div class="rounded-md border border-gray-200 dark:border-gray-700 p-2 space-y-2"><div class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1"><i data-lucide="hammer" class="h-3 w-3"></i>' + t('bendTool') + '</div>';
  // Чекбокс «Установить инструмент» — переключатель режимов:
  //   ВКЛ  → инструменты можно двигать (установка)
  //   ВЫКЛ → инструменты заблокированы (симуляция)
  const installOn = !S.toolLocked && S.showToolsOnCanvas;
  h += '<div class="flex items-center justify-between rounded-md ' + (installOn ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50' : 'bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700') + ' px-2 py-1.5"><label class="text-xs font-semibold flex items-center gap-1.5 cursor-pointer ' + (installOn ? 'text-amber-700 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400') + '" title="' + t('installToolHint') + '"><i data-lucide="' + (installOn ? 'unlock' : 'lock') + '" class="h-3.5 w-3.5"></i>' + t('installTool') + '</label><div class="switch' + (installOn ? ' active' : '') + '" id="install-tool-switch" onclick="var _on=(!S.toolLocked && S.showToolsOnCanvas); if(_on){S.toolLocked=true;} else {S.toolLocked=false; S.showToolsOnCanvas=true; S.simMode=true;} renderMetalParams(); if(typeof renderToolButtons===\'function\')renderToolButtons(); if(typeof drawDrawCanvas===\'function\')drawDrawCanvas();"></div></div>';
  h += '<div class="grid grid-cols-2 gap-2">';
  h += '<div class="space-y-1"><label class="text-[10px] text-gray-500">' + t('dieSelect') + '</label><select onchange="setMetalWithUndo({dieIndex:Number(this.value)});doUnfold();renderAll()" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1">';
  if (allDies.length === 0) {
    h += '<option value="0" selected>' + (S.lang === 'en' ? 'No dies yet' : 'Нет матриц — добавьте свою') + '</option>';
  }
  allDies.forEach((d, i) => {
    h += '<option value="' + i + '"' + (i === S.metal.dieIndex ? ' selected' : '') + '>' + (S.lang === 'en' ? d.nameEn : d.nameRu) + ' ' + toolSizeLabel(d, true) + (d.isCustom ? ' ★' : '') + '</option>';
  });
  h += '</select>';
  h += '<div class="mt-1 rounded border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 h-9 flex items-center justify-center overflow-hidden">' + (die ? toolThumbSVG(die, 'die', 70, 32) : '<span class="text-[9px] text-gray-400">—</span>') + '</div>';
  h += '</div>';
  h += '<div class="space-y-1"><label class="text-[10px] text-gray-500">' + t('punchSelect') + '</label><select onchange="setMetalWithUndo({punchIndex:Number(this.value)});doUnfold();renderAll()" class="w-full h-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1">';
  if (allPunches.length === 0) {
    h += '<option value="0" selected>' + (S.lang === 'en' ? 'No punches yet' : 'Нет пуансонов — добавьте свой') + '</option>';
  }
  allPunches.forEach((p, i) => {
    h += '<option value="' + i + '"' + (i === S.metal.punchIndex ? ' selected' : '') + '>' + (S.lang === 'en' ? p.nameEn : p.nameRu) + ' ' + toolSizeLabel(p, false) + (p.isCustom ? ' ★' : '') + '</option>';
  });
  h += '</select>';
  h += '<div class="mt-1 rounded border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 h-9 flex items-center justify-center overflow-hidden">' + (punch ? toolThumbSVG(punch, 'punch', 70, 32) : '<span class="text-[9px] text-gray-400">—</span>') + '</div>';
  h += '</div>';
  h += '</div>';
  // Кнопки своих инструментов
  h += '<div class="grid grid-cols-2 gap-1.5 pt-1">';
  h += '<button onclick="showCustomDieDialog()" class="text-[9px] h-6 px-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/50">' + t('customDie') + '</button>';
  h += '<button onclick="showCustomPunchDialog()" class="text-[9px] h-6 px-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/50">' + t('customPunch') + '</button>';
  h += '</div>';
  // Чекбокс: учитывать толщину матрицы
  h += '<div class="flex items-center justify-between pt-1"><label class="text-[10px] text-gray-500 flex items-center gap-1"><i data-lucide="ruler" class="h-3 w-3"></i>' + t('checkDieHeight') + '</label><div class="switch' + (S.checkDieHeight ? ' active' : '') + '" onclick="S.checkDieHeight=!S.checkDieHeight;doUnfold();renderAll()"></div></div>';
  h += '</div>';
  // K-фактор
  h += '<div class="space-y-1"><div class="flex items-center justify-between"><label class="text-xs font-medium" title="' + t('kFactorTooltip') + '">' + t('kFactor') + '</label><span id="kf-display" class="text-xs font-mono text-gray-500 tabular-nums">' + S.metal.kFactor.toFixed(2) + '</span></div><input type="range" min="0.1" max="0.7" step="0.01" value="' + S.metal.kFactor + '" oninput="setMetalWithUndo({kFactor:Number(this.value)});document.getElementById(\'kf-display\').textContent=Number(this.value).toFixed(2)" class="w-full"></div>';
  c.innerHTML = h;
}

// ==================== НАСТРОЙКИ ПРИВЯЗКИ ====================
function renderSnapSettings() {
  const c = document.getElementById('snap-container');
  if (!c) return;
  let h = '';
  h += '<div class="flex items-center justify-between"><label class="text-xs font-medium flex items-center gap-1.5"><i data-lucide="magnet" class="h-3 w-3"></i>' + t('snapToGrid') + '</label><div class="switch' + (S.snapToGrid ? ' active' : '') + '" onclick="S.snapToGrid=!S.snapToGrid;renderAll()"></div></div>';
  if (S.snapToGrid) {
    h += '<div class="space-y-1"><div class="flex items-center justify-between"><span class="text-[10px] text-gray-500">' + t('gridStep') + '</span><span class="text-[10px] text-gray-500 font-mono tabular-nums" id="grid-step-val">' + S.gridSize + ' mm</span></div>';
    h += '<input type="range" min="1" max="50" step="1" value="' + S.gridSize + '" oninput="S.gridSize=Number(this.value);document.getElementById(\'grid-step-val\').textContent=Number(this.value)+\' mm\';drawDrawCanvas()" onchange="S.gridSize=Number(this.value);drawDrawCanvas()" class="w-full"></div>';
  }
  h += '<div class="flex items-center justify-between"><label class="text-xs font-medium flex items-center gap-1.5"><i data-lucide="compass" class="h-3 w-3"></i>' + t('angleSnap') + '</label><span class="text-[10px] font-mono text-gray-500 tabular-nums">' + (S.angleSnap === 'none' ? '\u2014' : S.angleSnap + '°') + '</span></div>';
  h += '<div class="flex gap-1">';
  ['none', '15', '30', '45', '90'].forEach(v => {
    h += '<button onclick="S.angleSnap=\'' + v + '\';renderAll()" class="flex-1 text-[10px] py-1 rounded-md border transition-all ' +
      (S.angleSnap === v ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 dark:border-gray-700 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-950/30') +
      '">' + (v === 'none' ? '\u2014' : v + '°') + '</button>';
  });
  h += '</div>';
  h += '<div class="flex items-center justify-between"><label class="text-xs font-medium flex items-center gap-1.5"><i data-lucide="hammer" class="h-3 w-3"></i>' + t('showToolsOnCanvas') + '</label><div class="switch' + (S.showToolsOnCanvas ? ' active' : '') + '" onclick="S.showToolsOnCanvas=!S.showToolsOnCanvas;if(!S.showToolsOnCanvas){S.previewBendIdx=null;S.previewFlip=false;}renderSnapSettings();drawDrawCanvas()"></div></div>';
  c.innerHTML = h;
}

// ═══════════════════════════════════════════════════════════════
// UI / POINTS-TABLE — статистика профиля, таблица точек,
// шаблоны фигур (пресеты)
// ═══════════════════════════════════════════════════════════════

// ==================== СТАТИСТИКА ПРОФИЛЯ ====================
function renderStats() {
  const c = document.getElementById('stats-container');
  if (!c) return;
  if (S.points.length < 2) { c.innerHTML = ''; return; }
  const totalLen = S.points.slice(0, -1).reduce((s, p, i) => {
    const dx = S.points[i + 1].x - p.x, dy = S.points[i + 1].y - p.y;
    return s + Math.sqrt(dx * dx + dy * dy);
  }, 0);
  c.innerHTML = '<hr class="my-3 border-gray-200 dark:border-gray-700"><div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-2.5 space-y-1"><p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium">' + t('profileStats') + '</p><div class="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs"><span class="text-gray-500 dark:text-gray-400">' + t('pointsLabel') + '</span><span class="text-right font-mono tabular-nums">' + S.points.length + ' ' + pointWord(S.points.length) + '</span><span class="text-gray-500 dark:text-gray-400">' + t('profileLength') + '</span><span class="text-right font-mono tabular-nums">' + totalLen.toFixed(1) + ' mm</span></div></div>';
}

// ==================== ТАБЛИЦА ТОЧЕК ====================
function renderPointsTable() {
  const c = document.getElementById('points-table-container');
  if (!c) return;
  if (!S.points.length) { c.innerHTML = ''; return; }
  let h = '<hr class="my-3 border-gray-200 dark:border-gray-700"><div class="space-y-1.5"><div class="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400"><span class="flex items-center gap-1.5"><i data-lucide="crosshair" class="h-3 w-3"></i>' + t('pointsLabel') + ' <span class="text-[10px] opacity-60">(' + S.points.length + ')</span></span></div>';
  h += '<div class="max-h-[120px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"><div class="grid grid-cols-4 text-[10px]">';
  h += '<div class="font-medium text-gray-500 dark:text-gray-400 px-2 py-1 border-b sticky top-0 bg-white dark:bg-gray-800">#</div>';
  h += '<div class="font-medium text-gray-500 dark:text-gray-400 px-2 py-1 border-b sticky top-0 bg-white dark:bg-gray-800">X, Y</div>';
  h += '<div class="font-medium text-gray-500 dark:text-gray-400 px-2 py-1 border-b sticky top-0 bg-white dark:bg-gray-800"></div>';
  h += '<div class="font-medium text-gray-500 dark:text-gray-400 px-2 py-1 border-b sticky top-0 bg-white dark:bg-gray-800"></div>';
  S.points.forEach((p, i) => {
    h += '<div class="px-2 py-0.5 font-mono tabular-nums text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700/30">' + i + '</div>';
    h += '<div class="px-2 py-0.5 font-mono tabular-nums border-b border-gray-100 dark:border-gray-700/30">' + p.x.toFixed(1) + ', ' + p.y.toFixed(1) + '</div>';
    h += '<button onclick="editPoint(' + i + ')" class="px-1 py-0.5 border-b border-gray-100 dark:border-gray-700/30 hover:bg-green-50 dark:hover:bg-green-950/30 text-green-600 dark:text-green-400 cursor-pointer" title="' + t('edit') + '"><i data-lucide="pencil" class="h-2.5 w-2.5"></i></button>';
    h += '<button onclick="removePoint(' + i + ');renderAll()" class="px-1 py-0.5 border-b border-gray-100 dark:border-gray-700/30 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 cursor-pointer" title="' + t('delete') + '"><i data-lucide="x" class="h-2.5 w-2.5"></i></button>';
  });
  h += '</div></div>';
  h += '</div>';
  c.innerHTML = h;
}

// ==================== ШАБЛОНЫ (ПРЕСЕТЫ) ====================
function renderPresets() {
  const c = document.getElementById('presets-container');
  if (!c) return;
  let h = '<div class="space-y-2"><h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-l-2 border-green-500 pl-2"><i data-lucide="shapes" class="h-3 w-3"></i><span>' + t('templates') + '</span></h3><div class="grid grid-cols-3 gap-1.5">';
  PRESET_SHAPES.forEach((sh, idx) => {
    const name = S.lang === 'en' ? sh.nameEn : sh.nameRu;
    const pts = PRESET_SVG_PTS[sh.nameRu] || '2,14 10,14';
    h += '<button onclick="loadPreset(' + idx + ')" class="group flex flex-col items-center justify-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950/30 dark:hover:border-green-700 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.97]"><svg viewBox="0 0 16 16" class="w-6 h-4 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="' + pts + '"/></svg><span class="text-[8px] text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-center leading-tight line-clamp-2">' + name + '</span></button>';
  });
  h += '</div></div>';
  c.innerHTML = h;
}

function loadPreset(idx) {
  const shape = PRESET_SHAPES[idx];
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  S.points = shape.points.map(pt => ({ ...pt }));
  S.hems = [];
  S.redoHistory = [];
  S.unfoldResult = null;
  // Сброс состояния симуляции: другой профиль — старые гибы бессмысленны
  // (v4.4: единый полный сброс, включая шаги 3D-симуляции)
  if (typeof resetSimulationState === 'function') resetSimulationState();
  if (S.simAnimRunning && typeof stopAnimation === 'function') stopAnimation();
  if (S.autoUnfold) maybeAutoUnfold();
  ufManualZoom = null;
  view3dUserZoomed = false;
  renderAll();
}

// ═══════════════════════════════════════════════════════════════
// UI / UNFOLD-INFO — правая панель: спецификация (BOM), размеры,
// вес, материал, инструменты, детали гибов, сегменты развёртки +
// мобильная панель развёртки
// ═══════════════════════════════════════════════════════════════

function renderUnfoldInfo() {
  const c = document.getElementById('unfold-info');
  const badge = document.getElementById('bend-badge');
  const playBtn = document.getElementById('btn-play-pause');
  if (!c) return;
  if (!S.unfoldResult || S.unfoldResult.totalLength <= 0) {
    if (badge) badge.classList.add('hidden');
    if (playBtn) playBtn.classList.add('hidden');
    c.innerHTML = '<div class="flex flex-col items-center justify-center py-6 text-center"><div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-3 animate-pulse"><i data-lucide="info" class="h-5 w-5 text-gray-400"></i></div><p class="text-xs text-gray-500 dark:text-gray-400">' + t('noUnfold') + '</p></div>';
    refreshIcons();
    return;
  }
  const res = S.unfoldResult;
  const mt = METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0];
  const mtName = S.lang === 'en' ? mt.nameEn : mt.nameRu;
  if (badge) {
    badge.classList.remove('hidden');
    badge.textContent = res.bendInfos.length + ' ' + bendWord(res.bendInfos.length);
  }
  if (playBtn) {
    if (res.bendLinePositions.length > 0) playBtn.classList.remove('hidden');
    else playBtn.classList.add('hidden');
  }
  const area = res.totalLength * res.width;
  const wt = calcWeight(area, S.metal.thickness, S.metal.metalTypeIndex);
  const fmtW = wt < .001 ? (wt * 1000).toFixed(1) + ' ' + t('weightG') : wt < 1 ? (wt * 1000).toFixed(0) + ' ' + t('weightG') : wt.toFixed(3) + ' ' + t('weightKg');
  const density = getMetalDensity(S.metal.metalTypeIndex, S.metal.thickness) * 1e9;
  // Инструменты (свои или пресеты)
  const die = getDieByIndex(S.metal.dieIndex);
  const punch = getPunchByIndex(S.metal.punchIndex);
  let h = '';
  // BOM
  h += '<div class="rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600/50 p-2.5"><p class="text-[10px] text-gray-500 dark:text-gray-400 font-semibold border-l-2 border-green-500 pl-2 mb-1.5">' + t('bomTitle') + '</p>';
  h += '<div class="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]"><span class="text-gray-500 dark:text-gray-400">' + t('partNo') + '</span><span class="text-right font-mono tabular-nums truncate">' + (S.metal.partNumber || '\u2014') + '</span>';
  h += '<span class="text-gray-500 dark:text-gray-400">' + t('material') + '</span><span class="text-right font-mono tabular-nums truncate">' + mtName + '</span>';
  h += '<span class="text-gray-500 dark:text-gray-400">' + t('thickShort') + '</span><span class="text-right font-mono tabular-nums">' + S.metal.thickness + ' mm</span>';
  h += '<span class="text-gray-500 dark:text-gray-400">L</span><span class="text-right font-mono tabular-nums">' + res.totalLength.toFixed(1) + ' mm</span>';
  h += '<span class="text-gray-500 dark:text-gray-400">' + t('bendWord1') + '</span><span class="text-right font-mono tabular-nums">' + res.bendInfos.length + '</span>';
  h += '<span class="text-gray-500 dark:text-gray-400">' + t('blankWeight') + '</span><span class="text-right font-mono tabular-nums font-semibold">' + fmtW + '</span>';
  if (S.hems && S.hems.length > 0) {
    h += '<span class="text-gray-500 dark:text-gray-400">' + t('hem') + '</span><span class="text-right font-mono tabular-nums">';
    h += S.hems.map(hm => {
      const sn = hm.segIndex < S.points.length - 1 ? (hm.segIndex + 1) : S.points.length - 1;
      return (sn + ':' + hm.height + (hm.side === 'right' ? '→' : '←'));
    }).join(' | ');
    h += '</span>';
  }
  h += '</div></div>';
  // Габариты
  h += '<div class="grid grid-cols-2 gap-2"><div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-2 text-center"><p class="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">' + t('lengthLabel') + '</p><p class="text-sm font-bold tabular-nums">' + res.totalLength.toFixed(1) + ' <span class="text-[10px] font-normal text-gray-500">' + t('mm') + '</span></p></div>';
  h += '<div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-2 text-center"><p class="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">' + t('widthLabel') + '</p><p class="text-sm font-bold tabular-nums">' + res.width.toFixed(1) + ' <span class="text-[10px] font-normal text-gray-500">' + t('mm') + '</span></p></div></div>';
  // Вес
  h += '<div class="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 p-2.5"><div class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center"><i data-lucide="weight" class="h-3.5 w-3.5 text-green-700 dark:text-green-400"></i></div><div class="flex-1"><p class="text-[10px] text-green-600 dark:text-green-400 font-medium">' + t('weightTitle') + '</p><p class="text-lg font-black text-green-800 dark:text-green-200 tabular-nums">' + fmtW + '</p></div></div><p class="text-[10px] text-green-600/70 dark:text-green-400/60 mt-1.5">' + t('areaLabel') + ': ' + (area / 100).toFixed(1) + t('areaSuffix') + '</p></div>';
  // Материал
  h += '<div class="rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600/50 p-2.5"><div class="flex items-center gap-2"><div class="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center"><i data-lucide="info" class="h-3 w-3 text-blue-600 dark:text-blue-400"></i></div><div class="flex-1"><p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium">' + t('material') + '</p><p class="text-[10px] font-medium truncate">' + mtName + '</p></div></div>';
  h += '<div class="grid grid-cols-3 gap-x-2 mt-1.5 text-[9px]"><div><span class="text-gray-500 dark:text-gray-400">' + t('density') + '</span><p class="font-mono tabular-nums">' + density.toFixed(1) + ' ' + t('densityUnit') + '</p></div>';
  h += '<div><span class="text-gray-500 dark:text-gray-400">' + t('thickShort') + '</span><p class="font-mono tabular-nums">' + S.metal.thickness + ' mm</p></div>';
  h += '<div><span class="text-gray-500 dark:text-gray-400">R/K</span><p class="font-mono tabular-nums">' + S.metal.bendRadius + '/' + S.metal.kFactor.toFixed(2) + '</p></div></div></div>';
  // Миниатюры инструментов + углы гибов
  h += '<div class="rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600/50 p-2.5"><div class="flex items-center gap-2 mb-1.5"><div class="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center"><i data-lucide="hammer" class="h-3 w-3 text-blue-600 dark:text-blue-400"></i></div><p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium">' + t('bendTool') + '</p></div>';
  h += '<div class="grid grid-cols-2 gap-2">';
  // Матрица
  h += '<div class="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1.5"><p class="text-[9px] text-gray-500 dark:text-gray-400 mb-1">' + t('dieSelect') + '</p><div class="h-12 flex items-center justify-center overflow-hidden">' + (die ? toolThumbSVG(die, 'die', 80, 44) : '<span class="text-[9px] text-gray-400">\u2014</span>') + '</div>';
  if (die) h += '<p class="text-[9px] text-gray-500 dark:text-gray-400 mt-1 font-mono">' + toolSizeLabel(die, true) + '</p>';
  h += '</div>';
  // Пуансон
  h += '<div class="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1.5"><p class="text-[9px] text-gray-500 dark:text-gray-400 mb-1">' + t('punchSelect') + '</p><div class="h-12 flex items-center justify-center overflow-hidden">' + (punch ? toolThumbSVG(punch, 'punch', 80, 44) : '<span class="text-[9px] text-gray-400">\u2014</span>') + '</div>';
  if (punch) h += '<p class="text-[9px] text-gray-500 dark:text-gray-400 mt-1 font-mono">' + toolSizeLabel(punch, false) + '</p>';
  h += '</div>';
  h += '</div>';
  // Углы гибов
  if (res.bendInfos && res.bendInfos.length > 0) {
    h += '<div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700"><p class="text-[9px] text-gray-500 dark:text-gray-400 mb-1">' + t('bendWord1') + ' (' + res.bendInfos.length + ')</p><div class="flex flex-wrap gap-1">';
    res.bendInfos.forEach((b, i) => {
      const interior = (Math.PI - b.bendAngle) * 180 / Math.PI;
      h += '<span class="text-[9px] px-1.5 py-0.5 rounded bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 font-mono tabular-nums border border-orange-200 dark:border-orange-800/50">' + (i + 1) + ': ' + interior.toFixed(0) + '\u00b0</span>';
    });
    h += '</div></div>';
  }
  h += '</div>';
  // Сегменты развёртки (раскрывающийся блок)
  h += '<button onclick="S.showSegments=!S.showSegments;renderUnfoldInfo()" class="w-full flex items-center justify-between text-[10px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 py-1"><span class="flex items-center gap-1"><i data-lucide="table-properties" class="h-3 w-3"></i>' + t('segmentsTitle') + '</span><span class="transition-transform duration-200 ' + (S.showSegments ? 'rotate-180' : '') + '">\u25bc</span></button>';
  if (S.showSegments) {
    h += '<div class="max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"><table class="w-full text-[10px]"><thead><tr class="border-b bg-gray-50 dark:bg-gray-700/30"><th class="text-left px-2 py-1 font-medium text-gray-500">#</th><th class="text-left px-2 py-1 font-medium text-gray-500">' + t('segBend') + '/' + t('segStraight') + '</th><th class="text-right px-2 py-1 font-medium text-gray-500">' + t('mm') + '</th><th class="text-right px-2 py-1 font-medium text-gray-500 hidden lg:table-cell">' + t('segCumul') + '</th></tr></thead><tbody>';
    let cum = 0;
    res.elements.forEach((el, i) => {
      const isS = el.type === 'straight';
      const isHem = el.type === 'hem';
      const isBend = el.type === 'bend';
      const badBend = isBend && el.feasible === false;
      const len = isS ? el.length : (isHem ? el.length : el.bendAllowance);
      cum += len;
      let rowBg = isS ? '' : (isHem ? 'bg-blue-50/50 dark:bg-blue-950/20' : 'bg-orange-50/50 dark:bg-orange-950/20');
      if (badBend) rowBg = 'bg-red-50/70 dark:bg-red-950/40';
      h += '<tr class="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50 ' + rowBg + '"><td class="px-2 py-1 text-gray-500 font-mono">' + (i + 1) + '</td>';
      h += '<td class="px-2 py-1"><span class="' + (isS ? 'text-green-700 dark:text-green-400' : (isHem ? 'text-blue-600 dark:text-blue-400' : badBend ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-orange-600 dark:text-orange-400 font-medium')) + '">' + (isS ? t('segStraight') : (isHem ? t('hem') + (el.edge === 'bottom' ? '↓' : '↑') : (badBend ? '\u26a0 ' : '') + t('segBend'))) + '</span>';
      if (!isS && !isHem) h += '<span class="ml-1 font-mono ' + (badBend ? 'text-red-500' : 'text-orange-500') + '">' + ((el.angle * 180 / Math.PI).toFixed(0)) + '°</span>';
      h += '</td><td class="px-2 py-1 text-right font-mono tabular-nums">' + len.toFixed(2) + '</td><td class="px-2 py-1 text-right font-mono tabular-nums text-gray-500 hidden lg:table-cell">' + cum.toFixed(1) + '</td></tr>';
    });
    h += '<tfoot><tr class="border-t bg-gray-100 dark:bg-gray-700/20 font-semibold"><td colspan="2" class="px-2 py-1 text-gray-500">' + t('total') + '</td><td class="px-2 py-1 text-right font-mono tabular-nums">' + res.totalLength.toFixed(2) + '</td><td class="px-2 py-1 text-right font-mono tabular-nums text-gray-500 hidden lg:table-cell">' + res.totalLength.toFixed(1) + '</td></tr></tfoot></table></div>';
  }
  // Детали гибов
  if (res.bendInfos.length > 0) {
    h += '<div class="space-y-1 mt-2"><p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium">' + t('bendDetails') + '</p><div class="max-h-32 overflow-y-auto space-y-0.5">';
    res.bendInfos.forEach((b, i) => {
      const bad = b.feasible === false;
      h += '<div class="flex items-center justify-between text-[10px] rounded px-2 py-1 ' + (bad ? 'bg-red-50 dark:bg-red-950/30 border border-red-300/50' : 'bg-gray-50 dark:bg-gray-700/20') + '"><span class="text-gray-500">' + t('bend') + (i + 1) + (bad ? ' \u26a0' : '') + '</span><span class="' + (bad ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400') + ' font-mono tabular-nums">' + (b.bendAngle * 180 / Math.PI).toFixed(1) + '°</span><span class="text-gray-500 font-mono tabular-nums">' + t('ba') + b.bendAllowance.toFixed(2) + '</span></div>';
    });
    h += '</div></div>';
  }
  c.innerHTML = h;
  refreshIcons();
}

// ==================== МОБИЛЬНАЯ ПАНЕЛЬ РАЗВЁРТКИ ====================
function renderMobileUnfold() {
  const c = document.getElementById('mobile-unfold');
  if (!c) return;
  if (!S.unfoldResult || S.unfoldResult.totalLength <= 0) { c.innerHTML = ''; return; }
  const res = S.unfoldResult;
  const mt = METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0];
  const wt = calcWeight(res.totalLength * res.width, S.metal.thickness, S.metal.metalTypeIndex);
  const fmtW = wt < .001 ? (wt * 1000).toFixed(1) + ' ' + t('weightG') : wt < 1 ? (wt * 1000).toFixed(0) + ' ' + t('weightG') : wt.toFixed(3) + ' ' + t('weightKg');
  c.innerHTML = '<div class="flex items-center justify-between"><h2 class="text-xs font-semibold flex items-center gap-1.5"><i data-lucide="box" class="h-3.5 w-3.5 text-green-600 dark:text-green-400"></i>' + t('unfoldTitle') + ' <span class="text-[9px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full">' + res.bendInfos.length + ' ' + bendWord(res.bendInfos.length) + '</span></h2></div>' +
    '<div class="h-32 rounded-lg overflow-hidden border border-green-200 dark:border-green-800 flex flex-col" id="mobile-unfold-cv"></div>' +
    '<div class="grid grid-cols-3 gap-2 text-center"><div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-1.5"><p class="text-[9px] text-gray-500">' + t('lengthLabel') + '</p><p class="text-xs font-bold tabular-nums">' + res.totalLength.toFixed(1) + ' <span class="text-[9px] font-normal text-gray-500">' + t('mm') + '</span></p></div><div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-1.5"><p class="text-[9px] text-gray-500">' + t('widthLabel') + '</p><p class="text-xs font-bold tabular-nums">' + res.width.toFixed(1) + ' <span class="text-[9px] font-normal text-gray-500">' + t('mm') + '</span></p></div><div class="rounded-lg bg-green-50 dark:bg-green-950/30 p-1.5"><p class="text-[9px] text-green-600 dark:text-green-400">' + t('weightTitle') + '</p><p class="text-xs font-bold text-green-800 dark:text-green-200 tabular-nums">' + fmtW + '</p></div></div>' +
    '<div class="flex gap-1.5"><button onclick="showDxfOptions()" class="flex-1 text-xs h-7 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-md flex items-center justify-center gap-1"><i data-lucide="file-down" class="h-3 w-3"></i>DXF</button><button onclick="exportSVG()" class="flex-1 text-xs h-7 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-md flex items-center justify-center gap-1"><i data-lucide="file-code-2" class="h-3 w-3"></i>SVG</button><button onclick="exportPNG(true)" class="flex-1 text-xs h-7 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-md flex items-center justify-center gap-1"><i data-lucide="image" class="h-3 w-3"></i>PNG</button></div>';
  refreshIcons();
}

// ═══════════════════════════════════════════════════════════════
// UI / DRAWING — генерация готового чертежа (A4): профиль + развёртка
// + титульный блок + листы «Последовательность гибки» (по шагам
// симуляции, с упором и лицевой стороной). Скачивание PNG / печать.
//
// FIX v4.1: нумерация гибов теперь учитывает порядок симуляции
// (S.simBentMarkers), а не несуществующие поля simBends/bendOrder.
// ═══════════════════════════════════════════════════════════════

function generateDrawing() {
  if (!S.unfoldResult || S.points.length < 2) return;
  const res = S.unfoldResult;
  const mt = METAL_TYPES[S.metal.metalTypeIndex] || METAL_TYPES[0];
  const mtName = S.lang === 'en' ? mt.nameEn : mt.nameRu;
  // Невозможные гибы
  const badBends = (res.bendInfos || []).filter(b => b.feasible === false);
  const die = getDieByIndex(S.metal.dieIndex);
  const punch = getPunchByIndex(S.metal.punchIndex);
  const L = res.totalLength, W = res.width;
  const area = L * W;
  const wt = calcWeight(area, S.metal.thickness, S.metal.metalTypeIndex);
  const fmtW = wt < .001 ? (wt * 1000).toFixed(1) + ' ' + t('weightG') : wt < 1 ? (wt * 1000).toFixed(0) + ' ' + t('weightG') : wt.toFixed(3) + ' ' + t('weightKg');
  const density = getMetalDensity(S.metal.metalTypeIndex, S.metal.thickness) * 1e9;
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);

  // Карта порядка гибки: bendIndex → порядковый номер шага (1-based)
  // Приоритет: порядок СИМУЛЯЦИИ (simBentMarkers) > старые поля > естественный порядок
  const simOrder = (Array.isArray(S.simBentMarkers) && S.simBentMarkers.length > 0) ? S.simBentMarkers : null;
  const legacyOrder = (Array.isArray(S.simBends) && S.simBends.length > 0) ? S.simBends : ((S.bendOrder && S.bendOrder.length > 0) ? S.bendOrder : null);
  const bendOrder = simOrder || legacyOrder || (res.bendInfos || []).map((b, i) => i);
  const bendStepMap = {}; // bendIndex → step number
  bendOrder.forEach((bendIdx, stepNum) => { bendStepMap[bendIdx] = stepNum + 1; });

  // A4 landscape: 297x210mm, 3px/mm
  const pxPerMm = 3;
  const CW = 297 * pxPerMm;
  const CH = 210 * pxPerMm;
  const border = 10 * pxPerMm;
  const titleH = 55 * pxPerMm;

  const cv = document.createElement('canvas');
  cv.width = CW; cv.height = CH;
  const ctx = cv.getContext('2d');

  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, CW, CH);
  ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
  ctx.strokeRect(border, border, CW - border * 2, CH - border * 2);

  const drawTop = border + 15;
  const drawBottom = CH - border - titleH - 15;
  const drawLeft = border + 15;
  const drawRight = CW - border - 15;
  const drawW = drawRight - drawLeft;
  const drawH = drawBottom - drawTop;

  // Profile 40%, Unfold 60%
  const profileW = drawW * 0.38;
  const unfoldW = drawW * 0.58;
  const gap = drawW * 0.04;
  const profileLeft = drawLeft;
  const unfoldLeft = profileLeft + profileW + gap;

  // Разделитель
  ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1;
  const sepX = profileLeft + profileW + gap / 2;
  ctx.beginPath(); ctx.moveTo(sepX, drawTop); ctx.lineTo(sepX, drawBottom); ctx.stroke();

  // === ВИД ПРОФИЛЯ ===
  ctx.fillStyle = '#333';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(t('drawingProfile'), profileLeft + profileW / 2, drawTop);

  let pMinX = Infinity, pMaxX = -Infinity, pMinY = Infinity, pMaxY = -Infinity;
  S.points.forEach(p => {
    if (p.x < pMinX) pMinX = p.x; if (p.x > pMaxX) pMaxX = p.x;
    if (p.y < pMinY) pMinY = p.y; if (p.y > pMaxY) pMaxY = p.y;
  });
  const pRangeX = pMaxX - pMinX || 1;
  const pRangeY = pMaxY - pMinY || 1;
  const profPad = 30;
  const profTop = drawTop + 20;
  const profBot = drawBottom - 10;
  const profAreaH = profBot - profTop;
  const pScale = Math.min((profileW - profPad * 2) / pRangeX, (profAreaH - profPad * 2) / pRangeY);
  const pOfsX = profileLeft + (profileW - pRangeX * pScale) / 2;
  const pOfsY = profTop + (profAreaH - pRangeY * pScale) / 2;

  function p2d(wx, wy) { return { x: pOfsX + (wx - pMinX) * pScale, y: pOfsY + (pMaxY - wy) * pScale }; }

  if (S.points.length >= 2) {
    ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2;
    ctx.beginPath();
    const p0 = p2d(S.points[0].x, S.points[0].y);
    ctx.moveTo(p0.x, p0.y);
    for (let i = 1; i < S.points.length; i++) {
      const pp = p2d(S.points[i].x, S.points[i].y);
      ctx.lineTo(pp.x, pp.y);
    }
    ctx.stroke();

    // Номера гибов = шаги из порядка симуляции
    const bendNumMap = {};
    if (res.bendInfos) res.bendInfos.forEach((b, idx) => { bendNumMap[b.vertexIndex] = bendStepMap[idx] || (idx + 1); });

    S.points.forEach((p, i) => {
      const pp = p2d(p.x, p.y);
      ctx.beginPath(); ctx.arc(pp.x, pp.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#16a34a'; ctx.fill();
      const bNum = bendNumMap[i];
      if (bNum) {
        ctx.fillStyle = '#c2410c'; ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(String(bNum), pp.x, pp.y - 5);
      }
    });

    // Размеры сегментов
    ctx.fillStyle = '#666'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < S.points.length - 1; i++) {
      const a = S.points[i], b = S.points[i + 1];
      const segLen = dist(a, b);
      const pa = p2d(a.x, a.y), pb = p2d(b.x, b.y);
      const mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2;
      const ang = Math.atan2(pb.y - pa.y, pb.x - pa.x);
      ctx.save();
      ctx.translate(mx + Math.cos(ang + Math.PI / 2) * 10, my + Math.sin(ang + Math.PI / 2) * 10);
      ctx.rotate(ang);
      ctx.fillText(segLen.toFixed(1), 0, 0);
      ctx.restore();
    }

    // Углы гибов на профиле
    const bendFeasMap = {};
    if (res.bendInfos) res.bendInfos.forEach(b => { bendFeasMap[b.vertexIndex] = b; });
    for (let i = 1; i < S.points.length - 1; i++) {
      const pp = p2d(S.points[i - 1].x, S.points[i - 1].y);
      const pc = p2d(S.points[i].x, S.points[i].y);
      const pn = p2d(S.points[i + 1].x, S.points[i + 1].y);
      const aToPrev = Math.atan2(pp.y - pc.y, pp.x - pc.x);
      const aToNext = Math.atan2(pn.y - pc.y, pn.x - pc.x);
      const ba = Math.abs(normAngle(aToNext - aToPrev));
      if (ba < 5 * Math.PI / 180) continue;
      const arcR = Math.min(18, pRangeX * pScale * 0.12, pRangeY * pScale * 0.12);
      const diff = normAngle(aToPrev - aToNext);
      const bInfo = bendFeasMap[i];
      const infeasible = bInfo && bInfo.feasible === false;
      ctx.strokeStyle = infeasible ? '#dc2626' : '#c2410c';
      ctx.lineWidth = infeasible ? 2 : 0.8;
      ctx.beginPath();
      ctx.arc(pc.x, pc.y, arcR, aToNext, aToPrev, diff < 0);
      ctx.stroke();
      const midA = aToNext + diff / 2;
      const lr = arcR + 10;
      ctx.fillStyle = infeasible ? '#dc2626' : '#c2410c';
      ctx.font = infeasible ? 'bold 9px sans-serif' : 'bold 8px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText((infeasible ? '\u26a0 ' : '') + (ba * 180 / Math.PI).toFixed(1) + '\u00b0', pc.x + Math.cos(midA) * lr, pc.y + Math.sin(midA) * lr);
    }

    // Крючки каймы на профиле
    if (S.hems && S.hems.length > 0) {
      const br = S.metal.bendRadius;
      S.hems.forEach(hem => {
        const si = hem.segIndex;
        const numSegs = S.points.length - 1;
        if (si < 0 || si > numSegs) return;
        let pt, neighbor;
        if (si >= numSegs - 1) {
          pt = S.points[S.points.length - 1];
          neighbor = S.points[S.points.length - 2];
        } else {
          pt = S.points[si];
          neighbor = S.points[si + 1];
        }
        const isLeft = hem.side !== 'right';
        const segAngle = Math.atan2(neighbor.y - pt.y, neighbor.x - pt.x);
        const perpAngle = isLeft ? (segAngle - Math.PI / 2) : (segAngle + Math.PI / 2);
        const h1w = { x: pt.x + Math.cos(perpAngle) * br, y: pt.y + Math.sin(perpAngle) * br };
        const h2w = { x: h1w.x + Math.cos(segAngle) * hem.height, y: h1w.y + Math.sin(segAngle) * hem.height };
        const c0 = p2d(pt.x, pt.y), c1 = p2d(h1w.x, h1w.y), c2 = p2d(h2w.x, h2w.y);
        const hColor = isLeft ? '#3b82f6' : '#8b5cf6';
        ctx.strokeStyle = hColor; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(c0.x, c0.y); ctx.lineTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.stroke();
        ctx.beginPath(); ctx.arc(c1.x, c1.y, 2.5, 0, Math.PI * 2); ctx.fillStyle = hColor; ctx.fill();
        const label = hem.height.toFixed(1) + ' mm';
        const lx = (c1.x + c2.x) / 2, ly = (c1.y + c2.y) / 2;
        const offset = isLeft ? -12 : 12;
        ctx.fillStyle = hColor; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(label, lx + (-Math.sin(segAngle) * offset), ly + (Math.cos(segAngle) * offset));
      });
    }
  }

  // === ВИД РАЗВЁРТКИ ===
  ctx.fillStyle = '#333';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(t('drawingUnfold'), unfoldLeft + unfoldW / 2, drawTop);

  const ufPad = 25;
  const ufTop = drawTop + 20;
  const ufBot = drawBottom - 35;
  const ufAreaH = ufBot - ufTop;
  const uScale = Math.min((unfoldW - ufPad * 2) / L, (ufAreaH - ufPad * 2) / W);
  const uOfsX = unfoldLeft + (unfoldW - L * uScale) / 2;
  const uOfsY = ufTop + (ufAreaH - W * uScale) / 2;

  ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2;
  ctx.strokeRect(uOfsX, uOfsY, L * uScale, W * uScale);

  res.elements.forEach(el => {
    if (el.type === 'straight') {
      ctx.fillStyle = '#dcfce7';
      ctx.fillRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      ctx.strokeStyle = '#16a34a33'; ctx.lineWidth = 0.5;
      ctx.strokeRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      if (el.length > 5) {
        const mx = (el.startX + el.endX) / 2;
        ctx.fillStyle = '#15803d'; ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(el.length.toFixed(1), uOfsX + mx * uScale, uOfsY + W * uScale / 2);
      }
    } else if (el.type === 'hem') {
      ctx.fillStyle = '#bfdbfe';
      ctx.fillRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1; ctx.setLineDash([2, 2]);
      ctx.strokeRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      ctx.setLineDash([]);
      const mx = (el.startX + el.endX) / 2;
      ctx.fillStyle = '#1d4ed8'; ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(el.length.toFixed(1), uOfsX + mx * uScale, uOfsY + W * uScale / 2);
    } else {
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      ctx.strokeStyle = '#ea580c33'; ctx.lineWidth = 0.5;
      ctx.strokeRect(uOfsX + el.startX * uScale, uOfsY, (el.endX - el.startX) * uScale, W * uScale);
      const mx = (el.startX + el.endX) / 2;
      ctx.fillStyle = '#c2410c'; ctx.font = '9px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText((el.angle * 180 / Math.PI).toFixed(0) + '\u00b0', uOfsX + mx * uScale, uOfsY + W * uScale / 2);
    }
  });

  ctx.setLineDash([4, 3]);
  res.bendLinePositions.forEach((xp, idx) => {
    const bInf = res.bendInfos[idx];
    const infeasible = bInf && bInf.feasible === false;
    ctx.strokeStyle = infeasible ? '#dc2626' : '#ea580c';
    ctx.lineWidth = infeasible ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(uOfsX + xp * uScale, uOfsY);
    ctx.lineTo(uOfsX + xp * uScale, uOfsY + W * uScale);
    ctx.stroke();
    const nx = uOfsX + xp * uScale, ny = uOfsY + 10;
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(nx, ny, 7, 0, Math.PI * 2);
    ctx.fillStyle = infeasible ? '#dc2626' : '#f97316'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(bendStepMap[idx] || (idx + 1)), nx, ny);
    ctx.setLineDash([4, 3]);
  });
  ctx.setLineDash([]);

  // Линии гиба каймы (синие, без номеров)
  if (res.hemBendLinePositions && res.hemBendLinePositions.length > 0) {
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1.5;
    res.hemBendLinePositions.forEach(xp => {
      ctx.beginPath();
      ctx.moveTo(uOfsX + xp * uScale, uOfsY);
      ctx.lineTo(uOfsX + xp * uScale, uOfsY + W * uScale);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  // Размеры развёртки
  const dimY = uOfsY + W * uScale + 12;
  ctx.strokeStyle = '#666'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(uOfsX, dimY); ctx.lineTo(uOfsX + L * uScale, dimY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(uOfsX, dimY - 3); ctx.lineTo(uOfsX, dimY + 3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(uOfsX + L * uScale, dimY - 3); ctx.lineTo(uOfsX + L * uScale, dimY + 3); ctx.stroke();
  ctx.fillStyle = '#555'; ctx.font = '9px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(L.toFixed(1) + ' mm', uOfsX + L * uScale / 2, dimY + 3);

  const dimX = uOfsX + L * uScale + 10;
  ctx.beginPath(); ctx.moveTo(dimX, uOfsY); ctx.lineTo(dimX, uOfsY + W * uScale); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dimX - 3, uOfsY); ctx.lineTo(dimX + 3, uOfsY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dimX - 3, uOfsY + W * uScale); ctx.lineTo(dimX + 3, uOfsY + W * uScale); ctx.stroke();
  ctx.save(); ctx.translate(dimX + 3, uOfsY + W * uScale / 2); ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#555'; ctx.font = '9px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(W.toFixed(1) + ' mm', 0, 0);
  ctx.restore();

  // Легенда
  const lgX = unfoldLeft + unfoldW - 5;
  const lgY = ufTop + 15;
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.font = '8px sans-serif';
  ctx.fillStyle = '#dcfce7'; ctx.fillRect(lgX - 50, lgY - 4, 10, 8);
  ctx.strokeStyle = '#16a34a33'; ctx.lineWidth = 0.5; ctx.strokeRect(lgX - 50, lgY - 4, 10, 8);
  ctx.fillStyle = '#555'; ctx.fillText(t('straightLegend'), lgX, lgY);
  ctx.fillStyle = '#fed7aa'; ctx.fillRect(lgX - 50, lgY + 10, 10, 8);
  ctx.strokeStyle = '#ea580c33'; ctx.lineWidth = 0.5; ctx.strokeRect(lgX - 50, lgY + 10, 10, 8);
  ctx.fillStyle = '#555'; ctx.fillText(t('bendLegend'), lgX, lgY + 14);

  // === ТИТУЛЬНЫЙ БЛОК ===
  const tbTop = CH - border - titleH;
  ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
  ctx.strokeRect(border, tbTop, CW - border * 2, titleH);
  ctx.beginPath(); ctx.moveTo(border + (CW - border * 2) * 0.6, tbTop); ctx.lineTo(border + (CW - border * 2) * 0.6, tbTop + titleH); ctx.stroke();

  const ts = 9; const lh = ts + 5;
  let ty = tbTop + 8;
  ctx.fillStyle = '#000'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText(t('drawingTitle') + ' \u2014 ' + (S.metal.partNumber || '\u2014'), border + 10, ty); ty += lh + 4;
  ctx.font = ts + 'px sans-serif';
  ctx.fillText(t('material') + ': ' + mtName, border + 10, ty); ty += lh;
  ctx.fillText(t('thickness') + ': ' + S.metal.thickness + ' mm', border + 10, ty); ty += lh;
  ctx.fillText('R: ' + S.metal.bendRadius + ' mm  |  K: ' + S.metal.kFactor.toFixed(2), border + 10, ty); ty += lh;
  ctx.fillText(t('bendWord1') + ': ' + res.bendInfos.length + '  |  L: ' + L.toFixed(1) + ' mm  |  W: ' + W.toFixed(1) + ' mm', border + 10, ty); ty += lh;
  ctx.fillText(t('dieSelect') + ': ' + (die ? (S.lang === 'en' ? die.nameEn : die.nameRu) : '\u2014') + '  |  ' + t('punchSelect') + ': ' + (punch ? (S.lang === 'en' ? punch.nameEn : punch.nameRu) : '\u2014'), border + 10, ty);

  ctx.textAlign = 'right'; ty = tbTop + 8;
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText(t('blankWeight') + ': ' + fmtW, CW - border - 10, ty); ty += lh + 4;
  ctx.font = ts + 'px sans-serif';
  ctx.fillText(t('areaLabel') + ': ' + (area / 100).toFixed(1) + t('areaSuffix'), CW - border - 10, ty); ty += lh;
  ctx.fillText(t('density') + ': ' + density.toFixed(1) + ' ' + t('densityUnit'), CW - border - 10, ty); ty += lh;
  ctx.fillText(dateStr, CW - border - 10, ty);

  // === МИНИАТЮРЫ ИНСТРУМЕНТОВ + УГЛЫ ГИБОВ ===
  const toolsTop = tbTop + 105;
  ctx.strokeStyle = '#999'; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(border + 10, toolsTop); ctx.lineTo(CW - border - 10, toolsTop); ctx.stroke();

  // Отрисовка профиля инструмента на canvas (аналог drawProfileSVG)
  function drawToolProfileOnCanvas(tool, kind, ox, oy, ow, oh) {
    const color = kind === 'punch' ? '#ef4444' : '#3b82f6';
    const pad = 3;
    let chains = null, minX = 0, minY = 0, pw = 0, ph = 0;
    if (tool.isCustom && tool.profile && tool.profile.chains && tool.profile.chains.length) {
      chains = tool.profile.chains;
      minX = tool.profile.minX || 0; minY = tool.profile.minY || 0;
      pw = tool.profile.width; ph = tool.profile.height;
    } else if (tool.isCustom && Array.isArray(tool.profile) && tool.profile.length) {
      chains = [tool.profile];
      minX = Math.min(...tool.profile.map(p => p.x));
      minY = Math.min(...tool.profile.map(p => p.y));
      const maxX = Math.max(...tool.profile.map(p => p.x));
      const maxY = Math.max(...tool.profile.map(p => p.y));
      pw = maxX - minX; ph = maxY - minY;
    }
    if (chains && pw > 0 && ph > 0) {
      const usableW = ow - pad * 2, usableH = oh - pad * 2;
      const scale = Math.min(usableW / pw, usableH / ph) || 1;
      const offX = ox + pad + (usableW - pw * scale) / 2;
      const offY = oy + pad + (usableH - ph * scale) / 2;
      ctx.strokeStyle = color; ctx.lineWidth = 1.2; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      chains.forEach(chain => {
        ctx.beginPath();
        chain.forEach((p, pi) => {
          const sx = offX + (p.x - minX) * scale;
          const sy = offY + (ph - (p.y - minY)) * scale;
          if (pi === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        });
        ctx.stroke();
      });
      return;
    }
    // Стандартный / без профиля — схематично
    const usableW = ow - pad * 2, usableH = oh - pad * 2;
    if (kind === 'punch') {
      const r = (tool.radius || 1) * 0.5;
      ctx.strokeStyle = color; ctx.lineWidth = 1.2; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(ox + pad, oy + oh - pad);
      ctx.lineTo(ox + pad, oy + oh - pad - usableH * 0.5);
      ctx.arc(ox + ow / 2, oy + oh - pad - usableH * 0.5, r, Math.PI, 0, false);
      ctx.lineTo(ox + ow - pad, oy + oh - pad);
      ctx.stroke();
    } else {
      const mid = ox + ow / 2;
      const depth = Math.min(usableH * 0.9, (tool.vWidth || 10) * 0.45);
      ctx.strokeStyle = color; ctx.lineWidth = 1.2; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(ox + pad, oy + oh - pad);
      ctx.lineTo(ox + pad, oy + oh - pad - usableH * 0.5);
      ctx.lineTo(mid, oy + oh - pad - depth);
      ctx.lineTo(ox + ow - pad, oy + oh - pad - usableH * 0.5);
      ctx.lineTo(ox + ow - pad, oy + oh - pad);
      ctx.stroke();
    }
  }

  // Матрица (слева)
  const dieX = border + 15;
  const dieY = toolsTop + 8;
  ctx.fillStyle = '#000'; ctx.font = '8px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText(t('dieSelect'), dieX, dieY);
  if (die) {
    drawToolProfileOnCanvas(die, 'die', dieX, dieY + 12, 60, 28);
    ctx.fillStyle = '#555'; ctx.font = '7px monospace';
    ctx.fillText(toolSizeLabel(die, true), dieX, dieY + 42);
  }

  // Пуансон (рядом с матрицей)
  const punchX = dieX + 80;
  ctx.fillStyle = '#000'; ctx.font = '8px sans-serif';
  ctx.fillText(t('punchSelect'), punchX, dieY);
  if (punch) {
    drawToolProfileOnCanvas(punch, 'punch', punchX, dieY + 12, 60, 28);
    ctx.fillStyle = '#555'; ctx.font = '7px monospace';
    ctx.fillText(toolSizeLabel(punch, false), punchX, dieY + 42);
  }

  // Углы гибов (справа)
  const bendsX = CW - border - 10;
  ctx.textAlign = 'right'; ctx.textBaseline = 'top';
  ctx.fillStyle = '#000'; ctx.font = '8px sans-serif';
  ctx.fillText(t('bendWord1') + ' (' + res.bendInfos.length + '):', bendsX, toolsTop + 8);
  if (res.bendInfos && res.bendInfos.length > 0) {
    ctx.font = 'bold 8px monospace';
    let bx = bendsX;
    const by = toolsTop + 22;
    // Рисуем справа налево
    for (let i = res.bendInfos.length - 1; i >= 0; i--) {
      const b = res.bendInfos[i];
      const interior = (Math.PI - b.bendAngle) * 180 / Math.PI;
      const txt = (i + 1) + ':' + interior.toFixed(0) + '\u00b0';
      const tw = ctx.measureText(txt).width;
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(bx - tw - 4, by - 1, tw + 4, 12);
      ctx.strokeStyle = '#ea580c55'; ctx.lineWidth = 0.5;
      ctx.strokeRect(bx - tw - 4, by - 1, tw + 4, 12);
      ctx.fillStyle = '#c2410c'; ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillText(txt, bx, by + 1);
      bx -= tw + 6;
    }
  }

  // === СТРАНИЦЫ «ПОСЛЕДОВАТЕЛЬНОСТЬ ГИБКИ» ===
  // Показывает ВЫПОЛНЕННЫЕ гибы (S.simBentMarkers) в порядке выполнения.
  // Для каждого шага: контур заготовки ПОСЛЕ этого гиба, угол гиба,
  // миниатюра упора, расстояние от упора до точки гиба (0,0).
  // Если гибов больше 5 — таблица разбивается на страницы по 5 шагов.
  const seqDataUrls = [];
  const seqCanvases = [];
  const bentMarkers = (S.simBentMarkers || []).slice(); // порядок выполнения
  if (bentMarkers.length > 0 && res.bendInfos.length > 0) {
    const MAX_STEPS_PER_PAGE = 5;
    const nSteps = bentMarkers.length;
    const nPages = Math.ceil(nSteps / MAX_STEPS_PER_PAGE);
    for (let pageNum = 0; pageNum < nPages; pageNum++) {
      const pageSteps = bentMarkers.slice(pageNum * MAX_STEPS_PER_PAGE, (pageNum + 1) * MAX_STEPS_PER_PAGE);
      const pageStartStep = pageNum * MAX_STEPS_PER_PAGE;
      const seqCv = document.createElement('canvas');
      seqCv.width = CW; seqCv.height = CH;
      const sctx = seqCv.getContext('2d');
      sctx.fillStyle = '#fff'; sctx.fillRect(0, 0, CW, CH);
      sctx.strokeStyle = '#000'; sctx.lineWidth = 2;
      sctx.strokeRect(border, border, CW - border * 2, CH - border * 2);

      // Заголовок
      sctx.fillStyle = '#333'; sctx.font = 'bold 14px sans-serif';
      sctx.textAlign = 'center'; sctx.textBaseline = 'top';
      sctx.fillText(S.lang === 'en' ? 'Bending Sequence' : 'Последовательность гибки', CW / 2, border + 8);
      sctx.font = '10px sans-serif'; sctx.fillStyle = '#666';
      sctx.fillText((S.metal.partNumber || '\u2014') + '  |  ' + dateStr, CW / 2, border + 26);
      if (nPages > 1) {
        sctx.font = '9px sans-serif'; sctx.fillStyle = '#999';
        sctx.textAlign = 'right';
        sctx.fillText((S.lang === 'en' ? 'Page ' : 'Лист ') + (pageNum + 1) + ' / ' + nPages, CW - border - 8, border + 8);
      }

      // Таблица: 1 шаг на строку
      const tblTop = border + 45;
      const tblBot = CH - border - 15;
      const tblH = tblBot - tblTop;
      const rowH = Math.min(tblH / pageSteps.length, 160);
      // Колонки: Шаг | Гиб/Угол | Упор/Расстояние | Контур
      const colStepW = 40;
      // v4.6: 130 (было 100) — влезает «↔ Разворот по горизонтали» (8px)
      const colAngleW = 130;
      const colStopW = 180;
      const colProfW = CW - border * 2 - 20 - colStepW - colAngleW - colStopW;

      const colStepX = border + 10;
      const colAngleX = colStepX + colStepW;
      const colStopX = colAngleX + colAngleW;
      const colProfX = colStopX + colStopW;

      // Заголовки колонок
      sctx.fillStyle = '#f0f0f0';
      sctx.fillRect(colStepX, tblTop, colStepW, 20);
      sctx.fillRect(colAngleX, tblTop, colAngleW, 20);
      sctx.fillRect(colStopX, tblTop, colStopW, 20);
      sctx.fillRect(colProfX, tblTop, colProfW, 20);
      sctx.strokeStyle = '#999'; sctx.lineWidth = 0.5;
      sctx.strokeRect(colStepX, tblTop, colStepW, 20);
      sctx.strokeRect(colAngleX, tblTop, colAngleW, 20);
      sctx.strokeRect(colStopX, tblTop, colStopW, 20);
      sctx.strokeRect(colProfX, tblTop, colProfW, 20);
      sctx.fillStyle = '#333'; sctx.font = 'bold 9px sans-serif';
      sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
      sctx.fillText(S.lang === 'en' ? 'Step' : 'Шаг', colStepX + colStepW / 2, tblTop + 10);
      sctx.fillText(S.lang === 'en' ? 'Bend / Angle' : 'Гиб / Угол', colAngleX + colAngleW / 2, tblTop + 10);
      sctx.fillText(S.lang === 'en' ? 'Stopper / Dist' : 'Упор / Расст.', colStopX + colStopW / 2, tblTop + 10);
      sctx.fillText(S.lang === 'en' ? 'Bent Profile' : 'Контур заготовки', colProfX + colProfW / 2, tblTop + 10);

      // Для каждого шага на странице
      pageSteps.forEach((bendIdx, pageStepIdx) => {
        const stepNum = pageStartStep + pageStepIdx; // абсолютный номер шага
        const cellY = tblTop + 20 + pageStepIdx * rowH;
        // Грани
        sctx.strokeStyle = '#ccc'; sctx.lineWidth = 0.5;
        sctx.strokeRect(colStepX, cellY, colStepW, rowH);
        sctx.strokeRect(colAngleX, cellY, colAngleW, rowH);
        sctx.strokeRect(colProfX, cellY, colProfW, rowH);
        sctx.strokeRect(colStopX, cellY, colStopW, rowH);

        // === Колонка «шаг»: оранжевый кружок с номером ===
        sctx.fillStyle = '#f97316'; sctx.beginPath();
        sctx.arc(colStepX + colStepW / 2, cellY + 20, 10, 0, Math.PI * 2); sctx.fill();
        sctx.strokeStyle = '#fff'; sctx.lineWidth = 1; sctx.stroke();
        sctx.fillStyle = '#fff'; sctx.font = 'bold 9px sans-serif';
        sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
        sctx.fillText(String(stepNum + 1), colStepX + colStepW / 2, cellY + 20);

        // === Колонка «гиб + угол» ===
        const bInfo = res.bendInfos[bendIdx];
        const interior = bInfo ? ((Math.PI - bInfo.bendAngle) * 180 / Math.PI).toFixed(0) : '?';
        sctx.fillStyle = '#c2410c'; sctx.font = 'bold 11px sans-serif';
        sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
        sctx.fillText(S.lang === 'en'
          ? 'B' + (bendIdx + 1)
          : 'Г' + (bendIdx + 1), colAngleX + colAngleW / 2, cellY + 20);
        sctx.fillStyle = '#333'; sctx.font = 'bold 13px sans-serif';
        sctx.fillText(interior + '\u00b0', colAngleX + colAngleW / 2, cellY + 42);
        // Ориентация лицевой стороны (из метаданных шага)
        const meta = (S.bendStepMeta || {})[bendIdx];
        if (meta && meta.faceOrient) {
          const faceUp = meta.faceOrient === 'up';
          sctx.fillStyle = faceUp ? '#2563eb' : '#9333ea';
          sctx.font = 'bold 10px sans-serif';
          sctx.fillText(faceUp ? '\u25B2' : '\u25BC', colAngleX + colAngleW / 2, cellY + 58);
          sctx.fillStyle = faceUp ? '#2563eb' : '#9333ea';
          sctx.font = 'bold 8px sans-serif';
          sctx.fillText(S.lang === 'en'
            ? (faceUp ? 'Face up' : 'Face down')
            : (faceUp ? 'Лицевой вверх' : 'Лицевой вниз'),
            colAngleX + colAngleW / 2, cellY + 69);
        }
        // v4.6: развороты заготовки на момент гибки (кнопки «↔X» / «↕Y»).
        // ↔X = отражение лево↔право → разворот по ГОРИЗОНТАЛИ,
        // ↕Y = отражение верх↔низ → разворот по ВЕРТИКАЛИ.
        if (meta) {
          const flipLabels = [];
          if (meta.flipX) flipLabels.push('\u2194 ' + (S.lang === 'en' ? 'Flip horizontally' : 'Разворот по горизонтали'));
          if (meta.flipY) flipLabels.push('\u2195 ' + (S.lang === 'en' ? 'Flip vertically' : 'Разворот по вертикали'));
          flipLabels.forEach((lbl, fi) => {
            sctx.font = '8px sans-serif';
            // Защита от переполнения узкой колонки — ужимаем шрифт
            if (sctx.measureText(lbl).width > colAngleW - 6) sctx.font = '7px sans-serif';
            sctx.fillStyle = '#0d9488';
            sctx.fillText(lbl, colAngleX + colAngleW / 2, cellY + 83 + fi * 12);
          });
        }

        // === Колонка «контур заготовки»: профиль ПОСЛЕ этого шага ===
        const stepBentSet = bentMarkers.slice(0, stepNum + 1);
        const stepMeta = (S.bendStepMeta || {})[bendIdx];
        const stepFlipX = stepMeta ? !!stepMeta.flipX : false;
        const stepFlipY = stepMeta ? !!stepMeta.flipY : false;
        // Временно: simBentMarkers = stepBentSet, selected = bendIdx,
        // simFlipX/Y из meta → считаем профиль → восстанавливаем.
        const savedBent = S.simBentMarkers, savedSel = S.selectedBendIndex, savedFlipX = S.simFlipX, savedFlipY = S.simFlipY;
        S.simBentMarkers = stepBentSet;
        S.selectedBendIndex = bendIdx; // позиционирует по этому гибу (в 0,0)
        S.simFlipX = stepFlipX; S.simFlipY = stepFlipY;
        const stepProf = computeAccumulatedProfile({ bendIdx: bendIdx, progress: 1, animating: false });
        S.simBentMarkers = savedBent; S.selectedBendIndex = savedSel; S.simFlipX = savedFlipX; S.simFlipY = savedFlipY;

        if (stepProf && stepProf.pts && stepProf.pts.length >= 2) {
          // Вписать профиль в колонку (по габаритам)
          let mnX = Infinity, mxX = -Infinity, mnY = Infinity, mxY = -Infinity;
          stepProf.pts.forEach(p => {
            if (p.x < mnX) mnX = p.x; if (p.x > mxX) mxX = p.x;
            if (p.y < mnY) mnY = p.y; if (p.y > mxY) mxY = p.y;
          });
          const rangeX = (mxX - mnX) || 1, rangeY = (mxY - mnY) || 1;
          const profPad = 6;
          const profCellW = colProfW - profPad * 2;
          const profCellH = rowH - profPad * 2;
          const sScale = Math.min(profCellW / rangeX, profCellH / rangeY);
          const sOfsX = colProfX + profPad + (profCellW - rangeX * sScale) / 2;
          const sOfsY = cellY + profPad + (profCellH - rangeY * sScale) / 2;
          function p2s(wx, wy) { return { x: sOfsX + (wx - mnX) * sScale, y: sOfsY + (mxY - wy) * sScale }; }
          // Контур (центральная линия металла) — зелёный
          sctx.strokeStyle = '#16a34a'; sctx.lineWidth = 2;
          sctx.beginPath();
          const sp0 = p2s(stepProf.pts[0].x, stepProf.pts[0].y);
          sctx.moveTo(sp0.x, sp0.y);
          for (let i = 1; i < stepProf.pts.length; i++) {
            const sp = p2s(stepProf.pts[i].x, stepProf.pts[i].y);
            sctx.lineTo(sp.x, sp.y);
          }
          sctx.stroke();
          // Лицевая сторона — синяя линия, перпендикулярный отступ ±T/2
          // от каждого сегмента. Знак: faceOrient 'up' → +1, 'down' → -1,
          // simFlipX инвертирует (X-зеркало меняет направление обхода).
          const T = S.metal.thickness || 1;
          const faceSign = ((stepMeta && stepMeta.faceOrient === 'down') ? -1 : 1) * (stepFlipX ? -1 : 1);
          sctx.strokeStyle = '#3b82f6'; sctx.lineWidth = 1.5;
          sctx.beginPath();
          let faceStarted = false;
          for (let i = 0; i < stepProf.pts.length - 1; i++) {
            const dx = stepProf.pts[i + 1].x - stepProf.pts[i].x;
            const dy = stepProf.pts[i + 1].y - stepProf.pts[i].y;
            const len = Math.hypot(dx, dy);
            if (len < 1e-6) continue;
            const nx = -dy / len * faceSign * (T / 2);
            const ny = dx / len * faceSign * (T / 2);
            const a = p2s(stepProf.pts[i].x + nx, stepProf.pts[i].y + ny);
            const b = p2s(stepProf.pts[i + 1].x + nx, stepProf.pts[i + 1].y + ny);
            if (!faceStarted) { sctx.moveTo(a.x, a.y); faceStarted = true; }
            else sctx.lineTo(a.x, a.y);
            sctx.lineTo(b.x, b.y);
          }
          sctx.stroke();
          // Точка гиба (0,0) — оранжевый маркер
          const org = p2s(0, 0);
          sctx.fillStyle = '#f97316'; sctx.beginPath();
          sctx.arc(org.x, org.y, 3, 0, Math.PI * 2); sctx.fill();
        }

        // === Колонка «упор + расстояние» ===
        // Расстояние из S.bendStepMeta[bendIdx].stopperDist — позиция
        // упора ДО гибки (записана в startBendAnimation).
        const meta2 = (S.bendStepMeta || {})[bendIdx];
        const stopperDist = meta2 ? meta2.stopperDist : null;
        if (stopperDist !== null && stopperDist !== undefined) {
          // Миниатюра упора: заштрихованный прямоугольник 20×8
          const stopScale = Math.min((colStopW - 40) / 60, rowH / 50);
          const stopCx = colStopX + colStopW / 2;
          const stopCy = cellY + 30;
          const swPx = 20 * stopScale, shPx = 8 * stopScale;
          const sLeft = stopCx - swPx / 2, sTop = stopCy - shPx / 2;
          sctx.fillStyle = '#6b728015';
          sctx.fillRect(sLeft, sTop, swPx, shPx);
          sctx.save();
          sctx.beginPath();
          sctx.rect(sLeft, sTop, swPx, shPx);
          sctx.clip();
          sctx.strokeStyle = '#6b728088'; sctx.lineWidth = 0.8;
          for (let s = -shPx; s <= swPx + shPx; s += 3) {
            sctx.beginPath();
            sctx.moveTo(sLeft + s, sTop + shPx);
            sctx.lineTo(sLeft + s + shPx, sTop);
            sctx.stroke();
          }
          sctx.restore();
          sctx.strokeStyle = '#6b7280cc'; sctx.lineWidth = 1.5;
          sctx.strokeRect(sLeft, sTop, swPx, shPx);
          // Расстояние от правого края упора до (0,0)
          sctx.fillStyle = '#333'; sctx.font = 'bold 11px sans-serif';
          sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
          sctx.fillText((S.lang === 'en' ? 'Dist: ' : 'Расст: ') + stopperDist.toFixed(1) + ' мм', stopCx, stopCy + shPx / 2 + 14);
          // Подпись «Упор»
          sctx.fillStyle = '#666'; sctx.font = '8px sans-serif';
          sctx.fillText(S.lang === 'en' ? 'Stopper' : 'Упор', stopCx, stopCy - shPx / 2 - 8);
        } else {
          sctx.fillStyle = '#999'; sctx.font = '9px sans-serif';
          sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
          sctx.fillText(S.lang === 'en' ? 'No touch' : 'Нет касания', colStopX + colStopW / 2, cellY + rowH / 2);
        }
      }); // end pageSteps.forEach

      seqDataUrls.push(seqCv.toDataURL('image/png'));
      seqCanvases.push(seqCv);
    } // end for pageNum
    window._drawingCanvasSeq = seqCanvases;
  } else {
    window._drawingCanvasSeq = null;
  }

  // Диалог с предпросмотром
  const dataUrl = cv.toDataURL('image/png');
  let dh = '';
  // Предупреждение о невозможных гибах
  if (badBends.length > 0) {
    const dieName = die ? (S.lang === 'en' ? die.nameEn : die.nameRu) : '\u2014';
    const punchName = punch ? (S.lang === 'en' ? punch.nameEn : punch.nameRu) : '\u2014';
    dh += '<div class="mb-3 rounded-lg border-2 border-red-500/50 bg-red-50 dark:bg-red-950/30 p-3">';
    dh += '<p class="text-xs font-semibold text-red-700 dark:text-red-400 flex items-center gap-1.5 mb-1"><i data-lucide="alert-triangle" class="h-3.5 w-3.5"></i>' + t('bendWarningsTitle') + ' — ' + dieName + ' / ' + punchName + '</p>';
    dh += '<div class="space-y-1">';
    badBends.forEach(b => {
      dh += '<div class="text-[10px] text-red-700 dark:text-red-400">';
      dh += '<b>' + t('bend') + ' #' + (b.vertexIndex) + ' (' + (b.bendAngle * 180 / Math.PI).toFixed(0) + '°):</b>';
      b.problems.forEach(pr => { dh += '<div class="pl-3">— ' + pr + '</div>'; });
      dh += '</div>';
    });
    dh += '</div></div>';
  }
  // Предупреждения (не блокируют, но показываем жёлтым)
  const warnBends = (res.bendInfos || []).filter(b => b.warnings && b.warnings.length > 0);
  if (warnBends.length > 0) {
    dh += '<div class="mb-3 rounded-lg border-2 border-amber-500/50 bg-amber-50 dark:bg-amber-950/30 p-3">';
    dh += '<p class="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-1"><i data-lucide="alert-triangle" class="h-3.5 w-3.5"></i>' + t('bendWarnings') + '</p>';
    dh += '<div class="space-y-1">';
    warnBends.forEach(b => {
      dh += '<div class="text-[10px] text-amber-700 dark:text-amber-400">';
      dh += '<b>' + t('bend') + ' #' + (b.vertexIndex) + ' (' + (b.bendAngle * 180 / Math.PI).toFixed(0) + '°):</b>';
      b.warnings.forEach(pr => { dh += '<div class="pl-3">— ' + pr + '</div>'; });
      dh += '</div>';
    });
    dh += '</div></div>';
  }
  dh += '<h3 class="text-sm font-semibold flex items-center gap-2 mb-3"><svg class="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' + t('drawingTitle') + '</h3>';
  dh += '<div style="max-height:85vh;overflow-y:auto;">';
  dh += '<img src="' + dataUrl + '" style="width:100%;border:1px solid #e5e5e5;border-radius:4px;margin-bottom:8px;"/>';
  if (seqDataUrls.length > 0) {
    seqDataUrls.forEach((seqUrl, i) => {
      dh += '<div class="text-[10px] text-gray-500 mb-1">' + (S.lang === 'en' ? 'Page ' : 'Лист ') + (i + 2) + ': ' + (S.lang === 'en' ? 'Bending Sequence' : 'Последовательность гибки') + (seqDataUrls.length > 1 ? ' (' + (i + 1) + '/' + seqDataUrls.length + ')' : '') + '</div>';
      dh += '<img src="' + seqUrl + '" style="width:100%;border:1px solid #e5e5e5;border-radius:4px;margin-bottom:8px;"/>';
    });
  }
  dh += '</div>';
  dh += '<div class="flex gap-2 mt-3">';
  dh += '<button onclick="downloadDrawing()" class="flex-1 text-xs h-9 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold flex items-center justify-center gap-1.5"><i data-lucide="download" class="h-3.5 w-3.5"></i>' + t('drawingDownload') + '</button>';
  dh += '<button onclick="printDrawing()" class="flex-1 text-xs h-9 px-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center gap-1.5"><i data-lucide="printer" class="h-3.5 w-3.5"></i>' + t('drawingPrint') + '</button>';
  dh += '</div>';
  showDialog(dh, 'dialog-box-wide');
  refreshIcons();
  window._drawingCanvas = cv;
}

function downloadDrawing() {
  const cv = window._drawingCanvas;
  if (!cv) return;
  const seqCvs = window._drawingCanvasSeq;
  const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  // Если есть страницы последовательности — объединяем все вертикально
  if (seqCvs && seqCvs.length > 0) {
    const gap = 20;
    let totalH = cv.height + seqCvs.reduce((s, c) => s + c.height + gap, gap);
    const combined = document.createElement('canvas');
    combined.width = cv.width;
    combined.height = totalH;
    const cctx = combined.getContext('2d');
    cctx.fillStyle = '#fff'; cctx.fillRect(0, 0, combined.width, combined.height);
    let y = 0;
    cctx.drawImage(cv, 0, y); y += cv.height + gap;
    seqCvs.forEach(c => { cctx.drawImage(c, 0, y); y += c.height + gap; });
    combined.toBlob(blob => {
      if (!blob) return;
      const u = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = u; a.download = 'drawing-' + ts + '.png';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(u);
    }, 'image/png');
  } else {
    cv.toBlob(blob => {
      if (!blob) return;
      const u = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = u; a.download = 'drawing-' + ts + '.png';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(u);
    }, 'image/png');
  }
}

function printDrawing() {
  const cv = window._drawingCanvas;
  if (!cv) return;
  const seqCvs = window._drawingCanvasSeq;
  const dataUrl = cv.toDataURL('image/png');
  const seqDataUrls = (seqCvs && seqCvs.length > 0) ? seqCvs.map(c => c.toDataURL('image/png')) : [];
  const win = window.open('', '_blank');
  if (!win) { toast(t('popupBlocked'), 'error'); return; }
  // Первая страница (профиль + развёртка)
  let imgHtml = '<img src="' + dataUrl + '" style="max-width:100%;max-height:100vh;" onload="setTimeout(()=>window.print(),300)"/>';
  // Каждая страница последовательности — на отдельном листе
  if (seqDataUrls.length > 0) {
    seqDataUrls.forEach(seqUrl => {
      imgHtml += '<div style="page-break-after:always;"></div><img src="' + seqUrl + '" style="max-width:100%;max-height:100vh;"/>';
    });
  }
  win.document.write('<!DOCTYPE html><html><head><title>' + t('drawingTitle') + '</title><style>@page{margin:0;size:A4 landscape}@media print{body{margin:0;padding:0}}</style></head><body style="margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#fff;">' + imgHtml + '</body></html>');
  win.document.close();
}

// ═══════════════════════════════════════════════════════════════
// APP — инициализация, горячие клавиши, авто-сохранение
//
// FIX v4.1: Ctrl+Shift+Z / Ctrl+Shift+Y были перепутаны местами
// (Shift+Z делал redoMetal вместо undoMetal). Теперь:
//   Ctrl+Z          — отмена (точки)
//   Ctrl+Y          — повтор (точки)
//   Ctrl+Shift+Z    — отмена (параметры металла)
//   Ctrl+Shift+Y    — повтор (параметры металла)
// ═══════════════════════════════════════════════════════════════

// ==================== ГОРЯЧИЕ КЛАВИШИ ====================
document.addEventListener('keydown', e => {
  // Диалог каймы: Enter — применить, Escape — отмена
  if (S.hemEditing && document.getElementById('dialog-overlay') && !document.getElementById('dialog-overlay').classList.contains('hidden')) {
    if (e.key === 'Enter') { e.preventDefault(); applyHemFromDialog(); return; }
    if (e.key === 'Escape') { e.preventDefault(); cancelHem(); return; }
    return; // Остальные хоткеи не обрабатываем пока открыт диалог каймы
  }

  const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA';
  const mod = e.ctrlKey || e.metaKey;

  // Undo / Redo работают и в полях ввода (как в браузере), и вне их
  if (mod && e.code === 'KeyZ') {
    e.preventDefault();
    if (e.shiftKey) { undoMetal(); renderAll(); }
    else doUndo();
    return;
  }
  if (mod && e.code === 'KeyY') {
    e.preventDefault();
    if (e.shiftKey) { redoMetal(); renderAll(); }
    else doRedo();
    return;
  }

  if (isInput) return;
  if (mod && e.code === 'KeyS') {
    e.preventDefault();
    saveProject();
    return;
  }

  // Enter — ручная развёртка (полезно при выключенной авто-развёртке)
  if (e.key === 'Enter' && !S.autoUnfold) {
    e.preventDefault();
    doUnfold();
    renderUnfoldInfo();
    drawUnfoldCanvas();
    draw3DPreview();
    renderHeader();
    return;
  }

  const key = e.key.toLowerCase();
  switch (key) {
    case 'd': S.toolMode = 'draw'; renderAll(); break;
    case 'v': S.toolMode = 'select'; S.drawFromIdx = null; renderAll(); break;
    case 'e': S.toolMode = 'erase'; S.drawFromIdx = null; renderAll(); break;
    case 'h': S.toolMode = 'hem'; S.drawFromIdx = null; renderAll(); break;
    case 'm': S.toolMode = 'measure'; S.drawFromIdx = null; measureStart = null; measureEnd = null; measureStep = 0; renderAll(); break;
    case 'f': S.viewport = { offsetX: canvasW / 2, offsetY: canvasH / 2, scale: 3 }; drawDrawCanvas(); break;
    // Стрелки: в режиме установки инструмента — двигают пуансон.
    // При заблокированных инструментах (симуляция) — перевороты заготовки.
    // ВАЖНО: используем `key` (уже toLowerCase), а не `e.key` (="ArrowLeft"),
    // иначе сравнение e.key === 'arrowleft' всегда false и шаг всегда +1.
    case 'arrowleft':
    case 'arrowright':
      if (S.showToolsOnCanvas) {
        e.preventDefault();
        if (S.toolLocked) {
          S.simFlipX = !S.simFlipX;
        } else {
          const step = key === 'arrowleft' ? -1 : 1;
          S.punchOffsetX = (S.punchOffsetX || 0) + step;
          localStorage.setItem('punchOffsetX', S.punchOffsetX);
        }
        if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
      }
      break;
    case 'arrowup':
    case 'arrowdown':
      if (S.showToolsOnCanvas) {
        e.preventDefault();
        if (S.toolLocked) {
          S.simFlipY = !S.simFlipY;
        } else {
          const step = key === 'arrowup' ? 1 : -1;
          S.punchOffsetY = (S.punchOffsetY || 0) + step;
          localStorage.setItem('punchOffsetY', S.punchOffsetY);
        }
        if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
      }
      break;
    case 'escape':
      // Сброс предпросмотра гиба
      if (S.previewBendIdx !== null) {
        e.preventDefault();
        S.previewBendIdx = null;
        drawDrawCanvas();
        return;
      }
      // Сброс активной точки рисования
      if (S.toolMode === 'draw' && S.drawFromIdx !== null) {
        e.preventDefault();
        S.drawFromIdx = null;
        drawDrawCanvas();
      } else if (S.toolMode !== 'select') {
        // Esc переключает на инструмент «Выбор»
        e.preventDefault();
        S.toolMode = 'select';
        S.drawFromIdx = null;
        renderAll();
      }
      break;
  }
});

// ==================== RESIZE ====================
const resizeObs = new ResizeObserver(() => {
  resizeDrawCanvas();
  resizeUnfoldCanvas();
  resizeView3d();
  drawDrawCanvas();
  drawUnfoldCanvas();
  draw3DPreview();
});

// ==================== INIT ====================
function init() {
  applyTheme();

  // FIX v4.1: сначала узнаём РЕАЛЬНЫЕ размеры холстов, потом ставим
  // viewport в центр (раньше использовались значения по умолчанию
  // 400×300 — центр вида был смещён).
  resizeDrawCanvas();
  resizeUnfoldCanvas();
  resizeView3d();
  S.viewport = { offsetX: canvasW / 2, offsetY: canvasH / 2, scale: 3 };

  // Force hide dialog on load (defensive)
  const overlay = document.getElementById('dialog-overlay');
  if (overlay) overlay.style.display = 'none';

  // Start resize observer after canvases exist
  const canvasCont = document.getElementById('canvas-container');
  const unfoldCont = document.getElementById('unfold-container');
  if (canvasCont) resizeObs.observe(canvasCont);
  if (unfoldCont) resizeObs.observe(unfoldCont);

  // Try load saved project
  try {
    const raw = localStorage.getItem('sheet-metal-project');
    if (raw) {
      const d = JSON.parse(raw);
      if (d.points && d.metal) {
        S.points = d.points;
        Object.assign(S.metal, d.metal);
        // Ensure new fields exist (compatibility with old saves)
        if (S.metal.dieIndex === undefined) S.metal.dieIndex = 0;
        if (S.metal.punchIndex === undefined) S.metal.punchIndex = 0;
        if (S.metal.metalTypeIndex === undefined || !METAL_TYPES[S.metal.metalTypeIndex]) S.metal.metalTypeIndex = 0;
        if (S.checkDieHeight === undefined) S.checkDieHeight = true;
        if (d.hems) S.hems = d.hems;
        else S.hems = [];
        maybeAutoUnfold();
      }
    }
  } catch (err) {
    console.error('Auto-load error:', err);
  }

  // Загружаем позиции инструментов на холсте
  if (typeof loadToolPositions === 'function') loadToolPositions();

  renderAll();

  // Auto-save debounce
  setInterval(() => {
    try {
      if (S.points.length > 0) {
        localStorage.setItem('sheet-metal-project', JSON.stringify({ points: S.points, metal: S.metal, hems: S.hems }));
      } else {
        localStorage.removeItem('sheet-metal-project');
      }
      if (typeof saveToolPositions === 'function') saveToolPositions();
    } catch (err) {
      console.error('Auto-save error:', err);
    }
  }, 2000);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


})();
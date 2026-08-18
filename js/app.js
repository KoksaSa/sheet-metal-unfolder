// ==================== KEYBOARD ====================
document.addEventListener('keydown', e => {
  // Hem dialog: Enter to apply, Escape to cancel
  if (S.hemEditing && !document.getElementById('dialog-overlay').classList.contains('hidden')) {
    if (e.key === 'Enter') { e.preventDefault(); applyHemFromDialog(); return; }
    if (e.key === 'Escape') { e.preventDefault(); cancelHem(); return; }
    return; // Don't process other shortcuts while hem dialog is open
  }

  const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA';
  const mod = e.ctrlKey || e.metaKey;

  // Undo / Redo работают и в полях ввода (как в браузере), и вне их
  if (mod && e.code === 'KeyZ') {
    e.preventDefault();
    if (e.shiftKey) { redoMetal(); renderAll(); }
    else doUndo();
    return;
  }
  if (mod && e.code === 'KeyY') {
    e.preventDefault();
    if (e.shiftKey) { undoMetal(); renderAll(); }
    else doRedo();
    return;
  }

  if (isInput) return;
  if (mod && e.code === 'KeyS') {
    e.preventDefault();
    saveProject();
    return;
  }

  const key = e.key.toLowerCase();
  switch (key) {
    case 'd': S.toolMode = 'draw'; renderAll(); break;
    case 'v': S.toolMode = 'select'; renderAll(); break;
    case 'e': S.toolMode = 'erase'; renderAll(); break;
    case 'h': S.toolMode = 'hem'; renderAll(); break;
    case 'm': S.toolMode = 'measure'; measureStart = null; measureEnd = null; measureStep = 0; renderAll(); break;
    case 'f': S.viewport = { offsetX: canvasW / 2, offsetY: canvasH / 2, scale: 3 }; drawDrawCanvas(); break;
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
  S.viewport = { offsetX: canvasW / 2, offsetY: canvasH / 2, scale: 3 };

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
        if (d.hems) S.hems = d.hems;
        else S.hems = [];
      }
    }
  } catch (err) {
    console.error('Auto-load error:', err);
  }

  renderAll();

  // Auto-save debounce
  setInterval(() => {
    try {
      if (S.points.length > 0) {
        localStorage.setItem('sheet-metal-project', JSON.stringify({ points: S.points, metal: S.metal, hems: S.hems }));
      } else {
        localStorage.removeItem('sheet-metal-project');
      }
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
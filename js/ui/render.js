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
  // v4.8: подсказка кнопки «Загрузить деталь» (STEP-инструмент)
  const stepToolBtn = document.getElementById('btn-step-tool');
  if (stepToolBtn) stepToolBtn.title = t('loadStepPartHint');
  // v4.9: подсказка кнопки «Импорт профиля DXF»
  const dxfProfileBtn = document.getElementById('btn-dxf-profile');
  if (dxfProfileBtn) dxfProfileBtn.title = t('importDxfProfile');
  // v4.9: кнопок SVG/PNG/PDF больше нет — остались чертёж и DXF
  ['btn-drawing', 'btn-dxf'].forEach(id => {
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

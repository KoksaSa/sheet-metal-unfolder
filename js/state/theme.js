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

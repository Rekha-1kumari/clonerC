// Week 2: Responsive Interaction & Theme Controller
(function() {
  const THEME_KEY = 'rekha_portfolio_theme';
  const rootElement = document.documentElement;
  const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn');
  const hamburger = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeDrawerBtn = document.querySelector('.drawer-close-btn');

  // Initialize theme from localStorage or preferred scheme
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  function setTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    themeToggleButtons.forEach(btn => {
      btn.innerHTML = theme === 'dark' 
        ? '<span aria-hidden="true">&#9728;</span>' 
        : '<span aria-hidden="true">&#9790;</span>';
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`);
    });
  }

  themeToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = rootElement.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  // Mobile Drawer Toggle
  if (hamburger && drawer && overlay) {
    hamburger.addEventListener('click', () => {
      drawer.classList.add('open');
      overlay.classList.add('active');
    });

    const closeDrawer = () => {
      drawer.classList.remove('open');
      overlay.classList.remove('active');
    };

    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
  }

  initTheme();
})();

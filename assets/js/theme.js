(() => {
  const KEY = "osf_portfolio_theme";
  const root = document.documentElement;

  function getTheme() {
    const stored = localStorage.getItem(KEY);
    if (stored) return stored;
    // match system preference by default
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(theme) {
    localStorage.setItem(KEY, theme);
    root.dataset.theme = theme;
    // theme-color meta
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b0f17" : "#fbfbfd");
  }

  window.OSF_THEME = { getTheme, setTheme };

  document.addEventListener("DOMContentLoaded", () => {
    setTheme(getTheme());
    const btn = document.getElementById("themeToggle");
    if (btn) btn.addEventListener("click", () => setTheme(getTheme() === "dark" ? "light" : "dark"));
  });
})();
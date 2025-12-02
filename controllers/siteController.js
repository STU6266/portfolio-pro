// controllers/siteController.js

// Hilfsfunktion, damit wir nicht so viel Code doppeln
function renderPage(res, viewName, title, activePage) {
  res.render(viewName, {
    title,
    activePage,
  });
}

module.exports = {
  buildResume: (req, res) =>
    renderPage(res, "resume", "Resume – Steven Kemendics", "resume"),

  buildProjects: (req, res) =>
    renderPage(res, "projects", "Projects – Steven Kemendics", "projects"),

  buildFilament: (req, res) =>
    renderPage(res, "filament", "Filament Finder – Steven Kemendics", "projects"),

  buildFilamentAdd: (req, res) =>
    renderPage(res, "filament-add", "Add Filament – Steven Kemendics", "projects"),

  // Hangman page: simple game implemented fully client-side
  buildHangman: (req, res) =>
    renderPage(res,"hangman", "Hangman Game – Steven Kemendics", "projects"),

  buildAbout: (req, res) =>
    renderPage(res, "about", "About Me – Steven Kemendics", "about"),

  buildMcdonalds: (req, res) =>
    renderPage(
      res,
      "mcdonalds",
      "McDonald's Experience – Steven Kemendics",
      "mcdonalds"
    ),

  buildInterspar: (req, res) =>
    renderPage(
      res,
      "interspar",
      "Interspar Experience – Steven Kemendics",
      "interspar"
    ),

  buildReiter: (req, res) =>
    renderPage(
      res,
      "reiter",
      "Reiter Experience – Steven Kemendics",
      "reiter"
    ),
};

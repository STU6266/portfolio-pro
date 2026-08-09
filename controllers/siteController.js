// controllers/siteController.js

/**
 * Site controller.
 *
 * Contains route handlers for all top-level pages of the portfolio.
 * Uses a small helper to avoid repeating the render boilerplate.
 */

/**
 * Renders an EJS view with a standard set of locals.
 *
 * @param {import('express').Response} res - Express response object.
 * @param {string} viewName - Name of the EJS view to render.
 * @param {string} title - Document title for the page.
 * @param {string} activePage - Identifier used to highlight the active nav item.
 */
function renderPage(res, viewName, title, activePage) {
  res.render(viewName, {
    title,
    activePage,
  });
}

module.exports = {
  /**
   * GET /resume
   * Main resume / profile page.
   */
  buildResume: (req, res) =>
    renderPage(res, "resume", "Resume – Steven Kemendics", "resume"),

  /**
   * GET /projects
   * Project overview page.
   */
  buildProjects: (req, res) =>
    renderPage(res, "projects", "Projects – Steven Kemendics", "projects"),

  /**
   * GET /projects/printtune
   * Detail page for the PrintTune local-first 3D printing project.
   */
  buildPrintTuneProject: (req, res) =>
    renderPage(
      res,
      "project-printtune",
      "PrintTune – Steven Kemendics",
      "projects"
    ),

  /**
   * GET /projects/ffki-alpha
   * Detail page for the private alpha fantasy football project.
   */
  buildFfkiAlphaProject: (req, res) =>
    renderPage(
      res,
      "project-ffki-alpha",
      "FFKI Alpha – Steven Kemendics",
      "projects"
    ),

  /**
   * GET /projects/board-game-intelligence-api
   * Detail page for the backend API portfolio project.
   */
  buildBoardGameApiProject: (req, res) =>
    renderPage(
      res,
      "project-board-game-api",
      "Board Game Intelligence API – Steven Kemendics",
      "projects"
    ),

  /**
   * GET /projects/unrealdice
   * Detail page for the unrealDice PWA project.
   */
  buildUnrealDiceProject: (req, res) =>
    renderPage(
      res,
      "project-unrealdice",
      "unrealDice – Steven Kemendics",
      "projects"
    ),

  /**
   * GET /projects/speed-dungeon
   * Detail page for the Speed Dungeon browser game.
   */
  buildSpeedDungeonProject: (req, res) =>
    renderPage(
      res,
      "project-speed-dungeon",
      "Speed Dungeon – Steven Kemendics",
      "projects"
    ),

  /**
   * GET /filament
   * Filament Finder main UI. Grouped under "Projects" in the navigation.
   */
  buildFilament: (req, res) =>
    renderPage(
      res,
      "filament",
      "Filament Finder – Steven Kemendics",
      "projects"
    ),

  /**
   * GET /filament/add
   * Demo page for adding a filament entry. Also grouped under "Projects".
   */
  buildFilamentAdd: (req, res) =>
    renderPage(
      res,
      "filament-add",
      "Add Filament – Steven Kemendics",
      "projects"
    ),

  /**
   * GET /hangman
   * Browser version of the original C# Hangman game. Listed as a project.
   */
  buildHangman: (req, res) =>
    renderPage(res, "hangman", "Hangman Game – Steven Kemendics", "projects"),

  /**
   * GET /about
   * "More about me" page with a longer personal narrative.
   */
  buildAbout: (req, res) =>
    renderPage(res, "about", "About Me – Steven Kemendics", "about"),

  /**
   * GET /mcdonalds
   * Detailed experience page for the McDonald's role.
   */
  buildMcdonalds: (req, res) =>
    renderPage(
      res,
      "mcdonalds",
      "McDonald's Experience – Steven Kemendics",
      "mcdonalds"
    ),

  /**
   * GET /interspar
   * Detailed experience page for the Interspar role.
   */
  buildInterspar: (req, res) =>
    renderPage(
      res,
      "interspar",
      "Interspar Experience – Steven Kemendics",
      "interspar"
    ),

  /**
   * GET /reiter
   * Detailed experience page for the Heinrich Reiter role.
   */
  buildReiter: (req, res) =>
    renderPage(
      res,
      "reiter",
      "Reiter Experience – Steven Kemendics",
      "reiter"
    ),

  buildImpressum: (req, res) =>
    renderPage(
      res, 
      "impressum", 
      "Impressum – Steven Kemendics", 
      null
    ),
};

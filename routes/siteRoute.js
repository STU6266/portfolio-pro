// routes/siteRoute.js

/**
 * Main site routes.
 *
 * Each route delegates to a controller function in siteController.js
 * and is wrapped with handleErrors to ensure that thrown errors or
 * rejected promises are passed into the Express error middleware.
 */

const express = require("express");
const router = express.Router();

const siteController = require("../controllers/siteController");
const { handleErrors } = require("../utilities/handleErrors");

// ---------------------------------------------------------------------------
// Home & Resume
// ---------------------------------------------------------------------------

/**
 * GET /
 * Default entry point: redirect to the resume page.
 */
router.get("/", handleErrors(siteController.buildResume));

/**
 * GET /resume
 * Main resume / profile page.
 */
router.get("/resume", handleErrors(siteController.buildResume));

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

/**
 * GET /projects
 * Project overview page with links to individual demos.
 */
router.get("/projects", handleErrors(siteController.buildProjects));

// ---------------------------------------------------------------------------
// Filament Finder
// ---------------------------------------------------------------------------

/**
 * GET /filament
 * Filament Finder main UI (filters + result list).
 */
router.get("/filament", handleErrors(siteController.buildFilament));

/**
 * GET /filament/add
 * Demo page for adding a filament and seeing a live preview.
 */
router.get("/filament/add", handleErrors(siteController.buildFilamentAdd));

// ---------------------------------------------------------------------------
// Hangman game
// ---------------------------------------------------------------------------

/**
 * GET /hangman
 * Browser version of the original C# console hangman game.
 */
router.get("/hangman", handleErrors(siteController.buildHangman));

// ---------------------------------------------------------------------------
// About & detailed experience pages
// ---------------------------------------------------------------------------

/**
 * GET /about
 * Long-form "More about me" page.
 */
router.get("/about", handleErrors(siteController.buildAbout));

/**
 * GET /mcdonalds
 * Detailed experience page for the McDonald's role.
 */
router.get("/mcdonalds", handleErrors(siteController.buildMcdonalds));

/**
 * GET /interspar
 * Detailed experience page for the Interspar role.
 */
router.get("/interspar", handleErrors(siteController.buildInterspar));

/**
 * GET /reiter
 * Detailed experience page for the Heinrich Reiter role.
 */
router.get("/reiter", handleErrors(siteController.buildReiter));

// Impressum
router.get("/impressum", handleErrors(siteController.buildImpressum));

module.exports = router;

// routes/siteRoute.js
const express = require("express");
const router = express.Router();

const siteController = require("../controllers/siteController");
const { handleErrors } = require("../utilities/handleErrors");

// Home & Resume
router.get(
  "/",
  handleErrors(siteController.buildResume)
);

router.get(
  "/resume",
  handleErrors(siteController.buildResume)
);

// Projects
router.get(
  "/projects",
  handleErrors(siteController.buildProjects)
);

// Filament Finder
router.get(
  "/filament",
  handleErrors(siteController.buildFilament)
);

// Filament Add
router.get(
  "/filament/add",
  handleErrors(siteController.buildFilamentAdd)
);

// Hangman game (web version of the C# console game)
router.get(
  "/hangman",
  handleErrors(siteController.buildHangman)
);

// About
router.get(
  "/about",
  handleErrors(siteController.buildAbout)
);

// McDonald's
router.get(
  "/mcdonalds",
  handleErrors(siteController.buildMcdonalds)
);

// Interspar
router.get(
  "/interspar",
  handleErrors(siteController.buildInterspar)
);

// Reiter
router.get(
  "/reiter",
  handleErrors(siteController.buildReiter)
);

module.exports = router;

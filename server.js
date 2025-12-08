// server.js

/**
 * Entry point for the portfolio application.
 *
 * Responsibilities:
 * - Configure Express (view engine, body parsing, static assets).
 * - Mount the main site routes (resume, projects, demos).
 * - Expose a small JSON API for adding filaments (demo data writing).
 * - Register 404 and generic error handlers.
 *
 * The contact flow is intentionally implemented via a client-side
 * mailto: solution (see public/js/contact-modal.js), so there is no
 * server-side email sending in this file.
 */

require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Path to the filament JSON data file used by the Filament Finder demo.
const FILAMENT_DATA_PATH = path.join(
  __dirname,
  "public",
  "data",
  "filaments.json"
);

// ---------------------------------------------------------------------------
// View engine configuration (EJS)
// ---------------------------------------------------------------------------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------------------------------------------------------------------------
// Middleware: body parsing & static assets
// ---------------------------------------------------------------------------

// Parse JSON request bodies (used by the /api/filaments endpoint).
app.use(express.json());

// Parse URL-encoded form bodies (standard HTML forms).
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, client-side JS, images) from /public.
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

const siteRoute = require("./routes/siteRoute");
const { notFoundHandler, errorHandler } = require("./utilities/handleErrors");

// Main pages and demos (resume, projects, filament, hangman, about, ...).
app.use("/", siteRoute);

// ---------------------------------------------------------------------------
// API: POST /api/filaments
// ---------------------------------------------------------------------------

/**
 * Adds a new filament to the filaments.json file.
 *
 * This endpoint is used by the "Add filament" demo page to simulate
 * a very small JSON-based persistence layer without a database.
 *
 * Expected request body (JSON):
 * - brand (string, required)
 * - product_name (string, required)
 * - material (string, required)
 * - color (string or null)
 * - nozzle_temp_min / nozzle_temp_max (number, required)
 * - bed_temp_min / bed_temp_max (number, required)
 * - special_type (string or null)
 * - notes (string)
 */
app.post("/api/filaments", (req, res) => {
  const body = req.body || {};

  // Minimal validation for required fields.
  if (!body.brand || !body.product_name || !body.material) {
    return res.status(400).json({
      error: "brand, product_name and material are required",
    });
  }

  // Temperature fields must be valid numbers.
  const tempFields = [
    "nozzle_temp_min",
    "nozzle_temp_max",
    "bed_temp_min",
    "bed_temp_max",
  ];

  for (const field of tempFields) {
    const value = Number(body[field]);
    if (Number.isNaN(value)) {
      return res.status(400).json({
        error: `Field ${field} must be a number`,
      });
    }
  }

  try {
    // Read existing data from filaments.json.
    const raw = fs.readFileSync(FILAMENT_DATA_PATH, "utf8");
    const data = JSON.parse(raw);

    const filaments = data.filaments || [];

    // Determine a new numeric id (max existing id + 1).
    const maxId = filaments.reduce((max, f) => Math.max(max, f.id || 0), 0);
    const newId = maxId + 1;

    // Build the new filament record.
    const newFilament = {
      id: newId,
      brand: body.brand,
      product_name: body.product_name,
      material: body.material,
      color: body.color || null,
      nozzle_temp_min: Number(body.nozzle_temp_min),
      nozzle_temp_max: Number(body.nozzle_temp_max),
      bed_temp_min: Number(body.bed_temp_min),
      bed_temp_max: Number(body.bed_temp_max),
      special_type: body.special_type || null,
      notes: body.notes || "",
    };

    // Append and write back to the JSON file.
    filaments.push(newFilament);
    data.filaments = filaments;

    fs.writeFileSync(FILAMENT_DATA_PATH, JSON.stringify(data, null, 2), "utf8");

    return res.status(201).json({ success: true, filament: newFilament });
  } catch (err) {
    console.error("Error writing filaments.json", err);
    return res
      .status(500)
      .json({ error: "Could not save filament. Please try again later." });
  }
});

// ---------------------------------------------------------------------------
// 404 and error handlers (must be registered last)
// ---------------------------------------------------------------------------

app.use(notFoundHandler);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

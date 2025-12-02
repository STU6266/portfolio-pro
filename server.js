// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs"); // <- neu: für filaments.json lesen/schreiben

const app = express();
const PORT = process.env.PORT || 3000;

// Pfad zur Filament-JSON
const FILAMENT_DATA_PATH = path.join(
  __dirname,
  "public",
  "data",
  "filaments.json"
);

// View Engine: EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body-Parser für JSON (für /api/filaments)
app.use(express.json());

// Statische Dateien (CSS, JS, Bilder)
app.use(express.static(path.join(__dirname, "public")));

// Routes & Utilities
const siteRoute = require("./routes/siteRoute");
const { notFoundHandler, errorHandler } = require("./utilities/handleErrors");

// Haupt-Routen
app.use("/", siteRoute);

// API: neues Filament in filaments.json speichern
app.post("/api/filaments", (req, res) => {
  const body = req.body || {};

  // Minimale Pflichtfelder
  if (!body.brand || !body.product_name || !body.material) {
    return res.status(400).json({
      error: "brand, product_name and material are required"
    });
  }

  // Temperaturfelder prüfen
  const tempFields = [
    "nozzle_temp_min",
    "nozzle_temp_max",
    "bed_temp_min",
    "bed_temp_max"
  ];

  for (const field of tempFields) {
    const value = Number(body[field]);
    if (Number.isNaN(value)) {
      return res.status(400).json({
        error: `Field ${field} must be a number`
      });
    }
  }

  try {
    // Bestehende Daten laden
    const raw = fs.readFileSync(FILAMENT_DATA_PATH, "utf8");
    const data = JSON.parse(raw);

    const filaments = data.filaments || [];
    const maxId = filaments.reduce(
      (max, f) => Math.max(max, f.id || 0),
      0
    );
    const newId = maxId + 1;

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
      notes: body.notes || ""
    };

    filaments.push(newFilament);
    data.filaments = filaments;

    fs.writeFileSync(
      FILAMENT_DATA_PATH,
      JSON.stringify(data, null, 2),
      "utf8"
    );

    return res.status(201).json({ success: true, filament: newFilament });
  } catch (err) {
    console.error("Error writing filaments.json", err);
    return res
      .status(500)
      .json({ error: "Could not save filament. Please try again." });
  }
});

// 404 & Fehler-Handler (immer am Ende)
app.use(notFoundHandler);
app.use(errorHandler);

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

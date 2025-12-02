// public/js/filament.js
// ----------------------------------------------------------
// This script powers the main "Filament Finder" page.
//
// It does three main things:
// 1) Load the JSON file (materials + filaments) from /data/filaments.json
// 2) Fill the filter controls (material, brand, color)
// 3) Filter the list in real time and render nice cards
//
// It also shows extra info about the selected material on the right.
// ----------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Grab the form that wraps all filter fields.
  // If the form is not there, we simply don't run the rest of this script.
  const form = document.querySelector("#filament-filter-form");
  if (!form) return; // Safety guard: page without filament block

  // References to all filter inputs
  const materialSelect = document.querySelector("#filter-material");
  const brandSelect = document.querySelector("#filter-brand");
  const colorSelect = document.querySelector("#filter-color");
  const nozzleInput = document.querySelector("#filter-nozzle-temp");
  const bedInput = document.querySelector("#filter-bed-temp");
  const resetButton = document.querySelector("#filament-reset");

  // Where we show results + the "empty" message text
  const resultsContainer = document.querySelector("#filament-results-list");
  const emptyMessage = document.querySelector("#filament-results-empty");

  // Box on the right side where we display info about the selected material
  const materialInfoBox = document.querySelector("#filament-material-info");

  // These arrays will be filled once the JSON data has loaded
  let materials = [];
  let filaments = [];

  // --------------------------------------------------------
  // Load data from the static JSON file
  // --------------------------------------------------------
  fetch("/data/filaments.json")
    .then((res) => {
      // Basic error handling: if the response is not "OK", we stop here.
      if (!res.ok) {
        throw new Error("Could not load filaments.json");
      }
      return res.json();
    })
    .then((data) => {
      // Store materials and filaments in our local variables
      materials = data.materials || [];
      filaments = data.filaments || [];

      // Fill the dropdowns based on the data
      populateMaterialOptions(materials);
      populateBrandOptions(filaments);

      // Show the default material info (empty text) and all filaments
      updateMaterialInfo(materialSelect.value);
      renderResults(filaments);
    })
    .catch((err) => {
      // If something goes wrong (file missing, JSON broken, etc.)
      console.error(err);
      emptyMessage.textContent =
        "Could not load filament data. Please try again later.";
      emptyMessage.style.display = "block";
    });

  // --------------------------------------------------------
  // Fill the material dropdown from the "materials" array
  // --------------------------------------------------------
  function populateMaterialOptions(materials) {
    // Clear whatever was in the select before
    materialSelect.innerHTML = "";

    // Add an "Any material" option so the user can filter by nothing
    const anyOpt = document.createElement("option");
    anyOpt.value = "";
    anyOpt.textContent = "Any material";
    materialSelect.appendChild(anyOpt);

    // For each material object in the JSON, add a <option>
    materials.forEach((mat) => {
      const opt = document.createElement("option");
      // We use the material name as both the value and the visible text
      opt.value = mat.name;
      opt.textContent = mat.name;
      materialSelect.appendChild(opt);
    });
  }

  // --------------------------------------------------------
  // Fill the brand dropdown from the "filaments" array
  // --------------------------------------------------------
  function populateBrandOptions(filaments) {
    // Start fresh every time
    brandSelect.innerHTML = "";

    // First option is "Any brand"
    const anyOpt = document.createElement("option");
    anyOpt.value = "";
    anyOpt.textContent = "Any brand";
    brandSelect.appendChild(anyOpt);

    // Collect all brand names, remove duplicates using a Set, and sort them
    const uniqueBrands = Array.from(new Set(filaments.map((f) => f.brand))).sort();

    uniqueBrands.forEach((brand) => {
      const opt = document.createElement("option");
      opt.value = brand;
      opt.textContent = brand;
      brandSelect.appendChild(opt);
    });
  }

  // --------------------------------------------------------
  // Update the material info box on the right when selection changes
  // --------------------------------------------------------
  function updateMaterialInfo(selectedName) {
    // If, for some reason, the box is missing, just stop here
    if (!materialInfoBox) return;

    // No material selected: show a simple helper text
    if (!selectedName) {
      materialInfoBox.innerHTML = `
        <h3>Material info</h3>
        <p class="filament-material-empty">
          Select a material on the left to see typical nozzle &amp; bed temps.
        </p>
      `;
      return;
    }

    // Try to find the material object that matches the selected name
    const mat = materials.find((m) => m.name === selectedName);

    // If we somehow don't find a match, show a fallback message
    if (!mat) {
      materialInfoBox.innerHTML = `
        <h3>Material info</h3>
        <p class="filament-material-empty">
          No extra data found for this material.
        </p>
      `;
      return;
    }

    // Build two short helper texts based on booleans from the JSON
    const enclosureText = mat.needs_enclosure
      ? "Enclosure or draft protection recommended."
      : "Open printer is usually fine.";

    const flexibleText = mat.is_flexible ? "Flexible material." : "Rigid material.";

    // Replace the content of the info box with a small summary
    materialInfoBox.innerHTML = `
      <h3>${mat.name}</h3>
      <p class="filament-material-description">${mat.description}</p>
      <dl class="filament-material-meta">
        <div>
          <dt>Nozzle</dt>
          <dd>${mat.nozzle_temp_min}–${mat.nozzle_temp_max} °C</dd>
        </div>
        <div>
          <dt>Bed</dt>
          <dd>${mat.bed_temp_min}–${mat.bed_temp_max} °C</dd>
        </div>
        <div>
          <dt>Notes</dt>
          <dd>${enclosureText} ${flexibleText}</dd>
        </div>
      </dl>
      ${
        mat.notes
          ? `<p class="filament-material-notes">${mat.notes}</p>`
          : ""
      }
    `;
  }

  // --------------------------------------------------------
  // Apply all active filters and update the result list
  // --------------------------------------------------------
  function applyFilters() {
    const materialValue = materialSelect.value;
    const brandValue = brandSelect.value;
    const colorValue = colorSelect.value;

    // The nozzle and bed filters are a single numeric value.
    // If the user enters a temperature, we check if it lies inside each filament's range.
    const nozzleValue = parseInt(nozzleInput.value, 10);
    const bedValue = parseInt(bedInput.value, 10);

    // Whenever we filter, we also refresh the material info box
    updateMaterialInfo(materialValue);

    // Run through all filaments and keep only the ones that fit
    const filtered = filaments.filter((f) => {
      const matchesMaterial = !materialValue || f.material === materialValue;
      const matchesBrand = !brandValue || f.brand === brandValue;
      const matchesColor = !colorValue || f.color === colorValue;

      // If the nozzle field is empty, we ignore it.
      // If it's filled, the value must be in [nozzle_temp_min, nozzle_temp_max].
      const matchesNozzle =
        Number.isNaN(nozzleValue) ||
        (f.nozzle_temp_min <= nozzleValue && nozzleValue <= f.nozzle_temp_max);

      // Same idea for the bed temperature
      const matchesBed =
        Number.isNaN(bedValue) ||
        (f.bed_temp_min <= bedValue && bedValue <= f.bed_temp_max);

      // Only filaments that pass all conditions are kept
      return (
        matchesMaterial &&
        matchesBrand &&
        matchesColor &&
        matchesNozzle &&
        matchesBed
      );
    });

    // After filtering, update the UI
    renderResults(filtered);
  }

  // --------------------------------------------------------
  // Render the list of filament cards into the results container
  // --------------------------------------------------------
  function renderResults(list) {
    // Remove whatever was in the list before
    resultsContainer.innerHTML = "";

    // If there are no results, show the "empty" text and stop
    if (!list || list.length === 0) {
      emptyMessage.textContent = "No filaments match your filters yet.";
      emptyMessage.style.display = "block";
      return;
    }

    // We have results, so hide the empty message
    emptyMessage.style.display = "none";

    // Create one little card per filament
    list.forEach((f) => {
      const card = document.createElement("article");
      card.className = "filament-card";

      // We keep the inner HTML quite compact so it matches your CSS layout
      card.innerHTML = `
        <header class="filament-card-header">
          <h3>${f.brand} – ${f.product_name}</h3>
          <p class="filament-chip">${f.material}${
        f.special_type ? " · " + f.special_type : ""
      }</p>
        </header>
        <dl class="filament-meta">
          <div>
            <dt>Nozzle</dt>
            <dd>${f.nozzle_temp_min}–${f.nozzle_temp_max} °C</dd>
          </div>
          <div>
            <dt>Bed</dt>
            <dd>${f.bed_temp_min}–${f.bed_temp_max} °C</dd>
          </div>
          <div>
            <dt>Color</dt>
            <dd>${f.color || "various"}</dd>
          </div>
        </dl>
        ${
          f.notes
            ? `<p class="filament-notes">${f.notes}</p>`
            : ""
        }
      `;

      resultsContainer.appendChild(card);
    });
  }

  // --------------------------------------------------------
  // Event wiring
  // --------------------------------------------------------

  // Prevent the form from doing a full page reload and use our JS logic instead
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilters();
  });

  // When the select fields change, we re-filter the list
  materialSelect.addEventListener("change", applyFilters);
  brandSelect.addEventListener("change", applyFilters);
  colorSelect.addEventListener("change", applyFilters);

  // When the user types a nozzle or bed temp, we also re-filter on the fly
  nozzleInput.addEventListener("input", applyFilters);
  bedInput.addEventListener("input", applyFilters);

  // Reset button: clear all filters and show everything again
  resetButton.addEventListener("click", () => {
    materialSelect.value = "";
    brandSelect.value = "";
    colorSelect.value = "";
    nozzleInput.value = "";
    bedInput.value = "";

    // Reset material info box to the generic helper text
    updateMaterialInfo("");
    // Show the full filament list
    renderResults(filaments);
  });
});

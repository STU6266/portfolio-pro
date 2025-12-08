// public/js/filament.js

/**
 * Client-side logic for the Filament Finder page.
 *
 * Responsibilities:
 * - Load materials and filament data from /data/filaments.json.
 * - Populate filter controls (material, brand, color).
 * - Filter filaments by selected criteria (material, brand, color,
 *   nozzle temperature, bed temperature).
 * - Render the matching filaments into a list of cards.
 * - Display contextual material information for the selected material.
 * - On small screens, toggle the visibility of the filter card via
 *   a "Show filters / Hide filters" control.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Form that wraps all filter fields. If it does not exist,
  // the script stops early so it does not run on unrelated pages.
  const form = document.querySelector("#filament-filter-form");
  if (!form) return;

  // Mobile filter toggle controls.
  const filterCard = document.querySelector(".filament-filter-card");
  const filterToggleButton = document.getElementById("filament-filter-toggle");

  // Filter inputs.
  const materialSelect = document.querySelector("#filter-material");
  const brandSelect = document.querySelector("#filter-brand");
  const colorSelect = document.querySelector("#filter-color");
  const nozzleInput = document.querySelector("#filter-nozzle-temp");
  const bedInput = document.querySelector("#filter-bed-temp");
  const resetButton = document.querySelector("#filament-reset");

  // Result list and empty-state text element.
  const resultsContainer = document.querySelector("#filament-results-list");
  const emptyMessage = document.querySelector("#filament-results-empty");

  // Box displaying information about the selected material.
  const materialInfoBox = document.querySelector("#filament-material-info");

  // In-memory copies of the JSON data.
  let materials = [];
  let filaments = [];

  // ---------------------------------------------------------------------------
  // Data loading
  // ---------------------------------------------------------------------------

  fetch("/data/filaments.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Could not load filaments.json");
      }
      return res.json();
    })
    .then((data) => {
      materials = data.materials || [];
      filaments = data.filaments || [];

      populateMaterialOptions(materials);
      populateBrandOptions(filaments);

      updateMaterialInfo(materialSelect.value);
      renderResults(filaments);
    })
    .catch((err) => {
      console.error(err);
      emptyMessage.textContent =
        "Could not load filament data. Please try again later.";
      emptyMessage.style.display = "block";
    });

  // ---------------------------------------------------------------------------
  // Filter control population
  // ---------------------------------------------------------------------------

  /**
   * Populates the material <select> with options taken from the
   * materials array, plus a generic "Any material" option.
   */
  function populateMaterialOptions(materialsList) {
    materialSelect.innerHTML = "";

    const anyOpt = document.createElement("option");
    anyOpt.value = "";
    anyOpt.textContent = "Any material";
    materialSelect.appendChild(anyOpt);

    materialsList.forEach((mat) => {
      const opt = document.createElement("option");
      opt.value = mat.name;
      opt.textContent = mat.name;
      materialSelect.appendChild(opt);
    });
  }

  /**
   * Populates the brand <select> with unique brand names present
   * in the filaments array, plus a generic "Any brand" option.
   */
  function populateBrandOptions(filamentsList) {
    brandSelect.innerHTML = "";

    const anyOpt = document.createElement("option");
    anyOpt.value = "";
    anyOpt.textContent = "Any brand";
    brandSelect.appendChild(anyOpt);

    const uniqueBrands = Array.from(
      new Set(filamentsList.map((f) => f.brand))
    ).sort();

    uniqueBrands.forEach((brand) => {
      const opt = document.createElement("option");
      opt.value = brand;
      opt.textContent = brand;
      brandSelect.appendChild(opt);
    });
  }

  // ---------------------------------------------------------------------------
  // Material info panel
  // ---------------------------------------------------------------------------

  /**
   * Renders a small material summary into the materialInfoBox based
   * on the currently selected material name.
   */
  function updateMaterialInfo(selectedName) {
    if (!materialInfoBox) return;

    if (!selectedName) {
      materialInfoBox.innerHTML = `
        <h3>Material info</h3>
        <p class="filament-material-empty">
          Select a material on the left to see typical nozzle &amp; bed temps.
        </p>
      `;
      return;
    }

    const mat = materials.find((m) => m.name === selectedName);

    if (!mat) {
      materialInfoBox.innerHTML = `
        <h3>Material info</h3>
        <p class="filament-material-empty">
          No extra data found for this material.
        </p>
      `;
      return;
    }

    const enclosureText = mat.needs_enclosure
      ? "Enclosure or draft protection recommended."
      : "Open printer is usually fine.";

    const flexibleText = mat.is_flexible ? "Flexible material." : "Rigid material.";

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

  // ---------------------------------------------------------------------------
  // Filtering and result rendering
  // ---------------------------------------------------------------------------

  /**
   * Applies all active filters and re-renders the result list.
   */
  function applyFilters() {
    const materialValue = materialSelect.value;
    const brandValue = brandSelect.value;
    const colorValue = colorSelect.value;

    const nozzleValue = parseInt(nozzleInput.value, 10);
    const bedValue = parseInt(bedInput.value, 10);

    updateMaterialInfo(materialValue);

    const filtered = filaments.filter((f) => {
      const matchesMaterial = !materialValue || f.material === materialValue;
      const matchesBrand = !brandValue || f.brand === brandValue;
      const matchesColor = !colorValue || f.color === colorValue;

      const matchesNozzle =
        Number.isNaN(nozzleValue) ||
        (f.nozzle_temp_min <= nozzleValue && nozzleValue <= f.nozzle_temp_max);

      const matchesBed =
        Number.isNaN(bedValue) ||
        (f.bed_temp_min <= bedValue && bedValue <= f.bed_temp_max);

      return (
        matchesMaterial &&
        matchesBrand &&
        matchesColor &&
        matchesNozzle &&
        matchesBed
      );
    });

    renderResults(filtered);
  }

  /**
   * Renders the given list of filaments into the results container.
   * Shows an "empty" message if the list is empty.
   */
  function renderResults(list) {
    resultsContainer.innerHTML = "";

    if (!list || list.length === 0) {
      emptyMessage.textContent = "No filaments match the current filters yet.";
      emptyMessage.style.display = "block";
      return;
    }

    emptyMessage.style.display = "none";

    list.forEach((f) => {
      const card = document.createElement("article");
      card.className = "filament-card";

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

  // ---------------------------------------------------------------------------
  // Event wiring
  // ---------------------------------------------------------------------------

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilters();
  });

  materialSelect.addEventListener("change", applyFilters);
  brandSelect.addEventListener("change", applyFilters);
  colorSelect.addEventListener("change", applyFilters);

  nozzleInput.addEventListener("input", applyFilters);
  bedInput.addEventListener("input", applyFilters);

  resetButton.addEventListener("click", () => {
    materialSelect.value = "";
    brandSelect.value = "";
    colorSelect.value = "";
    nozzleInput.value = "";
    bedInput.value = "";

    updateMaterialInfo("");
    renderResults(filaments);
  });

  // ---------------------------------------------------------------------------
  // Mobile filter toggle
  // ---------------------------------------------------------------------------

  if (filterCard && filterToggleButton) {
    const mq = window.matchMedia("(max-width: 768px)");

    /**
     * Synchronises the filter card visibility with the current
     * viewport size (mobile vs. desktop).
     */
    function syncFilterState(e) {
      if (e.matches) {
        // On small screens, keep the filter card collapsed by default.
        filterCard.classList.remove("is-open");
        filterToggleButton.textContent = "Show filters";
        filterToggleButton.setAttribute("aria-expanded", "false");
      } else {
        // On larger screens, show the filters permanently.
        filterCard.classList.add("is-open");
        filterToggleButton.textContent = "Hide filters";
        filterToggleButton.setAttribute("aria-expanded", "true");
      }
    }

    // Initial state.
    syncFilterState(mq);

    // React to viewport size changes (e.g. device rotation).
    if (mq.addEventListener) {
      mq.addEventListener("change", syncFilterState);
    } else if (mq.addListener) {
      // Fallback for older browsers.
      mq.addListener(syncFilterState);
    }

    filterToggleButton.addEventListener("click", () => {
      const isOpen = filterCard.classList.toggle("is-open");
      filterToggleButton.textContent = isOpen ? "Hide filters" : "Show filters";
      filterToggleButton.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );
    });
  }
});

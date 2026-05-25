// public/js/filament-add.js

/**
 * Client-side logic for the "Add filament" demo page.
 *
 * Responsibilities:
 * - Load the material list from filaments.json to populate the Material select.
 * - Maintain a live preview of the filament card while the user is typing.
 * - Validate basic fields before saving.
 * - Send a POST request to /api/filaments so the new filament is persisted
 *   in filaments.json on the server.
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#filament-add-form");
  if (!form) return;

  // Input fields.
  const brandInput = document.querySelector("#add-brand");
  const productInput = document.querySelector("#add-product");
  const materialSelect = document.querySelector("#add-material");
  const colorSelect = document.querySelector("#add-color");
  const nozzleMinInput = document.querySelector("#add-nozzle-min");
  const nozzleMaxInput = document.querySelector("#add-nozzle-max");
  const bedMinInput = document.querySelector("#add-bed-min");
  const bedMaxInput = document.querySelector("#add-bed-max");
  const specialInput = document.querySelector("#add-special-type");
  const notesInput = document.querySelector("#add-notes");
  const saveButton = document.querySelector("#filament-save");
  const saveStatus = document.querySelector("#filament-save-status");

  // Preview container.
  const previewContainer = document.querySelector("#filament-add-preview");

  // Material metadata loaded from JSON.
  let materials = [];

  function setSaveStatus(message, type = "info") {
    if (!saveStatus) return;

    saveStatus.textContent = message;
    saveStatus.classList.remove("is-success", "is-error");

    if (type === "success") {
      saveStatus.classList.add("is-success");
    }

    if (type === "error") {
      saveStatus.classList.add("is-error");
    }
  }

  // ---------------------------------------------------------------------------
  // Data loading
  // ---------------------------------------------------------------------------

  fetch("/data/filaments.json")
    .then((res) => {
      if (!res.ok) throw new Error("Could not load filaments.json");
      return res.json();
    })
    .then((data) => {
      materials = data.materials || [];
      populateMaterialOptions(materials);
      renderPreview();
    })
    .catch((err) => console.error(err));

  /**
   * Populates the material <select> with options from the JSON file.
   */
  function populateMaterialOptions(list) {
    materialSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select material";
    materialSelect.appendChild(placeholder);

    list.forEach((mat) => {
      const opt = document.createElement("option");
      opt.value = mat.name; // matches the "material" field of each filament
      opt.textContent = mat.name;
      materialSelect.appendChild(opt);
    });
  }

  // ---------------------------------------------------------------------------
  // Data preparation for preview and saving
  // ---------------------------------------------------------------------------

  /**
   * Builds a filament object for preview purposes.
   * Uses reasonable default values where the user has not entered data yet
   * to keep the card visually readable.
   */
  function getPreviewData() {
    const nozzleMin = parseInt(nozzleMinInput.value, 10);
    const nozzleMax = parseInt(nozzleMaxInput.value, 10);
    const bedMin = parseInt(bedMinInput.value, 10);
    const bedMax = parseInt(bedMaxInput.value, 10);

    return {
      brand: brandInput.value.trim() || "Brand",
      product_name: productInput.value.trim() || "Product name",
      material: materialSelect.value || "Material",
      color: colorSelect.value || null,
      nozzle_temp_min: Number.isNaN(nozzleMin) ? 200 : nozzleMin,
      nozzle_temp_max: Number.isNaN(nozzleMax) ? 220 : nozzleMax,
      bed_temp_min: Number.isNaN(bedMin) ? 50 : bedMin,
      bed_temp_max: Number.isNaN(bedMax) ? 60 : bedMax,
      special_type: specialInput.value.trim() || null,
      notes: notesInput.value.trim(),
    };
  }

  /**
   * Builds the filament object that will actually be sent to the backend.
   * No placeholders are used here; the payload reflects exactly what the user
   * entered (including null/empty values).
   */
  function getDataForSave() {
    const nozzleMin = parseInt(nozzleMinInput.value, 10);
    const nozzleMax = parseInt(nozzleMaxInput.value, 10);
    const bedMin = parseInt(bedMinInput.value, 10);
    const bedMax = parseInt(bedMaxInput.value, 10);

    return {
      brand: brandInput.value.trim(),
      product_name: productInput.value.trim(),
      material: materialSelect.value,
      color: colorSelect.value || null,
      nozzle_temp_min: nozzleMin,
      nozzle_temp_max: nozzleMax,
      bed_temp_min: bedMin,
      bed_temp_max: bedMax,
      special_type: specialInput.value.trim() || null,
      notes: notesInput.value.trim(),
    };
  }

  // ---------------------------------------------------------------------------
  // Preview rendering
  // ---------------------------------------------------------------------------

  /**
   * Renders a single preview card into the preview container, reusing
   * the same visual structure as the main Filament Finder list.
   */
  function renderPreview() {
    const f = getPreviewData();

    previewContainer.innerHTML = "";

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

    previewContainer.appendChild(card);
  }

  // The form's submit event is repurposed to simply refresh the preview,
  // avoiding a full page reload.
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderPreview();
  });

  // Live preview: all inputs are wired so that changes render immediately.
  const inputs = [
    brandInput,
    productInput,
    materialSelect,
    colorSelect,
    nozzleMinInput,
    nozzleMaxInput,
    bedMinInput,
    bedMaxInput,
    specialInput,
    notesInput,
  ];

  inputs.forEach((el) => {
    if (!el) return;
    const eventName = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(eventName, renderPreview);
  });

  // ---------------------------------------------------------------------------
  // Saving to the backend
  // ---------------------------------------------------------------------------

  if (saveButton) {
    saveButton.addEventListener("click", async () => {
      const data = getDataForSave();
      setSaveStatus("");

      // Minimal required fields: brand, product name, and material.
      if (!data.brand || !data.product_name || !data.material) {
        setSaveStatus("Please fill at least brand, product name and material.", "error");
        return;
      }

      // All temperature fields must be numeric.
      const nums = [
        data.nozzle_temp_min,
        data.nozzle_temp_max,
        data.bed_temp_min,
        data.bed_temp_max,
      ];

      if (nums.some((n) => Number.isNaN(parseInt(n, 10)))) {
        setSaveStatus("Please provide numeric values for all temperatures.", "error");
        return;
      }

      try {
        saveButton.disabled = true;
        setSaveStatus("Saving filament...");

        const response = await fetch("/api/filaments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const msg = errData.error || "Could not save filament.";
          setSaveStatus(msg, "error");
          return;
        }

        await response.json();

        setSaveStatus("Filament saved. Redirecting to the list...", "success");
        window.setTimeout(() => {
          window.location.href = "/filament";
        }, 700);
      } catch (err) {
        console.error(err);
        setSaveStatus("Unexpected error while saving. Please try again later.", "error");
      } finally {
        saveButton.disabled = false;
      }
    });
  }
});

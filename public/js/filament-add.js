// public/js/filament-add.js
// ----------------------------------------------------------
// This script powers the "Add filament (demo)" page.
//
// Main idea:
// - Load the material list from filaments.json to fill the Material dropdown
// - Let the user type in brand, product, temps, etc.
// - Show a live preview of how this filament would look in the main list
// - When the user clicks "Save filament", send a POST request to the
//   backend (/api/filaments) so it gets added to filaments.json.
//
// Note: The live preview uses "fallback" values so the card still looks
// decent even if some fields are empty while the user is typing.
// ----------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // The form that holds all input fields for the new filament
  const form = document.querySelector("#filament-add-form");
  if (!form) return;

  // Grab all individual inputs
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

  // Where the preview card will be rendered
  const previewContainer = document.querySelector("#filament-add-preview");

  // This will be filled from filaments.json
  let materials = [];

  // --------------------------------------------------------
  // Load materials from the same JSON used on the main page
  // --------------------------------------------------------
  fetch("/data/filaments.json")
    .then((res) => {
      if (!res.ok) throw new Error("Could not load filaments.json");
      return res.json();
    })
    .then((data) => {
      materials = data.materials || [];
      // Fill material dropdown
      populateMaterialOptions(materials);
      // Show an initial preview (using placeholder values)
      renderPreview();
    })
    .catch((err) => console.error(err));

  // --------------------------------------------------------
  // Fill the Material <select> with options from the JSON
  // --------------------------------------------------------
  function populateMaterialOptions(list) {
    materialSelect.innerHTML = "";

    // First option is a placeholder – user must pick a real material
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select material";
    materialSelect.appendChild(placeholder);

    list.forEach((mat) => {
      const opt = document.createElement("option");
      opt.value = mat.name;   // matches the "material" field of each filament
      opt.textContent = mat.name;
      materialSelect.appendChild(opt);
    });
  }

  // --------------------------------------------------------
  // Collect data for the PREVIEW card (with fallback texts)
  //
  // This is what we use to render the card the user sees below
  // the form while typing. We don't want to show "undefined" in
  // the UI, so we provide default strings for missing values.
  // --------------------------------------------------------
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
      // For temps, if the user leaves it empty, we choose a "reasonable" default
      nozzle_temp_min: Number.isNaN(nozzleMin) ? 200 : nozzleMin,
      nozzle_temp_max: Number.isNaN(nozzleMax) ? 220 : nozzleMax,
      bed_temp_min: Number.isNaN(bedMin) ? 50 : bedMin,
      bed_temp_max: Number.isNaN(bedMax) ? 60 : bedMax,
      special_type: specialInput.value.trim() || null,
      notes: notesInput.value.trim()
    };
  }

  // --------------------------------------------------------
  // Collect data that we actually send to the backend to save
  //
  // Here we do NOT use dummy text. Instead we send exactly
  // what the user entered (including empty strings or nulls).
  // --------------------------------------------------------
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
      notes: notesInput.value.trim()
    };
  }

  // --------------------------------------------------------
  // Render the preview card under the form
  // --------------------------------------------------------
  function renderPreview() {
    const f = getPreviewData();

    // Clear any previous preview
    previewContainer.innerHTML = "";

    // Build a card using the same layout as the main list
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

  // --------------------------------------------------------
  // Form "submit": we don't actually send anything,
  // we just trigger a manual preview refresh.
  // --------------------------------------------------------
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderPreview();
  });

  // --------------------------------------------------------
  // Live preview: whenever something changes, re-render
  // --------------------------------------------------------
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
    notesInput
  ];

  inputs.forEach((el) => {
    if (!el) return;
    // For select fields we use "change", for text/number inputs we use "input"
    const evt = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, renderPreview);
  });

  // --------------------------------------------------------
  // Save button: send the new filament to the backend API
  // --------------------------------------------------------
  if (saveButton) {
    saveButton.addEventListener("click", async () => {
      const data = getDataForSave();

      // Very simple validation: user must provide brand, product and material
      if (!data.brand || !data.product_name || !data.material) {
        alert("Please fill at least brand, product name and material.");
        return;
      }

      // Check that all temperature fields are numeric
      const nums = [
        data.nozzle_temp_min,
        data.nozzle_temp_max,
        data.bed_temp_min,
        data.bed_temp_max
      ];

      if (nums.some((n) => Number.isNaN(parseInt(n, 10)))) {
        alert("Please provide numeric values for all temperatures.");
        return;
      }

      try {
        // Send a POST request to our Node.js API
        const response = await fetch("/api/filaments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          // Try to read a more specific error message from the server
          const errData = await response.json().catch(() => ({}));
          const msg = errData.error || "Could not save filament.";
          alert(msg);
          return;
        }

        const result = await response.json();
        console.log("Saved filament:", result);

        alert("Filament saved. It will now appear in the main list.");
        // After saving, go back to the main Filament Finder page
        window.location.href = "/filament";
      } catch (err) {
        console.error(err);
        alert("Unexpected error while saving. See console for details.");
      }
    });
  }
});

(function () {
  const projectImages = document.querySelectorAll(
    ".project-detail-media-grid .project-media-card img"
  );

  if (!projectImages.length) {
    return;
  }

  const dialog = document.createElement("dialog");
  dialog.className = "project-lightbox";
  dialog.innerHTML = `
    <div class="project-lightbox-inner">
      <button
        type="button"
        class="project-lightbox-close"
        aria-label="Close enlarged image"
      >
        Close
      </button>
      <img class="project-lightbox-image" alt="" />
      <p class="project-lightbox-caption"></p>
    </div>
  `;

  document.body.appendChild(dialog);

  const lightboxImage = dialog.querySelector(".project-lightbox-image");
  const lightboxCaption = dialog.querySelector(".project-lightbox-caption");
  const closeButton = dialog.querySelector(".project-lightbox-close");
  let lastFocusedElement = null;

  function getCaption(image) {
    const figure = image.closest("figure");
    const caption = figure ? figure.querySelector("figcaption") : null;
    return caption ? caption.textContent.trim() : image.alt;
  }

  function openLightbox(image) {
    lastFocusedElement = document.activeElement;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "";
    lightboxCaption.textContent = getCaption(image);

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    closeButton.focus();
  }

  function closeLightbox() {
    dialog.close();
    lightboxImage.removeAttribute("src");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  projectImages.forEach((image) => {
    const label = image.alt
      ? `Open larger view: ${image.alt}`
      : "Open larger project image";

    image.setAttribute("role", "button");
    image.setAttribute("tabindex", "0");
    image.setAttribute("aria-label", label);

    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeLightbox();
    }
  });

  dialog.addEventListener("close", () => {
    lightboxImage.removeAttribute("src");
  });
})();

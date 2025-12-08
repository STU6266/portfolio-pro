// public/js/contact-modal.js
// Opens the contact modal and builds a mailto: link with all data.
// Shows helpful error messages if required fields are empty
// and a hint if no email program seems to open.

document.addEventListener("DOMContentLoaded", () => {
  const navContactLink = document.getElementById("nav-contact-link");
  const overlay = document.getElementById("modal-overlay");
  const modal = document.getElementById("contact-modal");
  const form = document.getElementById("contact-form");

  const nameInput = document.getElementById("contact-name");
  const companyInput = document.getElementById("contact-company");
  const contactInput = document.getElementById("contact-info");
  const messageInput = document.getElementById("contact-message");

  const sendButton = document.getElementById("send-button");
  const closeButton = document.getElementById("close-button");

  const errorContact = document.getElementById("error-contact");
  const errorMessage = document.getElementById("error-message");
  const mailtoError = document.getElementById("mailto-error");

  if (!navContactLink || !overlay || !modal || !form) {
    // If something is missing, silently abort to avoid JS errors.
    return;
  }

  // Helper: open & close modal
  function openModal() {
    overlay.style.display = "block";
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.style.display = "none";
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  // Helper: reset error messages & styles
  function resetErrors() {
    errorContact.textContent = "";
    errorMessage.textContent = "";
    mailtoError.textContent = "";

    contactInput.parentElement.classList.remove("has-error");
    messageInput.parentElement.classList.remove("has-error");
  }

  // Open modal when clicking "Contact Me" in nav
  navContactLink.addEventListener("click", (event) => {
    event.preventDefault();
    resetErrors();
    openModal();
  });

  // Close modal on overlay click or close button
  overlay.addEventListener("click", () => closeModal());
  closeButton.addEventListener("click", () => closeModal());

  // Close on ESC
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.style.display === "block") {
      closeModal();
    }
  });

  // Handle form submit
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    resetErrors();

    let hasError = false;
    const contact = contactInput.value.trim();
    const message = messageInput.value.trim();
    const name = nameInput.value.trim();
    const company = companyInput.value.trim();

    // Basic validation for required fields
    if (!contact) {
      errorContact.textContent = "Please tell me how I can contact you.";
      contactInput.parentElement.classList.add("has-error");
      hasError = true;
    }

    if (!message) {
      errorMessage.textContent = "Please write a short message.";
      messageInput.parentElement.classList.add("has-error");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const subject = encodeURIComponent(
      name ? `Portfolio contact from ${name}` : "Portfolio contact"
    );

    const bodyLines = [
      name && `Name: ${name}`,
      company && `Company: ${company}`,
      contact && `How to contact me back: ${contact}`,
      "",
      message,
    ].filter(Boolean);

    const body = encodeURIComponent(bodyLines.join("\n"));
    const mailto = `mailto:stevenkemendics@gmail.com?subject=${subject}&body=${body}`;

    // Try to open the default mail client.
    // Technically we cannot reliably know if this succeeded,
    // but we can give a helpful message to the user afterwards.
    try {
      window.location.href = mailto;
    } catch (error) {
      // Only triggered in rare cases where the browser rejects the URL format
      mailtoError.textContent =
        "Your browser could not open an email program. It looks like no email application is configured on this device.";
      return;
    }

    // General hint: if no email window opened, the user most likely
    // has no default email program set up. This text is visible in the modal.
    mailtoError.textContent =
      "If no email window opened, there is probably no default email program configured on this device. " +
      "In that case you can contact me directly at: stevenkemendics@gmail.com";

    // Wir lassen das Modal offen, damit die Meldung sichtbar bleibt.
    // Der Nutzer kann es danach selbst schließen.
  });
});

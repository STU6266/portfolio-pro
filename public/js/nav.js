// public/js/nav.js

/**
 * Handles the mobile navigation toggle (hamburger menu).
 *
 * The script keeps the button's ARIA attributes in sync and closes
 * the menu automatically when a navigation link is selected or when
 * the Escape key is pressed.
 */

const navToggle = document.getElementById("nav-toggle");
const navList = document.getElementById("primary-nav");

if (navToggle && navList) {
  /**
   * Toggles the menu between open and closed states and updates
   * the ARIA attributes accordingly.
   */
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    const nextState = !isOpen;

    navToggle.setAttribute("aria-expanded", String(nextState));
    navToggle.setAttribute(
      "aria-label",
      nextState ? "Close menu" : "Open menu"
    );
  });

  /**
   * Closes the menu when any link inside the primary navigation
   * is activated. This improves usability on small screens.
   */
  navList.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }
  });

  /**
   * Listens for the Escape key at document level and closes the
   * menu if it is currently expanded. Focus returns to the button.
   */
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      navToggle.getAttribute("aria-expanded") === "true"
    ) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      navToggle.focus();
    }
  });
}

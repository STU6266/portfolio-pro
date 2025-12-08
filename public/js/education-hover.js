// public/js/education-hover.js

/**
 * Displays a floating image near the cursor when hovering specific
 * education entries. The image follows the cursor while staying
 * within the viewport and fades out with a short delay once the
 * trigger or the image itself is left.
 */

document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll(".edu-hover-trigger");
  const hoverBox = document.getElementById("edu-hover-image");
  const hoverImg = hoverBox?.querySelector("img");

  // If the required markup is not present, the script exits.
  if (!hoverBox || !hoverImg || triggers.length === 0) return;

  let hideTimeout;

  /**
   * Shows the hover box for a given image source and positions it
   * relative to the current mouse event.
   */
  function showBox(src, event) {
    if (!src) return;

    clearTimeout(hideTimeout);
    hoverImg.src = src;

    positionBox(event);
    hoverBox.classList.add("is-visible");
  }

  /**
   * Positions the hover box near the cursor while ensuring that
   * it remains inside the viewport.
   */
  function positionBox(event) {
    const padding = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Default position: bottom-right of the cursor.
    let x = event.clientX + padding;
    let y = event.clientY + padding;

    // Make the box visible temporarily to measure its size.
    hoverBox.style.left = "0px";
    hoverBox.style.top = "0px";
    hoverBox.classList.add("is-visible");
    const rect = hoverBox.getBoundingClientRect();

    // If there is not enough room to the right, move the box to the left.
    if (x + rect.width + padding > vw) {
      x = event.clientX - rect.width - padding;
    }

    // If there is not enough room at the bottom, move the box above.
    if (y + rect.height + padding > vh) {
      y = event.clientY - rect.height - padding;
    }

    hoverBox.style.left = `${x}px`;
    hoverBox.style.top = `${y}px`;
  }

  /**
   * Schedules a hide operation with a short delay so that the user
   * can move the mouse from the trigger onto the image.
   */
  function scheduleHide() {
    hideTimeout = setTimeout(() => {
      hoverBox.classList.remove("is-visible");
    }, 220);
  }

  // Attach hover behaviour to each trigger element.
  triggers.forEach((trigger) => {
    const imgSrc = trigger.dataset.img;

    trigger.addEventListener("mouseenter", (event) => {
      if (!imgSrc) return;
      showBox(imgSrc, event);
    });

    trigger.addEventListener("mousemove", (event) => {
      if (!imgSrc) return;
      positionBox(event);
    });

    trigger.addEventListener("mouseleave", () => {
      scheduleHide();
    });
  });

  // Keep the image visible while it is hovered directly.
  hoverBox.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout);
  });

  hoverBox.addEventListener("mouseleave", () => {
    scheduleHide();
  });
});

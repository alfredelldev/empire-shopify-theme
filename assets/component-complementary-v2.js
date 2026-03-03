document.addEventListener("submit", async (e) => {
  if (!e.target.matches(".complementary-add-form")) return;

  e.preventDefault();

  const formData = new FormData(e.target);

  await fetch("/cart/add.js", {
    method: "POST",
    body: formData,
  });

  document.dispatchEvent(new CustomEvent("cart:refresh"));
});

document.addEventListener("DOMContentLoaded", () => {
  initComplementaryDropdowns();
});

document.addEventListener("shopify:section:load", () => {
  initComplementaryDropdowns();
});

function initComplementaryDropdowns() {
  const dropdownHosts = document.querySelectorAll(".opt-ad-dropdown-host");

  dropdownHosts.forEach((host) => {
    const button = host.querySelector(".opt-ad-dropdown");
    const options = host.querySelector(".opt-ad-options");
    const chevron = host.querySelector(".opt-ad-chevron");

    if (!button || !options) return;

    // Prevent double binding
    if (host.dataset.initialized === "true") return;
    host.dataset.initialized = "true";

    // Start closed
    options.style.display = "none";
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDropdown(host);
    });

    // Prevent click inside from closing
    options.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  // Close on outside click
  document.addEventListener("click", closeAllDropdowns);

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllDropdowns();
    }
  });
}

function toggleDropdown(host) {
  const options = host.querySelector(".opt-ad-options");
  const button = host.querySelector(".opt-ad-dropdown");
  const chevron = host.querySelector(".opt-ad-chevron");

  const isOpen = options.style.display === "block";

  closeAllDropdowns();

  if (!isOpen) {
    options.style.display = "block";
    button.setAttribute("aria-expanded", "true");
    if (chevron) chevron.style.transform = "rotate(180deg)";
  }
}

function closeAllDropdowns() {
  document.querySelectorAll(".opt-ad-dropdown-host").forEach((host) => {
    const options = host.querySelector(".opt-ad-options");
    const button = host.querySelector(".opt-ad-dropdown");
    const chevron = host.querySelector(".opt-ad-chevron");

    if (!options || !button) return;

    options.style.display = "none";
    button.setAttribute("aria-expanded", "false");
    if (chevron) chevron.style.transform = "rotate(0deg)";
  });
}

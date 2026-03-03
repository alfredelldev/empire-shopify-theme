document.addEventListener("DOMContentLoaded", initOptAdV3);
document.addEventListener("shopify:section:load", initOptAdV3);

function initOptAdV3() {
  const accordions = document.querySelectorAll(".opt-ad-v3");

  accordions.forEach((accordion) => {
    if (accordion.dataset.initialized === "true") return;
    accordion.dataset.initialized = "true";

    const toggle = accordion.querySelector(".opt-ad-v3__toggle");
    const content = accordion.querySelector(".opt-ad-v3__content");
    const icon = accordion.querySelector(".opt-ad-v3__icon");

    // --- Accordion toggle ---
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        toggle.setAttribute("aria-expanded", "false");
        content.classList.remove("is-open");
        icon.textContent = "+";
      } else {
        toggle.setAttribute("aria-expanded", "true");
        content.classList.add("is-open");
        icon.textContent = "–";
      }
    });

    // --- AJAX Add to Cart (inside accordion) ---
    const forms = accordion.querySelectorAll(".opt-ad-v3__form");
    forms.forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = form.querySelector(".opt-ad-v3__btn");
        const originalText = btn.textContent;

        // Loading state
        btn.disabled = true;
        btn.classList.add("loading");
        btn.textContent = "";

        try {
          const response = await fetch("/cart/add.js", {
            method: "POST",
            body: new FormData(form),
          });
          const data = await response.json();
          console.log("Added to cart:", data);

          document.dispatchEvent(new CustomEvent("cart:refresh"));

          // Feedback
          btn.classList.remove("loading");
          btn.textContent = "Added!";
          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
          }, 1500);
        } catch (err) {
          console.error("Error adding to cart:", err);
          btn.textContent = originalText;
          btn.classList.remove("loading");
          alert("Error adding product to cart.");
        }
      });
    });

    // --- Variant modal button inside accordion ---
    accordion
      .querySelectorAll(".opt-ad-v3__btn--select-variant")
      .forEach((btn) => {
        btn.addEventListener("click", async () => {
          const item = btn.closest(".opt-ad-v3__item");
          const handle = item.dataset.recProductHandle;

          try {
            const res = await fetch(`/products/${handle}.js`);
            const product = await res.json();

            // Create modal
            const modal = document.createElement("div");
            modal.className = "opt-ad-v3-modal";

            // Build select options for variants
            const variantOptions = product.variants
              .map(
                (v, i) =>
                  `<option value="${v.id}" ${i === 0 ? "selected" : ""}>${
                    v.title
                  } — $${(v.price / 100).toFixed(2)}</option>`
              )
              .join("");

            modal.innerHTML = `
            <div class="opt-ad-v3-modal-content">
              <h2>${product.title}</h2>
              <select class="opt-ad-v3-variant-select">${variantOptions}</select>
              <div class="variant-price">$${(
                product.variants[0].price / 100
              ).toFixed(2)}</div>
              <button class="opt-ad-v3-addtocart">Add to cart</button>
              <button class="close-btn">Cancel</button>
            </div>
          `;

            document.body.appendChild(modal);

            const select = modal.querySelector(".opt-ad-v3-variant-select");
            const priceEl = modal.querySelector(".variant-price");
            const addBtn = modal.querySelector(".opt-ad-v3-addtocart");
            const closeBtn = modal.querySelector(".close-btn");

            // Update price when variant changes
            select.addEventListener("change", () => {
              const selectedVariant = product.variants.find(
                (v) => v.id == select.value
              );
              priceEl.textContent = `$${(selectedVariant.price / 100).toFixed(
                2
              )}`;
            });

            // Close modal
            closeBtn.addEventListener("click", () => modal.remove());

            // AJAX Add to cart from modal
            addBtn.addEventListener("click", async () => {
              const variantId = select.value;
              addBtn.disabled = true;
              addBtn.textContent = "Adding…";

              try {
                const formData = new FormData();
                formData.append("id", variantId);
                formData.append("quantity", 1);

                const response = await fetch("/cart/add.js", {
                  method: "POST",
                  body: formData,
                });
                const data = await response.json();
                console.log("Added variant to cart:", data);

                document.dispatchEvent(new CustomEvent("cart:refresh"));
                addBtn.textContent = "Added!";
                setTimeout(() => modal.remove(), 1000);
              } catch (err) {
                console.error(err);
                alert("Error adding to cart.");
                addBtn.disabled = false;
                addBtn.textContent = "Add to cart";
              }
            });
          } catch (err) {
            console.error(err);
            alert("Error fetching product details.");
          }
        });
      });
  });
}

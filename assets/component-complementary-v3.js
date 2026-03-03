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

    // Accordion toggle
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", !isOpen);
      content.classList.toggle("is-open");
      icon.textContent = isOpen ? "+" : "–";
    });

    // AJAX Add to Cart (simple products)
    accordion.querySelectorAll(".opt-ad-v3__form").forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = form.querySelector(".opt-ad-v3__btn");
        const originalText = btn.textContent;

        btn.disabled = true;
        btn.classList.add("loading");
        btn.textContent = "";

        try {
          await fetch("/cart/add.js", {
            method: "POST",
            body: new FormData(form),
          });

          document.dispatchEvent(new CustomEvent("cart:refresh"));

          btn.classList.remove("loading");
          btn.textContent = "Added!";
          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
          }, 1500);
        } catch (err) {
          btn.textContent = originalText;
          btn.classList.remove("loading");
          btn.disabled = false;
          alert("Error adding product to cart.");
        }
      });
    });

    // Variant modal
    accordion
      .querySelectorAll(".opt-ad-v3__btn--select-variant")
      .forEach((btn) => {
        btn.addEventListener("click", async () => {
          const item = btn.closest(".opt-ad-v3__item");
          const handle = item.dataset.recProductHandle;

          try {
            const res = await fetch(`/products/${handle}.js`);
            const product = await res.json();

            const modal = document.createElement("div");
            modal.className = "opt-ad-v3-modal";

            const firstVariant = product.variants[0];
            let selectedVariantId = firstVariant.id;

            const variantOptions = product.variants
              .map((v, i) => {
                const img = v.featured_image?.src || product.featured_image;
                return `
                <div class="opt-ad-v3-variant-option ${
                  i === 0 ? "is-active" : ""
                }"
                     data-id="${v.id}"
                     data-price="${v.price}">
                  <img src="${img}" alt="${v.title}">
                  <div class="variant-meta">
                    <div class="variant-title">${v.title}</div>
                    <div class="variant-price">$${(v.price / 100).toFixed(
                      2
                    )}</div>
                  </div>
                </div>
              `;
              })
              .join("");

            modal.innerHTML = `
            <div class="opt-ad-v3-modal-content">
              <h2>${product.title}</h2>

              <div class="opt-ad-v3-variant-dropdown">
                <div class="opt-ad-v3-selected">
                  <img src="${
                    firstVariant.featured_image?.src || product.featured_image
                  }">
                  <div>
                    <div class="variant-title">${firstVariant.title}</div>
                    <div class="variant-price">$${(
                      firstVariant.price / 100
                    ).toFixed(2)}</div>
                  </div>
                  <span class="chevron">▾</span>
                </div>

                <div class="opt-ad-v3-variant-options">
                  ${variantOptions}
                </div>
              </div>

              <button class="opt-ad-v3-addtocart">Add to cart</button>
              <button class="close-btn">Cancel</button>
            </div>
          `;

            document.body.appendChild(modal);

            const dropdown = modal.querySelector(".opt-ad-v3-variant-dropdown");
            const selected = modal.querySelector(".opt-ad-v3-selected");
            const optionsWrap = modal.querySelector(
              ".opt-ad-v3-variant-options"
            );
            const addBtn = modal.querySelector(".opt-ad-v3-addtocart");
            const closeBtn = modal.querySelector(".close-btn");

            // Toggle dropdown
            selected.addEventListener("click", () => {
              dropdown.classList.toggle("is-open");
            });

            // Variant selection
            optionsWrap
              .querySelectorAll(".opt-ad-v3-variant-option")
              .forEach((option) => {
                option.addEventListener("click", () => {
                  optionsWrap
                    .querySelectorAll(".opt-ad-v3-variant-option")
                    .forEach((o) => o.classList.remove("is-active"));

                  option.classList.add("is-active");

                  const id = option.dataset.id;
                  const price = option.dataset.price;
                  const img = option.querySelector("img").src;
                  const title =
                    option.querySelector(".variant-title").textContent;

                  selectedVariantId = id;

                  selected.innerHTML = `
                <img src="${img}">
                <div>
                  <div>${title}</div>
                  <div class="variant-price">$${(price / 100).toFixed(2)}</div>
                </div>
                <span class="chevron">▾</span>
              `;

                  dropdown.classList.remove("is-open");
                });
              });

            // Close modal
            closeBtn.addEventListener("click", () => modal.remove());

            // AJAX Add to Cart
            addBtn.addEventListener("click", async () => {
              addBtn.disabled = true;
              addBtn.textContent = "Adding...";

              try {
                const formData = new FormData();
                formData.append("id", selectedVariantId);
                formData.append("quantity", 1);

                await fetch("/cart/add.js", {
                  method: "POST",
                  body: formData,
                });

                document.dispatchEvent(new CustomEvent("cart:refresh"));

                addBtn.textContent = "Added!";
                setTimeout(() => modal.remove(), 1000);
              } catch (err) {
                addBtn.disabled = false;
                addBtn.textContent = "Add to cart";
                alert("Error adding to cart.");
              }
            });
          } catch (err) {
            alert("Error fetching product details.");
          }
        });
      });
  });
}

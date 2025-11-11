document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[id^='color-options-']").forEach((container) => {
    const productHandle = container.id.replace("color-options-", "");
    const variantGroup = container.getAttribute("data-variant-group");

    if (!variantGroup) return;

    fetch("/api/2025-01/graphql.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": "2f58fbe8ea8638f5694ca5e720f7b155",
      },
      body: JSON.stringify({
        query: `
                      {
                        products(first: 10, query: "tag:VGroup--${variantGroup}") {
                          edges {
                            node {
                              id
                              title
                              handle
                              tags
                            }
                          }
                        }
                      }
                  `,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const products = data.data.products.edges;
        const colorOptionsDiv = container.querySelector(".color-options");

        if (!colorOptionsDiv) return;

        products.forEach(({ node }) => {
          if (node.handle !== productHandle) {
            let colorTag = node.tags.find((tag) => tag.includes("Colour_"));
            if (colorTag) {
              let colorClass = colorTag
                .replace("Colour_", "")
                .replace(" ", "-")
                .toLowerCase();
              let link = document.createElement("a");
              link.href = `/products/${node.handle}`;
              link.className = `color-swatch__circle swatch-img ${colorClass}`;
              link.title = node.title;
              colorOptionsDiv.appendChild(link);
            }
          }
        });
      })
      .catch((error) => console.error("Error fetching variant group:", error));
  });
});

console.log("color-swatch.js loaded");
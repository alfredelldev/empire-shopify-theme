document.addEventListener("DOMContentLoaded", () => {
  const description = document.querySelector(".product-description");
  const tabHeaders = document.querySelector(".tab-headers");
  const tabContentContainer = document.querySelector(".tab-content-container");
  const addonsContainer = document.querySelector(".addons-container");
  const noRecommendationsClass = "complementary-products--no-recommendations";

  if (description) {
    // Get all h5 elements and their following siblings
    const headings = description.querySelectorAll("h5");
    headings.forEach((heading, index) => {
      const tabId = `tab${index + 1}`;
      const content = [];
      let sibling = heading.nextElementSibling;

      // Collect all siblings until the next h5 or the end of the description
      while (sibling && sibling.tagName !== "H5") {
        content.push(sibling.outerHTML);
        sibling = sibling.nextElementSibling;
      }

      // Create the tab header
      const tabHeader = document.createElement("button");
      tabHeader.classList.add("tab-header");
      if (index === 0) tabHeader.classList.add("active");
      tabHeader.textContent = heading.textContent;
      tabHeader.setAttribute("data-tab", tabId);
      tabHeaders.appendChild(tabHeader);

      // Create the tab content
      const tabContent = document.createElement("div");
      tabContent.classList.add("tab-content");
      if (index === 0) tabContent.classList.add("active");
      tabContent.id = tabId;
      tabContent.innerHTML = content.join(""); // Add the collected content
      tabContentContainer.appendChild(tabContent);

      // Remove the heading and its content from the description
      heading.remove();
    });

    // Add the Addons tab dynamically if the container exists and doesn't have the 'no-recommendations' class
    if (
      addonsContainer &&
      !addonsContainer.classList.contains("complementary-products--no-recommendations") 
    ) {
      const addonsTabHeader = document.createElement("button");
      addonsTabHeader.classList.add("tab-header");
      addonsTabHeader.classList.add("complimentary-header");
    //   addonsTabHeader.classList.add("d-none");
      addonsTabHeader.textContent = "Optional Additions";
      addonsTabHeader.setAttribute("data-tab", "addons");
      tabHeaders.appendChild(addonsTabHeader);

      addonsContainer.classList.add("tab-content");
      addonsContainer.id = "addons"; // Ensure ID matches tab
      if (tabHeaders.childElementCount === 1) {
        addonsTabHeader.classList.add("active");
        addonsContainer.classList.add("active");
      }
    }

    // Add tab functionality
    const tabs = document.querySelectorAll(".tab-header");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-tab");

        // Update active tab header
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // Update active tab content
        contents.forEach((content) => {
          if (content.id === target) {
            content.classList.add("active");
          } else {
            content.classList.remove("active");
          }
        });
      });
    });
  }
});

const removeAddons = () => {
  const tabHeaderAddons = document.querySelector(".complimentary-header");

  tabHeaderAddons.classList.add("d-none");

  console.log("asdasdasd");
};

const showAddons = () => {
  const tabHeaderAddons = document.querySelector(".complimentary-header");

  tabHeaderAddons.classList.remove("d-none");

  console.log("asdasdasd");
};

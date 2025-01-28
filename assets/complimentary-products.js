document.addEventListener("DOMContentLoaded", () => {
  const description = document.querySelector(".product-description");
  const tabHeaders = document.querySelector(".tab-headers");
  const tabContentContainer = document.querySelector(".tab-content-container");
  const addonsContainer = document.querySelector(".addons-container");
  const elementToCopy = document.querySelector('.icon-caret-container .icon-caret');
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
      tabContentContainer.appendChild(tabHeader);

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
      tabContentContainer.appendChild(addonsTabHeader);

      addonsContainer.classList.add("tab-content");
      addonsContainer.id = "addons"; // Ensure ID matches tab
      if (tabHeaders.childElementCount === 1) {
        addonsTabHeader.classList.add("active");
        addonsContainer.classList.add("active");
      }

      tabContentContainer.appendChild(addonsContainer);
    }

    const shortDescription = document.querySelector('.product-block--description');
    const tabsContainer = document.querySelector('.tabs-container');
    const productTitle = document.querySelector('.product-title');

    if (shortDescription && tabsContainer && productTitle) {
      const newDiv = document.createElement('div');
      newDiv.classList.add('new-description-wrapper');

      // Copy the product title and create an h3
      const productTitleCopy = document.createElement('h5');
      productTitleCopy.classList.add('product-title-copied'); // Optional: Add a new class for styling
      productTitleCopy.textContent = productTitle.textContent.trim(); // Copy text content

      // Add the copied product title to the new div
      newDiv.appendChild(productTitleCopy);

      // Append the description into the new div
      newDiv.appendChild(shortDescription);

      // Insert the new div above the tabs-container
      tabsContainer.parentNode.insertBefore(newDiv, tabsContainer);
    }

    // Add tab functionality
    const tabs = document.querySelectorAll(".tab-header");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
      const clonedElement = elementToCopy.cloneNode(true); // Clone the element (deep clone)
      clonedElement.classList.remove('d-none');
      tab.appendChild(clonedElement); // Append the cloned element to the tab header

      // tab.addEventListener("click", () => {
      //   const target = tab.getAttribute("data-tab");

      //   if (window.screen.width <= 1024) {
      //     // Tablet and below: Toggle active class on tab and content
      //     tab.classList.toggle("active");

      //     contents.forEach((content) => {
      //       if (content.id === target) {
      //         content.classList.toggle("active");
      //       }
      //     });
      //   } else {
      //     // Update active tab header
      //     tabs.forEach((t) => t.classList.remove("active"));
      //     tab.classList.add("active");

      //     // Update active tab content
      //     contents.forEach((content) => {
      //       if (content.id === target) {
      //         content.classList.add("active");
      //       } else {
      //         content.classList.remove("active");
      //       }
      //     });
      //   }
      // });

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

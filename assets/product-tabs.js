document.addEventListener("DOMContentLoaded", initTabs);
document.addEventListener("shopify:section:load", initTabs);

function initTabs() {
  document.querySelectorAll(".product-tabs").forEach((wrapper) => {
    // prevent double init
    if (wrapper.dataset.tabsInitialized === "true") return;
    wrapper.dataset.tabsInitialized = "true";

    const nav = wrapper.querySelector(".tabs-nav");
    const content = wrapper.querySelector(".tabs-content");
    const descSource = wrapper.querySelector(".product-description-source");
    const descAbove = wrapper.querySelector(".description-above");
    const sources = wrapper.querySelectorAll("[data-tab-source]");

    // clear UI (important)
    nav.innerHTML = "";
    content.innerHTML = "";
    descAbove.innerHTML = "";

    const mode = wrapper.dataset.descriptionMode || "tab";

    const urlParams = new URLSearchParams(window.location.search);
    const urlTab = urlParams.get("tab");

    let tabs = [];

    function slugify(text) {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
    }

    function addTab(title, html, handle) {
      if (!html || html.trim() === "") return;

      // prevent duplicates
      if (tabs.find((t) => t.handle === handle)) return;

      tabs.push({ title, html, handle });
    }

    // -------------------------
    // 1. DESCRIPTION PARSE FIRST
    // -------------------------
    if (descSource && mode !== "hidden") {
      const temp = document.createElement("div");
      temp.innerHTML = descSource.innerHTML;

      const headings = temp.querySelectorAll("h2,h3,h4,h5,h6");

      let nonTabContent = "";
      let usedNodes = new Set();

      // HEADINGS → TABS
      let headingTabs = [];

      headings.forEach((heading) => {
        let html = "";
        let el = heading.nextSibling;

        while (el && !(el.tagName && el.tagName.match(/^H[2-6]$/))) {
          html += el.outerHTML || el.textContent;
          usedNodes.add(el);
          el = el.nextSibling;
        }

        headingTabs.push({
          title: heading.innerText,
          html: html,
          handle: slugify(heading.innerText),
        });

        usedNodes.add(heading);
      });

      // NON-HEADING CONTENT
      temp.childNodes.forEach((node) => {
        if (!usedNodes.has(node)) {
          nonTabContent += node.outerHTML || node.textContent;
        }
      });

      // MODE: ABOVE
      if (mode === "above") {
        descAbove.innerHTML = nonTabContent;
      }

      // MODE: TAB → add FIRST
      if (mode === "tab" && nonTabContent.trim() !== "") {
        addTab("Description", nonTabContent, "description");
      }

      // ADD HEADING TABS SECOND
      headingTabs.forEach((t) => addTab(t.title, t.html, t.handle));
    }

    // -------------------------
    // 2. METAFIELDS LAST
    // -------------------------
    sources.forEach((el) => {
      addTab(el.dataset.title, el.innerHTML, el.dataset.handle);
    });

    // -------------------------
    // 3. RENDER
    // -------------------------
    tabs.forEach((tab) => {
      const btn = document.createElement("button");
      btn.className = "tab-btn";
      btn.innerText = tab.title;
      btn.dataset.handle = tab.handle;

      const panel = document.createElement("div");
      panel.className = "tab-panel";
      panel.innerHTML = tab.html;

      btn.addEventListener("click", () => {
        activate(tab.handle);
        updateURL(tab.handle);
      });

      nav.appendChild(btn);
      content.appendChild(panel);
    });

    function activate(handle) {
      const buttons = nav.querySelectorAll(".tab-btn");
      const panels = content.querySelectorAll(".tab-panel");

      buttons.forEach((b, i) => {
        const active = b.dataset.handle === handle;
        b.classList.toggle("active", active);
        panels[i].classList.toggle("active", active);
      });
    }

    function updateURL(handle) {
      const url = new URL(window.location);
      url.searchParams.set("tab", handle);
      window.history.replaceState({}, "", url);
    }

    // -------------------------
    // 4. INITIAL ACTIVE
    // -------------------------
    const first = tabs[0]?.handle;

    if (urlTab && tabs.find((t) => t.handle === urlTab)) {
      activate(urlTab);
    } else if (first) {
      activate(first);
    }
  });
}

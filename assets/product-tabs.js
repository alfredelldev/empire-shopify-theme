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

    // clear UI
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
      if (!html || !html.trim()) return;
      if (tabs.find((t) => t.handle === handle)) return;
      tabs.push({ title, html, handle });
    }

    // =========================
    // 1. DESCRIPTION PARSE
    // =========================
    if (descSource && mode !== "hidden") {
      const temp = document.createElement("div");
      temp.innerHTML = descSource.innerHTML;

      let headingTabs = [];

      // =========================
      // EXTRACT HEADINGS → TABS
      // =========================
      const headings = temp.querySelectorAll("h2,h3,h4,h5,h6");

      headings.forEach((heading) => {
        let html = "";
        let el = heading.nextElementSibling;

        const nodesToRemove = [heading];

        while (el && !/^H[2-6]$/.test(el.tagName)) {
          const next = el.nextElementSibling;

          html += el.outerHTML || el.textContent;

          nodesToRemove.push(el);

          el = next;
        }

        nodesToRemove.forEach((n) => n.remove());

        headingTabs.push({
          title: heading.innerText,
          html: html,
          handle: slugify(heading.innerText),
        });
      });

      // =========================
      // CLEAN REMAINING CONTENT (IMPORTANT FIX)
      // =========================
      const cleanClone = temp.cloneNode(true);

      cleanClone.querySelectorAll("h2,h3,h4,h5,h6").forEach((h) => h.remove());

      const nonTabContent = cleanClone.innerHTML.trim();

      // =========================
      // MODE HANDLING
      // =========================
      if (mode === "above") {
        descAbove.innerHTML = nonTabContent;
      }

      if (mode === "tab" && nonTabContent) {
        addTab("Description", nonTabContent, "description");
      }

      headingTabs.forEach((t) => addTab(t.title, t.html, t.handle));
    }

    // =========================
    // 2. METAFIELDS LAST
    // =========================
    sources.forEach((el) => {
      addTab(el.dataset.title, el.innerHTML, el.dataset.handle);
    });

    // =========================
    // 3. RENDER
    // =========================
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

    // =========================
    // 4. INITIAL ACTIVE TAB
    // =========================
    const first = tabs[0]?.handle;

    if (urlTab && tabs.find((t) => t.handle === urlTab)) {
      activate(urlTab);
    } else if (first) {
      activate(first);
    }
  });
}

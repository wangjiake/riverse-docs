/**
 * Filter search results by current language.
 * The i18n plugin builds a single search index with all languages.
 * This script hides results that don't belong to the active locale.
 */
(function () {
  var lang = location.pathname.match(/\/(zh|ja)\//);
  lang = lang ? lang[1] : "en";

  function filterResults() {
    var items = document.querySelectorAll(".md-search-result__item");
    items.forEach(function (item) {
      var link = item.querySelector("a");
      if (!link) return;
      var href = link.getAttribute("href") || "";

      var show = false;
      if (lang === "en") {
        show = !(/\/(zh|ja)\//.test(href));
      } else {
        show = href.indexOf("/" + lang + "/") !== -1;
      }
      item.style.display = show ? "" : "none";
    });

    // Update the visible result count
    var meta = document.querySelector(".md-search-result__meta");
    if (meta) {
      var visible = document.querySelectorAll(
        '.md-search-result__item:not([style*="display: none"])'
      ).length;
      if (visible === 0) {
        meta.textContent = meta.textContent.replace(/\d+/, "0");
      } else {
        meta.textContent = meta.textContent.replace(/\d+/, String(visible));
      }
    }
  }

  // Observe search result list for changes
  var observer = new MutationObserver(filterResults);

  function init() {
    var list = document.querySelector(".md-search-result__list");
    if (list) {
      observer.observe(list, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

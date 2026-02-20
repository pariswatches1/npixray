/**
 * NPIxray Embeddable Widget
 *
 * Usage:
 *   <div id="npixray-widget" data-npi="1234567890"></div>
 *   <script src="https://npixray.com/embed.js"></script>
 *
 * Or via iframe:
 *   <iframe src="https://npixray.com/embed/1234567890" width="340" height="300" frameborder="0"></iframe>
 */
(function () {
  "use strict";
  var containers = document.querySelectorAll("[data-npixray-npi], #npixray-widget[data-npi]");
  if (!containers.length) return;

  containers.forEach(function (el) {
    var npi = el.getAttribute("data-npixray-npi") || el.getAttribute("data-npi");
    if (!npi || !/^\d{10}$/.test(npi)) return;

    var iframe = document.createElement("iframe");
    iframe.src = "https://npixray.com/embed/" + npi;
    iframe.style.border = "none";
    iframe.style.width = el.getAttribute("data-width") || "340px";
    iframe.style.height = el.getAttribute("data-height") || "320px";
    iframe.style.borderRadius = "12px";
    iframe.style.overflow = "hidden";
    iframe.title = "NPIxray Revenue Score";
    iframe.loading = "lazy";
    el.appendChild(iframe);
  });
})();

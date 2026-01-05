(function () {
    "use strict";

    var redirect = sessionStorage.getItem("redirect");
    var isFallbackPage = document.documentElement.getAttribute("data-github-pages-fallback") === "true";

    sessionStorage.removeItem("redirect");

    if (redirect && redirect !== location.href) {
        history.replaceState(null, "", redirect);
        return;
    }

    if (isFallbackPage) {
        sessionStorage.setItem("redirect", location.href);
        location.replace(location.origin + "/");
    }
})();

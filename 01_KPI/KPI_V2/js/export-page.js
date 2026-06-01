function exportCurrentPagePdf() {
    const title = document.querySelector(".app-brand-title")?.textContent?.trim() || document.title || "KPI Dashboard";
    document.body.setAttribute("data-export-title", title);
    document.documentElement.classList.add("is-printing");
    window.setTimeout(() => window.print(), 80);
}

window.exportCurrentPagePdf = exportCurrentPagePdf;

window.addEventListener("afterprint", () => {
    document.documentElement.classList.remove("is-printing");
});

const POWER_BI_URL =
    "https://app.powerbi.com/view?r=eyJrIjoiODI2ODkyMTAtY2JjYi00ZGNhLTk2NTQtYjk2MzkwMzViZWUwIiwidCI6ImE2NzRhMDgxLTBjNTMtNGQyZC1hZWQ2LWRiZjgwNmY5NWExYiJ9";

document.addEventListener("DOMContentLoaded", function () {
    const frame = document.getElementById("dashboardBiFrame");
    if (!frame) return;

    if (frame.src !== POWER_BI_URL) {
        frame.src = POWER_BI_URL;
    }
});

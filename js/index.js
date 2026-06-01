import routes from "../config/routes.js";
import epicModules from "../config/modules-config.js";

const POWER_BI_URL =
    "https://app.powerbi.com/view?r=eyJrIjoiMDE3ZmQzZGEtNDEwYi00YzVhLWFmNzktMjJhM2RmMmYxNzk4IiwidCI6ImE2NzRhMDgxLTBjNTMtNGQyZC1hZWQ2LWRiZjgwNmY5NWExYiJ9";

function getI18n() {
    return (
        window.PlaybookI18n || {
            t: function (_key, fallback) {
                return fallback;
            }
        }
    );
}

function getLinkSecurityApi() {
    if (window.PlaybookLinkSecurity && typeof window.PlaybookLinkSecurity.sanitizeHref === "function") {
        return window.PlaybookLinkSecurity;
    }

    return {
        sanitizeHref: function (rawHref, fallback) {
            const safeFallback = fallback === undefined ? "#" : fallback;
            const fallbackText = safeFallback === null ? null : String(safeFallback).trim();
            const href = String(rawHref === undefined || rawHref === null ? "" : rawHref).trim();

            if (!href) return fallbackText;
            if (href === "#" || href.charAt(0) === "#") return href;
            if (href.indexOf("//") === 0) return fallbackText;

            const compact = href.replace(/[\u0000-\u001F\u007F\s]+/g, "");
            const schemeMatch = compact.match(/^([a-z][a-z0-9+.-]*):/i);
            if (!schemeMatch) return href;

            const scheme = schemeMatch[1].toLowerCase();
            if (scheme === "http" || scheme === "https" || scheme === "mailto" || scheme === "tel") {
                return href;
            }

            return fallbackText;
        },
        setHref: function (element, rawHref, fallback) {
            const safeHref = this.sanitizeHref(rawHref, fallback);
            if (!element) return safeHref;
            if (safeHref === null) {
                element.removeAttribute("href");
                return null;
            }

            element.href = safeHref;
            return safeHref;
        }
    };
}

const linkSecurity = getLinkSecurityApi();

function hasExternalAllowedScheme(href) {
    return /^(?:https?:|mailto:|tel:)/i.test(String(href || ""));
}

function buildModuleActionLabel(moduleMeta, i18n) {
    const configured = i18n.t("home.moduleCtas." + moduleMeta.id, "");
    if (configured) return configured;

    if (/dashboard/i.test(moduleMeta.id)) {
        return i18n.t("home.moduleCtas.fallbackDashboard", "Abrir Dashboard");
    }

    if (/map|mapa/i.test(moduleMeta.id)) {
        return i18n.t("home.moduleCtas.fallbackMap", "Abrir mapa");
    }

    return i18n.t("home.moduleCtas.fallbackGeneric", "Abrir módulo");
}

function resolveModuleLink(moduleMeta) {
    const rawLink = String(moduleMeta && moduleMeta.link ? moduleMeta.link : "");
    if (!rawLink) return rawLink;

    const normalizedLink = rawLink.replace(/\\/g, "/").toLowerCase();
    const isLegacyFluxoEntry =
        moduleMeta &&
        moduleMeta.id === "fluxo" &&
        (
            normalizedLink === "03_fluxo_global/index.html" ||
            normalizedLink === "./03_fluxo_global/index.html" ||
            normalizedLink.endsWith("/03_fluxo_global/index.html")
        );

    if (isLegacyFluxoEntry) {
        return routes.fluxoHome;
    }

    return rawLink;
}

function createModuleCard(moduleMeta, i18n) {
    const card = document.createElement("article");
    card.className = "module-card";

    const isComingSoon = moduleMeta.status === "coming_soon";
    card.classList.add(isComingSoon ? "is-coming-soon" : "is-available");

    const title = document.createElement("h3");
    title.textContent = i18n.t("home.modules." + moduleMeta.id + ".title", moduleMeta.id);

    const description = document.createElement("p");
    description.textContent = i18n.t("home.modules." + moduleMeta.id + ".description", "");

    if (isComingSoon) {
        const statusBadge = document.createElement("span");
        statusBadge.className = "module-badge-home";
        statusBadge.textContent = i18n.t("home.labels.comingSoon", "Em breve");
        card.appendChild(statusBadge);
    }

    card.appendChild(title);
    card.appendChild(description);

    if (isComingSoon) {
        const plannedTag = document.createElement("span");
        plannedTag.className = "module-plan-tag";
        plannedTag.textContent = i18n.t("home.labels.plannedModule", "Módulo planejado");
        card.appendChild(plannedTag);
        return card;
    }

    const action = document.createElement("a");
    action.className = "btn-module";
    linkSecurity.setHref(action, resolveModuleLink(moduleMeta), "#");
    action.textContent = buildModuleActionLabel(moduleMeta, i18n);
    card.appendChild(action);

    return card;
}

function renderEpicModules(containerId, epicId, i18n) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const epicMeta = epicModules[epicId];
    if (!epicMeta || !Array.isArray(epicMeta.modules)) return;

    container.replaceChildren();
    epicMeta.modules.forEach(function (moduleMeta) {
        container.appendChild(createModuleCard(moduleMeta, i18n));
    });
}

function setLink(id, href, isExternal) {
    const el = document.getElementById(id);
    if (!el) return;

    const safeHref = linkSecurity.setHref(el, href, "#");

    if (isExternal && hasExternalAllowedScheme(safeHref)) {
        el.target = "_blank";
        el.rel = "noopener noreferrer";
        return;
    }

    el.removeAttribute("target");
    el.removeAttribute("rel");
}

function setupMobileNavigation() {
    const toggle = document.getElementById("homeMenuToggle");
    const nav = document.getElementById("homePrimaryNav");

    if (!toggle || !nav) return;

    function closeMenu() {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
        nav.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function () {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        if (expanded) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            closeMenu();
        });
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 980) {
            closeMenu();
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const i18n = getI18n();

    setLink("navGlobalService", routes.globalServiceHome);
    setLink("navZohoDesk", routes.zohoDeskEpicAnchor || routes.zohoDeskHome);
    setLink("navExecutiveBi", POWER_BI_URL, true);

    setLink("headerBiCta", POWER_BI_URL, true);
    setLink("heroBiCta", routes.kpiHome);

    setLink("quickGlobalService", routes.globalServiceHome);
    setLink("quickTutorialZoho", routes.zohoDeskTutorialHome);
    setLink("quickZohoHelp", routes.zohoDeskHome);
    setLink("quickBi", routes.kpiHome);

    setLink("macroGlobalService", routes.globalServiceHome);
    setLink("macroZohoDesk", routes.zohoDeskHome);
    setLink("zohoDeskTutorialCta", routes.zohoDeskTutorialHome);

    renderEpicModules("globalServiceModules", "global_service", i18n);

    setupMobileNavigation();
});

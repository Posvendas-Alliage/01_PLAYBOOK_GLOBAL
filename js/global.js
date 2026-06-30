function createPlaybookLinkSecurity() {
    // Allowlist explícita para links dinâmicos.
    const ALLOWED_SCHEMES = {
        http: true,
        https: true,
        mailto: true,
        tel: true
    };

    function toStringValue(value) {
        return String(value === undefined || value === null ? "" : value).trim();
    }

    function getScheme(value) {
        const compact = value.replace(/[\u0000-\u001F\u007F\s]+/g, "");
        const match = compact.match(/^([a-z][a-z0-9+.-]*):/i);
        return match ? match[1].toLowerCase() : "";
    }

    function sanitizeHref(rawHref, fallback) {
        const safeFallback = fallback === undefined ? "#" : fallback;
        const fallbackText = safeFallback === null ? null : toStringValue(safeFallback);
        const href = toStringValue(rawHref);

        if (!href) return fallbackText;
        if (href === "#" || href.charAt(0) === "#") return href;
        if (href.indexOf("//") === 0) return fallbackText;

        const scheme = getScheme(href);
        if (!scheme) return href;

        return ALLOWED_SCHEMES[scheme] ? href : fallbackText;
    }

    function setHref(element, rawHref, fallback) {
        const safeHref = sanitizeHref(rawHref, fallback);
        if (!element) return safeHref;

        if (safeHref === null) {
            element.removeAttribute("href");
            return null;
        }

        element.href = safeHref;
        return safeHref;
    }

    function navigate(rawHref) {
        const safeHref = sanitizeHref(rawHref, null);
        if (!safeHref) return false;

        window.location.assign(safeHref);
        return true;
    }

    return {
        sanitizeHref: sanitizeHref,
        setHref: setHref,
        navigate: navigate
    };
}

if (!window.PlaybookLinkSecurity || typeof window.PlaybookLinkSecurity.sanitizeHref !== "function") {
    window.PlaybookLinkSecurity = createPlaybookLinkSecurity();
}

function sanitizeLinkHref(href, fallback) {
    return window.PlaybookLinkSecurity.sanitizeHref(href, fallback);
}

function setSanitizedHref(element, href, fallback) {
    return window.PlaybookLinkSecurity.setHref(element, href, fallback);
}

document.addEventListener("DOMContentLoaded", function () {
    initializeLanguageSelector();
    initializePlaybookAuth();
    applyModuleStandardization();
    enableSmoothAnchorScroll();
    annotateSectionLeads();
    applyWayfindingLayer();
    markCurrentLocalLinks();
    markPrimaryNavState();
    initializePlaybookAssistant();
});

function getI18n() {
    return window.PlaybookI18n || {
        t: function (_key, fallback) {
            return fallback;
        }
    };
}

function initializePlaybookAuth() {
    if (window.PlaybookAuth || window.__PlaybookAuthBootstrapStarted) return;
    window.__PlaybookAuthBootstrapStarted = true;

    const basePath = resolveGlobalAssetBasePath();
    if (!basePath) return;

    loadScriptOnce(
        "playbookSupabaseConfigScript",
        basePath + "config/supabase.js",
        function () {
            loadScriptOnce(
                "playbookSupabaseJsScript",
                "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
                function () {
                    loadScriptOnce("playbookAuthScript", basePath + "js/auth.js");
                },
                function () {
                    loadScriptOnce("playbookAuthScript", basePath + "js/auth.js");
                }
            );
        },
        function () {
            loadScriptOnce("playbookAuthScript", basePath + "js/auth.js");
        }
    );
}

function initializePlaybookAssistant() {
    const currentPath = normalizePath(window.location.pathname);
    if (currentPath.indexOf("/_archived/") >= 0) return;
    if (window.__PlaybookAssistantBootstrapStarted) return;
    window.__PlaybookAssistantBootstrapStarted = true;

    const basePath = resolveGlobalAssetBasePath();
    if (!basePath) return;

    window.PlaybookAssistantBasePath = basePath;

    injectStylesheetOnce(
        "playbookAssistantStylesheet",
        basePath + "css/playbook-assistant.css"
    );

    loadScriptOnce(
        "playbookAssistantDataScript",
        basePath + "data/playbook-assistant-data.js",
        function () {
            loadScriptOnce(
                "playbookAssistantScript",
                basePath + "js/playbook-assistant.js"
            );
        },
        function () {
            loadScriptOnce(
                "playbookAssistantScript",
                basePath + "js/playbook-assistant.js"
            );
        }
    );
}

function resolveGlobalAssetBasePath() {
    const globalScriptSrc = findScriptSourceBySuffix("js/global.js");
    if (!globalScriptSrc) return "";

    try {
        return new URL("../", globalScriptSrc).href;
    } catch (_error) {
        return "";
    }
}

function findScriptSourceBySuffix(pathSuffix) {
    const expectedSuffix = "/" + normalizePath(pathSuffix).replace(/^\//, "");
    const scripts = document.querySelectorAll("script[src]");

    for (let index = scripts.length - 1; index >= 0; index -= 1) {
        const src = scripts[index].src || "";
        if (!src) continue;

        const normalizedSrc = normalizePath(
            src.split("#")[0].split("?")[0]
        );

        if (normalizedSrc.endsWith(expectedSuffix)) {
            return src;
        }
    }

    return "";
}

function injectStylesheetOnce(id, href) {
    if (!href) return;
    if (document.getElementById(id)) return;
    const safeHref = sanitizeLinkHref(href, null);
    if (!safeHref) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = safeHref;

    const target = document.head || document.body;
    if (!target) return;
    target.appendChild(link);
}

function loadScriptOnce(id, src, onLoad, onError) {
    if (!src) {
        if (typeof onError === "function") onError();
        return;
    }

    const existing = document.getElementById(id);
    if (existing) {
        if (typeof onLoad === "function") onLoad();
        return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = function () {
        if (typeof onLoad === "function") onLoad();
    };
    script.onerror = function () {
        if (typeof onError === "function") onError();
    };

    const target = document.body || document.head;
    if (!target) {
        if (typeof onError === "function") onError();
        return;
    }

    target.appendChild(script);
}

function initializeLanguageSelector() {
    if (!window.PlaybookI18n || !window.playbookSetLocale) return;
    if (document.getElementById("playbookLanguageSelector")) return;

    const target = document.querySelector(".header .header-content") || document.querySelector(".header .header-container");
    if (!target) return;

    window.PlaybookI18n.renderLanguageSelector({
        target: target,
        selectorId: "playbookLanguageSelector",
        wrapperClass: "language-selector-wrap",
        labelClass: "language-selector-label",
        inputClass: "language-selector-input"
    });
}

function enableSmoothAnchorScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const href = this.getAttribute("href");
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            const headerHeight = getHeaderHeight();
            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

            window.scrollTo({
                top: top,
                behavior: "smooth"
            });
        });
    });
}

function getHeaderHeight() {
    const header = document.querySelector(".header");
    return header ? header.offsetHeight : 0;
}

function annotateSectionLeads() {
    const sectionContainers = document.querySelectorAll("main section .container");

    sectionContainers.forEach(function (container) {
        const heading = container.querySelector("h2");
        if (!heading) return;

        const nextElement = heading.nextElementSibling;
        if (!nextElement) return;
        if (nextElement.tagName !== "P") return;
        if (nextElement.classList.contains("section-lead")) return;
        if (nextElement.classList.contains("page-breadcrumb")) return;

        nextElement.classList.add("section-lead");
    });
}

function normalizePath(path) {
    return String(path || "")
        .replace(/\\/g, "/")
        .replace(/\/+$/, "")
        .toLowerCase();
}

function toAbsolutePath(href) {
    const safeHref = sanitizeLinkHref(href, null);
    if (!safeHref || safeHref.charAt(0) === "#") return "";
    if (/^(?:https?:|mailto:|tel:)/i.test(safeHref)) return "";

    try {
        return normalizePath(new URL(safeHref, window.location.href).pathname);
    } catch (_error) {
        return "";
    }
}

function applyModuleStandardization() {
    const currentPath = normalizePath(window.location.pathname);
    if (currentPath.indexOf("/_archived/") >= 0) return;

    const context = getModuleContext(currentPath);
    if (!context) return;

    if (document.body) {
        document.body.classList.add("module-page");
    }

    normalizeHeaderNavigation();
    ensureEpicContextStrip(context);
    normalizeModuleTopSection(context);
    ensureInlineModuleContext(context);
    injectCompactLocalNav();
    harmonizeHeroButtonRoles();
    normalizeModuleCtaVerbs();
}

function normalizeHeaderNavigation() {
    const links = document.querySelectorAll(".header .nav a");
    if (!links.length) return;

    links.forEach(function (link) {
        link.classList.add("nav-link");
        link.classList.remove("btn", "btn-primary", "btn-secondary", "btn-ghost");
    });
}

function getEpicContextMeta(context, i18n) {
    const isZohoDesk = context && (
        context.folder === "/09_operacao_zoho_desk" ||
        context.folder === "/09_zoho_desk"
    );

    return {
        sectionClass: isZohoDesk ? "is-zoho-desk" : "is-global-service",
        badgeText: isZohoDesk
            ? i18n.t("common.labels.epicZohoDesk", "Epico Zoho Desk")
            : i18n.t("common.labels.epicGlobalService", "Epico Global Service"),
        text: isZohoDesk
            ? i18n.t("common.contexts.zohoDeskModule", "Este modulo pertence ao epico Zoho Desk.")
            : i18n.t("common.contexts.globalServiceModule", "Este modulo pertence ao epico Global Service."),
        epicHref: isZohoDesk ? "../index.html#epic-zoho-desk" : "../index.html#epic-global-service",
        epicCta: isZohoDesk
            ? i18n.t("common.buttons.viewZohoDeskEpic", "Ver epico Zoho Desk")
            : i18n.t("common.buttons.viewGlobalServiceEpic", "Ver epico Global Service")
    };
}

function ensureEpicContextStrip(context) {
    const strip = document.querySelector(".epic-context-strip");
    if (!strip) return;
    strip.classList.add("compact-context-hidden");
}

function ensureInlineModuleContext(context) {
    const i18n = getI18n();
    const meta = getEpicContextMeta(context, i18n);

    const target =
        document.querySelector(".module-page .module-hero-content") ||
        document.querySelector(".module-page .hero-content") ||
        document.querySelector(".fluxo-module-hero-card") ||
        document.querySelector(".module-page .zd-hero .container") ||
        document.querySelector(".module-page main > section .container");

    if (!target) return;
    if (target.querySelector(".inline-context-label")) return;

    const label = document.createElement("span");
    label.className = "inline-context-label";
    label.textContent = meta.badgeText;

    target.insertAdjacentElement("afterbegin", label);
}

function normalizeModuleTopSection(context) {
    const main = document.querySelector("main");
    if (!main) return;
    if (document.querySelector(".module-hero, .fluxo-module-hero, .zd-hero")) return;

    const firstSection = main.querySelector(":scope > section");
    if (!firstSection) return;

    firstSection.classList.add("hero", "module-hero", "module-auto-hero");

    const container = firstSection.querySelector(":scope > .container") || firstSection.querySelector(".container");
    if (!container) return;
    if (container.querySelector(".zd-step-hero")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "module-hero-content module-auto-hero-content";

    while (container.firstChild) {
        wrapper.appendChild(container.firstChild);
    }
    container.appendChild(wrapper);

    normalizeLegacyBreadcrumb(wrapper);
    normalizeAutoHeroTitleHierarchy(wrapper);
    ensureModuleTopActions(wrapper, context);
}

function normalizeAutoHeroTitleHierarchy(wrapper) {
    if (!wrapper) return;

    const h1 = wrapper.querySelector("h1");
    const h2 = wrapper.querySelector("h2");
    if (h1 || !h2) return;

    const promoted = document.createElement("h1");
    promoted.textContent = h2.textContent || "";
    h2.replaceWith(promoted);
}

function normalizeLegacyBreadcrumb(wrapper) {
    if (!wrapper) return;

    const candidates = wrapper.querySelectorAll("p");
    const breadcrumb = Array.prototype.find.call(candidates, function (paragraph) {
        const text = (paragraph.textContent || "").trim();
        return text.indexOf(">") >= 0 && text.length < 160;
    });

    if (!breadcrumb) return;

    const strong = breadcrumb.querySelector("strong");
    if (strong && strong.textContent) {
        breadcrumb.textContent = strong.textContent.trim();
    }

    breadcrumb.classList.add("page-breadcrumb");
    wrapper.insertAdjacentElement("afterbegin", breadcrumb);
}

function ensureModuleTopActions(wrapper, context) {
    if (!wrapper) return;
    if (wrapper.querySelector(".module-cta-row, .hero-buttons")) return;

    const i18n = getI18n();
    const meta = getEpicContextMeta(context, i18n);

    const actionRow = document.createElement("div");
    actionRow.className = "module-cta-row hero-buttons auto-hero-actions";

    const moduleHome = document.createElement("a");
    setSanitizedHref(moduleHome, "index.html", "#");
    moduleHome.className = "btn-primary";
    moduleHome.textContent = i18n.t("common.buttons.backToModuleHome", "Voltar para home do modulo");

    const epicLink = document.createElement("a");
    setSanitizedHref(epicLink, meta.epicHref, "#");
    epicLink.className = "btn-secondary";
    epicLink.textContent = meta.epicCta;

    actionRow.appendChild(moduleHome);
    actionRow.appendChild(epicLink);
    wrapper.appendChild(actionRow);
}

function injectCompactLocalNav() {
    const main = document.querySelector("main");
    if (!main) return;
    if (document.querySelector(".internal-local-nav")) return;
    if (document.querySelector(".fluxo-module-nav, .navegacao-kpis")) return;

    const links = collectLocalNavLinks();
    if (links.length < 2) return;

    const navSection = document.createElement("section");
    navSection.className = "internal-local-nav";

    const container = document.createElement("div");
    container.className = "container";

    const title = document.createElement("p");
    title.className = "internal-local-nav-title";
    title.textContent = getI18n().t("common.ux.pageNavigation", "Navegação desta página");

    const list = document.createElement("div");
    list.className = "internal-local-nav-list";

    links.forEach(function (item) {
        const link = document.createElement("a");
        setSanitizedHref(link, item.href, "#");
        link.className = "internal-local-nav-link";
        link.textContent = item.label;
        if (item.absPath === normalizePath(window.location.pathname)) {
            link.setAttribute("aria-current", "page");
        }
        list.appendChild(link);
    });

    container.appendChild(title);
    container.appendChild(list);
    navSection.appendChild(container);

    const topSection = main.querySelector(":scope > .hero, :scope > .module-hero, :scope > .zd-hero, :scope > .fluxo-module-hero");
    if (topSection) {
        topSection.insertAdjacentElement("afterend", navSection);
        return;
    }

    main.insertAdjacentElement("afterbegin", navSection);
}

function collectLocalNavLinks() {
    const sourceLinks = document.querySelectorAll(
        "main .modules-grid a[href], main .module-pager a[href], main .ce-nav-grid a[href], main .final-nav a[href], main [data-step-nav] a[href]"
    );

    const seen = {};
    const items = [];
    const currentPath = normalizePath(window.location.pathname);

    sourceLinks.forEach(function (link) {
        const href = link.getAttribute("href");
        if (!href || href.indexOf("#") === 0) return;
        if (/^https?:/i.test(href)) return;

        const absPath = toAbsolutePath(href);
        if (!absPath || absPath.indexOf("/_archived/") >= 0) return;
        if (!absPath.endsWith(".html")) return;
        if (seen[absPath]) return;

        const label = (link.textContent || "").replace(/\s+/g, " ").trim();
        if (!label || label.length < 3) return;

        seen[absPath] = true;
        items.push({
            href: href,
            absPath: absPath,
            label: label
        });
    });

    items.sort(function (a, b) {
        if (a.absPath === currentPath) return -1;
        if (b.absPath === currentPath) return 1;
        return a.label.localeCompare(b.label);
    });

    return items.slice(0, 8);
}

function harmonizeHeroButtonRoles() {
    const actionRows = document.querySelectorAll(
        ".module-page .hero-buttons, .module-page .module-cta-row, .module-page .zd-hero-actions"
    );

    actionRows.forEach(function (row) {
        const links = row.querySelectorAll("a");
        if (!links.length) return;

        links.forEach(function (link, index) {
            if (link.closest(".header")) return;

            link.classList.remove("btn", "btn-module", "btn-primary", "btn-secondary", "btn-ghost");

            if (index === 0) {
                link.classList.add("btn-primary");
            } else if (index === 1) {
                link.classList.add("btn-secondary");
            } else {
                link.classList.add("btn-ghost");
            }
        });
    });
}

function normalizeModuleCtaVerbs() {
    const ctaLinks = document.querySelectorAll(
        ".module-page .modules a.btn-module, .module-page .about a.btn-module, .module-page .connection a.btn-module, .module-page .btn-link-like"
    );

    ctaLinks.forEach(function (link) {
        if (!link || !link.textContent) return;

        const rawText = link.textContent.trim();
        if (!rawText) return;
        if (/^voltar/i.test(rawText)) return;

        let normalized = rawText
            .replace(/^(ver|acessar|explorar|continuar|iniciar|comecar|executar|ir para)\s+/i, "Abrir ")
            .replace(/\s+/g, " ")
            .trim();

        if (/^abrir$/i.test(normalized)) {
            normalized = "Abrir pagina";
        }

        link.textContent = normalized;
    });
}

function getModuleContext(pathname) {
    const normalized = normalizePath(pathname || window.location.pathname);
    const contexts = [
        { folder: "/01_kpi" },
        { folder: "/02_kanban" },
        { folder: "/03_fluxo_global" },
        { folder: "/04_prioridade" },
        { folder: "/05_campos_obrigatorios" },
        { folder: "/06_governanca" },
        { folder: "/07_canais_de_entrada" },
        { folder: "/09_zoho_desk" },
        { folder: "/09_operacao_zoho_desk" }
    ];

    return contexts.find(function (context) {
        return normalized.indexOf(context.folder) >= 0;
    }) || null;
}

function collectInternalCandidates(context) {
    const currentPath = normalizePath(window.location.pathname);
    const seen = {};
    const candidates = [];

    const links = document.querySelectorAll("main a[href], .module-pager a[href], .module-nav-link[href], .fluxo-nav-link[href]");

    links.forEach(function (link) {
        const href = link.getAttribute("href");
        if (!href || href.indexOf("#") === 0) return;
        if (/^https?:/i.test(href)) return;

        const absPath = toAbsolutePath(href);
        if (!absPath || absPath === currentPath) return;
        if (absPath.indexOf("/_archived/") >= 0) return;
        if (!absPath.endsWith(".html")) return;
        if (seen[absPath]) return;

        const text = (link.textContent || "").trim();
        if (!text) return;

        seen[absPath] = true;
        candidates.push({
            href: href,
            label: text,
            absPath: absPath,
            score: getLinkPriority(link)
        });
    });

    if (context) {
        const homeHref = "index.html";
        const moduleHomeAbs = toAbsolutePath(homeHref);
        if (moduleHomeAbs && moduleHomeAbs !== currentPath && !seen[moduleHomeAbs]) {
            candidates.unshift({
                href: homeHref,
                label: getI18n().t("common.buttons.backToModuleHome", "Voltar para home do modulo"),
                absPath: moduleHomeAbs,
                score: 4
            });
        }
    }

    candidates.sort(function (a, b) {
        return b.score - a.score;
    });

    return candidates;
}

function getLinkPriority(link) {
    if (!link || !link.classList) return 1;
    if (link.classList.contains("btn-primary")) return 5;
    if (link.classList.contains("btn-module")) return 4;
    if (link.classList.contains("btn-secondary")) return 3;
    if (link.classList.contains("module-nav-link") || link.classList.contains("fluxo-nav-link")) return 2;
    return 1;
}

function shouldDisableWayfinder(pathname) {
    const body = document.body;
    if (body) {
        const explicitFlag = String(body.getAttribute("data-disable-wayfinder") || "").toLowerCase();
        if (explicitFlag === "true" || explicitFlag === "1" || explicitFlag === "yes") {
            return true;
        }
    }

    const normalized = normalizePath(pathname || window.location.pathname);
    return (
        normalized.endsWith("/03_fluxo_global/index.html") ||
        normalized.endsWith("/03_fluxo_global/regras-e-automacoes.html")
    );
}

function renderWayfinder(context, i18n) {
    const main = document.querySelector("main");
    const footer = document.querySelector("footer.footer");
    if (!main || !footer) return;
    if (document.querySelector(".ux-wayfinder")) return;

    const currentPath = normalizePath(window.location.pathname);
    if (shouldDisableWayfinder(currentPath)) return;
    if (currentPath.endsWith("/index.html") && !context) return;

    const candidates = collectInternalCandidates(context);
    if (!candidates.length) return;

    const next = candidates[0];
    const related = candidates.slice(1, 4);

    const section = document.createElement("section");
    section.className = "ux-wayfinder";

    const container = document.createElement("div");
    container.className = "container";

    const grid = document.createElement("div");
    grid.className = "ux-wayfinder-grid";

    const nextCard = document.createElement("article");
    nextCard.className = "ux-wayfinder-card is-next";

    const nextTitle = document.createElement("h3");
    nextTitle.textContent = i18n.t("common.ux.nextAction.title", "Próxima ação");
    nextCard.appendChild(nextTitle);

    const nextDescription = document.createElement("p");
    nextDescription.textContent = i18n.t("common.ux.nextAction.description", "Continue com a próxima etapa recomendada.");
    nextCard.appendChild(nextDescription);

    const nextLink = document.createElement("a");
    nextLink.className = "btn-module";
    setSanitizedHref(nextLink, next.href, "#");
    nextLink.textContent = next.label;
    nextCard.appendChild(nextLink);

    grid.appendChild(nextCard);

    if (related.length) {
        const relatedCard = document.createElement("article");
        relatedCard.className = "ux-wayfinder-card";
        const relatedTitle = document.createElement("h3");
        relatedTitle.textContent = i18n.t("common.ux.related.title", "Páginas relacionadas");
        relatedCard.appendChild(relatedTitle);

        const list = document.createElement("ul");
        list.className = "ux-related-list";
        related.forEach(function (item) {
            const li = document.createElement("li");
            const anchor = document.createElement("a");
            setSanitizedHref(anchor, item.href, "#");
            anchor.textContent = item.label;
            li.appendChild(anchor);
            list.appendChild(li);
        });

        relatedCard.appendChild(list);
        grid.appendChild(relatedCard);
    }

    container.appendChild(grid);
    section.appendChild(container);

    main.parentNode.insertBefore(section, footer);
}

function markCurrentLocalLinks() {
    const currentPath = normalizePath(window.location.pathname);
    const localLinks = document.querySelectorAll(
        ".module-nav-link[href], .fluxo-nav-link[href], .ce-nav-grid .btn-module[href], .modules-grid .btn-module[href], [data-step-nav] a[href], .nav a[href], .header-nav a[href]"
    );

    localLinks.forEach(function (link) {
        const href = link.getAttribute("href");
        if (!href || href.indexOf("#") === 0) return;

        const linkPath = toAbsolutePath(href);
        if (!linkPath) return;

        if (linkPath === currentPath) {
            link.setAttribute("aria-current", "page");
            link.classList.add("is-current");
        }
    });
}

function markPrimaryNavState() {
    const hash = window.location.hash || "";
    if (!hash) return;

    const mainNavLinks = document.querySelectorAll(".nav a[href^='#']");
    if (!mainNavLinks.length) return;

    mainNavLinks.forEach(function (link) {
        link.classList.remove("active");
        if (link.getAttribute("href") === hash) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
}

function applyWayfindingLayer() {
    const currentPath = normalizePath(window.location.pathname);
    if (currentPath.indexOf("/_archived/") >= 0) return;
    if (shouldDisableWayfinder(currentPath)) return;

    const i18n = getI18n();
    const context = getModuleContext(currentPath);
    renderWayfinder(context, i18n);
}

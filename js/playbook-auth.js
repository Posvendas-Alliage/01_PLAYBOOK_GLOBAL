(function () {
    window.__PlaybookAuthCentralLoaded = true;

    const SUPABASE_JS_URLS = [
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.75.1/dist/umd/supabase.min.js",
        "https://unpkg.com/@supabase/supabase-js@2.75.1/dist/umd/supabase.min.js"
    ];
    const SUPABASE_LIBRARY_LOAD_TIMEOUT_MS = 12000;
    const CLIENT_ACCESS_COOKIE = "pb_client_access";
    const PROFILE_TABLE = "playbook_profiles";
    const SUPPORTED_STATUSES = {
        pending: true,
        approved: true,
        rejected: true,
        suspended: true,
        Pendente: true,
        Aprovado: true,
        Recusado: true,
        Suspenso: true
    };

    let supabaseClient = null;
    let supabaseLibraryPromise = null;
    let cachedProfile = null;
    let cachedSession = null;
    let lastServerSessionSync = 0;
    let serverSessionSyncPromise = null;

    function findScriptSourceBySuffix(suffix) {
        const expected = "/" + suffix.replace(/^\//, "");
        const scripts = document.querySelectorAll("script[src]");

        for (let index = scripts.length - 1; index >= 0; index -= 1) {
            const src = scripts[index].src || "";
            if (!src) continue;
            const cleanSrc = src.split("#")[0].split("?")[0].replace(/\\/g, "/");
            if (cleanSrc.endsWith(expected)) return src;
        }

        return "";
    }

    function getRootBaseUrl() {
        const authScript = findScriptSourceBySuffix("js/playbook-auth.js");
        if (authScript) {
            try {
                return new URL("../", authScript).href;
            } catch (_error) {
                return "";
            }
        }

        const globalScript = findScriptSourceBySuffix("js/global.js");
        if (globalScript) {
            try {
                return new URL("../", globalScript).href;
            } catch (_error) {
                return "";
            }
        }

        return new URL("./", window.location.href).href;
    }

    function toRootUrl(path) {
        return new URL(path.replace(/^\//, ""), getRootBaseUrl()).href;
    }

    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            let finished = false;
            const existing = document.querySelector('script[data-playbook-supabase-js="' + src + '"]');
            const script = existing || document.createElement("script");

            const timeout = window.setTimeout(function () {
                if (finished) return;
                finished = true;
                if (!existing && script.parentNode) script.parentNode.removeChild(script);
                reject(new Error("Tempo excedido ao carregar Supabase JS."));
            }, SUPABASE_LIBRARY_LOAD_TIMEOUT_MS);

            function done(error) {
                if (finished) return;
                finished = true;
                window.clearTimeout(timeout);
                if (error) {
                    if (!existing && script.parentNode) script.parentNode.removeChild(script);
                    reject(error);
                    return;
                }
                resolve(window.supabase);
            }

            script.addEventListener("load", function () {
                if (window.supabase && typeof window.supabase.createClient === "function") {
                    done(null);
                    return;
                }
                done(new Error("Biblioteca Supabase indisponivel apos carregamento."));
            }, { once: true });

            script.addEventListener("error", function () {
                done(new Error("Falha ao carregar Supabase JS."));
            }, { once: true });

            if (!existing) {
                script.src = src;
                script.async = true;
                script.dataset.playbookSupabaseJs = src;
                (document.head || document.body || document.documentElement).appendChild(script);
            }
        });
    }

    async function loadSupabaseLibrary() {
        if (window.supabase && typeof window.supabase.createClient === "function") {
            return Promise.resolve(window.supabase);
        }

        if (supabaseLibraryPromise) return supabaseLibraryPromise;

        supabaseLibraryPromise = (async function () {
            let lastError = null;
            for (let index = 0; index < SUPABASE_JS_URLS.length; index += 1) {
                try {
                    const library = await loadScript(SUPABASE_JS_URLS[index]);
                    if (library && typeof library.createClient === "function") return library;
                } catch (error) {
                    lastError = error;
                }
            }
            throw lastError || new Error("Nao foi possivel carregar Supabase JS.");
        })();

        return supabaseLibraryPromise;
    }

    async function getClient() {
        if (supabaseClient) return supabaseClient;

        const library = await loadSupabaseLibrary();
        const url = window.SUPABASE_URL || "";
        const anonKey = window.SUPABASE_ANON_KEY || "";

        if (!url || !anonKey) {
            throw new Error("SUPABASE_URL / SUPABASE_ANON_KEY ausentes.");
        }

        supabaseClient = library.createClient(url, anonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                storage: window.sessionStorage
            }
        });

        supabaseClient.auth.onAuthStateChange(function (_event, session) {
            cachedSession = session || null;
            cachedProfile = null;
            syncAccessCookie(session);
        });

        return supabaseClient;
    }

    function getI18n() {
        return window.PlaybookI18n || {
            t: function (_key, fallback) { return fallback; }
        };
    }

    function t(key, fallback) {
        return getI18n().t(key, fallback);
    }

    function isLikelyNetlifyRuntime() {
        return window.location.protocol === "http:" || window.location.protocol === "https:";
    }

    function isLocalBrowser() {
        const host = window.location.hostname;
        return host === "localhost" || host === "127.0.0.1" || host === "";
    }

    function clientCookieOptions(maxAge) {
        const secure = isLocalBrowser() ? "" : "; Secure";
        return "Path=/; SameSite=Lax; Max-Age=" + maxAge + secure;
    }

    function syncClientAccessCookie(session) {
        if (!isLikelyNetlifyRuntime()) return;

        if (session && session.access_token) {
            const maxAge = Math.max(60, Math.min(Number(session.expires_in) || 3600, 3600));
            document.cookie = CLIENT_ACCESS_COOKIE + "=" + encodeURIComponent(session.access_token) + "; " + clientCookieOptions(maxAge);
            return;
        }

        document.cookie = CLIENT_ACCESS_COOKIE + "=; " + clientCookieOptions(0);
    }

    async function syncServerSession(session) {
        if (!isLikelyNetlifyRuntime()) return true;

        try {
            if (session && session.access_token && session.refresh_token) {
                syncClientAccessCookie(session);
                const now = Date.now();
                if (serverSessionSyncPromise && now - lastServerSessionSync < 2500) {
                    return serverSessionSyncPromise;
                }
                lastServerSessionSync = now;

                serverSessionSyncPromise = fetch("/api/auth/session", {
                        method: "POST",
                        credentials: "same-origin",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            access_token: session.access_token,
                            refresh_token: session.refresh_token,
                            expires_in: session.expires_in || 3600
                        })
                    })
                    .then(function (response) { return response.ok || isLocalBrowser(); })
                    .catch(function () { return true; });

                return serverSessionSyncPromise;
            }

            serverSessionSyncPromise = null;
            syncClientAccessCookie(null);
            const response = await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
            return response.ok || isLocalBrowser();
        } catch (_error) {
            // Netlify Functions are not available in every local/static preview.
            syncClientAccessCookie(session || null);
            return !!(session && session.access_token) || isLocalBrowser();
        }
    }

    function syncAccessCookie(session) {
        return syncServerSession(session || null);
    }

    async function validateServerSession() {
        if (!isLikelyNetlifyRuntime() || isLocalBrowser()) {
            return { ok: true };
        }

        try {
            const response = await fetch("/api/auth/session", {
                method: "GET",
                credentials: "same-origin",
                headers: { "Accept": "application/json" }
            });
            const payload = await response.json().catch(function () { return {}; });

            if (!response.ok || !payload || !payload.authenticated) {
                return {
                    ok: false,
                    reason: payload && payload.reason ? payload.reason : "missing_session"
                };
            }

            return {
                ok: true,
                user: payload.user || null,
                profile: payload.profile || null
            };
        } catch (_error) {
            return isLocalBrowser()
                ? { ok: true }
                : { ok: false, reason: "server_not_configured" };
        }
    }

    async function getSession() {
        const client = await getClient();
        const result = await client.auth.getSession();
        if (result.error) throw result.error;
        cachedSession = result.data.session || null;
        syncAccessCookie(cachedSession);
        return cachedSession;
    }

    async function getAccessToken() {
        const session = await getSession();
        return session ? session.access_token : "";
    }

    async function getUser() {
        const client = await getClient();
        const result = await client.auth.getUser();
        if (result.error) throw result.error;
        return result.data.user || null;
    }

    async function getProfile(options) {
        const settings = options || {};
        if (cachedProfile && !settings.forceRefresh) return cachedProfile;

        const user = settings.user || await getUser();
        if (!user) return null;

        const client = await getClient();
        const result = await client
            .from(PROFILE_TABLE)
            .select("user_id,email,role,status,force_password_change,created_at,updated_at,approved_at,approved_by,status_changed_at,status_changed_by")
            .eq("user_id", user.id)
            .maybeSingle();

        if (result.error) throw result.error;
        cachedProfile = result.data || null;
        return cachedProfile;
    }

    function isApproved(profile) {
        return !!profile && (profile.status === "Aprovado" || profile.status === "approved");
    }

    function isAdmin(profile) {
        return isApproved(profile) && profile.role === "admin";
    }

    function statusKey(profileOrStatus) {
        const status = typeof profileOrStatus === "string"
            ? profileOrStatus
            : profileOrStatus && profileOrStatus.status;

        const aliases = {
            Pendente: "pending",
            Aprovado: "approved",
            Recusado: "rejected",
            Rejeitado: "rejected",
            Suspenso: "suspended"
        };

        if (SUPPORTED_STATUSES[status]) return status;
        if (aliases[status]) return aliases[status];
        return "pending";
    }

    function currentReturnTo() {
        return window.location.pathname + window.location.search + window.location.hash;
    }

    function isSessionRecoveryReason(reason) {
        return reason === "missing_session" ||
            reason === "missing_user" ||
            reason === "invalid_session" ||
            reason === "profile_missing" ||
            reason === "missing_profile";
    }

    function canonicalPlaybookPath(pathname) {
        const path = String(pathname || "");
        const lowerPath = path.toLowerCase();

        if (lowerPath === "/01_kpi" || lowerPath === "/01_kpi/" || lowerPath === "/01_kpi/index.html") {
            return "/01_KPI/";
        }

        if (lowerPath === "/01_kpi/kpi_v2" || lowerPath === "/01_kpi/kpi_v2/") {
            return "/01_KPI/KPI_V2/";
        }

        if (lowerPath.indexOf("/01_kpi/kpi_v2/") === 0) {
            const rest = path.slice("/01_kpi/kpi_v2/".length);
            const hasExtension = /\.[a-z0-9]+$/i.test(rest);
            const normalizedRest = rest || "";
            if (!normalizedRest || normalizedRest.toLowerCase() === "index.html") return "/01_KPI/KPI_V2/";
            return "/01_KPI/KPI_V2/" + normalizedRest + (hasExtension || !normalizedRest ? "" : ".html");
        }

        if (lowerPath.indexOf("/01_kpi/") === 0) {
            return "/01_KPI/" + path.slice("/01_kpi/".length);
        }

        return path;
    }

    function canonicalReturnTo(rawValue) {
        try {
            const url = new URL(rawValue || currentReturnTo(), window.location.origin);
            url.pathname = canonicalPlaybookPath(url.pathname);
            return url.pathname + url.search + url.hash;
        } catch (_error) {
            return currentReturnTo();
        }
    }

    function sanitizeReturnTo(rawValue) {
        if (!rawValue) return toRootUrl("index.html");

        try {
            const url = new URL(rawValue, window.location.origin);
            if (url.origin !== window.location.origin) return toRootUrl("index.html");
            if (/\/(?:login|auth|alterar-senha)\.html$/i.test(url.pathname)) return toRootUrl("index.html");
            url.pathname = canonicalPlaybookPath(url.pathname);
            return url.href;
        } catch (_error) {
            return toRootUrl("index.html");
        }
    }

    function getReturnToFromUrl(fallback) {
        const params = new URLSearchParams(window.location.search);
        return sanitizeReturnTo(params.get("returnTo") || params.get("next") || fallback || toRootUrl("index.html"));
    }

    function redirectToLogin(reason) {
        const loginUrl = new URL(toRootUrl("login.html"));
        loginUrl.searchParams.set("returnTo", canonicalReturnTo(currentReturnTo()));
        if (reason) loginUrl.searchParams.set("reason", reason);
        if (isSessionRecoveryReason(reason)) loginUrl.searchParams.set("auto", "0");
        window.location.replace(loginUrl.href);
    }

    function redirectToPasswordChange(returnTo) {
        const url = new URL(toRootUrl("alterar-senha.html"));
        url.searchParams.set("returnTo", returnTo || currentReturnTo());
        url.searchParams.set("reason", "must_change_password");
        window.location.replace(url.href);
    }

    function revealPage() {
        document.documentElement.classList.remove("playbook-auth-pending");
        document.documentElement.classList.add("playbook-auth-ready");
    }

    function blockPage() {
        document.documentElement.classList.add("playbook-auth-pending");
    }

    function showFatalError(message) {
        revealPage();
        const wrapper = document.createElement("div");
        wrapper.className = "playbook-auth-fatal";
        wrapper.setAttribute("role", "alert");
        wrapper.innerHTML = ""
            + "<strong>" + t("security.errors.authUnavailableTitle", "Nao foi possivel validar o acesso.") + "</strong>"
            + "<p></p>";
        wrapper.querySelector("p").textContent = message || t(
            "security.errors.authUnavailable",
            "Atualize a pagina ou tente novamente em instantes."
        );
        document.body.prepend(wrapper);
    }

    function injectSecurityStyles() {
        const href = toRootUrl("css/security.css");
        if (document.querySelector('link[data-playbook-security-css="true"]')) return;

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.dataset.playbookSecurityCss = "true";
        (document.head || document.documentElement).appendChild(link);
    }

    function createUserMenu(profile, user) {
        const menu = document.createElement("div");
        menu.className = "playbook-user-menu";

        const summary = document.createElement("div");
        summary.className = "playbook-user-summary";

        const email = document.createElement("span");
        email.className = "playbook-user-email";
        email.textContent = (profile && profile.email) || (user && user.email) || t("security.user.account", "Conta");

        const role = document.createElement("span");
        role.className = "playbook-user-role";
        role.textContent = isAdmin(profile)
            ? t("security.user.admin", "Admin")
            : t("security.user.approved", "Aprovado");

        summary.appendChild(email);
        summary.appendChild(role);
        menu.appendChild(summary);

        if (isAdmin(profile)) {
            const adminLink = document.createElement("a");
            adminLink.href = toRootUrl("administracao-playbook.html");
            adminLink.className = "playbook-admin-link";
            adminLink.textContent = t("security.admin.nav", "Administracao");
            menu.appendChild(adminLink);
        }

        const logout = document.createElement("button");
        logout.type = "button";
        logout.className = "playbook-logout";
        logout.textContent = t("security.auth.logout", "Sair");
        logout.addEventListener("click", async function () {
            try {
                const client = await getClient();
                await client.auth.signOut();
            } finally {
                syncAccessCookie(null);
                window.location.replace(toRootUrl("login.html?reason=logout"));
            }
        });
        menu.appendChild(logout);

        return menu;
    }

    async function injectUserMenu(profile, user) {
        injectSecurityStyles();
        function mount() {
            if (document.getElementById("playbookUserMenu")) return;
            const target = document.querySelector(".app-header-actions")
                || document.querySelector(".header .header-content")
                || document.querySelector(".header-container")
                || document.querySelector("header");
            if (!target) return;

            const menu = createUserMenu(profile, user);
            menu.id = "playbookUserMenu";
            target.appendChild(menu);
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", mount, { once: true });
        } else {
            mount();
        }
    }

    async function completeInitialPasswordChange(password) {
        const session = await getSession();
        if (!session || !session.access_token) throw new Error("Sessao ausente.");

        const response = await fetch(window.SUPABASE_URL + "/functions/v1/playbook-admin", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + session.access_token,
                "apikey": window.SUPABASE_ANON_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "complete_password_change",
                password: String(password || "")
            })
        });
        const payload = await response.json().catch(function () { return {}; });
        if (!response.ok || !payload.success) {
            throw new Error(payload.error || "Nao foi possivel concluir a troca da senha inicial.");
        }

        const user = await getUser();
        cachedProfile = null;
        return getProfile({ user: user, forceRefresh: true });
    }

    async function signOutAndGoToLogin() {
        const client = await getClient();
        await client.auth.signOut();
        syncAccessCookie(null);
        window.location.replace(toRootUrl("login.html?reason=logout"));
    }

    window.PlaybookAuth = {
        getRootBaseUrl: getRootBaseUrl,
        toRootUrl: toRootUrl,
        getClient: getClient,
        getSession: getSession,
        getAccessToken: getAccessToken,
        getUser: getUser,
        getProfile: getProfile,
        isApproved: isApproved,
        isAdmin: isAdmin,
        statusKey: statusKey,
        currentReturnTo: currentReturnTo,
        sanitizeReturnTo: sanitizeReturnTo,
        getReturnToFromUrl: getReturnToFromUrl,
        redirectToLogin: redirectToLogin,
        redirectToPasswordChange: redirectToPasswordChange,
        revealPage: revealPage,
        blockPage: blockPage,
        showFatalError: showFatalError,
        injectSecurityStyles: injectSecurityStyles,
        injectUserMenu: injectUserMenu,
        completeInitialPasswordChange: completeInitialPasswordChange,
        signOutAndGoToLogin: signOutAndGoToLogin,
        syncAccessCookie: syncAccessCookie,
        validateServerSession: validateServerSession,
        t: t
    };
})();

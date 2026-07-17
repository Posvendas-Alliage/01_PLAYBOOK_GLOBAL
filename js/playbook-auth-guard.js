(function () {
    const KPI_AUTH_SESSION_KEY = "playbookKpiAuthRequired";

    function readBooleanFlag(value) {
        if (value === true) return true;
        const normalized = String(value || "").trim().toLowerCase();
        return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
    }

    function isKpiAuthRequired() {
        try {
            const params = new URLSearchParams(window.location.search || "");
            const paramValue = params.get("kpiAuth");
            if (readBooleanFlag(paramValue)) {
                window.sessionStorage.setItem(KPI_AUTH_SESSION_KEY, "1");
            } else if (paramValue === "0" || String(paramValue || "").toLowerCase() === "false") {
                window.sessionStorage.removeItem(KPI_AUTH_SESSION_KEY);
            }
        } catch (_error) {
            // Session storage can be unavailable; fall back to the global flag.
        }

        if (readBooleanFlag(window.PLAYBOOK_KPI_AUTH_REQUIRED)) return true;

        try {
            return window.sessionStorage.getItem(KPI_AUTH_SESSION_KEY) === "1";
        } catch (_error) {
            return false;
        }
    }
    function isPublicDashboardPath() {
        const path = String(window.location.pathname || "").toLowerCase();
        return path === "/01_kpi" ||
            path === "/01_kpi/" ||
            path === "/01_kpi/index.html" ||
            path === "/01_kpi/kpi_v2" ||
            path.indexOf("/01_kpi/kpi_v2/") === 0;
    }

    function revealPublicDashboard() {
        document.documentElement.classList.remove("playbook-auth-pending");
        document.documentElement.classList.add("playbook-auth-ready");
    }
    async function getServerSessionFallback() {
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
            return null;
        }
    }

    async function runGuard() {
        if (isPublicDashboardPath() && !isKpiAuthRequired()) {
            revealPublicDashboard();
            return;
        }
        const auth = window.PlaybookAuth;
        if (!auth) {
            document.documentElement.classList.remove("playbook-auth-pending");
            return;
        }

        auth.injectSecurityStyles();

        try {
            auth.blockPage();
            const session = await auth.getSession();
            let user = null;
            let profile = null;

            if (session) {
                user = await auth.getUser();
                if (!user) {
                    auth.redirectToLogin("missing_user");
                    return;
                }

                profile = await auth.getProfile({ user: user, forceRefresh: true });
            } else {
                const serverSession = await getServerSessionFallback();
                if (!serverSession || !serverSession.ok) {
                    const reason = serverSession && serverSession.reason ? serverSession.reason : "missing_session";
                    if (reason === "must_change_password") {
                        auth.redirectToPasswordChange(auth.currentReturnTo());
                    } else {
                        auth.redirectToLogin(reason);
                    }
                    return;
                }

                profile = serverSession.profile;
                user = serverSession.user || {
                    email: profile && profile.email ? profile.email : ""
                };
            }

            if (!profile) {
                auth.redirectToLogin("missing_profile");
                return;
            }

            if (!auth.isApproved(profile)) {
                auth.redirectToLogin(auth.statusKey(profile).toLowerCase());
                return;
            }

            const options = window.PLAYBOOK_AUTH_OPTIONS || {};
            if (options.requireAdmin && !auth.isAdmin(profile)) {
                const deniedUrl = new URL(auth.toRootUrl("index.html"));
                deniedUrl.searchParams.set("access", "denied");
                window.location.replace(deniedUrl.href);
                return;
            }

            if ((profile.must_change_password || profile.force_password_change) && !options.allowPasswordChangePage) {
                auth.redirectToPasswordChange(auth.currentReturnTo());
                return;
            }

            await auth.injectUserMenu(profile, user);
            auth.revealPage();
        } catch (error) {
            const message = error && error.message ? error.message : String(error);
            auth.showFatalError(message);
        }
    }

    runGuard();
})();

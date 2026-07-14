(function () {
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

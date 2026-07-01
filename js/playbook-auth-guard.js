(function () {
    function isTemporaryPublicDashboard() {
        const path = String(window.location.pathname || "").toLowerCase();
        return path === "/01_kpi/kpi_v2" || path.indexOf("/01_kpi/kpi_v2/") === 0;
    }

    function revealPublicDashboard() {
        document.documentElement.classList.remove("playbook-auth-pending");
        document.documentElement.classList.add("playbook-auth-ready");
    }

    async function runGuard() {
        if (isTemporaryPublicDashboard()) {
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
            if (!session) {
                auth.redirectToLogin("missing_session");
                return;
            }

            const user = await auth.getUser();
            if (!user) {
                auth.redirectToLogin("missing_user");
                return;
            }

            const profile = await auth.getProfile({ user: user, forceRefresh: true });
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

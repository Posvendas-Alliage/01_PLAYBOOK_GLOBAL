(function () {
    if (window.__PlaybookAuthCentralLoaded) return;
    window.__PlaybookAuthCentralLoaded = true;

    const SUPABASE_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    const STATUS_LABELS = {
        pending: { pt: "Pendente", en: "Pending", es: "Pendiente" },
        approved: { pt: "Aprovado", en: "Approved", es: "Aprobado" },
        rejected: { pt: "Recusado", en: "Rejected", es: "Rechazado" },
        suspended: { pt: "Suspenso", en: "Suspended", es: "Suspendido" }
    };

    const COPY = {
        "pt-BR": {
            invalidCredentials: "E-mail ou senha inválidos.",
            pending: "Seu cadastro está pendente e aguarda aprovação administrativa.",
            rejected: "Seu cadastro foi recusado. Procure a administração do Playbook.",
            suspended: "Seu acesso está suspenso. Procure a administração do Playbook.",
            profileMissing: "Perfil do Playbook não encontrado. Procure a administração.",
            loginSuccess: "Login realizado. Redirecionando...",
            registerSuccess: "Cadastro enviado. Aguarde a aprovação administrativa antes de acessar o Playbook.",
            resetSuccess: "Se o e-mail estiver cadastrado, enviaremos instruções de recuperação.",
            passwordChanged: "Senha alterada com sucesso. Entre novamente com a nova senha.",
            forcePasswordChange: "Troque a senha inicial antes de acessar o Playbook.",
            passwordMismatch: "A confirmação da senha não confere.",
            passwordWeak: "Use 12 ou mais caracteres, com maiúscula, minúscula, número e símbolo.",
            emailInvalid: "Informe um e-mail válido.",
            sessionMissing: "Faça login para acessar o Playbook.",
            adminRequired: "Somente administradores aprovados podem acessar esta página.",
            logout: "Sair",
            admin: "Administração",
            loadingUsers: "Carregando usuários...",
            emptyUsers: "Nenhum usuário encontrado.",
            confirmStatus: "Confirmar alteração de status para {status}?",
            statusChanged: "Status atualizado com sucesso."
        },
        en: {
            invalidCredentials: "Invalid email or password.",
            pending: "Your registration is pending administrative approval.",
            rejected: "Your registration was rejected. Contact the Playbook administrator.",
            suspended: "Your access is suspended. Contact the Playbook administrator.",
            profileMissing: "Playbook profile not found. Contact the administrator.",
            loginSuccess: "Signed in. Redirecting...",
            registerSuccess: "Registration submitted. Wait for administrative approval before accessing the Playbook.",
            resetSuccess: "If the email is registered, recovery instructions will be sent.",
            passwordChanged: "Password changed successfully. Sign in again with the new password.",
            forcePasswordChange: "Change the initial password before accessing the Playbook.",
            passwordMismatch: "Password confirmation does not match.",
            passwordWeak: "Use 12 or more characters with uppercase, lowercase, number, and symbol.",
            emailInvalid: "Enter a valid email address.",
            sessionMissing: "Sign in to access the Playbook.",
            adminRequired: "Only approved administrators can access this page.",
            logout: "Sign out",
            admin: "Administration",
            loadingUsers: "Loading users...",
            emptyUsers: "No users found.",
            confirmStatus: "Confirm status change to {status}?",
            statusChanged: "Status updated successfully."
        },
        es: {
            invalidCredentials: "E-mail o contraseña inválidos.",
            pending: "Tu registro está pendiente de aprobación administrativa.",
            rejected: "Tu registro fue rechazado. Contacta a la administración del Playbook.",
            suspended: "Tu acceso está suspendido. Contacta a la administración del Playbook.",
            profileMissing: "Perfil del Playbook no encontrado. Contacta a la administración.",
            loginSuccess: "Inicio de sesión realizado. Redirigiendo...",
            registerSuccess: "Registro enviado. Espera la aprobación administrativa antes de acceder al Playbook.",
            resetSuccess: "Si el e-mail está registrado, enviaremos instrucciones de recuperación.",
            passwordChanged: "Contraseña cambiada con éxito. Ingresa nuevamente con la nueva contraseña.",
            forcePasswordChange: "Cambia la contraseña inicial antes de acceder al Playbook.",
            passwordMismatch: "La confirmación de contraseña no coincide.",
            passwordWeak: "Usa 12 o más caracteres con mayúscula, minúscula, número y símbolo.",
            emailInvalid: "Ingresa un e-mail válido.",
            sessionMissing: "Inicia sesión para acceder al Playbook.",
            adminRequired: "Solo administradores aprobados pueden acceder a esta página.",
            logout: "Salir",
            admin: "Administración",
            loadingUsers: "Cargando usuarios...",
            emptyUsers: "No se encontraron usuarios.",
            confirmStatus: "¿Confirmar cambio de estado a {status}?",
            statusChanged: "Estado actualizado con éxito."
        }
    };

    let supabaseClient = null;
    let currentProfile = null;
    let currentUser = null;

    function getLocale() {
        if (window.PlaybookI18n && typeof window.PlaybookI18n.getLocale === "function") {
            return window.PlaybookI18n.getLocale();
        }
        const dashboardLang = window.localStorage.getItem("dashboard_lang");
        if (dashboardLang === "pt") return "pt-BR";
        if (dashboardLang === "es" || dashboardLang === "en") return dashboardLang;
        return window.localStorage.getItem("playbookLocale") || "pt-BR";
    }

    function shortLocale() {
        const locale = getLocale();
        if (locale.indexOf("es") === 0) return "es";
        if (locale.indexOf("en") === 0) return "en";
        return "pt";
    }

    function tx(key, fallback) {
        if (window.PlaybookI18n && typeof window.PlaybookI18n.t === "function") {
            const translated = window.PlaybookI18n.t("security.messages." + key);
            if (translated !== undefined) return translated;
        }
        const locale = getLocale();
        return (COPY[locale] && COPY[locale][key]) ||
            (COPY[shortLocale()] && COPY[shortLocale()][key]) ||
            COPY["pt-BR"][key] ||
            fallback ||
            key;
    }

    function statusLabel(status) {
        const labels = STATUS_LABELS[status] || {};
        return labels[shortLocale()] || labels.pt || status;
    }

    function rootBaseUrl() {
        const scripts = document.querySelectorAll("script[src]");
        for (let index = scripts.length - 1; index >= 0; index -= 1) {
            const src = scripts[index].src || "";
            if (src.split("?")[0].split("#")[0].endsWith("/js/auth.js")) {
                return new URL("../", src).href;
            }
        }
        return new URL("/", window.location.origin).href;
    }

    function rootUrl(path) {
        return new URL(path.replace(/^\//, ""), rootBaseUrl()).href;
    }

    function ensureAuthStylesheet() {
        const existing = Array.prototype.some.call(document.querySelectorAll("link[rel='stylesheet'][href]"), function (link) {
            return (link.href || "").split("?")[0].endsWith("/css/auth.css");
        });
        if (existing) return;

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = rootUrl("css/auth.css");
        document.head.appendChild(link);
    }

    function loginUrl(reason, mode) {
        const url = new URL(rootUrl("auth.html"));
        url.searchParams.set("next", window.location.pathname + window.location.search + window.location.hash);
        if (reason) url.searchParams.set("reason", reason);
        if (mode) url.searchParams.set("mode", mode);
        return url.href;
    }

    function safeNextUrl() {
        const params = new URLSearchParams(window.location.search);
        const raw = params.get("next") || "/";
        try {
            const next = new URL(raw, window.location.origin);
            if (next.origin !== window.location.origin) return rootUrl("index.html");
            return next.pathname + next.search + next.hash;
        } catch (_error) {
            return rootUrl("index.html");
        }
    }

    function redirectToAuth(reason, mode) {
        window.location.replace(loginUrl(reason, mode));
    }

    function redirectAfterLogin() {
        const next = safeNextUrl();
        window.location.replace(next || rootUrl("index.html"));
    }

    function isEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
    }

    function validatePassword(password) {
        const value = String(password || "");
        return value.length >= 12 && value.length <= 128 &&
            /[a-z]/.test(value) &&
            /[A-Z]/.test(value) &&
            /[0-9]/.test(value) &&
            /[^A-Za-z0-9]/.test(value);
    }

    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            const existing = Array.prototype.find.call(document.scripts, function (script) {
                return script.src === src;
            });
            if (existing) {
                existing.addEventListener("load", resolve, { once: true });
                if (window.supabase) resolve();
                return;
            }

            const script = document.createElement("script");
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function ensureSupabaseClient() {
        if (supabaseClient) return supabaseClient;

        if (!window.supabase) {
            await loadScript(SUPABASE_CDN);
        }

        if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
            throw new Error("SUPABASE_URL / SUPABASE_ANON_KEY ausentes.");
        }

        supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });

        return supabaseClient;
    }

    async function getSession() {
        const client = await ensureSupabaseClient();
        const result = await client.auth.getSession();
        return result.data && result.data.session ? result.data.session : null;
    }

    async function syncServerSession(session) {
        if (!session || !session.access_token || !session.refresh_token) return;

        const response = await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                access_token: session.access_token,
                refresh_token: session.refresh_token,
                expires_in: session.expires_in
            })
        });

        if (!response.ok) {
            throw new Error("Nao foi possivel sincronizar cookie seguro da sessao.");
        }
    }

    async function clearServerSession() {
        await fetch("/api/auth/logout", { method: "POST", keepalive: true }).catch(function () {});
    }

    async function fetchProfile(userId) {
        const client = await ensureSupabaseClient();
        const result = await client
            .from("playbook_profiles")
            .select("user_id,email,role,status,force_password_change,approved_by,approved_at,status_changed_by,status_changed_at,created_at,updated_at")
            .eq("user_id", userId)
            .maybeSingle();

        if (result.error) throw result.error;
        return result.data || null;
    }

    function showMessage(target, text, kind) {
        if (!target) return;
        target.textContent = text || "";
        target.className = "auth-message";
        if (text) target.classList.add("is-visible");
        if (kind) target.classList.add("is-" + kind);
    }

    function pageMessage() {
        return document.getElementById("authMessage") || document.getElementById("adminMessage");
    }

    async function signOutAndClear() {
        const client = await ensureSupabaseClient();
        await client.auth.signOut().catch(function () {});
        await clearServerSession();
        currentProfile = null;
        currentUser = null;
    }

    async function logout() {
        await signOutAndClear();
        window.location.replace(rootUrl("auth.html?reason=logout"));
    }

    function profileAccessError(profile) {
        if (!profile) return "profileMissing";
        if (profile.status === "pending") return "pending";
        if (profile.status === "rejected") return "rejected";
        if (profile.status === "suspended") return "suspended";
        if (profile.force_password_change) return "forcePasswordChange";
        return "";
    }

    async function loadApprovedContext(options) {
        const settings = options || {};
        const session = await getSession();

        if (!session || !session.user) {
            if (settings.redirect !== false) redirectToAuth("missing_session");
            return null;
        }

        await syncServerSession(session).catch(function () {});
        const profile = await fetchProfile(session.user.id);
        const errorKey = profileAccessError(profile);

        if (errorKey) {
            if (errorKey === "forcePasswordChange") {
                if (settings.redirect !== false) redirectToAuth("force_password_change", "change-password");
                return null;
            }

            if (settings.redirect !== false) {
                await signOutAndClear();
                redirectToAuth(profile ? profile.status : "profile_missing");
            }
            return { session: session, profile: profile, errorKey: errorKey };
        }

        if (settings.adminOnly && profile.role !== "admin") {
            if (settings.redirect !== false) redirectToAuth("admin_required");
            return { session: session, profile: profile, errorKey: "adminRequired" };
        }

        currentProfile = profile;
        currentUser = session.user;
        return { session: session, profile: profile, errorKey: "" };
    }

    function injectUserMenu(profile) {
        if (!profile || document.getElementById("playbookAuthMenu")) return;

        const target =
            document.querySelector(".app-header-actions") ||
            document.querySelector(".header .header-content") ||
            document.querySelector(".header .header-container");

        if (!target) return;

        const menu = document.createElement("div");
        menu.id = "playbookAuthMenu";
        menu.className = "playbook-auth-menu";

        const email = document.createElement("span");
        email.className = "playbook-auth-email";
        email.textContent = profile.email || "";
        menu.appendChild(email);

        if (profile.role === "admin") {
            const admin = document.createElement("a");
            admin.href = rootUrl("administracao-playbook.html");
            admin.className = "playbook-auth-admin-link";
            admin.textContent = tx("admin", "Administração");
            menu.appendChild(admin);
        }

        const button = document.createElement("button");
        button.type = "button";
        button.className = "playbook-auth-logout";
        button.textContent = tx("logout", "Sair");
        button.addEventListener("click", logout);
        menu.appendChild(button);

        target.appendChild(menu);
    }

    function setAuthMode(mode) {
        const selected = mode || "login";
        document.querySelectorAll("[data-auth-form]").forEach(function (form) {
            form.hidden = form.getAttribute("data-auth-form") !== selected;
        });
        document.querySelectorAll("[data-auth-mode]").forEach(function (button) {
            button.classList.toggle("is-active", button.getAttribute("data-auth-mode") === selected);
        });
    }

    function reasonToMessage(reason) {
        const map = {
            pending: "pending",
            rejected: "rejected",
            suspended: "suspended",
            force_password_change: "forcePasswordChange",
            admin_required: "adminRequired",
            missing_session: "sessionMissing",
            invalid_session: "sessionMissing",
            profile_missing: "profileMissing"
        };
        return map[reason] || "";
    }

    async function handleLogin(event) {
        event.preventDefault();
        const message = pageMessage();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!isEmail(email)) {
            showMessage(message, tx("emailInvalid"), "error");
            return;
        }

        const client = await ensureSupabaseClient();
        const result = await client.auth.signInWithPassword({ email: email, password: password });

        if (result.error || !result.data.session) {
            showMessage(message, tx("invalidCredentials"), "error");
            return;
        }

        try {
            await syncServerSession(result.data.session);
            const profile = await fetchProfile(result.data.session.user.id);
            const accessError = profileAccessError(profile);

            if (accessError && accessError !== "forcePasswordChange") {
                await signOutAndClear();
                showMessage(message, tx(accessError), accessError === "pending" ? "warning" : "error");
                return;
            }

            if (accessError === "forcePasswordChange") {
                currentUser = result.data.session.user;
                currentProfile = profile;
                setAuthMode("change-password");
                showMessage(message, tx("forcePasswordChange"), "warning");
                return;
            }

            showMessage(message, tx("loginSuccess"), "success");
            redirectAfterLogin();
        } catch (error) {
            showMessage(message, error.message || tx("invalidCredentials"), "error");
        }
    }

    async function handleRegister(event) {
        event.preventDefault();
        const message = pageMessage();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirm = document.getElementById("registerPasswordConfirm").value;

        if (!isEmail(email)) {
            showMessage(message, tx("emailInvalid"), "error");
            return;
        }

        if (password !== confirm) {
            showMessage(message, tx("passwordMismatch"), "error");
            return;
        }

        if (!validatePassword(password)) {
            showMessage(message, tx("passwordWeak"), "error");
            return;
        }

        const client = await ensureSupabaseClient();
        const result = await client.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: rootUrl("auth.html?mode=login")
            }
        });

        if (result.error) {
            showMessage(message, result.error.message || tx("invalidCredentials"), "error");
            return;
        }

        await signOutAndClear();
        showMessage(message, tx("registerSuccess"), "success");
        setAuthMode("login");
    }

    async function handleReset(event) {
        event.preventDefault();
        const message = pageMessage();
        const email = document.getElementById("resetEmail").value.trim();

        if (!isEmail(email)) {
            showMessage(message, tx("emailInvalid"), "error");
            return;
        }

        const client = await ensureSupabaseClient();
        const result = await client.auth.resetPasswordForEmail(email, {
            redirectTo: rootUrl("auth.html?mode=change-password")
        });

        if (result.error) {
            showMessage(message, result.error.message, "error");
            return;
        }

        showMessage(message, tx("resetSuccess"), "success");
    }

    async function callPlaybookAdmin(payload) {
        const session = await getSession();
        if (!session) throw new Error(tx("sessionMissing"));

        const response = await fetch(window.SUPABASE_URL + "/functions/v1/playbook-admin", {
            method: "POST",
            headers: {
                apikey: window.SUPABASE_ANON_KEY,
                Authorization: "Bearer " + session.access_token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json().catch(function () { return {}; });
        if (!response.ok || data.success === false) {
            throw new Error(data.error || "Erro administrativo.");
        }
        return data;
    }

    async function handleChangePassword(event) {
        event.preventDefault();
        const message = pageMessage();
        const password = document.getElementById("changePassword").value;
        const confirm = document.getElementById("changePasswordConfirm").value;

        if (password !== confirm) {
            showMessage(message, tx("passwordMismatch"), "error");
            return;
        }

        if (!validatePassword(password)) {
            showMessage(message, tx("passwordWeak"), "error");
            return;
        }

        try {
            await callPlaybookAdmin({
                action: "complete_password_change",
                password: password
            });
            await signOutAndClear();
            showMessage(message, tx("passwordChanged"), "success");
            setAuthMode("login");
        } catch (error) {
            showMessage(message, error.message, "error");
        }
    }

    async function setupAuthPage() {
        const params = new URLSearchParams(window.location.search);
        const mode = params.get("mode") || "login";
        const reason = params.get("reason");
        setAuthMode(mode);

        document.querySelectorAll("[data-auth-mode]").forEach(function (button) {
            button.addEventListener("click", function () {
                setAuthMode(button.getAttribute("data-auth-mode"));
                showMessage(pageMessage(), "");
            });
        });

        document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
        document.getElementById("registerForm")?.addEventListener("submit", handleRegister);
        document.getElementById("resetForm")?.addEventListener("submit", handleReset);
        document.getElementById("changePasswordForm")?.addEventListener("submit", handleChangePassword);

        const messageKey = reasonToMessage(reason);
        if (messageKey) {
            showMessage(pageMessage(), tx(messageKey), messageKey === "pending" ? "warning" : "error");
        }

        await ensureSupabaseClient();
        if (mode !== "change-password") {
            const context = await loadApprovedContext({ redirect: false });
            if (context && context.profile && !context.errorKey) {
                redirectAfterLogin();
            }
        }
    }

    function formatDate(value) {
        if (!value) return "--";
        try {
            return new Intl.DateTimeFormat(getLocale(), {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }).format(new Date(value));
        } catch (_error) {
            return "--";
        }
    }

    function actionButton(label, status, userId) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn-secondary";
        button.textContent = label;
        button.dataset.status = status;
        button.dataset.userId = userId;
        return button;
    }

    function renderAdminUsers(users) {
        const tbody = document.getElementById("adminUsersBody");
        const empty = document.getElementById("adminEmpty");
        const loading = document.getElementById("adminLoading");
        if (!tbody) return;

        tbody.textContent = "";
        if (loading) loading.classList.remove("is-visible");
        if (empty) empty.classList.toggle("is-visible", !users.length);

        users.forEach(function (user) {
            const row = document.createElement("tr");
            const isSelf = currentUser && currentUser.id === user.user_id;

            const email = document.createElement("td");
            email.textContent = user.email || "--";
            row.appendChild(email);

            const created = document.createElement("td");
            created.textContent = formatDate(user.created_at);
            row.appendChild(created);

            const status = document.createElement("td");
            const pill = document.createElement("span");
            pill.className = "auth-status-pill";
            pill.dataset.status = user.status;
            pill.textContent = statusLabel(user.status);
            status.appendChild(pill);
            row.appendChild(status);

            const role = document.createElement("td");
            role.textContent = user.role === "admin" ? "Admin" : "User";
            row.appendChild(role);

            const updated = document.createElement("td");
            updated.textContent = formatDate(user.status_changed_at || user.updated_at);
            row.appendChild(updated);

            const actions = document.createElement("td");
            const actionRow = document.createElement("div");
            actionRow.className = "auth-action-row";

            if (!isSelf) {
                if (user.status !== "approved") {
                    actionRow.appendChild(actionButton(statusLabel("approved"), "approved", user.user_id));
                }
                if (user.status === "pending") {
                    actionRow.appendChild(actionButton(statusLabel("rejected"), "rejected", user.user_id));
                }
                if (user.status === "approved") {
                    actionRow.appendChild(actionButton(statusLabel("suspended"), "suspended", user.user_id));
                }
            } else {
                const selfNote = document.createElement("span");
                selfNote.className = "auth-hint";
                selfNote.textContent = "Self";
                actionRow.appendChild(selfNote);
            }

            actions.appendChild(actionRow);
            row.appendChild(actions);
            tbody.appendChild(row);
        });
    }

    async function loadAdminUsers() {
        const loading = document.getElementById("adminLoading");
        if (loading) {
            loading.textContent = tx("loadingUsers");
            loading.classList.add("is-visible");
        }

        const search = document.getElementById("adminSearch")?.value || "";
        const status = document.getElementById("adminStatusFilter")?.value || "";
        const data = await callPlaybookAdmin({
            action: "list_users",
            search: search,
            status: status
        });
        renderAdminUsers(data.users || []);
    }

    async function setupAdminPage() {
        const context = await loadApprovedContext({ adminOnly: true, redirect: true });
        if (!context || context.errorKey) return;
        injectUserMenu(context.profile);

        document.getElementById("adminFilters")?.addEventListener("submit", function (event) {
            event.preventDefault();
            loadAdminUsers().catch(function (error) {
                showMessage(pageMessage(), error.message, "error");
            });
        });

        document.getElementById("adminUsersBody")?.addEventListener("click", async function (event) {
            const button = event.target.closest("button[data-status][data-user-id]");
            if (!button) return;

            const nextStatus = button.dataset.status;
            const label = statusLabel(nextStatus);
            const confirmation = tx("confirmStatus").replace("{status}", label);
            if (!window.confirm(confirmation)) return;

            try {
                await callPlaybookAdmin({
                    action: "set_status",
                    user_id: button.dataset.userId,
                    status: nextStatus
                });
                showMessage(pageMessage(), tx("statusChanged"), "success");
                await loadAdminUsers();
            } catch (error) {
                showMessage(pageMessage(), error.message, "error");
            }
        });

        await loadAdminUsers().catch(function (error) {
            showMessage(pageMessage(), error.message, "error");
        });
    }

    async function setupProtectedPage() {
        const context = await loadApprovedContext({
            adminOnly: document.body && document.body.dataset.requiresAdmin === "true",
            redirect: true
        });

        if (context && context.profile && !context.errorKey) {
            injectUserMenu(context.profile);
        }
    }

    async function getAccessToken() {
        const session = await getSession();
        if (!session) return "";
        await syncServerSession(session).catch(function () {});
        return session.access_token || "";
    }

    async function bootstrap() {
        try {
            ensureAuthStylesheet();

            if (document.body && document.body.dataset.authPage === "true") {
                await setupAuthPage();
                return;
            }

            if (document.body && document.body.dataset.requiresAdmin === "true") {
                await setupAdminPage();
                return;
            }

            await setupProtectedPage();
        } catch (error) {
            if (document.body && document.body.dataset.authPage === "true") {
                showMessage(pageMessage(), error.message, "error");
            } else {
                redirectToAuth("invalid_session");
            }
        }
    }

    window.PlaybookAuth = {
        getClient: ensureSupabaseClient,
        getAccessToken: getAccessToken,
        getProfile: function () { return currentProfile; },
        logout: logout,
        requireApproved: loadApprovedContext,
        callAdmin: callPlaybookAdmin
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootstrap);
    } else {
        bootstrap();
    }
})();

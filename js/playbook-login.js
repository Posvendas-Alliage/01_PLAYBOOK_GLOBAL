(function () {
    const auth = window.PlaybookAuth;
    if (!auth) return;

    const messageBox = document.getElementById("authMessage");
    const tabs = Array.prototype.slice.call(document.querySelectorAll(".auth-tabs [data-auth-mode]"));
    const modeTriggers = Array.prototype.slice.call(document.querySelectorAll("[data-mode-trigger]"));
    const forms = Array.prototype.slice.call(document.querySelectorAll("[data-auth-form]"));
    const passwordToggles = Array.prototype.slice.call(document.querySelectorAll("[data-password-toggle]"));
    let loginAttemptId = 0;
    const REDIRECT_GUARD_KEY = "playbookLoginRedirectGuard";
    const REDIRECT_GUARD_WINDOW_MS = 30000;
    const AUTO_REDIRECT_BLOCK_REASONS = {
        missing_session: true,
        missing_user: true,
        invalid_session: true,
        profile_missing: true,
        server_not_configured: true
    };

    function withTimeout(promise, timeoutMs, message) {
        return new Promise(function (resolve, reject) {
            const timeout = window.setTimeout(function () {
                const error = new Error(message || "Tempo excedido.");
                error.code = "playbook_timeout";
                reject(error);
            }, timeoutMs);

            Promise.resolve(promise).then(function (value) {
                window.clearTimeout(timeout);
                resolve(value);
            }).catch(function (error) {
                window.clearTimeout(timeout);
                reject(error);
            });
        });
    }

    function tr(key, fallback) {
        return auth.t(key, fallback);
    }

    function showMessage(text, type) {
        if (!messageBox) return;
        messageBox.textContent = text || "";
        messageBox.classList.remove("is-error", "is-success", "is-warning", "is-visible");
        messageBox.hidden = !text;
        if (!text) return;
        messageBox.classList.add("is-visible");
        if (type) messageBox.classList.add("is-" + type);
    }

    function setBusy(form, busy) {
        if (!form) return;
        Array.prototype.forEach.call(form.querySelectorAll("button, input"), function (element) {
            element.disabled = !!busy;
        });
    }

    function isEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
    }

    function passwordRuleState(password) {
        const value = String(password || "");
        return {
            length: value.length >= 12,
            upper: /[A-Z]/.test(value),
            lower: /[a-z]/.test(value),
            number: /[0-9]/.test(value),
            symbol: /[^A-Za-z0-9]/.test(value)
        };
    }

    function validatePassword(password) {
        const rules = passwordRuleState(password);
        return Object.keys(rules).every(function (key) { return rules[key]; });
    }

    function renderPasswordRules(input, container) {
        if (!input || !container) return;
        const rules = passwordRuleState(input.value);
        Object.keys(rules).forEach(function (key) {
            const item = container.querySelector('[data-password-rule="' + key + '"]');
            if (item) item.classList.toggle("is-met", rules[key]);
        });
    }

    function setupPasswordToggles() {
        passwordToggles.forEach(function (button) {
            button.addEventListener("click", function () {
                const input = document.getElementById(button.dataset.passwordToggle);
                if (!input) return;
                const showing = input.type === "text";
                input.type = showing ? "password" : "text";
                button.setAttribute("aria-pressed", showing ? "false" : "true");
                button.textContent = showing
                    ? tr("security.auth.actions.showPassword", "Mostrar")
                    : tr("security.auth.actions.hidePassword", "Ocultar");
                input.focus();
            });
        });
    }

    function copyKnownEmail(selected) {
        const loginEmail = document.getElementById("loginEmail");
        const registerEmail = document.getElementById("registerEmail");
        const resetEmail = document.getElementById("resetEmail");
        const knownEmail = loginEmail && isEmail(loginEmail.value)
            ? loginEmail.value.trim()
            : "";

        if (selected === "register" && registerEmail && !registerEmail.value && knownEmail) {
            registerEmail.value = knownEmail;
        }
        if (selected === "reset" && resetEmail && !resetEmail.value && knownEmail) {
            resetEmail.value = knownEmail;
        }
    }

    function activateMode(mode, options) {
        const selected = mode === "register" || mode === "reset" ? mode : "login";
        forms.forEach(function (form) {
            const active = form.dataset.authForm === selected;
            form.hidden = !active;
            form.setAttribute("aria-hidden", active ? "false" : "true");
        });
        tabs.forEach(function (tab) {
            const active = tab.dataset.authMode === selected;
            tab.classList.toggle("is-active", active);
            tab.setAttribute("aria-selected", active ? "true" : "false");
            tab.tabIndex = active ? 0 : -1;
        });
        copyKnownEmail(selected);

        if (options && options.clearMessage) showMessage("", "");
        if (options && options.focus) {
            const activeForm = forms.find(function (form) {
                return form.dataset.authForm === selected;
            });
            const firstField = activeForm && activeForm.querySelector("input");
            if (firstField) window.setTimeout(function () { firstField.focus(); }, 60);
        }
    }

    function messageForReason(reason) {
        const normalized = String(reason || "").toLowerCase();
        const messages = {
            missing_session: ["security.messages.sessionMissing", "Faca login para acessar o Playbook.", "warning"],
            missing_user: ["security.messages.sessionMissing", "Faca login para acessar o Playbook.", "warning"],
            invalid_session: ["security.messages.sessionMissing", "Sua sessao expirou. Faca login novamente.", "warning"],
            profile_missing: ["security.messages.profileMissing", "Perfil do Playbook nao encontrado. Procure a administracao.", "error"],
            pending: ["security.messages.pending", "Seu cadastro esta pendente e aguarda aprovacao administrativa.", "warning"],
            pendente: ["security.messages.pending", "Seu cadastro esta pendente e aguarda aprovacao administrativa.", "warning"],
            rejected: ["security.messages.rejected", "Seu cadastro foi recusado. Procure a administracao do Playbook.", "error"],
            recusado: ["security.messages.rejected", "Seu cadastro foi recusado. Procure a administracao do Playbook.", "error"],
            suspended: ["security.messages.suspended", "Seu acesso esta suspenso. Procure a administracao do Playbook.", "error"],
            suspenso: ["security.messages.suspended", "Seu acesso esta suspenso. Procure a administracao do Playbook.", "error"],
            not_approved: ["security.messages.pending", "Seu acesso ainda nao esta aprovado.", "warning"],
            admin_required: ["security.messages.adminRequired", "Somente administradores aprovados podem acessar essa pagina.", "error"],
            must_change_password: ["security.messages.forcePasswordChange", "Troque a senha inicial antes de acessar o Playbook.", "warning"],
            force_password_change: ["security.messages.forcePasswordChange", "Troque a senha inicial antes de acessar o Playbook.", "warning"],
            logout: ["security.messages.logout", "Sessao encerrada com seguranca.", "success"],
            registered: ["security.messages.registerSuccess", "Cadastro enviado. Confirme o e-mail recebido e aguarde a aprovacao administrativa antes de acessar o Playbook.", "success"],
            password_changed: ["security.messages.passwordChanged", "Senha alterada com sucesso. Entre com a nova senha.", "success"]
        };
        return messages[normalized] || null;
    }

    function isEmailNotConfirmedError(error) {
        const code = String(error && (error.code || error.error_code || error.name || "") || "").toLowerCase();
        const message = String(error && (error.message || error.error_description || "") || "").toLowerCase();
        return code.indexOf("email_not_confirmed") >= 0
            || message.indexOf("email not confirmed") >= 0
            || message.indexOf("email_not_confirmed") >= 0;
    }

    function isTimeoutError(error) {
        return error && error.code === "playbook_timeout";
    }

    function isAuthSetupError(error) {
        const message = String(error && error.message || "").toLowerCase();
        return message.indexOf("supabase js") >= 0
            || message.indexOf("supabase_url") >= 0
            || message.indexOf("supabase_anon_key") >= 0;
    }

    function showReasonFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const reason = params.get("reason");
        const entry = messageForReason(reason);
        if (!entry) return;
        showMessage(tr(entry[0], entry[1]), entry[2]);
    }

    function rememberRedirectAttempt(target) {
        try {
            window.sessionStorage.setItem(REDIRECT_GUARD_KEY, JSON.stringify({
                at: Date.now(),
                target: target || ""
            }));
        } catch (_error) {
            // Storage can be disabled by the browser; the URL guards still prevent loops.
        }
    }

    function hasRecentRedirectAttempt() {
        try {
            const raw = window.sessionStorage.getItem(REDIRECT_GUARD_KEY);
            if (!raw) return false;
            const payload = JSON.parse(raw);
            return Date.now() - Number(payload && payload.at || 0) < REDIRECT_GUARD_WINDOW_MS;
        } catch (_error) {
            return false;
        }
    }

    function shouldAutoRedirectOnLoad() {
        const params = new URLSearchParams(window.location.search);
        const auto = String(params.get("auto") || "").toLowerCase();
        const reason = String(params.get("reason") || "").toLowerCase();

        if (auto === "0" || auto === "false") return false;
        if (params.has("returnTo") && reason) return false;
        if (AUTO_REDIRECT_BLOCK_REASONS[reason]) return false;
        if (hasRecentRedirectAttempt() && reason) return false;

        return true;
    }

    function showProfileBlock(profile) {
        const status = auth.statusKey(profile);
        const entry = messageForReason(status) || messageForReason(profile && profile.status);
        if (entry) {
            showMessage(tr(entry[0], entry[1]), entry[2]);
            return;
        }
        showMessage(tr("security.messages.pending", "Seu acesso ainda nao esta aprovado."), "warning");
    }

    async function redirectIfAllowed() {
        const session = await auth.getSession();
        if (!session) return false;

        const user = await auth.getUser();
        if (!user) return false;

        const profile = await auth.getProfile({ user: user, forceRefresh: true });
        if (!profile) {
            showMessage(tr("security.messages.profileMissing", "Perfil do Playbook nao encontrado. Procure a administracao."), "error");
            return false;
        }

        if (!auth.isApproved(profile)) {
            showProfileBlock(profile);
            return false;
        }

        if (profile.must_change_password || profile.force_password_change) {
            auth.redirectToPasswordChange(auth.getReturnToFromUrl(auth.toRootUrl("index.html")));
            return true;
        }

        const serverSynced = await auth.syncAccessCookie(session);
        if (!serverSynced) {
            showMessage(tr("security.messages.sessionSyncFailed", "Login validado, mas nao foi possivel registrar a sessao no servidor. Verifique as variaveis do Netlify e tente novamente."), "error");
            return false;
        }
        showMessage(tr("security.messages.loginSuccess", "Login realizado. Redirecionando..."), "success");
        const target = auth.getReturnToFromUrl(auth.toRootUrl("index.html"));
        rememberRedirectAttempt(target);
        window.setTimeout(function () {
            window.location.replace(target);
        }, 250);
        return true;
    }

    async function handleLogin(event) {
        event.preventDefault();
        const attemptId = loginAttemptId + 1;
        loginAttemptId = attemptId;
        const form = event.currentTarget;
        const email = String(form.email.value || "").trim();
        const password = String(form.password.value || "");

        if (!isEmail(email)) {
            showMessage(tr("security.messages.emailInvalid", "Informe um e-mail valido."), "error");
            return;
        }

        setBusy(form, true);
        showMessage(tr("security.messages.signingIn", "Validando acesso..."), "warning");
        const slowTimer = window.setTimeout(function () {
            if (attemptId === loginAttemptId) {
                showMessage(tr("security.messages.loginTakingLong", "A validacao esta demorando mais que o normal. Ainda estamos tentando conectar ao Supabase..."), "warning");
            }
        }, 7000);

        try {
            const client = await withTimeout(
                auth.getClient(),
                16000,
                tr("security.messages.authClientTimeout", "Nao foi possivel carregar a autenticacao em tempo habil.")
            );
            if (attemptId !== loginAttemptId) return;

            const result = await withTimeout(
                client.auth.signInWithPassword({ email: email, password: password }),
                22000,
                tr("security.messages.loginTimeout", "A validacao demorou demais. Recarregue a pagina e tente novamente.")
            );
            if (attemptId !== loginAttemptId) return;

            if (result.error) throw result.error;
            await withTimeout(
                redirectIfAllowed(),
                16000,
                tr("security.messages.profileValidationTimeout", "Login realizado, mas a validacao do perfil demorou demais. Recarregue a pagina.")
            );
        } catch (_error) {
            if (isEmailNotConfirmedError(_error)) {
                showMessage(tr("security.messages.emailNotConfirmed", "Confirme o e-mail enviado pelo Supabase e aguarde a aprovacao administrativa antes de entrar."), "warning");
                return;
            }
            if (isTimeoutError(_error)) {
                showMessage(_error.message || tr("security.messages.loginTimeout", "A validacao demorou demais. Recarregue a pagina e tente novamente."), "warning");
                return;
            }
            if (isAuthSetupError(_error)) {
                showMessage(tr("security.messages.authUnavailable", "Nao foi possivel carregar a autenticacao. Verifique a conexao e recarregue a pagina."), "error");
                return;
            }
            showMessage(tr("security.messages.invalidCredentials", "E-mail ou senha invalidos."), "error");
        } finally {
            window.clearTimeout(slowTimer);
            if (attemptId === loginAttemptId) setBusy(form, false);
        }
    }

    async function handleRegister(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const email = String(form.email.value || "").trim();
        const password = String(form.password.value || "");
        const confirmation = String(form.passwordConfirm.value || "");

        if (!isEmail(email)) {
            showMessage(tr("security.messages.emailInvalid", "Informe um e-mail valido."), "error");
            return;
        }
        if (password !== confirmation) {
            showMessage(tr("security.messages.passwordMismatch", "A confirmacao da senha nao confere."), "error");
            return;
        }
        if (!validatePassword(password)) {
            showMessage(tr("security.messages.passwordWeak", "Use 12 ou mais caracteres, incluindo maiuscula, minuscula, numero e simbolo."), "error");
            return;
        }

        setBusy(form, true);
        try {
            const client = await auth.getClient();
            const result = await client.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: auth.toRootUrl("login.html?reason=registered")
                }
            });
            if (result.error) throw result.error;
            await client.auth.signOut();
            auth.syncAccessCookie(null);
            form.reset();
            activateMode("login");
            showMessage(tr("security.messages.registerSuccess", "Cadastro enviado. Confirme o e-mail recebido e aguarde a aprovacao administrativa antes de acessar o Playbook."), "success");
        } catch (_error) {
            showMessage(tr("security.messages.registerError", "Nao foi possivel concluir o cadastro agora. Tente novamente mais tarde."), "error");
        } finally {
            setBusy(form, false);
        }
    }

    async function handleReset(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const email = String(form.email.value || "").trim();

        if (!isEmail(email)) {
            showMessage(tr("security.messages.emailInvalid", "Informe um e-mail valido."), "error");
            return;
        }

        setBusy(form, true);
        try {
            const client = await auth.getClient();
            const result = await client.auth.resetPasswordForEmail(email, {
                redirectTo: auth.toRootUrl("alterar-senha.html")
            });
            if (result.error) throw result.error;
            form.reset();
            activateMode("login");
            showMessage(tr("security.messages.resetSuccess", "Se o e-mail estiver cadastrado, enviaremos instrucoes de recuperacao."), "success");
        } catch (_error) {
            showMessage(tr("security.messages.resetError", "Nao foi possivel processar a solicitacao agora. Tente novamente mais tarde."), "error");
        } finally {
            setBusy(form, false);
        }
    }

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            activateMode(tab.dataset.authMode, { clearMessage: true, focus: true });
        });
    });

    modeTriggers.forEach(function (trigger) {
        trigger.addEventListener("click", function () {
            activateMode(trigger.dataset.modeTrigger, { clearMessage: true, focus: true });
        });
    });

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const resetForm = document.getElementById("resetForm");

    if (loginForm) loginForm.addEventListener("submit", handleLogin);
    if (registerForm) registerForm.addEventListener("submit", handleRegister);
    if (resetForm) resetForm.addEventListener("submit", handleReset);

    const registerPassword = document.getElementById("registerPassword");
    const signupPasswordRules = document.getElementById("signupPasswordRules");
    if (registerPassword && signupPasswordRules) {
        registerPassword.addEventListener("input", function () {
            renderPasswordRules(registerPassword, signupPasswordRules);
        });
        renderPasswordRules(registerPassword, signupPasswordRules);
    }
    setupPasswordToggles();

    const params = new URLSearchParams(window.location.search);
    activateMode(params.get("mode") || "login");
    showReasonFromUrl();

    if (shouldAutoRedirectOnLoad()) {
        redirectIfAllowed().catch(function () {
            // Login page remains available when the current/previous session cannot be reused.
        });
    }
})();

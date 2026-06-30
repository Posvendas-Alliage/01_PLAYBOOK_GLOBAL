(function () {
    const auth = window.PlaybookAuth;
    if (!auth) return;

    const form = document.getElementById("passwordForm");
    const messageBox = document.getElementById("passwordMessage");
    const passwordInput = document.getElementById("newPassword");
    const passwordRules = document.getElementById("changePasswordRules");
    const passwordToggles = Array.prototype.slice.call(document.querySelectorAll("[data-password-toggle]"));

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

    function setBusy(busy) {
        if (!form) return;
        Array.prototype.forEach.call(form.querySelectorAll("button, input"), function (element) {
            element.disabled = !!busy;
        });
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

    function renderPasswordRules() {
        if (!passwordInput || !passwordRules) return;
        const rules = passwordRuleState(passwordInput.value);
        Object.keys(rules).forEach(function (key) {
            const item = passwordRules.querySelector('[data-password-rule="' + key + '"]');
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

    async function ensureSessionMessage() {
        try {
            const session = await auth.getSession();
            if (session) return;
            showMessage(tr("security.messages.sessionMissing", "Abra esta pagina pelo link de recuperacao ou faca login novamente."), "warning");
        } catch (_error) {
            showMessage(tr("security.messages.sessionMissing", "Abra esta pagina pelo link de recuperacao ou faca login novamente."), "warning");
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const password = String(form.password.value || "");
        const confirmation = String(form.passwordConfirm.value || "");

        if (password !== confirmation) {
            showMessage(tr("security.messages.passwordMismatch", "A confirmacao da senha nao confere."), "error");
            return;
        }
        if (!validatePassword(password)) {
            showMessage(tr("security.messages.passwordWeak", "Use 12 ou mais caracteres, incluindo maiuscula, minuscula, numero e simbolo."), "error");
            return;
        }

        setBusy(true);
        try {
            const session = await auth.getSession();
            if (!session) {
                showMessage(tr("security.messages.sessionMissing", "Sessao ausente. Solicite nova recuperacao ou faca login novamente."), "error");
                return;
            }

            const client = await auth.getClient();
            const user = await auth.getUser();
            const profile = user ? await auth.getProfile({ user: user, forceRefresh: true }).catch(function () { return null; }) : null;
            if (profile && (profile.must_change_password || profile.force_password_change)) {
                await auth.completeInitialPasswordChange(password);
            } else {
                const update = await client.auth.updateUser({ password: password });
                if (update.error) throw update.error;
            }

            const refreshed = await client.auth.getSession();
            await auth.syncAccessCookie(refreshed.data.session || session);
            showMessage(tr("security.messages.passwordChanged", "Senha alterada com sucesso. Redirecionando..."), "success");

            window.setTimeout(function () {
                window.location.replace(auth.getReturnToFromUrl(auth.toRootUrl("index.html")));
            }, 700);
        } catch (_error) {
            showMessage(tr("security.messages.passwordChangeError", "Nao foi possivel alterar a senha agora. Solicite um novo link ou tente novamente."), "error");
        } finally {
            setBusy(false);
        }
    }

    if (form) form.addEventListener("submit", handleSubmit);
    if (passwordInput) passwordInput.addEventListener("input", renderPasswordRules);
    renderPasswordRules();
    setupPasswordToggles();
    ensureSessionMessage();
})();

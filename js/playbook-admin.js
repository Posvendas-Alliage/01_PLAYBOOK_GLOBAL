(function () {
    const auth = window.PlaybookAuth;
    if (!auth) return;

    const FUNCTION_NAME = "playbook-admin";
    const form = document.getElementById("adminFilters");
    const searchInput = document.getElementById("adminSearch");
    const statusFilter = document.getElementById("adminStatusFilter");
    const messageBox = document.getElementById("adminMessage");
    const loadingBox = document.getElementById("adminLoading");
    const emptyBox = document.getElementById("adminEmpty");
    const tableBody = document.getElementById("adminUsersBody");

    let currentUserId = "";

    function tr(key, fallback) {
        return auth.t(key, fallback);
    }

    function showMessage(text, type) {
        if (!messageBox) return;
        messageBox.textContent = text || "";
        messageBox.classList.remove("is-visible", "is-error", "is-success", "is-warning");
        messageBox.hidden = !text;
        if (!text) return;
        messageBox.classList.add("is-visible");
        if (type) messageBox.classList.add("is-" + type);
    }

    function setLoading(isLoading) {
        if (loadingBox) loadingBox.hidden = !isLoading;
    }

    function setEmpty(isEmpty) {
        if (emptyBox) emptyBox.hidden = !isEmpty;
    }

    function normalizeStatusForApi(value) {
        const map = {
            Pendente: "pending",
            Aprovado: "approved",
            Recusado: "rejected",
            Suspenso: "suspended"
        };
        return map[value] || value || "";
    }

    function statusLabel(status) {
        const key = auth.statusKey(status);
        const labels = {
            pending: tr("security.admin.status.pending", "Pendente"),
            approved: tr("security.admin.status.approved", "Aprovado"),
            rejected: tr("security.admin.status.rejected", "Recusado"),
            suspended: tr("security.admin.status.suspended", "Suspenso")
        };
        return labels[key] || status || "-";
    }

    function roleLabel(role) {
        return role === "admin"
            ? tr("security.admin.roles.admin", "Admin")
            : tr("security.admin.roles.user", "User");
    }

    function formatDate(value) {
        if (!value) return "-";
        try {
            return new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short"
            }).format(new Date(value));
        } catch (_error) {
            return String(value);
        }
    }

    function endpointUrl() {
        const base = String(window.SUPABASE_URL || "").replace(/\/$/, "");
        if (!base) throw new Error("SUPABASE_URL ausente.");
        return base + "/functions/v1/" + FUNCTION_NAME;
    }

    async function callAdmin(action, payload) {
        const token = await auth.getAccessToken();
        if (!token) throw new Error(tr("security.messages.sessionMissing", "Sessao ausente."));

        const response = await fetch(endpointUrl(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                apikey: window.SUPABASE_ANON_KEY || "",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(Object.assign({ action: action }, payload || {}))
        });

        const body = await response.json().catch(function () { return {}; });
        if (!response.ok || body.success === false) {
            throw new Error(body.error || "Falha na operacao administrativa.");
        }
        return body;
    }

    function actionButton(label, action, userId, options) {
        const settings = options || {};
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn-secondary";
        button.textContent = label;
        button.addEventListener("click", async function () {
            const confirmation = settings.confirm || tr("security.admin.confirmStatus", "Confirmar alteracao de status?");
            if (!window.confirm(confirmation)) return;
            button.disabled = true;
            try {
                await callAdmin(action, { user_id: userId });
                showMessage(settings.success || tr("security.admin.statusChanged", "Status atualizado com sucesso."), "success");
                await loadUsers();
            } catch (error) {
                showMessage(error && error.message ? error.message : "Falha ao atualizar status.", "error");
            } finally {
                button.disabled = false;
            }
        });
        return button;
    }

    function renderActions(user) {
        const row = document.createElement("div");
        row.className = "auth-action-row";

        if (user.user_id === currentUserId) {
            row.textContent = tr("security.admin.currentUser", "Conta atual");
            return row;
        }

        const status = auth.statusKey(user);
        if (status !== "approved") {
            row.appendChild(actionButton(tr("security.admin.actions.approve", "Aprovar"), "approve", user.user_id));
        }
        if (status === "pending") {
            row.appendChild(actionButton(tr("security.admin.actions.reject", "Recusar"), "reject", user.user_id));
        }
        if (status === "approved") {
            row.appendChild(actionButton(tr("security.admin.actions.suspend", "Suspender"), "suspend", user.user_id));
        }
        if (status === "rejected" || status === "suspended") {
            row.appendChild(actionButton(tr("security.admin.actions.reactivate", "Reativar"), "reactivate", user.user_id));
        }
        if (status === "approved" && user.role !== "admin") {
            row.appendChild(actionButton(
                tr("security.admin.actions.makeAdmin", "Tornar admin"),
                "make_admin",
                user.user_id,
                {
                    confirm: tr("security.admin.confirmMakeAdmin", "Confirmar promocao deste usuario para administrador?"),
                    success: tr("security.admin.roleChanged", "Perfil atualizado com sucesso.")
                }
            ));
        }
        if (user.role === "admin") {
            row.appendChild(actionButton(
                tr("security.admin.actions.removeAdmin", "Remover admin"),
                "remove_admin",
                user.user_id,
                {
                    confirm: tr("security.admin.confirmRemoveAdmin", "Confirmar remocao do perfil administrador deste usuario?"),
                    success: tr("security.admin.roleChanged", "Perfil atualizado com sucesso.")
                }
            ));
        }

        return row;
    }

    function renderUsers(users) {
        if (!tableBody) return;
        tableBody.textContent = "";

        users.forEach(function (user) {
            const row = document.createElement("tr");

            const email = document.createElement("td");
            email.textContent = user.email || "-";

            const created = document.createElement("td");
            created.textContent = formatDate(user.created_at);

            const status = document.createElement("td");
            const pill = document.createElement("span");
            pill.className = "auth-status-pill";
            pill.dataset.status = auth.statusKey(user);
            pill.textContent = statusLabel(user.status);
            status.appendChild(pill);

            const role = document.createElement("td");
            role.textContent = roleLabel(user.role);

            const updated = document.createElement("td");
            updated.textContent = formatDate(user.status_changed_at || user.updated_at);

            const actions = document.createElement("td");
            actions.appendChild(renderActions(user));

            row.appendChild(email);
            row.appendChild(created);
            row.appendChild(status);
            row.appendChild(role);
            row.appendChild(updated);
            row.appendChild(actions);
            tableBody.appendChild(row);
        });
    }

    async function loadUsers() {
        setLoading(true);
        setEmpty(false);
        try {
            const response = await callAdmin("list_users", {
                search: searchInput ? searchInput.value : "",
                status: statusFilter ? normalizeStatusForApi(statusFilter.value) : ""
            });
            currentUserId = response.current_user_id || currentUserId;
            const users = Array.isArray(response.users) ? response.users : [];
            renderUsers(users);
            setEmpty(users.length === 0);
        } catch (error) {
            showMessage(error && error.message ? error.message : "Falha ao carregar usuarios.", "error");
        } finally {
            setLoading(false);
        }
    }

    if (messageBox) messageBox.hidden = true;
    if (emptyBox) emptyBox.hidden = true;

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            loadUsers();
        });
    }

    loadUsers();
})();

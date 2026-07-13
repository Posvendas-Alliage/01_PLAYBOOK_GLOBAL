const DEFAULT_FILTERS = {
    region: 'all',
    country: [],
    priority: 'all',
    department: 'all',
    type: 'all',
    productLine: 'all',
    product: 'all',
    dateFrom: '',
    dateTo: '',
    agentGroups: ['Suporte geral', 'Especialista', 'Sem dono']
};

const FilterState = {
    get() {
        try {
            const raw = sessionStorage.getItem('dashboard_filters');
            if (!raw) return { ...DEFAULT_FILTERS };
            return { ...DEFAULT_FILTERS, ...JSON.parse(raw) };
        } catch {
            return { ...DEFAULT_FILTERS };
        }
    },

    set(filters) {
        const next = { ...DEFAULT_FILTERS, ...filters };
        sessionStorage.setItem('dashboard_filters', JSON.stringify(next));
        document.dispatchEvent(new CustomEvent('filterschange', { detail: next }));
    },

    update(key, value) {
        const current = this.get();
        current[key] = value;
        this.set(current);
    },

    reset() {
        sessionStorage.removeItem('dashboard_filters');
        document.dispatchEvent(new CustomEvent('filterschange', { detail: { ...DEFAULT_FILTERS } }));
    }
};

function bindFilterBar(rootSelector) {
    const root = document.querySelector(rootSelector || '.filter-bar');
    if (!root) return;

    const state = FilterState.get();
    root.querySelectorAll('[data-filter]').forEach(input => {
        const key = input.dataset.filter;
        if (state[key] !== undefined && state[key] !== null) {
            input.value = state[key];
        }
        input.addEventListener('change', () => {
            FilterState.update(key, input.value);
        });
    });

    const resetBtn = root.querySelector('[data-filter-reset]');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            FilterState.reset();
            root.querySelectorAll('[data-filter]').forEach(input => {
                const key = input.dataset.filter;
                input.value = DEFAULT_FILTERS[key];
            });
        });
    }
}

(function () {
  const STORAGE_KEY = 'playbook-kpi-hours-mode';
  const AUDIT_URL = 'data/business-hours-kpi-audit-latest.json';
  const MODE_COMMON = 'common';
  const MODE_BUSINESS = 'business';
  let auditPromise = null;
  let observer = null;
  let weeklyBusinessTicketMap = new Map();
  let monthlyBusinessTicketMap = new Map();
  let applyTimer = null;
  let repairTimer = null;
  let applying = false;

  function mode() {
    return localStorage.getItem(STORAGE_KEY) === MODE_BUSINESS ? MODE_BUSINESS : MODE_COMMON;
  }

  function setMode(next) {
    localStorage.setItem(STORAGE_KEY, next === MODE_BUSINESS ? MODE_BUSINESS : MODE_COMMON);
    updateButtons();
    clearBusinessChartCache();
    scheduleRepair();
    window.dispatchEvent(new CustomEvent('playbook-hours-mode-change', { detail: { mode: mode() } }));
    if (typeof window.applyPage === 'function') {
      try { window.applyPage(); } catch (_) {}
    }
    setTimeout(applyBusinessHoursOverride, 250);
  }

  function updateButtons() {
    const current = mode();
    document.querySelectorAll('button[data-hours-mode]').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.hoursMode === current);
      btn.setAttribute('aria-pressed', btn.dataset.hoursMode === current ? 'true' : 'false');
    });
    document.documentElement.dataset.hoursMode = current;
  }

  const CP1252_REVERSE = {
    '€': 0x80, '‚': 0x82, 'ƒ': 0x83, '„': 0x84, '…': 0x85, '†': 0x86, '‡': 0x87,
    'ˆ': 0x88, '‰': 0x89, 'Š': 0x8a, '‹': 0x8b, 'Œ': 0x8c, 'Ž': 0x8e,
    '‘': 0x91, '’': 0x92, '“': 0x93, '”': 0x94, '•': 0x95, '–': 0x96, '—': 0x97,
    '˜': 0x98, '™': 0x99, 'š': 0x9a, '›': 0x9b, 'œ': 0x9c, 'ž': 0x9e, 'Ÿ': 0x9f
  };
  const MOJIBAKE_RE = /[ÃÂâð]/;

  function maybeRepairText(value) {
    const text = String(value || '');
    const patched = text
      .replace(/â€”/g, '—')
      .replace(/â€“/g, '–')
      .replace(/â†’/g, '→')
      .replace(/â†•/g, '↕')
      .replace(/â†“/g, '↓')
      .replace(/â†‘/g, '↑')
      .replace(/âš ï¸/g, '⚠️')
      .replace(/Â·/g, '·')
      .replace(/Ã—/g, '×')
      .replace(/Î”/g, 'Δ')
      .replace(/ï¿½/g, '—');
    if (!MOJIBAKE_RE.test(patched) || typeof TextDecoder === 'undefined') return patched;
    const bytes = [];
    for (const char of text) {
      const code = char.charCodeAt(0);
      if (code <= 0xff) bytes.push(code);
      else if (Object.prototype.hasOwnProperty.call(CP1252_REVERSE, char)) bytes.push(CP1252_REVERSE[char]);
      else return text;
    }
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes));
    } catch (_) {
      return text;
    }
  }

  function repairMojibake(root) {
    const base = root && root.nodeType === Node.ELEMENT_NODE ? root : document.body;
    if (!base) return;
    const walker = document.createTreeWalker(base, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.parentElement && node.parentElement.closest('script,style,template')) return;
      const fixed = maybeRepairText(node.nodeValue);
      if (fixed !== node.nodeValue) node.nodeValue = fixed;
    });
    base.querySelectorAll('[title],[aria-label],[placeholder],[data-tooltip]').forEach(el => {
      if (el.closest('script,style,template')) return;
      ['title', 'aria-label', 'placeholder', 'data-tooltip'].forEach(attr => {
        const current = el.getAttribute(attr);
        if (!current) return;
        const fixed = maybeRepairText(current);
        if (fixed !== current) el.setAttribute(attr, fixed);
      });
    });
    if (document.title) {
      const fixedTitle = maybeRepairText(document.title);
      if (fixedTitle !== document.title) document.title = fixedTitle;
    }
  }

  function scheduleRepair() {
    if (repairTimer) clearTimeout(repairTimer);
    repairTimer = setTimeout(() => repairMojibake(document.body), 60);
  }

  function bindControl(wrap) {
    if (!wrap || wrap.dataset.hoursModeBound === '1') return;
    wrap.dataset.hoursModeBound = '1';
    wrap.addEventListener('click', event => {
      const btn = event.target.closest('[data-hours-mode]');
      if (!btn) return;
      setMode(btn.dataset.hoursMode);
    });
  }

  function ensureControl() {
    let wrap = document.getElementById('hours-mode-switch');
    if (wrap) {
      bindControl(wrap);
      updateButtons();
      return;
    }
    const host = document.querySelector('.app-header-actions');
    if (!host) return;
    wrap = document.createElement('div');
    wrap.id = 'hours-mode-switch';
    wrap.className = 'hours-mode-switch';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Modo de horario');
    wrap.innerHTML = [
      '<button type="button" data-hours-mode="common">Corridas</button>',
      '<button type="button" data-hours-mode="business">Uteis</button>'
    ].join('');
    const lang = host.querySelector('.lang-switch');
    if (lang && lang.nextSibling) host.insertBefore(wrap, lang.nextSibling);
    else host.appendChild(wrap);
    bindControl(wrap);
    updateButtons();
  }
  function ensureStyles() {
    if (document.getElementById('hours-mode-style')) return;
    const style = document.createElement('style');
    style.id = 'hours-mode-style';
    style.textContent = `
      .hours-mode-switch{display:inline-flex;border:1px solid var(--color-border);border-radius:var(--radius-md);overflow:hidden;background:var(--color-surface);}
      .hours-mode-switch button{background:transparent;border:0;color:var(--color-text-muted);padding:6px 12px;font-size:.8rem;font-weight:700;cursor:pointer;white-space:nowrap;}
      .hours-mode-switch button:hover{color:var(--color-text);background:rgba(31,111,235,.08);}
      .hours-mode-switch button.is-active{background:var(--color-primary);color:#fff;}
      .hours-mode-badge{display:inline-flex;align-items:center;gap:6px;margin-left:8px;padding:3px 8px;border-radius:999px;border:1px solid rgba(18,223,52,.4);background:rgba(18,223,52,.08);color:var(--color-green);font-size:.68rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;vertical-align:middle;}
      html[data-hours-mode="common"] .hours-mode-badge{display:none;}
      .hours-mode-note{margin:10px 0 0;color:var(--color-text-muted);font-size:.78rem;}
      @media (max-width:760px){.hours-mode-switch{order:4;width:100%;}.hours-mode-switch button{flex:1;}}
    `;
    document.head.appendChild(style);
  }

  async function loadAudit() {
    if (!auditPromise) {
      auditPromise = fetch(AUDIT_URL, { cache: 'no-store' }).then(res => {
        if (!res.ok) throw new Error('Falha ao carregar auditoria de horario comercial');
        return res.json();
      });
    }
    return auditPromise;
  }

  function fmt(value, digits) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '--';
    return Number(value).toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }
  function fmtInt(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '--';
    return Number(value).toLocaleString('pt-BR');
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  const KPI_BAR_COLORS = {
    green: '#12DF34',
    yellow: '#E4BF14',
    red: '#E31424',
    gray: '#64748b'
  };

  function setKpiTopBarColor(kpiId, colorName) {
    if (typeof window.colorKpiTopBar === 'function') {
      window.colorKpiTopBar(kpiId, colorName);
      return;
    }
    const el = document.getElementById(kpiId);
    const card = el && el.closest ? el.closest('.card') : null;
    if (!card) return;
    let bar = card.querySelector('.kpi-top-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'kpi-top-bar';
      bar.style.cssText = 'height:3px;margin:-20px -20px 12px;border-radius:var(--radius-lg) var(--radius-lg) 0 0;transition:background .2s;';
      card.insertBefore(bar, card.firstChild);
    }
    bar.style.background = KPI_BAR_COLORS[colorName] || KPI_BAR_COLORS.gray;
  }

  function slaCardColor(eligible, value) {
    const n = businessNumber(value);
    if (!eligible || n === null) return 'gray';
    if (n >= 80) return 'green';
    if (n >= 50) return 'yellow';
    return 'red';
  }

  function mtfcCardColor(closed, value) {
    const n = businessNumber(value);
    if (!closed || n === null) return 'gray';
    if (n <= 8) return 'green';
    if (n <= 16) return 'yellow';
    return 'red';
  }

  function mttsCardColor(closed, value) {
    const n = businessNumber(value);
    if (!closed || n === null) return 'gray';
    if (n <= 7) return 'green';
    if (n <= 14) return 'yellow';
    return 'red';
  }

  function updateCommercialKpiCardColors(ids, metrics) {
    const bh = metrics && metrics.business_hours ? metrics.business_hours : metrics;
    const closed = Number(metrics && metrics.closed || 0);
    setKpiTopBarColor(ids.sla, slaCardColor(Number(bh && bh.eligible || 0) > 0, bh && bh.sla_pct));
    setKpiTopBarColor(ids.mtfc, mtfcCardColor(closed > 0, bh && bh.avg_mtfc_h));
    setKpiTopBarColor(ids.mtts, mttsCardColor(closed > 0, bh && bh.avg_mtts_business_days));
  }
  function setBadge(id) {
    const el = document.getElementById(id);
    if (!el || el.parentElement.querySelector('.hours-mode-badge')) return;
    const badge = document.createElement('span');
    badge.className = 'hours-mode-badge';
    badge.textContent = 'Comercial';
    el.parentElement.appendChild(badge);
  }

  function decorateNote(text) {
    let note = document.getElementById('hours-mode-note');
    const main = document.querySelector('.tier-heading') || document.querySelector('.app-main');
    if (!main) return;
    if (!note) {
      note = document.createElement('p');
      note.id = 'hours-mode-note';
      note.className = 'hours-mode-note';
      main.appendChild(note);
    }
    note.textContent = text;
    note.style.display = mode() === MODE_BUSINESS ? '' : 'none';
  }

  const REGION_ORDER = ['Brasil', 'Argentina', 'Mexico', 'LATAM', 'USA', 'ROW'];
  const REGION_LABELS = {
    Brasil: 'Brasil',
    USA: 'Estados Unidos',
    Argentina: 'Argentina',
    LATAM: 'América Latina',
    Mexico: 'México',
    ROW: 'Resto do Mundo'
  };
  const REGION_FLAGS = { Brasil: 'BR', Argentina: 'AR', Mexico: 'MX', LATAM: 'LATAM', USA: 'US', ROW: 'ROW' };

  function normalizePlain(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/gi, ' ')
      .trim()
      .toLowerCase();
  }

  function canonicalRegion(value) {
    const plain = normalizePlain(value);
    if (plain === 'brasil' || plain === 'brazil') return 'Brasil';
    if (plain === 'usa' || plain === 'us' || plain === 'estados unidos' || plain === 'united states') return 'USA';
    if (plain === 'argentina') return 'Argentina';
    if (plain === 'latam' || plain === 'america latina' || plain === 'latin america') return 'LATAM';
    if (plain === 'mexico') return 'Mexico';
    if (plain === 'row' || plain === 'resto do mundo' || plain === 'rest of world') return 'ROW';
    return '';
  }

  function currentFilters() {
    try {
      if (typeof FilterState !== 'undefined' && FilterState && typeof FilterState.get === 'function') {
        return FilterState.get() || {};
      }
    } catch (_) {}
    return {};
  }

  const DEFAULT_FILTER_AGENT_GROUPS = ['Suporte geral', 'Especialista', 'Sem dono'];

  function sameStringSet(a, b) {
    const left = Array.isArray(a) ? [...a].sort() : [];
    const right = Array.isArray(b) ? [...b].sort() : [];
    return left.length === right.length && left.every((value, index) => value === right[index]);
  }

  function hasActiveWeeklyCrossFilter() {
    const bar = document.getElementById('weekly-cross-filter-bar');
    return !!(bar && bar.style.display !== 'none' && bar.querySelector('.cf-chip'));
  }

  function hasUnsupportedWeeklyBusinessFilter(filters) {
    return hasActiveWeeklyCrossFilter();
  }

  function clearBadges(ids) {
    ids.forEach(id => {
      const el = document.getElementById(id);
      const badge = el && el.parentElement ? el.parentElement.querySelector('.hours-mode-badge') : null;
      if (badge) badge.remove();
    });
  }
  function selectedRegionFilter() {
    const raw = currentFilters().region;
    if (!raw || raw === 'all') return '';
    return canonicalRegion(maybeRepairText(raw));
  }

  function scopedPeriodByRegion(period) {
    const selected = selectedRegionFilter();
    if (!selected) return period;
    const map = regionMetricsMap(period);
    const metrics = map.get(selected) || null;
    return {
      key: (period && period.key ? period.key : '') + '::' + selected,
      metrics: metrics || { closed: 0, orig: {}, business_hours: {} },
      by_region: metrics ? { [selected]: metrics } : {}
    };
  }

  function clearBusinessChartCache() {
    document.querySelectorAll('canvas[data-business-hours-chart-sig]').forEach(canvas => {
      canvas.removeAttribute('data-business-hours-chart-sig');
      canvas.removeAttribute('data-business-hours-chart-mode');
    });
  }

  function renderBusinessChart(canvasId, sig, renderer) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    if (canvas.dataset.businessHoursChartMode === 'business' && canvas.dataset.businessHoursChartSig === sig) return canvas._chartInstance || null;
    canvas.dataset.businessHoursChartMode = 'business';
    canvas.dataset.businessHoursChartSig = sig;
    return renderer();
  }

  function clearChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (canvas._chartInstance) {
      canvas._chartInstance.destroy();
      canvas._chartInstance = null;
    }
    canvas.removeAttribute('data-business-hours-chart-sig');
    canvas.removeAttribute('data-business-hours-chart-mode');
  }

  function selectedWeeklyPeriodObject(audit) {
    const sel = document.getElementById('week-selector');
    if (sel && sel.value && Array.isArray(audit.weekly_periods)) {
      const found = audit.weekly_periods.find(p => p.key === sel.value);
      if (found) return found;
    }
    return { key: 'current-week', metrics: audit.weekly, by_region: audit.weekly_by_region || {} };
  }

  function selectedMonthlyPeriodObject(audit) {
    const sel = document.getElementById('filter-month-year');
    if (sel && sel.value && Array.isArray(audit.monthly_periods)) {
      const found = audit.monthly_periods.find(p => p.key === sel.value);
      if (found) return found;
    }
    return { key: 'current-month', metrics: audit.monthly, by_region: audit.monthly_by_region || {} };
  }

  function selectedMonthlyPeriod(audit) {
    return selectedMonthlyPeriodObject(audit).metrics;
  }

  function selectedWeeklyPeriod(audit) {
    return selectedWeeklyPeriodObject(audit).metrics;
  }

  function colorForSla(value) {
    const n = businessNumber(value);
    if (n === null) return '#cbd5e1';
    if (n >= 80) return '#12DF34';
    if (n >= 50) return '#E4BF14';
    return '#E31424';
  }

  function colorForMtfc(value) {
    const n = businessNumber(value);
    if (n === null) return '#64748b';
    if (n <= 8) return '#12DF34';
    if (n <= 16) return '#E4BF14';
    return '#E31424';
  }

  function colorForMtts(value) {
    const n = businessNumber(value);
    if (n === null) return '#64748b';
    if (n <= 7) return '#12DF34';
    if (n <= 14) return '#E4BF14';
    return '#E31424';
  }

  const TICKET_MTFC_TARGETS = {
    urgente: 1,
    alta: 2,
    media: 3,
    baixa: 5,
    'muito baixa': 6
  };
  const TICKET_MTTS_TARGETS = {
    Brasil: 4,
    Argentina: 5,
    Mexico: 6,
    LATAM: 6,
    USA: 10,
    ROW: 10
  };

  function colorByTarget(value, target, fallbackColor) {
    const n = businessNumber(value);
    const t = businessNumber(target);
    if (n === null) return '#64748b';
    if (t === null || t <= 0) return fallbackColor || '#64748b';
    return n <= t ? '#12DF34' : '#E31424';
  }

  function ticketMtfcTarget(metric) {
    const direct = businessNumber(metric && metric.business_hours && metric.business_hours.mtfc_target_h);
    if (direct !== null) return direct;
    return TICKET_MTFC_TARGETS[normalizePlain(metric && metric.priority)] || null;
  }

  function ticketMttsTarget(metric) {
    const bh = metric && metric.business_hours || {};
    const direct = businessNumber(bh.mtts_target_business_days || bh.mtts_target_d);
    if (direct !== null) return direct;
    return TICKET_MTTS_TARGETS[canonicalRegion(metric && metric.region)] || null;
  }

  function commercialTicketMetricHtml(metric, kind) {
    const bh = metric && metric.business_hours || {};
    const value = kind === 'mtfc'
      ? businessNumber(bh.mtfc_h)
      : businessNumber(bh.mtts_business_days);
    if (value === null) return '--';
    const target = kind === 'mtfc' ? ticketMtfcTarget(metric) : ticketMttsTarget(metric);
    const color = kind === 'mtfc'
      ? colorByTarget(value, target, colorForMtfc(value))
      : colorByTarget(value, target, colorForMtts(value));
    const unit = kind === 'mtfc' ? 'h' : 'd';
    const title = target === null ? '' : ' title="Meta: ' + fmt(target, 1) + ' ' + unit + '"';
    return '<span style="color:' + color + '"' + title + '>' + fmt(value, 1) + ' ' + unit + '</span>';
  }

  function statusBadge(sla) {
    const n = Number(sla);
    if (!Number.isFinite(n)) return '<span class="badge badge-muted">--</span>';
    if (n >= 80) return '<span class="badge badge-green">ON TARGET</span>';
    if (n >= 50) return '<span class="badge badge-yellow">Atenção</span>';
    return '<span class="badge badge-red">Crítico</span>';
  }

  function regionMetricsMap(period) {
    const source = period && period.by_region ? period.by_region : {};
    const map = new Map();
    Object.entries(source).forEach(([key, value]) => {
      const region = canonicalRegion(key);
      if (REGION_ORDER.includes(region)) map.set(region, value);
    });
    return map;
  }

  function periodRegionRows(period) {
    const map = regionMetricsMap(period);
    return REGION_ORDER
      .filter(region => map.has(region))
      .map(region => ({ region, metrics: map.get(region) }))
      .filter(item => item.metrics && Number(item.metrics.closed || 0) > 0)
      .sort((a, b) => {
        const av = Number(a.metrics.business_hours && a.metrics.business_hours.sla_pct);
        const bv = Number(b.metrics.business_hours && b.metrics.business_hours.sla_pct);
        return (Number.isFinite(bv) ? bv : -1) - (Number.isFinite(av) ? av : -1);
      });
  }

  function monthlyTicketRows(period) {
    return Array.isArray(period && period.tickets) ? period.tickets : [];
  }

  function filterBusinessTicketRows(rows) {
    const filters = currentFilters();
    const agentGroups = Array.isArray(filters.agentGroups) ? filters.agentGroups : DEFAULT_FILTER_AGENT_GROUPS;
    return (rows || []).filter(row => {
      if (filters.region && filters.region !== 'all' && canonicalRegion(row.region) !== canonicalRegion(filters.region)) return false;
      if (filters.priority && filters.priority !== 'all' && row.priority !== filters.priority) return false;
      if (filters.type && filters.type !== 'all' && row.type !== filters.type) return false;
      if (filters.department && filters.department !== 'all' && row.department_name !== filters.department) return false;
      if (filters.productLine && filters.productLine !== 'all' && row.product_line !== filters.productLine) return false;
      if (filters.product && filters.product !== 'all') {
        const selected = String(filters.product);
        if (selected.startsWith('line:')) {
          if (row.product_line !== selected.replace('line:', '')) return false;
        } else {
          const values = [row.product, row.status].filter(Boolean);
          if (!values.includes(selected)) return false;
        }
      }
      if (!agentGroups.length || !agentGroups.includes(row.agent_group || '')) return false;
      return true;
    });
  }

  function filterMonthlyBusinessTickets(rows) {
    return filterBusinessTicketRows(rows);
  }
  function renderMonthlyCommercialRegionTable(period) {
    const tbody = document.getElementById('mrm-region-tbody');
    if (!tbody) return;
    const rows = periodRegionRows(period);
    const sig = JSON.stringify(rows.map(item => [item.region, item.metrics.closed, item.metrics.business_hours && item.metrics.business_hours.sla_pct, item.metrics.business_hours && item.metrics.business_hours.avg_mtfc_h, item.metrics.business_hours && item.metrics.business_hours.avg_mtts_business_days]));
    if (tbody.dataset.businessHoursSig === sig && tbody.querySelector('[data-hours-mode-row="business"]')) return;
    tbody.dataset.businessHoursSig = sig;
    if (!rows.length) {
      tbody.innerHTML = '<tr data-hours-mode-row="business"><td colspan="6" class="empty-state">Sem dados</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(({ region, metrics }) => {
      const bh = metrics.business_hours || {};
      const sla = Number(bh.sla_pct);
      const mtfc = businessNumber(bh.avg_mtfc_h);
      const mtts = businessNumber(bh.avg_mtts_business_days);
      const slaText = Number.isFinite(sla) ? '<span style="color:' + colorForSla(sla) + ';font-weight:600">' + fmt(sla, 1) + '%</span>' : '--';
      const mtfcText = mtfc !== null ? '<span style="color:' + colorForMtfc(mtfc) + '">' + fmt(mtfc, 1) + ' h</span>' : '--';
      const mttsText = mtts !== null ? '<span style="color:' + colorForMtts(mtts) + '">' + fmt(mtts, 1) + ' d</span>' : '--';
      return '<tr data-hours-mode-row="business">' +
        '<td>' + (REGION_FLAGS[region] || '') + ' ' + (REGION_LABELS[region] || region) + '</td>' +
        '<td class="mono">' + fmtInt(metrics.closed) + '</td>' +
        '<td>' + mtfcText + '</td>' +
        '<td>' + mttsText + '</td>' +
        '<td>' + slaText + '</td>' +
        '<td>' + statusBadge(sla) + '</td>' +
      '</tr>';
    }).join('');
  }

  function renderMonthlyCommercialCharts(period) {
    const rows = periodRegionRows(period);
    if (!rows.length || typeof createBarChart !== 'function') {
      ['chart-monthly-sla','chart-monthly-mtfc','chart-monthly-mtts'].forEach(clearChart);
      return;
    }
    const labels = rows.map(item => REGION_LABELS[item.region] || item.region);
    const slaValues = rows.map(item => {
      const v = Number(item.metrics.business_hours && item.metrics.business_hours.sla_pct);
      return Number.isFinite(v) ? Number(v.toFixed(1)) : 0;
    });
    const mtfcValues = rows.map(item => {
      const v = Number(item.metrics.business_hours && item.metrics.business_hours.avg_mtfc_h);
      return Number.isFinite(v) ? Number(v.toFixed(1)) : 0;
    });
    const mttsValues = rows.map(item => {
      const v = Number(item.metrics.business_hours && item.metrics.business_hours.avg_mtts_business_days);
      return Number.isFinite(v) ? Number(v.toFixed(1)) : 0;
    });
    const sig = JSON.stringify({ key: period && period.key, rows: rows.map(item => [item.region, item.metrics.closed, item.metrics.business_hours]) });
    if (typeof createBarChartWithTarget === 'function') {
      renderBusinessChart('chart-monthly-sla', sig + ':sla', () => createBarChartWithTarget('chart-monthly-sla', labels, slaValues, slaValues.map(colorForSla), 'SLA Compliance por Região - Comercial', 80, 'Meta', 105));
    }
    renderBusinessChart('chart-monthly-mtfc', sig + ':mtfc', () => createBarChart('chart-monthly-mtfc', labels, mtfcValues, mtfcValues.map(colorForMtfc), 'MTFC Médio por Região - Comercial'));
    renderBusinessChart('chart-monthly-mtts', sig + ':mtts', () => createBarChart('chart-monthly-mtts', labels, mttsValues, mttsValues.map(colorForMtts), 'MTTS Médio por Região - Comercial'));
  }

  function updateMonthlyCommercialMap(period) {
    const map = regionMetricsMap(period);
    const selected = selectedRegionFilter();
    document.querySelectorAll('#world-map-svg path[data-region]').forEach(path => {
      const region = canonicalRegion(maybeRepairText(path.dataset.region));
      const visible = !selected || region === selected;
      const metrics = visible ? map.get(region) : null;
      const sla = metrics && metrics.business_hours ? Number(metrics.business_hours.sla_pct) : NaN;
      const fill = colorForSla(sla);
      path.setAttribute('fill', fill);
      path.style.fill = fill;
    });
  }

  function setDelta(prefix, curr, prev, inverted, unit) {
    const arrowEl = document.getElementById('mrm-delta-' + prefix + '-arrow');
    const valueEl = document.getElementById('mrm-delta-' + prefix + '-value');
    const metaEl = document.getElementById('mrm-delta-' + prefix + '-meta');
    if (!arrowEl || !valueEl || !metaEl) return;
    const c = Number(curr);
    const p = Number(prev);
    if (!Number.isFinite(c) || !Number.isFinite(p) || p === 0) {
      arrowEl.textContent = '-';
      valueEl.textContent = '--';
      metaEl.textContent = '--';
      return;
    }
    const delta = ((c - p) / Math.abs(p)) * 100;
    const neutral = Math.abs(delta) < 0.5;
    const improved = inverted ? delta < 0 : delta > 0;
    const color = neutral ? 'var(--color-text-muted)' : (improved ? '#12DF34' : '#E31424');
    arrowEl.textContent = neutral ? '-' : (delta > 0 ? '▲' : '▼');
    arrowEl.style.color = color;
    valueEl.textContent = (neutral ? '+/-' : (delta > 0 ? '+' : '')) + fmt(delta, 2) + '%';
    valueEl.style.color = color;
    metaEl.textContent = fmt(c, 2) + unit + ' vs ' + fmt(p, 2) + unit;
  }

  function updateMonthlyCommercialTrend(audit, period) {
    if (!Array.isArray(audit.monthly_periods) || !period) return;
    const baseKey = String(period && period.key || '').split('::')[0];
    const index = audit.monthly_periods.findIndex(item => item.key === baseKey);
    const prev = index >= 0 ? audit.monthly_periods[index + 1] : null;
    if (!prev) return;
    const prevScoped = scopedPeriodByRegion(prev);
    const currBh = period.metrics && period.metrics.business_hours || {};
    const prevBh = prevScoped.metrics && prevScoped.metrics.business_hours || {};
    setDelta('sla', currBh.sla_pct, prevBh.sla_pct, false, '%');
    setDelta('mtfc', currBh.avg_mtfc_h, prevBh.avg_mtfc_h, true, 'h');
    setDelta('mtts', currBh.avg_mtts_business_days, prevBh.avg_mtts_business_days, true, 'd');
  }

  function setWeeklyBusinessTicketMap(rows) {
    weeklyBusinessTicketMap = new Map((rows || []).map(row => [String(row.ticket_number || ''), row]));
  }

  function businessNumber(value) {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  function weeklyBusinessSortValue(ticket, column) {
    if (mode() !== MODE_BUSINESS) return null;
    const ticketNumber = String(ticket && ticket.ticket_number || '');
    const metric = weeklyBusinessTicketMap.get(ticketNumber);
    if (!metric || !metric.business_hours) return null;
    if (column === 'mtfc_horas_bi') {
      const value = businessNumber(metric.business_hours.mtfc_h);
      return value === null ? 9999 : value;
    }
    if (column === 'mtts_dias_bi') {
      const value = businessNumber(metric.business_hours.mtts_business_days);
      return value === null ? 9999 : value;
    }
    if (column === 'sla_status_bi') {
      if (metric.business_hours.sla_status === 'Dentro SLA') return 1;
      if (metric.business_hours.sla_status === 'Fora SLA') return 2;
      return 9;
    }
    return null;
  }

  function setMonthlyBusinessTicketMap(rows) {
    monthlyBusinessTicketMap = new Map((rows || []).map(row => [String(row.ticket_number || ''), row]));
  }

  function monthlyBusinessSortValue(ticket, column) {
    if (mode() !== MODE_BUSINESS) return null;
    const ticketNumber = String(ticket && ticket.ticket_number || '');
    const metric = monthlyBusinessTicketMap.get(ticketNumber);
    if (!metric || !metric.business_hours) return null;
    if (column === 'mtfc_horas_bi') {
      const value = businessNumber(metric.business_hours.mtfc_h);
      return value === null ? 9999 : value;
    }
    if (column === 'mtts_dias_bi') {
      const value = businessNumber(metric.business_hours.mtts_business_days);
      return value === null ? 9999 : value;
    }
    if (column === 'sla_status_bi') {
      if (metric.business_hours.sla_status === 'Dentro SLA') return 1;
      if (metric.business_hours.sla_status === 'Fora SLA') return 2;
      return 9;
    }
    return null;
  }
  window.BusinessHoursMode = Object.assign(window.BusinessHoursMode || {}, {
    weeklySortValue: weeklyBusinessSortValue,
    monthlySortValue: monthlyBusinessSortValue
  });
  function weeklyTicketRows(period) {
    return Array.isArray(period && period.tickets) ? period.tickets : [];
  }

  function filterWeeklyBusinessTickets(rows) {
    return filterBusinessTicketRows(rows);
  }
  function averageBusiness(values) {
    const nums = values.map(businessNumber).filter(value => value !== null);
    return nums.length ? nums.reduce((sum, value) => sum + value, 0) / nums.length : null;
  }

  function chartBusinessValue(value) {
    const n = businessNumber(value);
    return n === null ? 0 : Number(n.toFixed(1));
  }

  function computeBusinessTicketMetrics(rows) {
    const eligible = rows.filter(row => row.business_hours && row.business_hours.eligible === true);
    const within = eligible.filter(row => row.business_hours && row.business_hours.within === true);
    return {
      closed: rows.length,
      eligible: eligible.length,
      within: within.length,
      sla_pct: eligible.length ? within.length / eligible.length * 100 : null,
      avg_mtfc_h: averageBusiness(rows.map(row => row.business_hours && row.business_hours.mtfc_h)),
      avg_mtts_business_days: averageBusiness(rows.map(row => row.business_hours && row.business_hours.mtts_business_days))
    };
  }

  function businessRowsBy(rows, keyFn) {
    const map = new Map();
    rows.forEach(row => {
      const key = keyFn(row) || '--';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    });
    return map;
  }

  function renderWeeklyCommercialRegionTableFromTickets(rows) {
    const tbody = document.getElementById('region-table-body');
    if (!tbody) return;
    const grouped = businessRowsBy(rows, row => canonicalRegion(row.region));
    const items = REGION_ORDER
      .filter(region => grouped.has(region))
      .map(region => ({ region, metrics: computeBusinessTicketMetrics(grouped.get(region)) }))
      .filter(item => item.metrics.closed > 0)
      .sort((a, b) => (Number(b.metrics.sla_pct) || -1) - (Number(a.metrics.sla_pct) || -1));
    if (!items.length) {
      tbody.innerHTML = '<tr data-hours-mode-row="business"><td colspan="6" class="empty-state">Sem dados</td></tr>';
      return;
    }
    tbody.innerHTML = items.map(({ region, metrics }) => {
      const sla = Number(metrics.sla_pct);
      const mtfc = businessNumber(metrics.avg_mtfc_h);
      const mtts = businessNumber(metrics.avg_mtts_business_days);
      const slaText = Number.isFinite(sla) ? '<span style="color:' + colorForSla(sla) + ';font-weight:600">' + fmt(sla, 1) + '%</span>' : '--';
      const mtfcText = mtfc !== null ? '<span style="color:' + colorForMtfc(mtfc) + '">' + fmt(mtfc, 1) + ' h</span>' : '--';
      const mttsText = mtts !== null ? '<span style="color:' + colorForMtts(mtts) + '">' + fmt(mtts, 1) + ' d</span>' : '--';
      return '<tr data-hours-mode-row="business" data-region-key="' + region + '">' +
        '<td>' + (REGION_FLAGS[region] || '') + ' ' + (REGION_LABELS[region] || region) + '</td>' +
        '<td class="mono">' + fmtInt(metrics.closed) + '</td>' +
        '<td>' + mtfcText + '</td>' +
        '<td>' + mttsText + '</td>' +
        '<td>' + slaText + '</td>' +
        '<td>' + statusBadge(sla) + '</td>' +
      '</tr>';
    }).join('');
  }

  function renderWeeklyCommercialChartsFromTickets(rows) {
    if (typeof createBarChart !== 'function') return;
    const byRegion = businessRowsBy(rows, row => canonicalRegion(row.region));
    const regions = REGION_ORDER.filter(region => byRegion.has(region));
    if (!regions.length) {
      ['chart-monthly-sla','chart-monthly-mtfc','chart-monthly-mtts'].forEach(clearChart);
      return;
    }
    const regionMetrics = regions.map(region => computeBusinessTicketMetrics(byRegion.get(region)));
    const regionLabels = regions.map(region => REGION_LABELS[region] || region);
    const regionSla = regionMetrics.map(m => chartBusinessValue(m.sla_pct));
    const regionMtfc = regionMetrics.map(m => chartBusinessValue(m.avg_mtfc_h));
    const regionMtts = regionMetrics.map(m => chartBusinessValue(m.avg_mtts_business_days));
    const regionSig = JSON.stringify([regions, regionSla, regionMtfc, regionMtts]);
    renderBusinessChart('chart-rg-sla', regionSig + ':sla', () => createBarChart('chart-rg-sla', regionLabels, regionSla, regionSla.map(colorForSla), 'SLA por Região - Comercial'));
    renderBusinessChart('chart-rg-mtfc', regionSig + ':mtfc', () => createBarChart('chart-rg-mtfc', regionLabels, regionMtfc, regionMtfc.map(colorForMtfc), 'MTFC por Região - Comercial'));
    renderBusinessChart('chart-rg-mtts', regionSig + ':mtts', () => createBarChart('chart-rg-mtts', regionLabels, regionMtts, regionMtts.map(colorForMtts), 'MTTS por Região - Comercial'));

    const byPriority = businessRowsBy(rows, row => row.priority);
    const priorities = ['Urgente', 'Alta', 'Média', 'Baixa', 'Muito Baixa'];
    const priorityMetrics = priorities.map(priority => computeBusinessTicketMetrics(byPriority.get(priority) || []));
    const prioritySla = priorityMetrics.map(m => chartBusinessValue(m.sla_pct));
    const priorityMtfc = priorityMetrics.map(m => chartBusinessValue(m.avg_mtfc_h));
    const priorityMtts = priorityMetrics.map(m => chartBusinessValue(m.avg_mtts_business_days));
    const prioritySig = JSON.stringify([priorities, prioritySla, priorityMtfc, priorityMtts]);
    renderBusinessChart('chart-pr-sla', prioritySig + ':sla', () => createBarChart('chart-pr-sla', priorities, prioritySla, priorityMetrics.map((m, i) => m.eligible ? colorForSla(prioritySla[i]) : colorForSla(null)), 'SLA por Prioridade - Comercial'));
    renderBusinessChart('chart-pr-mtfc', prioritySig + ':mtfc', () => createBarChart('chart-pr-mtfc', priorities, priorityMtfc, priorityMetrics.map((m, i) => m.closed ? colorForMtfc(priorityMtfc[i]) : colorForMtfc(null)), 'MTFC por Prioridade - Comercial'));
    renderBusinessChart('chart-pr-mtts', prioritySig + ':mtts', () => createBarChart('chart-pr-mtts', priorities, priorityMtts, priorityMetrics.map((m, i) => m.closed ? colorForMtts(priorityMtts[i]) : colorForMtts(null)), 'MTTS por Prioridade - Comercial'));
  }
  function updateWeeklyClosedTicketTable(rows) {
    const map = new Map((rows || []).map(row => [String(row.ticket_number || ''), row]));
    document.querySelectorAll('#weekly-closed-body tr').forEach(tr => {
      const link = tr.querySelector('a.ticket-link');
      if (!link) return;
      const ticketNumber = String(link.textContent || '').replace(/[^0-9]/g, '');
      const metric = map.get(ticketNumber);
      if (!metric || !metric.business_hours) return;
      const cells = tr.children;
      if (cells.length < 6) return;
      const status = metric.business_hours.sla_status || '--';
      const mtfcHtml = commercialTicketMetricHtml(metric, 'mtfc');
      const mttsHtml = commercialTicketMetricHtml(metric, 'mtts');
      const slaHtml = status === 'Dentro SLA'
        ? '<span class="badge badge-green">Dentro SLA</span>'
        : (status === 'Fora SLA' ? '<span class="badge badge-red">Fora SLA</span>' : '<span class="badge badge-muted">--</span>');
      if (cells[3].innerHTML !== mtfcHtml) cells[3].innerHTML = mtfcHtml;
      if (cells[4].innerHTML !== mttsHtml) cells[4].innerHTML = mttsHtml;
      if (cells[5].innerHTML !== slaHtml) cells[5].innerHTML = slaHtml;
      tr.dataset.hoursModeRow = 'business';
    });
  }
  function renderMonthlyCommercialRegionTableFromTickets(rows) {
    const tbody = document.getElementById('mrm-region-tbody');
    if (!tbody) return;
    const grouped = businessRowsBy(rows, row => canonicalRegion(row.region));
    const items = REGION_ORDER
      .filter(region => grouped.has(region))
      .map(region => ({ region, metrics: computeBusinessTicketMetrics(grouped.get(region)) }))
      .filter(item => item.metrics.closed > 0)
      .sort((a, b) => (Number(b.metrics.sla_pct) || -1) - (Number(a.metrics.sla_pct) || -1));
    if (!items.length) {
      tbody.innerHTML = '<tr data-hours-mode-row="business"><td colspan="6" class="empty-state">Sem dados</td></tr>';
      return;
    }
    tbody.innerHTML = items.map(({ region, metrics }) => {
      const sla = businessNumber(metrics.sla_pct);
      const mtfc = businessNumber(metrics.avg_mtfc_h);
      const mtts = businessNumber(metrics.avg_mtts_business_days);
      const slaText = sla !== null ? '<span style="color:' + colorForSla(sla) + ';font-weight:600">' + fmt(sla, 1) + '%</span>' : '--';
      const mtfcText = mtfc !== null ? '<span style="color:' + colorForMtfc(mtfc) + '">' + fmt(mtfc, 1) + ' h</span>' : '--';
      const mttsText = mtts !== null ? '<span style="color:' + colorForMtts(mtts) + '">' + fmt(mtts, 1) + ' d</span>' : '--';
      return '<tr data-hours-mode-row="business" data-region-key="' + region + '">' +
        '<td>' + (REGION_FLAGS[region] || '') + ' ' + (REGION_LABELS[region] || region) + '</td>' +
        '<td class="mono">' + fmtInt(metrics.closed) + '</td>' +
        '<td>' + mtfcText + '</td>' +
        '<td>' + mttsText + '</td>' +
        '<td>' + slaText + '</td>' +
        '<td>' + statusBadge(sla) + '</td>' +
      '</tr>';
    }).join('');
  }

  function renderMonthlyCommercialChartsFromTickets(rows) {
    if (typeof createBarChart !== 'function') return;
    const byRegion = businessRowsBy(rows, row => canonicalRegion(row.region));
    const regions = REGION_ORDER.filter(region => byRegion.has(region));
    if (!regions.length) {
      ['chart-monthly-sla','chart-monthly-mtfc','chart-monthly-mtts'].forEach(clearChart);
      return;
    }
    const regionMetrics = regions.map(region => computeBusinessTicketMetrics(byRegion.get(region)));
    const labels = regions.map(region => REGION_LABELS[region] || region);
    const slaValues = regionMetrics.map(m => chartBusinessValue(m.sla_pct));
    const mtfcValues = regionMetrics.map(m => chartBusinessValue(m.avg_mtfc_h));
    const mttsValues = regionMetrics.map(m => chartBusinessValue(m.avg_mtts_business_days));
    const sig = JSON.stringify([regions, slaValues, mtfcValues, mttsValues]);
    if (typeof createBarChartWithTarget === 'function') {
      renderBusinessChart('chart-monthly-sla', sig + ':sla', () => createBarChartWithTarget('chart-monthly-sla', labels, slaValues, regionMetrics.map((m, i) => m.eligible ? colorForSla(slaValues[i]) : colorForSla(null)), 'SLA Compliance por Região - Comercial', 80, 'Meta', 105));
    } else {
      renderBusinessChart('chart-monthly-sla', sig + ':sla', () => createBarChart('chart-monthly-sla', labels, slaValues, regionMetrics.map((m, i) => m.eligible ? colorForSla(slaValues[i]) : colorForSla(null)), 'SLA Compliance por Região - Comercial'));
    }
    renderBusinessChart('chart-monthly-mtfc', sig + ':mtfc', () => createBarChart('chart-monthly-mtfc', labels, mtfcValues, regionMetrics.map((m, i) => m.closed ? colorForMtfc(mtfcValues[i]) : colorForMtfc(null)), 'MTFC Médio por Região - Comercial'));
    renderBusinessChart('chart-monthly-mtts', sig + ':mtts', () => createBarChart('chart-monthly-mtts', labels, mttsValues, regionMetrics.map((m, i) => m.closed ? colorForMtts(mttsValues[i]) : colorForMtts(null)), 'MTTS Médio por Região - Comercial'));
  }

  function monthlyRegionSlaMapFromTickets(rows) {
    const grouped = businessRowsBy(rows, row => canonicalRegion(row.region));
    const out = {};
    REGION_ORDER.forEach(region => {
      const metrics = grouped.has(region) ? computeBusinessTicketMetrics(grouped.get(region)) : null;
      out[region] = metrics && metrics.eligible ? businessNumber(metrics.sla_pct) : null;
    });
    return out;
  }

  function installMonthlyCommercialMapTooltip(svg) {
    if (!svg || svg.dataset.businessTooltipInstalled === '1') return;
    svg.dataset.businessTooltipInstalled = '1';
    svg.addEventListener('mousemove', event => {
      if (mode() !== MODE_BUSINESS) return;
      const path = event.target && event.target.closest ? event.target.closest('path[data-region]') : null;
      const tooltip = document.getElementById('map-tooltip');
      if (!path || !tooltip) return;
      const region = canonicalRegion(path.dataset.region);
      const slaMap = svg._businessRegionSla || {};
      const sla = Object.prototype.hasOwnProperty.call(slaMap, region) ? slaMap[region] : null;
      const status = sla === null ? 'Sem dados' : sla >= 80 ? 'Meta Atingida' : sla >= 50 ? 'Atenção' : 'Crítico';
      tooltip.innerHTML = '<strong>' + (REGION_LABELS[region] || region) + '</strong><br>' +
        'SLA%: ' + (sla !== null ? fmt(sla, 1) + '%' : '--') + '<br>' +
        '<span style="color:' + colorForSla(sla) + '">' + status + '</span>';
    });
  }

  function updateMonthlyCommercialMapFromTickets(rows, attempt) {
    const svg = document.getElementById('world-map-svg');
    if (!svg) return;
    const paths = svg.querySelectorAll('path[data-region]');
    if (!paths.length) {
      const nextAttempt = Number(attempt || 0);
      if (nextAttempt < 10) {
        setTimeout(() => {
          if (mode() === MODE_BUSINESS) updateMonthlyCommercialMapFromTickets(rows, nextAttempt + 1);
        }, 200);
      }
      return;
    }
    const selected = selectedRegionFilter();
    const slaMap = monthlyRegionSlaMapFromTickets(rows);
    svg._businessRegionSla = slaMap;
    installMonthlyCommercialMapTooltip(svg);
    paths.forEach(path => {
      const region = canonicalRegion(maybeRepairText(path.dataset.region));
      const visible = !selected || region === selected;
      const sla = visible && Object.prototype.hasOwnProperty.call(slaMap, region) ? slaMap[region] : null;
      const fill = colorForSla(sla);
      path.setAttribute('fill', fill);
      path.style.fill = fill;
    });
  }

  function scheduleMonthlyCommercialMapRefresh(rows) {
    [150, 500, 1200].forEach(delay => {
      setTimeout(() => {
        if (mode() === MODE_BUSINESS) updateMonthlyCommercialMapFromTickets(rows);
      }, delay);
    });
  }

  function updateMonthlyCommercialTrendFromTickets(audit, period, metrics) {
    if (!Array.isArray(audit.monthly_periods) || !period) return;
    const index = audit.monthly_periods.findIndex(item => item.key === period.key);
    const prev = index >= 0 ? audit.monthly_periods[index + 1] : null;
    if (!prev) return;
    const prevRows = filterMonthlyBusinessTickets(monthlyTicketRows(prev));
    const prevMetrics = computeBusinessTicketMetrics(prevRows);
    setDelta('sla', metrics.sla_pct, prevMetrics.sla_pct, false, '%');
    setDelta('mtfc', metrics.avg_mtfc_h, prevMetrics.avg_mtfc_h, true, 'h');
    setDelta('mtts', metrics.avg_mtts_business_days, prevMetrics.avg_mtts_business_days, true, 'd');
  }

  function updateMonthlyClosedTicketTable(rows) {
    const map = new Map((rows || []).map(row => [String(row.ticket_number || ''), row]));
    document.querySelectorAll('#closed-tickets-body tr').forEach(tr => {
      const link = tr.querySelector('a.ticket-link');
      if (!link) return;
      const ticketNumber = String(link.textContent || '').replace(/[^0-9]/g, '');
      const metric = map.get(ticketNumber);
      if (!metric || !metric.business_hours) return;
      const cells = tr.children;
      if (cells.length < 6) return;
      const status = metric.business_hours.sla_status || '--';
      const mtfcHtml = commercialTicketMetricHtml(metric, 'mtfc');
      const mttsHtml = commercialTicketMetricHtml(metric, 'mtts');
      const slaHtml = status === 'Dentro SLA'
        ? '<span class="badge badge-green">Dentro SLA</span>'
        : (status === 'Fora SLA' ? '<span class="badge badge-red">Fora SLA</span>' : '<span class="badge badge-muted">--</span>');
      if (cells[3].innerHTML !== mtfcHtml) cells[3].innerHTML = mtfcHtml;
      if (cells[4].innerHTML !== mttsHtml) cells[4].innerHTML = mttsHtml;
      if (cells[5].innerHTML !== slaHtml) cells[5].innerHTML = slaHtml;
      tr.dataset.hoursModeRow = 'business';
    });
  }
  function renderWeeklyCommercialRegionTable(period) {
    const tbody = document.getElementById('region-table-body');
    if (!tbody) return;
    const rows = periodRegionRows(period);
    const sig = JSON.stringify(rows.map(item => [item.region, item.metrics.closed, item.metrics.business_hours && item.metrics.business_hours.sla_pct, item.metrics.business_hours && item.metrics.business_hours.avg_mtfc_h, item.metrics.business_hours && item.metrics.business_hours.avg_mtts_business_days]));
    if (tbody.dataset.businessHoursSig === sig && tbody.querySelector('[data-hours-mode-row="business"]')) return;
    tbody.dataset.businessHoursSig = sig;
    if (!rows.length) {
      tbody.innerHTML = '<tr data-hours-mode-row="business"><td colspan="6" class="empty-state">Sem dados</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(({ region, metrics }) => {
      const bh = metrics.business_hours || {};
      const sla = Number(bh.sla_pct);
      const mtfc = businessNumber(bh.avg_mtfc_h);
      const mtts = businessNumber(bh.avg_mtts_business_days);
      const slaText = Number.isFinite(sla) ? '<span style="color:' + colorForSla(sla) + ';font-weight:600">' + fmt(sla, 1) + '%</span>' : '--';
      const mtfcText = mtfc !== null ? '<span style="color:' + colorForMtfc(mtfc) + '">' + fmt(mtfc, 1) + ' h</span>' : '--';
      const mttsText = mtts !== null ? '<span style="color:' + colorForMtts(mtts) + '">' + fmt(mtts, 1) + ' d</span>' : '--';
      return '<tr data-hours-mode-row="business" data-region-key="' + region + '">' +
        '<td>' + (REGION_FLAGS[region] || '') + ' ' + (REGION_LABELS[region] || region) + '</td>' +
        '<td class="mono">' + fmtInt(metrics.closed) + '</td>' +
        '<td>' + mtfcText + '</td>' +
        '<td>' + mttsText + '</td>' +
        '<td>' + slaText + '</td>' +
        '<td>' + statusBadge(sla) + '</td>' +
      '</tr>';
    }).join('');
  }

  function renderWeeklyCommercialCharts(period) {
    const rows = periodRegionRows(period);
    if (!rows.length) {
      ['chart-rg-sla','chart-rg-mtfc','chart-rg-mtts'].forEach(clearChart);
      return;
    }
    const labels = rows.map(item => REGION_LABELS[item.region] || item.region);
    const keys = rows.map(item => item.region);
    const slaValues = rows.map(item => {
      const v = Number(item.metrics.business_hours && item.metrics.business_hours.sla_pct);
      return Number.isFinite(v) ? Number(v.toFixed(1)) : 0;
    });
    const mtfcValues = rows.map(item => {
      const v = Number(item.metrics.business_hours && item.metrics.business_hours.avg_mtfc_h);
      return Number.isFinite(v) ? Number(v.toFixed(1)) : 0;
    });
    const mttsValues = rows.map(item => {
      const v = Number(item.metrics.business_hours && item.metrics.business_hours.avg_mtts_business_days);
      return Number.isFinite(v) ? Number(v.toFixed(1)) : 0;
    });
    const sig = JSON.stringify({ key: period && period.key, rows: rows.map(item => [item.region, item.metrics.closed, item.metrics.business_hours]) });
    if (typeof createBarChart === 'function') {
      renderBusinessChart('chart-rg-sla', sig + ':sla', () => createBarChart('chart-rg-sla', labels, slaValues, slaValues.map(colorForSla), 'SLA por Região - Comercial'));
      renderBusinessChart('chart-rg-mtfc', sig + ':mtfc', () => createBarChart('chart-rg-mtfc', labels, mtfcValues, mtfcValues.map(colorForMtfc), 'MTFC por Região - Comercial'));
      renderBusinessChart('chart-rg-mtts', sig + ':mtts', () => createBarChart('chart-rg-mtts', labels, mttsValues, mttsValues.map(colorForMtts), 'MTTS por Região - Comercial'));
    }
  }

  function setWeeklyDelta(metric, curr, prev, inverted, unit) {
    const arrowEl = document.getElementById('delta-' + metric + '-arrow');
    const valueEl = document.getElementById('delta-' + metric + '-value');
    const metaEl = document.getElementById('delta-' + metric + '-meta');
    if (!arrowEl || !valueEl || !metaEl) return;
    const c = Number(curr);
    const p = Number(prev);
    if (!Number.isFinite(c) || !Number.isFinite(p) || p === 0) {
      arrowEl.textContent = '-';
      valueEl.textContent = '--';
      metaEl.textContent = '--';
      return;
    }
    const delta = ((c - p) / Math.abs(p)) * 100;
    const neutral = Math.abs(delta) < 0.5;
    const improved = inverted ? delta < 0 : delta > 0;
    const color = neutral ? 'var(--color-text-muted)' : (improved ? '#12DF34' : '#E31424');
    arrowEl.textContent = neutral ? '-' : (delta > 0 ? '▲' : '▼');
    arrowEl.style.color = color;
    valueEl.textContent = (neutral ? '+/-' : (delta > 0 ? '+' : '')) + fmt(delta, 2) + '%';
    valueEl.style.color = color;
    metaEl.textContent = fmt(c, 2) + unit + ' vs ' + fmt(p, 2) + unit;
  }

  function updateWeeklyCommercialTrend(audit, period) {
    if (!Array.isArray(audit.weekly_periods) || !period) return;
    const baseKey = String(period && period.key || '').split('::')[0];
    const index = audit.weekly_periods.findIndex(item => item.key === baseKey);
    const prev = index >= 0 ? audit.weekly_periods[index + 1] : null;
    if (!prev) return;
    const currBh = period.metrics && period.metrics.business_hours || {};
    const prevRows = filterWeeklyBusinessTickets(weeklyTicketRows(prev));
    const prevBh = computeBusinessTicketMetrics(prevRows);
    setWeeklyDelta('sla', currBh.sla_pct, prevBh.sla_pct, false, '%');
    setWeeklyDelta('mtfc', currBh.avg_mtfc_h, prevBh.avg_mtfc_h, true, 'h');
    setWeeklyDelta('mtts', currBh.avg_mtts_business_days, prevBh.avg_mtts_business_days, true, 'd');
  }
  function applyWeeklyCommercialDetails(audit, period) {
    renderWeeklyCommercialRegionTable(period);
    renderWeeklyCommercialCharts(period);
    updateWeeklyCommercialTrend(audit, period);
  }
  function applyMonthlyCommercialDetails(audit, period) {
    renderMonthlyCommercialRegionTable(period);
    renderMonthlyCommercialCharts(period);
    updateMonthlyCommercialMap(period);
    updateMonthlyCommercialTrend(audit, period);
  }
  async function applyBusinessHoursOverride() {
    if (applying) return;
    applying = true;
    try {
      if (mode() !== MODE_BUSINESS) {
        const note = document.getElementById('hours-mode-note');
        if (note) note.style.display = 'none';
        return;
      }
      let audit;
      try { audit = await loadAudit(); } catch (error) { console.warn(error); return; }
      const path = location.pathname.toLowerCase();

      if (path.includes('page2-backlog')) {
        const dailyMetricIds = ['kpi-over-10', 'kpi-avg-aging'];
        clearBadges(dailyMetricIds);
        decorateNote('Modo comercial: na Daily, backlog, aging medio e fila critica permanecem em dias corridos por ticket. Horas comerciais serao aplicadas aqui somente quando houver granularidade comercial por ticket.');
      } else if (path.includes('page4-weekly')) {
        const weeklyMetricIds = ['kpi-sla', 'kpi-mtfc', 'kpi-mtts'];
        if (hasUnsupportedWeeklyBusinessFilter(currentFilters())) {
          clearBadges(weeklyMetricIds);
          decorateNote('Modo comercial: com cross-filter ativo, SLA/MTFC/MTTS permanecem comuns filtrados nesta etapa. Limpe o cross-filter para ver os calculos comerciais.');
          return;
        }
        const period = selectedWeeklyPeriodObject(audit);
        const ticketRows = filterWeeklyBusinessTickets(weeklyTicketRows(period));
        setWeeklyBusinessTicketMap(ticketRows);
        if (ticketRows.length) {
          const metrics = computeBusinessTicketMetrics(ticketRows);
          setText('kpi-sla', metrics.eligible ? `${fmt(metrics.sla_pct, 2)}%` : '--');
          setText('kpi-mtfc', metrics.closed ? `${fmt(metrics.avg_mtfc_h, 2)} h` : '--');
          setText('kpi-mtts', metrics.closed ? `${fmt(metrics.avg_mtts_business_days, 2)} d` : '--');
          weeklyMetricIds.forEach(setBadge);
          updateCommercialKpiCardColors({ sla: 'kpi-sla', mtfc: 'kpi-mtfc', mtts: 'kpi-mtts' }, metrics);
          renderWeeklyCommercialRegionTableFromTickets(ticketRows);
          renderWeeklyCommercialChartsFromTickets(ticketRows);
          updateWeeklyClosedTicketTable(ticketRows);
          updateWeeklyCommercialTrend(audit, { key: period.key, metrics: { business_hours: metrics }, by_region: {} });
          decorateNote('Modo comercial: Criados, Fechados e Backlog permanecem comuns; SLA, MTFC, MTTS, graficos e tabela de fechados usam metricas comerciais por ticket no recorte filtrado.');
        } else {
          setWeeklyBusinessTicketMap([]);
          clearBadges(weeklyMetricIds);
          updateCommercialKpiCardColors({ sla: 'kpi-sla', mtfc: 'kpi-mtfc', mtts: 'kpi-mtts' }, { closed: 0, eligible: 0 });
          decorateNote('Modo comercial: sem tickets fechados com metrica comercial para o recorte semanal filtrado.');
        }
      } else if (path.includes('page5-monthly')) {
        const monthlyMetricIds = ['monthly-kpi-sla', 'monthly-kpi-mtfc', 'monthly-kpi-mtts'];
        const period = selectedMonthlyPeriodObject(audit);
        const ticketRows = filterMonthlyBusinessTickets(monthlyTicketRows(period));
        setMonthlyBusinessTicketMap(ticketRows);
        if (ticketRows.length) {
          const metrics = computeBusinessTicketMetrics(ticketRows);
          setText('monthly-kpi-sla', metrics.eligible ? `${fmt(metrics.sla_pct, 2)}%` : '--');
          setText('monthly-kpi-mtfc', metrics.closed ? `${fmt(metrics.avg_mtfc_h, 2)} h` : '--');
          setText('monthly-kpi-mtts', metrics.closed ? `${fmt(metrics.avg_mtts_business_days, 2)} d` : '--');
          monthlyMetricIds.forEach(setBadge);
          updateCommercialKpiCardColors({ sla: 'monthly-kpi-sla', mtfc: 'monthly-kpi-mtfc', mtts: 'monthly-kpi-mtts' }, metrics);
          renderMonthlyCommercialRegionTableFromTickets(ticketRows);
          renderMonthlyCommercialChartsFromTickets(ticketRows);
          updateMonthlyCommercialMapFromTickets(ticketRows);
          scheduleMonthlyCommercialMapRefresh(ticketRows);
          updateMonthlyClosedTicketTable(ticketRows);
          updateMonthlyCommercialTrendFromTickets(audit, period, metrics);
          decorateNote('Modo comercial: Fechados e Backlog permanecem comuns; SLA, MTFC, MTTS, mapa, tabela regional, graficos e tabela de fechados usam metricas comerciais por ticket no recorte filtrado.');
        } else {
          setMonthlyBusinessTicketMap([]);
          clearBadges(monthlyMetricIds);
          updateCommercialKpiCardColors({ sla: 'monthly-kpi-sla', mtfc: 'monthly-kpi-mtfc', mtts: 'monthly-kpi-mtts' }, { closed: 0, eligible: 0 });
          renderMonthlyCommercialRegionTableFromTickets([]);
          renderMonthlyCommercialChartsFromTickets([]);
          updateMonthlyCommercialMapFromTickets([]);
          scheduleMonthlyCommercialMapRefresh([]);
          decorateNote('Modo comercial: sem tickets fechados com metrica comercial para o recorte mensal filtrado.');
        }      } else if (path.includes('kanban-status')) {
        applyKanban(audit);
        decorateNote('Modo comercial: media, mediana e P90 do Kanban usam horas comerciais por pais quando ha pais exato.');
      }
    } finally {
      applying = false;
    }
  }

  function normalizeStatus(text) {
    return String(text || '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function applyKanban(audit) {
    const kanban = audit.kanban || {};
    const map = new Map(Object.entries(kanban).map(([k, v]) => [normalizeStatus(k), v]));
    document.querySelectorAll('.kanban-col').forEach(col => {
      const title = col.querySelector('.kanban-col-header span, .kanban-col-header, h3, h4');
      const key = normalizeStatus(title ? title.textContent : '');
      const item = map.get(key);
      if (!item) return;
      const values = col.querySelectorAll('.kanban-metric-value');
      if (values[0]) values[0].textContent = formatHours(item.bh_avg_h);
      if (values[1]) values[1].textContent = formatHours(item.bh_median_h);
      if (values[2]) values[2].textContent = formatHours(item.bh_p90_h);
    });
  }

  function scheduleApply() {
    if (applyTimer) clearTimeout(applyTimer);
    applyTimer = setTimeout(applyBusinessHoursOverride, 120);
  }

  function formatHours(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '--';
    if (n < 1) return `${Math.round(n * 60)}min`;
    if (n < 24) return `${n.toFixed(1)}h`;
    return `${(n / 24).toFixed(1)} dias`;
  }

  function installObserver() {
    if (observer) observer.disconnect();
    observer = new MutationObserver(() => {
      if (applying) return;
      ensureControl();
      scheduleRepair();
      if (mode() === MODE_BUSINESS) scheduleApply();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    ensureStyles();
    ensureControl();
    repairMojibake(document.body);
    installObserver();
    updateButtons();
    setTimeout(ensureControl, 250);
    setTimeout(ensureControl, 1000);
    setTimeout(scheduleRepair, 250);
    setTimeout(applyBusinessHoursOverride, 500);
    window.addEventListener('load', () => {
      ensureControl();
      scheduleRepair();
      setTimeout(applyBusinessHoursOverride, 250);
    });
    window.addEventListener('change', event => {
      if (event.target && (event.target.id === 'week-selector' || event.target.id === 'filter-month-year')) {
        clearBusinessChartCache();
        setTimeout(applyBusinessHoursOverride, 250);
      }
    });
    document.addEventListener('filterschange', () => {
      clearBusinessChartCache();
      setTimeout(applyBusinessHoursOverride, 250);
    });
  }

  function safeInitBusinessHoursMode() {
    try { init(); } catch (error) { console.warn('business hours mode disabled after init error', error); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', safeInitBusinessHoursMode);
  else safeInitBusinessHoursMode();
})();



















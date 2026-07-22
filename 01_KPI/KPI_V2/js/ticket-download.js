(function () {
  const state = { tickets: [], filtered: [], previewLimit: 250 };
  const fields = [
    ['ticket_number', 'Ticket #', row => row.ticket_number],
    ['subject', 'Assunto', row => row.subject],
    ['status', 'Status', row => row.status],
    ['priority', 'Prioridade', row => row.priority_standard || row.priority],
    ['region', 'Regiao', row => row.regiao_grupo || row.region],
    ['pais', 'Pais', row => row.pais || row.regiao || row.source_region],
    ['department_name', 'Departamento', row => row.department_name],
    ['grupo_operacional_agente', 'Grupo do agente', row => row.grupo_operacional_agente],
    ['agent_name', 'Agente', row => row.agent_name],
    ['contact_name', 'Solicitante', row => row.contact_name],
    ['contact_email', 'Email solicitante', row => row.contact_email],
    ['tipo_atendimento', 'Tipo', row => row.tipo_atendimento],
    ['produtos', 'Produto', row => row.produtos || row.marca_produto],
    ['categoria', 'Categoria', row => row.categoria || row.categoria_custom],
    ['created_time', 'Criado em', row => formatDateTime(row.created_time)],
    ['closed_time', 'Fechado em', row => formatDateTime(row.closed_time)],
    ['due_date', 'Vencimento', row => formatDateTime(row.due_date)],
    ['response_due_date', 'Venc. resposta', row => formatDateTime(row.response_due_date)],
    ['mtfc_horas_bi', 'MTFC h', row => numeric(row.mtfc_horas_bi, row.mtfc_horas)],
    ['mtts_dias_bi', 'MTTS d', row => numeric(row.mtts_dias_bi, row.mtts_dias)],
    ['aging_backlog_dias', 'Aging d', row => numeric(row.aging_backlog_dias)],
    ['is_open', 'Aberto', row => boolText(row.is_open)],
    ['is_closed', 'Fechado', row => boolText(row.is_closed)],
    ['is_sla_eligible', 'Elegivel SLA', row => boolText(row.is_sla_eligible)],
    ['sla_status_bi', 'Status SLA', row => row.sla_status_bi],
    ['meta_mtfc_horas', 'Meta MTFC h', row => numeric(row.meta_mtfc_horas)],
    ['meta_mtts_dias', 'Meta MTTS d', row => numeric(row.meta_mtts_dias)],
    ['ticket_id', 'Ticket ID', row => row.ticket_id || row.id],
    ['agent_email', 'Email agente', row => row.agent_email]
  ];

  const $ = id => document.getElementById(id);
  const tx = (key, fallback) => typeof t === 'function' ? t(key) : (fallback || key);

  function fmtInt(value) {
    return new Intl.NumberFormat(currentLanguage()).format(Number(value || 0));
  }

  function currentLanguage() {
    return typeof getLang === 'function' ? getLang() : 'pt';
  }

  function numeric() {
    for (let i = 0; i < arguments.length; i += 1) {
      const value = arguments[i];
      if (value === null || value === undefined || value === '') continue;
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return '';
  }

  function boolText(value) {
    if (value === true) return 'Sim';
    if (value === false) return 'Nao';
    return '';
  }

  function formatDateTime(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(d);
  }

  function isoDateOnly(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function downloadFilename() {
    const today = new Date().toISOString().slice(0, 10);
    return 'tickets_playbook_' + today + '.xls';
  }

  function optionLabel(value) {
    return value === '__all__' ? tx('filter_all', 'Todos') : (value || '--');
  }

  function uniqueValues(accessor) {
    return [...new Set(state.tickets.map(accessor).filter(v => v !== null && v !== undefined && String(v).trim() !== ''))]
      .map(String)
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }

  function fillSelect(id, values) {
    const select = $(id);
    if (!select) return;
    const current = select.value || '__all__';
    select.innerHTML = '<option value="__all__">' + escapeHtml(tx('filter_all', 'Todos')) + '</option>' + values.map(value => '<option value="' + escapeHtml(value) + '">' + escapeHtml(value) + '</option>').join('');
    select.value = [...select.options].some(opt => opt.value === current) ? current : '__all__';
  }

  function populateFilters() {
    fillSelect('filter-region', uniqueValues(row => row.regiao_grupo || row.region));
    fillSelect('filter-status', uniqueValues(row => row.status));
    fillSelect('filter-priority', uniqueValues(row => row.priority_standard || row.priority));
    fillSelect('filter-department', uniqueValues(row => row.department_name));
    fillSelect('filter-agent-group', uniqueValues(row => row.grupo_operacional_agente));
  }

  function filterTickets() {
    const query = String($('filter-search').value || '').trim().toLowerCase();
    const region = $('filter-region').value;
    const status = $('filter-status').value;
    const priority = $('filter-priority').value;
    const department = $('filter-department').value;
    const agentGroup = $('filter-agent-group').value;
    const dateField = $('filter-date-field').value || 'created_time';
    const from = $('filter-date-from').value;
    const to = $('filter-date-to').value;

    state.filtered = state.tickets.filter(row => {
      if (query) {
        const haystack = [row.ticket_number, row.subject, row.contact_name, row.contact_email, row.agent_name, row.status, row.produtos, row.tipo_atendimento]
          .map(v => String(v || '').toLowerCase())
          .join(' ');
        if (!haystack.includes(query)) return false;
      }
      if (region !== '__all__' && String(row.regiao_grupo || row.region || '') !== region) return false;
      if (status !== '__all__' && String(row.status || '') !== status) return false;
      if (priority !== '__all__' && String(row.priority_standard || row.priority || '') !== priority) return false;
      if (department !== '__all__' && String(row.department_name || '') !== department) return false;
      if (agentGroup !== '__all__' && String(row.grupo_operacional_agente || '') !== agentGroup) return false;
      const dateValue = isoDateOnly(row[dateField]);
      if (from && (!dateValue || dateValue < from)) return false;
      if (to && (!dateValue || dateValue > to)) return false;
      return true;
    });
  }

  function renderKpis() {
    $('kpi-total').textContent = fmtInt(state.tickets.length);
    $('kpi-filtered').textContent = fmtInt(state.filtered.length);
    $('kpi-open').textContent = fmtInt(state.filtered.filter(row => row.is_open === true || (!row.closed_time && row.is_closed !== true)).length);
    $('kpi-closed').textContent = fmtInt(state.filtered.filter(row => row.is_closed === true || !!row.closed_time).length);
  }

  function renderPreview() {
    const head = $('preview-head');
    const body = $('preview-body');
    head.innerHTML = fields.slice(0, 14).map(([, label]) => '<th>' + escapeHtml(label) + '</th>').join('');
    const rows = state.filtered.slice(0, state.previewLimit);
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="14" class="download-empty">' + escapeHtml(tx('no_filter_data', 'Sem dados para o filtro atual')) + '</td></tr>';
      return;
    }
    body.innerHTML = rows.map(row => '<tr>' + fields.slice(0, 14).map(([key, , getter]) => {
      const value = getter(row);
      const cls = key === 'ticket_number' || key === 'status' ? ' class="mono"' : '';
      return '<td' + cls + '>' + escapeHtml(value) + '</td>';
    }).join('') + '</tr>').join('');
  }

  function renderStatus() {
    const shown = Math.min(state.filtered.length, state.previewLimit);
    $('download-status').textContent = tx('ticket_download_preview_status', 'Previa') + ': ' + fmtInt(shown) + ' / ' + fmtInt(state.filtered.length) + ' tickets';
  }

  function renderAll() {
    filterTickets();
    renderKpis();
    renderPreview();
    renderStatus();
  }

  function buildExcelHtml() {
    const header = fields.map(([, label]) => '<th>' + escapeHtml(label) + '</th>').join('');
    const rows = state.filtered.map(row => '<tr>' + fields.map(([, , getter]) => '<td>' + escapeHtml(getter(row)) + '</td>').join('') + '</tr>').join('');
    return '<html><head><meta charset="UTF-8"></head><body><table border="1"><thead><tr>' + header + '</tr></thead><tbody>' + rows + '</tbody></table></body></html>';
  }

  function downloadExcel() {
    renderAll();
    const blob = new Blob(['﻿', buildExcelHtml()], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFilename();
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  async function loadTickets() {
    $('download-meta').textContent = tx('ticket_download_loading', 'Carregando tickets...');
    const result = await fetchDashboardBiTickets(10000);
    state.tickets = Array.isArray(result.tickets) ? result.tickets : [];
    state.filtered = [...state.tickets];
    $('download-meta').textContent = fmtInt(state.tickets.length) + ' ' + tx('ticket_download_loaded', 'tickets disponiveis para exportacao');
    $('last-sync').textContent = tx('last_update', 'Ultima atualizacao') + ': ' + new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date());
    populateFilters();
    renderAll();
  }

  function bindEvents() {
    ['filter-search','filter-region','filter-status','filter-priority','filter-department','filter-agent-group','filter-date-field','filter-date-from','filter-date-to'].forEach(id => {
      const el = $(id);
      if (!el) return;
      el.addEventListener(id === 'filter-search' ? 'input' : 'change', renderAll);
    });
    $('btn-clear').addEventListener('click', () => {
      ['filter-search','filter-date-from','filter-date-to'].forEach(id => { $(id).value = ''; });
      ['filter-region','filter-status','filter-priority','filter-department','filter-agent-group'].forEach(id => { $(id).value = '__all__'; });
      $('filter-date-field').value = 'created_time';
      renderAll();
    });
    $('btn-refresh').addEventListener('click', () => loadTickets().catch(showError));
    $('btn-download-xls').addEventListener('click', downloadExcel);
    document.addEventListener('langchange', () => {
      populateFilters();
      renderAll();
    });
  }

  function showError(error) {
    const main = document.querySelector('.app-main');
    if (main) main.innerHTML = '<section class="card"><h2>Erro ao carregar tickets</h2><p>' + escapeHtml(error.message) + '</p></section>';
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    loadTickets().catch(showError).finally(() => document.documentElement.classList.remove('playbook-auth-pending'));
  });
})();

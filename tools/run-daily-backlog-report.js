'use strict';

const fs = require('fs/promises');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.PLAYBOOK_SUPABASE_URL || 'https://bryegtpdjqpwtyefoznq.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.PLAYBOOK_SUPABASE_ANON_KEY || process.env.PLAYBOOK_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyeWVndHBkanFwd3R5ZWZvem5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0OTIwMzQsImV4cCI6MjA5ODA2ODAzNH0.348rGiyn6n3TMZ_I5fayRclAagSB70_d4CrEUtcJU5k';
const SYSTEM_URL = 'https://globalplaybook.netlify.app/01_kpi/kpi_v2/page2-backlog';
const DASHBOARD_READ_URL = `${SUPABASE_URL}/functions/v1/dashboard-read`;
const BACKLOG_LIMIT = Number(process.env.BACKLOG_LIMIT || 10000);
const OFICINA_DEPT_ID = '1128522000008788112';
const OUTLOOK_TO_RECIPIENTS = [
  { name: 'Vitor Hugo Do Bem Donizetti', email: 'vitor.donizetti@alliage-global.com' },
  { name: 'Ygor Oliveira', email: 'ygor.oliveira@alliage-global.com' },
  { name: null, email: 'khuang@PreXion.com' },
  { name: null, email: 'gabriel.pedroso@alliage-dental.com' },
  { name: 'Renata Goulart Alves', email: 'renata.alves@alliage-global.com' }
];

const REGION_MAP = {
  Brasil: 'Brasil',
  Argentina: 'Argentina',
  'Mexico': 'Mexico',
  'M\u00e9xico': 'Mexico',
  'Am\u00e9rica latina - Exceto Argentina e M\u00e9xico': 'LATAM',
  'Estados Unidos': 'USA',
  EUA: 'USA',
  USA: 'USA',
  '\u00c1frica': 'ROW',
  '\u00c1sia': 'ROW',
  Europa: 'ROW',
  '\u00cdndia': 'ROW',
  Oceania: 'ROW',
  ROW: 'ROW',
  LATAM: 'LATAM'
};

const REGION_GROUPS = ['Brasil', 'Argentina', 'Mexico', 'LATAM', 'USA', 'ROW'];
const DEFAULT_AGENT_GROUPS = ['Suporte geral', 'Especialista', 'Sem dono'];
const SORT_PRIORITY = { Urgente: 1, Alta: 2, Media: 3, 'M\u00e9dia': 3, Baixa: 4, 'Muito Baixa': 5 };
const EXCLUDED_TICKET_NUMBERS = ['220822', '236429', '236430'];
const EXCLUDED_CONTACT_DOMAINS = ['unicorndenmart.com', 'webpeak.com.br'];

function pad(value) {
  return String(value).padStart(2, '0');
}

function timestampParts(date = new Date()) {
  return {
    year: date.getFullYear(),
    month: pad(date.getMonth() + 1),
    day: pad(date.getDate()),
    hour: pad(date.getHours()),
    minute: pad(date.getMinutes())
  };
}

function normalizeStatus(value) {
  return String(value || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function metricNumber(...values) {
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return NaN;
}

function formatNumber(value, digits = 0) {
  if (!Number.isFinite(Number(value))) return '--';
  return Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function isExcludedTicket(ticket) {
  if (EXCLUDED_TICKET_NUMBERS.includes(String(ticket.ticket_number || ''))) return true;
  const email = String(ticket.email || ticket.contact_email || '').toLowerCase().trim();
  if (EXCLUDED_CONTACT_DOMAINS.some((domain) => email.endsWith(`@${domain}`) || email.includes(`@${domain}`))) {
    return true;
  }
  return false;
}

function getTicketRegionGroup(ticket) {
  const raw = ticket.regiao_grupo || ticket.region || '';
  return REGION_MAP[raw] || raw || 'Sem regiao';
}

function getTicketPriority(ticket) {
  return ticket.priority_standard || ticket.priority || '';
}

function getTicketAgentGroup(ticket) {
  if (ticket.grupo_operacional_agente) return ticket.grupo_operacional_agente;

  const categoria = String(ticket.categoria_custom || ticket.categoria || '').toLowerCase().trim();
  const tipoAtend = String(ticket.tipo_atendimento || '').toLowerCase().trim();
  const firstName = String(ticket.agent_name || '').split(' ')[0].trim();

  if (categoria.includes('instala') || tipoAtend.includes('instala')) return 'Instalacao';
  if (!firstName || firstName === '-' || ['Alliage', 'Norberto'].includes(firstName)) return 'Sem dono';
  if (['Danielly', 'Contato'].includes(firstName)) return 'Terceiro';
  if (['Camila', 'Ademar'].includes(firstName)) return 'Especialista';
  return 'Suporte geral';
}

function agingDays(ticket) {
  return Number(ticket.aging_backlog_dias ?? ticket.aging_days ?? ticket.aging_dias ?? 0);
}

function hasFirstResponse(ticket) {
  return Number.isFinite(metricNumber(ticket.mtfc_horas_bi, ticket.mtfc_horas));
}

function isDependencyStatusText(value) {
  const status = normalizeStatus(value);
  return status.includes('aguardando') ||
    status.includes('waiting') ||
    status.includes('terceiro') ||
    status.includes('third') ||
    status.includes('peca') ||
    status.includes('cliente') ||
    status.includes('customer') ||
    status.includes('visita');
}

function isP12(ticket) {
  const priority = normalizeStatus(getTicketPriority(ticket));
  return priority.includes('urgente') ||
    priority.includes('urgent') ||
    priority.includes('alta') ||
    priority.includes('high') ||
    priority === 'p1' ||
    priority === 'p2';
}

function isUrgent(ticket) {
  const priority = normalizeStatus(getTicketPriority(ticket));
  return priority.includes('urgente') || priority.includes('urgent') || priority === 'p1';
}

function getRiskScore(ticket) {
  let score = 0;
  if (!hasFirstResponse(ticket)) score += 1000;
  const priorityRank = SORT_PRIORITY[getTicketPriority(ticket)] || SORT_PRIORITY[normalizePriorityLabel(getTicketPriority(ticket))] || 9;
  if (priorityRank) score += (6 - priorityRank) * 100;
  score += agingDays(ticket) * 2;
  return score;
}

function normalizePriorityLabel(value) {
  const normalized = normalizeStatus(value);
  if (normalized === 'media') return 'Media';
  if (normalized === 'urgente') return 'Urgente';
  if (normalized === 'alta') return 'Alta';
  if (normalized === 'baixa') return 'Baixa';
  if (normalized === 'muito baixa') return 'Muito Baixa';
  return value;
}

function actionFor(ticket) {
  if (!hasFirstResponse(ticket)) return 'Primeira resposta';
  if (agingDays(ticket) > 10) return 'Ticket antigo';
  if (isDependencyStatusText(ticket.status)) return 'Dependencia';
  if (isP12(ticket)) return 'Prioridade P1/P2';
  return 'Monitorar status';
}

function getZohoTicketUrl(ticket) {
  const id = ticket.ticket_id || ticket.id;
  if (!id) return '';
  const departmentName = ticket.department_name || ticket.department || '';
  const departmentSlugs = {
    'Suporte t\u00e9cnico': 'suporte-t\u00e9cnico',
    SAC: 'sac'
  };
  const departmentSlug = departmentSlugs[departmentName] || 'suporte-t\u00e9cnico';
  return `https://support.alliage-global.com/agent/alliagesa/${departmentSlug}/tickets/details/${id}`;
}

function applyDashboardDefaults(rows) {
  return rows
    .filter((row) => row.department_id !== OFICINA_DEPT_ID)
    .filter((row) => !isExcludedTicket(row))
    .filter((row) => DEFAULT_AGENT_GROUPS.includes(getTicketAgentGroup(row)));
}

function sortRows(rows) {
  return [...rows].sort((a, b) => getRiskScore(b) - getRiskScore(a));
}

function buildStats(rows) {
  const noResponse = rows.filter((row) => !hasFirstResponse(row));
  const over10 = rows.filter((row) => agingDays(row) > 10);
  const dependencies = rows.filter((row) => isDependencyStatusText(row.status));
  const p12 = rows.filter(isP12);
  const urgent = rows.filter(isUrgent);
  const avgAging = rows.length
    ? rows.reduce((sum, row) => sum + agingDays(row), 0) / rows.length
    : 0;

  return {
    totalOpen: rows.length,
    noResponse: noResponse.length,
    over10: over10.length,
    dependencies: dependencies.length,
    criticalP12: p12.length,
    urgent: urgent.length,
    avgAging
  };
}

function groupByRegion(rows) {
  const map = new Map();
  for (const row of rows) {
    const region = getTicketRegionGroup(row);
    if (!map.has(region)) map.set(region, []);
    map.get(region).push(row);
  }
  const ordered = [];
  for (const region of REGION_GROUPS) {
    if (map.has(region)) ordered.push([region, map.get(region)]);
  }
  for (const entry of [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (!REGION_GROUPS.includes(entry[0])) ordered.push(entry);
  }
  return ordered;
}

function textForPdf(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, '')
    .trim();
}

function estimateTextWidth(value, size) {
  return textForPdf(value).length * size * 0.52;
}

function truncateText(value, maxWidth, size) {
  const text = textForPdf(value);
  if (estimateTextWidth(text, size) <= maxWidth) return text;
  let result = text;
  while (result.length > 0 && estimateTextWidth(`${result}...`, size) > maxWidth) {
    result = result.slice(0, -1);
  }
  return `${result}...`;
}

function escapePdfString(value) {
  return textForPdf(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r?\n/g, ' ');
}

function colorCommand(color) {
  const [r, g, b] = color;
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`;
}

function addPdfText(page, fontName, value, x, y, size, color = [0.12, 0.14, 0.18]) {
  page.commands.push(`BT /${fontName} ${size.toFixed(2)} Tf ${colorCommand(color)} ${x.toFixed(2)} ${y.toFixed(2)} Td (${escapePdfString(value)}) Tj ET`);
}

function addPdfRect(page, x, y, width, height, color) {
  page.commands.push(`q ${colorCommand(color)} ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re f Q`);
}

function addPageFooter(page, pageNumber, generatedAt) {
  addPdfText(page, 'F1', SYSTEM_URL, 32, 20, 7, [0.35, 0.38, 0.43]);
  addPdfText(page, 'F1', `Gerado em ${generatedAt} | Pagina ${pageNumber}`, 690, 20, 7, [0.35, 0.38, 0.43]);
}

function buildPdfBytes(pages, pageSize) {
  const objects = [];
  const addObject = (body) => {
    objects.push(body);
    return objects.length;
  };
  const fontRegularId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const fontBoldId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  const pageObjectIds = [];

  for (const page of pages) {
    const stream = page.commands.join('\n');
    const streamLength = Buffer.byteLength(stream, 'ascii');
    const contentsId = addObject(`<< /Length ${streamLength} >>\nstream\n${stream}\nendstream`);
    const pageId = addObject([
      '<< /Type /Page',
      '/Parent __PAGES__ 0 R',
      `/MediaBox [0 0 ${pageSize[0]} ${pageSize[1]}]`,
      `/Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >>`,
      `/Contents ${contentsId} 0 R`,
      '>>'
    ].join('\n'));
    pageObjectIds.push(pageId);
  }

  const pagesId = addObject(`<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageObjectIds.length} >>`);
  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(Buffer.byteLength(pdf, 'ascii'));
    pdf += `${index + 1} 0 obj\n${objects[index].replace(/__PAGES__/g, String(pagesId))}\nendobj\n`;
  }
  const xrefOffset = Buffer.byteLength(pdf, 'ascii');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, 'ascii');
}

async function createTicketsPdf({ title, region, rows, stats, filePath, generatedAt }) {
  const pageSize = [841.89, 595.28]; // A4 landscape
  const margin = 32;
  const tableTop = 452;
  const rowHeight = 19;
  const col = [
    { key: 'ticket', label: 'Ticket', x: 32, width: 54 },
    { key: 'region', label: 'Regiao', x: 92, width: 66 },
    { key: 'priority', label: 'Prioridade', x: 164, width: 58 },
    { key: 'status', label: 'Status', x: 228, width: 138 },
    { key: 'agent', label: 'Agente', x: 372, width: 70 },
    { key: 'department', label: 'Depto.', x: 448, width: 82 },
    { key: 'mtfc', label: 'MTFC', x: 536, width: 42 },
    { key: 'aging', label: 'Aging', x: 584, width: 42 },
    { key: 'action', label: 'Acao', x: 632, width: 170 }
  ];
  let pageNumber = 0;
  let page;
  let y;
  const pages = [];

  const addPage = () => {
    page = { commands: [] };
    pages.push(page);
    pageNumber += 1;
    y = tableTop;
    addPdfRect(page, 0, 0, pageSize[0], pageSize[1], [0.98, 0.99, 1]);
    addPdfText(page, 'F2', title, margin, 558, 16);
    addPdfText(page, 'F1', `Escopo: ${region || 'Global'} | Fonte: Daily Backlog Control`, margin, 536, 9, [0.28, 0.31, 0.36]);
    addPdfText(page, 'F1', `Backlog: ${stats.totalOpen} | Criticos P1/P2: ${stats.criticalP12} | Urgentes: ${stats.urgent} | >10 dias: ${stats.over10} | Sem 1a resposta: ${stats.noResponse} | Aging medio: ${formatNumber(stats.avgAging, 1)} dias`, margin, 518, 9, [0.28, 0.31, 0.36]);
    addPdfRect(page, margin, 490, 778, 1, [0.72, 0.76, 0.82]);
    addPdfRect(page, margin, y - 4, 778, 18, [0.12, 0.32, 0.68]);
    for (const c of col) {
      addPdfText(page, 'F2', c.label, c.x, y, 7.5, [1, 1, 1]);
    }
    y -= rowHeight;
    addPageFooter(page, pageNumber, generatedAt);
  };

  addPage();

  rows.forEach((row, index) => {
    if (y < 44) addPage();
    const priority = getTicketPriority(row) || '--';
    const mtfc = metricNumber(row.mtfc_horas_bi, row.mtfc_horas);
    const values = {
      ticket: `#${row.ticket_number || row.id || '--'}`,
      region: getTicketRegionGroup(row),
      priority,
      status: row.status || '--',
      agent: String(row.agent_name || '').split(' ')[0] || '--',
      department: row.department_name || row.department || '--',
      mtfc: Number.isFinite(mtfc) ? `${formatNumber(mtfc, 1)}h` : 'Sem resp.',
      aging: formatNumber(agingDays(row), 0),
      action: actionFor(row)
    };
    const bg = index % 2 === 0 ? [1, 1, 1] : [0.95, 0.97, 1];
    addPdfRect(page, margin, y - 5, 778, 17, bg);
    if (isUrgent(row)) {
      addPdfRect(page, margin, y - 5, 3, 17, [0.89, 0.08, 0.14]);
    } else if (isP12(row)) {
      addPdfRect(page, margin, y - 5, 3, 17, [0.91, 0.63, 0.08]);
    }
    for (const c of col) {
      addPdfText(page, 'F1', truncateText(values[c.key], c.width, 7.2), c.x, y, 7.2);
    }
    y -= rowHeight;
  });

  if (!rows.length) {
    addPdfText(page, 'F1', 'Sem tickets para este escopo.', margin, y, 10, [0.35, 0.38, 0.43]);
  }

  const bytes = buildPdfBytes(pages, pageSize);
  await fs.writeFile(filePath, bytes);
}

async function fetchBacklog() {
  if (process.env.BACKLOG_PAYLOAD_FILE) {
    const raw = await fs.readFile(path.resolve(process.env.BACKLOG_PAYLOAD_FILE), 'utf8');
    const payload = JSON.parse(raw);
    if (!payload || payload.success !== true || !Array.isArray(payload.data)) {
      throw new Error('Arquivo BACKLOG_PAYLOAD_FILE com formato invalido.');
    }
    return payload;
  }

  const search = new URLSearchParams({ type: 'bi-backlog', limit: String(BACKLOG_LIMIT) });
  const url = `${DASHBOARD_READ_URL}?${search.toString()}`;
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Dashboard API error: ${res.status} ${body.slice(0, 200)}`);
    }
    const payload = await res.json();
    if (!payload || payload.success !== true || !Array.isArray(payload.data)) {
      throw new Error('Dashboard API retornou formato invalido.');
    }
    return payload;
  } catch (error) {
    const isFetchTransportFailure =
      error &&
      (error.name === 'TypeError' ||
        String(error.message || '').toLowerCase().includes('fetch failed') ||
        String(error.cause && error.cause.code || '').toUpperCase() === 'EACCES');
    if (!isFetchTransportFailure) {
      throw error;
    }
    throw new Error(`Dashboard API error: transporte indisponivel no runtime Node (${String(error.message || 'falha desconhecida')})`);
  }
}

function buildObservation(globalStats, regionStats, language) {
  const topOpen = [...regionStats].sort((a, b) => b.stats.totalOpen - a.stats.totalOpen)[0];
  const topCritical = [...regionStats].sort((a, b) => b.stats.criticalP12 - a.stats.criticalP12)[0];
  const parts = [];
  if (language === 'en') {
    if (topOpen) parts.push(`highest concentration in ${topOpen.region} (${topOpen.stats.totalOpen})`);
    if (topCritical && topCritical.stats.criticalP12 > 0) parts.push(`highest critical volume in ${topCritical.region} (${topCritical.stats.criticalP12})`);
    if (globalStats.noResponse > 0) parts.push(`${globalStats.noResponse} tickets without first response`);
    return parts.length ? parts.join('; ') : 'no relevant critical alert at this time';
  }
  if (language === 'es') {
    if (topOpen) parts.push(`mayor concentracion en ${topOpen.region} (${topOpen.stats.totalOpen})`);
    if (topCritical && topCritical.stats.criticalP12 > 0) parts.push(`mayor volumen critico en ${topCritical.region} (${topCritical.stats.criticalP12})`);
    if (globalStats.noResponse > 0) parts.push(`${globalStats.noResponse} tickets sin primera respuesta`);
    return parts.length ? parts.join('; ') : 'sin alerta critica relevante en este momento';
  }
  if (topOpen) parts.push(`maior concentracao em ${topOpen.region} (${topOpen.stats.totalOpen})`);
  if (topCritical && topCritical.stats.criticalP12 > 0) parts.push(`maior volume critico em ${topCritical.region} (${topCritical.stats.criticalP12})`);
  if (globalStats.noResponse > 0) parts.push(`${globalStats.noResponse} tickets sem primeira resposta`);
  return parts.length ? parts.join('; ') : 'sem alerta critico relevante no momento';
}

function regionLine(regionStats, language) {
  return regionStats
    .map(({ region, stats }) => {
      const avgAging = formatNumber(stats.avgAging, 1);
      if (language === 'en') return `${region}: ${stats.totalOpen} open, average aging ${avgAging} days`;
      if (language === 'es') return `${region}: ${stats.totalOpen} abiertos, aging promedio ${avgAging} dias`;
      return `${region}: ${stats.totalOpen} abertos, aging medio ${avgAging} dias`;
    })
    .join('\n');
}

function buildEmailBody({ globalStats, regionStats, generatedAt, files }) {
  const attachmentList = files.map((file) => `- ${path.basename(file)}`).join('\n');
  const globalAging = formatNumber(globalStats.avgAging, 1);
  return [
    '[PT-BR] Portugues',
    'Ola, pessoal. Este e o envio automatico do Daily Report. A ideia e aprimorar o formato ao longo do tempo para apoiar as decisoes diarias sobre os atendimentos.',
    '',
    '[EN] English',
    'Hello, everyone. This is the automated delivery of the Daily Report. The goal is to keep improving the format over time to support daily service decisions.',
    '',
    '[ES] Espanol',
    'Hola a todos. Este es el envio automatico del Daily Report. La idea es seguir mejorando el formato con el tiempo para apoyar las decisiones diarias sobre la atencion.',
    '',
    '----',
    '',
    `Assunto / Subject / Asunto: Daily Backlog Global - ${generatedAt}`,
    '',
    'PT-BR',
    `Resumo curto: backlog global com ${globalStats.totalOpen} tickets abertos. Aging medio global: ${globalAging} dias; urgentes: ${globalStats.urgent}; acima de 10 dias: ${globalStats.over10}; sem primeira resposta: ${globalStats.noResponse}.`,
    'Tickets abertos por regiao:',
    regionLine(regionStats, 'pt'),
    `Link do sistema: ${SYSTEM_URL}`,
    '',
    'EN',
    `Short summary: global backlog has ${globalStats.totalOpen} open tickets. Global average aging: ${globalAging} days; urgent: ${globalStats.urgent}; over 10 days: ${globalStats.over10}; without first response: ${globalStats.noResponse}.`,
    'Open tickets by region:',
    regionLine(regionStats, 'en'),
    `System link: ${SYSTEM_URL}`,
    '',
    'ES',
    `Resumen corto: el backlog global tiene ${globalStats.totalOpen} tickets abiertos. Aging promedio global: ${globalAging} dias; urgentes: ${globalStats.urgent}; mas de 10 dias: ${globalStats.over10}; sin primera respuesta: ${globalStats.noResponse}.`,
    'Tickets abiertos por region:',
    regionLine(regionStats, 'es'),
    `Link del sistema: ${SYSTEM_URL}`,
    '',
    'Anexos / Attachments / Adjuntos:',
    attachmentList,
    '',
    'Obrigado,',
    'Guilherme Alamino'
  ].join('\n');
}

function fileSafe(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

async function main() {
  const parts = timestampParts();
  const stamp = `${parts.year}-${parts.month}-${parts.day}_${parts.hour}-${parts.minute}`;
  const generatedAt = `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
  const outputDir = path.resolve(process.cwd(), 'reports', `daily-backlog-${stamp}`);
  await fs.mkdir(outputDir, { recursive: true });

  const payload = await fetchBacklog();
  const filteredRows = sortRows(applyDashboardDefaults(payload.data));
  const globalStats = buildStats(filteredRows);
  const regionGroups = groupByRegion(filteredRows);
  const regionStats = regionGroups.map(([region, rows]) => ({ region, stats: buildStats(rows) }));

  const pdfFiles = [];
  const globalPdf = path.join(outputDir, 'daily-backlog-global.pdf');
  await createTicketsPdf({
    title: 'Daily Backlog Global',
    region: 'Global',
    rows: filteredRows,
    stats: globalStats,
    filePath: globalPdf,
    generatedAt
  });
  pdfFiles.push(globalPdf);

  for (const [region, rows] of regionGroups) {
    const filePath = path.join(outputDir, `daily-backlog-${fileSafe(region)}.pdf`);
    await createTicketsPdf({
      title: `Daily Backlog - ${region}`,
      region,
      rows: sortRows(rows),
      stats: buildStats(rows),
      filePath,
      generatedAt
    });
    pdfFiles.push(filePath);
  }

  const emailBody = buildEmailBody({ globalStats, regionStats, generatedAt, files: pdfFiles });
  const emailFile = path.join(outputDir, 'email-body-trilingual.txt');
  await fs.writeFile(emailFile, emailBody, 'utf8');

  const draftPayload = {
    subject: `Daily Backlog Global - ${generatedAt}`,
    text_content: emailBody,
    to: OUTLOOK_TO_RECIPIENTS,
    cc: [],
    bcc: [],
    attachment_files: pdfFiles
  };
  const draftPayloadFile = path.join(outputDir, 'outlook-draft-payload.json');
  await fs.writeFile(draftPayloadFile, JSON.stringify(draftPayload, null, 2), 'utf8');

  const manifest = {
    generatedAt,
    systemUrl: SYSTEM_URL,
    source: {
      endpoint: `${DASHBOARD_READ_URL}?type=bi-backlog&limit=${BACKLOG_LIMIT}`,
      returnedRows: payload.data.length,
      afterDashboardFilters: filteredRows.length
    },
    filters: {
      region: 'all',
      priority: 'all',
      type: 'all',
      product: 'all',
      agentGroups: DEFAULT_AGENT_GROUPS
    },
    globalStats,
    regionStats,
    files: {
      pdfs: pdfFiles,
      emailBody: emailFile,
      outlookDraftPayload: draftPayloadFile
    }
  };
  const manifestFile = path.join(outputDir, 'manifest.json');
  await fs.writeFile(manifestFile, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(JSON.stringify({
    outputDir,
    returnedRows: payload.data.length,
    afterDashboardFilters: filteredRows.length,
    globalStats,
    regionStats,
    pdfFiles,
    emailFile,
    draftPayloadFile,
    manifestFile
  }, null, 2));
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});

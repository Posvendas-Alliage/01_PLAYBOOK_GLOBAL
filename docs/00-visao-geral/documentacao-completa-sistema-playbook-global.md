# Documentacao completa do sistema - Playbook Global

Gerado em: 2026-07-21
Escopo: manutencao local, conexoes, KPI V2, horas corridas, horas uteis, seguranca, deploy e rotinas operacionais.
Status desta documentacao: artefato local. Nao representa deploy, push ou alteracao de ambiente externo.

## 1. Resumo executivo

O Playbook Global e uma aplicacao web estatica com modulos de governanca e operacao de pos-vendas, hospedada como site estatico no Netlify e conectada ao Supabase para autenticacao, leitura de indicadores e funcoes de sincronizacao com o Zoho Desk.

O modulo mais critico hoje e `01_KPI/KPI_V2`, que concentra as abas Daily, Weekly, Monthly, Horarios Comerciais e Comparativo Corridas x Uteis. As abas Daily, Weekly e Monthly usam dados de tickets do Supabase; o modo de horas uteis usa um JSON pre-processado por ticket para recalcular SLA, MTFC e MTTS dentro de horario comercial. Volumes como backlog, tickets abertos e tickets fechados permanecem iguais entre Corridas e Uteis.

Principio de consistencia: para o mesmo periodo, filtro e modo de hora, o mesmo numero deve aparecer igual em todas as abas que exibem aquela metrica. A aba Comparativo deve repetir os mesmos resultados das abas Weekly e Monthly, nao criar uma segunda versao da verdade.

## 2. Mapa rapido de pastas

| Caminho | Papel |
| --- | --- |
| `index.html` | Entrada principal do Playbook Global. |
| `login.html`, `admin.html`, `change-password.html` | Fluxos de autenticacao, administracao e troca de senha. |
| `config/supabase.js` | Configuracao publica do frontend para Supabase URL e anon key. |
| `js/` | Scripts globais do Playbook: autenticacao, i18n, navegacao, admin e assistente. |
| `css/` | Estilos globais compartilhados entre modulos. |
| `i18n/` | Traducoes globais do Playbook fora do KPI V2. |
| `01_KPI/` | Modulo de KPI. Contem KPI V1 legado e KPI V2 atual. |
| `01_KPI/KPI_V2/` | Dashboard principal de KPIs operacionais. |
| `01_KPI/KPI_V2/data/` | JSONs estaticos usados por horas uteis e snapshots historicos. |
| `01_KPI/KPI_V2/js/` | Logica especifica do KPI V2. |
| `01_KPI/KPI_V2/docs/` | Documentacao tecnica especifica de numeros e contexto KPI V2. |
| `02_Kanban/` a `09_Zoho_Desk/` | Modulos adicionais do Playbook. |
| `netlify/edge-functions/` | Edge middleware para proteger rotas estaticas. |
| `netlify/functions/` | Funcoes serverless auxiliares no Netlify. |
| `supabase/functions/` | Edge Functions Supabase para leitura, sync e admin. |
| `tools/` | Scripts locais de auditoria, reconciliacao, horas uteis e relatorios. |
| `docs/` | Documentacao operacional do sistema. |
| `outputs/`, `reports/` | Saidas locais geradas por scripts. Sao ignoradas no deploy. |
| `_archived/` | Materiais antigos ou preservados fora do fluxo principal. |

## 3. Arquitetura em alto nivel

Fluxo principal de acesso:

1. Usuario abre uma pagina estatica do Playbook.
2. Netlify Edge Function `auth-gate.ts` intercepta a rota.
3. Se a protecao estiver ativa, a Edge Function valida cookie de sessao e consulta Supabase Auth.
4. O perfil do usuario e validado na tabela de perfis do Playbook.
5. A pagina carrega scripts estaticos e busca dados via Supabase Edge Function `dashboard-read` ou REST local em desenvolvimento.
6. O frontend aplica filtros, regras de exibicao, formatacao e graficos.

Fluxo principal de dados:

1. Zoho Desk e o sistema fonte dos tickets.
2. `sync-tickets-v0` busca tickets, detalhes, metricas, agentes, contatos e departamentos.
3. Supabase armazena dados em tabelas `zoho_*` e historicos de sincronizacao.
4. Views Supabase normalizam regioes, prioridades, grupos de agente, aging e status de SLA.
5. `dashboard-read` expoe leituras controladas para o frontend.
6. KPI V2 consome esses dados nas abas Daily, Weekly e Monthly.
7. `tools/business-hours-kpi-audit.py` gera `business-hours-kpi-audit-latest.json` com metricas de horas uteis por periodo, regiao e ticket.
8. `business-hours-mode.js` usa esse JSON para trocar SLA, MTFC e MTTS para modo Util.

## 4. Entradas e navegacao do KPI V2

| Pagina | Arquivo | Funcao |
| --- | --- | --- |
| Hub KPI V2 | `01_KPI/KPI_V2/index.html` | Entrada do modulo KPI V2. |
| Overview | `01_KPI/KPI_V2/page1-overview.html` | Visao global com indicadores e globo. |
| Daily | `01_KPI/KPI_V2/page2-backlog.html` | Backlog aberto atual e alertas operacionais. |
| Data Quality | `01_KPI/KPI_V2/page3-data-quality.html` | Qualidade de preenchimento e saude de dados. |
| Weekly | `01_KPI/KPI_V2/page4-weekly.html` | Resultados por semana e backlog operacional. |
| Monthly | `01_KPI/KPI_V2/page5-monthly.html` | Resultados por mes e visao regional. |
| Horarios Comerciais | `01_KPI/KPI_V2/page6-business-hours.html` | Consulta de horarios mundiais e agregados. |
| Comparativo | `01_KPI/KPI_V2/page7-hours-comparison.html` | Comparacao entre Corridas e Uteis no tempo e por regiao. |
| Kanban de Status | `01_KPI/KPI_V2/kanban-status.html` | Existe no codigo, mas foi ocultado da navegacao conforme decisao recente. |

## 5. Scripts principais do KPI V2

| Script | Responsabilidade |
| --- | --- |
| `01_KPI/KPI_V2/js/i18n.js` | Traducoes PT/EN/ES/HI, tema claro/escuro e aplicacao de textos `data-i18n`. |
| `01_KPI/KPI_V2/js/filters.js` | Estado global de filtros e evento `filterschange`. |
| `01_KPI/KPI_V2/js/supabase-client.js` | Acesso ao Supabase, `dashboard-read`, cache de 5 minutos e fallback local. |
| `01_KPI/KPI_V2/js/business-rules.js` | Metas, normalizacoes e calculos de SLA/MTFC/MTTS em horas corridas. |
| `01_KPI/KPI_V2/js/business-hours-mode.js` | Alternancia Corridas/Uteis e substituicao deterministica das metricas comerciais. |
| `01_KPI/KPI_V2/js/charts.js` | Helpers Chart.js, destruicao/recriacao de graficos e graficos com meta. |
| `01_KPI/KPI_V2/js/export-page.js` | Exportacao PDF das paginas no navegador. |
| `01_KPI/KPI_V2/js/globe.js` | Visualizacao de globo/mapa em paginas que usam Three.js. |

## 6. Dados e fontes

### Supabase publico do frontend

O arquivo `config/supabase.js` define:

| Variavel | Uso |
| --- | --- |
| `window.SUPABASE_URL` | URL do projeto Supabase usado pelo frontend. |
| `window.SUPABASE_ANON_KEY` | Chave anonima/publicavel para chamadas client-side permitidas. |

Regra de seguranca: nunca colocar `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY`, tokens Zoho ou senhas em arquivos servidos pelo site.

### Views e endpoints usados pelo KPI

| Tipo `dashboard-read` | Fonte esperada | Uso |
| --- | --- | --- |
| `bi-tickets` | `vw_tickets_bi_base` | Base de tickets fechados/criados para Weekly e Monthly. |
| `bi-backlog` | `vw_dashboard_bi_backlog` | Backlog aberto para Daily e cards de backlog. |
| `bi-backlog-kpis` | `vw_dashboard_bi_backlog_kpis` | KPIs agregados de backlog. Disponivel para consultas auxiliares. |
| `bi-kpis` | `vw_dashboard_bi_kpis` | Agregados gerais de BI. |
| `bi-region-summary` | `vw_dashboard_bi_region_summary` | Resumo por regiao. |
| `bi-summary` | `vw_dashboard_bi_summary` | Resumo por dimensoes. |
| `sync-health` | `sync_runs`, `sync_errors`, `zoho_tickets`, `vw_tickets_bi_base` | Saude da sincronizacao. |

### JSONs estaticos do KPI V2

| Arquivo | Conteudo | Consumidor |
| --- | --- | --- |
| `01_KPI/KPI_V2/data/business-hours-kpi-audit-latest.json` | Periodos weekly/monthly, metricas comuns e uteis, metricas por ticket e por regiao. | `business-hours-mode.js` e `page7-hours-comparison.html`. |
| `01_KPI/KPI_V2/data/business-hours-world.json` | Paises, fusos, horarios comerciais, equivalencia BRT e observacoes. | `page6-business-hours.html`. |
| `01_KPI/KPI_V2/data/historical-kpi-snapshots.json` | Base congelada/historica por periodos antigos. | `supabase-client.js` como fonte legada antes do cutoff. |

## 7. Base congelada e cutoff historico

`01_KPI/KPI_V2/js/supabase-client.js` define `HISTORICAL_SOURCE_CUTOFF_DATE` com default `2026-07-12`. Periodos anteriores ao cutoff podem usar snapshots historicos para preservar numeros antigos. Isso existe para evitar que dados de periodos ja fechados mudem quando a base viva do Supabase for reprocessada ou corrigida.

Ponto critico: se um periodo antigo precisar ser recalculado de proposito, o responsavel deve decidir explicitamente se vai atualizar tambem `historical-kpi-snapshots.json` ou alterar o cutoff. Nao misturar dado vivo e snapshot sem documentar a decisao.

## 8. Regras de KPI

### Metricas de horas corridas

As metricas padrao das abas Daily, Weekly e Monthly usam tempo de calendario, chamado na interface de `Corridas`.

| Metrica | Regra |
| --- | --- |
| SLA Compliance | Percentual de tickets elegiveis dentro das metas de primeira resposta e solucao. |
| MTFC | Tempo medio ate primeira resposta. Em geral usa `mtfc_horas_bi`. |
| MTTS | Tempo medio ate solucao/fechamento. Em geral usa `mtts_dias_bi` ou fallback por `resolution_horas / 24`. |
| Fechados | Conta tickets com `closed_time` dentro do periodo. |
| Criados | Conta tickets com `created_time` dentro do periodo. |
| Backlog | Tickets abertos atuais. Nao e reescrito por modo de hora. |
| Aging | Idade do ticket aberto desde `created_time` ate hoje. Nao e reescrito por modo de hora. |
| Fila critica | Tickets abertos acima do limite de aging. Deve seguir o mesmo universo do aging/backlog. |

### Metas principais

| Item | Meta |
| --- | --- |
| SLA geral | 80% ou mais e considerado on target. |
| MTFC por prioridade | Urgente 1h, Alta 2h, Media 3h, Baixa 5h, Muito Baixa 6h. |
| MTTS por regiao | Brasil 4d, Argentina 5d, Mexico 6d, LATAM 6d, USA 10d, ROW 10d. |

Os thresholds visuais nos cards e tabelas devem seguir as metas da metrica. Para SLA, maior e melhor. Para MTFC e MTTS, menor e melhor.

## 9. Horas corridas x horas uteis

### Regra de negocio

Ao trocar de `Corridas` para `Uteis`:

| Numero | Deve mudar? | Motivo |
| --- | --- | --- |
| SLA Compliance | Sim | SLA passa a usar tempos uteis por ticket. |
| MTFC | Sim | Primeira resposta passa a descontar tempo fora do expediente. |
| MTTS | Sim | Solucao passa a descontar tempo fora do expediente. |
| Status SLA da tabela de fechados | Sim | Status deve seguir a mesma regra util do ticket. |
| Graficos de SLA/MTFC/MTTS | Sim | Devem refletir o mesmo modo selecionado. |
| Mapa/regiao | Sim, para cor e percentuais de SLA/MTFC/MTTS | A leitura regional deve usar o mesmo modo. |
| Tickets fechados | Nao | Volume fechado nao depende de relogio util. |
| Tickets criados | Nao | Volume criado nao depende de relogio util. |
| Backlog atual | Nao | Ticket aberto continua aberto independentemente do modo. |
| Aging medio | Nao | Aging e idade real do ticket aberto. |
| Fila critica | Nao | Deve seguir o aging/backlog do ticket, nao horas uteis. |

### Implementacao atual

O arquivo `business-hours-mode.js`:

1. Guarda o modo em `localStorage` com chave `playbook-kpi-hours-mode`.
2. Carrega `data/business-hours-kpi-audit-latest.json`.
3. Seleciona o periodo weekly ou monthly conforme o seletor da tela.
4. Filtra os tickets comerciais usando os mesmos filtros dimensionais da tela quando possivel.
5. Recalcula SLA, MTFC e MTTS por ticket no recorte filtrado.
6. Atualiza cards, tabela regional, mapa, graficos e tabela de fechados.
7. Reaplica a troca de modo quando recebe `filterschange`.

### Cuidados ja levantados

1. SLA util nunca deve piorar por erro de agregacao. Se piorar, auditar primeiro se a base de elegiveis mudou entre Corridas e Uteis.
2. Mexico, LATAM e ROW devem responder aos filtros de regiao no modo Corridas e no modo Uteis.
3. Nomes quebrados por mojibake, por exemplo Mexico com acento corrompido, devem ser normalizados antes de cruzar com mapa, tabelas e filtros.
4. Tickets sem regiao precisam ter regra explicita. Eles nao podem aparecer em Corridas e desaparecer em Uteis sem explicacao.
5. Status SLA por ticket deve usar a mesma regra da metrica agregada do modo selecionado.

## 10. Aba Horarios Comerciais

Arquivo: `01_KPI/KPI_V2/page6-business-hours.html`.

Objetivo atual: servir como referencia operacional de horarios mundiais e agregados. A tela foi simplificada para mostrar apenas:

1. `Horarios mundiais`
2. `Agregados`

Conteudos de resumo, regioes e kanban foram removidos/ocultados da experiencia principal conforme decisao recente.

Fonte principal: `01_KPI/KPI_V2/data/business-hours-world.json`.

## 11. Aba Comparativo

Arquivo: `01_KPI/KPI_V2/page7-hours-comparison.html`.

Objetivo: comparar `Corridas` x `Uteis` de forma didatica.

Componentes principais:

| Bloco | Papel |
| --- | --- |
| Cards de SLA, MTFC e MTTS | Mostram valor Corridas, valor Uteis, delta e interpretacao simples. |
| Graficos do recorte | Comparam Corridas x Uteis no periodo selecionado. |
| Tendencia periodo a periodo | Mostra evolucao de SLA, MTFC e MTTS entre periodos. |
| Graficos de delta | Evidenciam a diferenca gerada pelo modo util. |
| Comparacao por regiao | Mostra Corridas x Uteis por regiao no periodo escolhido. |
| Evolucao regional | Grafico com multiplas linhas por regiao ao longo do tempo. |
| Tabela tecnica | Mantem os numeros tabulares para conferencia. |

Regra de consistencia: qualquer valor desta aba deve bater com Weekly/Monthly quando periodo, filtro e modo forem equivalentes.

## 12. Filtros

Filtros globais controlados pela UI:

| Filtro | Observacao |
| --- | --- |
| Pais/regiao | Deve afetar KPIs, tabela regional, mapa, graficos e tabelas de tickets. |
| Prioridade | Deve afetar os tickets no recorte. |
| Tipo | Deve afetar tickets fechados/criados quando o campo existir na base. |
| Departamento | Deve afetar telas onde o campo e implementado no filtro efetivo. |
| Linha | Deve afetar produto/linha quando o campo existir. |
| Produto/grupo | Deve afetar tickets associados ao produto/grupo. |
| Periodo | Weekly usa semana; Monthly usa mes/ano como periodo oficial. |
| Grupo do agente | Deve afetar os tickets no recorte, respeitando grupos selecionados. |

Ponto de manutencao: antes de declarar uma metrica como correta, validar se o filtro esta sendo aplicado no mesmo nivel da base usada pela metrica. Se uma metrica usa agregado pronto, ela pode nao obedecer todos os filtros. O padrao correto para compatibilidade total e usar granularidade por ticket.

## 13. Autenticacao e autorizacao

### Frontend

| Arquivo | Papel |
| --- | --- |
| `js/playbook-auth.js` | Carrega Supabase JS, gerencia sessao e operacoes autenticadas. |
| `js/playbook-auth-guard.js` | Bloqueia paginas protegidas quando autenticacao e obrigatoria. |
| `js/playbook-admin.js` | UI de administracao de usuarios/perfis. |
| `login.html` | Entrada de login. |
| `admin.html` | Gestao administrativa. |
| `change-password.html` | Troca de senha. |

### Netlify

| Arquivo | Papel |
| --- | --- |
| `netlify/edge-functions/auth-gate.ts` | Protege rotas estaticas no edge antes de entregar HTML. |
| `netlify/functions/auth-session.ts` | Cria/atualiza cookies de sessao. |
| `netlify/functions/auth-logout.ts` | Remove cookies de sessao. |

### Supabase

| Funcao | Papel |
| --- | --- |
| `supabase/functions/playbook-admin/index.ts` | Operacoes administrativas controladas. |
| `supabase/functions/playbook-bootstrap-admin/index.ts` | Bootstrap seguro do primeiro admin. |
| `supabase/functions/dashboard-read/index.ts` | Leitura autenticada dos dados de dashboard. |

Controles importantes:

1. `dashboard-read` e `playbook-admin` devem ficar com `verify_jwt=true`.
2. `playbook-bootstrap-admin` e sensivel e deve ser usado apenas quando necessario, com token forte e segredo no Supabase.
3. A Edge Function `auth-gate` depende das variaveis publicaveis do Supabase e da flag `PLAYBOOK_KPI_AUTH_REQUIRED`.
4. Rotas publicas devem ser estritamente as necessarias para login, assets, scripts publicos e callbacks.

## 14. Supabase Functions

| Caminho | Responsabilidade |
| --- | --- |
| `supabase/functions/dashboard-read/index.ts` | API de leitura para dashboards; aplica validacao de usuario e roteia tipos `bi-*`. |
| `supabase/functions/sync-tickets-v0/index.ts` | Sincronizacao principal Zoho Desk -> Supabase. |
| `supabase/functions/sync-ticket-status-history/index.ts` | Sincronizacao de historico de status/Kanban. |
| `supabase/functions/playbook-admin/index.ts` | Administracao de perfis e usuarios do Playbook. |
| `supabase/functions/playbook-bootstrap-admin/index.ts` | Criacao/reset inicial do admin. |

`supabase/config.toml` define `verify_jwt` por funcao. Conferir esse arquivo antes de deployar qualquer funcao.

## 15. Netlify

`netlify.toml` define:

| Configuracao | Valor/Papel |
| --- | --- |
| `publish = "."` | O site publica a raiz do repositorio. |
| `functions = "netlify/functions"` | Local das funcoes Netlify. |
| `node_bundler = "esbuild"` | Bundler das funcoes. |
| Redirect `/01_KPI/` | Envia para `/01_KPI/index.html`. |
| Redirect `/01_KPI/KPI_V2/` | Envia para `/01_KPI/KPI_V2/index.html`. |
| Edge `auth-gate` | Executa em `/*`. |
| Headers de seguranca | Content type, frame options, referrer policy e permissions policy. |

`.netlifyignore` remove do deploy itens locais como `.git`, `.env`, `supabase/`, `tools/`, `docs/`, `outputs/` e `reports/`. Portanto esta documentacao local nao vai para producao pelo deploy estatico normal.

## 16. Ferramentas locais

| Script | Uso |
| --- | --- |
| `tools/business-hours-kpi-audit.py` | Gera/atualiza JSON de horas uteis por periodo, regiao e ticket. |
| `tools/monitor-zoho-supabase-parity.js` | Audita paridade Zoho x Supabase e pode acionar correcoes quando configurado. |
| `tools/run-daily-backlog-report.js` | Gera relatorio operacional de backlog diario. |

Rotina recomendada antes de mexer em metricas:

1. Conferir se a base Supabase esta fresca.
2. Rodar auditoria relevante local.
3. Regenerar JSON comercial quando houver mudanca de regra ou dado.
4. Validar Daily, Weekly, Monthly e Comparativo com os mesmos filtros.
5. Conferir tabela de tickets para amostras criticas, principalmente tickets perto da meta.

## 17. Variaveis de ambiente

As variaveis esperadas estao documentadas em `.env.example`.

| Grupo | Variaveis |
| --- | --- |
| Supabase publico | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `PLAYBOOK_SUPABASE_URL`, `PLAYBOOK_SUPABASE_PUBLISHABLE_KEY`. |
| Supabase servidor | `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_SECRET_KEYS`. |
| Zoho Desk | `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, `ZOHO_ORG_ID`, `ZOHO_DEPARTMENT_IDS`. |
| Sync/monitor | `SYNC_FUNCTION_KEY`, `MONITOR_*`. |
| Bootstrap admin | `PLAYBOOK_BOOTSTRAP_TOKEN`, `PLAYBOOK_INITIAL_ADMIN_EMAIL`, `PLAYBOOK_ADMIN_INITIAL_PASSWORD`, `PLAYBOOK_BOOTSTRAP_RESET_PASSWORD`, `PLAYBOOK_ADMIN_FORCE_PASSWORD_CHANGE`. |
| Auth Netlify | `PLAYBOOK_KPI_AUTH_REQUIRED`, variaveis publicaveis Supabase aceitas pelo edge. |

Nunca commitar `.env` ou segredos reais.

## 18. Runbook local

### Rodar o site localmente

O projeto e estatico. Pode ser servido por Live Server/servidor estatico apontando para a raiz do repo. URL local usada nas validacoes recentes:

`http://127.0.0.1:5500/01_KPI/KPI_V2/page4-weekly.html`

Paginas uteis:

| View | URL local relativa |
| --- | --- |
| Daily | `/01_KPI/KPI_V2/page2-backlog.html` |
| Weekly | `/01_KPI/KPI_V2/page4-weekly.html` |
| Monthly | `/01_KPI/KPI_V2/page5-monthly.html` |
| Horarios Comerciais | `/01_KPI/KPI_V2/page6-business-hours.html` |
| Comparativo | `/01_KPI/KPI_V2/page7-hours-comparison.html` |

### Validacoes rapidas

```powershell
node --check 01_KPI/KPI_V2/js/i18n.js
node --check 01_KPI/KPI_V2/js/charts.js
node --check 01_KPI/KPI_V2/js/business-hours-mode.js
```

Para paginas HTML com JS inline, validar no navegador e no console. Quando mexer em graficos, conferir se instancias antigas sao destruidas antes de recriar.

### Validacao funcional minima de KPI

1. Daily em Corridas: backlog, aging medio e fila critica devem refletir tickets abertos atuais.
2. Daily em Uteis: SLA/MTFC/MTTS podem mudar se existirem no contexto; backlog, aging e fila critica nao devem mudar.
3. Weekly: filtros de regiao, prioridade, tipo, produto e grupo devem mudar cards, graficos e tabela de fechados.
4. Monthly: mes/ano e filtros devem mudar os mesmos universos da tabela e dos cards.
5. Horarios Comerciais: manter apenas Horarios mundiais e Agregados.
6. Comparativo: valores Corridas e Uteis devem bater com Weekly/Monthly para o mesmo periodo e filtro.

## 19. Runbook de mudanca de KPI

Ao alterar qualquer regra de KPI:

1. Identificar se a regra pertence a BI/Supabase, frontend Corridas ou JSON Uteis.
2. Preferir uma unica fonte de verdade por metrica.
3. Se a metrica precisa respeitar todos os filtros, usar base por ticket.
4. Atualizar `business-rules.js` se for regra de horas corridas no frontend.
5. Atualizar `tools/business-hours-kpi-audit.py` e regenerar `business-hours-kpi-audit-latest.json` se for regra util.
6. Atualizar `business-hours-mode.js` se mudar o modo de exibicao.
7. Validar tabela de tickets e agregados. Nao validar apenas card.
8. Testar regioes Brasil, USA, Argentina, Mexico, LATAM e ROW.
9. Conferir casos de nomes com encoding quebrado.
10. Atualizar esta documentacao quando a regra mudar.

## 20. Runbook de deploy

### Supabase

Antes de deployar uma Edge Function:

1. Conferir `supabase/config.toml`.
2. Conferir segredos necessarios no ambiente Supabase.
3. Rodar verificacao local quando aplicavel.
4. Deployar apenas a funcao alterada.
5. Validar endpoint com JWT adequado.

### Netlify/site

Antes de subir producao:

1. Conferir `git status --short`.
2. Separar commits por tema quando possivel.
3. Rodar validacoes de JS alterado.
4. Conferir que `.netlifyignore` nao exclui arquivos necessarios ao runtime.
5. Fazer um unico push quando solicitado.
6. Validar pagina publicada apos deploy.

Observacao: o pedido mais recente foi local-only, entao esta documentacao nao foi publicada.

## 21. Troubleshooting

| Sintoma | Causa provavel | Onde olhar |
| --- | --- | --- |
| Pagina nao carrega nada | Falha de auth, Supabase URL/key ausente, `dashboard-read` indisponivel ou erro JS antes do render. | Console do navegador, `config/supabase.js`, `supabase-client.js`, `auth-gate.ts`. |
| Login em loop | Cookie invalido, perfil nao aprovado ou rota protegida mal classificada. | `auth-session.ts`, `auth-gate.ts`, tabela de perfis. |
| Corridas e Uteis mostram fechados diferentes | Erro. Volumes nao devem mudar por modo de hora. | `business-hours-mode.js`, filtros por ticket e tabela de fechados. |
| SLA util piora sem explicacao | Universo de elegiveis diferente ou status por ticket divergente. | JSON comercial e `computeBusinessTicketMetrics`. |
| Mapa nao muda no modo util | Cor/metricas regionais nao foram reprocessadas. | `updateMonthlyCommercialMap`, normalizacao de regiao. |
| Mexico aparece quebrado | Mojibake/encoding de regiao. | `maybeRepairText`, `repairMojibake`, `canonicalRegion`. |
| Graficos ficam se mexendo | Chart.js recriado sem destruir instancia ou animacao ativa. | `charts.js`, chamadas `destroyChart`, opcoes `animation`. |
| Cards ficam com cor errada | Threshold visual nao usa a meta correta. | `updateCommercialKpiCardColors`, `slaCardColor`, `mtfcCardColor`, `mttsCardColor`. |
| Comparativo diverge de Weekly/Monthly | A aba comparativa usou agregado diferente do mesmo periodo/filtro. | `page7-hours-comparison.html`, JSON comercial, regras de filtro. |
| Periodo antigo mudou sozinho | Uso incorreto de base viva em periodo que deveria usar snapshot. | `HISTORICAL_SOURCE_CUTOFF_DATE`, `historical-kpi-snapshots.json`. |

## 22. Checklist de auditoria por aba

### Daily

1. Backlog atual bate com quantidade de tickets abertos filtrados.
2. Aging medio e fila critica usam a mesma base de tickets abertos.
3. Modo Util nao altera backlog, aging, fila critica, abertos ou fechados.
4. Filtros de regiao, prioridade, departamento, status e grupo funcionam.
5. Tabela de tickets em aberto reflete os cards.

### Weekly

1. Cards de SLA, MTFC e MTTS mudam entre Corridas e Uteis.
2. Fechados e criados nao mudam entre Corridas e Uteis.
3. Graficos por regiao e prioridade usam o modo selecionado.
4. Tabela de fechados mostra MTFC, MTTS e SLA coerentes com o modo.
5. Filtros mudam cards, graficos e tabela de maneira consistente.

### Monthly

1. Mes/ano controla o periodo oficial.
2. Cards de SLA, MTFC e MTTS mudam entre Corridas e Uteis.
3. Tickets fechados e backlog atual nao mudam entre Corridas e Uteis.
4. Mapa e tabela regional mudam cor/valor conforme o modo.
5. Mexico, LATAM e ROW alteram SLA quando filtrados se houver tickets no mes.
6. Tabela de tickets fechados usa o status SLA do modo selecionado.

### Horarios Comerciais

1. Apenas Horarios mundiais e Agregados aparecem como abas/conteudo principal.
2. Busca e seletores nao trazem secoes removidas.
3. Dados de horarios mundiais vem de `business-hours-world.json`.

### Comparativo

1. Periodo e granularidade selecionados sao claros.
2. Corridas e Uteis batem com as abas oficiais.
3. Deltas usam semantica correta: SLA maior e melhor; MTFC/MTTS menor e melhor.
4. Grafico por regiao usa as mesmas regioes canonicas.
5. Tabela tecnica bate com os cards e graficos.

## 23. Convencoes de desenvolvimento

1. Manter mudancas pequenas e testaveis.
2. Nao misturar refactor visual com mudanca de regra numerica sem necessidade.
3. Nao recalcular KPI em mais de um lugar se uma fonte canonica ja existe.
4. Usar nomes canonicos de regiao e prioridade antes de agrupar.
5. Destruir instancias Chart.js antes de recriar graficos.
6. Desativar animacoes em graficos operacionais para evitar percepcao de numero mudando.
7. Documentar decisoes que preservam base congelada.
8. Nao expor segredos em frontend, docs ou screenshots.
9. Atualizar traducoes PT/EN/ES/HI quando inserir texto novo na UI.
10. Validar responsividade e legibilidade antes de considerar frontend pronto.

## 24. Conexoes externas

| Conexao | Finalidade | Camada |
| --- | --- | --- |
| Zoho Desk API | Origem de tickets, metricas, agentes, contatos e departamentos. | Supabase sync. |
| Supabase Auth | Login e sessao. | Frontend, Netlify Edge, Supabase Functions. |
| Supabase Database | Tabelas `zoho_*`, views BI, sync logs e perfis. | Backend/BI. |
| Supabase Edge Functions | Leitura controlada, sync e admin. | API. |
| Netlify | Hospedagem estatica, edge auth e funcoes serverless. | Hosting. |
| Chart.js CDN | Graficos do KPI V2. | Frontend. |
| Three.js CDN | Globo/mapas em paginas que usam cena 3D. | Frontend. |

## 25. Pontos de risco e divida tecnica

1. Parte do dashboard ainda calcula metricas no frontend. Isso facilita iteracao, mas exige disciplina para nao duplicar regra.
2. O modo Util depende de JSON estatico gerado por script. Se o JSON ficar desatualizado, a tela pode divergir da base viva.
3. Base congelada preserva historico, mas precisa de governanca quando houver recalculo retroativo.
4. Traducoes ainda misturam `data-i18n` global e dicionarios inline em paginas especificas.
5. O Kanban de Status existe no codigo, mas esta oculto da navegacao; se voltar, precisa auditoria propria.
6. Dependencias CDN podem quebrar se a rede do usuario bloquear `cdn.jsdelivr.net`.
7. Encoding antigo em docs pode atrapalhar busca. Novos docs devem evitar mojibake e preferir UTF-8 consistente ou ASCII.

## 26. Referencias internas

| Documento | Uso |
| --- | --- |
| `docs/01-seguranca/seguranca-playbook.md` | Modelo de seguranca e controles. |
| `docs/01-seguranca/feature-seguranca-playbook.md` | Implementacao da feature de seguranca. |
| `docs/03-monitoramento/monitor-zoho-supabase-parity.md` | Auditoria Zoho x Supabase. |
| `docs/02-operacao/daily-backlog/automacao-daily-backlog-global-contexto.md` | Contexto da automacao de backlog diario. |
| `docs/02-operacao/daily-backlog/automacao-daily-backlog-global-processo.md` | Processo da automacao de backlog diario. |
| `01_KPI/KPI_V2/docs/documentacao-numeros-kpi-v2.md` | Referencia detalhada de numeros Daily/Weekly/Monthly. |
| `01_KPI/KPI_V2/docs/contexto-claude-mapa-dos-atendimentos.md` | Contexto tecnico de mapa/kanban/status. |

## 27. Glossario

| Termo | Definicao |
| --- | --- |
| Corridas | Horas/dias de calendario, sem descontar fora do expediente. |
| Uteis | Horas/dias calculados apenas dentro do horario comercial aplicavel. |
| SLA Compliance | Percentual de tickets elegiveis dentro das metas de MTFC e MTTS. |
| MTFC | Mean Time to First Contact/Response; tempo medio ate primeira resposta. |
| MTTS | Mean Time to Solution; tempo medio ate solucao/fechamento. |
| Backlog | Tickets ainda abertos. |
| Aging | Idade atual de um ticket aberto. |
| Fila critica | Tickets abertos acima do limite operacional de aging. |
| ROW | Resto do mundo, agrupamento para paises fora das regioes principais. |
| LATAM | America Latina fora dos paises tratados individualmente. |
| Snapshot | Base congelada para preservar numeros historicos. |
| Dashboard-read | Edge Function Supabase usada como API de leitura do dashboard. |

## 28. Regra final de manutencao

Quando houver divergencia entre abas, a ordem correta de investigacao e:

1. Confirmar periodo e filtros.
2. Confirmar se o modo e Corridas ou Uteis.
3. Conferir se o volume base e o mesmo.
4. Conferir se a metrica deveria mudar com modo de hora.
5. Conferir ticket a ticket em uma amostra.
6. Corrigir na fonte canonica da regra, nao apenas no card.




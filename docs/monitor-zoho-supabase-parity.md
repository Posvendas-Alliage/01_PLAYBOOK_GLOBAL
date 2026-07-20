# Monitor Zoho x Supabase

Script deterministico para cron:

```powershell
node tools/monitor-zoho-supabase-parity.js --weeks=12 --months=12
```

Ele compara Zoho Desk e Supabase por:

- total de tickets por semana ISO;
- total de tickets por mes;
- abertos e fechados por periodo;
- IDs faltando no Supabase;
- IDs extras no Supabase;
- divergencia de status ou `closed_time`;
- tickets no Supabase sem metricas ou sem detalhe;
- metricas oficiais da view `vw_tickets_bi_base` por semana e por mes (`total`, `abertos`, `fechados`, SLA, MTFC e MTTS);
- frescor dos syncs essenciais (`v1e_incremental`, `open_tickets_sweep`, `v1g_ticket_history_sync`, `v1f_deletion_sweep`) com limite maximo de 24h desde a ultima execucao `success` ou `partial_success`.

O script grava relatorios em `reports/parity/` e retorna:

- exit code `0`: tudo dentro da tolerancia;
- exit code `1`: erro operacional;
- exit code `2`: divergencia encontrada ou sync essencial com mais de 24h sem atualizacao valida.

## Variaveis

Configure no ambiente do servidor do cron:

```ini
SUPABASE_URL=https://bryegtpdjqpwtyefoznq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=
ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_REFRESH_TOKEN=
ZOHO_ORG_ID=
ZOHO_DEPARTMENT_IDS=1128522000000453544,1128522000008788112,1128522000000006907
```

Para permitir correcao automatica via Edge Function:

```ini
SYNC_FUNCTION_KEY=
```

`SYNC_FUNCTION_KEY` precisa ser uma chave aceita por `sync-tickets-v0`. Se a Edge Function estiver com `verify_jwt=true`, use uma chave JWT legada valida para o projeto.

## Correcao

Por padrao o script nao corrige. Ele apenas audita.

Para corrigir itens seguros:

```powershell
node tools/monitor-zoho-supabase-parity.js --fix --max-fix-tickets=200
```

Com `--fix`, ele:

- chama `targeted_reconciliation_backfill` para tickets ausentes ou com status divergente;
- chama `missing_metrics_sweep` quando houver tickets sem `raw_metrics`;
- respeita o limite de `--max-fix-tickets`;
- gera relatorio com as acoes executadas.

O `--fix` nao apaga tickets extras automaticamente e nao altera diretamente as metricas oficiais; ele dispara os fluxos de reconciliacao/sweep para recompor a base de origem das metricas.

Para simular sem executar:

```powershell
node tools/monitor-zoho-supabase-parity.js --fix --dry-run
```

## Exemplo de Agendador do Windows

```powershell
$action = New-ScheduledTaskAction `
  -Execute "node" `
  -Argument "tools/monitor-zoho-supabase-parity.js --weeks=12 --months=12" `
  -WorkingDirectory "C:\Users\guilherme.alamino\Desktop\Guilherme Bernardes Alamino\Projetos\01_PROJETO - ZOHODESK\05_DevArea\01_PLAYBOOK_GLOBAL_GIT"

$trigger = New-ScheduledTaskTrigger -Daily -At 7:00
Register-ScheduledTask -TaskName "Zoho Supabase Parity Monitor" -Action $action -Trigger $trigger
```

Para uma rotina com correcao automatica, use uma segunda tarefa em horario controlado com `--fix`.
## Netlify

Tambem existe uma versao Netlify do monitor:

- `netlify/functions/zoho-supabase-parity-background.ts`: executa a auditoria Zoho x Supabase e grava o resultado em `sync_runs` com `sync_type = netlify_parity_monitor`.
- `netlify/functions/zoho-supabase-parity.ts`: endpoint manual `/api/monitor/zoho-supabase-parity` para consultar ultimas execucoes (`GET`) ou disparar uma execucao (`POST`).
- `netlify/functions/zoho-supabase-parity-schedule.ts`: agenda `0 * * * *` em UTC e dispara o background.
- `netlify/functions/supabase-config.ts`: serve `/config/supabase.js` a partir das variaveis de ambiente do Netlify.

Variaveis obrigatorias no Netlify:

```ini
PLAYBOOK_SUPABASE_URL=https://bryegtpdjqpwtyefoznq.supabase.co
PLAYBOOK_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_REFRESH_TOKEN=
ZOHO_ORG_ID=
ZOHO_DEPARTMENT_IDS=1128522000000453544,1128522000008788112,1128522000000006907
MONITOR_AUTH_TOKEN=
```

`SUPABASE_SERVICE_ROLE_KEY` fica apenas no servidor Netlify. A chave publica usada pelo frontend deve ficar em `PLAYBOOK_SUPABASE_PUBLISHABLE_KEY` ou `PLAYBOOK_SUPABASE_ANON_KEY`.

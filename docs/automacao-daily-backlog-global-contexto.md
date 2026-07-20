# Contexto de Replicacao - Daily Backlog Global PDF

## Objetivo

Este documento serve como handover para replicar a automacao `Daily Backlog Global PDF` caso a conta do usuario mude ou a operacao precise ser transferida para outra pessoa.

## O que esta automacao entrega

- Um PDF global com todos os tickets abertos do backlog.
- Um PDF separado por regiao.
- Um `manifest.json` com os indicadores e metadados da execucao.
- Um `email-body-trilingual.txt` com o corpo do e-mail em PT-BR, EN e ES.
- Um `outlook-draft-payload.json` com assunto, destinatarios, corpo e anexos.
- Um rascunho no Outlook do usuario com todos os PDFs anexados, sem envio automatico.

## Arquivos e caminhos principais

- Script principal: [`c:\Users\guilherme.alamino\Desktop\Guilherme Bernardes Alamino\Projetos\01_PROJETO - ZOHODESK\05_DevArea\01_PLAYBOOK_GLOBAL_GIT\tools\run-daily-backlog-report.js`](c:\Users\guilherme.alamino\Desktop\Guilherme Bernardes Alamino\Projetos\01_PROJETO - ZOHODESK\05_DevArea\01_PLAYBOOK_GLOBAL_GIT\tools\run-daily-backlog-report.js)
- Pasta de saida: [`c:\Users\guilherme.alamino\Desktop\Guilherme Bernardes Alamino\Projetos\01_PROJETO - ZOHODESK\05_DevArea\01_PLAYBOOK_GLOBAL_GIT\reports`](c:\Users\guilherme.alamino\Desktop\Guilherme Bernardes Alamino\Projetos\01_PROJETO - ZOHODESK\05_DevArea\01_PLAYBOOK_GLOBAL_GIT\reports)
- Memoria operacional da automacao: `C:\Users\guilherme.alamino\.codex\automations\daily-backlog-global-pdf\memory.md`

## Dependencias de contexto

### Fonte dos dados

- Sistema consultado: [Daily Backlog Control](https://globalplaybook.netlify.app/01_kpi/kpi_v2/page2-backlog)
- Endpoint usado pelo script: `https://hqaxpbnduupjdhuuwpmg.supabase.co/functions/v1/dashboard-read?type=bi-backlog&limit=10000`
- O script chama esse endpoint diretamente com `fetch`.

### Regras de negocio embutidas no script

- Exclui tickets da oficina via `department_id`.
- Exclui tickets e dominios especificos.
- Mantem apenas os grupos operacionais padrao:
  - `Suporte geral`
  - `Especialista`
  - `Sem dono`
- Agrupa regioes em:
  - `Brasil`
  - `Argentina`
  - `Mexico`
  - `LATAM`
  - `USA`
  - `ROW`

### Destinatarios padrao

Os destinatarios padrao ficam hardcoded no script e tambem sao exigidos pela automacao:

- `vitor.donizetti@alliage-global.com`
- `ygor.oliveira@alliage-global.com`
- `khuang@PreXion.com`
- `gabriel.pedroso@alliage-dental.com`
- `renata.alves@alliage-global.com`

## O que precisa existir na nova conta

### Acesso tecnico

- A nova conta precisa conseguir abrir o workspace local.
- A nova conta precisa conseguir executar `node`.
- A nova conta precisa ter acesso ao endpoint do backlog.
- A nova conta precisa ter Outlook desktop configurado ou conector Outlook funcional.

### Acesso funcional

- A nova conta precisa ter permissao para criar rascunhos no proprio Outlook.
- A nova conta precisa conseguir anexar arquivos locais no draft.
- A nova conta precisa conseguir revisar a pasta `reports/`.

## Como replicar em troca de conta

1. Validar se a nova conta consegue executar `node tools/run-daily-backlog-report.js` na raiz do workspace.
2. Confirmar que a nova conta enxerga o Outlook correto e salva drafts em `Drafts`.
3. Conferir se o draft criado usa os destinatarios padrao e nao envia automaticamente.
4. Conferir se todos os PDFs gerados aparecem anexados no draft salvo.
5. Atualizar a memoria da automacao na nova conta, se o caminho do `CODEX_HOME` mudar.

## Comportamento observado em execucoes reais

- O endpoint ja falhou por restricao de rede no runtime Node.
- Em alguns dias o conector Outlook MCP anexou sem erro, mas o Outlook desktop mostrou draft sem anexos.
- Quando isso acontece, o caminho confiavel e criar ou recriar o draft via Outlook local COM e validar os anexos no item salvo em `Drafts`.

## Riscos conhecidos

- Falha de `fetch` no runtime Node.
- Divergencia entre o draft retornado pelo conector e o draft salvo no Outlook desktop.
- Mudanca de destinatarios no processo sem refletir no script ou no prompt da automacao.
- Mudanca no endpoint ou no schema do payload.

## Regra operacional importante

A execucao so deve ser considerada concluida quando:

- a pasta oficial da rodada existir em `reports/daily-backlog-YYYY-MM-DD_HH-mm`
- os artefatos textuais e PDFs estiverem presentes
- o draft existir no Outlook
- todos os PDFs esperados estiverem realmente anexados no draft salvo

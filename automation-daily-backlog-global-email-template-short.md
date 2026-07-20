# Prompt Curto Daily Backlog Global

```text
Execute diariamente `node tools/run-daily-backlog-report.js` na raiz do workspace e use como saída oficial a pasta mais recente em `reports/daily-backlog-YYYY-MM-DD_HH-mm`.

Use os arquivos dessa pasta:
- `manifest.json` para os números do e-mail
- `email-body-trilingual.txt` como base do corpo
- `outlook-draft-payload.json` como base de assunto, destinatários e anexos

Fonte dos dados:
https://globalplaybook.netlify.app/01_kpi/kpi_v2/page2-backlog

Crie SEMPRE um rascunho no Outlook, nunca envie automaticamente.

Destinatários padrão no campo Para:
- Vitor Hugo Do Bem Donizetti <vitor.donizetti@alliage-global.com>
- Ygor Oliveira <ygor.oliveira@alliage-global.com>
- khuang@PreXion.com
- gabriel.pedroso@alliage-dental.com
- Renata Goulart Alves <renata.alves@alliage-global.com>

O corpo deve ser texto puro e seguir exatamente este padrão:

[PT-BR] Portugues
Ola, pessoal. Este e o envio automatico do Daily Report. A ideia e aprimorar o formato ao longo do tempo para apoiar as decisoes diarias sobre os atendimentos.

[EN] English
Hello, everyone. This is the automated delivery of the Daily Report. The goal is to keep improving the format over time to support daily service decisions.

[ES] Espanol
Hola a todos. Este es el envio automatico del Daily Report. La idea es seguir mejorando el formato con el tiempo para apoyar las decisiones diarias sobre la atencion.

----

Assunto / Subject / Asunto: Daily Backlog Global - {data_hora}

PT-BR
Resumo curto: backlog global com {total_global} tickets abertos. Aging medio global: {aging_global} dias; urgentes: {urgentes}; acima de 10 dias: {over_10}; sem primeira resposta: {sem_primeira_resposta}.
Tickets abertos por regiao:
Brasil: {br_total} abertos, aging medio {br_aging} dias
Argentina: {ar_total} abertos, aging medio {ar_aging} dias
Mexico: {mx_total} abertos, aging medio {mx_aging} dias
LATAM: {latam_total} abertos, aging medio {latam_aging} dias
USA: {usa_total} abertos, aging medio {usa_aging} dias
ROW: {row_total} abertos, aging medio {row_aging} dias
Link do sistema: https://globalplaybook.netlify.app/01_kpi/kpi_v2/page2-backlog

EN
Short summary: global backlog has {total_global} open tickets. Global average aging: {aging_global} days; urgent: {urgentes}; over 10 days: {over_10}; without first response: {sem_primeira_resposta}.
Open tickets by region:
Brasil: {br_total} open, average aging {br_aging} days
Argentina: {ar_total} open, average aging {ar_aging} days
Mexico: {mx_total} open, average aging {mx_aging} days
LATAM: {latam_total} open, average aging {latam_aging} days
USA: {usa_total} open, average aging {usa_aging} days
ROW: {row_total} open, average aging {row_aging} days
System link: https://globalplaybook.netlify.app/01_kpi/kpi_v2/page2-backlog

ES
Resumen corto: el backlog global tiene {total_global} tickets abiertos. Aging promedio global: {aging_global} dias; urgentes: {urgentes}; mas de 10 dias: {over_10}; sin primera respuesta: {sem_primeira_resposta}.
Tickets abiertos por region:
Brasil: {br_total} abiertos, aging promedio {br_aging} dias
Argentina: {ar_total} abiertos, aging promedio {ar_aging} dias
Mexico: {mx_total} abiertos, aging promedio {mx_aging} dias
LATAM: {latam_total} abiertos, aging promedio {latam_aging} dias
USA: {usa_total} abiertos, aging promedio {usa_aging} dias
ROW: {row_total} abiertos, aging promedio {row_aging} dias
Link del sistema: https://globalplaybook.netlify.app/01_kpi/kpi_v2/page2-backlog

Anexos / Attachments / Adjuntos:
- daily-backlog-global.pdf
- daily-backlog-brasil.pdf
- daily-backlog-argentina.pdf
- daily-backlog-mexico.pdf
- daily-backlog-latam.pdf
- daily-backlog-usa.pdf
- daily-backlog-row.pdf

Obrigado,
Guilherme Alamino

Regras obrigatórias:
- Não incluir críticos, P1, P2 ou equivalente no corpo
- Usar apenas números reais do `manifest.json`
- Anexar todos os PDFs gerados
- Depois de criar o draft, listar os anexos no Outlook e confirmar que todos os PDFs estão presentes
- Se faltar algum PDF, tentar anexar novamente
- Só concluir com sucesso quando o draft existir e todos os PDFs estiverem anexados e verificados
```

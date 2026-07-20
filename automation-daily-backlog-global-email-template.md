# Prompt Para Nova Automacao Daily Backlog Global

Use o texto abaixo como instrucoes da nova automacao:

```text
Quero que esta automação replique exatamente o padrão do meu e-mail diário de backlog global no Outlook, sem enviar automaticamente.

Objetivo:
Executar o relatório diário do Playbook Global, gerar os PDFs e criar sempre um rascunho no Outlook com o mesmo assunto, destinatários, corpo e anexos do meu padrão atual.

Fonte de dados:
Use o utilitário local `node tools/run-daily-backlog-report.js` a partir da raiz do workspace.
Considere como saída oficial a pasta mais recente gerada em `reports/daily-backlog-YYYY-MM-DD_HH-mm`.

Arquivos obrigatórios da execução:
- PDF global com todos os tickets abertos
- PDFs separados por região
- `manifest.json`
- `email-body-trilingual.txt`
- `outlook-draft-payload.json`

Link obrigatório do sistema:
https://globalplaybook.netlify.app/01_kpi/kpi_v2/page2-backlog

Destinatários padrão no campo Para:
- Vitor Hugo Do Bem Donizetti <vitor.donizetti@alliage-global.com>
- Ygor Oliveira <ygor.oliveira@alliage-global.com>
- khuang@PreXion.com
- gabriel.pedroso@alliage-dental.com
- Renata Goulart Alves <renata.alves@alliage-global.com>

Origem das informações:

1. Fonte principal dos tickets e métricas
- A automação deve executar `node tools/run-daily-backlog-report.js` a partir da raiz do workspace.
- Esse utilitário consome o mesmo endpoint do sistema Daily Backlog Control:
  https://globalplaybook.netlify.app/01_kpi/kpi_v2/page2-backlog
- O utilitário aplica os filtros padrão do dashboard e gera a lista completa de tickets abertos no escopo global e por região.

2. Pasta oficial da execução
- Após rodar o utilitário, a automação deve identificar a pasta mais recente em:
  `reports/daily-backlog-YYYY-MM-DD_HH-mm`
- Essa pasta mais recente é a saída oficial da execução.

3. De onde vêm os números do e-mail
- Os números do corpo do e-mail devem vir dos dados gerados na execução atual, principalmente do arquivo `manifest.json`.
- O resumo global deve usar os campos equivalentes a:
  - total global de tickets abertos
  - aging médio global
  - urgentes
  - tickets acima de 10 dias
  - tickets sem primeira resposta
- As linhas por região devem usar apenas:
  - total aberto da região
  - aging médio da região
- Não inventar números, não reaproveitar números antigos e não calcular valores fora dos dados da execução atual.

4. De onde vêm o assunto e o texto base do e-mail
- O assunto, destinatários e estrutura-base do rascunho devem ser lidos de:
  - `outlook-draft-payload.json`
  - `email-body-trilingual.txt`
- Mesmo usando esses arquivos como base, a automação deve validar se o corpo final segue exatamente o padrão obrigatório definido nas instruções.

5. De onde vêm os anexos
- Os anexos devem ser todos os PDFs gerados na pasta oficial da execução:
  - 1 PDF global com todos os tickets abertos
  - 1 PDF separado para cada região gerada
- Os PDFs esperados normalmente são:
  - `daily-backlog-global.pdf`
  - `daily-backlog-brasil.pdf`
  - `daily-backlog-argentina.pdf`
  - `daily-backlog-mexico.pdf`
  - `daily-backlog-latam.pdf`
  - `daily-backlog-usa.pdf`
  - `daily-backlog-row.pdf`

6. De onde vem o link do sistema
- O link fixo do sistema que deve aparecer no corpo do e-mail é:
  https://globalplaybook.netlify.app/01_kpi/kpi_v2/page2-backlog

7. Validação final
- Depois de criar o rascunho no Outlook, a automação deve listar os anexos do draft no próprio Outlook e conferir se todos os PDFs esperados estão presentes.
- Se algum arquivo estiver faltando, deve tentar anexar novamente antes de concluir.

Regras obrigatórias do rascunho:
- Criar SEMPRE um rascunho no Outlook, nunca enviar automaticamente.
- Usar assunto, destinatários e corpo com base em `outlook-draft-payload.json` e `email-body-trilingual.txt`.
- O corpo deve ser em texto puro.
- O corpo deve começar com a abertura trilíngue abaixo.
- Depois deve haver a separação com `----`.
- Depois devem vir as seções PT-BR, EN e ES.
- Não incluir contagem de críticos, P1, P2 ou texto equivalente no corpo do e-mail.
- Não inventar números. Use apenas os dados reais gerados na execução, especialmente `manifest.json`.
- Encerrar com a lista de anexos e a assinatura `Obrigado,` e `Guilherme Alamino`.

Abertura trilíngue obrigatória:
[PT-BR] Portugues
Ola, pessoal. Este e o envio automatico do Daily Report. A ideia e aprimorar o formato ao longo do tempo para apoiar as decisoes diarias sobre os atendimentos.

[EN] English
Hello, everyone. This is the automated delivery of the Daily Report. The goal is to keep improving the format over time to support daily service decisions.

[ES] Espanol
Hola a todos. Este es el envio automatico del Daily Report. La idea es seguir mejorando el formato con el tiempo para apoyar las decisiones diarias sobre la atencion.

Estrutura obrigatória do corpo:
----
Assunto / Subject / Asunto: Daily Backlog Global - {data_hora}

PT-BR
Resumo curto: backlog global com {total_global} tickets abertos. Aging medio global: {aging_global} dias; urgentes: {urgentes}; acima de 10 dias: {over_10}; sem primeira resposta: {sem_primeira_resposta}.
Tickets abertos por regiao:
{Regiao}: {total_aberto} abertos, aging medio {aging_medio} dias
Link do sistema: https://globalplaybook.netlify.app/01_kpi/kpi_v2/page2-backlog

EN
Short summary: global backlog has {total_global} open tickets. Global average aging: {aging_global} days; urgent: {urgentes}; over 10 days: {over_10}; without first response: {sem_primeira_resposta}.
Open tickets by region:
{Region}: {total_open} open, average aging {average_aging} days
System link: https://globalplaybook.netlify.app/01_kpi/kpi_v2/page2-backlog

ES
Resumen corto: el backlog global tiene {total_global} tickets abiertos. Aging promedio global: {aging_global} dias; urgentes: {urgentes}; mas de 10 dias: {over_10}; sin primera respuesta: {sem_primeira_resposta}.
Tickets abiertos por region:
{Region}: {total_abierto} abiertos, aging promedio {aging_promedio} dias
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

Regras dos resumos:
- O resumo global deve conter apenas:
  - total global de tickets abertos
  - aging médio global
  - urgentes
  - tickets acima de 10 dias
  - tickets sem primeira resposta
- A lista por região deve conter apenas:
  - total aberto da região
  - aging médio da região

Regras dos anexos:
- Anexar obrigatoriamente todos os PDFs gerados:
  - 1 PDF global
  - 1 PDF para cada região gerada
- A execução só pode ser considerada concluída quando o rascunho existir e os PDFs estiverem anexados.
- Depois de criar o draft, verificar os anexos no Outlook.
- Confirmar que a lista de anexos contém todos os PDFs esperados.
- Se algum PDF não estiver anexado, tentar anexar novamente.
- Se ainda assim falhar, não concluir normalmente. Informar que o draft ficou incompleto e listar exatamente quais PDFs faltaram.

Critério de sucesso:
A automação só termina com sucesso quando:
1. a pasta oficial da execução foi gerada em `reports/daily-backlog-YYYY-MM-DD_HH-mm`
2. o rascunho do Outlook foi criado
3. o corpo do e-mail segue exatamente o padrão acima
4. todos os PDFs esperados estão anexados e verificados
```

# Processo da Automacao - Daily Backlog Global PDF

## 1. Qual e o percurso da automacao

O percurso operacional da automacao e este:

1. Executa o script [`c:\Users\guilherme.alamino\Desktop\Guilherme Bernardes Alamino\Projetos\01_PROJETO - ZOHODESK\05_DevArea\01_PLAYBOOK_GLOBAL_GIT\tools\run-daily-backlog-report.js`](c:\Users\guilherme.alamino\Desktop\Guilherme Bernardes Alamino\Projetos\01_PROJETO - ZOHODESK\05_DevArea\01_PLAYBOOK_GLOBAL_GIT\tools\run-daily-backlog-report.js) na raiz do workspace.
2. Busca os tickets abertos no endpoint do Daily Backlog Control.
3. Aplica os filtros padrao do dashboard e as exclusoes locais do script.
4. Calcula os indicadores globais e por regiao.
5. Gera a pasta de saida oficial em `reports/daily-backlog-YYYY-MM-DD_HH-mm`.
6. Cria o PDF global.
7. Cria um PDF separado para cada regiao encontrada.
8. Gera `manifest.json`, `email-body-trilingual.txt` e `outlook-draft-payload.json`.
9. Cria um draft no Outlook sem envio automatico.
10. Anexa todos os PDFs ao draft.
11. Verifica se os anexos realmente aparecem no draft salvo.
12. So conclui a rotina quando os anexos esperados estao presentes.

## 2. O que ela executa

### Coleta

- Consulta o endpoint `dashboard-read` do backlog.
- Usa `limit=10000`.
- Trabalha com o mesmo conjunto logico usado pelo dashboard do sistema.

### Tratamento

- Remove tickets fora do escopo operacional.
- Normaliza regioes.
- Calcula:
  - total aberto global
  - sem primeira resposta
  - acima de 10 dias
  - urgentes
  - criticos P1/P2
  - aging medio
- Ordena tickets por risco para destacar o que deve aparecer primeiro nos PDFs.

### Geracao de artefatos

- PDF global com backlog completo.
- PDFs regionais.
- Manifesto tecnico em JSON.
- Corpo do e-mail trilingue em texto puro.
- Payload do draft para Outlook.

### Entrega

- Cria rascunho no Outlook.
- Preenche assunto, destinatarios e corpo.
- Anexa todos os PDFs.
- Faz validacao final dos anexos.

## 3. Como e executado

### Comando principal

Executado a partir da raiz do repositório:

```powershell
node tools/run-daily-backlog-report.js
```

### Estrutura de saida

Cada execucao gera uma nova pasta em:

```text
reports/daily-backlog-YYYY-MM-DD_HH-mm
```

Essa pasta passa a ser a saida oficial da rodada.

### Estrutura minima esperada

- `daily-backlog-global.pdf`
- `daily-backlog-brasil.pdf`
- `daily-backlog-argentina.pdf`
- `daily-backlog-mexico.pdf`
- `daily-backlog-latam.pdf`
- `daily-backlog-usa.pdf`
- `daily-backlog-row.pdf`
- `manifest.json`
- `email-body-trilingual.txt`
- `outlook-draft-payload.json`

Observacao:
o numero de PDFs regionais pode variar se a composicao das regioes mudar, mas a validacao final sempre precisa comparar o draft com a lista real de PDFs gerados naquela rodada.

### Caminho de fallback ja observado

Quando o `fetch` do Node falha por restricao de runtime, o historico mostra dois comportamentos:

- reexecucao com snapshot local via `BACKLOG_PAYLOAD_FILE`, quando permitido pela regra da rodada
- execucao fora do sandbox ou uso do Outlook local COM para finalizar o draft, quando o problema esta no conector ou no runtime

## 4. Para que serve

Esta automacao existe para padronizar a leitura diaria do backlog global e reduzir trabalho manual em quatro frentes:

- consolidar o backlog aberto global em um pacote unico
- separar visao por regiao sem montar arquivos manualmente
- produzir um resumo executivo trilingue consistente
- deixar o e-mail pronto em draft com todos os anexos, sem depender de montagem manual no Outlook

## 5. Resultado esperado ao final

Uma execucao correta entrega:

- dados do backlog atual
- PDFs global e regionais
- manifesto da execucao
- corpo do e-mail pronto
- draft salvo no Outlook
- todos os PDFs anexados e conferidos

Se qualquer PDF nao estiver anexado no draft salvo, a execucao nao deve ser tratada como concluida normalmente.

# Documentacao do Playbook Global

Esta pasta organiza a documentacao local do projeto por finalidade. Os arquivos em `docs/` sao excluidos do deploy Netlify por `.netlifyignore`, entao servem como material de manutencao do repositorio.

## Estrutura

| Pasta | Conteudo | Quando usar |
| --- | --- | --- |
| `00-visao-geral/` | Documentacao completa do sistema em Markdown e Word. | Onboarding, arquitetura, conexoes e manutencao geral. |
| `01-seguranca/` | Documentos de autenticacao, RLS, admin e protecao de rotas. | Mudancas de login, acesso, Netlify Edge ou Supabase Auth. |
| `02-operacao/daily-backlog/` | Documentacao da automacao Daily Backlog Global. | Manter, replicar ou auditar a rotina diaria de backlog/PDF. |
| `03-monitoramento/` | Auditoria Zoho x Supabase e paridade de dados. | Validar sincronizacao, divergencias e correcoes controladas. |
| `04-handover/` | Documento e builder de handover geral. | Transferencia de conhecimento e encerramento de ciclo. |

## Documentos principais

- `00-visao-geral/documentacao-completa-sistema-playbook-global.md`
- `00-visao-geral/documentacao-completa-sistema-playbook-global.docx`
- `01-seguranca/seguranca-playbook.md`
- `03-monitoramento/monitor-zoho-supabase-parity.md`
- `02-operacao/daily-backlog/automacao-daily-backlog-global-contexto.md`
- `02-operacao/daily-backlog/automacao-daily-backlog-global-processo.md`

## Regra de manutencao

Ao mover ou renomear documentos, atualize as referencias em `README.md`, scripts em `tools/` e documentos que listam caminhos internos.

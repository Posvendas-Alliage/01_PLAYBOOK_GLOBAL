# Feature de segurança do Playbook Global

Documento historico de uma abordagem anterior. O procedimento operacional vigente esta em docs/seguranca-playbook.md.

## Objetivo

Esta feature adiciona autenticação obrigatória, aprovação administrativa de usuários, bloqueio real de entrega de arquivos no Netlify e validação server-side dos dados privados consumidos pelo Playbook.

## Componentes implementados

- `auth.html`: login, cadastro, recuperação e troca de senha.
- `administracao-playbook.html`: área administrativa para aprovar, recusar, suspender e reativar usuários.
- `js/auth.js`: cliente Supabase e controle de sessão centralizados.
- `js/playbook-auth.js` e `js/playbook-auth-guard.js`: ponte de compatibilidade para páginas que já tinham o guard legado.
- `css/auth.css`: estilos responsivos e acessíveis da autenticação/admin.
- `netlify/edge-functions/auth-gate.ts`: bloqueio no edge antes de servir HTML, documentos, relatórios, outputs e assets protegidos.
- `netlify/functions/auth-session.ts`: grava cookies HttpOnly a partir de uma sessão Supabase válida.
- `netlify/functions/auth-logout.ts`: limpa cookies HttpOnly no logout.
- `supabase/migrations/20260624112946_playbook_security_auth.sql`: perfis, auditoria, RLS, policies e trigger de perfil pendente.
- `supabase/functions/playbook-admin/index.ts`: operações administrativas sensíveis validadas no servidor.
- `supabase/functions/playbook-bootstrap-admin/index.ts`: bootstrap seguro/idempotente do administrador inicial.
- `supabase/functions/dashboard-read/index.ts`: agora exige usuário autenticado, aprovado e sem troca de senha pendente.
- `netlify.toml`: publicação estática e Edge Function global.

## Estados e papéis

Banco:

- `role`: `user`, `admin`
- `status`: `pending`, `approved`, `rejected`, `suspended`

Interface:

- `pending` = Pendente
- `approved` = Aprovado
- `rejected` = Recusado
- `suspended` = Suspenso

## Variáveis de ambiente

Use `.env.example` apenas como modelo. Não commitar `.env` real.

### Netlify

Configure no painel do Netlify:

```text
PLAYBOOK_SUPABASE_URL
PLAYBOOK_SUPABASE_PUBLISHABLE_KEY
```

`PLAYBOOK_SUPABASE_PUBLISHABLE_KEY` pode ser uma publishable key nova ou, enquanto o projeto ainda usar chaves legadas, o anon key.

### Supabase Edge Functions

Configure em Supabase Function Secrets:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
PLAYBOOK_BOOTSTRAP_TOKEN
PLAYBOOK_INITIAL_ADMIN_EMAIL
PLAYBOOK_ADMIN_INITIAL_PASSWORD
PLAYBOOK_BOOTSTRAP_RESET_PASSWORD
```

`SUPABASE_SERVICE_ROLE_KEY` nunca deve aparecer em HTML, JavaScript público, `config/supabase.js` ou SQL versionado.

## Deploy Supabase

Aplicar a migration:

```powershell
supabase db push
```

Deploy das funções:

```powershell
supabase functions deploy dashboard-read --project-ref hqaxpbnduupjdhuuwpmg
supabase functions deploy playbook-admin --project-ref hqaxpbnduupjdhuuwpmg
supabase functions deploy playbook-bootstrap-admin --project-ref hqaxpbnduupjdhuuwpmg --no-verify-jwt
```

Configuração esperada:

- `dashboard-read`: `verify_jwt = true`
- `playbook-admin`: `verify_jwt = true`
- `playbook-bootstrap-admin`: `verify_jwt = false`, mas com `x-bootstrap-token` obrigatório.

## Bootstrap seguro do admin inicial

Administrador inicial:

```text
posvendas@alliage-global.com
```

A senha inicial temporária deve ser informada apenas como secret `PLAYBOOK_ADMIN_INITIAL_PASSWORD` no Supabase, nunca em arquivo versionado.

Depois de configurar `PLAYBOOK_BOOTSTRAP_TOKEN` e `PLAYBOOK_ADMIN_INITIAL_PASSWORD`, invoque:

```powershell
$headers = @{
  "x-bootstrap-token" = "<PLAYBOOK_BOOTSTRAP_TOKEN>"
  "Content-Type" = "application/json"
}
Invoke-RestMethod `
  -Method Post `
  -Uri "https://hqaxpbnduupjdhuuwpmg.supabase.co/functions/v1/playbook-bootstrap-admin" `
  -Headers $headers `
  -Body "{}"
```

O bootstrap é idempotente:

- cria o usuário se ele não existir;
- confirma e aprova o e-mail;
- define `role=admin`;
- define `status=approved`;
- marca `force_password_change=true` quando cria ou quando `PLAYBOOK_BOOTSTRAP_RESET_PASSWORD=true`.

Após o primeiro login, o administrador deve trocar a senha antes de acessar o Playbook.

## Proteção real em hospedagem estática

O Playbook é publicado em Netlify (`globalplaybook.netlify.app`). Em hospedagem puramente estática, JavaScript sozinho não impede leitura direta de HTML, documentos, relatórios ou arquivos estáticos.

Por isso, a proteção real foi implementada com `netlify/edge-functions/auth-gate.ts`, que roda antes da entrega dos arquivos:

- libera apenas `auth.html`, rotas de sessão/logout e assets mínimos da autenticação;
- exige cookies HttpOnly de sessão para qualquer outro caminho;
- valida o access token no Supabase Auth;
- consulta `playbook_profiles` com RLS;
- bloqueia usuários pendentes, recusados, suspensos ou com troca de senha pendente;
- exige `role=admin` para `administracao-playbook.html`.

Se o site for movido para outra hospedagem, é obrigatório implementar middleware/edge equivalente. Sem isso, a solução volta a ser apenas um redirecionamento no navegador.

## Dados privados e BI

O endpoint `dashboard-read` foi baixado do Supabase e endurecido localmente. Ele agora:

- exige Bearer token de usuário real;
- rejeita anon key como autorização efetiva;
- consulta `playbook_profiles`;
- só entrega dados para `status=approved`;
- bloqueia `force_password_change=true`.

O cliente KPI V2 deixou de usar o anon key como `Authorization` e passa a enviar o access token do usuário. Funções legadas de REST direto para `zoho_tickets`/`zoho_agents` foram neutralizadas e redirecionadas para `dashboard-read`.

## Fluxos a validar

- Visitante sem sessão em `/`, páginas internas, `docs/`, `reports/` e `outputs/`: redireciona para `auth.html`.
- Login inválido: mensagem clara.
- Cadastro: cria usuário Supabase e perfil `pending`; usuário não acessa.
- Usuário `pending`: bloqueado com mensagem de aprovação pendente.
- Usuário `approved`: acessa páginas e BI.
- Usuário `rejected`: bloqueado.
- Usuário `suspended`: bloqueado.
- Admin: acessa `administracao-playbook.html`.
- Usuário comum: não acessa administração.
- Logout: limpa Supabase local session e cookies HttpOnly.
- Recuperação de senha: envia link de recuperação.
- Troca de senha inicial: obrigatória para admin bootstrap.
- Refresh/sessão expirada: Edge tenta refresh com cookie e, se falhar, redireciona para login.

## Observações de segurança

- Não usar `user_metadata` para autorização.
- Não expor `service_role` ou secret key no frontend.
- Manter RLS ativa em toda tabela nova.
- Operações administrativas sensíveis passam pela Edge Function `playbook-admin`.
- O admin não consegue suspender/alterar o próprio status pela área administrativa.
- Status e alterações são auditados em `playbook_profile_audit`.

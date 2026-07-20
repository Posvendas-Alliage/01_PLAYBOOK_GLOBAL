# Seguranca do Playbook Global

Esta feature adiciona autenticacao obrigatoria, aprovacao administrativa de usuarios, troca de senha inicial e RLS para os dados privados consumidos pelo Playbook. O frontend permanece local; somente o Supabase remoto armazena contas e aplica as autorizacoes.

## O que foi implementado

- Guard reutilizavel em JavaScript para todas as paginas HTML do Playbook.
- Tela publica de login, cadastro e recuperacao de senha em login.html.
- Tela de alteracao de senha em alterar-senha.html.
- Pagina Administracao do Playbook em administracao-playbook.html, exclusiva para role=admin e status=approved.
- Supabase Edge Function playbook-admin para listar usuarios, alterar status e promover/rebaixar administradores de forma server-side.
- Migrations Supabase para playbook_profiles, auditoria, roles/status controlados, RLS e policies de leitura somente para usuarios aprovados.
- Script seguro e idempotente de bootstrap do administrador inicial em tools/bootstrap-playbook-admin.mjs.
- .env.example sem valores secretos.
- Sessao do navegador em sessionStorage, encerrada ao fechar a aba, sem access token em cookie JavaScript.
- Senhas novas com 12 a 128 caracteres, maiuscula, minuscula, numero e simbolo.
- Mensagens genericas em login, cadastro e recuperacao para reduzir enumeracao de contas.

## Modelo de status e acesso

Cada usuario possui um perfil em public.playbook_profiles:

- role: user ou admin.
- status interno: pending, approved, rejected ou suspended. A interface exibe os rotulos Pendente, Aprovado, Recusado e Suspenso.
- force_password_change: exige troca de senha antes de liberar o Playbook.

Somente usuarios com status=approved acessam paginas protegidas e dados privados. Somente usuarios com role=admin e status=approved acessam a administracao.

O cadastro possui duas etapas independentes:

1. Confirmacao do e-mail pelo link enviado pelo Supabase Auth.
2. Aprovacao administrativa na pagina Administracao do Playbook.

Mesmo que o perfil esteja aprovado, o login pode falhar se o e-mail ainda nao tiver sido confirmado no Supabase Auth.

## Gestao de administradores

Administradores aprovados podem promover outros usuarios aprovados para admin pela pagina administracao-playbook.html.

Regras aplicadas:

- Apenas role=admin e status=approved pode administrar usuarios.
- Um usuario precisa estar aprovado antes de virar admin.
- A conta administrativa atual nao pode remover o proprio perfil admin.
- O sistema bloqueia a remocao, suspensao ou rejeicao do ultimo administrador aprovado.
- Toda alteracao de status ou perfil registra auditoria em playbook_profile_audit.
- A role tambem e sincronizada para app_metadata no Supabase Auth como playbook_role.

## Configuracao no Supabase

1. Aplique a migration:

       supabase db push

2. Faca deploy da Edge Function administrativa:

       supabase functions deploy playbook-admin

3. Garanta que a funcao tenha acesso as variaveis/secrets server-side:

   - SUPABASE_URL
   - SUPABASE_ANON_KEY ou SUPABASE_PUBLISHABLE_KEYS
   - SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_SECRET_KEYS

4. Em Auth URL Configuration, inclua as URLs publicas usadas pelo site:

   - .../login.html
   - .../alterar-senha.html

5. Mantenha o service_role somente em secrets de servidor/Edge Function. Ele nunca deve ir para HTML, JavaScript publico ou config/supabase.js.

## Execucao local

Sirva a raiz com um servidor HTTP local; nao abra os arquivos por file://. Exemplo:

       python -m http.server 5500 --bind 127.0.0.1

Acesse http://127.0.0.1:5500/login.html. Nenhuma publicacao no Netlify e necessaria para o uso local atual.

## Bootstrap seguro do administrador inicial

O administrador inicial e criado por script local usando a Supabase Admin API. A senha inicial deve ser informada apenas por variavel de ambiente local ou .env nao versionado.

1. Copie o exemplo:

       Copy-Item .env.example .env

2. Preencha localmente:

   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - PLAYBOOK_ADMIN_EMAIL
   - PLAYBOOK_ADMIN_INITIAL_PASSWORD

3. Execute:

       node tools/bootstrap-playbook-admin.mjs

O script e idempotente: se o usuario ja existir, ele atualiza o perfil para admin aprovado sem imprimir a senha. Para forcar nova troca de senha em uma reexecucao, use PLAYBOOK_ADMIN_FORCE_PASSWORD_CHANGE=true.

Para manter uma conta administrativa de contingencia com senha gerenciada em secret, use PLAYBOOK_BOOTSTRAP_RESET_PASSWORD=true e PLAYBOOK_ADMIN_FORCE_PASSWORD_CHANGE=false. A senha continua fora do repositorio e pode ser redefinida executando novamente o bootstrap.

## Limite de confidencialidade local

O guard JavaScript impede a navegacao normal sem login, enquanto o Supabase protege os dados por RLS e funcoes autenticadas. Quem ja possui acesso ao sistema de arquivos local ainda consegue ler HTML, CSS e JavaScript estaticos. Se o frontend for publicado no futuro, sera necessario ativar protecao server-side/edge antes de considerar os arquivos HTML confidenciais.

## Controles de seguranca verificados em 29/06/2026

- Sem grants de tabela para anon no schema public.
- Tabelas operacionais com SELECT restrito a authenticated e perfil approved.
- RPCs do Kanban sem EXECUTE para anon e com verificacao explicita de perfil aprovado.
- Funcoes administrativas rejeitam requisicoes sem sessao aprovada.
- Funcao administrativa rejeita chamada sem Authorization com 401.
- Funcao administrativa rejeita chave anon como bearer token com 403.
- Promocao/rebaixamento de admin ocorre apenas server-side e protege contra remocao do ultimo admin aprovado.
- Bootstrap rejeita requisicoes sem segredo dedicado.
- Login invalido usa resposta generica; recuperacao nao confirma a existencia da conta.
- Login com e-mail ainda nao confirmado exibe instrucao especifica quando a senha esta correta e o Auth retorna email_not_confirmed.
- Cadastro e troca de senha validam 12+ caracteres, maiuscula, minuscula, numero e simbolo no cliente e na funcao administrativa.
- Login aprovado, administracao, logout, acesso direto sem sessao e layout movel foram testados no navegador local.

Pendencias recomendadas no painel do Supabase:

- Ativar protecao contra senhas vazadas.
- Aplicar no Auth a mesma politica de 12+ caracteres e requisitos de caracteres, pois validacao apenas no cliente pode ser contornada.
- Ativar CAPTCHA caso o cadastro continue exposto.
- Exigir MFA/AAL2 para administradores.
- Configurar SMTP corporativo e revisar limites de envio e tentativas.
- Trocar qualquer senha administrativa conhecida ou compartilhada por senha unica gerada por gerenciador.

## Validacoes recomendadas

- Visitante sem sessao acessando index.html e paginas internas: redireciona para login.html.
- Login invalido: mensagem clara.
- Cadastro novo: perfil fica pending, exibido como Pendente.
- Usuario pendente, recusado ou suspenso: nao acessa o Playbook.
- Usuario aprovado: acessa paginas e dados.
- Admin aprovado: acessa administracao-playbook.html.
- Usuario comum acessando administracao: redirecionado com acesso negado.
- Logout: remove sessao e volta para login.
- Recuperacao de senha: envia link para alterar-senha.html.
- Troca obrigatoria de senha inicial: redireciona para alterar-senha.html.
- Refresh e acesso direto por URL interna: guard reaplica validacao.
- Verificar no repositorio que nao ha service_role ou senha inicial em arquivos publicos.

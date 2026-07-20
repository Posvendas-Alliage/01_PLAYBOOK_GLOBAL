# Prompt para implementar a feature de seguranca

Implemente completamente uma nova feature de seguranca neste projeto. Nao entregue apenas um plano: analise o repositorio, desenvolva, teste e documente a solucao.

## Contexto

- O projeto e um Playbook Global multipagina, feito principalmente com HTML, CSS e JavaScript.
- Ja existe integracao com Supabase em `config/supabase.js` e uma pasta `supabase/`.
- Preserve a estrutura, o visual, a responsividade e o sistema multilingue existentes.
- Utilize Supabase Auth e banco de dados com RLS.
- Consulte a documentacao atual do Supabase antes de implementar.

## Requisitos funcionais

### 1. Autenticacao obrigatoria

- Nenhuma pagina ou aba do playbook pode ser utilizada sem autenticacao.
- Usuarios nao autenticados devem ser redirecionados automaticamente para a pagina de login.
- Preserve a URL originalmente solicitada e redirecione para ela depois do login.
- Evite exibir o conteudo protegido antes da validacao da sessao.
- Aplique a protecao em todas as paginas HTML, inclusive acessos por URL direta.
- Crie logout visivel no cabecalho ou menu do usuario.

### 2. Cadastro de usuarios

- Criar pagina de login e cadastro usando e-mail e senha.
- Validar e-mail, confirmacao de senha e forca minima da senha.
- Apos o cadastro, o usuario deve receber o status `Pendente`.
- Um usuario pendente nao pode acessar o playbook.
- Exibir mensagem informando que o cadastro aguarda aprovacao administrativa.
- Prever tambem os estados `Aprovado`, `Recusado` e `Suspenso`.
- Mostrar mensagens claras para credenciais invalidas, cadastro pendente, recusado ou suspenso.
- Incluir recuperacao de senha.

### 3. Administrador inicial

- Criar de forma segura o administrador inicial:
  - E-mail: `posvendas@alliage-global.com`
  - Senha inicial: `<PLAYBOOK_ADMIN_INITIAL_PASSWORD>` (definir somente em `.env` local nao versionado)
- Nao gravar essa senha em HTML, JavaScript publico, SQL versionado ou `config/supabase.js`.
- Criar um processo seguro e idempotente de bootstrap usando variaveis de ambiente, Supabase Admin API ou instrucoes equivalentes.
- Incluir `.env.example` sem valores secretos.
- Solicitar troca da senha inicial no primeiro acesso.
- Nunca expor `service_role` no frontend.

### 4. Area administrativa

- Criar uma pagina `Administracao do Playbook`.
- Somente usuarios com `role=admin` podem acessar essa pagina.
- Usuarios comuns devem receber acesso negado e ser redirecionados.
- A area deve listar usuarios com e-mail, data de cadastro, status e data da ultima alteracao.
- Permitir pesquisar e filtrar por status.
- Permitir Aprovar, Recusar, Suspender e Reativar usuarios.
- Pedir confirmacao antes de acoes sensiveis.
- O administrador nao pode remover ou suspender a propria conta.
- Registrar quem realizou cada aprovacao ou recusa e quando.
- Incluir estados de carregamento, vazio, erro e confirmacao de sucesso.

### 5. Banco e autorizacao

- Criar migration do Supabase para uma tabela de perfis, com `user_id` relacionado a `auth.users`, `role`, `status`, timestamps, `approved_by` e `approved_at`.
- Use valores controlados para `role` e `status`.
- Ative RLS em todas as tabelas novas.
- Usuarios comuns so podem consultar o proprio perfil.
- Apenas administradores podem listar usuarios e alterar status.
- O usuario nunca pode promover a propria conta, mudar `role` ou aprovar a si mesmo.
- Nao use `user_metadata` para autorizacao. Utilize `app_metadata` ou outra estrutura segura controlada exclusivamente pelo servidor.
- Operacoes administrativas sensiveis devem ser validadas no servidor ou Edge Function.
- Adicione policies, funcoes e triggers minimos e seguros, sem expor `SECURITY DEFINER` indevidamente.
- Proteja tambem todos os dados privados ja consumidos pelo playbook; esconder links no frontend nao e autorizacao.

### 6. Protecao real do site

- Identifique como o site e hospedado.
- Alem do guard no JavaScript, implemente protecao no servidor, edge ou middleware da hospedagem quando tecnicamente disponivel.
- Se o site estiver em hospedagem puramente estatica, documente claramente que JavaScript sozinho nao impede a leitura direta dos arquivos HTML.
- Nesse caso, implemente a alternativa segura compativel com a hospedagem ou apresente a alteracao necessaria para garantir confidencialidade real.
- Nao declare a solucao segura se ela apenas esconder ou redirecionar conteudo no navegador.

### 7. Interface e comunicacao

- Criar telas coerentes com a identidade visual atual, responsivas e acessiveis.
- Usar o sistema i18n existente para portugues, ingles e espanhol.
- Na tela de login, exibir uma mensagem equivalente a:

> Esta e uma nova funcionalidade de seguranca do Playbook Global. Para proteger as informacoes do projeto, agora e necessario entrar com uma conta aprovada. Contamos com a compreensao de todos durante esta atualizacao.

- Nao exibir a senha administrativa na interface ou documentacao publica.

### 8. Organizacao

- Centralizar o cliente Supabase e o controle de sessao.
- Criar um guard reutilizavel para todas as paginas.
- Nao duplicar logica de autenticacao em dezenas de arquivos.
- Atualizar navegacao e rotas sem quebrar caminhos relativos das paginas em subpastas.
- Nao alterar funcionalidades nao relacionadas.
- Nunca commitar segredos.

## Validacao obrigatoria

- Testar visitante sem sessao, login invalido, cadastro, usuario pendente, aprovado, recusado, suspenso, administrador e logout.
- Testar acesso direto a paginas internas e a area administrativa.
- Testar refresh, sessao expirada, recuperacao de senha e redirecionamento pos-login.
- Testar desktop e mobile.
- Validar migrations, RLS e ausencia de `service_role` ou senha em arquivos publicos.
- Executar os testes e verificacoes disponiveis no projeto.
- Ao finalizar, informar arquivos criados ou alterados, migrations, configuracao necessaria no Supabase, variaveis de ambiente, procedimento seguro para criar o administrador e resultados dos testes.

## Observacao de seguranca

Trate `<PLAYBOOK_ADMIN_INITIAL_PASSWORD>` apenas como senha inicial temporaria e obrigue sua alteracao imediatamente apos o primeiro acesso.

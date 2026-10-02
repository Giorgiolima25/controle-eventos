# Sistema de gestão — instalação independente

Esta cópia inicia diretamente no sistema, sem senha de acesso, painel de senhas ou conexão ativa com banco de dados. As credenciais da instalação anterior foram removidas de `.env.local`.

## Executar

1. Instale Node.js e execute `npm install`.
2. Copie `.env.example` para `.env.local`, se o arquivo não existir.
3. Execute `npm run dev`.
4. Para gerar a versão de distribuição, execute `npm run build`.

Sem banco, as consultas exibem um cliente fictício (`Cliente Teste`) e um produto fictício (`Cadeira Plástica — Teste`, 10 unidades a R$ 5,00) definidos internamente em `services/supabase.ts`. As demais listas ficam vazias e as gravações retornam o erro `DATABASE_DISABLED`. Nenhuma consulta, gravação ou sessão de presença é enviada ao banco anterior. Os exemplos permanecem ao recarregar a página, mas preencher ou editar um formulário não conserva alterações nesse modo. O catálogo público mostra uma mensagem de indisponibilidade até configurar o banco.

## Instalar para um novo cliente

Crie um projeto Supabase exclusivo para esse cliente e prepare suas tabelas. Esta cópia contém scripts de alterações em `sql/`, mas não contém o esquema inicial completo do banco anterior: esses scripts sozinhos não criam todo o banco necessário. O arquivo `corrigir_estoque_balde_007.sql` é uma correção de dados da instalação anterior e não deve ser usado para iniciar um novo cliente.

Configure somente os valores do novo projeto em `.env.local`:

```env
VITE_DATABASE_ENABLED=true
VITE_SUPABASE_URL=https://SEU-NOVO-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=CHAVE_PUBLICA_DO_NOVO_PROJETO
```

Reinicie o servidor de desenvolvimento ou gere uma nova compilação após configurar as variáveis. Para uma hospedagem, configure as mesmas variáveis no ambiente de compilação. Sem `VITE_DATABASE_ENABLED=true`, a conexão permanece desativada mesmo se houver URL e chave.

A aplicação continua sem autenticação depois de conectar um novo banco. A chave `VITE_SUPABASE_ANON_KEY` é pública e fica visível no navegador. Não use senha de banco, chave secreta ou `service_role` em variáveis `VITE_*`. O controle de acesso do novo banco deve ser definido conforme o uso desejado antes de disponibilizar dados reais.

## Entregar a cópia

Compartilhe os fontes, imagens, `package.json`, `package-lock.json`, `.env.example` e a documentação. Não inclua `.git`, `.env.local`, `node_modules`, logs ou uma compilação antiga de `dist`. Os arquivos locais de ambiente estão ignorados no versionamento.

A marca Claudia Festas, imagens, contatos e links comerciais permanecem no projeto e podem ser personalizados para o próximo cliente. Nenhum dado do banco remoto foi apagado e nenhuma chave foi revogada na conta Supabase anterior.

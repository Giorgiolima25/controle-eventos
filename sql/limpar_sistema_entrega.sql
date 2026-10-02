-- LIMPEZA TOTAL DOS DADOS DO SISTEMA PARA ENTREGA.
-- Apaga TODOS os registros das nove tabelas abaixo, em todos os periodos.
-- Inclui clientes, produtos do estoque e historico financeiro.
-- Mantem estrutura, politicas RLS, permissoes e usuarios do Supabase Auth.
-- O administrador atual e sua senha continuam funcionando.
-- Exporte os dados antes de executar se precisar guarda-los.
-- Execute o arquivo INTEIRO no SQL Editor do Supabase.

begin;

-- Sem CASCADE: se houver dependencias adicionais nao previstas,
-- a operacao falha em vez de limpar outras tabelas implicitamente.
truncate table
  public.orcamento_itens,
  public.orcamentos,
  public.movimentacao_caixa,
  public.reservas_futuras,
  public.reservas,
  public.pedidos_online,
  public.blacklist,
  public.estoque,
  public.cadastro
restart identity;

-- A view gestao_pedidos_online fica vazia automaticamente.
-- Os identificadores numericos voltam ao inicio das suas sequencias.
-- Produtos do estoque continuam recebendo novos UUIDs.

select 'cadastro' as tabela, count(*) as registros from public.cadastro
union all select 'blacklist', count(*) from public.blacklist
union all select 'estoque', count(*) from public.estoque
union all select 'reservas', count(*) from public.reservas
union all select 'reservas_futuras', count(*) from public.reservas_futuras
union all select 'pedidos_online', count(*) from public.pedidos_online
union all select 'orcamentos', count(*) from public.orcamentos
union all select 'orcamento_itens', count(*) from public.orcamento_itens
union all select 'movimentacao_caixa', count(*) from public.movimentacao_caixa
union all select 'gestao_pedidos_online', count(*) from public.gestao_pedidos_online;

commit;

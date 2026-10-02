-- Execute no SQL Editor do Supabase.
-- Zera os valores de TODAS as movimentacoes, em todos os periodos.
-- Preserva registros, descricoes, datas e vinculos com os clientes.
-- Novos lancamentos feitos pelo aplicativo continuam com seus valores normais.
begin;

update public.movimentacao_caixa
set valor = 0
where valor <> 0;

-- Confira os totais apos a alteracao.
select
  coalesce(sum(valor) filter (where tipo = 'Receita'), 0) as entradas,
  coalesce(sum(valor) filter (where tipo = 'Despesa'), 0) as saidas,
  coalesce(sum(case when tipo = 'Receita' then valor
                    when tipo = 'Despesa' then -valor else 0 end), 0) as saldo
from public.movimentacao_caixa;

commit;

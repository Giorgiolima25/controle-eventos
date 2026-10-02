-- Execute no SQL Editor depois de criar_banco_completo.sql.
-- Primeiro crie giorgiolima355@gmail.com em Authentication > Users > Add user.
-- Defina a senha no painel e confirme o e-mail da conta.
begin;

do $$
begin
  if not exists (select 1 from auth.users where lower(email) = 'giorgiolima355@gmail.com') then
    raise exception 'Crie primeiro giorgiolima355@gmail.com em Authentication > Users > Add user.';
  end if;
end;
$$;

grant usage on schema public to authenticated;

do $$
declare
  tabela text;
begin
  foreach tabela in array array[
    'cadastro', 'blacklist', 'estoque', 'reservas', 'reservas_futuras',
    'movimentacao_caixa', 'orcamentos', 'orcamento_itens', 'pedidos_online'
  ] loop
    execute format('alter table public.%I enable row level security', tabela);
    execute format('grant select, insert, update, delete on public.%I to authenticated', tabela);
    execute format('drop policy if exists acesso_administrador on public.%I', tabela);
    execute format(
      'create policy acesso_administrador on public.%I for all to authenticated
       using ((select auth.jwt() -> ''app_metadata'' ->> ''controle_eventos_admin'') = ''true'')
       with check ((select auth.jwt() -> ''app_metadata'' ->> ''controle_eventos_admin'') = ''true'')',
      tabela
    );
  end loop;
end;
$$;

grant usage, select on sequence public.cadastro_id_seq,
  public.blacklist_id_seq, public.reservas_id_seq,
  public.reservas_futuras_id_seq, public.movimentacao_caixa_id_seq,
  public.orcamentos_id_seq, public.orcamento_itens_id_seq,
  public.pedidos_online_id_seq to authenticated;

alter view public.gestao_pedidos_online set (security_invoker = true);
grant select on public.gestao_pedidos_online to authenticated;

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"controle_eventos_admin": true}'::jsonb
where lower(email) = 'giorgiolima355@gmail.com';

notify pgrst, 'reload schema';
commit;

-- Saia e entre novamente no aplicativo depois de promover a conta.
-- Nao use user_metadata: o usuario pode alterar esses dados.
-- O catalogo publico continua sem acesso a dados privados.

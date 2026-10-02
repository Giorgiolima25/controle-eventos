import { createClient } from '@supabase/supabase-js';

// A conexão exige ativação explícita para cada instalação de cliente.
const enabled = import.meta.env.VITE_DATABASE_ENABLED === 'true';
const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
export const isDatabaseConnected = Boolean(enabled && url && key);

// Dados fictícios internos para visualizar as telas sem conectar um banco.
const demoData: Record<string, Record<string, any>[]> = {
  cadastro: [{
    id: 1,
    'id-client': '1',
    cliente: 'Cliente Teste',
    telefone: '',
    'identificação': '',
    endereco: 'Rua de Teste',
    numero: '100',
    complemento: '',
    bairro: 'Centro',
    municipio: 'Biguaçu',
    cep: '',
    lista_negra: false,
    motivo: null,
  }],
  estoque: [{
    id: '00000000-0000-4000-8000-000000000001',
    codigo_interno: '001',
    item: 'Cadeira Plástica — Teste',
    disponivel: 10,
    reservado: 0,
    alugado: 0,
    preco: 5,
  }],
};

/** Sem banco: exemplos internos somente para leitura, sem requisições de rede. */
export function createDisconnectedClient(): ReturnType<typeof createClient> {
  return {
    from(table: string) {
      let writing = false;
      let single = false;
      let rows = (demoData[table] || []).map(row => ({ ...row }));
      const query: any = {};
      for (const method of ['select', 'or']) {
        query[method] = () => query;
      }
      const filters: Record<string, (actual: any, expected: any) => boolean> = {
        eq: (actual, expected) => actual === expected,
        neq: (actual, expected) => actual !== expected,
        in: (actual, expected) => expected.includes(actual),
        gte: (actual, expected) => actual >= expected,
        lte: (actual, expected) => actual <= expected,
        gt: (actual, expected) => actual > expected,
        lt: (actual, expected) => actual < expected,
        ilike: (actual, expected) => String(actual ?? '').toLocaleLowerCase('pt-BR')
          .includes(String(expected).replace(/%/g, '').toLocaleLowerCase('pt-BR')),
      };
      for (const [method, matches] of Object.entries(filters)) {
        query[method] = (column: string, value: any) => {
          rows = rows.filter(row => matches(row[column], value));
          return query;
        };
      }
      query.order = (column: string, options?: { ascending?: boolean }) => {
        rows.sort((a, b) => String(a[column] ?? '').localeCompare(String(b[column] ?? ''), 'pt-BR', { numeric: true })
          * (options?.ascending === false ? -1 : 1));
        return query;
      };
      query.limit = (count: number) => { rows = rows.slice(0, count); return query; };
      query.range = (start: number, end: number) => { rows = rows.slice(start, end + 1); return query; };
      for (const method of ['insert', 'update', 'delete', 'upsert']) {
        query[method] = () => { writing = true; return query; };
      }
      query.single = query.maybeSingle = () => { single = true; return query; };
      query.then = (resolve: any, reject: any) => Promise.resolve({
        data: writing ? null : single ? rows[0] ?? null : rows,
        error: writing ? {
          message: 'Sistema sem banco de dados. Configure o banco do novo cliente para salvar alterações.',
          code: 'DATABASE_DISABLED',
        } : null,
        count: writing ? 0 : rows.length,
      }).then(resolve, reject);
      return query;
    },
  } as unknown as ReturnType<typeof createClient>;
}

export const supabase = isDatabaseConnected ? createClient(url!, key!) : createDisconnectedClient();
export const db = supabase;

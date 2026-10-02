import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { db, isDatabaseConnected } from '../services/supabase';
import receptionImage from '../login-recepcao-hd.png';

const ADMIN_EMAIL = 'giorgiolima355@gmail.com';

const AdminLogoutContext = createContext<{
  signOut: () => Promise<void>;
  busy: boolean;
  error: string;
} | null>(null);

export function AdminLogoutButton() {
  const access = useContext(AdminLogoutContext);
  if (!access) return null;
  return <div className="absolute right-4 top-2 z-10">
    <button type="button" disabled={access.busy} onClick={access.signOut}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/25 disabled:opacity-50"
      title="Sair da conta" aria-label={access.busy ? 'Saindo da conta' : 'Sair da conta'}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 4H4v16h6M13 8l4 4-4 4M8 12h13M18 5h3v14h-3" />
      </svg>
    </button>
    {access.error && <p role="alert" className="absolute right-0 top-full mt-2 w-48 rounded bg-white p-3 text-xs text-red-700 shadow">{access.error}</p>}
  </div>;
}

export default function AdminAccess({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isDatabaseConnected) { setChecking(false); return; }
    let active = true;
    let authEventReceived = false;
    const { data: { subscription } } = db.auth.onAuthStateChange((_event, next) => {
      authEventReceived = true;
      if (active) { setSession(next); setChecking(false); }
    });
    db.auth.getSession().then(({ data, error: authError }) => {
      if (!active || authEventReceived) return;
      setSession(data.session);
      if (authError) setError('Não foi possível verificar sua sessão. Entre novamente.');
      setChecking(false);
    }).catch(() => {
      if (active) { setError('Não foi possível conectar. Tente novamente.'); setChecking(false); }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const signOut = async () => {
    setBusy(true);
    setError('');
    try {
      const { error: signOutError } = await db.auth.signOut();
      if (signOutError) setError('Não foi possível sair. Tente novamente.');
    } catch { setError('Não foi possível sair. Verifique sua conexão.'); }
    finally { setBusy(false); }
  };

  if (!isDatabaseConnected) return <>{children}</>;
  if (checking) return <p role="status" className="p-10 text-center">Verificando acesso...</p>;
  if (session?.user.app_metadata?.controle_eventos_admin === true) {
    return <AdminLogoutContext.Provider value={{ signOut, busy, error }}>
      {children}
    </AdminLogoutContext.Provider>;
  }
  if (session) return <main className="p-10 text-center">
    <p role="alert">Esta conta não tem acesso administrativo ao sistema.</p>
    <button disabled={busy} onClick={signOut} className="mt-4 rounded bg-[#b24a2b] px-4 py-2 text-white">Entrar com outra conta</button>
    {error && <p role="alert">{error}</p>}
  </main>;

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { error: signInError } = await db.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
      if (signInError) setError('Não foi possível entrar. Confira sua senha de acesso e tente novamente.');
      else setPassword('');
    } catch { setError('Não foi possível conectar. Verifique sua conexão.'); }
    finally { setBusy(false); }
  };

  return <main className="admin-login">
    <section className="admin-login-scene" aria-label="Boas-vindas">
      <img src={receptionImage} alt="Recepção de evento com mesas decoradas, flores e iluminação acolhedora" className="admin-login-photo" />
      <div className="admin-login-shade" />
      <div className="admin-login-brand"><span aria-hidden="true">✦</span> Controle de Eventos</div>
      <div className="admin-login-story">
        <p className="admin-login-eyebrow">CADA DETALHE FAZ A DIFERENÇA</p>
        <h1>Grandes momentos.<br /><em>Uma gestão à altura.</em></h1>
        <p>Mais organização para transformar cada evento<br className="admin-login-desktop-break" /> em uma experiência especial.</p>
      </div>
      <div className="admin-login-scene-footer">Clientes <span>·</span> Reservas <span>·</span> Estoque <span>·</span> Financeiro</div>
    </section>
    <section className="admin-login-access" aria-label="Acesso administrativo">
      <div className="admin-login-access-heading"><span>CONTROLE DE EVENTOS</span><span>ÁREA ADMINISTRATIVA</span></div>
      <div className="admin-login-form-wrap">
        <div className="admin-login-mark" aria-hidden="true">✦</div>
        <p className="admin-login-eyebrow">BEM-VINDO DE VOLTA</p>
        <h2>Sua gestão começa aqui.</h2>
        <p className="admin-login-description">Digite sua senha de acesso para acompanhar seus clientes, reservas e próximos eventos.</p>
        <form onSubmit={signIn} data-preserve-input-case aria-busy={busy}>
          <label htmlFor="admin-password">Senha de acesso</label>
          <div className="admin-login-password-wrap">
            <input id="admin-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Digite sua senha" required value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" className="admin-login-password-toggle" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Ocultar' : 'Mostrar'}</button>
          </div>
          {error && <p role="alert" className="admin-login-error">{error}</p>}
          <button disabled={busy} className="admin-login-submit"><span>{busy ? 'Entrando...' : 'Entrar no sistema'}</span><span aria-hidden="true">→</span></button>
        </form>
        <p className="admin-login-note">Acesso exclusivo para administradores autorizados.</p>
      </div>
      <footer className="admin-login-footer">Organização e cuidado em cada etapa do seu evento.</footer>
    </section>
  </main>;
}

export function showPlusServiceModal() {
  if (document.getElementById('plus-service-modal')) return;

  const previousFocus = document.activeElement as HTMLElement | null;
  const overlay = document.createElement('div');
  overlay.id = 'plus-service-modal';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);font-family:Arial,sans-serif;';
  overlay.innerHTML = `
    <div role="dialog" aria-modal="true" aria-labelledby="plus-service-title" aria-describedby="plus-service-description" style="box-sizing:border-box;width:100%;max-width:400px;background:white;border-radius:26px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.25);text-align:center;">
      <div style="padding:28px 24px 20px;background:#fffbeb;">
        <div aria-hidden="true" style="display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:16px;background:#18251b;color:#a3e635;font-size:28px;">ϟ</div>
        <h2 id="plus-service-title" style="margin:14px 0 0;color:#a16207;font-size:22px;font-weight:800;">Plano Plus</h2>
      </div>
      <div style="padding:26px 24px;">
        <p id="plus-service-description" style="margin:0;color:#1f2937;font-size:18px;font-weight:700;">Contrate o serviço Plus</p>
        <p style="margin:12px 0 24px;color:#64748b;font-size:14px;line-height:1.6;">Envie pedidos e orçamentos pelo WhatsApp com o Plano Plus.</p>
        <button type="button" style="width:100%;border:0;border-radius:14px;padding:15px;background:#b24a2b;color:white;font-size:13px;font-weight:800;letter-spacing:1px;cursor:pointer;">ENTENDIDO</button>
      </div>
    </div>`;

  const button = overlay.querySelector('button')!;
  const close = () => {
    overlay.remove();
    document.removeEventListener('keydown', handleKeyDown);
    previousFocus?.focus();
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      event.preventDefault();
      button.focus();
    }
  };
  button.addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener('keydown', handleKeyDown);
  document.body.appendChild(overlay);
  button.focus();
}

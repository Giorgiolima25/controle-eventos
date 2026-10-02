import { useEffect } from 'react';

/** Fecha uma janela aberta com Escape e remove o listener ao desmontar. */
export function useEscapeClose(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      close();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, close]);
}

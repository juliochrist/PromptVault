import { useEffect } from "react";

interface Shortcut {
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  handler: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      for (const s of shortcuts) {
        if (s.enabled === false) continue;

        const matchKey = e.key.toLowerCase() === s.key.toLowerCase();
        const matchMeta = s.meta ? e.metaKey : true;
        const matchCtrl = s.ctrl ? e.ctrlKey : true;
        const noModifiers = !s.meta && !s.ctrl
          ? !e.metaKey && !e.ctrlKey && !e.altKey
          : true;

        if (matchKey && matchMeta && matchCtrl && noModifiers) {
          e.preventDefault();
          s.handler();
          return;
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [shortcuts]);
}

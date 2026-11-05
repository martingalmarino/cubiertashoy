"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex size-11 items-center justify-center rounded-full bg-fondo text-tinta-700 transition-colors duration-200 hover:bg-borde focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
    >
      {isDark ? (
        <Sun className="size-4" aria-hidden strokeWidth={1.75} />
      ) : (
        <Moon className="size-4" aria-hidden strokeWidth={1.75} />
      )}
    </button>
  );
}

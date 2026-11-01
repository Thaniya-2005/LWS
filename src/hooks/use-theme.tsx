import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Appearance = "light" | "dark" | "auto";
export const validAppearance = (value: unknown): Appearance => value === "light" || value === "dark" ? value : "auto";
export const themeBootstrap = `(function(){try{var p=localStorage.getItem('lws_theme');var d=p==='dark'||(p!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})();`;
const Context = createContext<{ appearance: Appearance; setAppearance: (value: Appearance) => void; error: string } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [appearance, setValue] = useState<Appearance>("auto");
  const [error, setError] = useState("");
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    let preference: Appearance = "auto";
    const apply = () => {
      const dark = preference === "dark" || (preference === "auto" && media.matches);
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    };
    const read = () => {
      try { preference = validAppearance(localStorage.getItem("lws_theme")); } catch { preference = "auto"; }
      setValue(preference); apply();
    };
    const sync = (event: StorageEvent) => { if (event.key === "lws_theme" || event.key === null) read(); };
    read();
    media.addEventListener("change", apply);
    window.addEventListener("storage", sync);
    window.addEventListener("lws-theme-change", read);
    return () => { media.removeEventListener("change", apply); window.removeEventListener("storage", sync); window.removeEventListener("lws-theme-change", read); };
  }, []);
  const setAppearance = (value: Appearance) => {
    try {
      localStorage.setItem("lws_theme", value);
      window.dispatchEvent(new Event("lws-theme-change"));
      setError("");
    } catch { setError("Couldn't remember your appearance on this device. Check browser storage and try again."); }
  };
  return <Context.Provider value={{ appearance, setAppearance, error }}>{children}</Context.Provider>;
}

export function useTheme() {
  const value = useContext(Context);
  if (!value) throw new Error("ThemeProvider is required");
  return value;
}
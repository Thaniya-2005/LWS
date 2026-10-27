import { useEffect, useState } from "react";
import logo from "@/assets/lws-logo.png.asset.json";

export function Splash() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("lws-splash")) return;
    sessionStorage.setItem("lws-splash", "1");
    setShow(true);
    const t = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background" aria-hidden>
      <img src={logo.url} alt="" className="animate-logo-in h-40 w-auto" />
      <p className="mt-4 animate-fade-up text-sm text-muted-foreground [animation-delay:400ms]">Your next chapter starts here.</p>
    </div>
  );
}

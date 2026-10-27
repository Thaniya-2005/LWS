import type { ReactNode } from "react";
import hero from "@/assets/hero-learner.jpg";
import { Logo } from "./Logo";

export function AuthLayout({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-5 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-sm animate-fade-up">
          <Logo size="lg" />
          <h1 className="mt-8 text-3xl font-extrabold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-hero lg:block">
        <img src={hero} alt="" width={1280} height={720} className="h-full w-full object-cover object-right" />
      </div>
    </div>
  );
}

export function Field({ label, error, ...p }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string | undefined }) {
  return (
    <label className="block text-sm font-medium text-navy">
      {label}
      <input {...p} className={`mt-1.5 w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 ${error ? "border-destructive" : ""}`} />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

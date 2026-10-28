import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout, Field } from "@/components/lws/AuthLayout";
import { SocialAuth } from "@/components/lws/SocialAuth";
import { seo } from "@/components/lws/Section";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => seo("Sign in — LWS", "Sign in to continue your LWS career learning journey."),
  component: Login,
});

function Login() {
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, profile, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && user) navigate({ to: profile && !profile.onboarded ? "/onboarding" : "/", replace: true });
  }, [ready, user, profile, navigate]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("id")).trim();
    const password = String(f.get("pw"));
    const n: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) n["id"] = "Enter a valid email";
    if (password.length < 6) n["pw"] = "Password must be at least 6 characters";
    setErr(n);
    setMsg("");
    if (Object.keys(n).length) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setMsg(error.message.includes("confirm") ? "Please confirm your email first — check your inbox." : "Incorrect email or password.");
  };
  return (
    <AuthLayout title="Welcome Back" sub="Sign in to continue your career journey.">
      <SocialAuth />
      <form onSubmit={submit} className="mt-4 space-y-4" noValidate>
        <Field label="Email" name="id" type="email" autoComplete="email" error={err["id"]} />
        <div className="relative">
          <Field label="Password" name="pw" type={show ? "text" : "password"} autoComplete="current-password" error={err["pw"]} />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-9 p-1 text-muted-foreground" aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="text-right"><Link to="/forgot-password" className="text-sm font-semibold text-primary">Forgot password?</Link></div>
        <button disabled={busy} className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
        {msg && <p role="alert" className="rounded-lg bg-muted p-3 text-sm text-destructive">{msg}</p>}
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">New to LWS? <Link to="/signup" className="font-semibold text-primary">Create an account</Link></p>
      <p className="mt-2 text-center"><Link to="/" className="text-sm text-muted-foreground underline">Continue browsing</Link></p>
    </AuthLayout>
  );
}

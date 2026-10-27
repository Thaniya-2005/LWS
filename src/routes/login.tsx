import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout, Field } from "@/components/lws/AuthLayout";
import { seo } from "@/components/lws/Section";

export const Route = createFileRoute("/login")({
  head: () => seo("Sign in — LWS", "Sign in to continue your LWS career learning journey."),
  component: Login,
});

function Login() {
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const n: Record<string, string> = {};
    if (!String(f.get("id")).trim()) n["id"] = "Enter your email or phone";
    if (String(f.get("pw")).length < 6) n["pw"] = "Password must be at least 6 characters";
    setErr(n);
    if (!Object.keys(n).length) setMsg("Sign-in isn't connected yet — accounts are coming soon.");
  };
  return (
    <AuthLayout title="Welcome Back" sub="Sign in to continue your career journey.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email or phone" name="id" autoComplete="username" error={err["id"]} />
        <div className="relative">
          <Field label="Password" name="pw" type={show ? "text" : "password"} autoComplete="current-password" error={err["pw"]} />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-9 p-1 text-muted-foreground" aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="text-right"><Link to="/forgot-password" className="text-sm font-semibold text-primary">Forgot password?</Link></div>
        <button className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lift">Sign in</button>
        {msg && <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">{msg}</p>}
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">New to LWS? <Link to="/signup" className="font-semibold text-primary">Create an account</Link></p>
      <p className="mt-2 text-center"><Link to="/" className="text-sm text-muted-foreground underline">Continue browsing</Link></p>
    </AuthLayout>
  );
}

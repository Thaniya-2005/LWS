import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout, Field } from "@/components/lws/AuthLayout";
import { seo } from "@/components/lws/Section";

export const Route = createFileRoute("/forgot-password")({
  head: () => seo("Reset password — LWS", "Reset your LWS account password."),
  component: Forgot,
});

function Forgot() {
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <AuthLayout title="Forgot password?" sub="Enter your email and we'll send you a reset link.">
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const v = String(new FormData(e.currentTarget).get("email"));
          if (!/^\S+@\S+\.\S+$/.test(v)) return setErr("Enter a valid email");
          setErr("");
          setMsg("Password reset isn't connected yet — coming soon.");
        }}
      >
        <Field label="Email" name="email" type="email" error={err} />
        <button className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">Send reset link</button>
        {msg && <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">{msg}</p>}
      </form>
      <p className="mt-6 text-center text-sm"><Link to="/login" className="font-semibold text-primary">Back to sign in</Link></p>
    </AuthLayout>
  );
}

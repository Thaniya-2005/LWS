import { UserAvatar } from "@/components/lws/UserAvatar";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, LogIn, UserRound } from "lucide-react";
import banner from "@/assets/profile-banner.jpg";
import { Page, seo } from "@/components/lws/Section";
import { accountLinks } from "@/components/lws/AppShell";
import { displayName, useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile")({
  head: () => seo("My Profile — LWS", "Manage your LWS learner profile."),
  component: Profile,
});

function Profile() {
  const { ready, user, profile, enrollments, refresh, error } = useAuth();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  if (!ready) return <Page><p role="status">Loading your profile…</p></Page>;
  return (
    <Page>
      <section className="reference-banner">
        <img src={banner} alt="" className="banner-art" />
        <div className="banner-copy flex flex-col items-start gap-4">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-card shadow-card">{user ? <UserAvatar name={displayName(profile, user)} avatarId={profile?.avatar_id} theme={profile?.avatar_theme} size={80} /> : <UserRound className="h-10 w-10 text-primary" />}</span>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold">{user ? displayName(profile, user) : "Welcome to LWS"}</h1>
          <p className="text-sm text-muted-foreground">{user ? user.email : "Sign in to see your profile, learning stats and saved courses."}</p>
        </div>
        {!user && <Button asChild><Link to="/login"><LogIn className="h-4 w-4" /> Sign in</Link></Button>}
        </div>
      </section>
      {error && <p role="alert" className="text-destructive">{error}</p>}
      {user && <>
        <section className="grid grid-cols-2 gap-4"><div><p className="text-3xl font-bold text-primary">{enrollments.length}</p><p className="text-sm text-muted-foreground">Enrolled courses</p></div><div><p className="text-3xl font-bold text-success">{enrollments.filter((e) => e.progress === 100).length}</p><p className="text-sm text-muted-foreground">Completed courses</p></div></section>
        <section><h2 className="mb-4 text-xl font-bold">Profile details</h2><form key={profile?.updated_at ?? user.id} className="max-w-xl space-y-4" onSubmit={async (e) => {
          e.preventDefault(); const f = new FormData(e.currentTarget); const fullName = String(f.get("name") ?? "").trim();
          if (!fullName) { setMessage("Enter your full name."); return; }
          setBusy(true); setMessage("");
          const result = await supabase.from("profiles").upsert({ id: user.id, full_name: fullName, phone: String(f.get("phone") ?? "").trim() || null, updated_at: new Date().toISOString() });
          if (result.error) setMessage("Couldn't save your profile. Please try again.");
          else { await refresh(); setMessage("Profile saved."); }
          setBusy(false);
        }}><label className="block text-sm font-medium">Full name<input name="name" defaultValue={profile?.full_name ?? ""} autoComplete="name" required className="mt-2 w-full rounded-lg border bg-card px-3 py-2" /></label><label className="block text-sm font-medium">Phone<input name="phone" defaultValue={profile?.phone ?? ""} autoComplete="tel" type="tel" className="mt-2 w-full rounded-lg border bg-card px-3 py-2" /></label><Button disabled={busy} type="submit">{busy ? "Saving…" : "Save profile"}</Button>{message && <p role="status" className="text-sm">{message}</p>}</form></section>
        <section><h2 className="mb-3 text-xl font-bold">Career goals</h2><p className="text-sm text-muted-foreground">{profile?.learning_goals.join(" · ") || "No goals selected yet"}</p><Button variant="outline" asChild className="mt-3"><Link to="/onboarding">Update learning preferences</Link></Button></section>
      </>}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Account & community</h2>
        <div className="divide-y rounded-lg border bg-card">
          {accountLinks.filter((l) => l.to !== "/profile").map((l) => (
            <Link key={l.to} to={l.to} className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-navy">
              <l.icon className="h-5 w-5 text-primary" /> <span className="flex-1">{l.label}</span>
              {l.soon && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">Soon</span>}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>
    </Page>
  );
}

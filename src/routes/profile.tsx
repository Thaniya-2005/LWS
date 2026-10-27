import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, LogIn, UserRound } from "lucide-react";
import { Page, seo } from "@/components/lws/Section";
import { accountLinks } from "@/components/lws/AppShell";

export const Route = createFileRoute("/profile")({
  head: () => seo("My Profile — LWS", "Manage your LWS learner profile."),
  component: Profile,
});

function Profile() {
  return (
    <Page>
      <section className="flex flex-col items-center gap-4 rounded-2xl bg-hero p-6 text-center sm:flex-row sm:text-left">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-card shadow-card"><UserRound className="h-10 w-10 text-primary" /></span>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold">Welcome to LWS</h1>
          <p className="text-sm text-muted-foreground">Sign in to see your profile, learning stats and saved courses.</p>
        </div>
        <Link to="/login" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"><LogIn className="h-4 w-4" /> Sign in</Link>
      </section>
      <section className="md:hidden">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">More</h2>
        <div className="divide-y rounded-2xl border bg-card">
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

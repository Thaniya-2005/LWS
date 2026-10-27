import { createFileRoute } from "@tanstack/react-router";
import { Bell, Lock, Globe } from "lucide-react";
import { Page, PageTitle, seo } from "@/components/lws/Section";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => seo("Settings — LWS", "Manage your LWS account, notifications and security."),
  component: Settings,
});

function Settings() {
  return (
    <Page>
      <PageTitle eyebrow="Settings" title="Customize your" accent="LWS experience" sub="Manage your account, notifications and security." />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="flex items-center gap-2 font-bold"><Bell className="h-5 w-5 text-primary" /> Notifications</h2>
          {["Course updates", "Counselling reminders", "Career opportunities"].map((n) => (
            <label key={n} className="mt-4 flex items-center justify-between text-sm">{n}<Switch defaultChecked /></label>
          ))}
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="flex items-center gap-2 font-bold"><Lock className="h-5 w-5 text-primary" /> Privacy & security</h2>
          <p className="mt-3 text-sm text-muted-foreground">Password and account options will be available after you sign in.</p>
          <h2 className="mt-5 flex items-center gap-2 font-bold"><Globe className="h-5 w-5 text-primary" /> Language</h2>
          <p className="mt-2 text-sm text-muted-foreground">English</p>
        </div>
      </div>
    </Page>
  );
}

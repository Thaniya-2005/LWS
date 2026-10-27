import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Page, PageTitle, seo } from "@/components/lws/Section";

export const Route = createFileRoute("/subscriptions")({
  head: () => seo("Subscriptions & Plans — LWS", "Compare LWS plans: Career Pass, Free, individual courses and bundles."),
  component: Subs,
});

const plans = [
  { id: "pass", name: "LWS Career Pass", price: "Coming Soon", text: "All-access learning pass for your career journey.", cta: null, featured: true },
  { id: "free", name: "Free", price: "₹0", text: "Start with free courses like Career Kickstart.", cta: { to: "/courses", l: "Start learning free" } },
  { id: "single", name: "Individual Courses", price: "Per course", text: "Buy only the courses you need, one at a time.", cta: { to: "/courses", l: "Explore Courses" } },
  { id: "bundle", name: "Course Bundles", price: "Coming Soon", text: "Bundled learning paths will appear here when available.", cta: null },
];

function Subs() {
  const [sel, setSel] = useState("free");
  return (
    <Page>
      <PageTitle eyebrow="Subscriptions" title="Choose your" accent="plan" sub="Pick the way you want to learn with LWS." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {plans.map((p) => (
          <div
            key={p.id}
            onClick={() => setSel(p.id)}
            className={`flex cursor-pointer flex-col rounded-2xl border-2 bg-card p-5 transition ${sel === p.id ? "border-primary shadow-lift" : "border-border"} ${p.featured ? "bg-hero" : ""}`}
          >
            {p.featured && <span className="mb-2 w-fit rounded-full bg-navy px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">Recommended</span>}
            <h3 className="text-lg font-bold">{p.name}</h3>
            <p className="mt-1 text-2xl font-extrabold text-navy">{p.price}</p>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.text}</p>
            {p.cta ? (
              <Link to={p.cta.to} className="mt-4 rounded-xl bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">{p.cta.l}</Link>
            ) : (
              <button disabled className="mt-4 cursor-not-allowed rounded-xl bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground">Coming Soon</button>
            )}
          </div>
        ))}
      </div>
    </Page>
  );
}

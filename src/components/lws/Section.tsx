import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function Page({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-5 md:px-6 md:py-6">{children}</div>;
}

export function PageTitle({ eyebrow, title, accent, sub, children }: { eyebrow?: string; title: string; accent?: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl bg-hero p-5 md:p-8">
      {eyebrow && <p className="text-xs font-bold uppercase tracking-wider text-accent-foreground">{eyebrow}</p>}
      <h1 className="mt-1 text-2xl font-extrabold md:text-4xl">
        {title} {accent && <span className="text-primary">{accent}</span>}
      </h1>
      {sub && <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">{sub}</p>}
      {children}
    </div>
  );
}

export function SectionHead({ icon: Icon, title, sub, to, cta }: { icon?: typeof ArrowRight; title: string; sub?: string; to?: string; cta?: string }) {
  return (
    <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
      <div className="flex min-w-0 gap-3">
        {Icon && <Icon className="mt-1 h-6 w-6 shrink-0 text-primary" />}
        <div className="min-w-0">
          <h2 className="text-lg font-bold md:text-xl">{title}</h2>
          {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
        </div>
      </div>
      {to && (
        <Link to={to} className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary">
          {cta ?? "View All"} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, text, to, cta }: { icon: typeof ArrowRight; title: string; text: string; to: string; cta: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card p-8 text-center">
      <span className="rounded-2xl bg-primary-soft p-3"><Icon className="h-6 w-6 text-primary" /></span>
      <h3 className="mt-3 font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      <Link to={to} className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        {cta} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function seo(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}

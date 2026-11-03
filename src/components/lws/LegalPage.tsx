import type { LegalDoc } from "@/lib/legal";
import { Page, PageTitle } from "./Section";

export function LegalPage({ title, sub, doc }: { title: string; sub: string; doc: LegalDoc }) {
  return (
    <Page>
      <PageTitle eyebrow="Legal & Policies" title={title} sub={sub} />
      <article className="max-w-3xl space-y-6 rounded-lg border bg-card p-5 text-sm leading-relaxed md:p-8">
        {doc.intro.map((p) => <p key={p} className="text-muted-foreground">{p}</p>)}
        {doc.sections.map((s) => (
          <section key={s.h} className="space-y-2">
            <h2 className="text-lg font-bold">{s.h}</h2>
            {s.p.map((p) => <p key={p} className="break-words text-muted-foreground">{p}</p>)}
            {s.list.length > 0 && <ul className="list-disc space-y-1 pl-5 text-muted-foreground">{s.list.map((l) => <li key={l}>{l}</li>)}</ul>}
          </section>
        ))}
      </article>
    </Page>
  );
}

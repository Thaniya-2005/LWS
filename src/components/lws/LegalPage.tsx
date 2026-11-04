import type { LegalDoc } from "@/lib/legal";
import { Page, PageTitle } from "./Section";

export function LegalBody({ doc }: { doc: LegalDoc }) {
  return (
    <div className="space-y-6 text-sm leading-relaxed">
      {doc.intro.map((p) => <p key={p} className="text-muted-foreground">{p}</p>)}
      {doc.sections.map((s) => (
        <section key={s.h} className="space-y-2">
          <h2 className="text-base font-bold md:text-lg">{s.h}</h2>
          {s.p.map((p) => <p key={p} className="break-words text-muted-foreground">{p}</p>)}
          {s.list.length > 0 && <ul className="list-disc space-y-1 pl-5 text-muted-foreground">{s.list.map((l) => <li key={l}>{l}</li>)}</ul>}
        </section>
      ))}
    </div>
  );
}

export function LegalPage({ title, sub, doc }: { title: string; sub: string; doc: LegalDoc }) {
  return (
    <Page>
      <PageTitle eyebrow="Legal & Policies" title={title} sub={sub} />
      <article className="max-w-3xl rounded-lg border bg-card p-5 md:p-8">
        <LegalBody doc={doc} />
      </article>
    </Page>
  );
}

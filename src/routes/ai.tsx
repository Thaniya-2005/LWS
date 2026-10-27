import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, FileText, MessageCircleQuestion, Clock } from "lucide-react";
import avatar from "@/assets/shikkha-ai.jpg.asset.json";
import { Page, seo } from "@/components/lws/Section";

export const Route = createFileRoute("/ai")({
  head: () => seo("AI with Shikkha — Coming Soon | LWS", "Your always-available career assistant from LWS is coming soon."),
  component: AI,
});

const features = [
  { i: MessageCircleQuestion, t: "Career questions", d: "Ask about careers, skills and next steps." },
  { i: BookOpen, t: "Course recommendations", d: "Find the right LWS course for your goal." },
  { i: FileText, t: "Resume guidance", d: "Get tips to make your resume stand out." },
];

function AI() {
  return (
    <Page>
      <section className="grid items-center gap-6 rounded-2xl bg-hero p-6 md:grid-cols-[auto_minmax(0,1fr)] md:p-8">
        <img src={avatar.url} alt="Shikkha, the LWS AI assistant" className="h-28 w-28 rounded-full border-4 border-card object-cover shadow-lift md:h-36 md:w-36" />
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-navy px-3 py-1 text-xs font-semibold text-primary-foreground"><Clock className="h-3.5 w-3.5" /> Coming Soon</span>
          <h1 className="mt-3 text-2xl font-extrabold md:text-4xl">AI with <span className="text-primary">Shikkha</span></h1>
          <p className="mt-2 max-w-xl text-muted-foreground">Your always-available learning companion — instant answers and personalised guidance for your courses and career. We're working on it.</p>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((f) => (
          <div key={f.t} className="rounded-2xl border bg-card p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft"><f.i className="h-5 w-5 text-primary" /></span>
            <h3 className="mt-3 font-bold">{f.t}</h3>
            <p className="text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </div>
    </Page>
  );
}

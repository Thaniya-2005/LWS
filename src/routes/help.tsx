import { createFileRoute } from "@tanstack/react-router";
import { Page, PageTitle, seo } from "@/components/lws/Section";

export const Route = createFileRoute("/help")({
  head: () => seo("Help & Support — LWS", "Answers to common questions about LWS courses, payments and counselling."),
  component: Help,
});

const faqs = [
  ["How do I start a free course?", "Open any course marked Free and tap Start Course after signing in."],
  ["When does a paid course unlock?", "Paid courses unlock only after your payment is confirmed."],
  ["How do I book counselling with Shikka?", "Go to Career Counselling, choose a 30, 45 or 60-minute session and pick a time."],
  ["Where can I see my progress?", "My Learning shows every course you've started and how far you've come."],
];

function Help() {
  return (
    <Page>
      <PageTitle eyebrow="Help & Support" title="How can we" accent="help?" sub="Find quick answers below." />
      <div className="space-y-3">
        {faqs.map(([q, a]) => (
          <details key={q} className="group rounded-2xl border bg-card p-4">
            <summary className="cursor-pointer list-none font-semibold text-navy">{q}</summary>
            <p className="mt-2 text-sm text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </Page>
  );
}

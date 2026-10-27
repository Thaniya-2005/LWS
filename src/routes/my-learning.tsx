import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Page, PageTitle, EmptyState, seo } from "@/components/lws/Section";

export const Route = createFileRoute("/my-learning")({
  head: () => seo("My Learning — LWS", "Your enrolled LWS courses and learning progress."),
  component: MyLearning,
});

const tabs = ["All", "In Progress", "Completed"] as const;

function MyLearning() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  return (
    <Page>
      <PageTitle eyebrow="My Learning" title="Your Learning" accent="Journey" sub="Keep learning, keep growing — one step closer to your goals." />
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full border px-4 py-1.5 text-sm font-medium ${tab === t ? "border-primary bg-primary text-primary-foreground" : "bg-card text-navy"}`}>
            {t} (0)
          </button>
        ))}
      </div>
      <EmptyState icon={BookOpen} title="You haven't enrolled in any courses yet" text="Sign in and start a course — your progress will be saved here." to="/courses" cta="Explore Courses" />
    </Page>
  );
}

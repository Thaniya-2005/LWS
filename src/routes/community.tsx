import { createFileRoute } from "@tanstack/react-router";
import { BellRing, Briefcase, BookOpen, Users, LifeBuoy } from "lucide-react";
import banner from "@/assets/community-banner.jpg";
import { Button } from "@/components/ui/button";
import { Page, PageTitle, seo } from "@/components/lws/Section";

export const Route = createFileRoute("/community")({
  head: () => seo("LWS WhatsApp Community", "Connect, learn and grow with fellow LWS learners in our WhatsApp community."),
  component: Community,
});

const items = [
  { i: BellRing, t: "Course updates", d: "New courses and announcements first." },
  { i: Briefcase, t: "Career opportunities", d: "Job and internship leads shared by the community." },
  { i: BookOpen, t: "Learning resources", d: "Helpful notes, tips and materials." },
  { i: Users, t: "Peer discussions", d: "Learn together with other learners." },
  { i: LifeBuoy, t: "Guidance & support", d: "Get help when you're stuck." },
];

function Community() {
  return (
    <Page>
      <PageTitle image={banner} eyebrow="WhatsApp Community" title="Join the LWS" accent="WhatsApp Community" sub="Connect, learn, and grow together with learners like you.">
        <Button disabled className="mt-5 cursor-not-allowed rounded-lg bg-success/70 px-5 py-2.5 text-sm font-semibold text-primary-foreground" title="Invitation link not added yet">
          Join WhatsApp Community — link coming soon
        </Button>
      </PageTitle>
      <h2 className="text-lg font-bold">What you'll get</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {items.map((x) => (
          <div key={x.t} className="rounded-lg border bg-card p-5 text-center">
            <x.i className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-2 text-sm font-bold">{x.t}</h3>
            <p className="text-xs text-muted-foreground">{x.d}</p>
          </div>
        ))}
      </div>
    </Page>
  );
}

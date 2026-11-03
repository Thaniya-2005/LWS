import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/components/lws/Section";
import { LegalPage } from "@/components/lws/LegalPage";
import { privacy } from "@/lib/legal";

export const Route = createFileRoute("/privacy")({
  head: () => seo("Privacy Policy — LWS", "How LWS handles and protects your information."),
  component: () => <LegalPage title="Privacy Policy" sub="Please read how LWS handles and protects your information." doc={privacy} />,
});

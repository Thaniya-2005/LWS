import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/components/lws/Section";
import { LegalPage } from "@/components/lws/LegalPage";
import { terms } from "@/lib/legal";

export const Route = createFileRoute("/terms")({
  head: () => seo("Terms & Conditions — LWS", "Read the terms that apply to your use of the LWS learning platform."),
  component: () => <LegalPage title="Terms & Conditions" sub="Please read the terms that apply to your use of LWS." doc={terms} />,
});

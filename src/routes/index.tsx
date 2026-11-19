import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { About } from "@/components/spam/About";
import { Dashboard } from "@/components/spam/Dashboard";
import { Detector } from "@/components/spam/Detector";
import { Hero } from "@/components/spam/Hero";
import { HowItWorks } from "@/components/spam/HowItWorks";
import { SampleEmails } from "@/components/spam/SampleEmails";
import { SiteFooter } from "@/components/spam/SiteFooter";
import { SiteHeader } from "@/components/spam/SiteHeader";
import { useCheckHistory } from "@/components/spam/use-check-history";
import { useTheme } from "@/components/spam/use-theme";
import type { SampleEmail } from "@/lib/spam/samples";
import { getModelInfo } from "@/lib/spam/spam.functions";
import type { PredictionResult } from "@/lib/spam/types";

const modelInfoQuery = queryOptions({
  queryKey: ["model-info"],
  queryFn: () => getModelInfo(),
  staleTime: Infinity,
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Email Spam Detector — ML & NLP spam classifier" },
      {
        name: "description",
        content:
          "Paste any email and instantly find out if it's spam. Naive Bayes machine learning with NLP preprocessing, confidence scores and an analytics dashboard.",
      },
      { property: "og:title", content: "Email Spam Detector — ML & NLP spam classifier" },
      {
        property: "og:description",
        content: "Classify emails as spam or legitimate with Naive Bayes, NLP and live analytics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(modelInfoQuery),
  component: Index,
});

function Index() {
  const { data: metrics } = useSuspenseQuery(modelInfoQuery);
  const { theme, toggle } = useTheme();
  const { history, add, reset } = useCheckHistory();
  const [text, setText] = useState("");

  function handleSample(sample: SampleEmail) {
    setText(`Subject: ${sample.subject}\n\n${sample.body}`);
    document.getElementById("detector")?.scrollIntoView({ behavior: "smooth" });
    toast.success(`“${sample.title}” loaded — press Check Email`);
  }

  function handleChecked(result: PredictionResult, email: string) {
    add({
      label: result.label,
      confidence: result.confidence,
      preview: email.replace(/\s+/g, " ").trim().slice(0, 80),
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader theme={theme} onToggleTheme={toggle} />
      <main>
        <Hero accuracy={metrics.accuracy} />
        <Detector text={text} onTextChange={setText} onChecked={handleChecked} />
        <SampleEmails onUse={handleSample} />
        <Dashboard history={history} metrics={metrics} theme={theme} onReset={reset} />
        <HowItWorks />
        <About />
      </main>
      <SiteFooter />
    </div>
  );
}

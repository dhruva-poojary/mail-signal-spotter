import { ArrowRight, Brain, Filter, ScanText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  { icon: ScanText, title: "Paste", text: "Drop in any email text" },
  { icon: Filter, title: "Clean", text: "Tokenise, remove stop words, stem" },
  { icon: Brain, title: "Predict", text: "Naive Bayes scores spam vs. safe" },
];

export function Hero({ accuracy }: { accuracy: number }) {
  return (
    <section id="top" className="relative overflow-hidden bg-hero">
      <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-highlight" />
            Machine Learning · NLP · {(accuracy * 100).toFixed(1)}% test accuracy
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
            Catch spam emails <span className="text-gradient-primary">before they catch you.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Spam detection reads the words inside an email, cleans them with natural language
            processing, and lets a trained Naive Bayes model estimate how likely the message is
            to be spam — in milliseconds.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <a href="#detector">
                Check an email <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outline" size="xl">
              <a href="#how-it-works">How it works</a>
            </Button>
          </div>
        </div>

        <div className="animate-fade-up [animation-delay:150ms]">
          <div className="card-elevated relative overflow-hidden p-6 animate-float">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Detection pipeline
              </span>
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-spam" />
                <span className="h-2.5 w-2.5 rounded-full bg-highlight" />
                <span className="h-2.5 w-2.5 rounded-full bg-safe" />
              </span>
            </div>
            <ol className="space-y-3">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">
                      {i + 1}. {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-spam-soft p-3 text-center">
                <p className="font-display text-lg font-bold text-spam">Spam 🚫</p>
              </div>
              <div className="rounded-xl bg-safe-soft p-3 text-center">
                <p className="font-display text-lg font-bold text-safe">Not Spam ✅</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

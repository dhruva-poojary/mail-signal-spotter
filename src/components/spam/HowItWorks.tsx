import { Calculator, FileText, Filter, Scissors, Sigma, SplitSquareHorizontal } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const STEPS = [
  { icon: FileText, title: "Input email", text: "The raw email text is sent to the server for analysis." },
  { icon: Scissors, title: "Tokenisation", text: "Text is lower-cased, links, numbers and amounts become tokens, and it is split into words." },
  { icon: Filter, title: "Stop-word removal", text: "Common words like “the”, “is” and “and” carry no meaning and are removed." },
  { icon: SplitSquareHorizontal, title: "Stemming", text: "The Porter stemmer reduces words to their root: “winning”, “winner” → “win”." },
  { icon: Calculator, title: "Naive Bayes", text: "Each word's probability of appearing in spam vs. normal email is combined using Bayes' theorem." },
  { icon: Sigma, title: "Result", text: "The class with the higher probability wins, and its probability becomes the confidence." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          eyebrow="How it works"
          title="From raw text to a decision"
          description="Spam emails reuse tell-tale words — “free”, “winner”, “claim”, “urgent”. The model learns how often each word appears in spam and in normal emails, then uses those frequencies to judge new emails."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card-elevated card-hover relative p-6">
              <span className="absolute right-5 top-5 font-mono text-3xl font-bold text-muted-foreground/25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="card-elevated mt-6 p-6 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Bayes' theorem used by the model</p>
          <p className="mt-3 font-mono text-base text-foreground sm:text-lg">
            P(Spam | words) ∝ P(Spam) × Π P(word | Spam)
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            with Laplace smoothing so unseen words never make a probability zero
          </p>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import type { PredictionResult } from "@/lib/spam/types";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "tokens", label: "1. Tokens" },
  { key: "filtered", label: "2. Stop words removed" },
  { key: "stems", label: "3. Stemmed" },
] as const;

export function ResultCard({ result }: { result: PredictionResult }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("stems");
  const isSpam = result.label === "spam";
  const pct = Math.min(result.confidence * 100, 99.9);
  const words = result.steps[tab];

  return (
    <div className="card-elevated animate-pop-in overflow-hidden" aria-live="polite">
      <div className={cn("p-6", isSpam ? "bg-spam-soft" : "bg-safe-soft")}>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Prediction</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h3 className={cn("text-4xl font-extrabold", isSpam ? "text-spam" : "text-safe")}>
            {isSpam ? "Spam 🚫" : "Not Spam ✅"}
          </h3>
          <div className="text-right">
            <p className={cn("font-display text-3xl font-bold", isSpam ? "text-spam" : "text-safe")}>
              {pct.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">confidence</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs font-medium text-muted-foreground">
            <span>Legitimate</span>
            <span>Spam probability {(result.spamProbability * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-safe/25">
            <div
              className="h-full rounded-full bg-spam transition-[width] duration-700 ease-out"
              style={{ width: `${result.spamProbability * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <WordList title="Spam signals" words={result.spamWords.map((w) => w.word)} tone="spam" />
          <WordList title="Legitimate signals" words={result.hamWords.map((w) => w.word)} tone="safe" />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">NLP preprocessing</p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  tab === t.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label} ({result.steps[t.key].length})
              </button>
            ))}
          </div>
          <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
            {words.slice(0, 60).map((w, i) => (
              <span key={`${w}-${i}`} className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-xs text-foreground">
                {w}
              </span>
            ))}
            {words.length > 60 && (
              <span className="px-1 py-0.5 text-xs text-muted-foreground">+{words.length - 60} more</span>
            )}
          </div>
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">
          Classified by Multinomial Naive Bayes in {result.elapsedMs} ms
        </p>
      </div>
    </div>
  );
}

function WordList({ title, words, tone }: { title: string; words: string[]; tone: "spam" | "safe" }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      {words.length ? (
        <div className="flex flex-wrap gap-1.5">
          {words.map((w) => (
            <span
              key={w}
              className={cn(
                "rounded-md px-2 py-0.5 font-mono text-xs font-medium",
                tone === "spam" ? "bg-spam-soft text-spam" : "bg-safe-soft text-safe",
              )}
            >
              {w}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">None found</p>
      )}
    </div>
  );
}

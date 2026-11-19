import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, Eraser, Loader2, ScanSearch } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { predictEmail } from "@/lib/spam/spam.functions";
import type { PredictionResult } from "@/lib/spam/types";
import { ResultCard } from "./ResultCard";
import { SectionHeading } from "./SectionHeading";

const MIN_LOADING_MS = 900; // keep the analysis animation visible during demos

export function Detector({
  text,
  onTextChange,
  onChecked,
}: {
  text: string;
  onTextChange: (value: string) => void;
  onChecked: (result: PredictionResult, text: string) => void;
}) {
  const predict = useServerFn(predictEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  async function handleCheck() {
    if (!text.trim()) {
      setError("Please paste or type the email content before checking.");
      textareaRef.current?.focus();
      return;
    }
    if (words < 2) {
      setError("That's too short to judge — please enter at least a couple of words.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const [res] = await Promise.all([
        predict({ data: { text } }),
        new Promise((r) => setTimeout(r, MIN_LOADING_MS)),
      ]);
      setResult(res);
      onChecked(res, text);
    } catch (err) {
      console.error(err);
      setError("Couldn't analyse this email right now. Please try again.");
      toast.error("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="detector" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <SectionHeading
        eyebrow="Spam detection"
        title="Check an email"
        description="Paste the subject and body of any email. The model will classify it and show how confident it is."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="card-elevated p-5 sm:p-6">
          <label htmlFor="email-text" className="mb-2 block text-sm font-semibold text-foreground">
            Email content
          </label>
          <div className="relative">
            <textarea
              id="email-text"
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                onTextChange(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleCheck();
              }}
              placeholder={"Subject: You've won a prize!\n\nDear user, click the link below to claim your reward…"}
              rows={12}
              aria-invalid={!!error}
              className="w-full resize-y rounded-xl border border-input bg-surface p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-4 focus:ring-ring/20 aria-[invalid=true]:border-destructive"
            />
            {loading && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl" aria-hidden>
                <div className="animate-scan h-[10%] w-full bg-gradient-to-b from-transparent via-primary/25 to-transparent" />
              </div>
            )}
          </div>

          {error && (
            <p role="alert" className="mt-3 flex items-center gap-2 text-sm font-medium text-destructive animate-fade-up">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              {words} words · {text.length} chars · Ctrl + Enter to check
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl"
                onClick={() => {
                  onTextChange("");
                  setResult(null);
                  setError(null);
                }}
                disabled={loading || !text}
              >
                <Eraser /> Clear
              </Button>
              <Button variant="hero" size="lg" className="rounded-xl" onClick={handleCheck} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <ScanSearch />}
                {loading ? "Analysing…" : "Check Email"}
              </Button>
            </div>
          </div>
        </div>

        <div className="min-h-[320px]">
          {loading ? (
            <LoadingCard />
          ) : result ? (
            <ResultCard result={result} />
          ) : (
            <EmptyResult />
          )}
        </div>
      </div>
    </section>
  );
}

function LoadingCard() {
  const steps = ["Tokenising text", "Removing stop words", "Stemming words", "Running Naive Bayes"];
  return (
    <div className="card-elevated flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="relative h-20 w-20">
        <span className="absolute inset-0 rounded-full border-4 border-muted" />
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        <ScanSearch className="absolute inset-0 m-auto h-8 w-8 text-primary" />
      </div>
      <div>
        <p className="font-display text-lg font-semibold text-foreground">Analysing email…</p>
        <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          {steps.map((s, i) => (
            <li key={s} className="animate-fade-up" style={{ animationDelay: `${i * 180}ms` }}>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function EmptyResult() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-[calc(var(--radius)+4px)] border-2 border-dashed border-border p-8 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <ScanSearch className="h-7 w-7" />
      </span>
      <p className="font-display text-lg font-semibold text-foreground">Your result will appear here</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Paste an email or pick one of the sample emails below, then press “Check Email”.
      </p>
    </div>
  );
}

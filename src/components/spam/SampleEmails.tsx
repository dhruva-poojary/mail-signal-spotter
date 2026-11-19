import { ArrowUpRight } from "lucide-react";
import { SAMPLE_EMAILS, type SampleEmail } from "@/lib/spam/samples";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

export function SampleEmails({ onUse }: { onUse: (sample: SampleEmail) => void }) {
  return (
    <section id="samples" className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          eyebrow="Try it out"
          title="Sample emails"
          description="Click any card to autofill the detector with a ready-made spam or legitimate email."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_EMAILS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => onUse(s)}
              className="card-elevated card-hover group animate-fade-up p-5 text-left"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    s.kind === "spam" ? "bg-spam-soft text-spam" : "bg-safe-soft text-safe",
                  )}
                >
                  {s.kind === "spam" ? "Spam example 🚫" : "Legitimate ✅"}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="font-display font-semibold text-foreground">{s.subject}</p>
              <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{s.from}</p>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{s.body}</p>
              <p className="mt-4 text-sm font-semibold text-primary">Use this email →</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

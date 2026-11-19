import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Activity, CheckCircle2, Mail, RotateCcw, ShieldAlert, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Button } from "@/components/ui/button";
import type { CheckRecord, ModelMetrics } from "@/lib/spam/types";
import { cn } from "@/lib/utils";
import { resolveToken } from "./chart-colors";
import { SectionHeading } from "./SectionHeading";
import type { Theme } from "./use-theme";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Palette {
  spam: string;
  spamSoft: string;
  safe: string;
  safeSoft: string;
  text: string;
  grid: string;
  card: string;
}

export function Dashboard({
  history,
  metrics,
  theme,
  onReset,
}: {
  history: CheckRecord[];
  metrics: ModelMetrics;
  theme: Theme;
  onReset: () => void;
}) {
  const [palette, setPalette] = useState<Palette | null>(null);

  useEffect(() => {
    setPalette({
      spam: resolveToken("--spam"),
      spamSoft: resolveToken("--spam", 0.75),
      safe: resolveToken("--safe"),
      safeSoft: resolveToken("--safe", 0.75),
      text: resolveToken("--muted-foreground"),
      grid: resolveToken("--border"),
      card: resolveToken("--card"),
    });
  }, [theme]);

  const total = history.length;
  const spam = history.filter((h) => h.label === "spam").length;
  const ham = total - spam;
  const avgConfidence = total ? history.reduce((s, h) => s + h.confidence, 0) / total : 0;
  const recent = useMemo(() => history.slice(0, 10).reverse(), [history]);

  const stats = [
    { label: "Emails checked", value: total, icon: Mail, tone: "primary" },
    { label: "Spam detected", value: spam, icon: ShieldAlert, tone: "spam" },
    { label: "Legitimate", value: ham, icon: CheckCircle2, tone: "safe" },
    {
      label: "Avg. confidence",
      value: total ? `${Math.min(avgConfidence * 100, 99.9).toFixed(1)}%` : "—",
      icon: Activity,
      tone: "highlight",
    },
  ] as const;

  const toneClass = {
    primary: "bg-accent text-accent-foreground",
    spam: "bg-spam-soft text-spam",
    safe: "bg-safe-soft text-safe",
    highlight: "bg-highlight/20 text-foreground",
  };

  return (
    <section id="dashboard" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <SectionHeading
        eyebrow="Analytics"
        title="Analytics dashboard"
        description="Live statistics of every email checked in this browser."
        action={
          <Button variant="outline" className="rounded-xl" onClick={onReset} disabled={!total}>
            <RotateCcw /> Reset stats
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-elevated card-hover p-5">
            <span className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-xl", toneClass[s.tone])}>
              <s.icon className="h-5 w-5" />
            </span>
            <p className="font-display text-3xl font-bold text-foreground">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="card-elevated p-6">
          <h3 className="font-display text-base font-semibold text-foreground">Spam vs. legitimate</h3>
          <div className="relative mt-4 flex h-64 items-center justify-center">
            {palette && total > 0 ? (
              <Doughnut
                data={{
                  labels: ["Spam", "Not spam"],
                  datasets: [
                    {
                      data: [spam, ham],
                      backgroundColor: [palette.spam, palette.safe],
                      borderColor: palette.card,
                      borderWidth: 4,
                      hoverOffset: 8,
                    },
                  ],
                }}
                options={{
                  cutout: "68%",
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom", labels: { color: palette.text, usePointStyle: true, padding: 16 } },
                  },
                }}
              />
            ) : (
              <EmptyChart />
            )}
          </div>
        </div>

        <div className="card-elevated p-6">
          <h3 className="font-display text-base font-semibold text-foreground">Confidence of last 10 checks</h3>
          <div className="mt-4 h-64">
            {palette && total > 0 ? (
              <Bar
                data={{
                  labels: recent.map((_, i) => `#${total - recent.length + i + 1}`),
                  datasets: [
                    {
                      label: "Confidence %",
                      data: recent.map((r) => +(Math.min(r.confidence * 100, 99.9)).toFixed(1)),
                      backgroundColor: recent.map((r) => (r.label === "spam" ? palette.spamSoft : palette.safeSoft)),
                      hoverBackgroundColor: recent.map((r) => (r.label === "spam" ? palette.spam : palette.safe)),
                      borderRadius: 8,
                      maxBarThickness: 36,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: { min: 0, max: 100, ticks: { color: palette.text, callback: (v) => `${v}%` }, grid: { color: palette.grid } },
                    x: { ticks: { color: palette.text }, grid: { display: false } },
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        title: (items) => {
                          const r = recent[items[0]?.dataIndex ?? -1];
                          return r?.label === "spam" ? "Spam 🚫" : "Not Spam ✅";
                        },
                        afterLabel: (item) => recent[item.dataIndex]?.preview ?? "",
                      },
                    },
                  },
                }}
              />
            ) : (
              <EmptyChart />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="card-elevated p-6">
          <h3 className="font-display text-base font-semibold text-foreground">Recent checks</h3>
          {history.length ? (
            <ul className="mt-4 divide-y divide-border">
              {history.slice(0, 6).map((h) => (
                <li key={h.id} className="flex items-center gap-3 py-3">
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      h.label === "spam" ? "bg-spam-soft text-spam" : "bg-safe-soft text-safe",
                    )}
                  >
                    {h.label === "spam" ? "Spam" : "Not spam"}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">{h.preview}</span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {Math.min(h.confidence * 100, 99.9).toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No emails checked yet.</p>
          )}
        </div>

        <div className="card-elevated p-6">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h3 className="font-display text-base font-semibold text-foreground">Model performance</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Measured on {metrics.testSize.toLocaleString()} held-out messages
          </p>
          <div className="mt-5 space-y-4">
            {(
              [
                ["Accuracy", metrics.accuracy],
                ["Precision", metrics.precision],
                ["Recall", metrics.recall],
                ["F1 score", metrics.f1],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono font-semibold text-foreground">{(value * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${value * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Trained on {(metrics.trainSize + metrics.testSize).toLocaleString()} labelled messages ·{" "}
            {metrics.vocabularySize.toLocaleString()} word stems
          </p>
        </div>
      </div>
    </section>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-surface text-center">
      <p className="text-sm font-medium text-foreground">No data yet</p>
      <p className="mt-1 text-xs text-muted-foreground">Check an email to see the chart.</p>
    </div>
  );
}

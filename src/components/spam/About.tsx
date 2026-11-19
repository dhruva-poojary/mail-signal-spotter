import { Brain, Code2, Languages, Server, Target } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const TECH = [
  {
    icon: Server,
    title: "Python Flask / Server API",
    text: "A lightweight server exposes a /predict endpoint that receives the email text and returns the label and confidence as JSON.",
  },
  {
    icon: Brain,
    title: "Machine Learning",
    text: "A Multinomial Naive Bayes classifier trained on the UCI SMS Spam Collection plus extra email samples, evaluated with an 80/20 train-test split.",
  },
  {
    icon: Languages,
    title: "Natural Language Processing",
    text: "Tokenisation, stop-word removal and Porter stemming turn messy text into clean features the model can count.",
  },
  {
    icon: Code2,
    title: "HTML · CSS · JavaScript",
    text: "A responsive card-based interface with dark/light mode, animations and Chart.js visualisations for the analytics dashboard.",
  },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <SectionHeading eyebrow="About the project" title="Technologies used" />
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="card-elevated bg-gradient-primary p-7 text-primary-foreground">
          <Target className="h-8 w-8" />
          <h3 className="mt-4 text-2xl font-bold">Project objective</h3>
          <p className="mt-3 leading-relaxed opacity-90">
            Spam wastes time, spreads scams and steals personal data. The goal of this project is
            to build an intelligent, easy-to-use web application that automatically classifies
            emails as spam or legitimate using machine learning and natural language processing —
            and explains <em>why</em> it reached that decision.
          </p>
          <ul className="mt-5 space-y-2 text-sm opacity-90">
            <li>• Classify emails in real time</li>
            <li>• Show prediction confidence and key words</li>
            <li>• Track results with an analytics dashboard</li>
          </ul>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {TECH.map((t) => (
            <div key={t.title} className="card-elevated card-hover p-6">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <t.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-base font-semibold text-foreground">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

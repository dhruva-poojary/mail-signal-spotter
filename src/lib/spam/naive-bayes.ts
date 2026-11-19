import { preprocess } from "./nlp";
import type { ModelMetrics, PredictionResult, WordWeight } from "./types";

/**
 * Multinomial Naive Bayes with Laplace (add-one) smoothing.
 *
 *   P(class | email) ∝ P(class) · Π P(word | class)
 *   P(word | class) = (count(word, class) + α) / (totalWords(class) + α·|V|)
 */
export interface NaiveBayesModel {
  alpha: number;
  spamDocs: number;
  hamDocs: number;
  spamWordTotal: number;
  hamWordTotal: number;
  /** word → [count in spam, count in ham] */
  vocab: Record<string, [number, number]>;
  metrics?: ModelMetrics;
}

export interface LabeledDoc {
  label: "spam" | "ham";
  text: string;
}

export function train(docs: LabeledDoc[], alpha = 1, minCount = 1): NaiveBayesModel {
  const vocab: Record<string, [number, number]> = {};
  let spamDocs = 0;
  let hamDocs = 0;
  for (const doc of docs) {
    const idx = doc.label === "spam" ? 0 : 1;
    if (idx === 0) spamDocs++;
    else hamDocs++;
    for (const stem of preprocess(doc.text).stems) {
      (vocab[stem] ??= [0, 0])[idx]++;
    }
  }
  if (minCount > 1) {
    for (const [w, [s, h]] of Object.entries(vocab)) if (s + h < minCount) delete vocab[w];
  }
  let spamWordTotal = 0;
  let hamWordTotal = 0;
  for (const [s, h] of Object.values(vocab)) {
    spamWordTotal += s;
    hamWordTotal += h;
  }
  return { alpha, spamDocs, hamDocs, spamWordTotal, hamWordTotal, vocab };
}

function wordLogProbs(model: NaiveBayesModel, word: string) {
  const v = Object.keys(model.vocab).length;
  const [s, h] = model.vocab[word] ?? [0, 0];
  return {
    spam: Math.log((s + model.alpha) / (model.spamWordTotal + model.alpha * v)),
    ham: Math.log((h + model.alpha) / (model.hamWordTotal + model.alpha * v)),
  };
}

export function predict(model: NaiveBayesModel, text: string): PredictionResult {
  const started = Date.now();
  const steps = preprocess(text);
  const total = model.spamDocs + model.hamDocs;
  let logSpam = Math.log(model.spamDocs / total);
  let logHam = Math.log(model.hamDocs / total);

  const weights = new Map<string, number>();
  for (const stem of steps.stems) {
    if (!model.vocab[stem]) continue; // unseen words carry no evidence
    const lp = wordLogProbs(model, stem);
    logSpam += lp.spam;
    logHam += lp.ham;
    weights.set(stem, lp.spam - lp.ham);
  }

  // Naive Bayes assumes words are independent, so raw posteriors are over-confident
  // (almost always 0% or 100%). We calibrate by scaling the log-odds by √(evidence words)
  // before the sigmoid, which keeps the decision identical but gives a readable confidence.
  const evidence = Math.max(1, weights.size);
  const logOdds = (logSpam - logHam) / Math.sqrt(evidence);
  const pSpam = 1 / (1 + Math.exp(-logOdds));
  const label = pSpam >= 0.5 ? "spam" : "ham";

  const sorted: WordWeight[] = [...weights.entries()].map(([word, weight]) => ({ word, weight }));
  const spamWords = sorted.filter((w) => w.weight > 0).sort((a, b) => b.weight - a.weight).slice(0, 6);
  const hamWords = sorted.filter((w) => w.weight < 0).sort((a, b) => a.weight - b.weight).slice(0, 6);

  return {
    label,
    confidence: label === "spam" ? pSpam : 1 - pSpam,
    spamProbability: pSpam,
    steps: { tokens: steps.tokens, filtered: steps.filtered, stems: steps.stems },
    spamWords,
    hamWords,
    elapsedMs: Date.now() - started,
  };
}

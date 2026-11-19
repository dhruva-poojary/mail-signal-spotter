/**
 * Trains the Naive Bayes spam model and writes src/lib/spam/model.json.
 * Run with:  bun scripts/train-model.ts
 *
 * Data: UCI SMS Spam Collection (5,574 labelled messages) + hand-written email examples.
 * 80% of the data trains the evaluation model, 20% is held out to measure accuracy;
 * the shipped model is then retrained on 100% of the data.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { predict, train, type LabeledDoc } from "../src/lib/spam/naive-bayes";

function load(file: string): LabeledDoc[] {
  return readFileSync(join(import.meta.dir, "data", file), "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("\t");
      return { label: label === "spam" ? "spam" : "ham", text: rest.join("\t") } as LabeledDoc;
    });
}

const docs = [...load("sms.tsv"), ...load("emails.tsv")];

// Deterministic shuffle so metrics are reproducible.
let seed = 42;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
for (let i = docs.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1));
  [docs[i], docs[j]] = [docs[j], docs[i]];
}

const split = Math.floor(docs.length * 0.8);
const trainSet = docs.slice(0, split);
const testSet = docs.slice(split);
const evalModel = train(trainSet);

let tp = 0, fp = 0, tn = 0, fn = 0;
for (const d of testSet) {
  const p = predict(evalModel, d.text).label;
  if (p === "spam" && d.label === "spam") tp++;
  else if (p === "spam") fp++;
  else if (d.label === "spam") fn++;
  else tn++;
}
const precision = tp / (tp + fp);
const recall = tp / (tp + fn);
const round = (n: number) => Math.round(n * 10000) / 10000;

const model = train(docs, 1, 2);
model.metrics = {
  accuracy: round((tp + tn) / testSet.length),
  precision: round(precision),
  recall: round(recall),
  f1: round((2 * precision * recall) / (precision + recall)),
  trainSize: trainSet.length,
  testSize: testSet.length,
  vocabularySize: Object.keys(model.vocab).length,
};

writeFileSync(join(import.meta.dir, "../src/lib/spam/model.json"), JSON.stringify(model));
console.log("Confusion matrix", { tp, fp, tn, fn });
console.log(model.metrics);

import { describe, expect, it } from "vitest";
import modelJson from "./model.json";
import { predict, type NaiveBayesModel } from "./naive-bayes";
import { preprocess } from "./nlp";
import { SAMPLE_EMAILS } from "./samples";

const model = modelJson as unknown as NaiveBayesModel;

describe("NLP preprocessing", () => {
  it("removes stop words and stems words to their root", () => {
    const r = preprocess("The winners are claiming their prizes");
    expect(r.filtered).toEqual(["winners", "claiming", "prizes"]);
    expect(r.stems).toEqual(["winner", "claim", "prize"]);
  });

  it("replaces links, money and numbers with placeholder tokens", () => {
    expect(preprocess("Win $500 at http://x.biz call 0800").stems).toEqual([
      "win",
      "moneytoken",
      "urltoken",
      "call",
      "numtoken",
    ]);
  });
});

describe("Naive Bayes spam model", () => {
  it.each(SAMPLE_EMAILS.map((s) => [s.title, s] as const))("classifies sample '%s' correctly", (_t, s) => {
    expect(predict(model, `Subject: ${s.subject}\n\n${s.body}`).label).toBe(s.kind);
  });

  it("reports confidence as the probability of the predicted label", () => {
    const r = predict(model, "Congratulations you won a free prize, claim now");
    expect(r.label).toBe("spam");
    expect(r.confidence).toBeCloseTo(r.spamProbability);
    expect(r.confidence).toBeGreaterThan(0.5);
  });

  it("scores above 95% accuracy on the held-out test set", () => {
    expect(model.metrics?.accuracy).toBeGreaterThan(0.95);
  });
});

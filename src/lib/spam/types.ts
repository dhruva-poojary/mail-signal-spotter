export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  trainSize: number;
  testSize: number;
  vocabularySize: number;
}

export interface WordWeight {
  word: string;
  weight: number;
}

export interface PredictionResult {
  label: "spam" | "ham";
  confidence: number; // 0..1, probability of the predicted label
  spamProbability: number; // 0..1
  steps: {
    tokens: string[];
    filtered: string[];
    stems: string[];
  };
  spamWords: WordWeight[];
  hamWords: WordWeight[];
  elapsedMs: number;
}

export interface CheckRecord {
  id: string;
  label: "spam" | "ham";
  confidence: number;
  preview: string;
  at: number;
}

import modelJson from "./model.json";
import { predict, type NaiveBayesModel } from "./naive-bayes";

const model = modelJson as unknown as NaiveBayesModel;

export function classifyEmail(text: string) {
  return predict(model, text);
}

export function getModelMetrics() {
  return model.metrics!;
}

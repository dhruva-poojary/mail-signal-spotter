import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Please paste some email content first.")
    .max(20000, "Email is too long (max 20,000 characters)."),
});

/** POST /predict – runs the trained Naive Bayes model on the server. */
export const predictEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const { classifyEmail } = await import("./classifier.server");
    return classifyEmail(data.text);
  });

/** GET model evaluation metrics (accuracy, precision, recall, F1). */
export const getModelInfo = createServerFn({ method: "GET" }).handler(async () => {
  const { getModelMetrics } = await import("./classifier.server");
  return getModelMetrics();
});

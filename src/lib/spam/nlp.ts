import { stemmer } from "stemmer";

/**
 * NLP preprocessing pipeline shared by training and prediction.
 * Steps: normalise → tokenise → remove stop words → Porter stemming.
 */

// Standard English stop-word list (same words as NLTK's "english" corpus).
export const STOP_WORDS = new Set(
  `i me my myself we our ours ourselves you your yours yourself yourselves he him his himself she her hers herself it its itself they them their theirs themselves what which who whom this that these those am is are was were be been being have has had having do does did doing a an the and but if or because as until while of at by for with about against between into through during before after above below to from up down in out on off over under again further then once here there when where why how all any both each few more most other some such no nor not only own same so than too very s t can will just don should now d ll m o re ve y ain aren couldn didn doesn hadn hasn haven isn ma mightn mustn needn shan shouldn wasn weren won wouldn u ur im`.split(
    /\s+/,
  ),
);

export interface PreprocessResult {
  /** Text after lower-casing and replacing URLs, emails, money and numbers with placeholder tokens. */
  normalized: string;
  /** Raw word tokens. */
  tokens: string[];
  /** Tokens left after removing stop words and 1-letter tokens. */
  filtered: string[];
  /** Final stemmed features fed to the model. */
  stems: string[];
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+|www\.\S+/g, " urltoken ")
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, " emailtoken ")
    .replace(/[£$€₹]\s?\d[\d,.]*/g, " moneytoken ")
    .replace(/\d+/g, " numtoken ");
}

export function tokenize(normalized: string): string[] {
  return normalized.match(/[a-z]+/g) ?? [];
}

export function preprocess(text: string): PreprocessResult {
  const normalized = normalize(text);
  const tokens = tokenize(normalized);
  const filtered = tokens.filter((t) => t.length > 1 && !STOP_WORDS.has(t));
  const stems = filtered.map((t) => (t.endsWith("token") ? t : stemmer(t)));
  return { normalized, tokens, filtered, stems };
}

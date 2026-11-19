import { useCallback, useEffect, useState } from "react";
import type { CheckRecord } from "@/lib/spam/types";

const KEY = "spam-detector-history-v1";

/** Stores every email check in this browser so the dashboard survives page reloads. */
export function useCheckHistory() {
  const [history, setHistory] = useState<CheckRecord[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const persist = (next: CheckRecord[]) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const add = useCallback((record: Omit<CheckRecord, "id" | "at">) => {
    setHistory((prev) => {
      const next = [{ ...record, id: crypto.randomUUID(), at: Date.now() }, ...prev].slice(0, 500);
      persist(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setHistory([]);
    persist([]);
  }, []);

  return { history, add, reset };
}

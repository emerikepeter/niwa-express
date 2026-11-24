"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchApplications } from "@/api/applications";
import type { ApplicationsApiResponse } from "@/types/application";

export function useApplications(simulateError: boolean, simulateEmpty: boolean) {
  // Keep request state together so the page can render loading, error, or data states.
  const [result, setResult] = useState<ApplicationsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Incrementing attempt reruns the effect without needing to recreate its dependencies.
  const retry = useCallback(() => setAttempt((value: number) => value + 1), []);

  useEffect(() => {
    // Each fetch gets its own controller. Cleanup aborts it when the demo mode changes
    // or the component unmounts, preventing stale responses from updating the screen.
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchApplications({ signal: controller.signal, simulateError, simulateEmpty })
      .then((response) => setResult(response))
      .catch((reason: unknown) => {
        // Cancellation is expected during cleanup, not an error to show to the user.
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "An unexpected error occurred.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt, simulateError, simulateEmpty]);

  // The caller owns presentation; this hook only exposes request state and retry.
  return { result, loading, error, retry };
}

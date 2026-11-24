import type { ApplicationsApiResponse } from "@/types/application";

// Local fixture for the dashboard. The summary counts represent aggregate totals,
// so they intentionally do not need to equal the number of sample table rows.
const mockResponse: ApplicationsApiResponse = {
  summary: { approved: 150, rejected: 35 },
  data: [
    { reference: "APP-2024-0001", applicantName: "Jane Smith", applicationType: "New License", submissionDate: "2024-01-15", status: "Approved" },
    { reference: "APP-2024-0002", applicantName: "John Doe", applicationType: "Renewal", submissionDate: "2024-02-03", status: "Rejected" },
    { reference: "APP-2024-0003", applicantName: "Alice Johnson", applicationType: "Variation", submissionDate: "2024-02-20", status: "Approved" },
    { reference: "APP-2024-0004", applicantName: "Robert Brown", applicationType: "New License", submissionDate: "2024-03-05", status: "Pending" },
    { reference: "APP-2024-0005", applicantName: "Maria Garcia", applicationType: "Renewal", submissionDate: "2024-03-18", status: "Approved" },
    { reference: "APP-2024-0006", applicantName: "David Wilson", applicationType: "Variation", submissionDate: "2024-04-02", status: "Pending" },
    { reference: "APP-2024-0007", applicantName: "Fatima Bello", applicationType: "New License", submissionDate: "2024-04-12", status: "Rejected" },
    { reference: "APP-2024-0008", applicantName: "Samuel Okafor", applicationType: "Renewal", submissionDate: "2024-04-26", status: "Approved" },
  ],
};

export interface FetchOptions {
  /** Pass through the caller's controller so obsolete requests can be cancelled. */
  signal: AbortSignal;
  /** Demo switches used by the dashboard; remove them when connecting production data. */
  simulateError?: boolean;
  simulateEmpty?: boolean;
}

export async function mockedFetchApplications({ signal, simulateError = false, simulateEmpty = false }: FetchOptions): Promise<ApplicationsApiResponse> {
  // Delay makes the loading state observable while keeping the demo self-contained.
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, 900);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("The request was aborted.", "AbortError"));
    }, { once: true });
  });
  if (signal.aborted) throw new DOMException("The request was aborted.", "AbortError");
  // Simulate transport/server failure after latency, just as a real request might.
  if (simulateError) throw new Error("The applications service is temporarily unavailable.");
  // Preserve summary stats to demonstrate an empty collection independently of totals.
  return { ...mockResponse, data: simulateEmpty ? [] : mockResponse.data };
}

/**
 * Stable data-layer entry point consumed by the hook.
 * Swap this implementation for fetch('/api/applications', { signal: options.signal })
 * when a backend exists; validate response.ok and the returned payload there.
 */
export async function fetchApplications(options: FetchOptions): Promise<ApplicationsApiResponse> {
  return mockedFetchApplications(options);
}

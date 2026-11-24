# Applications Dashboard

A responsive Next.js App Router dashboard built with React, TypeScript, Tailwind CSS, and Lucide icons. The data is mocked locally; no backend is required.

## Run locally

```bash
npm install
npm run dev
```

## Architecture and data flow

- `src/types/application.ts` defines `ApplicationRecord`, the allowed status values, and `ApplicationsApiResponse` (`data` plus approved/rejected summary counts).
- `src/api/applications.ts` owns the mock records and `fetchApplications()`. The mock waits 900 ms, respects an `AbortSignal`, and can return an error or an empty data list.
- `src/hooks/useApplications.ts` manages loading, result, and error state. It cancels obsolete requests and exposes retry.
- `src/components/ApplicationsDashboard.tsx` composes the stat cards, search and status controls, responsive horizontally scrollable table, status badges, and loading/error/empty states.
- `src/app/page.tsx` mounts the dashboard; `src/app/layout.tsx` provides document metadata and global styles.

### Component guide

`ApplicationsDashboard` is the page-level client component. It owns the search, status, and demo controls, calls `useApplications`, combines the two filters, and chooses which content state to render. Its small child components each have one display responsibility:

- `StatCard` displays one aggregate count and its trend label.
- `StatusBadge` gives each supported status a consistent visual treatment and readable label.
- `ApplicationTable` renders the record columns; its narrow-screen wrapper scrolls horizontally instead of squeezing the data.
- `LoadingState`, `ErrorState`, and `EmptyState` render the request lifecycle. Error state receives a retry callback; empty state receives whether filters caused the empty result.

### State and request lifecycle

The dashboard keeps search and selected status in component state. These are client-side filters and do not make network calls. The hook owns the asynchronous request state (`result`, `loading`, and `error`). On initial mount, retry, or demo mode change, it creates an `AbortController` and calls `fetchApplications`. Cleanup aborts the previous request so a late result cannot replace newer data. Retry increments an attempt counter, which reruns the request effect. Cancellation is ignored as an expected lifecycle event; other failures become a message for `ErrorState`.

The empty UI distinguishes two cases: a successful response containing no records, and records that exist but do not match the active search/status filters. The summary counts are aggregate fixture values and remain 150 approved / 35 rejected regardless of the eight example rows or the empty-response demo.

Search matches application reference and applicant name. The status filter combines with search and updates immediately. The **Demo state** selector can demonstrate a normal response, a retryable service error, or an API response with no records. Filtered results show a separate no-match message.

## Connecting a real API

Replace the body of `fetchApplications()` in `src/api/applications.ts` with a request such as `fetch('/api/applications', { signal: options.signal })`. Check `response.ok`, parse the documented `ApplicationsApiResponse` shape, and throw a useful error for non-success responses. The hook and dashboard can then continue using the same data contract. Remove the demo toggles and mock module when they are no longer useful.

/** Skeleton rows reserve space and make the loading state clear during retrieval. */
export function LoadingState() {
  return (
    <div role="status" aria-label="Loading applications" className="space-y-3 p-5">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-lg bg-slate-100" />
      ))}
      <span className="sr-only">Loading applications...</span>
    </div>
  );
}

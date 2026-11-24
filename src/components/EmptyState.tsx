import { FileText } from "lucide-react";

/** Use different copy for an empty API response and for filters with no matches. */
export function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-slate-100 text-slate-500">
        <FileText className="size-5" />
      </span>
      <h3 className="mt-4 font-semibold text-slate-900">
        {filtered ? "No matching applications" : "No applications yet"}
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        {filtered
          ? "Try changing your search or status filter."
          : "Applications will appear here when they are available."}
      </p>
    </div>
  );
}

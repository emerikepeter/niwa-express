import type { ApplicationStatus } from "@/modules/applications/types/dtos/application";

const statusStyles: Record<ApplicationStatus, string> = {
  Approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-600/15",
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/15",
};

/** Status is communicated by its text as well as its color. */
export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}

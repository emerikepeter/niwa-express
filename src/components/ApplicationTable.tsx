import { ArrowUpRight } from "lucide-react";
import type { ApplicationRecord } from "@/modules/applications/types/dtos/application";
import { StatusBadge } from "@/components/StatusBadge";

/** Scrolls horizontally on narrow screens to preserve readable table columns. */
export function ApplicationTable({ records }: { records: ApplicationRecord[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left">
        <thead>
          <tr className="border-y border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <th className="px-6 py-3.5">Application reference</th>
            <th className="px-5 py-3.5">Applicant</th>
            <th className="px-5 py-3.5">Application type</th>
            <th className="px-5 py-3.5">Submission date</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-6 py-3.5"><span className="sr-only">Action</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.map((record) => (
            <tr key={record.reference} className="transition hover:bg-slate-50/70">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">
                {record.reference}
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                {record.applicantName}
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                {record.applicationType}
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                {new Intl.DateTimeFormat("en", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
                }).format(new Date(`${record.submissionDate}T00:00:00Z`))}
              </td>
              <td className="whitespace-nowrap px-5 py-4">
                <StatusBadge status={record.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  aria-label={`View ${record.reference}`}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <ArrowUpRight className="size-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

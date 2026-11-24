"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowDown, ArrowUpRight, Check, ChevronDown, ClipboardList, FileText, Filter, Search, X } from "lucide-react";
import { useApplications } from "@/hooks/useApplications";
import type { ApplicationRecord, ApplicationStatus } from "@/types/application";

const statusStyles: Record<ApplicationStatus, string> = {
  Approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-600/15",
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/15",
};

/** Status is communicated by its text as well as its color. */
function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}><span className="size-1.5 rounded-full bg-current" aria-hidden="true" />{status}</span>;
}

function StatCard({ title, value, change, icon: Icon, tone }: { title: string; value: number; change: string; icon: typeof Check; tone: "green" | "red" }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
    <div className="flex items-start justify-between"><p className="text-sm font-medium text-slate-500">{title}</p><span className={`grid size-9 place-items-center rounded-lg ${tone === "green" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}><Icon className="size-[18px]" aria-hidden="true" /></span></div>
    <div className="mt-4 flex items-end justify-between"><p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p><span className="flex items-center gap-1 text-xs font-medium text-emerald-700"><ArrowUpRight className="size-3.5" aria-hidden="true" />{change}</span></div>
    <p className="mt-1 text-xs text-slate-400">Compared with last month</p>
  </article>;
}

function LoadingState() {
  // Skeletons reserve table-like space and make the simulated latency visible.
  return <div role="status" aria-label="Loading applications" className="space-y-3 p-5">{Array.from({ length: 5 }, (_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}<span className="sr-only">Loading applications…</span></div>;
}

function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return <div className="flex flex-col items-center px-6 py-14 text-center"><span className="grid size-11 place-items-center rounded-full bg-rose-50 text-rose-600"><Activity className="size-5" /></span><h3 className="mt-4 font-semibold text-slate-900">Couldn’t load applications</h3><p className="mt-1 text-sm text-slate-500">{message}</p><button onClick={retry} className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">Try again</button></div>;
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return <div className="flex flex-col items-center px-6 py-14 text-center"><span className="grid size-11 place-items-center rounded-full bg-slate-100 text-slate-500"><FileText className="size-5" /></span><h3 className="mt-4 font-semibold text-slate-900">{filtered ? "No matching applications" : "No applications yet"}</h3><p className="mt-1 text-sm text-slate-500">{filtered ? "Try changing your search or status filter." : "Applications will appear here when they are available."}</p></div>;
}

function ApplicationTable({ records }: { records: ApplicationRecord[] }) {
  // min-w keeps columns readable on phones; the parent scroll container handles overflow.
  return <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-y border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400"><th className="px-6 py-3.5">Application reference</th><th className="px-5 py-3.5">Applicant</th><th className="px-5 py-3.5">Application type</th><th className="px-5 py-3.5">Submission date</th><th className="px-5 py-3.5">Status</th><th className="px-6 py-3.5"><span className="sr-only">Action</span></th></tr></thead><tbody className="divide-y divide-slate-100">{records.map((record) => <tr key={record.reference} className="transition hover:bg-slate-50/70"><td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">{record.reference}</td><td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{record.applicantName}</td><td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{record.applicationType}</td><td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">{new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${record.submissionDate}T00:00:00Z`))}</td><td className="whitespace-nowrap px-5 py-4"><StatusBadge status={record.status} /></td><td className="px-6 py-4 text-right"><button aria-label={`View ${record.reference}`} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><ArrowUpRight className="size-4" /></button></td></tr>)}</tbody></table></div>;
}

export default function ApplicationsDashboard() {
  // Search and status are local presentation state; neither triggers another API request.
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [demo, setDemo] = useState("Normal response");
  const simulateError = demo === "Simulate error";
  const simulateEmpty = demo === "Simulate empty response";
  const { result, loading, error, retry } = useApplications(simulateError, simulateEmpty);
  // Apply both filters in one pass so text and status filters always combine.
  const filtered = useMemo(() => (result?.data ?? []).filter((record) => {
    const query = search.trim().toLowerCase();
    return (!query || record.reference.toLowerCase().includes(query) || record.applicantName.toLowerCase().includes(query)) && (status === "All statuses" || record.status === status);
  }), [result, search, status]);
  const hasFilters = Boolean(search.trim()) || status !== "All statuses";

  return <main className="min-h-screen bg-[#f7f8fa] text-slate-900">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-5 sm:px-8"><a href="#" className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-white"><ClipboardList className="size-[18px]" /></span><span className="text-sm font-semibold tracking-tight">Civic<span className="text-indigo-600">Desk</span></span></a><nav aria-label="Main navigation" className="hidden items-center gap-7 sm:flex"><a href="#applications" className="text-sm font-medium text-indigo-700">Applications</a><a href="#applications" className="text-sm text-slate-500 hover:text-slate-900">Reports</a><a href="#applications" className="text-sm text-slate-500 hover:text-slate-900">Help center</a></nav><div className="flex items-center gap-3"><span className="hidden text-right sm:block"><span className="block text-xs font-medium text-slate-700">Operations team</span><span className="block text-[11px] text-slate-400">Administrator</span></span><span className="grid size-9 place-items-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">OT</span></div></div></header>
    <div className="mx-auto max-w-[1400px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400"><span>Workspace</span><span>/</span><span className="text-slate-600">Applications</span></div><h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">Applications overview</h1><p className="mt-1.5 text-sm text-slate-500">Track and manage submitted applications.</p></div><div className="flex items-center gap-2 text-xs text-slate-500"><span className="size-2 rounded-full bg-emerald-500" />Data last updated just now</div></div>
      {/* Keep the requested demo totals visible even while a request is loading or fails. */}
      <section aria-label="Application summary" className="mb-8 grid gap-4 sm:grid-cols-2"><StatCard title="Approved applications" value={result?.summary.approved ?? 150} change="12.8%" icon={Check} tone="green" /><StatCard title="Rejected applications" value={result?.summary.rejected ?? 35} change="4.3%" icon={X} tone="red" /></section>
      <section id="applications" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40"><div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6"><div><h2 className="text-base font-semibold">Application records</h2><p className="mt-1 text-xs text-slate-500">Review and search recent submissions</p></div><label className="flex h-9 w-full items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-400 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 sm:max-w-[290px]"><Search className="size-4 shrink-0" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reference or applicant…" aria-label="Search by reference or applicant" className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400" />{search && <button aria-label="Clear search" onClick={() => setSearch("")}><X className="size-3.5" /></button>}</label></div>
        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div className="flex items-center gap-2 text-xs text-slate-500"><Filter className="size-3.5" /><span>Filter by status</span><label className="relative"><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value)} className="appearance-none rounded-md border border-slate-200 bg-white py-1.5 pl-2.5 pr-7 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400"><option>All statuses</option><option>Approved</option><option>Rejected</option><option>Pending</option></select><ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2" /></label></div><label className="flex items-center gap-2 text-[11px] text-slate-400"><span>Demo state</span><select value={demo} onChange={(event) => setDemo(event.target.value)} className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 outline-none"><option>Normal response</option><option>Simulate error</option><option>Simulate empty response</option></select><button onClick={retry} className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50" aria-label="Refresh applications"><ArrowDown className="size-3.5" /></button></label></div>
        {/* Only one request state is rendered at a time; empty copy distinguishes an empty API from filtered-out rows. */}
        {loading ? <LoadingState /> : error ? <ErrorState message={error} retry={retry} /> : filtered.length === 0 ? <EmptyState filtered={hasFilters && !simulateEmpty} /> : <><ApplicationTable records={filtered} /><div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3.5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6"><span>Showing <strong className="font-medium text-slate-700">{filtered.length}</strong> of <strong className="font-medium text-slate-700">{result?.data.length ?? 0}</strong> applications</span><span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-emerald-500" />All data is up to date</span></div></>}
      </section><p className="mt-5 text-center text-[11px] text-slate-400">CivicDesk · Application management portal</p>
    </div>
  </main>;
}

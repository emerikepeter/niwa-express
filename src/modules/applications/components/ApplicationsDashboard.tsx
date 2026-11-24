"use client";

import { useMemo, useState } from "react";
import { ArrowDown, Check, ChevronDown, ClipboardList, Filter, Search, X } from "lucide-react";
import { ApplicationTable } from "@/components/ApplicationTable";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { StatCard } from "@/components/StatCard";
import { useApplications } from "@/modules/applications/hooks/useApplications";

export default function ApplicationsDashboard() {
  // Search and status are local presentation state; neither triggers another API request.
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [demo, setDemo] = useState("Normal response");
  const simulateError = demo === "Simulate error";
  const simulateEmpty = demo === "Simulate empty response";
  const { result, loading, error, retry } = useApplications(simulateError, simulateEmpty);

  // Apply both filters together in one pass so text and status always combine.
  const filtered = useMemo(
    () =>
      (result?.data ?? []).filter((record) => {
        const query = search.trim().toLowerCase();
        return (
          (!query ||
            record.reference.toLowerCase().includes(query) ||
            record.applicantName.toLowerCase().includes(query)) &&
          (status === "All statuses" || record.status === status)
        );
      }),
    [result, search, status],
  );
  const hasFilters = Boolean(search.trim()) || status !== "All statuses";

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-white">
              <ClipboardList className="size-[18px]" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Civic<span className="text-indigo-600">Desk</span>
            </span>
          </a>
          <nav aria-label="Main navigation" className="hidden items-center gap-7 sm:flex">
            <a href="#applications" className="text-sm font-medium text-indigo-700">Applications</a>
            <a href="#applications" className="text-sm text-slate-500 hover:text-slate-900">Reports</a>
            <a href="#applications" className="text-sm text-slate-500 hover:text-slate-900">Help center</a>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block text-xs font-medium text-slate-700">Operations team</span>
              <span className="block text-[11px] text-slate-400">Administrator</span>
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">OT</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Workspace</span><span>/</span><span className="text-slate-600">Applications</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">Applications overview</h1>
            <p className="mt-1.5 text-sm text-slate-500">Track and manage submitted applications.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="size-2 rounded-full bg-emerald-500" />Data last updated just now
          </div>
        </div>

        {/* Summary totals remain visible while records are loading or unavailable. */}
        <section aria-label="Application summary" className="mb-8 grid gap-4 sm:grid-cols-2">
          <StatCard title="Approved applications" value={result?.summary.approved ?? 150} change="12.8%" icon={Check} tone="green" />
          <StatCard title="Rejected applications" value={result?.summary.rejected ?? 35} change="4.3%" icon={X} tone="red" />
        </section>

        <section
          id="applications"
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40"
        >
          <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="text-base font-semibold">Application records</h2>
              <p className="mt-1 text-xs text-slate-500">Review and search recent submissions</p>
            </div>
            <label className="flex h-9 w-full items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-400 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 sm:max-w-[290px]">
              <Search className="size-4 shrink-0" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search reference or applicant..."
                aria-label="Search by reference or applicant"
                className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
              />
              {search && (
                <button aria-label="Clear search" onClick={() => setSearch("")}>
                  <X className="size-3.5" />
                </button>
              )}
            </label>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Filter className="size-3.5" />
              <span>Filter by status</span>
              <label className="relative">
                <span className="sr-only">Filter by status</span>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="appearance-none rounded-md border border-slate-200 bg-white py-1.5 pl-2.5 pr-7 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400"
                >
                  <option>All statuses</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Pending</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2" />
              </label>
            </div>
            <label className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Demo state</span>
              <select
                value={demo}
                onChange={(event) => setDemo(event.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 outline-none"
              >
                <option>Normal response</option>
                <option>Simulate error</option>
                <option>Simulate empty response</option>
              </select>
              <button
                onClick={retry}
                className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
                aria-label="Refresh applications"
              >
                <ArrowDown className="size-3.5" />
              </button>
            </label>
          </div>

          {/* Render one request state at a time; distinguish empty data from no filter matches. */}
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} retry={retry} />
          ) : filtered.length === 0 ? (
            <EmptyState filtered={hasFilters && !simulateEmpty} />
          ) : (
            <>
              <ApplicationTable records={filtered} />
              <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3.5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <span>
                  Showing <strong className="font-medium text-slate-700">{filtered.length}</strong> of{" "}
                  <strong className="font-medium text-slate-700">{result?.data.length ?? 0}</strong> applications
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500" />All data is up to date
                </span>
              </div>
            </>
          )}
        </section>
        <p className="mt-5 text-center text-[11px] text-slate-400">CivicDesk · Application management portal</p>
      </div>
    </main>
  );
}

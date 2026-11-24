import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  change: string;
  icon: LucideIcon;
  tone: "green" | "red";
}

export function StatCard({ title, value, change, icon: Icon, tone }: StatCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span
          className={`grid size-9 place-items-center rounded-lg ${tone === "green" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
        >
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-700">
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
          {change}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-400">Compared with last month</p>
    </article>
  );
}

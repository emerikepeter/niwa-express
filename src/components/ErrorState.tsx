import { Activity } from "lucide-react";

interface ErrorStateProps {
  message: string;
  retry: () => void;
}

export function ErrorState({ message, retry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-rose-50 text-rose-600">
        <Activity className="size-5" />
      </span>
      <h3 className="mt-4 font-semibold text-slate-900">Could not load applications</h3>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
      <button
        onClick={retry}
        className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Try again
      </button>
    </div>
  );
}

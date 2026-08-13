"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Clock3, PlayCircle, RefreshCw, ShieldCheck, type LucideIcon } from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";

type Category =
  | "WATER_FILLED_POTHOLE"
  | "WATER_LEAKAGE"
  | "DRAINAGE_ISSUE"
  | "WATERLOGGING"
  | "DAMAGED_WATER_INFRASTRUCTURE"
  | "OTHER_WATER_RELATED_ISSUE";
type Priority = "HIGH" | "MEDIUM" | "LOW";
type Status = "NEW" | "ACKNOWLEDGED" | "RESOLVED";

type MinistryIssue = {
  ministryIssueId: string;
  source: "KARTAVIEW_CITY_MONITOR" | "DEMONSTRATION_SIMULATION";
  sourceImageId: string;
  category: Category;
  confidence: number;
  description: string;
  evidence: string[];
  latitude: number;
  longitude: number;
  capturedAt: string | null;
  discoveredAt: string;
  analyzedAt: string;
  receivedAt: string;
  status: Status;
  priority: Priority;
  city: string;
  state: string;
  simulation?: { scenarioId: string; label: string; generatedAt: string };
};

type MinistrySummary = {
  totalIssues: number;
  newIssues: number;
  acknowledgedIssues: number;
  resolvedIssues: number;
  byCategory: Record<string, number>;
  byPriority: Record<Priority, number>;
};

type MinistryPayload = { summary: MinistrySummary; issues: MinistryIssue[] };
type DemonstrationResult = {
  duplicate: boolean;
  ministry: { ministryIssueId: string; status: string; priority: string; source: string };
  cityIssue: { issueId: string; category?: Category };
};

const CATEGORIES: Category[] = [
  "WATER_FILLED_POTHOLE",
  "WATER_LEAKAGE",
  "DRAINAGE_ISSUE",
  "WATERLOGGING",
  "DAMAGED_WATER_INFRASTRUCTURE",
  "OTHER_WATER_RELATED_ISSUE",
];

function formatDate(value: string | null, language: "en" | "hi"): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "—";
  return new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function priorityClasses(priority: Priority): string {
  if (priority === "HIGH") return "border-rose-200 bg-rose-50 text-rose-800";
  if (priority === "MEDIUM") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function statusClasses(status: Status): string {
  if (status === "NEW") return "border-blue-200 bg-blue-50 text-blue-800";
  if (status === "ACKNOWLEDGED") return "border-violet-200 bg-violet-50 text-violet-800";
  return "border-emerald-200 bg-emerald-50 text-emerald-800";
}

export default function MinistryDashboard() {
  const { language, t } = useLanguage();
  const copy = t.ministryDashboard;
  const [payload, setPayload] = useState<MinistryPayload | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [simulationBusy, setSimulationBusy] = useState(false);
  const [simulationResult, setSimulationResult] = useState<DemonstrationResult | null>(null);
  const [simulationError, setSimulationError] = useState(false);

  const loadIssues = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/ministry/issues", { cache: "no-store" });
      if (!response.ok) throw new Error("MINISTRY_API_ERROR");
      const nextPayload: unknown = await response.json();
      if (!nextPayload || typeof nextPayload !== "object" || !("summary" in nextPayload) || !("issues" in nextPayload)) {
        throw new Error("MINISTRY_INVALID_RESPONSE");
      }
      setPayload(nextPayload as MinistryPayload);
      setLastUpdated(new Date().toISOString());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const runDemonstration = useCallback(async () => {
    setSimulationBusy(true);
    setSimulationError(false);
    setSimulationResult(null);
    try {
      const response = await fetch("/api/city-monitor/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityId: "lucknow" }),
        cache: "no-store",
      });
      if (!response.ok) throw new Error("DEMONSTRATION_API_ERROR");
      const result: unknown = await response.json();
      if (!result || typeof result !== "object" || !("ministry" in result) || !("duplicate" in result)) throw new Error("DEMONSTRATION_INVALID_RESPONSE");
      setSimulationResult(result as DemonstrationResult);
      await loadIssues();
    } catch {
      setSimulationError(true);
    } finally {
      setSimulationBusy(false);
    }
  }, [loadIssues]);

  useEffect(() => {
    void loadIssues();
  }, [loadIssues]);

  const summary = payload?.summary ?? {
    totalIssues: 0,
    newIssues: 0,
    acknowledgedIssues: 0,
    resolvedIssues: 0,
    byCategory: {},
    byPriority: { HIGH: 0, MEDIUM: 0, LOW: 0 },
  };
  const issues = payload?.issues ?? [];
  const maxCategoryCount = Math.max(1, ...CATEGORIES.map((category) => summary.byCategory[category] ?? 0));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-blue-950 text-blue-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
              <ShieldCheck className="h-5 w-5 text-cyan-200" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-wide">{copy.demonstration}</p>
              <p className="text-xs text-blue-200">{copy.demonstrationNotice}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-blue-100" aria-live="polite">
            <span className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
            {copy.serviceAvailable}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8" aria-labelledby="ministry-dashboard-title">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">{copy.subtitle}</p>
            <h1 id="ministry-dashboard-title" className="text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">
              {copy.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-800">{copy.location}</span>
              <span>{copy.sourceStatus}</span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
              type="button"
              onClick={() => void loadIssues()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
              aria-label={loading ? copy.refreshing : copy.refresh}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
              {loading ? copy.refreshing : copy.refresh}
            </button>
            <p className="text-xs text-slate-500" aria-live="polite">
              {copy.lastUpdated}: {lastUpdated ? formatDate(lastUpdated, language) : "—"}
            </p>
          </div>
        </header>

        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900" role="alert">
            <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" aria-hidden="true" />{copy.errors.load}</span>
            <button type="button" onClick={() => void loadIssues()} className="font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700">{copy.errors.retry}</button>
          </div>
        )}

        <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-5" aria-labelledby="simulation-heading">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 id="simulation-heading" className="flex items-center gap-2 text-lg font-bold text-cyan-950">
                <PlayCircle className="h-5 w-5 text-cyan-700" aria-hidden="true" />
                {copy.simulation.title}
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-cyan-900">{copy.simulation.description}</p>
            </div>
            <button
              type="button"
              onClick={() => void runDemonstration()}
              disabled={simulationBusy}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-cyan-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
            >
              <PlayCircle className={`h-4 w-4 ${simulationBusy ? "animate-pulse" : ""}`} aria-hidden="true" />
              {simulationBusy ? copy.simulation.running : copy.simulation.run}
            </button>
          </div>
          {simulationError && <p className="mt-3 text-sm font-semibold text-rose-800" role="alert">{copy.simulation.error}</p>}
          {simulationResult && (
            <div className="mt-4 rounded-md border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-700" role="status">
              <p className="font-bold text-cyan-950">{simulationResult.duplicate ? copy.simulation.duplicate : copy.simulation.completed}</p>
              <p className="mt-1">{copy.simulation.accepted}: <span className="font-semibold">{simulationResult.cityIssue.issueId}</span></p>
              <p>{copy.simulation.forwarded}: <span className="font-semibold text-blue-900">{simulationResult.ministry.ministryIssueId}</span></p>
            </div>
          )}
        </section>

        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="sr-only">{copy.summary.total}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {([
              [copy.summary.total, summary.totalIssues, "text-blue-900", Activity],
              [copy.summary.new, summary.newIssues, "text-cyan-700", Clock3],
              [copy.summary.highPriority, summary.byPriority.HIGH ?? 0, "text-rose-700", AlertTriangle],
              [copy.summary.acknowledged, summary.acknowledgedIssues, "text-violet-700", CheckCircle2],
              [copy.summary.resolved, summary.resolvedIssues, "text-emerald-700", CheckCircle2],
            ] as [string, number, string, LucideIcon][]).map(([label, value, color, Icon]) => (
              <div key={String(label)} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-600">{label}</p>
                  <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]" aria-label={`${copy.categorySummary} and ${copy.prioritySummary}`}>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-blue-950">{copy.categorySummary}</h2>
            <div className="mt-5 space-y-4">
              {CATEGORIES.map((category) => {
                const count = summary.byCategory[category] ?? 0;
                return (
                  <div key={category}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-slate-700">{copy.categories[category]}</span>
                      <span className="font-bold text-slate-950">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100" role="progressbar" aria-label={`${copy.categories[category]}: ${count}`} aria-valuemin={0} aria-valuemax={maxCategoryCount} aria-valuenow={count}>
                      <div className="h-2 rounded-full bg-cyan-600 transition-all" style={{ width: `${(count / maxCategoryCount) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-blue-950">{copy.prioritySummary}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {(["HIGH", "MEDIUM", "LOW"] as Priority[]).map((priority) => (
                <div key={priority} className={`flex items-center justify-between rounded-md border px-4 py-3 ${priorityClasses(priority)}`}>
                  <span className="text-sm font-bold tracking-wide">{priority}</span>
                  <span className="text-2xl font-bold">{summary.byPriority[priority] ?? 0}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-500">{copy.serviceAvailable}. {copy.sourceStatus}.</p>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="pipeline-heading">
          <div className="flex items-center justify-between gap-3">
            <h2 id="pipeline-heading" className="text-lg font-bold text-blue-950">{copy.pipeline[5]}</h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{copy.pipeline[0]} → {copy.pipeline[5]}</span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {copy.pipeline.map((step, index) => (
              <div key={step} className="relative flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-900 text-[11px] text-white">{index + 1}</span>
                <span>{step}</span>
                {index < copy.pipeline.length - 1 && <span className="hidden text-slate-400 lg:block" aria-hidden="true">→</span>}
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-slate-200 pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-800">{copy.simulationSource}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {copy.simulationPipeline.map((step, index) => (
                <div key={step} className="flex items-center gap-2 rounded-md border border-cyan-200 bg-cyan-50 px-3 py-3 text-xs font-semibold text-cyan-950">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-800 text-[11px] text-white">{index + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm" aria-labelledby="issues-heading">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="issues-heading" className="text-lg font-bold text-blue-950">{copy.recentIssues}</h2>
            <span className="text-sm text-slate-500">{summary.totalIssues} {copy.summary.total.toLowerCase()}</span>
          </div>
          {issues.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"><ShieldCheck className="h-6 w-6" aria-hidden="true" /></div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{copy.operational}</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm font-semibold text-slate-700">{copy.awaiting}</p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">{copy.noIssues}</p>
              <p className="mx-auto mt-1 max-w-2xl text-xs leading-5 text-slate-500">{copy.noIssuesDescription}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <caption className="sr-only">{copy.recentIssues}</caption>
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    {[copy.issueId, copy.category, copy.locationColumn, copy.priority, copy.confidence, copy.source, copy.captured, copy.received, copy.status, copy.details].map((heading) => <th key={heading} scope="col" className="px-5 py-3 font-bold">{heading}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {issues.map((issue) => (
                    <tr key={issue.ministryIssueId} className="align-top hover:bg-slate-50/70">
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-blue-900">{issue.ministryIssueId}</td>
                      <td className="px-5 py-4 font-medium text-slate-700">{copy.categories[issue.category]}</td>
                      <td className="px-5 py-4 text-slate-600">{issue.city}<br /><span className="text-xs text-slate-400">{issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}</span></td>
                      <td className="px-5 py-4"><span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${priorityClasses(issue.priority)}`}>{issue.priority}</span></td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">{Math.round(issue.confidence * 100)}%</td>
                      <td className="px-5 py-4 text-slate-600">{issue.source === "DEMONSTRATION_SIMULATION" ? copy.simulationSource : copy.externalSource}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600">{formatDate(issue.capturedAt, language)}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600">{formatDate(issue.receivedAt, language)}</td>
                      <td className="px-5 py-4"><span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusClasses(issue.status)}`}>{issue.status}</span></td>
                      <td className="px-5 py-4"><details className="group"><summary className="cursor-pointer list-none font-semibold text-blue-800 underline decoration-blue-200 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700">{copy.details}</summary><div className="absolute right-5 z-10 mt-2 w-[min(34rem,calc(100vw-3rem))] rounded-lg border border-slate-200 bg-white p-5 text-left shadow-xl"><div className="grid gap-3 text-sm sm:grid-cols-2"><p><strong>{copy.issueId}:</strong><br />{issue.ministryIssueId}</p><p><strong>{copy.source}:</strong><br />{issue.source === "DEMONSTRATION_SIMULATION" ? copy.simulationSource : copy.externalSource}</p><p><strong>{copy.sourceImageId}:</strong><br /><span className="break-all">{issue.sourceImageId}</span></p><p><strong>{copy.category}:</strong><br />{copy.categories[issue.category]}</p><p><strong>{copy.coordinates}:</strong><br />{issue.latitude}, {issue.longitude}</p><p><strong>{copy.cityState}:</strong><br />{issue.city}, {issue.state}</p><p><strong>{copy.captured}:</strong><br />{formatDate(issue.capturedAt, language)}</p><p><strong>{copy.discovered}:</strong><br />{formatDate(issue.discoveredAt, language)}</p><p><strong>{copy.analyzed}:</strong><br />{formatDate(issue.analyzedAt, language)}</p><p><strong>{copy.ministryReceived}:</strong><br />{formatDate(issue.receivedAt, language)}</p></div><p className="mt-4"><strong>{copy.description}:</strong><br />{issue.description}</p><p className="mt-3"><strong>{copy.evidence}:</strong></p><ul className="mt-1 list-disc space-y-1 pl-5">{issue.evidence.map((observation) => <li key={observation}>{observation}</li>)}</ul></div></details></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

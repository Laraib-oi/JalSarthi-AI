"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ImageIcon,
  MapPin,
  RefreshCw,
  ScanLine,
  Send,
  ShieldCheck,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";

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
type ImageValidation = {
  status: "PASSED";
  mimeType: "image/jpeg" | "image/png";
  width: number;
  height: number;
  validatedAt: string;
};
type Simulation = { scenarioId: string; label: string; generatedAt: string };
type Issue = {
  ministryIssueId: string;
  source: "KARTAVIEW_CITY_MONITOR" | "DEMONSTRATION_SIMULATION";
  sourceImageId: string;
  providerSequenceId: string | null;
  category: Category;
  confidence: number;
  description: string;
  evidence: string[];
  latitude: number;
  longitude: number;
  area: string;
  address: string;
  capturedAt: string | null;
  discoveredAt: string;
  analyzedAt: string;
  receivedAt: string;
  status: Status;
  priority: Priority;
  city: string;
  state: string;
  imageValidation?: ImageValidation;
  simulation?: Simulation;
};
type Summary = {
  totalIssues: number;
  newIssues: number;
  acknowledgedIssues: number;
  resolvedIssues: number;
  byCategory: Record<string, number>;
  byPriority: Record<Priority, number>;
};
type Payload = { summary: Summary; issues: Issue[] };
type DetailPayload = {
  issue: Issue;
  sourceEvidence: { imageState: "AVAILABLE" | "UNAVAILABLE"; imageUrl?: string };
};
type LoadMode = "initialization" | "refresh";

const CATEGORIES: Category[] = [
  "WATER_FILLED_POTHOLE",
  "WATER_LEAKAGE",
  "DRAINAGE_ISSUE",
  "WATERLOGGING",
  "DAMAGED_WATER_INFRASTRUCTURE",
  "OTHER_WATER_RELATED_ISSUE",
];
const EMPTY_ISSUES: Issue[] = [];

function dateLabel(value: string | null, language: "en" | "hi") {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? "—"
    : new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function priorityClasses(value: Priority) {
  return value === "HIGH"
    ? "border-rose-200 bg-rose-50 text-rose-800"
    : value === "MEDIUM"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-slate-200 bg-slate-50 text-slate-700";
}

function statusClasses(value: Status) {
  return value === "NEW"
    ? "border-blue-200 bg-blue-50 text-blue-800"
    : value === "ACKNOWLEDGED"
      ? "border-violet-200 bg-violet-50 text-violet-800"
      : "border-emerald-200 bg-emerald-50 text-emerald-800";
}

function DetailLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-medium text-slate-800">{children}</dd>
    </div>
  );
}

export default function CityMonitorDashboard() {
  const { language, t } = useLanguage();
  const copy = t.ministryDashboard;
  const [payload, setPayload] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMode, setErrorMode] = useState<LoadMode>("initialization");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"" | Category>("");
  const [priority, setPriority] = useState<"" | Priority>("");
  const [status, setStatus] = useState<"" | Status>("");
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailPayload | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(false);
  const [imageUnavailable, setImageUnavailable] = useState(false);

  const loadIssues = useCallback(async (mode: LoadMode) => {
    setLoading(true);
    setError(false);
    setErrorMode(mode);
    try {
      const response = await fetch("/api/ministry/issues", { cache: "no-store" });
      if (!response.ok) throw new Error("MINISTRY_API_ERROR");
      const next = (await response.json()) as Payload;
      if (!next || !next.summary || !Array.isArray(next.issues))
        throw new Error("MINISTRY_INVALID_RESPONSE");
      setPayload(next);
      setLastUpdated(new Date().toISOString());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadIssues("initialization");
  }, [loadIssues]);

  useEffect(() => {
    if (!selectedIssueId) {
      setDetail(null);
      setDetailError(false);
      setImageUnavailable(false);
      return;
    }
    const controller = new AbortController();
    setDetail(null);
    setDetailError(false);
    setDetailLoading(true);
    setImageUnavailable(false);
    void (async () => {
      try {
        const response = await fetch(
          `/api/city-monitor/issues/${encodeURIComponent(selectedIssueId)}`,
          { cache: "no-store", signal: controller.signal }
        );
        if (!response.ok) throw new Error("ISSUE_DETAIL_ERROR");
        const next = (await response.json()) as DetailPayload;
        if (!next?.issue || !next.sourceEvidence) throw new Error("ISSUE_DETAIL_INVALID");
        setDetail(next);
      } catch (requestError) {
        if (!(requestError instanceof DOMException && requestError.name === "AbortError"))
          setDetailError(true);
      } finally {
        if (!controller.signal.aborted) setDetailLoading(false);
      }
    })();
    return () => controller.abort();
  }, [selectedIssueId]);

  useEffect(() => {
    if (!selectedIssueId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIssueId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIssueId]);

  const summary = payload?.summary ?? {
    totalIssues: 0,
    newIssues: 0,
    acknowledgedIssues: 0,
    resolvedIssues: 0,
    byCategory: {},
    byPriority: { HIGH: 0, MEDIUM: 0, LOW: 0 },
  };
  const issues = payload ? payload.issues : EMPTY_ISSUES;
  const filteredIssues = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase();
    return issues.filter(
      (issue) =>
        (!needle ||
          [issue.ministryIssueId, issue.address, issue.area].some((value) =>
            value.toLocaleLowerCase().includes(needle)
          )) &&
        (!category || issue.category === category) &&
        (!priority || issue.priority === priority) &&
        (!status || issue.status === status)
    );
  }, [issues, search, category, priority, status]);
  const maxCategory = Math.max(
    1,
    ...CATEGORIES.map((item) => summary.byCategory[item] ?? 0)
  );
  const cards: [string, number, string, LucideIcon][] = [
    [copy.summary.total, summary.totalIssues, "text-blue-900", Activity],
    [copy.summary.new, summary.newIssues, "text-cyan-700", Clock3],
    [
      copy.summary.highPriority,
      summary.byPriority.HIGH ?? 0,
      "text-rose-700",
      AlertTriangle,
    ],
    [
      copy.summary.acknowledged,
      summary.acknowledgedIssues,
      "text-violet-700",
      CheckCircle2,
    ],
    [copy.summary.resolved, summary.resolvedIssues, "text-emerald-700", CheckCircle2],
  ];
  const detailIssue = detail?.issue;
  const detailTrace =
    detailIssue?.source === "DEMONSTRATION_SIMULATION"
      ? copy.demonstrationTrace
      : copy.kartaviewTrace;
  const showEvidenceImage =
    detail?.sourceEvidence.imageState === "AVAILABLE" &&
    detail.sourceEvidence.imageUrl &&
    !imageUnavailable;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-blue-950 text-blue-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
              <ShieldCheck className="h-5 w-5 text-cyan-200" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-wide">{copy.title}</p>
              <p className="text-xs text-blue-200">{copy.demonstrationNotice}</p>
            </div>
          </div>
          <div
            className="flex items-center gap-2 text-xs font-medium text-blue-100"
            aria-live="polite"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
            {copy.serviceAvailable}
          </div>
        </div>
      </div>
      <main
        className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"
        aria-labelledby="city-monitor-title"
      >
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              {copy.subtitle}
            </p>
            <h1
              id="city-monitor-title"
              className="text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl"
            >
              {copy.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-800">{copy.location}</span>
              <span>{copy.sourceStatus}</span>
              <span>{copy.demonstrationDisclosure}</span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
              type="button"
              onClick={() => void loadIssues("refresh")}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 disabled:cursor-wait disabled:opacity-70"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              {loading ? (payload ? copy.refreshing : copy.initializing) : copy.refresh}
            </button>
            <p className="text-xs text-slate-500" aria-live="polite">
              {copy.lastUpdated}: {lastUpdated ? dateLabel(lastUpdated, language) : "—"}
            </p>
          </div>
        </header>
        {loading && !payload && (
          <div
            className="flex items-center gap-2 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-950"
            role="status"
            aria-live="polite"
          >
            <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
            {copy.initializing}
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900"
          >
            <AlertTriangle className="mr-2 inline h-4 w-4" aria-hidden="true" />
            {errorMode === "refresh" ? copy.errors.refresh : copy.errors.load}{" "}
            <button
              type="button"
              onClick={() => void loadIssues(errorMode)}
              className="ml-3 font-semibold underline"
            >
              {copy.errors.retry}
            </button>
          </div>
        )}
        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="sr-only">
            {copy.overallTotals}
          </h2>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            {copy.overallTotals}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map(([label, value, color, Icon]) => (
              <div
                key={label}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-600">{label}</p>
                  <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-blue-950">{copy.categorySummary}</h2>
            <div className="mt-5 space-y-4">
              {CATEGORIES.map((item) => {
                const count = summary.byCategory[item] ?? 0;
                return (
                  <div key={item}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {copy.categories[item]}
                      </span>
                      <span className="font-bold text-slate-950">{count}</span>
                    </div>
                    <div
                      className="h-2 rounded-full bg-slate-100"
                      role="progressbar"
                      aria-label={`${copy.categories[item]}: ${count}`}
                      aria-valuemin={0}
                      aria-valuemax={maxCategory}
                      aria-valuenow={count}
                    >
                      <div
                        className="h-2 rounded-full bg-cyan-600"
                        style={{ width: `${(count / maxCategory) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-blue-950">{copy.prioritySummary}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {(["HIGH", "MEDIUM", "LOW"] as Priority[]).map((item) => (
                <div
                  key={item}
                  className={`flex items-center justify-between rounded-md border px-4 py-3 ${priorityClasses(item)}`}
                >
                  <span className="text-sm font-bold">{item}</span>
                  <span className="text-2xl font-bold">
                    {summary.byPriority[item] ?? 0}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-500">
              {copy.sourceStatus}. {copy.demonstrationNotice}
            </p>
          </div>
        </section>
        <section
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          aria-labelledby="filter-heading"
        >
          <h2 id="filter-heading" className="text-lg font-bold text-blue-950">
            {copy.filteredResults}
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <label className="md:col-span-2">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                {copy.searchPlaceholder}
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                {copy.filterCategory}
              </span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as "" | Category)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm"
              >
                <option value="">{copy.allCategories}</option>
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {copy.categories[item]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                {copy.filterPriority}
              </span>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value as "" | Priority)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm"
              >
                <option value="">{copy.allPriorities}</option>
                {(["HIGH", "MEDIUM", "LOW"] as Priority[]).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                {copy.filterStatus}
              </span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as "" | Status)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm"
              >
                <option value="">{copy.allStatuses}</option>
                {(["NEW", "ACKNOWLEDGED", "RESOLVED"] as Status[]).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-3 text-xs text-slate-500" aria-live="polite">
            {filteredIssues.length} / {issues.length} {copy.filteredResults.toLowerCase()}
          </p>
        </section>
        <section
          className="rounded-lg border border-slate-200 bg-white shadow-sm"
          aria-labelledby="issues-heading"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <h2 id="issues-heading" className="text-lg font-bold text-blue-950">
              {copy.recentIssues}
            </h2>
            <span className="text-sm text-slate-500">
              {filteredIssues.length} {copy.summary.total.toLowerCase()}
            </span>
          </div>
          {loading && !payload ? (
            <div className="flex min-h-52 items-center justify-center gap-2 px-5 py-14 text-sm font-medium text-slate-600">
              <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
              {copy.initializing}
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <ShieldCheck
                className="mx-auto h-8 w-8 text-emerald-700"
                aria-hidden="true"
              />
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {issues.length ? copy.noResults : copy.operational}
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
                {issues.length ? copy.noResults : copy.noIssuesDescription}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] text-left text-sm">
                <caption className="sr-only">{copy.recentIssues}</caption>
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    {[
                      copy.issueId,
                      copy.category,
                      `${copy.address} / ${copy.area}`,
                      copy.priority,
                      copy.confidence,
                      copy.source,
                      copy.captured,
                      copy.status,
                      copy.details,
                    ].map((heading) => (
                      <th key={heading} scope="col" className="px-5 py-3 font-bold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredIssues.map((issue) => (
                    <tr
                      key={issue.ministryIssueId}
                      className="align-top hover:bg-slate-50/70"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-blue-900">
                        {issue.ministryIssueId}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-700">
                        {copy.categories[issue.category]}
                      </td>
                      <td className="max-w-[20rem] px-5 py-4">
                        <p className="font-semibold text-slate-800">{issue.address}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {issue.area} · {issue.latitude.toFixed(4)},{" "}
                          {issue.longitude.toFixed(4)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${priorityClasses(issue.priority)}`}
                        >
                          {issue.priority}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold">
                        {Math.round(issue.confidence * 100)}%
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {issue.source === "DEMONSTRATION_SIMULATION"
                          ? copy.simulationSource
                          : copy.externalSource}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600">
                        {dateLabel(issue.capturedAt ?? issue.discoveredAt, language)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusClasses(issue.status)}`}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedIssueId(issue.ministryIssueId)}
                          className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-blue-800 underline underline-offset-4 hover:text-blue-950"
                        >
                          <ScanLine className="h-4 w-4" aria-hidden="true" />
                          {copy.details}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      {selectedIssueId && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-4 sm:p-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedIssueId(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="issue-detail-title"
            className="mx-auto my-4 max-w-5xl rounded-xl bg-slate-50 shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-xl border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                  {copy.issueDetails}
                </p>
                <h2
                  id="issue-detail-title"
                  className="mt-1 text-xl font-bold text-blue-950"
                >
                  {detailIssue?.ministryIssueId ?? selectedIssueId}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIssueId(null)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                {copy.closeDetails}
              </button>
            </header>
            <div className="space-y-5 p-5 sm:p-6">
              {detailLoading && (
                <div className="flex min-h-52 items-center justify-center text-sm font-medium text-slate-600">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  {copy.refreshing}
                </div>
              )}
              {detailError && (
                <div
                  role="alert"
                  className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-900"
                >
                  {copy.detailLoadError}
                </div>
              )}
              {detailIssue && (
                <>
                  <section className="rounded-lg border border-slate-200 bg-white p-5">
                    <h3 className="text-lg font-bold text-blue-950">
                      {copy.issueSummary}
                    </h3>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <DetailLabel label={copy.issueId}>
                        {detailIssue.ministryIssueId}
                      </DetailLabel>
                      <DetailLabel label={copy.category}>
                        {copy.categories[detailIssue.category]}
                      </DetailLabel>
                      <DetailLabel label={copy.priority}>
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${priorityClasses(detailIssue.priority)}`}
                        >
                          {detailIssue.priority}
                        </span>
                      </DetailLabel>
                      <DetailLabel label={copy.confidence}>
                        {Math.round(detailIssue.confidence * 100)}%
                      </DetailLabel>
                      <DetailLabel label={copy.status}>
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusClasses(detailIssue.status)}`}
                        >
                          {detailIssue.status}
                        </span>
                      </DetailLabel>
                      <DetailLabel label={copy.source}>
                        {detailIssue.source === "DEMONSTRATION_SIMULATION"
                          ? copy.simulationSource
                          : copy.externalSource}
                      </DetailLabel>
                    </dl>
                  </section>
                  <section className="rounded-lg border border-slate-200 bg-white p-5">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-blue-950">
                      <ImageIcon className="h-5 w-5 text-blue-700" aria-hidden="true" />
                      {copy.sourceEvidence}
                    </h3>
                {showEvidenceImage && detail.sourceEvidence.imageUrl ? (
                      <div className="mt-4">
                        <p className="mb-2 text-sm font-semibold text-slate-800">
                          {copy.sourceImagery}
                        </p>
                        <Image
                          src={detail.sourceEvidence.imageUrl}
                          onError={() => setImageUnavailable(true)}
                          alt={`${copy.sourceImagery}: ${detailIssue.sourceImageId}`}
                          width={1200}
                          height={675}
                          unoptimized
                          className="aspect-video max-h-96 w-full rounded-lg border border-slate-200 bg-slate-100 object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-700">
                        <ImageIcon
                          className="mb-2 h-5 w-5 text-slate-500"
                          aria-hidden="true"
                        />
                        <p className="font-bold">
                          {detailIssue.source === "DEMONSTRATION_SIMULATION"
                            ? copy.controlledSimulationEvidence
                            : copy.sourceImageryUnavailable}
                        </p>
                        <p className="mt-1 leading-6">
                          {detailIssue.source === "DEMONSTRATION_SIMULATION"
                            ? copy.controlledSimulationEvidenceDescription
                            : copy.sourceImageryUnavailableDescription}
                        </p>
                      </div>
                    )}
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <DetailLabel label={copy.source}>
                        {detailIssue.source === "DEMONSTRATION_SIMULATION"
                          ? copy.simulationSource
                          : copy.externalSource}
                      </DetailLabel>
                      <DetailLabel label={copy.sourceImageId}>
                        {detailIssue.sourceImageId}
                      </DetailLabel>
                      {detailIssue.providerSequenceId && (
                        <DetailLabel label={copy.sourceSequenceId}>
                          {detailIssue.providerSequenceId}
                        </DetailLabel>
                      )}
                      <DetailLabel label={copy.captureTimestamp}>
                        {dateLabel(detailIssue.capturedAt, language)}
                      </DetailLabel>
                      <DetailLabel label={copy.discovered}>
                        {dateLabel(detailIssue.discoveredAt, language)}
                      </DetailLabel>
                    </dl>
                  </section>
                  <section className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-white p-5">
                      <h3 className="flex items-center gap-2 text-lg font-bold text-blue-950">
                        <ShieldCheck
                          className="h-5 w-5 text-emerald-700"
                          aria-hidden="true"
                        />
                        {copy.imageValidation}
                      </h3>
                      {detailIssue.source === "DEMONSTRATION_SIMULATION" ? (
                        <p className="mt-3 text-sm leading-6 text-slate-700">
                          {copy.validationNotApplicable}
                        </p>
                      ) : detailIssue.imageValidation ? (
                        <div className="mt-3 text-sm text-slate-700">
                          <p className="font-semibold text-emerald-800">
                            {copy.validationPassed}
                          </p>
                          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                            <DetailLabel label={copy.imageFormat}>
                              {detailIssue.imageValidation.mimeType}
                            </DetailLabel>
                            <DetailLabel label={copy.imageDimensions}>
                              {detailIssue.imageValidation.width} ×{" "}
                              {detailIssue.imageValidation.height}
                            </DetailLabel>
                            <DetailLabel label={copy.analyzed}>
                              {dateLabel(
                                detailIssue.imageValidation.validatedAt,
                                language
                              )}
                            </DetailLabel>
                          </dl>
                        </div>
                      ) : (
                        <p className="mt-3 text-sm leading-6 text-slate-700">
                          {copy.validationDetailsUnavailable}
                        </p>
                      )}
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-5">
                      <h3 className="flex items-center gap-2 text-lg font-bold text-blue-950">
                        <Sparkles
                          className="h-5 w-5 text-violet-700"
                          aria-hidden="true"
                        />
                        {copy.aiAnalysis}
                      </h3>
                      <dl className="mt-3 grid gap-3">
                        <DetailLabel label={copy.detectedCategory}>
                          {copy.categories[detailIssue.category]}
                        </DetailLabel>
                        <DetailLabel label={copy.confidence}>
                          {Math.round(detailIssue.confidence * 100)}%
                        </DetailLabel>
                        <DetailLabel label={copy.description}>
                          {detailIssue.description}
                        </DetailLabel>
                        <DetailLabel label={copy.acceptanceDecision}>
                          <span className="font-semibold text-emerald-800">
                            {copy.acceptedForIntake}
                          </span>
                        </DetailLabel>
                      </dl>
                      <p className="mt-4 text-xs leading-5 text-slate-500">
                        {copy.analyzed}: {dateLabel(detailIssue.analyzedAt, language)}
                      </p>
                    </div>
                  </section>
                  <section className="rounded-lg border border-slate-200 bg-white p-5">
                    <h3 className="text-lg font-bold text-blue-950">{copy.evidence}</h3>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      {detailIssue.evidence.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2
                            className="mt-1 h-4 w-4 shrink-0 text-cyan-700"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-white p-5">
                      <h3 className="flex items-center gap-2 text-lg font-bold text-blue-950">
                        <MapPin className="h-5 w-5 text-blue-700" aria-hidden="true" />
                        {copy.locationColumn}
                      </h3>
                      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                        <DetailLabel label={copy.area}>{detailIssue.area}</DetailLabel>
                        <DetailLabel label={copy.address}>
                          {detailIssue.address}
                        </DetailLabel>
                        <DetailLabel label={copy.coordinates}>
                          {detailIssue.latitude.toFixed(6)},{" "}
                          {detailIssue.longitude.toFixed(6)}
                        </DetailLabel>
                        <DetailLabel label={copy.cityState}>
                          {detailIssue.city}, {detailIssue.state}
                        </DetailLabel>
                      </dl>
                    </div>
                    <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
                      <h3 className="flex items-center gap-2 text-lg font-bold text-cyan-950">
                        <Send className="h-5 w-5 text-cyan-800" aria-hidden="true" />
                        {copy.ministryIntake}
                      </h3>
                      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                        <DetailLabel label={copy.forwarded}>{copy.forwarded}</DetailLabel>
                        <DetailLabel label={copy.issueId}>
                          {detailIssue.ministryIssueId}
                        </DetailLabel>
                        <DetailLabel label={copy.ministryReceived}>
                          {dateLabel(detailIssue.receivedAt, language)}
                        </DetailLabel>
                        <DetailLabel label={copy.priority}>
                          {detailIssue.priority}
                        </DetailLabel>
                        <DetailLabel label={copy.status}>
                          {detailIssue.status}
                        </DetailLabel>
                      </dl>
                      <p className="mt-4 text-sm font-semibold text-cyan-950">
                        {copy.intakeExplanation}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-cyan-900">
                        {copy.notConnectedToRealMinistry}
                      </p>
                    </div>
                  </section>
                  <section className="rounded-lg border border-blue-200 bg-blue-50 p-5">
                    <h3 className="text-lg font-bold text-blue-950">
                      {copy.processingTrace}
                    </h3>
                    <ol className="mt-4 flex flex-col gap-2 lg:flex-row lg:items-center">
                      {detailTrace.map((step, index) => (
                        <li key={step} className="flex min-w-0 flex-1 items-center gap-2">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
                            {index + 1}
                          </span>
                          <span className="text-sm font-semibold text-blue-950">
                            {step}
                          </span>
                          {index < detailTrace.length - 1 && (
                            <ChevronRight
                              className="hidden h-4 w-4 shrink-0 text-blue-400 lg:block"
                              aria-hidden="true"
                            />
                          )}
                        </li>
                      ))}
                    </ol>
                  </section>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

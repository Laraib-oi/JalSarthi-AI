"use client";

import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { PotholeLocationMapProps } from "@/components/assistant/PotholeLocationMap";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { WaterloggedPotholeAnalysis } from "@/types/pothole-analysis";

const WORKFLOW_ICONS = [Camera, Sparkles, MapPin, ClipboardCheck, CheckCircle2];
const SUPPORTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const PotholeLocationMap = dynamic<PotholeLocationMapProps>(
  () => import("@/components/assistant/PotholeLocationMap"),
  { ssr: false }
);

type WorkflowState = "idle" | "imageSelected" | "analyzing" | "analysisResult";

type SelectedImage = {
  file: File;
  previewUrl: string;
};

type ImageValidationError = "unsupported" | "tooLarge";
type LocationState =
  | "notStarted"
  | "requesting"
  | "success"
  | "permissionDenied"
  | "unavailable"
  | "timeout"
  | "unsupported";
type LocationMethod = "gps" | "manual";
type ManualLocationError = "latitude" | "longitude" | "areaRequired" | "areaTooLong";

type CapturedLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

type SelectedMapLocation = CapturedLocation & {
  manuallyAdjusted: boolean;
  source: LocationMethod;
};

type MapState = "idle" | "loading" | "loaded" | "error";
type AddressState = "notStarted" | "loading" | "success" | "error";
type AddressError = "unavailable" | "notFound";

type ReverseGeocodeResponse = {
  address: string;
};

function validateImage(file: File): ImageValidationError | undefined {
  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) return "unsupported";
  return file.size > MAX_IMAGE_SIZE_BYTES ? "tooLarge" : undefined;
}

function hasValidCoordinates(latitude: number, longitude: number): boolean {
  return (
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function parseCoordinate(value: string): number | undefined {
  const normalized = value.trim();
  if (!/^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:[eE][+-]?\d+)?$/.test(normalized))
    return undefined;
  const coordinate = Number(normalized);
  return Number.isFinite(coordinate) ? coordinate : undefined;
}

function areasAppearConsistent(area: string, address: string): boolean {
  const normalize = (value: string) =>
    value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
  const normalizedArea = normalize(area);
  const normalizedAddress = normalize(address);
  return (
    Boolean(normalizedArea) &&
    Boolean(normalizedAddress) &&
    (normalizedAddress.includes(normalizedArea) ||
      normalizedArea.includes(normalizedAddress))
  );
}

function formatFileSize(bytes: number, language: "en" | "hi"): string {
  const megabytes = bytes / (1024 * 1024);
  const kilobytes = bytes / 1024;
  const value = megabytes >= 1 ? megabytes : kilobytes;
  const unit = megabytes >= 1 ? "MB" : "KB";
  return `${new Intl.NumberFormat(language, { maximumFractionDigits: 1 }).format(value)} ${unit}`;
}

function isWaterloggedPotholeAnalysis(
  value: unknown
): value is WaterloggedPotholeAnalysis {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const result = value as Record<string, unknown>;
  return (
    (result.classification === "eligible" ||
      result.classification === "not_eligible" ||
      result.classification === "insufficient_evidence") &&
    typeof result.potholeVisible === "boolean" &&
    typeof result.standingWaterVisible === "boolean" &&
    typeof result.confidence === "number" &&
    Number.isFinite(result.confidence) &&
    result.confidence >= 0 &&
    result.confidence <= 1 &&
    (result.severity === "low" ||
      result.severity === "medium" ||
      result.severity === "high" ||
      result.severity === "unknown") &&
    typeof result.description === "string" &&
    Boolean(result.description.trim()) &&
    result.description.length <= 280 &&
    typeof result.eligible === "boolean"
  );
}

function isReverseGeocodeResponse(value: unknown): value is ReverseGeocodeResponse {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const response = value as Record<string, unknown>;
  return (
    Object.keys(response).length === 1 &&
    typeof response.address === "string" &&
    Boolean(response.address.trim()) &&
    response.address.length <= 300
  );
}

function isAddressNotFoundResponse(value: unknown): boolean {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (value as Record<string, unknown>).error === "ADDRESS_NOT_FOUND"
  );
}

/**
 * The selected file and its temporary object URL stay only in component memory.
 * Later checkpoints can advance this isolated state machine without involving
 * the normal chat workflow.
 */
export default function WaterAccumulatingPotholeReport() {
  const { language, t } = useLanguage();
  const copy = t.assistant.potholeReport;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [workflowState, setWorkflowState] = useState<WorkflowState>("idle");
  const [selectedImage, setSelectedImage] = useState<SelectedImage>();
  const [validationError, setValidationError] = useState<ImageValidationError>();
  const [analysis, setAnalysis] = useState<WaterloggedPotholeAnalysis>();
  const [analysisError, setAnalysisError] = useState(false);
  const [locationMethod, setLocationMethod] = useState<LocationMethod>();
  const [locationState, setLocationState] = useState<LocationState>("notStarted");
  const [location, setLocation] = useState<CapturedLocation>();
  const [manualLatitude, setManualLatitude] = useState("");
  const [manualLongitude, setManualLongitude] = useState("");
  const [manualArea, setManualArea] = useState("");
  const [manualLocationErrors, setManualLocationErrors] = useState<ManualLocationError[]>(
    []
  );
  const [userProvidedArea, setUserProvidedArea] = useState<string>();
  const [selectedMapLocation, setSelectedMapLocation] = useState<SelectedMapLocation>();
  const [confirmedLocation, setConfirmedLocation] = useState<SelectedMapLocation>();
  const [mapState, setMapState] = useState<MapState>("idle");
  const [mapKey, setMapKey] = useState(0);
  const [addressState, setAddressState] = useState<AddressState>("notStarted");
  const [address, setAddress] = useState<string>();
  const [addressError, setAddressError] = useState<AddressError>();
  const [isReportPreviewOpen, setIsReportPreviewOpen] = useState(false);
  const locationRequestIdRef = useRef(0);
  const addressRequestIdRef = useRef(0);
  const imageHeadingRef = useRef<HTMLHeadingElement>(null);
  const locationHeadingRef = useRef<HTMLHeadingElement>(null);
  const reportPreviewRef = useRef<HTMLElement>(null);

  useEffect(() => {
    return () => {
      if (selectedImage) URL.revokeObjectURL(selectedImage.previewUrl);
    };
  }, [selectedImage]);

  const clearAddress = () => {
    addressRequestIdRef.current += 1;
    setIsReportPreviewOpen(false);
    setAddress(undefined);
    setAddressError(undefined);
    setAddressState("notStarted");
  };

  const clearLocation = () => {
    locationRequestIdRef.current += 1;
    clearAddress();
    setLocation(undefined);
    setLocationMethod(undefined);
    setLocationState("notStarted");
    setManualLatitude("");
    setManualLongitude("");
    setManualArea("");
    setManualLocationErrors([]);
    setUserProvidedArea(undefined);
    setSelectedMapLocation(undefined);
    setConfirmedLocation(undefined);
    setMapState("idle");
    setMapKey((current) => current + 1);
  };

  const removeImage = () => {
    clearLocation();
    setSelectedImage(undefined);
    setValidationError(undefined);
    setAnalysis(undefined);
    setAnalysisError(false);
    setWorkflowState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const tryAnotherImage = () => {
    removeImage();
    fileInputRef.current?.focus();
  };

  const getSeverityLabel = (severity: WaterloggedPotholeAnalysis["severity"]) => {
    if (severity === "low") return copy.analysis.severityLow;
    if (severity === "medium") return copy.analysis.severityMedium;
    if (severity === "high") return copy.analysis.severityHigh;
    return undefined;
  };

  const reportIsReady = Boolean(
    workflowState === "analysisResult" &&
    selectedImage &&
    analysis?.eligible &&
    confirmedLocation &&
    addressState === "success" &&
    address
  );

  useEffect(() => {
    if (!reportIsReady) setIsReportPreviewOpen(false);
  }, [reportIsReady]);

  useEffect(() => {
    if (isReportPreviewOpen) reportPreviewRef.current?.focus();
  }, [isReportPreviewOpen]);

  const returnToStep = (heading: React.RefObject<HTMLHeadingElement | null>) => {
    setIsReportPreviewOpen(false);
    window.requestAnimationFrame(() => {
      heading.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      heading.current?.focus();
    });
  };

  const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;

    const error = validateImage(file);
    if (error) {
      setValidationError(error);
      return;
    }

    clearLocation();
    setValidationError(undefined);
    setSelectedImage({ file, previewUrl: URL.createObjectURL(file) });
    setAnalysis(undefined);
    setAnalysisError(false);
    setWorkflowState("imageSelected");
  };

  const analyzeImage = async () => {
    if (!selectedImage || workflowState === "analyzing") return;

    clearLocation();
    setAnalysis(undefined);
    setAnalysisError(false);
    setWorkflowState("analyzing");
    const formData = new FormData();
    formData.append("image", selectedImage.file);
    formData.append("language", language);

    try {
      const response = await fetch("/api/pothole/analyze", {
        method: "POST",
        body: formData,
      });
      const payload: unknown = await response.json();
      if (!response.ok || !isWaterloggedPotholeAnalysis(payload))
        throw new Error("ANALYSIS_FAILED");
      setAnalysis(payload);
      setWorkflowState("analysisResult");
    } catch {
      setAnalysisError(true);
      setWorkflowState("imageSelected");
    }
  };

  const requestLocation = () => {
    if (!analysis?.eligible || locationState === "requesting") return;

    setLocationMethod("gps");
    setManualLocationErrors([]);
    setUserProvidedArea(undefined);
    const requestId = locationRequestIdRef.current + 1;
    locationRequestIdRef.current = requestId;
    setLocation(undefined);

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationState("unsupported");
      return;
    }

    setLocationState("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (locationRequestIdRef.current !== requestId) return;

        const { latitude, longitude } = position.coords;
        const reportedAccuracy: unknown = position.coords.accuracy;
        const accuracy =
          typeof reportedAccuracy === "number" ? reportedAccuracy : undefined;
        const validCoordinates = hasValidCoordinates(latitude, longitude);
        const validAccuracy =
          accuracy === undefined || (Number.isFinite(accuracy) && accuracy >= 0);

        if (!validCoordinates || !validAccuracy) {
          setLocationState("unavailable");
          return;
        }

        const capturedLocation = { latitude, longitude, accuracy };
        setLocation(capturedLocation);
        setSelectedMapLocation({
          ...capturedLocation,
          manuallyAdjusted: false,
          source: "gps",
        });
        setConfirmedLocation(undefined);
        setMapState("loading");
        setLocationState("success");
      },
      (error) => {
        if (locationRequestIdRef.current !== requestId) return;
        if (error.code === error.PERMISSION_DENIED) {
          setLocationState("permissionDenied");
        } else if (error.code === error.TIMEOUT) {
          setLocationState("timeout");
        } else {
          setLocationState("unavailable");
        }
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 }
    );
  };

  const formatCoordinate = (value: number) =>
    new Intl.NumberFormat(language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    }).format(value);

  const formatAccuracy = (value: number) =>
    new Intl.NumberFormat(language, {
      maximumFractionDigits: 0,
    }).format(value);

  const getLocationError = () => {
    if (locationState === "permissionDenied") return copy.location.permissionDenied;
    if (locationState === "timeout") return copy.location.timeout;
    if (locationState === "unsupported") return copy.location.unsupported;
    return copy.location.unavailable;
  };

  const updateSelectedMapLocation = ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    if (!hasValidCoordinates(latitude, longitude)) return;
    clearAddress();
    setSelectedMapLocation({
      latitude,
      longitude,
      manuallyAdjusted: true,
      source: selectedMapLocation?.source ?? "gps",
    });
    setConfirmedLocation(undefined);
  };

  const startManualLocation = () => {
    locationRequestIdRef.current += 1;
    clearAddress();
    setLocation(undefined);
    setLocationState("notStarted");
    setSelectedMapLocation(undefined);
    setConfirmedLocation(undefined);
    setMapState("idle");
    setMapKey((current) => current + 1);
    setLocationMethod("manual");
    setManualLatitude("");
    setManualLongitude("");
    setManualArea("");
    setManualLocationErrors([]);
    setUserProvidedArea(undefined);
  };

  const editManualLocation = () => {
    clearAddress();
    setSelectedMapLocation(undefined);
    setConfirmedLocation(undefined);
    setMapState("idle");
    setMapKey((current) => current + 1);
    setManualLocationErrors([]);
  };

  const submitManualLocation = () => {
    const latitude = parseCoordinate(manualLatitude);
    const longitude = parseCoordinate(manualLongitude);
    const area = manualArea.trim();
    const errors: ManualLocationError[] = [];
    if (latitude === undefined || latitude < -90 || latitude > 90)
      errors.push("latitude");
    if (longitude === undefined || longitude < -180 || longitude > 180)
      errors.push("longitude");
    if (!area) errors.push("areaRequired");
    else if (area.length > 160) errors.push("areaTooLong");
    setManualLocationErrors(errors);
    if (errors.length || latitude === undefined || longitude === undefined) return;

    locationRequestIdRef.current += 1;
    clearAddress();
    setLocation(undefined);
    setLocationState("notStarted");
    setUserProvidedArea(area);
    setSelectedMapLocation({
      latitude,
      longitude,
      manuallyAdjusted: false,
      source: "manual",
    });
    setConfirmedLocation(undefined);
    setMapState("loading");
    setMapKey((current) => current + 1);
  };

  const updateManualField = (field: "latitude" | "longitude" | "area", value: string) => {
    if (field === "latitude") setManualLatitude(value);
    if (field === "longitude") setManualLongitude(value);
    if (field === "area") setManualArea(value);
    if (selectedMapLocation?.source !== "manual") return;
    editManualLocation();
  };

  const confirmLocation = () => {
    if (
      !selectedMapLocation ||
      !hasValidCoordinates(selectedMapLocation.latitude, selectedMapLocation.longitude)
    )
      return;
    clearAddress();
    setConfirmedLocation(selectedMapLocation);
  };

  const findAddress = async () => {
    if (!confirmedLocation || addressState === "loading") return;

    const requestId = addressRequestIdRef.current + 1;
    addressRequestIdRef.current = requestId;
    setAddress(undefined);
    setAddressError(undefined);
    setAddressState("loading");

    try {
      const response = await fetch("/api/pothole/reverse-geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: confirmedLocation.latitude,
          longitude: confirmedLocation.longitude,
          language,
        }),
      });
      const payload: unknown = await response.json();

      if (addressRequestIdRef.current !== requestId) return;

      if (response.ok && isReverseGeocodeResponse(payload)) {
        setAddress(payload.address);
        setAddressState("success");
        return;
      }

      setAddressError(isAddressNotFoundResponse(payload) ? "notFound" : "unavailable");
      setAddressState("error");
    } catch {
      if (addressRequestIdRef.current !== requestId) return;
      setAddressError("unavailable");
      setAddressState("error");
    }
  };

  const retryMap = () => {
    if (!selectedMapLocation) return;
    setMapState("loading");
    setMapKey((current) => current + 1);
  };

  return (
    <section
      className="bg-gradient-surface py-10 sm:py-14"
      aria-labelledby="pothole-report-heading"
    >
      <div className="container max-w-4xl">
        <div className="rounded-3xl border border-primary-100 bg-white p-5 shadow-card sm:p-8">
          <p className="text-caption font-semibold uppercase tracking-wide text-primary-700">
            {copy.eyebrow}
          </p>
          <h1
            id="pothole-report-heading"
            className="mt-2 font-heading text-heading-lg text-ink sm:text-display-sm"
          >
            {copy.title}
          </h1>
          <p className="mt-3 max-w-3xl text-body text-ink-muted">{copy.description}</p>

          <aside className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-body-sm text-cyan-950">
            {copy.targetCondition}
          </aside>

          <section className="mt-8" aria-labelledby="pothole-image-selection-heading">
            <div
              className="rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/60 p-6 text-center sm:p-8"
              aria-busy={workflowState === "analyzing"}
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-700 text-white">
                <Camera className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-4 text-caption font-semibold uppercase tracking-wide text-primary-700">
                {copy.imageSelection.eyebrow}
              </p>
              <h2
                ref={imageHeadingRef}
                tabIndex={-1}
                id="pothole-image-selection-heading"
                className="mt-1 font-heading text-heading-md text-ink"
              >
                {copy.imageSelection.title}
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-body-sm text-ink-muted">
                {copy.imageSelection.description}
              </p>
              <label
                htmlFor="pothole-image"
                className="mt-5 block text-left text-body-sm font-semibold text-ink"
              >
                {selectedImage
                  ? copy.imageSelection.replace
                  : copy.imageSelection.inputLabel}
              </label>
              <input
                ref={fileInputRef}
                id="pothole-image"
                type="file"
                accept="image/jpeg,image/png"
                onChange={selectImage}
                disabled={workflowState === "analyzing"}
                aria-invalid={Boolean(validationError)}
                aria-describedby={
                  validationError
                    ? "pothole-image-help pothole-image-error"
                    : "pothole-image-help"
                }
                className="mt-2 block w-full cursor-pointer rounded-xl border border-primary-200 bg-white text-body-sm text-ink file:mr-4 file:cursor-pointer file:border-0 file:bg-primary-700 file:px-4 file:py-2.5 file:text-body-sm file:font-semibold file:text-white hover:file:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
              />
              <p
                id="pothole-image-help"
                className="mt-3 text-left text-caption text-ink-muted"
              >
                {copy.imageSelection.inputHelp}
              </p>

              {validationError && (
                <p
                  id="pothole-image-error"
                  role="alert"
                  className="mt-3 text-left text-body-sm font-medium text-danger"
                >
                  {validationError === "tooLarge"
                    ? copy.imageSelection.errorTooLarge
                    : copy.imageSelection.errorUnsupported}
                </p>
              )}

              {selectedImage && (
                <div className="mt-6 rounded-2xl border border-primary-200 bg-white p-4 text-left">
                  {/* Object URLs are local, ephemeral browser data and are not compatible with image optimization. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage.previewUrl}
                    alt={copy.imageSelection.previewAlt}
                    className="max-h-80 w-full rounded-xl bg-surface object-contain"
                  />
                  <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                    <dl className="space-y-1 text-body-sm text-ink-muted">
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-semibold text-ink">
                          {copy.imageSelection.filename}:
                        </dt>
                        <dd className="break-all">{selectedImage.file.name}</dd>
                      </div>
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-semibold text-ink">
                          {copy.imageSelection.size}:
                        </dt>
                        <dd>{formatFileSize(selectedImage.file.size, language)}</dd>
                      </div>
                    </dl>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={removeImage}
                      disabled={workflowState === "analyzing"}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                      {copy.imageSelection.remove}
                    </Button>
                  </div>
                  {workflowState === "imageSelected" && !analysisError && !analysis && (
                    <>
                      <p
                        role="status"
                        className="mt-4 rounded-xl border border-success/20 bg-success-50 px-3 py-2 text-body-sm font-semibold text-success"
                      >
                        {copy.imageSelection.ready}
                      </p>
                      <p className="mt-2 text-caption text-ink-muted">
                        {copy.imageSelection.notAnalyzed}
                      </p>
                    </>
                  )}
                  {workflowState === "analyzing" && (
                    <p
                      role="status"
                      aria-live="polite"
                      className="mt-4 rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-body-sm font-semibold text-primary-800"
                    >
                      {copy.analysis.loading}
                    </p>
                  )}
                  {!analysis && !analysisError && (
                    <Button
                      type="button"
                      className="mt-4"
                      onClick={() => void analyzeImage()}
                      disabled={workflowState === "analyzing"}
                    >
                      {workflowState === "analyzing"
                        ? copy.analysis.loading
                        : copy.imageSelection.analyze}
                    </Button>
                  )}
                </div>
              )}
              {analysisError && (
                <section
                  role="alert"
                  aria-live="assertive"
                  className="mt-4 rounded-2xl border border-danger/20 bg-danger-50 p-4 text-left text-body-sm text-danger"
                >
                  <h3 className="text-heading-sm font-heading text-danger">
                    {copy.analysis.resultHeading}
                  </h3>
                  <p className="mt-2">{copy.analysis.error}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button type="button" size="sm" onClick={() => void analyzeImage()}>
                      {copy.analysis.retry}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={tryAnotherImage}
                    >
                      {copy.analysis.tryAnotherImage}
                    </Button>
                  </div>
                </section>
              )}
              {analysis && (
                <section
                  className="mt-4 rounded-2xl border border-primary-200 bg-white p-4 text-left"
                  aria-live="polite"
                  aria-labelledby="pothole-analysis-result-heading"
                >
                  <h3
                    id="pothole-analysis-result-heading"
                    className="text-heading-sm font-heading text-ink"
                  >
                    {copy.analysis.resultHeading}
                  </h3>
                  <p className="mt-2 text-body-sm font-semibold text-ink">
                    {analysis.eligible
                      ? copy.analysis.eligible
                      : analysis.classification === "insufficient_evidence"
                        ? copy.analysis.insufficientEvidence
                        : copy.analysis.notEligible}
                  </p>
                  <p className="mt-1 text-body-sm text-ink-muted">
                    {analysis.eligible
                      ? copy.analysis.eligibleDescription
                      : analysis.classification === "insufficient_evidence"
                        ? copy.analysis.insufficientEvidenceDescription
                        : copy.analysis.notEligibleDescription}
                  </p>
                  <dl className="mt-4 space-y-2 text-body-sm text-ink-muted">
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="font-semibold text-ink">
                        {copy.analysis.potholeVisible}:
                      </dt>
                      <dd>
                        {analysis.potholeVisible
                          ? copy.analysis.visible
                          : copy.analysis.notVisible}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="font-semibold text-ink">
                        {copy.analysis.standingWaterVisible}:
                      </dt>
                      <dd>
                        {analysis.standingWaterVisible
                          ? copy.analysis.visible
                          : copy.analysis.notVisible}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="font-semibold text-ink">
                        {copy.analysis.confidence}:
                      </dt>
                      <dd>
                        {new Intl.NumberFormat(language, {
                          style: "percent",
                          maximumFractionDigits: 0,
                        }).format(analysis.confidence)}
                      </dd>
                    </div>
                    {getSeverityLabel(analysis.severity) && (
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-semibold text-ink">
                          {copy.analysis.severity}:
                        </dt>
                        <dd>{getSeverityLabel(analysis.severity)}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-semibold text-ink">
                        {copy.analysis.description}:
                      </dt>
                      <dd className="mt-1">{analysis.description}</dd>
                    </div>
                  </dl>
                  {analysis.eligible ? (
                    <section
                      className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-4"
                      aria-labelledby="pothole-location-heading"
                      aria-live="polite"
                      aria-busy={locationState === "requesting"}
                    >
                      <h4
                        ref={locationHeadingRef}
                        tabIndex={-1}
                        id="pothole-location-heading"
                        className="text-heading-sm font-heading text-ink"
                      >
                        {copy.location.heading}
                      </h4>
                      <p className="mt-2 text-body-sm text-ink-muted">
                        {copy.location.explanation}
                      </p>
                      <p className="mt-2 text-caption text-ink-muted">
                        {confirmedLocation
                          ? copy.location.privacyNoticeForAddressLookup
                          : copy.location.privacyNotice}
                      </p>

                      {!selectedMapLocation && (
                        <>
                          <div className="mt-4 flex flex-wrap gap-3">
                            <Button
                              type="button"
                              onClick={requestLocation}
                              disabled={locationState === "requesting"}
                            >
                              {copy.location.useCurrentLocation}
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={startManualLocation}
                              disabled={locationState === "requesting"}
                            >
                              {copy.location.enterManually}
                            </Button>
                          </div>
                          {locationMethod === "manual" && (
                            <form
                              className="mt-5 rounded-2xl border border-cyan-200 bg-white p-4"
                              onSubmit={(event) => {
                                event.preventDefault();
                                submitManualLocation();
                              }}
                              noValidate
                            >
                              <h5 className="text-heading-sm font-heading text-ink">
                                {copy.location.manualHeading}
                              </h5>
                              <p className="mt-2 text-body-sm text-ink-muted">
                                {copy.location.manualDescription}
                              </p>
                              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div>
                                  <label
                                    htmlFor="manual-latitude"
                                    className="block text-body-sm font-semibold text-ink"
                                  >
                                    {copy.location.latitude}
                                  </label>
                                  <input
                                    id="manual-latitude"
                                    inputMode="decimal"
                                    value={manualLatitude}
                                    onChange={(event) =>
                                      updateManualField("latitude", event.target.value)
                                    }
                                    placeholder={copy.location.manualLatitudePlaceholder}
                                    aria-invalid={manualLocationErrors.includes(
                                      "latitude"
                                    )}
                                    aria-describedby={
                                      manualLocationErrors.includes("latitude")
                                        ? "manual-latitude-error"
                                        : undefined
                                    }
                                    className="mt-2 block w-full rounded-xl border border-primary-200 bg-white px-3 py-2.5 text-body-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                                  />
                                  {manualLocationErrors.includes("latitude") && (
                                    <p
                                      id="manual-latitude-error"
                                      role="alert"
                                      className="mt-2 text-body-sm text-danger"
                                    >
                                      {copy.location.manualLatitudeInvalid}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <label
                                    htmlFor="manual-longitude"
                                    className="block text-body-sm font-semibold text-ink"
                                  >
                                    {copy.location.longitude}
                                  </label>
                                  <input
                                    id="manual-longitude"
                                    inputMode="decimal"
                                    value={manualLongitude}
                                    onChange={(event) =>
                                      updateManualField("longitude", event.target.value)
                                    }
                                    placeholder={copy.location.manualLongitudePlaceholder}
                                    aria-invalid={manualLocationErrors.includes(
                                      "longitude"
                                    )}
                                    aria-describedby={
                                      manualLocationErrors.includes("longitude")
                                        ? "manual-longitude-error"
                                        : undefined
                                    }
                                    className="mt-2 block w-full rounded-xl border border-primary-200 bg-white px-3 py-2.5 text-body-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                                  />
                                  {manualLocationErrors.includes("longitude") && (
                                    <p
                                      id="manual-longitude-error"
                                      role="alert"
                                      className="mt-2 text-body-sm text-danger"
                                    >
                                      {copy.location.manualLongitudeInvalid}
                                    </p>
                                  )}
                                </div>
                                <div className="sm:col-span-2">
                                  <label
                                    htmlFor="manual-area"
                                    className="block text-body-sm font-semibold text-ink"
                                  >
                                    {copy.location.manualArea}
                                  </label>
                                  <input
                                    id="manual-area"
                                    maxLength={160}
                                    value={manualArea}
                                    onChange={(event) =>
                                      updateManualField("area", event.target.value)
                                    }
                                    placeholder={copy.location.manualAreaPlaceholder}
                                    aria-invalid={
                                      manualLocationErrors.includes("areaRequired") ||
                                      manualLocationErrors.includes("areaTooLong")
                                    }
                                    aria-describedby={
                                      manualLocationErrors.includes("areaRequired")
                                        ? "manual-area-error"
                                        : manualLocationErrors.includes("areaTooLong")
                                          ? "manual-area-error-too-long"
                                          : undefined
                                    }
                                    className="mt-2 block w-full rounded-xl border border-primary-200 bg-white px-3 py-2.5 text-body-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                                  />
                                  {manualLocationErrors.includes("areaRequired") && (
                                    <p
                                      id="manual-area-error"
                                      role="alert"
                                      className="mt-2 text-body-sm text-danger"
                                    >
                                      {copy.location.manualAreaRequired}
                                    </p>
                                  )}
                                  {manualLocationErrors.includes("areaTooLong") && (
                                    <p
                                      id="manual-area-error-too-long"
                                      role="alert"
                                      className="mt-2 text-body-sm text-danger"
                                    >
                                      {copy.location.manualAreaTooLong}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Button type="submit" className="mt-4">
                                {copy.location.showOnMap}
                              </Button>
                              <p className="mt-4 text-caption text-ink-muted">
                                {copy.location.manualPrivacyNotice}
                              </p>
                            </form>
                          )}
                        </>
                      )}
                      {locationState === "requesting" && (
                        <p
                          role="status"
                          className="mt-4 rounded-xl border border-primary-200 bg-white px-3 py-2 text-body-sm font-semibold text-primary-800"
                        >
                          {copy.location.requesting}
                        </p>
                      )}
                      {locationMethod === "gps" &&
                        locationState === "success" &&
                        location && (
                          <>
                            <p
                              role="status"
                              className="mt-4 text-body-sm font-semibold text-success"
                            >
                              {copy.location.captured}
                            </p>
                            <dl className="mt-3 space-y-2 text-body-sm text-ink-muted">
                              <div className="flex flex-wrap gap-x-2">
                                <dt className="font-semibold text-ink">
                                  {copy.location.latitude}:
                                </dt>
                                <dd>{formatCoordinate(location.latitude)}</dd>
                              </div>
                              <div className="flex flex-wrap gap-x-2">
                                <dt className="font-semibold text-ink">
                                  {copy.location.longitude}:
                                </dt>
                                <dd>{formatCoordinate(location.longitude)}</dd>
                              </div>
                              <div className="flex flex-wrap gap-x-2">
                                <dt className="font-semibold text-ink">
                                  {copy.location.accuracy}:
                                </dt>
                                <dd>
                                  {location.accuracy === undefined
                                    ? copy.location.accuracyUnavailable
                                    : copy.location.accuracyApproximate.replace(
                                        "{accuracy}",
                                        formatAccuracy(location.accuracy)
                                      )}
                                </dd>
                              </div>
                            </dl>
                          </>
                        )}
                      {selectedMapLocation && (
                        <>
                          {selectedMapLocation.source === "manual" && (
                            <div className="mt-4 rounded-xl border border-success/20 bg-success-50 p-3">
                              <p
                                role="status"
                                className="text-body-sm font-semibold text-success"
                              >
                                {copy.location.manualLocationFound}
                              </p>
                              <dl className="mt-3 space-y-2 text-body-sm text-ink-muted">
                                <div className="flex flex-wrap gap-x-2">
                                  <dt className="font-semibold text-ink">
                                    {copy.location.latitude}:
                                  </dt>
                                  <dd>
                                    {formatCoordinate(selectedMapLocation.latitude)}
                                  </dd>
                                </div>
                                <div className="flex flex-wrap gap-x-2">
                                  <dt className="font-semibold text-ink">
                                    {copy.location.longitude}:
                                  </dt>
                                  <dd>
                                    {formatCoordinate(selectedMapLocation.longitude)}
                                  </dd>
                                </div>
                                {userProvidedArea && (
                                  <div className="flex flex-wrap gap-x-2">
                                    <dt className="font-semibold text-ink">
                                      {copy.map.userProvidedArea}:
                                    </dt>
                                    <dd>{userProvidedArea}</dd>
                                  </div>
                                )}
                              </dl>
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="mt-4"
                                onClick={editManualLocation}
                              >
                                {copy.location.manualEdit}
                              </Button>
                            </div>
                          )}
                          <section
                            className="mt-5 border-t border-cyan-200 pt-5"
                            aria-labelledby="pothole-map-heading"
                            aria-live="polite"
                            aria-busy={mapState === "loading"}
                          >
                            <h5
                              id="pothole-map-heading"
                              className="text-heading-sm font-heading text-ink"
                            >
                              {copy.map.heading}
                            </h5>
                            <p className="mt-2 text-body-sm text-ink-muted">
                              {selectedMapLocation.source === "manual"
                                ? copy.map.manualInstructions
                                : copy.map.instructions}
                            </p>
                            {selectedMapLocation.source === "gps" && location && (
                              <p className="mt-2 text-caption text-ink-muted">
                                {copy.map.originalGpsAccuracy}:{" "}
                                {location.accuracy === undefined
                                  ? copy.location.accuracyUnavailable
                                  : copy.location.accuracyApproximate.replace(
                                      "{accuracy}",
                                      formatAccuracy(location.accuracy)
                                    )}
                              </p>
                            )}
                            {mapState === "loading" && (
                              <p
                                role="status"
                                className="mt-3 text-body-sm text-primary-800"
                              >
                                {copy.map.loading}
                              </p>
                            )}
                            {mapState !== "error" && selectedMapLocation && (
                              <PotholeLocationMap
                                key={mapKey}
                                coordinates={selectedMapLocation}
                                markerLabel={copy.map.markerLabel}
                                mapLabel={copy.map.mapLabel}
                                onMarkerMove={updateSelectedMapLocation}
                                onMapReady={() => setMapState("loaded")}
                                onMapError={() => setMapState("error")}
                              />
                            )}
                            {mapState === "error" && (
                              <div className="mt-3" role="alert">
                                <p className="text-body-sm text-danger">
                                  {copy.map.unavailable}
                                </p>
                                <Button
                                  type="button"
                                  size="sm"
                                  className="mt-3"
                                  onClick={retryMap}
                                >
                                  {copy.map.retry}
                                </Button>
                              </div>
                            )}
                            {selectedMapLocation && (
                              <dl className="mt-4 space-y-2 text-body-sm text-ink-muted">
                                <div className="flex flex-wrap gap-x-2">
                                  <dt className="font-semibold text-ink">
                                    {copy.map.selectedLatitude}:
                                  </dt>
                                  <dd>
                                    {formatCoordinate(selectedMapLocation.latitude)}
                                  </dd>
                                </div>
                                <div className="flex flex-wrap gap-x-2">
                                  <dt className="font-semibold text-ink">
                                    {copy.map.selectedLongitude}:
                                  </dt>
                                  <dd>
                                    {formatCoordinate(selectedMapLocation.longitude)}
                                  </dd>
                                </div>
                              </dl>
                            )}
                            {selectedMapLocation?.manuallyAdjusted && (
                              <p className="mt-3 text-body-sm text-ink-muted">
                                {selectedMapLocation.source === "manual"
                                  ? copy.map.manuallyAdjustedManual
                                  : copy.map.manuallyAdjusted}
                              </p>
                            )}
                            {!confirmedLocation && selectedMapLocation && (
                              <Button
                                type="button"
                                className="mt-4"
                                onClick={confirmLocation}
                                disabled={mapState === "error" || mapState === "loading"}
                              >
                                {copy.map.confirmLocation}
                              </Button>
                            )}
                            {confirmedLocation && (
                              <div className="mt-4 rounded-xl border border-success/20 bg-success-50 p-3">
                                <p
                                  role="status"
                                  className="text-body-sm font-semibold text-success"
                                >
                                  {copy.map.confirmed}
                                </p>
                                <p className="mt-1 text-body-sm text-ink-muted">
                                  {copy.map.confirmedCoordinates
                                    .replace(
                                      "{latitude}",
                                      formatCoordinate(confirmedLocation.latitude)
                                    )
                                    .replace(
                                      "{longitude}",
                                      formatCoordinate(confirmedLocation.longitude)
                                    )}
                                </p>
                                <section
                                  className="mt-4 border-t border-success/20 pt-4"
                                  aria-labelledby="pothole-address-heading"
                                  aria-live="polite"
                                  aria-busy={addressState === "loading"}
                                >
                                  <h6
                                    id="pothole-address-heading"
                                    className="text-heading-sm font-heading text-ink"
                                  >
                                    {copy.address.heading}
                                  </h6>
                                  <p className="mt-2 text-body-sm text-ink-muted">
                                    {copy.address.instructions}
                                  </p>

                                  {addressState === "notStarted" && (
                                    <Button
                                      type="button"
                                      className="mt-4"
                                      onClick={() => void findAddress()}
                                    >
                                      {copy.address.continueToAddress}
                                    </Button>
                                  )}

                                  {addressState === "loading" && (
                                    <p
                                      role="status"
                                      className="mt-4 rounded-xl border border-primary-200 bg-white px-3 py-2 text-body-sm font-semibold text-primary-800"
                                    >
                                      {copy.address.finding}
                                    </p>
                                  )}

                                  {addressState === "success" && address && (
                                    <div className="mt-4 rounded-xl border border-success/20 bg-white p-3">
                                      <p
                                        role="status"
                                        className="text-body-sm font-semibold text-success"
                                      >
                                        {copy.address.found}
                                      </p>
                                      <dl className="mt-3 text-body-sm text-ink-muted">
                                        {confirmedLocation.source === "manual" &&
                                          userProvidedArea && (
                                            <div>
                                              <dt className="font-semibold text-ink">
                                                {copy.map.userProvidedArea}
                                              </dt>
                                              <dd className="mt-1 break-words">
                                                {userProvidedArea}
                                              </dd>
                                            </div>
                                          )}
                                        <div>
                                          <dt className="font-semibold text-ink">
                                            {copy.reportPreview.reverseGeocodedAddress}
                                          </dt>
                                          <dd className="mt-1 break-words">{address}</dd>
                                        </div>
                                      </dl>
                                      {confirmedLocation.source === "manual" &&
                                        userProvidedArea &&
                                        !areasAppearConsistent(
                                          userProvidedArea,
                                          address
                                        ) && (
                                          <p
                                            role="status"
                                            className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-caption text-amber-950"
                                          >
                                            {copy.reportPreview.areaMayNotMatch}
                                          </p>
                                        )}
                                      <Button
                                        type="button"
                                        className="mt-4"
                                        onClick={() => setIsReportPreviewOpen(true)}
                                      >
                                        {copy.address.continueToReport}
                                      </Button>
                                    </div>
                                  )}

                                  {addressState === "error" && (
                                    <div className="mt-4" role="alert">
                                      <p className="text-body-sm text-danger">
                                        {addressError === "notFound"
                                          ? copy.address.noAddressFound
                                          : copy.address.unavailable}
                                      </p>
                                      <Button
                                        type="button"
                                        size="sm"
                                        className="mt-3"
                                        onClick={() => void findAddress()}
                                      >
                                        {copy.address.retry}
                                      </Button>
                                    </div>
                                  )}

                                  <p className="mt-4 text-caption text-ink-muted">
                                    {copy.address.privacyNotice}
                                  </p>
                                  <p className="mt-1 text-caption text-ink-muted">
                                    {copy.address.temporaryNotice}
                                  </p>
                                  <a
                                    className="mt-2 inline-block text-caption text-primary-700 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                                    href="https://www.openstreetmap.org/copyright"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {copy.address.attribution}
                                  </a>
                                </section>
                              </div>
                            )}
                          </section>
                        </>
                      )}
                      {locationMethod === "gps" &&
                        (locationState === "permissionDenied" ||
                          locationState === "unavailable" ||
                          locationState === "timeout" ||
                          locationState === "unsupported") && (
                          <div className="mt-4" role="alert">
                            <p className="text-body-sm text-danger">
                              {getLocationError()}
                            </p>
                            {locationState !== "unsupported" && (
                              <Button
                                type="button"
                                size="sm"
                                className="mt-3"
                                onClick={requestLocation}
                              >
                                {copy.location.retry}
                              </Button>
                            )}
                          </div>
                        )}
                    </section>
                  ) : (
                    <Button type="button" className="mt-4" onClick={tryAnotherImage}>
                      {copy.analysis.tryAnotherImage}
                    </Button>
                  )}
                </section>
              )}
              <p className="mt-4 text-left text-caption text-ink-muted">
                {workflowState === "analyzing"
                  ? copy.imageSelection.privacyNoticeAnalyzing
                  : analysis || analysisError
                    ? copy.imageSelection.privacyNoticeAfterAnalysis
                    : copy.imageSelection.privacyNotice}
              </p>
            </div>
          </section>

          {reportIsReady &&
            selectedImage &&
            analysis &&
            confirmedLocation &&
            address &&
            isReportPreviewOpen && (
              <section
                ref={reportPreviewRef}
                tabIndex={-1}
                className="mt-8 rounded-3xl border border-primary-200 bg-primary-50/50 p-5 outline-none sm:p-8"
                aria-labelledby="pothole-report-preview-heading"
              >
                <div className="flex flex-col gap-4 border-b border-primary-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-caption font-semibold uppercase tracking-wide text-primary-700">
                      {copy.reportPreview.eyebrow}
                    </p>
                    <h2
                      id="pothole-report-preview-heading"
                      className="mt-1 font-heading text-heading-md text-ink"
                    >
                      {copy.reportPreview.heading}
                    </h2>
                    <p className="mt-2 max-w-2xl text-body-sm text-ink-muted">
                      {copy.reportPreview.description}
                    </p>
                  </div>
                  <div className="rounded-xl border border-success/20 bg-white px-4 py-3 text-sm">
                    <p className="font-semibold text-ink">
                      {copy.reportPreview.statusLabel}
                    </p>
                    <p className="mt-1 font-semibold text-success">
                      {copy.reportPreview.readyForReview}
                    </p>
                    <p className="mt-1 font-bold tracking-wide text-danger">
                      {copy.reportPreview.notSubmitted}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                  <section
                    className="rounded-2xl border border-primary-200 bg-white p-4"
                    aria-labelledby="pothole-preview-evidence-heading"
                  >
                    <h3
                      id="pothole-preview-evidence-heading"
                      className="text-heading-sm font-heading text-ink"
                    >
                      {copy.reportPreview.evidence}
                    </h3>
                    {/* The object URL remains only in this browser session and is never uploaded by the preview. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedImage.previewUrl}
                      alt={copy.imageSelection.previewAlt}
                      className="mt-3 max-h-72 w-full rounded-xl bg-surface object-contain"
                    />
                  </section>

                  <section
                    className="rounded-2xl border border-primary-200 bg-white p-4"
                    aria-labelledby="pothole-preview-issue-heading"
                  >
                    <h3
                      id="pothole-preview-issue-heading"
                      className="text-heading-sm font-heading text-ink"
                    >
                      {copy.reportPreview.issue}
                    </h3>
                    <p className="mt-3 text-body font-semibold text-ink">
                      {copy.reportPreview.issueType}
                    </p>

                    <h3 className="text-heading-sm mt-6 font-heading text-ink">
                      {copy.reportPreview.aiObservation}
                    </h3>
                    <dl className="mt-3 space-y-2 text-body-sm text-ink-muted">
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-semibold text-ink">
                          {copy.analysis.potholeVisible}:
                        </dt>
                        <dd>
                          {analysis.potholeVisible
                            ? copy.analysis.visible
                            : copy.analysis.notVisible}
                        </dd>
                      </div>
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-semibold text-ink">
                          {copy.analysis.standingWaterVisible}:
                        </dt>
                        <dd>
                          {analysis.standingWaterVisible
                            ? copy.analysis.visible
                            : copy.analysis.notVisible}
                        </dd>
                      </div>
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-semibold text-ink">
                          {copy.analysis.confidence}:
                        </dt>
                        <dd>
                          {new Intl.NumberFormat(language, {
                            style: "percent",
                            maximumFractionDigits: 0,
                          }).format(analysis.confidence)}
                        </dd>
                      </div>
                      {getSeverityLabel(analysis.severity) && (
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="font-semibold text-ink">
                            {copy.analysis.severity}:
                          </dt>
                          <dd>{getSeverityLabel(analysis.severity)}</dd>
                        </div>
                      )}
                    </dl>
                  </section>

                  <section
                    className="rounded-2xl border border-primary-200 bg-white p-4 lg:col-span-2"
                    aria-labelledby="pothole-preview-description-heading"
                  >
                    <h3
                      id="pothole-preview-description-heading"
                      className="text-heading-sm font-heading text-ink"
                    >
                      {copy.analysis.description}
                    </h3>
                    <p className="mt-3 text-body-sm leading-relaxed text-ink-muted">
                      {analysis.description}
                    </p>
                  </section>

                  <section
                    className="rounded-2xl border border-primary-200 bg-white p-4 lg:col-span-2"
                    aria-labelledby="pothole-preview-location-heading"
                  >
                    <h3
                      id="pothole-preview-location-heading"
                      className="text-heading-sm font-heading text-ink"
                    >
                      {copy.reportPreview.location}
                    </h3>
                    <dl className="mt-3 grid gap-4 text-body-sm text-ink-muted sm:grid-cols-2">
                      {confirmedLocation.source === "manual" && userProvidedArea && (
                        <div>
                          <dt className="font-semibold text-ink">
                            {copy.reportPreview.userProvidedArea}
                          </dt>
                          <dd className="mt-1 break-words">{userProvidedArea}</dd>
                        </div>
                      )}
                      <div className="sm:col-span-2">
                        <dt className="font-semibold text-ink">
                          {copy.reportPreview.reverseGeocodedAddress}
                        </dt>
                        <dd className="mt-1 break-words">{address}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-ink">
                          {copy.reportPreview.confirmedCoordinates}
                        </dt>
                        <dd className="mt-1">
                          {formatCoordinate(confirmedLocation.latitude)},{" "}
                          {formatCoordinate(confirmedLocation.longitude)}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-ink">
                          {copy.reportPreview.mapSummary}
                        </dt>
                        <dd className="mt-1">{copy.reportPreview.locationSummary}</dd>
                      </div>
                    </dl>
                    {confirmedLocation.source === "manual" &&
                      userProvidedArea &&
                      !areasAppearConsistent(userProvidedArea, address) && (
                        <p
                          role="status"
                          className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-caption text-amber-950"
                        >
                          {copy.reportPreview.areaMayNotMatch}
                        </p>
                      )}
                  </section>
                </div>

                <aside
                  className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-body-sm text-cyan-950"
                  aria-labelledby="pothole-preview-privacy-heading"
                >
                  <h3
                    id="pothole-preview-privacy-heading"
                    className="text-heading-sm font-heading"
                  >
                    {copy.reportPreview.privacyHeading}
                  </h3>
                  <p className="mt-2 leading-relaxed">
                    {copy.reportPreview.privacyNotice}
                  </p>
                </aside>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => returnToStep(locationHeadingRef)}
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    {copy.reportPreview.editLocation}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => returnToStep(imageHeadingRef)}
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    {copy.reportPreview.editImage}
                  </Button>
                  <Button
                    type="button"
                    disabled
                    aria-describedby="pothole-submission-unavailable"
                  >
                    {copy.reportPreview.continue}
                  </Button>
                </div>
                <p
                  id="pothole-submission-unavailable"
                  className="mt-3 text-caption text-ink-muted"
                >
                  {copy.reportPreview.submissionUnavailable}
                </p>
              </section>
            )}

          <section className="mt-8" aria-labelledby="pothole-workflow-heading">
            <h2
              id="pothole-workflow-heading"
              className="font-heading text-heading-md text-ink"
            >
              {copy.futureWorkflow}
            </h2>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2">
              {copy.steps.map(({ title, description }, index) => {
                const Icon = WORKFLOW_ICONS[index]!;
                return (
                  <li
                    key={title}
                    className="flex gap-3 rounded-2xl border border-border bg-surface p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="flex flex-wrap items-center gap-2 text-body-sm font-semibold text-ink">
                        {index + 1}. {title}
                        <span className="rounded-full border border-primary-200 bg-white px-2 py-0.5 text-caption font-medium text-primary-700">
                          {copy.availableNow}
                        </span>
                      </span>
                      <span className="mt-1 block text-caption leading-relaxed text-ink-muted">
                        {description}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-body-sm text-amber-950">
            {copy.notSubmitted}
          </p>

          <nav className="mt-6 flex flex-wrap gap-3" aria-label={copy.title}>
            <Button asChild variant="secondary">
              <Link href="/assistant">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {copy.backToAssistant}
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/assistant">{copy.cancel}</Link>
            </Button>
          </nav>
        </div>
      </div>
    </section>
  );
}

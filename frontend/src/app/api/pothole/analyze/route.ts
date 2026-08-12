import { NextResponse } from "next/server";

import type { Language } from "@/constants/translations";
import { validateVisualImage, ImageValidationError } from "@/lib/visual-issues/image-validation";
import { getVisualIssueAnalyzer } from "@/lib/visual-issues/provider";
import { VisualIssueAnalyzerError } from "@/lib/visual-issues/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const MULTIPART_OVERHEAD_BYTES = 64 * 1024;

function isLanguage(value: FormDataEntryValue | null): value is Language {
  return value === "en" || value === "hi";
}

function getRequestImage(formData: FormData): File | undefined {
  const entries = Array.from(formData.entries());
  if (entries.length !== 2 || entries.some(([key]) => key !== "image" && key !== "language")) return undefined;
  const images = formData.getAll("image");
  return images.length === 1 && images[0] instanceof File ? images[0] : undefined;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_SIZE_BYTES + MULTIPART_OVERHEAD_BYTES) {
    return NextResponse.json({ error: "IMAGE_TOO_LARGE" }, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const image = getRequestImage(formData);
  const language = formData.get("language");
  if (!image || !isLanguage(language)) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  let validatedImage;
  try {
    validatedImage = await validateVisualImage(image);
  } catch (error) {
    if (error instanceof ImageValidationError) {
      const status = error.code === "IMAGE_TOO_LARGE" ? 413 : 415;
      return NextResponse.json({ error: error.code }, { status });
    }
    return NextResponse.json({ error: "INVALID_IMAGE" }, { status: 400 });
  }

  try {
    const analysis = await getVisualIssueAnalyzer().analyzeWaterloggedPothole({
      image: validatedImage,
      language,
    });
    return NextResponse.json(analysis);
  } catch (error) {
    if (error instanceof VisualIssueAnalyzerError && error.code === "AI_INVALID_RESPONSE") {
      return NextResponse.json({ error: "AI_INVALID_RESPONSE" }, { status: 502 });
    }
    return NextResponse.json({ error: "AI_PROVIDER_ERROR" }, { status: 502 });
  }
}

import "server-only";

import { validateVisualImageBytes, ImageValidationError } from "@/lib/visual-issues/image-validation";
import { isAllowedKartaViewImageUrl } from "@/lib/city-monitor/kartaview";
import type { CityImageryAsset } from "@/lib/city-monitor/types";
import type { ValidatedVisualImage } from "@/lib/visual-issues/types";

const IMAGE_FETCH_TIMEOUT_MS = 15_000;
const MAX_REMOTE_IMAGE_BYTES = 8 * 1024 * 1024;

export class CityImageRetrievalError extends Error {
  constructor(
    public readonly code: "INVALID_IMAGE_URL" | "IMAGE_DOWNLOAD_FAILED" | "IMAGE_TOO_LARGE" | "UNSUPPORTED_IMAGE" | "INVALID_IMAGE"
  ) {
    super("The city-monitor image could not be safely retrieved.");
    this.name = "CityImageRetrievalError";
  }
}

async function readLimitedBody(response: Response): Promise<Uint8Array> {
  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REMOTE_IMAGE_BYTES) {
    throw new CityImageRetrievalError("IMAGE_TOO_LARGE");
  }

  const reader = response.body?.getReader();
  if (!reader) throw new CityImageRetrievalError("IMAGE_DOWNLOAD_FAILED");

  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > MAX_REMOTE_IMAGE_BYTES) {
        await reader.cancel();
        throw new CityImageRetrievalError("IMAGE_TOO_LARGE");
      }
      chunks.push(value);
    }
  } catch (error) {
    if (error instanceof CityImageRetrievalError) throw error;
    throw new CityImageRetrievalError("IMAGE_DOWNLOAD_FAILED");
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

export async function fetchAndValidateCityImage(asset: CityImageryAsset): Promise<ValidatedVisualImage> {
  if (!isAllowedKartaViewImageUrl(asset.imageUrl)) {
    throw new CityImageRetrievalError("INVALID_IMAGE_URL");
  }

  let response: Response;
  try {
    response = await fetch(asset.imageUrl, {
      headers: { Accept: "image/jpeg,image/png" },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(IMAGE_FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new CityImageRetrievalError("IMAGE_DOWNLOAD_FAILED");
    }
    throw new CityImageRetrievalError("IMAGE_DOWNLOAD_FAILED");
  }

  if (!response.ok) throw new CityImageRetrievalError("IMAGE_DOWNLOAD_FAILED");
  const contentType = response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (contentType && contentType !== "image/jpeg" && contentType !== "image/png") {
    throw new CityImageRetrievalError("UNSUPPORTED_IMAGE");
  }

  let bytes: Uint8Array;
  try {
    bytes = await readLimitedBody(response);
  } catch (error) {
    if (error instanceof CityImageRetrievalError) throw error;
    throw new CityImageRetrievalError("IMAGE_DOWNLOAD_FAILED");
  }

  try {
    return await validateVisualImageBytes(bytes);
  } catch (error) {
    if (error instanceof ImageValidationError) {
      if (error.code === "IMAGE_TOO_LARGE") throw new CityImageRetrievalError("IMAGE_TOO_LARGE");
      if (error.code === "UNSUPPORTED_IMAGE") throw new CityImageRetrievalError("UNSUPPORTED_IMAGE");
    }
    throw new CityImageRetrievalError("INVALID_IMAGE");
  }
}

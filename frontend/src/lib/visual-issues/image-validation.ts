import "server-only";

import sharp from "sharp";

import type { ValidatedVisualImage } from "@/lib/visual-issues/types";

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 8_000;
const MAX_IMAGE_PIXELS = 24_000_000;

type SupportedMimeType = ValidatedVisualImage["mimeType"];

export class ImageValidationError extends Error {
  constructor(public readonly code: "UNSUPPORTED_IMAGE" | "IMAGE_TOO_LARGE" | "INVALID_IMAGE") {
    super(code);
    this.name = "ImageValidationError";
  }
}

function hasBytes(bytes: Uint8Array, offset: number, values: number[]): boolean {
  return values.every((value, index) => bytes[offset + index] === value);
}

/** Client-provided MIME data is never trusted; require a supported file signature first. */
function getMimeType(bytes: Uint8Array): SupportedMimeType | undefined {
  if (hasBytes(bytes, 0, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (hasBytes(bytes, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (hasBytes(bytes, 0, [0x52, 0x49, 0x46, 0x46]) && hasBytes(bytes, 8, [0x57, 0x45, 0x42, 0x50])) {
    return "image/webp";
  }
  return undefined;
}

function assertSaneDimensions(width: number | undefined, height: number | undefined) {
  if (
    !width ||
    !height ||
    width > MAX_IMAGE_DIMENSION ||
    height > MAX_IMAGE_DIMENSION ||
    width * height > MAX_IMAGE_PIXELS
  ) {
    throw new ImageValidationError("INVALID_IMAGE");
  }
}

function createProcessor(bytes: Uint8Array) {
  return sharp(Buffer.from(bytes), {
    animated: false,
    failOn: "error",
    limitInputPixels: MAX_IMAGE_PIXELS,
    pages: 1,
  });
}

async function sanitizeImage(bytes: Uint8Array, mimeType: SupportedMimeType): Promise<ValidatedVisualImage> {
  try {
    const input = createProcessor(bytes);
    const metadata = await input.metadata();
    assertSaneDimensions(metadata.width, metadata.height);

    const expectedFormat = mimeType === "image/jpeg" ? "jpeg" : mimeType.slice("image/".length);
    if (metadata.format !== expectedFormat) throw new ImageValidationError("INVALID_IMAGE");

    // Re-encoding after a complete decode removes EXIF/XMP/IPTC/ICC metadata and any trailing input data.
    const { data, info } = await input.rotate().toFormat(expectedFormat).toBuffer({ resolveWithObject: true });
    assertSaneDimensions(info.width, info.height);
    if (info.format !== expectedFormat) throw new ImageValidationError("INVALID_IMAGE");

    const sanitizedMetadata = await createProcessor(data).metadata();
    assertSaneDimensions(sanitizedMetadata.width, sanitizedMetadata.height);
    if (
      sanitizedMetadata.format !== expectedFormat ||
      sanitizedMetadata.exif ||
      sanitizedMetadata.xmp ||
      sanitizedMetadata.iptc ||
      sanitizedMetadata.icc
    ) {
      throw new ImageValidationError("INVALID_IMAGE");
    }

    // Fully decode the exact sanitized bytes that will be sent to the provider.
    await createProcessor(data).raw().toBuffer();

    return { mimeType, bytes: new Uint8Array(data), width: info.width, height: info.height };
  } catch (error) {
    if (error instanceof ImageValidationError) throw error;
    throw new ImageValidationError("INVALID_IMAGE");
  }
}

/**
 * Validates a supported signature, fully decodes it, produces metadata-free
 * canonical bytes, then fully decodes those exact output bytes before use.
 */
export async function validateVisualImage(file: File): Promise<ValidatedVisualImage> {
  if (file.size > MAX_IMAGE_SIZE_BYTES) throw new ImageValidationError("IMAGE_TOO_LARGE");
  if (file.size === 0) throw new ImageValidationError("INVALID_IMAGE");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mimeType = getMimeType(bytes);
  if (!mimeType) throw new ImageValidationError("UNSUPPORTED_IMAGE");

  return sanitizeImage(bytes, mimeType);
}

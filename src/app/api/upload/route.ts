import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json(
      { error: "Filename is required" },
      { status: 400 }
    );
  }

  // --- MIME type validation ---
  const contentType = request.headers.get("content-type") || "";
  if (!ALLOWED_MIME_TYPES.has(contentType)) {
    // Fallback: infer from extension
    const ext = filename.split(".").pop()?.toLowerCase();
    const extToMime: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };
    if (!ext || !extToMime[ext] || !ALLOWED_MIME_TYPES.has(extToMime[ext])) {
      return NextResponse.json(
        { error: "Sadece JPEG, PNG ve WebP dosyaları yüklenebilir." },
        { status: 400 }
      );
    }
  }

  // --- File size validation ---
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Dosya boyutu 5MB'ı aşamaz." },
      { status: 413 }
    );
  }

  // --- Generate a unique filename to prevent overwrites ---
  const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = `${randomUUID()}.${ext}`;

  try {
    const blob = await put(safeName, request.body as ReadableStream, {
      access: "public",
      contentType: contentType || undefined,
    });
    return NextResponse.json(blob);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ status: "error", message: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ status: "error", message: "API key not configured" }, { status: 500 });
    }

    const bgFormData = new FormData();
    bgFormData.append("image_file", image);
    bgFormData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": apiKey },
      body: bgFormData,
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = errorData?.errors?.[0]?.title || `Remove.bg API error: ${response.status}`;
      return NextResponse.json({ status: "error", message: msg }, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return NextResponse.json({ status: "success", processedImage: base64 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}

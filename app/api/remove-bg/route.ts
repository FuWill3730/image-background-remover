import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

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
      let msg = errorData?.errors?.[0]?.title || `Remove.bg API error: ${response.status}`;
      if (response.status === 402) msg = "API 额度已用完，请前往 remove.bg 充值或等待下月重置";
      if (response.status === 403) msg = "API Key 无效，请检查配置";
      if (response.status === 422) msg = "无法识别图片中的前景主体，请尝试换一张主体更清晰的图片（建议：人像、产品图、动物等）";
      if (response.status === 429) msg = "请求过于频繁，请稍后再试";
      return NextResponse.json({ status: "error", message: msg }, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    return NextResponse.json({ status: "success", processedImage: base64 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}

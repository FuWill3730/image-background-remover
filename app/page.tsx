"use client";

import { useState } from "react";
import ImageUploader from "./components/ImageUploader";

export default function Home() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>("");
  const [resultImage, setResultImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleUpload = async (file: File, preview: string) => {
    setOriginalFile(file);
    setOriginalPreview(preview);
    setResultImage("");
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/remove-bg", { method: "POST", body: formData });
      const data = await res.json();
      if (data.status === "success") {
        setResultImage(`data:image/png;base64,${data.processedImage}`);
      } else {
        setError(data.message || "处理失败，请重试");
      }
    } catch {
      setError("网络错误，请检查连接后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage || !originalFile) return;
    const a = document.createElement("a");
    a.href = resultImage;
    a.download = `removed-bg-${originalFile.name.replace(/\.[^.]+$/, "")}.png`;
    a.click();
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalPreview("");
    setResultImage("");
    setError("");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-200/60 to-indigo-300/60 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-purple-200/60 to-pink-300/60 blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-100/30 to-purple-100/30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {/* Header */}
        <header className="text-center mb-14 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/25 mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
            智抠图
          </h1>
          <p className="text-gray-500 mt-4 text-lg max-w-lg mx-auto leading-relaxed">
            AI 智能抠图，一键去除图片背景，生成透明 PNG
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6">
            {[
              { icon: "⚡", text: "秒级处理" },
              { icon: "🎨", text: "JPG / PNG / WebP" },
              { icon: "📦", text: "最大 12MB" },
            ].map((item) => (
              <span
                key={item.text}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-1.5 text-sm text-gray-600 shadow-sm ring-1 ring-gray-900/5"
              >
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </header>

        {/* Upload */}
        {!originalPreview && (
          <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <ImageUploader onUpload={handleUpload} disabled={loading} />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="glass rounded-3xl p-12 text-center shadow-xl animate-fade-in-up">
            <div className="relative mx-auto mb-6 h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
            </div>
            <p className="text-gray-700 text-lg font-medium">AI 正在处理中...</p>
            <p className="text-gray-400 text-sm mt-2">通常需要 3–10 秒</p>
            <div className="mt-6 h-1.5 w-48 mx-auto rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 animate-fade-in-up rounded-2xl border border-red-200/60 bg-red-50/80 backdrop-blur-sm p-5 flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="flex-1 text-red-700 text-sm font-medium">{error}</p>
            <button
              onClick={handleReset}
              className="flex-shrink-0 text-sm font-semibold text-red-600 hover:text-red-800 underline underline-offset-2 transition-colors"
            >
              重新上传
            </button>
          </div>
        )}

        {/* Result */}
        {originalPreview && !loading && (
          <div className="animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Original */}
              <div className="glass rounded-3xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">原图</p>
                </div>
                <div className="overflow-hidden rounded-2xl bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={originalPreview} alt="原图" className="w-full object-contain max-h-80" />
                </div>
              </div>

              {/* Result */}
              <div className="glass rounded-3xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">去背景结果</p>
                </div>
                {resultImage ? (
                  <div className="overflow-hidden rounded-2xl checkerboard">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={resultImage} alt="结果图" className="w-full object-contain max-h-80" />
                  </div>
                ) : (
                  <div className="w-full h-56 rounded-2xl bg-gray-50/50 flex flex-col items-center justify-center text-gray-300">
                    <svg className="w-10 h-10 mb-2 animate-pulse-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                    </svg>
                    <span className="text-sm">等待处理...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-10 justify-center items-center">
              {resultImage && (
                <button
                  onClick={handleDownload}
                  className="group relative inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载透明 PNG
                </button>
              )}
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-8 py-3.5 font-semibold text-gray-700 shadow-sm ring-1 ring-gray-900/5 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重新上传
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-20 pb-6">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-300" />
            智抠图
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-300" />
          </div>
          <p className="text-xs text-gray-300 mt-1">免费 AI 在线抠图工具</p>
        </footer>
      </div>
    </main>
  );
}

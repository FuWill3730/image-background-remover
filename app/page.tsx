"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import ImageUploader from "./components/ImageUploader";
import UserDropdown from "./components/UserDropdown";

export default function Home() {
  const { data: session, status } = useSession();
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
          {status === "authenticated" && session?.user && (
            <div className="absolute top-6 right-6">
              <UserDropdown />
            </div>
          )}
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
        {status === "loading" && (
          <div className="glass rounded-3xl p-12 text-center shadow-xl">
            <div className="animate-pulse text-gray-400">加载中...</div>
          </div>
        )}
        
        {status === "unauthenticated" && (
          <div className="glass rounded-3xl p-12 text-center shadow-xl animate-fade-in-up">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">登录以使用抠图功能</h2>
            <p className="text-gray-500 mb-8">使用 Google 账号快速登录</p>
            <button
              onClick={() => signIn("google")}
              className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-3.5 font-semibold text-gray-700 shadow-lg ring-1 ring-gray-900/5 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              使用 Google 登录
            </button>
          </div>
        )}

        {status === "authenticated" && !originalPreview && (
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

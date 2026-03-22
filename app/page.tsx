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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-5 shadow-lg">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Image Background Remover</h1>
          <p className="text-gray-500 mt-3 text-lg">免费在线AI抠图，一键去除图片背景，下载透明PNG</p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">✓ 免费使用</span>
            <span className="flex items-center gap-1">✓ 支持JPG/PNG/WebP</span>
            <span className="flex items-center gap-1">✓ 最大12MB</span>
          </div>
        </div>

        {/* Upload */}
        {!originalPreview && (
          <ImageUploader onUpload={handleUpload} disabled={loading} />
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-5" />
            <p className="text-gray-500 text-lg">AI正在处理中，请稍候...</p>
            <p className="text-gray-400 text-sm mt-1">通常需要3-10秒</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={handleReset} className="ml-4 underline text-red-500 hover:text-red-700 whitespace-nowrap">重新上传</button>
          </div>
        )}

        {/* Result */}
        {originalPreview && !loading && (
          <div className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">原图</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalPreview} alt="原图" className="w-full rounded-xl object-contain max-h-72" />
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">去背景结果</p>
                {resultImage ? (
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23f3f4f6'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23f3f4f6'/%3E%3C/svg%3E\")", backgroundSize: "20px 20px" }} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={resultImage} alt="结果图" className="relative w-full rounded-xl object-contain max-h-72" />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 text-sm">
                    等待处理...
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8 justify-center">
              {resultImage && (
                <button
                  onClick={handleDownload}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载透明PNG
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"
              >
                重新上传
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400 text-sm">
          <p>Image Background Remover &mdash; 免费AI在线抠图工具</p>
        </div>
      </div>
    </main>
  );
}

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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">图片背景去除</h1>
          <p className="text-gray-500 mt-2">上传图片，自动去除背景，下载透明 PNG</p>
        </div>

        {/* Upload */}
        {!originalPreview && (
          <ImageUploader onUpload={handleUpload} disabled={loading} />
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500">正在处理中，请稍候...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
            <button onClick={handleReset} className="ml-4 underline text-red-500 hover:text-red-700">重新上传</button>
          </div>
        )}

        {/* Result */}
        {originalPreview && !loading && (
          <div className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">原图</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalPreview} alt="原图" className="w-full rounded-lg object-contain max-h-64" />
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">结果</p>
                {resultImage ? (
                  <div className="relative">
                    <div className="absolute inset-0 rounded-lg"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='8' height='8' fill='%23e5e7eb'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23e5e7eb'/%3E%3C/svg%3E\")", backgroundSize: "16px 16px" }} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={resultImage} alt="结果图" className="relative w-full rounded-lg object-contain max-h-64" />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 text-sm">
                    等待处理...
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 justify-center">
              {resultImage && (
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载 PNG
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                重新上传
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

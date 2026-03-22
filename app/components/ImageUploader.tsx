"use client";

import { useCallback, useState } from "react";

interface ImageUploaderProps {
  onUpload: (file: File, preview: string) => void;
  disabled?: boolean;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 12 * 1024 * 1024;

export default function ImageUploader({ onUpload, disabled }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED.includes(file.type)) {
        alert("仅支持 JPG、PNG、WebP 格式");
        return;
      }
      if (file.size > MAX_SIZE) {
        alert("文件大小不能超过 12MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => onUpload(file, e.target?.result as string);
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <label
      className={`group relative flex flex-col items-center justify-center w-full rounded-3xl cursor-pointer transition-all duration-300
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${dragging
          ? "glass border-2 border-indigo-400 shadow-xl shadow-indigo-500/10 scale-[1.01]"
          : "glass border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:scale-[1.005]"
        }`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <div className="flex flex-col items-center py-14 sm:py-20 px-6">
        {/* Icon container */}
        <div className={`mb-5 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300
          ${dragging
            ? "bg-indigo-100 scale-110 rotate-3"
            : "bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-indigo-50 group-hover:to-purple-50 group-hover:scale-105"
          }`}>
          <svg
            className={`h-10 w-10 transition-all duration-300 ${dragging ? "text-indigo-500 -translate-y-1" : "text-gray-400 group-hover:text-indigo-400"}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <p className="text-base text-gray-600 mb-1.5">
          <span className="font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
            点击上传
          </span>
          &nbsp;或拖拽图片到此处
        </p>
        <p className="text-sm text-gray-400">
          支持 JPG、PNG、WebP 格式，最大 12MB
        </p>

        {/* Decorative dots */}
        <div className="mt-6 flex items-center gap-1.5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-1 w-1 rounded-full bg-gray-300 group-hover:bg-indigo-300 transition-colors"
              style={{ transitionDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      </div>

      <input
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={onInputChange}
        disabled={disabled}
      />
    </label>
  );
}

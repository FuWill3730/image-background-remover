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
      className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-colors
        ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
      <p className="text-sm text-gray-500">
        <span className="font-medium text-blue-600">点击上传</span> 或拖拽图片到此处
      </p>
      <p className="text-xs text-gray-400 mt-1">JPG、PNG、WebP，最大 12MB</p>
      <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp" onChange={onInputChange} disabled={disabled} />
    </label>
  );
}

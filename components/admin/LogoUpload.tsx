"use client";

import { useState } from "react";
import Image from "next/image";

interface LogoUploadProps {
  currentLogoUrl?: string;
  onLogoUploaded: (url: string) => void;
}

export default function LogoUpload({
  currentLogoUrl,
  onLogoUploaded,
}: LogoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentLogoUrl || "");
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to Vercel Blob
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/logo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const { url } = await response.json();
      setPreviewUrl(url);
      onLogoUploaded(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload logo");
      setPreviewUrl(currentLogoUrl || "");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Client/Prospect Logo
        </label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <p className="mt-2 text-sm text-gray-500">
          Upload a logo for the client/prospect. Accepts PNG, JPG, SVG, or WebP.
        </p>
      </div>

      {previewUrl && (
        <div className="relative w-48 h-32 border rounded-lg overflow-hidden bg-gray-50">
          <Image
            src={previewUrl}
            alt="Logo preview"
            fill
            className="object-contain p-2"
          />
          {uploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-sm text-gray-600">Uploading...</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

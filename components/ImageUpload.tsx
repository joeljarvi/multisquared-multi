// components/MediaUpload.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface MediaUploadProps {
  onUpload: (urls: string[]) => void;
}

export default function MediaUpload({ onUpload }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith("video/");
      const uploadPreset = isVideo ? "multi2-videos" : "multi2-images"; // your Cloudinary unsigned presets
      const endpoint = isVideo ? "video" : "image";

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/de7cgxyxb/${endpoint}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        if (data.secure_url) urls.push(data.secure_url);
      } catch (error) {
        console.error("Error uploading media:", error);
      }
    }

    setUploading(false);
    setUploadedUrls((prev) => [...prev, ...urls]);
    onUpload(urls);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      <div className="flex gap-2 flex-wrap mt-2">
        {uploadedUrls.map((url) => {
          const key = url.split("/").pop() ?? url;
          const isVideo = url.match(/\.(mp4|mov|webm|ogg)$/i);

          return isVideo ? (
            <video
              key={key}
              src={url}
              controls
              className="w-48 h-32 rounded object-cover"
            />
          ) : (
            <div key={key} className="relative w-24 h-24">
              <Image
                src={url}
                alt="Uploaded"
                fill
                style={{ objectFit: "cover", borderRadius: "0.5rem" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

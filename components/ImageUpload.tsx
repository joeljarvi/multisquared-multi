// components/ImageUpload.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "multi2-images"); // replace with your unsigned preset

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/de7cgxyxb/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await response.json();
        urls.push(data.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    setUploading(false);
    setUploadedUrls(urls);
    onUpload(urls);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      <div className="flex gap-2 flex-wrap mt-2">
        {uploadedUrls.map((url) => {
          const key = url.split("/").pop() ?? url;
          return (
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

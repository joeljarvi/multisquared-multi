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
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "multi2-images");
      formData.append("resource_type", "auto"); // let Cloudinary handle video/image automatically

      const resourceType = file.type.startsWith("video/") ? "video" : "image";

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/de7cgxyxb/${resourceType}/upload`,
          { method: "POST", body: formData }
        );

        if (!response.ok) {
          const err = await response.text();
          console.error("Cloudinary error:", err);
          throw new Error(`Upload failed for ${file.name}`);
        }

        const data = await response.json();
        urls.push(data.secure_url);
      } catch (error) {
        console.error("Error uploading media:", error);
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
        accept="image/*,video/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}

      <div className="flex gap-2 flex-wrap mt-2">
        {uploadedUrls.map((url) => {
          const isVideo = url.match(/\.mp4|\.mov|\.webm|\/video\/upload/i);
          const key = url.split("/").pop() ?? url;

          return (
            <div
              key={key}
              className="relative w-24 h-24 rounded overflow-hidden bg-gray-100"
            >
              {isVideo ? (
                <video
                  src={url}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <Image
                  src={url}
                  alt="Uploaded media"
                  fill
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

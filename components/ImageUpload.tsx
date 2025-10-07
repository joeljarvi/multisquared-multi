"use client";

import { useState } from "react";
import Image from "next/image";
import { Cloudinary as CloudinaryCore } from "cloudinary-core";

// Initialize Cloudinary
const cloudinary = new CloudinaryCore({
  cloud_name: "de7cgxyxb",
  secure: true,
});

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
      formData.append("upload_preset", "multi2-images"); // Replace with your unsigned preset

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/de7cgxyxb/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await response.json();

        // Generate optimized Cloudinary URL
        const optimizedUrl = cloudinary.url(data.public_id, {
          crop: "fill",
          format: "auto",
          quality: "auto",
        });

        urls.push(optimizedUrl);
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
        className="mb-2"
      />
      {uploading && <p>Uploading...</p>}

      <div className="flex flex-wrap gap-2 mt-2">
        {uploadedUrls.map((url) => (
          <div
            key={url}
            className="relative w-24 sm:w-32 md:w-40 lg:w-48 h-24 sm:h-32 md:h-40 lg:h-48 rounded overflow-hidden"
          >
            <Image
              src={url}
              alt="Uploaded image"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 640px) 6rem, (max-width: 768px) 8rem, (max-width: 1024px) 10rem, 12rem"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

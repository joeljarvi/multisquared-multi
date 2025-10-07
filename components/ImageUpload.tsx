"use client";

import { useState } from "react";

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
      formData.append("upload_preset", "multi2-images"); // IMPORTANT: Replace with your unsigned upload preset

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/de7cgxyxb/image/upload`,
          {
            method: "POST",
            body: formData,
          }
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
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      <div>
        {uploadedUrls.map((url) => (
          <img
            key={url}
            src={url}
            alt="Uploaded image"
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
        ))}
      </div>
    </div>
  );
}

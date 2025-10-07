// components/CaseImages.tsx
"use client";

import Image from "next/image";

interface CaseImagesProps {
  images: string[];
}

export default function CaseImages({ images }: CaseImagesProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      {images.map((url) => {
        const key = url.split("/").pop() ?? url; // unique key
        return (
          <div key={key} className="relative w-36 h-36">
            <Image
              src={url}
              alt="Case image"
              fill
              style={{ objectFit: "cover", borderRadius: "0.5rem" }}
            />
          </div>
        );
      })}
    </div>
  );
}

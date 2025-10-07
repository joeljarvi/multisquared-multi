"use client";

import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

interface CaseImagesProps {
  images: string[];
}

const cld = new Cloudinary({ cloud: { cloudName: "de7cgxyxb" } });

export default function CaseImages({ images }: CaseImagesProps) {
  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {images.map((imageUrl) => {
        const imageId = imageUrl.split("/").pop()?.split(".")[0];
        if (!imageId) return null;
        const img = cld.image(imageId);
        return <AdvancedImage key={imageId} cldImg={img} style={{ width: 150, height: 150, objectFit: "cover" }} />;
      })}
    </div>
  );
}
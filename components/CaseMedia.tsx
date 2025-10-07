// src/components/CaseMedia.tsx
"use client";

import Image from "next/image";
import { useRef } from "react";

export default function CaseMedia({
  src,
  title,
  aspect = "video", // "video" or "square"
  priority = false,
  autoplay = false, // ⬅️ optional, false by default
  hoverPlay = false, // ⬅️ enables play on hover
}: {
  src?: string | null;
  title?: string | null;
  aspect?: "video" | "square";
  priority?: boolean;
  autoplay?: boolean; // ⬅️ optional, false by default
  hoverPlay?: boolean; // ⬅️ enables play on hover
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  if (!src) {
    return (
      <div
        className={`bg-gray-200 w-full ${
          aspect === "square" ? "aspect-square" : "aspect-video"
        } rounded`}
      />
    );
  }

  const isVideo = src.match(/\.(mp4|mov|webm)$/i);

  const handleMouseEnter = () => {
    if (hoverPlay && videoRef.current) videoRef.current.play();
  };

  const handleMouseLeave = () => {
    if (hoverPlay && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden max-h-screen ${
        aspect === "square" ? "aspect-square" : "aspect-video"
      }`}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          autoPlay={autoplay}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      ) : (
        <Image
          src={src}
          alt={title || "Case media"}
          fill
          className="object-cover"
          priority={priority}
        />
      )}
    </div>
  );
}

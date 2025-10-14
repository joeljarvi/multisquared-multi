"use client";

import Image from "next/image";
import DrawMulti2Grid from "./DrawMulti2Grid";

import { useState, useEffect } from "react";

export default function HeroPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min(window.scrollY / maxScroll, 1));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // image fades in slightly after scroll starts
  const imageOpacity = Math.max((scrollProgress - 0.05) * 10, 0);

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/de7cgxyxb/image/upload/v1759906853/oalxsojbpf0jgbhcqizp.jpg"
          alt="Jureskog"
          fill
          priority
          className="object-cover w-full h-full transition-opacity duration-700 ease-out"
          style={{ opacity: imageOpacity }}
        />
      </div>

      <div className="absolute inset-0 z-10">
        <DrawMulti2Grid scrollProgress={scrollProgress} />
      </div>
    </section>
  );
}

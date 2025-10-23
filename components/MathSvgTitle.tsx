"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const WORD = "MULTISQUARED";
const M2 = "M2";
const bgColors = [
  "bg-neutral-500",
  "bg-neutral-600",
  "bg-neutral-700",
  "bg-neutral-800",
  "bg-neutral-900",
];

export default function MathSvgTitle() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.7, once: true });

  const [showM2, setShowM2] = useState(true);
  const [cells, setCells] = useState<string[]>([]);
  const [cellBgClasses, setCellBgClasses] = useState<string[]>([]);

  const TOTAL_CELLS = 12;

  function generateRandomBgClasses() {
    return Array.from({ length: TOTAL_CELLS }, () => {
      const randomIndex = Math.floor(Math.random() * bgColors.length);
      return bgColors[randomIndex];
    });
  }

  useEffect(() => {
    if (!isInView) return;

    setCells(Array(TOTAL_CELLS).fill(M2));
    setCellBgClasses(generateRandomBgClasses());
    setShowM2(true);

    const interval = setInterval(() => {
      setShowM2((prev) => !prev);
      setCellBgClasses(generateRandomBgClasses());
    }, 4000);

    return () => clearInterval(interval);
  }, [isInView]);

  useEffect(() => {
    if (showM2) {
      setCells(Array(TOTAL_CELLS).fill(M2));
    } else {
      setCells([
        ...WORD.split(""),
        ...Array(TOTAL_CELLS - WORD.length).fill(""),
      ]);
    }
  }, [showM2]);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen flex items-center justify-center"
    >
      <motion.div
        key={showM2 ? "m2" : "word"}
        className="grid w-full h-full max-w-screen max-h-screen
          grid-cols-3 grid-rows-4 lg:grid-cols-4 lg:grid-rows-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        style={{ gap: "0" }}
      >
        {cells.map((_, i) => (
          <div
            key={i}
            className={`flex items-center justify-center ${cellBgClasses[i]}`}
          ></div>
        ))}
      </motion.div>
    </div>
  );
}

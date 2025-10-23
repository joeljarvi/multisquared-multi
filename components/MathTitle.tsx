"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const WORD = "MULTISQUARED";

const bgColors = [
  "bg-neutral-600",
  "bg-neutral-700",
  "bg-neutral-800",
  "bg-neutral-900",
];

export default function MathTitle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.7, once: true });

  const [cellBgClasses, setCellBgClasses] = useState<string[]>([]);

  const layoutDesktop = [4, 5, 6];
  const layoutMobile = [3, 5, 3];

  // Pick which layout to use
  const [layout, setLayout] = useState<number[]>(layoutMobile);

  useEffect(() => {
    function updateLayout() {
      setLayout(window.innerWidth >= 1024 ? layoutDesktop : layoutMobile);
    }
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Total cells = sum of all row lengths
  const TOTAL_CELLS = layout.reduce((a, b) => a + b, 0);

  useEffect(() => {
    setCellBgClasses(
      Array.from({ length: TOTAL_CELLS }, () => {
        const idx = Math.floor(Math.random() * bgColors.length);
        return bgColors[idx];
      })
    );
  }, [layout]);

  // Split WORD across cells
  const filledCells = WORD.split("");
  const cells = [
    ...filledCells,
    ...Array(Math.max(TOTAL_CELLS - filledCells.length, 0)).fill(""),
  ];

  // Break into rows
  const rows: string[][] = [];
  let index = 0;
  layout.forEach((cols) => {
    rows.push(cells.slice(index, index + cols));
    index += cols;
  });

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen flex flex-col justify-center items-center overflow-hidden bg-black"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col gap-1 w-full max-w-6xl"
      >
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`grid w-full ${
              rowIndex === 0
                ? "grid-cols-3 lg:grid-cols-4"
                : rowIndex === 1
                ? "grid-cols-5"
                : "grid-cols-3 lg:grid-cols-6"
            }`}
          >
            {row.map((char, i) => (
              <motion.div
                key={i}
                className={`aspect-square flex items-center justify-center ${
                  cellBgClasses[rowIndex * 10 + i]
                } text-white font-monumentBold text-base leading-none tracking-tighter`}
              >
                {char}
              </motion.div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

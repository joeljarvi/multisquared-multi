"use client";

import { useState, useEffect } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import { motion } from "framer-motion";

export default function ScrollGradientGrid() {
  const { width, height } = useWindowSize();
  const [scrollY, setScrollY] = useState(0);

  const word = ["M", "U", "L", "T", "I", "S", "Q", "U", "A", "R", "E", "D"];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalRows = width >= 1024 ? 12 : 24;
  const topCols = 2;
  const bottomStartCols = 6;
  const bottomEndCols = 12;
  const maxScroll = 1000;

  const rowHeight = height / totalRows;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const scrollT = Math.min(scrollY / maxScroll, 1);

  return (
    <section
      style={{ height: `${maxScroll + height}px`, position: "relative" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 flex flex-col bg-white gap-0.5 p-0.5">
          {Array.from({ length: totalRows }).map((_, rowIndex) => {
            const rowT = rowIndex / (totalRows - 1);
            const startCols = lerp(topCols, bottomStartCols, rowT);
            const endCols = lerp(topCols, bottomEndCols, rowT);
            const colsFloat = lerp(startCols, endCols, scrollT);
            const cols = Math.round(colsFloat);
            const cellWidth = width / cols;

            return (
              <div
                key={rowIndex}
                className="gap-0.5 bg-white"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${cols}, ${cellWidth}px)`,
                  height: `${rowHeight}px`,
                }}
              >
                {Array.from({ length: cols }).map((_, i) => {
                  return (
                    <div
                      key={i}
                      className={`bg-black  p-2 flex items-center justify-start rounded `}
                      style={{
                        width: cellWidth,
                        height: rowHeight,
                      }}
                    >
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                        }}
                        transition={{ duration: 1 }}
                        className="text-white text-xs font-monument"
                      >
                        {word[(i + rowIndex) % word.length]}
                      </motion.p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

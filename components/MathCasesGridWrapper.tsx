"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWindowSize } from "@/hooks/useWindowSize";

interface MathCasesGridWrapperProps {
  items: React.ReactNode[];
  minCellSize?: number;
  staggerDelay?: number;
}

export default function MathCasesGridWrapper({
  items,
  minCellSize = 250,
  staggerDelay = 25,
}: MathCasesGridWrapperProps) {
  const [cells, setCells] = useState(
    items.map((_, i) => ({ id: i, visible: false }))
  );
  const [cols, setCols] = useState(1);

  const { width } = useWindowSize();

  useEffect(() => {
    if (!width) return;

    const cols = Math.floor(width / minCellSize) || 1;
    setCols(cols);

    const allIndices = [...Array(cells.length).keys()];
    for (let i = allIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
    }

    const timers: NodeJS.Timeout[] = [];
    allIndices.forEach((idx, i) => {
      const t = setTimeout(() => {
        setCells((prev) => {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], visible: true };
          return updated;
        });
      }, i * staggerDelay);
      timers.push(t);
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [width, items.length, staggerDelay, cells.length]);

  return (
    <div className="w-full flex flex-wrap relative">
      {cells.map((cell, i) => (
        <motion.div
          key={cell.id}
          className="p-1"
          style={{
            width: `${100 / cols}%`,
            aspectRatio: "1 / 1",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: cell.visible ? 1 : 1 }}
          transition={{ duration: 0.5 }}
        >
          {items[i]}
        </motion.div>
      ))}
    </div>
  );
}

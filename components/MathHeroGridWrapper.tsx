"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GridTextContent, type Cell } from "@/app/utils/GridTextContent";
import { useWindowSize } from "@/hooks/useWindowSize";

interface MathHeroGridWrapperProps {
  fixedText?: { idx: number; char: string }[];
  word?: string[];
  minCellSize?: number;
  staggerDelay?: number;
}

export default function MathHeroGridWrapper({
  fixedText = [],
  word = [],
  minCellSize = 80,
  staggerDelay = 20,
}: MathHeroGridWrapperProps) {
  const [cells, setCells] = useState<Cell[]>([]);
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);

  const { width, height } = useWindowSize();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, height ?? 1], [1, 0]);

  useEffect(() => {
    if (!width || !height) return;
    if (cells.length > 0) return;

    const cols = Math.floor(width / minCellSize);
    const rows = Math.floor(height / minCellSize);
    setCols(cols);
    setRows(rows);

    const newCells = GridTextContent({ cols, rows, fixedText, word });
    setCells(newCells);

    const allIndices = [...Array(newCells.length).keys()];
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
  }, [width, height, fixedText, word, minCellSize, staggerDelay, cells.length]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-wrap font-monumentBold"
      style={{ opacity }}
    >
      {cells.map((cell) => (
        <motion.div
          key={cell.id}
          className="flex items-center justify-center p-1"
          style={{
            width: `${100 / cols}%`,
            height: `${100 / rows}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: cell.visible ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <span
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: cell.isWord ? "white" : "black",
              color: cell.isWord ? "black" : "white",
            }}
          >
            {cell.char}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

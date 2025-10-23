"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useWindowSize } from "@/hooks/useWindowSize";

interface Cell {
  id: number;
  char: string;
  isFixed?: boolean;
  isWord?: boolean;
  visible?: boolean;
  delay?: number;
  drawn?: boolean;
}

export default function MathHeroPage({
  minCellSize = 80,
}: {
  minCellSize?: number;
}) {
  const [cells, setCells] = useState<Cell[]>([]);
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [open, setOpen] = useState(true);

  const { width, height } = useWindowSize();
  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const fixedText = useMemo(
    () => [
      { idx: 0, char: "1" },
      { idx: 1, char: "+" },
      { idx: 2, char: "1" },
      { idx: 3, char: "=" },
    ],
    []
  );

  const word = useMemo(
    () => ["M", "U", "L", "T", "I", "S", "Q", "U", "A", "R", "E", "D"],
    []
  );

  const buildGrid = (cols: number, rows: number) => {
    const total = cols * rows;

    // Fixed text placement: always row 0, columns 0 to 3
    const fixedPositions = [0, 1, 2, 3];
    const fixedTextPositions = fixedPositions.map((idx, i) => ({
      idx,
      char: fixedText[i].char,
    }));

    // Function to check if proposed word placement overlaps fixed text
    function overlapsFixed(indices: number[]) {
      return indices.some((index) => fixedPositions.includes(index));
    }

    // Place the word somewhere without overlapping fixed text
    let wordCells: { idx: number; char: string }[] = [];
    const wordLength = word.length;

    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const horizontal = Math.random() < 0.5;

      if (horizontal) {
        // Pick random row, but exclude row 0 to avoid overlap with fixed text
        const row = Math.floor(Math.random() * (rows - 1)) + 1; // 1 to rows-1

        // Pick random startCol to fit word horizontally
        const startCol = Math.floor(Math.random() * (cols - wordLength + 1));

        const proposedIndices = [];
        for (let i = 0; i < wordLength; i++) {
          proposedIndices.push(row * cols + startCol + i);
        }

        if (!overlapsFixed(proposedIndices)) {
          wordCells = proposedIndices.map((idx, i) => ({
            idx,
            char: word[i],
          }));
          break;
        }
      } else {
        // Vertical placement
        // Pick random col excluding fixed text columns (0 to 3)
        const colCandidates = [...Array(cols).keys()].filter((c) => c > 3);
        if (colCandidates.length === 0) break; // no valid column to place vertically without overlap

        const col =
          colCandidates[Math.floor(Math.random() * colCandidates.length)];

        // Pick random startRow to fit word vertically
        const startRow = Math.floor(Math.random() * (rows - wordLength + 1));

        const proposedIndices = [];
        for (let i = 0; i < wordLength; i++) {
          proposedIndices.push((startRow + i) * cols + col);
        }

        if (!overlapsFixed(proposedIndices)) {
          wordCells = proposedIndices.map((idx, i) => ({
            idx,
            char: word[i],
          }));
          break;
        }
      }

      attempts++;
    }

    if (wordCells.length === 0) {
      // Fallback: place word starting at row 1, col 0 horizontally (guaranteed no overlap)
      wordCells = [];
      for (let i = 0; i < wordLength; i++) {
        wordCells.push({
          idx: cols + i,
          char: word[i],
        });
      }
    }

    const newGrid = Array.from({ length: total }, (_, i) => {
      const fixed = fixedTextPositions.find((f) => f.idx === i);
      const wordCell = wordCells.find((w) => w.idx === i);

      return {
        id: i,
        char:
          fixed?.char ??
          wordCell?.char ??
          Math.floor(Math.random() * 10).toString(),
        isFixed: !!fixed,
        isWord: !!wordCell,
        visible: true,
        drawn: !!wordCell,
        delay: Math.random() * 1.5,
      };
    });

    return newGrid;
  };

  // Build grid
  useEffect(() => {
    if (!width || !height) return;

    const cols = Math.floor(width / minCellSize);
    const rows = Math.floor(height / minCellSize);

    setCols(cols);
    setRows(rows);
    setCells(buildGrid(cols, rows));
    setHasLoaded(true);
  }, [width, height, minCellSize]);

  // Scroll behavior
  useEffect(() => {
    const unsubscribe = smoothScroll.onChange((progress) => {
      setCells((prev) =>
        prev.map((cell) => {
          // Draw-in phase: 0% – 30%
          if (
            progress < 0.1 &&
            !cell.visible &&
            !cell.drawn &&
            Math.random() < progress * 0.6
          ) {
            return {
              ...cell,
              visible: true,
              drawn: true,
            };
          }

          // Fade-out phase: > 30%
          if (
            progress >= 0.3 &&
            cell.visible &&
            Math.random() < (progress - 0.3) * 0.4
          ) {
            return {
              ...cell,
              drawn: true,
              visible: false,
            };
          }

          return cell;
        })
      );
    });

    return () => unsubscribe();
  }, [smoothScroll]);

  return (
    <>
      {open && (
        <div className="absolute inset-0 flex flex-wrap font-pixelCode">
          {cells.map((cell) => {
            const isCloseButton = cell.id === cols - 1 && cell.char === "x";

            return (
              <div
                key={cell.id}
                className="flex items-center justify-center transition-all duration-300"
                style={{
                  width: `${100 / cols}%`,
                  height: `${100 / rows}%`,
                  cursor: isCloseButton ? "pointer" : "default",
                }}
                onClick={() => {
                  if (isCloseButton) {
                    setOpen(false);
                  }
                }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: cell.visible ? 1 : 0 }}
                  transition={{
                    duration: 0.5,
                    delay: hasLoaded ? cell.delay : 0,
                  }}
                  className={`w-full h-full flex items-center justify-center text-sm ${
                    cell.isWord ? "bg-white text-black" : "text-white bg-black"
                  }`}
                >
                  {cell.char}
                </motion.span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

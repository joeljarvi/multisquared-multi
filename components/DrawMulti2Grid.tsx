"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Grid {
  cols: number;
  rows: number;
}

interface Cell {
  char: string;
  drawn: boolean;
  fixed?: boolean;
}
const word = ["M", "U", "L", "T", "I", "2"];

export default function DrawMulti2Grid({
  scrollProgress = 0,
}: {
  scrollProgress?: number;
}) {
  const [grid, setGrid] = useState<Grid>({ cols: 0, rows: 0 });
  const [cells, setCells] = useState<Cell[]>([]);
  const [visible, setVisible] = useState(true);

  const isDrawing = useRef(false);

  // --- Initialize grid ---
  useEffect(() => {
    const updateGrid = () => {
      const base = Math.min(window.innerWidth, window.innerHeight);
      const cellSize = base * 0.05; // each cell = 5% of viewport

      const cols = Math.floor(window.innerWidth / cellSize);
      const rows = Math.floor(window.innerHeight / cellSize);
      const total = cols * rows;

      const sequence = Array.from({ length: total }, () =>
        Math.floor(Math.random() * 10).toString()
      );

      const newCells: Cell[] = Array.from({ length: total }, (_, i) => ({
        char: sequence[i],
        drawn: false,
      }));

      // Fixed "1 + 1 ="
      const fixedValues = ["1", "+", "1", "="];
      for (let i = 0; i < fixedValues.length && i < newCells.length; i++) {
        newCells[i] = { char: fixedValues[i], drawn: false, fixed: true };
      }

      // Random pre-drawn MULTI2 letters
      const preDrawCount = 6;
      const totalCells = cols * rows;
      const randomIndices = Array.from({ length: preDrawCount }, () =>
        Math.floor(Math.random() * totalCells)
      );

      randomIndices.forEach((idx, i) => {
        newCells[idx] = { char: word[i % word.length], drawn: true };
      });

      setGrid({ cols, rows });
      setCells(newCells);
    };

    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  const handleDraw = (index: number) => {
    setCells((prev) => {
      const newCells = [...prev];

      // Decide randomly whether to do sequential draw or random splash
      const sequential = Math.random() < 0.2; // 20% chance to draw in sequence

      if (sequential) {
        // Try horizontal first, then vertical
        const directions = [
          Array.from({ length: 6 }, (_, i) => index + i), // horizontal
          Array.from({ length: 6 }, (_, i) => index + i * grid.cols), // vertical
        ];

        for (const dir of directions) {
          // check if all cells are valid
          if (
            dir.every(
              (i) =>
                i >= 0 && i < prev.length && !prev[i].drawn && !prev[i].fixed
            )
          ) {
            dir.forEach((i, j) => {
              newCells[i] = {
                ...newCells[i],
                char: word[j % word.length],
                drawn: true,
              };
            });
            return newCells;
          }
        }
        // fallback to random splash if sequence not possible
      }

      // --- Random splash around cursor ---
      const availableIndices: number[] = [];

      if (!prev[index].drawn && !prev[index].fixed)
        availableIndices.push(index);

      const offsets = [
        -1,
        1,
        -grid.cols,
        grid.cols,
        -grid.cols - 1,
        -grid.cols + 1,
        grid.cols - 1,
        grid.cols + 1,
      ];

      offsets.forEach((offset) => {
        const neighborIdx = index + offset;
        if (
          neighborIdx >= 0 &&
          neighborIdx < prev.length &&
          !prev[neighborIdx].drawn &&
          !prev[neighborIdx].fixed
        ) {
          availableIndices.push(neighborIdx);
        }
      });

      const shuffled = availableIndices.sort(() => Math.random() - 0.5);

      for (let i = 0; i < Math.min(6, shuffled.length); i++) {
        const idx = shuffled[i];
        newCells[idx] = {
          ...newCells[idx],
          char: word[i % word.length],
          drawn: true,
        };
      }

      return newCells;
    });
  };

  const handlePointerDown = (index: number) => {
    isDrawing.current = true;
    handleDraw(index);
  };

  const handlePointerEnter = (index: number) => {
    if (isDrawing.current) handleDraw(index);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  const total = grid.cols * grid.rows;

  return visible ? (
    <div
      className="fixed z-10 flex flex-wrap"
      onPointerUp={handlePointerUp}
      style={{
        userSelect: "none",
      }}
    >
      {cells.slice(0, total).map((cell, i) => {
        const baseBg = cell.drawn ? "white" : "black";

        const mappedOpacity = (() => {
          // fade ranges
          const drawnFadeStart = 0.01;
          const drawnFadeEnd = 0.1;
          const undrawnFadeStart = 0.06;
          const undrawnFadeEnd = 0.2;

          if (cell.drawn) {
            // drawn cells fade first
            if (scrollProgress <= drawnFadeStart) return 1;
            return Math.pow(
              1 -
                Math.min(
                  (scrollProgress - drawnFadeStart) /
                    (drawnFadeEnd - drawnFadeStart),
                  1
                ),
              3
            );
          } else {
            // undrawn cells fade after drawn ones
            if (scrollProgress <= undrawnFadeStart) return 1;
            return Math.pow(
              1 -
                Math.min(
                  (scrollProgress - undrawnFadeStart) /
                    (undrawnFadeEnd - undrawnFadeStart),
                  1
                ),
              3
            );
          }
        })();

        const textColor = cell.drawn ? "black" : "white";
        const isCloseButton = i === grid.cols - 1 && grid.rows > 0;

        const opacity = isCloseButton ? 1 : mappedOpacity;

        return (
          <motion.div
            key={i}
            className={`aspect-square flex items-center justify-center border-none font-monument ${
              isCloseButton ? "cursor-pointer z-20" : "cursor-crosshair"
            }`}
            style={{
              width: `${100 / grid.cols}vw`,
              backgroundColor: isCloseButton ? baseBg : baseBg,
              color: isCloseButton ? textColor : textColor,
              fontSize: "1rem",

              opacity: isCloseButton ? 1 : opacity,
              transition: "opacity 0.15s, transform 0.1s",
            }}
            onPointerDown={() => {
              if (isCloseButton) setVisible(false); // hide grid
              else handlePointerDown(i);
            }}
            onPointerEnter={() => {
              if (!isCloseButton) handlePointerEnter(i);
            }}
            onPointerOver={(e) => {
              if (!isCloseButton && !cells[i].drawn && !cells[i].fixed) {
                (e.currentTarget as HTMLDivElement).style.opacity = "0.6";
                (e.currentTarget as HTMLDivElement).style.transform =
                  "scale(1.05)";
              }
            }}
            onPointerOut={(e) => {
              if (!isCloseButton) {
                (e.currentTarget as HTMLDivElement).style.opacity =
                  opacity.toString();
                (e.currentTarget as HTMLDivElement).style.transform =
                  "scale(1)";
              }
            }}
          >
            {isCloseButton ? "×" : cell.char}
          </motion.div>
        );
      })}
    </div>
  ) : null;
}

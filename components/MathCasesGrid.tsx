"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Case } from "@/app/context/CaseContext";

import Link from "next/link";

interface MathCasesGridProps {
  cases: Case[];
  minCellSize?: number;
  staggerDelay?: number;
}

export default function MathCasesGrid({
  cases,
  minCellSize = 250,
  staggerDelay = 25,
}: MathCasesGridProps) {
  const bgColors = [
    "bg-neutral-500",
    "bg-neutral-600",
    "bg-neutral-700",
    "bg-neutral-800",
    "bg-neutral-900",
  ];
  const hoverColors = [
    "hover:bg-neutral-900",
    "hover:bg-neutral-800",
    "hover:bg-neutral-700",
    "hover:bg-neutral-600",
    "hover:bg-neutral-500",
  ];

  const caseItems = useMemo(
    () =>
      cases.slice(0, 4).map((c, idx) => (
        <div
          key={c.id}
          className={`relative w-full h-full overflow-hidden group rounded-lg  ${
            bgColors[idx % bgColors.length]
          } ${hoverColors[idx % bgColors.length]}`}
        >
          {/* Title always visible */}
          <Link
            href={`/cases/${c.case_slug}`}
            className="absolute inset-0 z-20 flex items-center justify-center px-4 text-center cursor-pointer"
          >
            <h3 className="text-base uppercase font-monumentBold tracking-wider text-white">
              {`M2_CASE_${String(idx + 1).padStart(2, "0")}`}
            </h3>
          </Link>
        </div>
      )),
    [cases, bgColors, hoverColors]
  );

  return (
    <section className="w-full h-screen overflow-hidden relative ">
      <MathCasesGridWrapper
        items={caseItems}
        minCellSize={minCellSize}
        staggerDelay={staggerDelay}
      />
    </section>
  );
}

/* ------------------- MathCasesGridWrapper ------------------- */

interface MathCasesGridWrapperProps {
  items: React.ReactNode[];
  minCellSize?: number;
  staggerDelay?: number;
}

function MathCasesGridWrapper({
  items,
  minCellSize = 250,
  staggerDelay = 25,
}: MathCasesGridWrapperProps) {
  const [cells, setCells] = useState(
    items.map((_, i) => ({ id: i, visible: false }))
  );
  const [cols, setCols] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      const cols = 2;
      setCols(cols);

      const allIndices = [...Array(items.length).keys()];
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
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [items.length, minCellSize, staggerDelay]);

  return (
    <div
      className="w-full h-screen grid relative"
      style={{
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)", // 2 rows → 50vh each
      }}
    >
      {cells.map((cell, i) => (
        <motion.div
          key={cell.id}
          className="col-span-1 row-span-1  w-full h-full"
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

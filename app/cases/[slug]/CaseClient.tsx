"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CaseMedia from "@/components/CaseMedia";
import type { Case } from "@/app/context/CaseContext";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface CaseClientProps {
  allCases: Case[];
}

function CaseNav({
  allCases,
  currentIndex,
}: {
  allCases: Case[];
  currentIndex: number;
}) {
  const router = useRouter();
  return (
    <div className="fixed top-0 z-40 w-screen flex flex-wrap p-0.5 gap-0.5 ">
      {allCases.map((c, i) => {
        const isCurrent = i === currentIndex;
        return (
          <Button key={i} size="sm" variant={isCurrent ? "default" : "ghost"}>
            <Link href={`/cases/${c.case_slug}`}>{c.title}</Link>
          </Button>
        );
      })}
      <Button size="sm" variant="ghost" onClick={() => router.back()}>
        Back
      </Button>
      <Button size="sm" variant="ghost" onClick={() => router.push("/")}>
        Home
      </Button>
    </div>
  );
}

export default function CaseClient({ allCases }: CaseClientProps) {
  const { slug } = useParams();

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    const index = allCases.findIndex((c) => c.case_slug === slug);
    setCurrentIndex(index);
  }, [slug, allCases]);

  useEffect(() => {
    const updateSize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (currentIndex === null) return <p>Loading...</p>;
  if (currentIndex === -1) return <p>Case not found</p>;

  const caseData = allCases[currentIndex];
  const images = caseData?.images || [];
  const heroImage = images[0];

  if (!width || !height) return null;

  // 🪄 Clean category handling
  const categoryWords =
    typeof caseData.category === "string"
      ? caseData.category.replace(/,/g, "").split(" ")
      : Array.isArray(caseData.category)
      ? caseData.category
      : [];

  // 🔢 Example grid logic for media only
  const rows = [1, 2, 3, 4];
  const rowHeight = height / 2;
  const maxScroll = rows.length * rowHeight * 2;

  let mediaCounter = 0;
  console.log(scrollY);

  return (
    <>
      <CaseNav allCases={allCases} currentIndex={currentIndex} />

      {/* 1️⃣ Hero */}
      <section className="relative h-screen w-screen">
        {heroImage && (
          <CaseMedia
            src={heroImage}
            title={caseData.title}
            autoplay
            priority
            className="rounded absolute inset-0 w-full h-full object-cover lg:object-contain"
          />
        )}
      </section>

      {/* 2️⃣ Info section */}
      <section className="w-full  py-24 px-6 lg:px-12 flex flex-col items-start justify-center gap-6 font-monumentMedium min-h-screen">
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap gap-0.5 items-start justify-start w-full"
        >
          {categoryWords.map((word, i) => (
            <Badge
              key={i}
              variant="outline"
              className="mt-3 text-black border-black "
            >
              {word}
            </Badge>
          ))}
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=" leading-snug text-neutral-700 "
        >
          {caseData.description}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=" leading-snug text-neutral-500 "
        >
          {caseData.credits}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=" leading-snug text-neutral-500 "
        >
          {caseData.year}
        </motion.p>
      </section>

      {/* 3️⃣ Media Grid */}
      <section
        style={{
          height: `${maxScroll}px`,
          position: "relative",
          width: "100%",
        }}
      >
        <div className="sticky top-0 h-screen w-full">
          <div className="absolute inset-0 flex flex-col p-0.5 gap-0.5 w-full items-start justify-start ">
            {rows.map((cols, rowIndex) => {
              return (
                <div
                  key={rowIndex}
                  className="gap-0.5 h-[200vh] w-full"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  }}
                >
                  {Array.from({ length: cols }).map((_, i) => {
                    const img = images[mediaCounter++ % images.length];
                    return (
                      <div
                        key={i}
                        className=" overflow-hidden bg-white rounded items-center justify-center w-full h-full"
                        style={{
                          display: "grid",
                          gridTemplateColumns: `repeat(${cols}, 1fr)`,
                          gridTemplateRows: `repeat(${rows}, 1fr)`,
                        }}
                      >
                        {img && (
                          <CaseMedia
                            src={img}
                            title={caseData.title}
                            autoplay
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

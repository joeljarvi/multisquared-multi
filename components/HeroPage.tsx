"use client";

import MathCasesGrid from "./MathCasesGrid";
import { Case } from "@/app/context/CaseContext";

import Link from "next/link";
import ScrollGradientGrid from "./GridTest";

interface HeroPageProps {
  cases: Case[];
}

export default function HeroPage({ cases }: HeroPageProps) {
  return (
    <>
      <div className="relative w-full">
        {/* ------------------- Hero Section ------------------- */}
        <section
          id="hero"
          className="relative w-full"
          style={{ height: "300vh" }}
        >
          {/* Sticky grid container */}
          <div className="sticky top-0 h-screen overflow-hidden z-10">
            <ScrollGradientGrid />
          </div>
        </section>
        <div className="h-screen flex flex-col  items-start justify-start lg:justify-center bg-black text-white font-monumentMedium text-3xl px-12 py-24 tracking-wide">
          <h2 className=" max-w-3xl ">
            MULTI2 is a multi-disciplinary creative agency based in Stockholm.
            Founded in 2025 by multi-talented Adam and Daniel
          </h2>
        </div>

        <section id="cases" className="relative z-10 w-full h-screen ">
          <MathCasesGrid cases={cases} />
        </section>

        <section
          id="contact"
          className="relative z-0 w-full h-screen  flex flex-col items-start justify-start lg:items-start lg:justify-center bg-black px-12 py-24 gap-12 text-6xl  font-monumentMedium text-white tracking-wide leading-tight"
        >
          <h2 className="max-w-3xl">Talk to us about your next project!</h2>
          <div className="flex flex-col gap-0">
            <span className=" space-x-4 w-full flex lg:flex-row">
              <h2 className="uppercase">Adam:</h2>
              <Link href="/" className="link">
                070 123 4567
              </Link>
            </span>
            <span className="space-x-4 w-full flex lg:flex-row">
              <h2 className="uppercase">Daniel:</h2>
              <Link href="/" className="link">
                070 123 4567
              </Link>
            </span>
            <span className=" space-x-4 w-full flex lg:flex-row">
              <h2 className="uppercase">Email:</h2>
              <Link href="/" className="link">
                hello@multi2.co
              </Link>
            </span>
          </div>
        </section>
      </div>
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import CaseMedia from "@/components/CaseMedia";
import type { Case } from "@/app/context/CaseContext";

interface CaseClientProps {
  caseData: Case;
  allCases: Case[];
  currentIndex: number;
}

export default function CaseClient({
  caseData,
  allCases,
  currentIndex,
}: CaseClientProps) {
  const router = useRouter();

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + allCases.length) % allCases.length;
    router.push(`/cases/${allCases[prevIndex].case_slug}`);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % allCases.length;
    router.push(`/cases/${allCases[nextIndex].case_slug}`);
  };

  return (
    <div className="flex flex-col items-center justify-start mx-auto">
      <button
        className="z-10 fixed top-4 left-4 right-auto lg:right-4 lg:left-auto px-4 py-2 text-base backdrop-blur-sm bg-gray-50/50 rounded hover:bg-gray-300 transition"
        onClick={() => router.push("/")}
      >
        Back to home
      </button>
      {/* ✅ Server-rendered media (image or video) */}
      <CaseMedia
        src={caseData.images?.[0]}
        title={caseData.title ?? "Case"}
        aspect="video"
        autoplay
      />

      {/* ✅ Case text content */}

      <div className="z-10 fixed bottom-0 left-0 w-full max-w-full lg:max-w-[calc(100vw/3)] p-4 ">
        <div className="flex flex-col items-start justify-start backdrop-blur-sm bg-gray-50/50 p-4 rounded uppercase ">
          <h1 className=" font-bold text-2xl lg:text-3xl  w-full mb-4 lg:mb-2">
            {caseData.title}
          </h1>
          <p className="text-sm font-semibold  w-full mb-4">
            {caseData.client}
          </p>

          <p className="whitespace-pre-line mb-4 ">{caseData.description}</p>
          <p className="whitespace-pre-line  text-sm">{caseData.category}</p>
          <p className="whitespace-pre-line text:sm ">{caseData.year}</p>
        </div>
      </div>

      {caseData.images?.length > 1 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 w-full min-h-screen items-start justify-start">
          {caseData.images.slice(1).map((url, i) => (
            <CaseMedia
              key={i}
              src={url} // ✅ use 'url' here
              alt={`${caseData.title ?? "Case"} ${i + 2}`}
              autoplay
            />
          ))}
        </div>
      )}

      {/* ✅ Navigation */}

      <div className="z-10 fixed top-4 right-4 lg:bottom-4 lg:top-auto flex gap-4">
        <button
          className="px-4 py-2 text-base backdrop-blur-sm bg-gray-50/50 rounded hover:bg-gray-300 transition"
          onClick={handlePrev}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 text-base backdrop-blur-sm bg-gray-50/50 rounded hover:bg-gray-300 transition"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

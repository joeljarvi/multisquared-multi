import type { Case } from "@/app/context/CaseContext";
import Link from "next/link";
import CaseMedia from "./CaseMedia";

interface CasesDisplayProps {
  cases: Case[];
}

export default function CasesDisplay({ cases }: CasesDisplayProps) {
  if (!cases.length) return <p>No cases found</p>;

  return (
    <div className="flex flex-wrap items-start justify-start w-full bg-black">
      {cases.map((c) => {
        const firstMedia = (c.images ?? [])[0]; // Only first image/video

        return (
          <div
            key={c.id}
            className="w-full lg:w-1/2 aspect-video overflow-hidden group"
          >
            <Link
              href={`/cases/${c.case_slug}`}
              className="block relative w-full h-full"
            >
              {/* Media */}
              {firstMedia ? (
                <CaseMedia
                  src={firstMedia}
                  title={c.title ?? "Case media"} // ✅ use 'title' prop
                  hoverPlay
                  aspect="video"
                />
              ) : (
                <div className="bg-gray-200 w-full h-full" />
              )}
              {/* Overlay title */}
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-start justify-start p-4 pointer-events-none">
                <h3 className=" text-left   text-base px-4 py-2  backdrop-blur-sm bg-gray-50/50 rounded hover:bg-gray-300 transition">
                  {c.title}
                </h3>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

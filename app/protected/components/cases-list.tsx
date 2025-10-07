"use client";
import { useCaseContext } from "@/app/context/CaseContext";
import type { Case } from "@/app/context/CaseContext";
import Image from "next/image";

interface CasesListProps {
  serverCases?: Case[]; // initial server-side data
}

export default function CasesList({ serverCases = [] }: CasesListProps) {
  const { cases } = useCaseContext();

  // Merge server + client-added cases
  const allCases = [
    ...serverCases,
    ...cases.filter((c) => !serverCases.find((sc) => sc.id === c.id)),
  ];

  if (!allCases.length) return <p>No cases found</p>;

  return (
    <div className="flex flex-col gap-4">
      {allCases.map((c) => (
        <div key={c.id} className="border p-4 rounded">
          <h3 className="font-bold">{c.title}</h3>
          <p className="text-sm font-semibold">{c.client}</p>
          <p>{c.description}</p>

          {(c.images ?? []).length > 0 && (
            <div className="flex gap-2 overflow-x-auto mt-2">
              {(c.images ?? []).map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt={`Case image ${i + 1}`}
                  width={96} // 24 * 4 (Tailwind w-24)
                  height={96} // same as above
                  className="object-cover rounded"
                  priority={i === 0} // optionally prioritize the first image
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useCaseContext, Case } from "@/app/context/CaseContext";
import Image from "next/image";

interface CaseListProps {
  serverCases?: Case[];
}

export default function CaseList({ serverCases = [] }: CaseListProps) {
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

          {c.images?.length ? (
            <div className="flex gap-2 overflow-x-auto mt-2">
              {(c.images || []).map((url, i) => {
                const isVideo = url.match(
                  /\.mp4|\.mov|\.webm|\/video\/upload/i
                );
                const key = url.split("/").pop() ?? i;
                return (
                  <div
                    key={key}
                    className="relative w-24 h-24 rounded overflow-hidden bg-gray-100"
                  >
                    {isVideo ? (
                      <video
                        src={url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <Image
                        src={url}
                        alt={`Case media ${i}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

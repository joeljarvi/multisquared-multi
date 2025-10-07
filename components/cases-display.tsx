// components/CasesDisplay.tsx
import type { Case } from "@/app/context/CaseContext";
import Image from "next/image";

interface CasesDisplayProps {
  cases: Case[];
}

export default function CasesDisplay({ cases }: CasesDisplayProps) {
  if (!cases.length) return <p>No cases found</p>;

  return (
    <div className="flex flex-wrap gap-4 w-full max-w-xl p-6">
      {cases.map((c) => (
        <div key={c.id} className="border p-4 rounded">
          <h3 className="font-bold">{c.title}</h3>
          <p className="text-sm font-semibold">{c.client}</p>
          <p>{c.description}</p>

          {(c.images ?? []).length > 0 && (
            <div className="flex gap-2 overflow-x-auto mt-2">
              {(c.images ?? []).map((url, i) => {
                const isVideo = url.match(/\.mp4|\.mov|\.webm/i);
                return (
                  <div
                    key={i}
                    className="relative w-24 h-24 rounded overflow-hidden"
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
                        alt={`Case media ${i + 1}`}
                        width={96}
                        height={96}
                        className="object-cover rounded"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

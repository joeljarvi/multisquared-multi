import type { Case } from "@/app/context/CaseContext";

export default function CasesDisplay({ cases }: { cases: Case[] }) {
  if (!cases.length) return <p>No cases found</p>;

  return (
    <div className="flex flex-col gap-4">
      {cases.map((c) => (
        <div key={c.id} className="border p-4 rounded">
          <h3 className="font-bold">{c.title}</h3>
          <p className="text-sm font-semibold">{c.client}</p>
          <p>{c.description}</p>

          {(c.images ?? []).length > 0 && (
            <div className="flex gap-2 overflow-x-auto mt-2">
              {(c.images ?? []).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

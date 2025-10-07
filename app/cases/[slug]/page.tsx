// app/cases/[slug]/page.tsx
import { fetchAllCases } from "@/lib/supabase/server";
import CaseClient from "./CaseClient";
import type { Case } from "@/app/context/CaseContext";

// Let Next.js infer the props
export default async function CasePage({
  params,
}: {
  params: { slug: string }; // keep it typed as normal
}) {
  const cases: Case[] = await fetchAllCases();
  const currentIndex = cases.findIndex((c) => c.case_slug === params.slug);

  if (currentIndex === -1) return <p>Case not found</p>;

  const caseData = cases[currentIndex];

  return (
    <CaseClient
      caseData={caseData}
      allCases={cases}
      currentIndex={currentIndex}
    />
  );
}

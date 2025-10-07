// app/cases/[slug]/page.tsx
import type { Case } from "@/app/context/CaseContext";
import { fetchAllCases } from "@/lib/supabase/server";
import CaseClient from "./CaseClient";

interface CasePageProps {
  params: { slug: string };
}

export default async function CasePage({ params }: CasePageProps) {
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

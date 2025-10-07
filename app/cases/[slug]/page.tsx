// app/cases/[slug]/page.tsx
import type { Case } from "@/app/context/CaseContext";
import { fetchAllCases } from "@/lib/supabase/server";
import CaseClient from "./CaseClient";

export default async function CasePage() {
  const cases: Case[] = await fetchAllCases(); // server-side
  return <CaseClient allCases={cases} />;
}

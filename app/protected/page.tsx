// app/protected/page.tsx
import { fetchCasesBySlug } from "@/lib/supabase/server";
import ProtectedPageClient from "./components/protected-page-client";

export default async function ProtectedPage() {
  // fetch all cases for a default slug or leave empty
  const defaultSlug = "default-project";
  const cases = await fetchCasesBySlug(defaultSlug);

  return <ProtectedPageClient initialSlug={defaultSlug} initialCases={cases} />;
}

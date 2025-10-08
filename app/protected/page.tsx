import { fetchAllCases } from "@/lib/supabase/server";
import ProtectedPageClient from "./components/protected-page-client";

export default async function ProtectedPage() {
  const cases = await fetchAllCases();

  return <ProtectedPageClient initialCases={cases} />;
}

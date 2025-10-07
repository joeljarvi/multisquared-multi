import CasesDisplay from "@/components/cases-display";

import { fetchAllCases } from "@/lib/supabase/server";

export default async function Home() {
  const cases = await fetchAllCases();

  return (
    <main className="min-h-screen flex flex-col items-center ">
      <CasesDisplay cases={cases} />

      <footer className="w-full flex items-center justify-center text-center text-xs gap-8 py-16">
        <p>multisquared © {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}

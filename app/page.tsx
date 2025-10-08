import CasesDisplay from "@/components/cases-display";
import { fetchAllCases } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const cases = await fetchAllCases();

  return (
    <main className="min-h-screen flex flex-col items-center">
      <Link
        href="/protected"
        className="z-10 fixed top-4 right-4 px-4 py-2 text-base backdrop-blur-sm bg-gray-50/50 rounded hover:bg-gray-300 transition"
      >
        Admin
      </Link>
      <CasesDisplay cases={cases} />

      <footer className="w-full flex items-center justify-center text-center text-xs gap-8 py-16">
        <p>multisquared © {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}

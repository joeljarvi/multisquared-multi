import { fetchAllCases } from "@/lib/supabase/server";
import HeroPage from "@/components/HeroPage";
import FloatingNav from "@/components/FloatingNav";

export default async function Home() {
  const cases = await fetchAllCases();

  return (
    <>
      <FloatingNav />
      <main className="min-h-screen flex flex-col items-center">
        <HeroPage cases={cases} />
      </main>
    </>
  );
}

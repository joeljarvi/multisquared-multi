// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Case } from "@/app/context/CaseContext";

// ✅ Make this async
export async function createServerSupabaseClient() {
  const cookieStore = await cookies(); // ✅ await here

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
}

// ✅ Also async
export async function fetchCasesBySlug(slug: string): Promise<Case[]> {
  const supabase = await createServerSupabaseClient(); // ✅ await here

  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("case_slug", slug);
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllCases(): Promise<Case[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("case_order", { ascending: true }); // 👈 sorted by case_order
  if (error) throw error;
  return data ?? [];
}

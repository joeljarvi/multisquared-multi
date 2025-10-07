"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface Case {
  id: number;
  created_at: string;
  case_slug: string;
  title: string | null;
  client: string;
  description: string;
  category: string | null;
  year: string | null;
  images: string[] | null;
}

interface CaseContextType {
  supabase: SupabaseClient;
  cases: Case[];
  loading: boolean;
  error: Error | null;
  slug: string;
  setSlug: (slug: string) => void;
  addCase: (
    newCase: Omit<Case, "id" | "created_at" | "case_slug">
  ) => Promise<void>;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

interface CaseProviderProps {
  children: ReactNode;
  initialSlug?: string;
  initialCases?: Case[];
}

export function CaseProvider({
  children,
  initialSlug,
  initialCases,
}: CaseProviderProps) {
  const [supabase] = useState<SupabaseClient>(() => createClient());
  const [cases, setCases] = useState<Case[]>(initialCases ?? []);
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch cases whenever slug changes (client-side updates)
  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    const fetchCases = async () => {
      try {
        const { data, error } = await supabase
          .from("cases")
          .select("*")
          .eq("case_slug", slug);

        if (error) throw error;
        setCases(data ?? []);
      } catch (err: any) {
        console.error("Supabase fetch error:", err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [slug, supabase]);

  const addCase = async (
    newCase: Omit<Case, "id" | "created_at" | "case_slug">
  ) => {
    if (!slug) throw new Error("No project slug set");

    try {
      const { data, error } = await supabase
        .from("cases")
        .insert({ ...newCase, case_slug: slug })
        .select();

      if (error) throw error;
      setCases((prev) => [...prev, ...(data as Case[])]);
    } catch (err: any) {
      console.error("Error adding case:", err.message);
      throw err;
    }
  };

  return (
    <CaseContext.Provider
      value={{ supabase, cases, loading, error, slug, setSlug, addCase }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export function useCaseContext(): CaseContextType {
  const context = useContext(CaseContext);
  if (!context)
    throw new Error("useCaseContext must be used inside a <CaseProvider>");
  return context;
}

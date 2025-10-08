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
  addCase: (newCase: Omit<Case, "id" | "created_at">) => Promise<void>;
  updateCase: (
    id: number,
    updatedFields: Partial<Omit<Case, "id">>
  ) => Promise<void>;
  deleteCase: (id: number) => Promise<void>;
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
  const [supabase] = useState(() => createClient());
  const [cases, setCases] = useState<Case[]>(initialCases ?? []);
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unexpected error";
        console.error("Supabase fetch error:", message);
        setError(new Error(message));
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [slug, supabase]);

  const addCase = async (newCase: Omit<Case, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from("cases")
        .insert(newCase)
        .select();

      if (error) throw error;
      setCases((prev) => [...prev, ...(data as Case[])]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      console.error("Error adding case:", message);
      setError(new Error(message));
    }
  };

  const updateCase = async (
    id: number,
    updatedFields: Partial<Omit<Case, "id">>
  ) => {
    try {
      const { data, error } = await supabase
        .from("cases")
        .update(updatedFields)
        .eq("id", id)
        .select();

      if (error) throw error;

      setCases((prev) =>
        prev.map((c) => (c.id === id ? (data?.[0] as Case) : c))
      );
    } catch (err: unknown) {
      console.error("Error updating case:", err);
    }
  };

  const deleteCase = async (id: number) => {
    try {
      const { error } = await supabase.from("cases").delete().eq("id", id);
      if (error) throw error;
      setCases((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      console.error("Error deleting case:", err);
    }
  };

  return (
    <CaseContext.Provider
      value={{
        supabase,
        cases,
        loading,
        error,
        slug,
        setSlug,
        addCase,
        updateCase,
        deleteCase,
      }}
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

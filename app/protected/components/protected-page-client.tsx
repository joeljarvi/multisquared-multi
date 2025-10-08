"use client";

import { CaseProvider } from "@/app/context/CaseContext";
import CaseForm from "./case-form";
import CasesList from "./cases-list";
import type { Case } from "@/app/context/CaseContext";
import Link from "next/link";

interface Props {
  initialSlug: string;
  initialCases: Case[];
}

export default function ProtectedPageClient({
  initialSlug,
  initialCases,
}: Props) {
  return (
    <CaseProvider initialSlug={initialSlug} initialCases={initialCases}>
      <Link
        className="z-10 fixed top-4 right-4 px-4 py-2 text-base backdrop-blur-sm bg-gray-50/50 rounded hover:bg-gray-300 transition"
        href="/"
      >
        Back to home
      </Link>
      <div className="flex flex-col gap-6 w-full max-w-xl p-6">
        <h2 className="text-2xl font-bold">Add a new case</h2>
        <CaseForm />

        <h2 className="text-2xl font-bold mt-8">Existing cases</h2>
        <CasesList />
      </div>
    </CaseProvider>
  );
}

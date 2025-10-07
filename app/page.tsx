import { fetchCasesBySlug } from "@/lib/supabase/server";
import CasesDisplay from "@/components/cases-display";
import AuthButton from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import { fetchAllCases } from "@/lib/supabase/server";

export default async function Home() {
  const cases = await fetchAllCases();

  return (
    <main className="min-h-screen flex flex-col items-center gap-8 p-5">
      {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
      {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}

      <CasesDisplay cases={cases} />

      <footer className="w-full flex items-center justify-center text-center text-xs gap-8 py-16">
        <p>multisquared © {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}

import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";

import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}

      {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}

      <footer className="w-full flex items-center justify-center mx-auto text-center text-xs gap-8 py-16">
        <p>multisquared © {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}

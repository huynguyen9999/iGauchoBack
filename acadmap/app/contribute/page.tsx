import { ContributePageClient } from "@/app/contribute/ContributePageClient";
import { getNavAuthState } from "@/lib/auth-session";
import { isContributeLive } from "@/lib/env";

export const metadata = {
  title: "Contribute | iGauchoBack",
  description: "Submit a degree roadmap update for community review.",
};

export default async function ContributePage() {
  const auth = await getNavAuthState();
  return (
    <ContributePageClient auth={auth} contributeLive={isContributeLive()} />
  );
}

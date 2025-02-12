import { redirect } from "next/navigation";

import { SignInCard } from "@/features/auth/components/sign-in-card";
import { getCurrentUser } from "@/features/auth/queries";

export default async function SignIn() {
  const user = await getCurrentUser();
  if (user) redirect("/workspaces");

  return <SignInCard />;
}

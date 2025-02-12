import { redirect } from "next/navigation";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { getCurrentUser } from "@/features/auth/queries";

export default async function SignUp() {
  const user = await getCurrentUser();
  if (user) redirect("/workspaces");

  return <SignUpCard />;
}

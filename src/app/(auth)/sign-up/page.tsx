import { redirect } from "next/navigation";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { getCurrentUser } from "@/features/auth/actions";

export default async function SignUp() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return <SignUpCard />;
}

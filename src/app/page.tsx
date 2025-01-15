import { redirect } from "next/navigation";

import { UserButton } from "@/features/auth/components/user-button";
import { getCurrentUser } from "@/features/auth/actions";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <>
      <UserButton />
    </>
  );
}

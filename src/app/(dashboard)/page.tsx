import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/actions";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <div className="w-full px-2">This is a Home page</div>;
}

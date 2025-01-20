import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/actions";
import { CreateWorkspacesForm } from "@/features/workspaces/components/create-workspaces-form";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full h-full p-4">
      <div className=" bg-neutral-500 h-full p-4 w-full max-w-2xl">
        <CreateWorkspacesForm />
      </div>
    </div>
  );
}

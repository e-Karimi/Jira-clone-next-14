import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/actions";
import { CreateWorkspacesForm } from "@/features/workspaces/components/create-workspaces-form";

export default async function WorkspaceCreatePage() {
  const user = await getCurrentUser();
  if (!user) redirect("sign-in");

  return (
    <div className="w-full lg: max-w-xl ">
      <CreateWorkspacesForm />
    </div>
  );
}

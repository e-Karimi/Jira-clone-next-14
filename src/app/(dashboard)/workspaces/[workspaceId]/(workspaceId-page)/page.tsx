import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/actions";

export default async function WorkspaceIdPage({ params }: { params: { workspaceId: string } }) {
  const user = await getCurrentUser()
  if(!user) redirect('/sign-in')
    
  return <div>WorkspaceIdPage :  {params.workspaceId}</div>;
}

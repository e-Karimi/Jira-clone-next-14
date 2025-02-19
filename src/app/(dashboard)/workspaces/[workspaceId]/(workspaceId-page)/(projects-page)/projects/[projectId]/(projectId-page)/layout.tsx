import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";

export default function ProjectIdLayoutPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <CreateWorkspaceModal/>
      <CreateProjectModal/>
      <div className="flex w-full h-full">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full  overflow-y-hidden">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-2xl ">
            <Navbar />
            <main className="h-full p-4 flex flex-col"> {children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}

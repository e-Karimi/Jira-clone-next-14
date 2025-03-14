import Image from "next/image";
import Link from "next/link";

import { Projects } from "@/components/projects";

import { DottedSeparator } from "./dotted-separator";
import { WorkspacsSwitcher } from "./WorkspacsSwitcher";
import { Navigation } from "./navigation";

export const Sidebar = () => {
  return (
    <aside className="h-full w-full p-4 bg-neutral-100 overflow-y-auto ">
      <Link href="/">
        <Image src="/Jira_Logo.svg" alt="logo" width={164} height={48} priority className="w-[164px] h-12" />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspacsSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};

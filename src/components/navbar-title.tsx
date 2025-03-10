"use client";

import { usePathname } from "next/navigation";

const pathnameMap = {
  tasks: {
    title: "My Tasks",
    description: "View all of your Tasks",
  },
  projects: {
    title: "My Project",
    description: "View  tasks of your Projects here",
  },
  members: {
    title: "Members",
    description: "Monitor all of the members related to the workspace here",
  },
};

const defaultPathname = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};

export const NavbarTitle = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultPathname;

  return (
    <div className="hidden lg:flex flex-col">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

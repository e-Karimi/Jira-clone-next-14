"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { SettingsIcon, UserIcon } from "lucide-react";
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from "react-icons/go";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

const routes = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UserIcon,
    activeIcon: UserIcon,
  },
];

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  return (
    <ul className="flex flex-col">
      {routes.map((route) => {
        const fullHref = `/workspaces/${workspaceId}${route.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? route.activeIcon : route.icon;

        return (
          <Link key={route.label} href={fullHref}>
            <div
              className={cn(
                "flex items-center gap-x-2.5 py-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                isActive && "bg-white text-primary shadow-sm hover:opacity-100"
              )}
            >
              <Icon className="size-5 text-neutral-500 ml-2" />
              {route.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};

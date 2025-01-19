import { UserButton } from "@/features/auth/components/user-button";
import { MobileSidebar } from "@/components/mobile-sidebar";
import React from "react";

export const Navbar = () => {
  return (
    <nav className="w-full py-2 px-4 flex items-center justify-between ">
      <div className="hidden lg:flex flex-col">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">Monitor all of your projects and tasks here</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};

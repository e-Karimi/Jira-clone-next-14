"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const AuthLayoutBtn = () => {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";
  return (
    <Button asChild variant="secondary">
      <Link href={isSignIn ? "/sign-up" : "/sign-in"}>{isSignIn ? "Sign Up" : "Sign In"}</Link>
    </Button>
  );
};

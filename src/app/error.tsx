"use client";

import Link from "next/link";

import { AlertTriangleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="h-screen flex flex-col gap-y- items-center justify-center space-y-3">
      <AlertTriangleIcon className="size-8" />
      <p className="text-base">Something went wrong!</p>
      <p className="text-sm">{error.message}</p>
      <Button asChild variant="primary" size="sm">
        <Link href="/workspaces">Back to home</Link>
      </Button>
      <Button variant="destructive" size="sm" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}

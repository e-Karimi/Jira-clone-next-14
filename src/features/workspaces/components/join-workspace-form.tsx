"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { DottedSeparator } from "@/components/dotted-separator";
import { useJoinWorkspace } from "../api/use-join-workspace";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
    inviteCode: string;
    workspaceId: string;
  };
}

export const JoinWorkspaceForm = ({ initialValues }: JoinWorkspaceFormProps) => {
  const { mutate, isPending } = useJoinWorkspace();
  const router = useRouter();

  const onSubmit = () => {
    mutate(
      {
        param: { workspaceId: initialValues.workspaceId },
        json: { code: initialValues.inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold"> Join workspace</CardTitle>
        <CardDescription>
          {" "}
          you&apos;ve been invited to join <strong>{initialValues.name}</strong>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="flex flex-col lg:flex-row gap-2 items-center justify-between py-4">
        <Button
          disabled={isPending}
          variant="secondary"
          size="lg"
          type="button"
          asChild
          className="w-full md:w-1/3 lg:w-fit "
        >
          <Link href="/workspaces">Cancel</Link>
        </Button>
        <Button onClick={onSubmit} disabled={isPending} size="lg" type="button" className="w-full md:w-1/3 lg:w-fit">
          Join Workspace
        </Button>
      </CardContent>
    </Card>
  );
};

"use client";

import { Fragment } from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { DottedSeparator } from "@/components/dotted-separator";
import { useGetMembers } from "../api/use-get-members";
import { MemberAvatar } from "./member-avatar";
import { useDeleteMember } from "../api/use-delete-member";
import { useUpdateMember } from "../api/use-update-member";
import { MemberRole } from "../types";
import { useConfirm } from "@/hooks/use-confirm";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetMembers({ workspaceId });

  const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();

  const [ConfirmationDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace",
    "destructive"
  );

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  return (
    <Card className="w-ful h-full shadow-none border-none ">
      <ConfirmationDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0 ">
        <Button asChild variant="secondary" size="sm" type="button">
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members list</CardTitle>{" "}
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2 mb-2">
              <MemberAvatar className="size-10" fullbackClassName="text-lg" name={member.name} />
              <div className="flex flex-col ">
                <p className="text-sm font-medium">{member.name} </p>
                <p className="text-xs  text-muted-foreground">{member.email} </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="ml-auto">
                    <MoreVerticalIcon className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)}
                    disabled={isUpdatingMember}
                    className="font-medium"
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)}
                    disabled={isUpdatingMember}
                    className="font-medium"
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteMember(member.$id)}
                    disabled={isDeletingMember}
                    className="font-medium text-amber-700"
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.documents.length - 1 && <Separator className="my-2.5 " />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SettingsIcon } from "lucide-react";

import { DottedSeparator } from "./dotted-separator";
import { Member } from "@/features/members/types";
import { MemberAvatar } from "@/features/members/components/member-avatar";

interface memberListProps {
  data: Member[];
  total: number;
  workspaceId: string;
}

export default function MemberList({ data, total, workspaceId }: memberListProps) {
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-gray-50 border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button asChild variant="secondary" size="icon">
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-blue-700 rounded-full " />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1  sm:grid-cols-2 2xl:grid-cols-3 gap-4">
          {data.map((member) => (
            <li key={member.$id}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="p-2 flex items-center gap-x-2">
                  <MemberAvatar name={member.name} className="size-12" />
                  <div className="flex flex-col overflow-hidden ">
                    <p className="text-base font-medium line-clamp-1">{member.name}</p>
                    <p className="text-sm text-muted-foreground font-medium line-clamp-1">{member.email}</p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">No members found</li>
        </ul>
      </div>
    </div>
  );
}

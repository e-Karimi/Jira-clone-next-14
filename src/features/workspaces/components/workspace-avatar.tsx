import Image from "next/image";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

interface WorkspaceAvatarProps {
  name: string;
  image?: string;
  className?: string;
}

export const WorkspaceAvatar = ({ name, image, className }: WorkspaceAvatarProps) => {
  if (image) {
    return (
      <div className={cn("relative size-10 rounded-md overflow-hidden", className)}>
        <Image src={image} alt={name} fill priority className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-10", className)}>
      <AvatarFallback>
        <div className="size-10 rounded-md flex items-center justify-center text-muted bg-blue-500 font-semibold text-lg uppercase">
          {name.charAt(0).toUpperCase()}
        </div>
      </AvatarFallback>
    </Avatar>
  );
};

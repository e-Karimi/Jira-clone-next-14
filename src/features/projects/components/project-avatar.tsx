import Image from "next/image";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

interface ProjectAvatarProps {
  name: string;
  image?: string;
  className?: string;
  fallbackclassName?: string;
}

export const ProjectAvatar = ({ name, image, className, fallbackclassName }: ProjectAvatarProps) => {
  if (image) {
    return (
      <div className={cn("relative size-5 rounded-md overflow-hidden", className)}>
        <Image src={image} alt={name} fill priority className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-5 flex items-center justify-center", className)}>
      <AvatarFallback>
        <div
          className={cn(
            "size-5 rounded-md flex items-center justify-center text-muted bg-blue-500 font-semibold text-sm uppercase",
            fallbackclassName
          )}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      </AvatarFallback>
    </Avatar>
  );
};

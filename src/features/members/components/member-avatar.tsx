import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

interface MemberAvatarProps {
  name: string;
  className?: string;
  fullbackClassName?: string;
}

export const MemberAvatar = ({ name, className, fullbackClassName }: MemberAvatarProps) => {
  return (
    <Avatar
      className={cn(
        "size-5 transition bg-neutral-200 border border-neutral-300  flex items-center justify-center rounded-full overflow-hidden  ",
        className
      )}
    >
      <AvatarFallback
        className={cn(" font-medium text-neutral-500 flex items-center justify-center", fullbackClassName)}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

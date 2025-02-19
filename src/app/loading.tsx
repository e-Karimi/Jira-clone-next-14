import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen flex flex-col gap-y- items-center justify-center space-y-3">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}

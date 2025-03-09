import { AlertTriangleIcon } from "lucide-react";

interface PageErrorProps {
  error: string;
}

export const PageError = ({ error = "Something went wrong!" }: PageErrorProps) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-2">
      <AlertTriangleIcon className="size-8 text-red-400 " />
      <p className="text-sm font-medium text-muted-foreground">{error}</p>
    </div>
  );
};

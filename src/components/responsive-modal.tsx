"use client";

import { useMedia } from "react-use";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

interface ResponsiveModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const ResponsiveModal = ({ open, onOpenChange, children }: ResponsiveModelProps) => {
  const isDesktop = useMedia("(min-width:1024px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <VisuallyHidden.Root>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>Dialog Description</DialogDescription>
            </DialogHeader>
          </VisuallyHidden.Root>
          <div className="w-full sm:max-w-lg max-h-[85vh] p-0 border-none overflow-y-auto hide-scrollbar ">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <VisuallyHidden.Root>
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>Drawer Description</DrawerDescription>
          </DrawerHeader>
        </VisuallyHidden.Root>
        <div className=" max-h-[85vh] p-0 overflow-y-auto  hide-scrollbar ">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};

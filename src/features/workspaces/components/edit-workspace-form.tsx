"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyIcon, ImageIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MdKeyboardBackspace } from "react-icons/md";

import { updateWorkspaceSchema } from "../schemas";
import { DottedSeparator } from "@/components/dotted-separator";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import type { Workspace } from "../types";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "@/features/workspaces/api/use-delete-workspace";
import { toast } from "sonner";
import { useResetInviteCode } from "../api/use-reset-invite-code";

interface CreateWorkspacesFormPrps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkspaceForm = ({ onCancel, initialValues }: CreateWorkspacesFormPrps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResetingInviteCode } = useResetInviteCode();

  const [ConfirmationDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone",
    "destructive"
  );

  const [ResetDialog, confirmReset] = useConfirm(
    "Reset Invite link",
    "This invalidate the current invite link",
    "destructive"
  );

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate({ form: finalValues, param: { workspaceId: initialValues.$id } });
  };

  const handleImageheChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          //Hard refresh
          window.location.href = "/workspaces";
        },
      }
    );
  };

  let fullInviteLink = "";
  if (typeof window !== "undefined") {
    fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;
  }

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => {
      toast.success("Invite link copied to the clipboard");
    });
  };

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();

    if (!ok) return null;

    resetInviteCode({
      param: { workspaceId: initialValues.$id },
    });
  };

  return (
    <div className="flex flex-col gap-y-4">
      <ConfirmationDialog />
      <ResetDialog />
      {/*  Workspace Edit Form*/}
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader>
          <div
            onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}
            className="group flex items-center gap-x-1 mb-2 cursor-pointer"
          >
            <MdKeyboardBackspace className="w-6 h-6 text-gray-500 group-hover:text-blue-700" />
            <small className="text-gray-500 group-hover:text-blue-700">Back</small>
          </div>

          <CardTitle className="text-base font-bold ">
            Update{" "}
            <span className="underline decoration-double underline-offset-4 decoration-blue-500">
              {initialValues.name}
            </span>{" "}
            workspace
          </CardTitle>
        </CardHeader>
        <div className="mb-2">
          <DottedSeparator />
        </div>
        <CardContent className="p-7 pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter Workspace Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="relative size-[72px] overflow-hidden rounded-md">
                            <Image
                              src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}
                              width={72}
                              height={72}
                              priority
                              alt="logo"
                              className="object-cover w-[72px] h-[72px] "
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col gap-y-1">
                          <p className="text-sm"> Workspace Icon</p>
                          <p className="text-xs text-muted-foreground"> JPG, PNG, SVG, JPEG, TIFF, max 1MB</p>
                          <input
                            className="hidden"
                            type="file"
                            accept=".jpg, .png, .jpeg, .svg, tiff"
                            ref={inputRef}
                            disabled={isPending}
                            onChange={handleImageheChange}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              variant="destructive"
                              size="xs"
                              className="mt-2 w-fit"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                              disabled={isPending}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="tertiary"
                              size="xs"
                              className="mt-2 w-fit"
                              onClick={() => inputRef.current?.click()}
                              disabled={isPending}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className={cn("flex items-center justify-between", !onCancel && "justify-center")}>
                <Button
                  onClick={onCancel}
                  type="button"
                  variant="secondary"
                  size="lg"
                  disabled={isPending}
                  className={cn(!onCancel && "hidden")}
                >
                  Cancel
                </Button>
                <Button type="submit" size="lg" disabled={isPending}>
                  Update Workspace
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      {/* Invite Members */}
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold"> Invite Members</h3>
            <p className="text-sm text-muted-foreground">Use the invite link to add members to your workspace.</p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input disabled value={fullInviteLink} className="text-xs" />
                <Button variant="secondary" className="size-12" onClick={handleCopyInviteLink}>
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isResetingInviteCode}
              onClick={handleResetInviteCode}
              className="mt-6 w-fit ml-auto"
            >
              Reset invite link
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Danger Zone */}
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all associated data.
            </p>
            <Button
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isDeletingWorkspace}
              onClick={handleDelete}
              className="mt-6 w-fit ml-auto"
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

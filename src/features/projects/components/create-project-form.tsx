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
import { ImageIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { createProjectSchema } from "../schemas";
import { DottedSeparator } from "@/components/dotted-separator";
import { useCreateProject } from "../api/use-create-project";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

interface CreateProjectFormPrps {
  onCancel?: () => void;
}

export const CreateProjectForm = ({ onCancel }: CreateProjectFormPrps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useCreateProject();
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const finalValues = {
      ...values,
      workspaceId,
      image: values.image instanceof File ? values.image : "",
    };

    mutate(
      { form: finalValues },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
        },
      }
    );
  };

  const handleImaheChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new project</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>project Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter project Name" />
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
                        <p className="text-sm"> project Icon</p>
                        <p className="text-xs text-muted-foreground"> JPG, PNG, SVG, JPEG, TIFF, max 1MB</p>
                        <input
                          className="hidden"
                          type="file"
                          accept=".jpg, .png, .jpeg, .svg, tiff"
                          ref={inputRef}
                          disabled={isPending}
                          onChange={handleImaheChange}
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
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

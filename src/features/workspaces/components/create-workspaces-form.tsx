"use client";

import { useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { createWorkspaceSchema } from "../schemas";
import { DottedSeparator } from "@/components/dotted-separator";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { ImageIcon } from "lucide-react";

interface CreateWorkspacesFormPrps {
  onCancel?: () => void;
}

export const CreateWorkspacesForm = ({ onCancel }: CreateWorkspacesFormPrps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useCreateWorkspace();

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate(
      { form: finalValues },
      {
        onSuccess: () => {
          form.reset();
          //redirect to the new workspace
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
        <CardTitle className="text-xl font-bold">Create a new workspace</CardTitle>
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
                          onChange={handleImaheChange}
                        />
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
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button type="button" variant="secondary" size="lg" onClick={onCancel} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={isPending}>
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

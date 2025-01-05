"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { DottedSeparator } from "@/components/dotted-separator";

const formSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Must be 8 or more characters long" })
    .max(256, { message: "Must be 256 or fewer characters long" }),
});

export const SignUpCard = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("SignUpCard => onSubmit ~ values:", values);
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none ">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link href="/privacy">
            <span className="text-blue-700">Privacy Policy</span>
          </Link>{" "}
          and{" "}
          <Link href="/terms">
            <span className="text-blue-700">Terms of service</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="mb-2">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Enter your name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Enter password " />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={false} size="lg" className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button disabled={false} variant="secondary" size="lg" className="w-full">
          <FcGoogle className="mr-2 size-5" />
          Login with Google
        </Button>
        <Button disabled={false} variant="secondary" size="lg" className="w-full">
          <FaGithub className="mr-2 size-5" />
          Login with Github
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center text-sm">
        <p>Already have an account?</p>
        <Link href="/sign-in">
          <span className="text-blue-700 text-sm">&nbsp;Sign In</span>
        </Link>
      </CardContent>
    </Card>
  );
};

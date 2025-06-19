"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { Loader2, Shield, User } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      otp: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (!data.name || !data.otp) {
        toast.error("Please fill in all fields");
        return;
      }
      setIsSubmitting(true);

      const res = await axios.post("/api/verify-code", {
        name: data.name,
        otp: data.otp,
      });

      toast.success(res.data.message || "User Verified Successfully");
      console.log(res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "An error occurred");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border border-zinc-800 bg-zinc-950">
        <CardHeader className="text-center space-y-2 pb-6 text-3xl ">
          Verify Your Account
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel className="text-white font-medium flex items-center gap-2">
                      Username
                    </FormLabel> */}
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        className="h-11 bg-zinc-900 border-[1px] border-zinc-700 text-white placeholder:text-zinc-500 outline-none  transition-colors"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter 6-digit Otp"
                        {...field}
                        className="h-11 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-white focus:ring-white transition-colors  tracking-wides transition-null"
                        maxLength={6}
                        disabled={isSubmitting}
                      />
                    </FormControl>

                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 bg-white hover:bg-zinc-200 text-black font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    {/* <Shield className="mr-2 h-4 w-4" /> */}
                    Verify Account
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;

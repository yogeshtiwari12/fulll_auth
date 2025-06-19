"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "../api/schemas/signup_schema"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useDebounceCallback } from "usehooks-ts"
import axios from "axios"
import { toast } from "sonner"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Link from "next/link"

const Page = () => {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const debouncedUsername = useDebounceCallback(setUsername, 500)

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const checkUniqueUsername = async () => {
      if (username.length < 3) {
        setUsernameMessage("")
        return
      }

      setIsCheckingUsername(true)
      try {
        const response = await axios.get(`/api/unique-username?username=${username}`)
        setUsernameMessage(response.data.message)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setUsernameMessage(error.response?.data.message || "An error occurred")
        } else {
          setUsernameMessage("Unexpected error occurred")
        }
      } finally {
        setIsCheckingUsername(false)
      }
    }

    checkUniqueUsername()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post("/api/signup", data)
      toast.success(response.data.message || "Signup successful")
      router.replace(`/verify?username=${username}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "An error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  // console.log(onSubmit)

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Enter your details to sign up.</CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                placeholder="Enter username"
                {...form.register("name")}
                onChange={(e) => {
                  form.setValue("name", e.target.value)
                  setUsername(e.target.value)
                }}
              />
              <p className={`text-sm ${usernameMessage==="Username is unique" ? "text-green-500" : "text-red-500"}`}>
                { usernameMessage}
              </p>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter email"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-white mt-4 text-black" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-500 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Page

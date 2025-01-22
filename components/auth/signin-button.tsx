"use client"
import { signIn } from "next-auth/react"
import { Button } from "../ui/button"

export function SignIn() {
  return (
    <Button
      variant="secondary"
      className="bg-secondary"
      onClick={() => signIn("Credentials", { redirectTo: "/employees" })}
    >
      Sign In
    </Button >
  )
}
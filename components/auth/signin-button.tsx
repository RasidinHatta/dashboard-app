"use client"
import { useSession, signIn } from "next-auth/react"
import { Button } from "../ui/button"
import { SignOut } from "./signout-button"

export function SignIn() {

  const { data: session } = useSession()

  if (session && session.user) {
    return (
      <>
        <h1 className="text-sky-600">{session.user.name}</h1>
        <SignOut />
      </>
    )
  }
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
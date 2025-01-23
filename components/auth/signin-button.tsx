"use client"
import { useSession, signIn } from "next-auth/react"
import { Button } from "../ui/button"
import { SignOut } from "./signout-button"

export function SignIn() {

  const { data: session, status } = useSession()
  console.log("Session", session)
  if (status === "authenticated" && session.user) {
    return (
      <>
        <p className="text-sky-600">{session.user.name}</p>
        <p className="text-sky-600">{status}</p>
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
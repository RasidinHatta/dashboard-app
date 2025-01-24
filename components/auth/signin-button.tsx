"use client"
import { useSession, signIn } from "next-auth/react"
import { Button } from "../ui/button"
import { SignOut } from "./signout-button"
import { useEmployeeData } from "@/hooks/useEmployeeData"

export function SignIn() {

  const { session, status } = useEmployeeData()
  console.log("Session", session)
  if (status === "authenticated") {
    return (
      <>
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
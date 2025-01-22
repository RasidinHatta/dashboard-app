"use client"
import { signOut } from "next-auth/react"
import { Button } from "../ui/button"

export function SignOut() {
    return (
        <Button
            variant="secondary"
            className="bg-secondary"
            onClick={() => signOut({ redirectTo: "/" })}
        >
            Sign Out
        </Button>
    )
}
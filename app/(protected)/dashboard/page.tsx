"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import React from 'react'

const page = () => {
    const { data: session, status } = useSession()
    return (
        <div className="flex items-center justify-center h-full w-full">
          <Card className="w-full max-w-2xl shadow-lg border rounded-lg">
            <CardHeader className="text-center p-6 rounded-t-lg">
              <CardTitle className="text-2xl font-bold">
                {status === "authenticated" && session.user
                  ? `Welcome, ${session.user.name}!`
                  : "Welcome to Your Profile"}
              </CardTitle>
              <CardDescription>
                {status === "authenticated"
                  ? "Here's your account information:"
                  : "Sign in to view your account details."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {status === "authenticated" && session.user ? (
                <div className="space-y-4">
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {session.user.name}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {session.user.email}
                  </p>
                  <p>
                    <span className="font-semibold">Role:</span>{" "}
                    {session.user.role}
                  </p>
                  <p>
                    <span className="font-semibold">Created At:</span>{" "}
                    {new Date(session.user.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">Updated At:</span>{" "}
                    {new Date(session.user.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-center">
                  Please sign in to view your account details.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      );
}

export default page
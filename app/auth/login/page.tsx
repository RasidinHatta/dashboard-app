"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { signIn } from "next-auth/react";  // Import NextAuth's signIn method
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // To capture any login error
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials. Please try again.");
    } else if (res?.ok) {
      toast({
        title: "Login Successful",
        description: "Welcome! Redirecting you to the dashboard.",
        variant: "default",
      });
      router.push("/dashboard"); // Redirect to the dashboard or wherever after login
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center my-20">
      <Card className="w-[20%]">
        <CardHeader>
          <CardTitle>Login/SignIn</CardTitle>
          <CardDescription>Login/SignIn to our page</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <Input
                type="email"
                placeholder="Employee Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mr-auto"
                required
              />
            </div>
            <div className="mb-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mr-auto"
                required
              />
            </div>

            {error && <div className="text-red-500 text-sm mb-4">{error}</div>} {/* Display error */}

            <div className="flex justify-between gap-4 mt-4">
              <Button variant="secondary" className="bg-secondary" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

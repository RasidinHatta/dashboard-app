"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react"; // Import signIn from next-auth

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"INTERN" | "ADMIN" | "ENGINEER">("INTERN");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      console.log("Submitting the following payload:", { name, email, role });

      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (response.status === 204) {
        console.log("Registration succeeded with no content returned.");
        toast({
          title: "Registration Successful",
          description: "Your registration was successful, but no additional data was returned.",
          variant: "default",
        });
      } else if (response.ok) {
        const responseData = await response.json();
        console.log("Registration successful:", responseData);

        toast({
          title: "Registration Successful",
          description: "You have successfully registered. Logging you in...",
          variant: "default",
        });

        // Auto-login after successful registration
        const loginResponse = await signIn("credentials", {
          redirect: false, // Prevent redirect to another page
          email,
          password,
        });

        if (loginResponse?.ok) {
          toast({
            title: "Login Successful",
            description: "Welcome! Redirecting you to the dashboard.",
            variant: "default",
          });
          router.push("/dashboard"); // Redirect to the dashboard or another page
        } else {
          throw new Error("Auto-login failed. Please log in manually.");
        }
      } else {
        const errorText = await response.text();
        console.error("Response body:", errorText);
        throw new Error(`Failed to sign up. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Signup failed:", error);
      toast({
        title: "Registration Failed",
        description: "Please check the credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center my-20">
      <Card className="w-[20%]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Sign up to our page</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Employee Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mr-auto"
                required
              />
            </div>
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
            <div className="mb-4 w-full mr-auto">
              <Select
                value={role}
                onValueChange={(value) => setRole(value as "INTERN" | "ADMIN" | "ENGINEER")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERN">Intern</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="ENGINEER">Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between gap-4 mt-4">
              <Button
                variant="secondary"
                className="bg-secondary"
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>
              <Button type="submit" variant="secondary" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;

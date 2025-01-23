"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react"; // Import signIn from next-auth

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'INTERN' | 'ADMIN' | 'ENGINEER'>('INTERN');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      // Debug payload
      console.log("Submitting the following payload:", { name, email, role });

      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }), // Include default password in payload
      });

      // Check for the 204 status and ignore it
      if (response.status === 204) {
        console.log("No content returned, ignoring...");
        return;
      }

      // Check if the registration was successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response body:", errorText);
        throw new Error(`Failed to signUp. Status: ${response.status}`);
      }

      // Output toast and proceed with redirect after successful signup
      toast({
        title: "Registration Successful",
        description: "You have successfully registered and are now logged in.",
        variant: "default",
      });

      // Sign in the user automatically after registration
      const loginResponse = await signIn("Credentials", {
        redirectTo: "/",  // Redirect to the homepage after successful login
        email,
        password, // Make sure this matches the field names used in your NextAuth configuration
      });

      // If the sign-in is successful, manually redirect to homepage
      if (loginResponse?.ok) {
        console.log("Login successful.");
        router.push("/"); // Redirect to homepage
      } else {
        console.error("Login failed:", loginResponse?.error);
        toast({
          title: "Login Failed",
          description: "Please check your credentials.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("signUp Failed:", error);
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
          <CardDescription>Sign Up to our page</CardDescription>
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
                onValueChange={(value) => setRole(value as 'INTERN' | 'ADMIN' | 'ENGINEER')}
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

"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react"; // Import signIn from next-auth
import { Eye, EyeOff } from "react-feather"; // Import the eye icons (you can install this library via npm)

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility toggle
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Check if passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please ensure that the passwords match.",
        variant: "destructive",
      });
      setLoading(false);
      return; // Prevent further action if passwords don't match
    }

    try {
      console.log("Submitting the following payload:", { name, email, password });

      // Always assign role as INTERN
      const role = "INTERN";

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
        const parsedError = JSON.parse(errorText); 
        toast({
          title: "Register Failed",
          description: `Credential Error: ${parsedError}`,
          variant: "destructive",
        });
        if (response.status === 409) throw new Error(`Failed to sign up. Status: Email already exist`);
      }
    } catch (error) {
      console.log(error)
    
      // Check if the error is a response from the server (e.g., 409 Conflict)
      if (error instanceof Error) {
        // Only show a custom toast message if it's a known error
        const errorMessage = error.message || "An unexpected error occurred";
        toast({
          title: "Registration Failed",
          description: `Credential Error: ${errorMessage}`,
          variant: "destructive",
        });
      } else {
        // Handle unexpected errors gracefully
        toast({
          title: "Registration Failed",
          description: "Please check the credentials and try again.",
          variant: "destructive",
        });
      }    
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel action (redirect to home)
  const handleCancel = () => {
    router.push("/"); // Only redirect to home when user clicks Cancel
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
                placeholder="Your Name"
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
            <div className="mb-4 relative">
              <Input
                type={passwordVisible ? "text" : "password"} // Toggle between text and password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mr-auto"
                required
              />
              <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            <div className="mb-4 relative">
              <Input
                type={passwordVisible ? "text" : "password"} // Use the same toggle state for confirm password
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mr-auto"
                required
              />
              <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility for confirm password
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            <div className="flex justify-between gap-4 mt-4">
              <Button
                variant="secondary"
                className="bg-secondary"
                onClick={handleCancel} // Call the handleCancel function
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
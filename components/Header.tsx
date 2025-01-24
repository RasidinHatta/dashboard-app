"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MegaMenu } from "primereact/megamenu";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import "./header.css";
import { useSession } from "next-auth/react";
import { SignIn } from "./auth/signin-button";

export default function Header() {
    const { setTheme, resolvedTheme } = useTheme(); // Use resolvedTheme to get current theme
    const [mounted, setMounted] = useState(false); // Ensure the component is mounted
    const { data: session } = useSession();

    useEffect(() => {
        // Ensure the component only renders client-side (hydration)
        setMounted(true);
    }, []);

    // Don't render anything until mounted to prevent mismatch
    if (!mounted) {
        return null;
    }

    const items = [
        {
            label: "Home",
            icon: "pi pi-fw pi-home", // Suitable for Home
            command: () => (window.location.href = "/"),
        },
        {
            label: "Dashboard",
            icon: "pi pi-fw pi-chart-bar", // Suitable for Dashboard
            command: () => (window.location.href = "/dashboard"),
        },
        {
            label: "Employees",
            icon: "pi pi-fw pi-users", // Suitable for Employees
            command: () => (window.location.href = "/employees"),
        },
    ];    

    const toggleTheme = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    {/* Dynamically adjust icon color */}
                    <Sun
                        className={`h-[1.2rem] w-[1.2rem] transition-all ${resolvedTheme === "dark" ? "hidden" : "text-neutral-900"
                            }`}
                    />
                    <Moon
                        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${resolvedTheme === "light" ? "hidden" : "text-neutral-100"
                            }`}
                    />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    const handleRegister = () => {
        // Redirect to the register page
        window.location.href = "/auth/register";
    }

    return (
        <div className="p-10">
            <MegaMenu
                model={items}
                orientation="horizontal"
                className="p-3 surface-0 shadow-2"
                end={
                    <div className="flex items-center gap-4">
                        {session?.user ? (
                            <>
                                <SignIn />
                            </>
                        ) : (
                            <>
                                <SignIn />
                                <Button
                                    variant="secondary"
                                    className="bg-secondary"
                                    onClick={handleRegister}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                        {toggleTheme()}
                    </div>
                }
            />
        </div>
    );
}

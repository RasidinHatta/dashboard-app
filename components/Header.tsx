"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { MegaMenu } from 'primereact/megamenu';
import { Moon, MoonIcon, Sun } from "lucide-react"
import { Button } from './ui/button';
import { useTheme } from "next-themes"
export default function Header() {
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            command: () => window.location.href = '/' // Always available
        },
        {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-th-large', // Change to a more appropriate icon
            command: () => window.location.href = '/employees',
        }
    ];
    const { setTheme } = useTheme()

    return (
        <div className="text-neutral-100 p-3">
            <MegaMenu model={items} orientation="horizontal" className='pl-20 gap-10 h-auto' />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
        </div>

    );
}

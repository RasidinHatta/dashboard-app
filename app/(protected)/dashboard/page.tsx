"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { format, formatDistanceToNow } from 'date-fns';
import { parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface Employee {
    readonly id: number;
    name: string;
    email: string;
    password?: string;
    updatedAt: string;
}

const Page = () => {
    const { session, status, employees, error } = useEmployeeData();
    const [dialogOpen, setDialogOpen] = useState(false);

    const [editData, setEditData] = useState<Partial<Employee>>({}); // Temporary edit state
    let updatedAt, formattedDate, duration;

    // Initialize the editData when employees data is available
    useEffect(() => {
        if (employees) {
            setEditData({
                name: employees.name,
                password: '', // Initialize password as empty string
            });
        }
    }, [employees]); // Re-run when employees data changes

    if (employees) {
        updatedAt = parseISO(employees.updatedAt);  // Parse the ISO date string
        formattedDate = format(updatedAt, 'yyyy-MM-dd');  // Format the date to 'YYYY-MM-DD'
        duration = formatDistanceToNow(updatedAt, { addSuffix: true });  // Get the duration from now
    }

    const { toast } = useToast();

    const handleEditSave = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_LOCAL_API_BASE_URL;
            const response = await fetch(`${baseUrl}/api/employees/${session?.user.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${session?.backend_token.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editData),
            });
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            toast({
                title: 'Success!',
                description: `Employee "${editData?.name}" has been updated.`,
            });

            // Refresh the page
            window.location.reload();
        } catch (error) {
            console.error('Error updating employee:', error);
            toast({
                title: 'Error',
                description: 'Failed to update the employee. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setDialogOpen(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-full w-full">
            <Card className="w-full max-w-2xl shadow-lg border rounded-lg">
                <CardHeader className="text-center p-6 rounded-t-lg">
                    <CardTitle className="text-2xl font-bold">
                        {status === 'authenticated' && session?.user
                            ? `Welcome, ${session.user.name}!`
                            : 'Welcome to Your Profile'}
                    </CardTitle>
                    <CardDescription>
                        {status === 'authenticated'
                            ? "Here's your account information:"
                            : 'Sign in to view your account details.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    {status === 'authenticated' && session?.user ? (
                        <div className="space-y-4">
                            {error ? (
                                <p className="text-red-500">Error: {error}</p>
                            ) : employees ? (
                                <div>
                                    <h3>Employee Details</h3>
                                    <p>
                                        <strong>ID:</strong> {employees.id}
                                    </p>
                                    <p>
                                        <strong>Name:</strong> {employees.name}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {employees.email}
                                    </p>
                                    <p>
                                        <strong>Password: Last update</strong> {formattedDate} ({duration})
                                    </p>
                                    <Button onClick={() => setDialogOpen(true)}>
                                        Update Profile
                                    </Button>
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-center">Please sign in to view your account details.</p>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <CardDescription>Edit your information</CardDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Name"
                            value={editData.name || ''}  // Bind value to editData.name
                            onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                        />
                        <Input
                            placeholder="Password"
                            onChange={(e) => {
                                const newPassword = e.target.value;
                                if (newPassword === '') {
                                    // If the password field is empty, keep the previous password value intact
                                    setEditData((prev) => ({ ...prev, password: prev.password }));
                                } else {
                                    // Update the password only when the input field is not empty
                                    setEditData((prev) => ({ ...prev, password: newPassword }));
                                }
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleEditSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Page;
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { redirect } from 'next/navigation';

const Page = () => {
    const { session, status, employees, error } = useEmployeeData();

    if (status !== 'authenticated') {
        redirect('/api/auth/signin');
    }

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
        </div>
    );
};

export default Page;

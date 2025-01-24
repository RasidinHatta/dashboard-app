import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface Employee {
    readonly id: number;
    name: string;
    email: string;
    password?: string;
    updatedAt: string
}

export const useEmployeeData = () => {
    const { data: session, status } = useSession();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const id = session?.user.id;
    const getToken = session?.backend_token?.accessToken;
    const [employees, setEmployees] = useState<Employee | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id || !baseUrl || !getToken) return;

        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/employees/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${getToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.statusText}`);
                }

                const user = await response.json();
                setEmployees(user);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(String(error));
                }
                console.error('Error fetching employees:', error);
            }
        };

        fetchData();
    }, [id, baseUrl, getToken]);

    return { session, status, employees, error };
};

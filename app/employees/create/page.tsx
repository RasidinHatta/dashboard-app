"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CreatePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'INTERN' | 'ADMIN' | 'ENGINEER'>('INTERN');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle form submission to create a new employee
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_LOCAL_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, role }),
      });

      if (!response.ok) {
        throw new Error('Failed to create employee');
      }

      // Redirect after success
      router.push('/employees');
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Failed to create employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-[92%]">
        <CardHeader>
          <CardTitle>Create New Employee</CardTitle>
          <CardDescription>Fill in the form to create a new employee</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Employee Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="mb-4">
              <Input
                type="email"
                placeholder="Employee Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="mb-4">
            <Select value={role} onValueChange={(value) => setRole(value as 'INTERN' | 'ADMIN' | 'ENGINEER')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERN">Intern</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="ENGINEER">Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="secondary"
                className="bg-secondary"
                onClick={() => router.push('/employees')}
              >
                Cancel
              </Button>
              <Button type="submit" variant="secondary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Employee'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePage;

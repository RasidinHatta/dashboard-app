'use client';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useRouter } from 'next/navigation';

interface Employee {
  id: number;
  name: string;
  role: 'INTERN' | 'ADMIN' | 'ENGINEER'; // Enum-like role values
  email: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [nameFilter, setNameFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<'INTERN' | 'ADMIN' | 'ENGINEER' | ''>('');
  const [emailFilter, setEmailFilter] = useState('');
  const router = useRouter();

  // Sorting state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch data on filter chang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (nameFilter) queryParams.append('name', nameFilter);
        if (roleFilter) queryParams.append('role', roleFilter);
        if (emailFilter) queryParams.append('email', emailFilter);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_LOCAL_API_BASE_URL;

        const response = await fetch(`${baseUrl}/api/employees?${queryParams.toString()}`);
        if (!response.ok) throw new Error(`API error: ${response.statusText}`);

        const data = await response.json();
        setEmployees(data);
        console.log('API response:', data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setEmployees([]); // Set an empty array to avoid mapping over `undefined`
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nameFilter, roleFilter, emailFilter]);

  // Handle sorting
  const handleSort = () => {
    const sortedEmployees = [...employees].sort((a, b) => {
      const comparison = a.email.localeCompare(b.email);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    setEmployees(sortedEmployees);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Handle navigation to create new user page
  const handleCreateNewUser = () => {
    router.push('/employees/create'); // Navigate to the "/create" page when clicked
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-[92%]">
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>Employees List</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 w-full justify-between">
            <div className='flex gap-10'>

            <Input
              placeholder="Filter emails..."
              value={emailFilter}
              onChange={(event) => setEmailFilter(event.target.value)}
              className="max-w-sm"
            />
            <Button variant="secondary" className="bg-secondary" onClick={handleCreateNewUser}>
              Create New User
            </Button>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 bg-secondary">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Choose Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setRoleFilter('INTERN')}>Intern</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('ADMIN')}>Admin</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('ENGINEER')}>Engineer</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('')}>All</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell onClick={handleSort} className="cursor-pointer">
                  Email {sortOrder === 'asc' ? '▲' : '▼'}
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" animationDuration=".5s" />
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
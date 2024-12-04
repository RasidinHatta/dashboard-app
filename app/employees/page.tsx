'use client';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
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

  // Sorting state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('email');

  // Fetch data on filter change
  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (nameFilter) queryParams.append('name', nameFilter);
    if (roleFilter) queryParams.append('role', roleFilter);
    if (emailFilter) queryParams.append('email', emailFilter);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_LOCAL_API_BASE_URL;

    fetch(`${baseUrl}/api/employees?${queryParams.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
        setLoading(false);
      });
  }, [nameFilter, roleFilter, emailFilter]); // Re-fetch on filter changes

  // Sort employees
  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortColumn === 'email') {
      const emailA = a.email.toLowerCase();
      const emailB = b.email.toLowerCase();
      return sortOrder === 'asc' ? emailA.localeCompare(emailB) : emailB.localeCompare(emailA);
    }
    return 0;
  });

  return (
    <div className="flex items-center justify-center">
      <Card className="w-[80%]">
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>Employees List</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 w-full justify-between">
            <Input
              placeholder="Filter emails..."
              value={emailFilter}
              onChange={(event) => setEmailFilter(event.target.value)}
              className="max-w-sm"
            />
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
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
                <TableCell
                  onClick={() => {
                    setSortColumn('email');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer"
                >
                  Email {sortOrder === 'asc' ? '🔼' : '🔽'}
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                  </TableCell>
                </TableRow>
              ) : (
                sortedEmployees.map((employee) => (
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

'use client'
import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Employee {
  id: number;
  name: string;
  role: 'INTERN' | 'ADMIN' | 'ENGINEER';
  email: string;
}

export default function EmployeesPage() {
  const router = useRouter();

  const createEmployee = () => {
    router.push('/employees/create');
  };
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [nameFilter, setNameFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<'INTERN' | 'ADMIN' | 'ENGINEER' | ''>('');
  const [emailFilter, setEmailFilter] = useState('');

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null); // For deletion or editing
  const [editData, setEditData] = useState<Partial<Employee>>({}); // Temporary edit state

  // Sorting states for both email and name
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [nameSortOrder, setNameSortOrder] = useState<'asc' | 'desc'>('asc'); // Add separate state for name sorting

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // Define how many items per page

  const { toast } = useToast();

  //Session Management
  const { data: session } = useSession()
  const gettoken = session?.backend_token.accessToken

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (nameFilter) queryParams.append('name', nameFilter);
        if (roleFilter) queryParams.append('role', roleFilter);
        if (emailFilter) queryParams.append('email', emailFilter);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        console.log('baseUrl:', baseUrl);

        const response = await fetch(`${baseUrl}/api/employees?${queryParams.toString()}`);
        if (!response.ok) throw new Error(`API error: ${response.statusText}`);

        const data = await response.json();
        setEmployees(data);
        console.log('API response:', data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nameFilter, roleFilter, emailFilter]);

  // Pagination logic
  const currentEmployees = employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const handleSortByEmail = () => {
    const sortedEmployees = [...employees].sort((a, b) => {
      const comparison = a.email.localeCompare(b.email);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    setEmployees(sortedEmployees);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSortByName = () => {
    const sortedEmployees = [...employees].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return nameSortOrder === 'asc' ? comparison : -comparison;
    });
    setEmployees(sortedEmployees);
    setNameSortOrder(nameSortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDeleteConfirm = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    // Refresh the page
    window.location.reload();
    setDialogOpen(false);
    setSelectedEmployee(null);
  }

  const handleDelete = async () => {
    if (!selectedEmployee) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_LOCAL_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/employees/${selectedEmployee.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${gettoken}`,
        },
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      setEmployees(employees.filter((employee) => employee.id !== selectedEmployee.id));
      toast({
        title: 'Success!',
        description: `Employee "${selectedEmployee.name}" has been deleted.`,
      });

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the employee. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDialogOpen(false);
      setSelectedEmployee(null);
    }
  };

  const handleEditConfirm = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditData({ ...employee }); // Pre-fill form with current data
    setEditDialogOpen(true);
  };


  const handleEditCancel = () => {
    setEditDialogOpen(false)
    window.location.reload()
  }

  const handleEditSave = async () => {
    if (!selectedEmployee) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_LOCAL_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/employees/${selectedEmployee.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${gettoken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      toast({
        title: 'Success!',
        description: `Employee "${editData.name}" has been updated.`,
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
      setEditDialogOpen(false);
      setSelectedEmployee(null);
    }
  };


  return (
    <div className="flex items-center justify-center">
      <Card className="w-[92%]">
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>Employees List</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4'>
            <div className="flex gap-4 w-full justify-between">
              <div className='flex gap-5'>
                <Input
                  placeholder="Filter by name..."
                  value={nameFilter}
                  onChange={(event) => setNameFilter(event.target.value)}
                  className="max-w-sm"
                />
                <Input
                  placeholder="Filter emails..."
                  value={emailFilter}
                  onChange={(event) => setEmailFilter(event.target.value)}
                  className="max-w-sm"
                />
                <Button variant="secondary" className="bg-secondary" onClick={createEmployee}>
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
              <TableHeader className='bg-lime-500 dark:bg-purple-500'>
                <TableRow>
                  <TableCell className='w-[30%] cursor-pointer' onClick={handleSortByName}>
                    Name {nameSortOrder === 'asc' ? '▲' : '▼'}
                  </TableCell>
                  <TableCell className='w-[30%]' >Role</TableCell>
                  <TableCell className='w-[30%] cursor-pointer' onClick={handleSortByEmail}>
                    Email {sortOrder === 'asc' ? '▲' : '▼'}
                  </TableCell>
                  <TableCell className='w-[10%]'>Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loop to create 7 rows with Skeletons
                  [...Array(7)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="w-24 h-6" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-24 h-6" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-24 h-6" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-24 h-6" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  currentEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className='w-[30%]'>{employee.name}</TableCell>
                      <TableCell className='w-[30%]'>{employee.role.charAt(0).toUpperCase() + employee.role.slice(1).toLowerCase()}</TableCell>
                      <TableCell className='w-[30%]'>{employee.email}</TableCell>
                      <TableCell className='w-[10%]'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditConfirm(employee)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteConfirm(employee)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink onClick={() => setCurrentPage(index + 1)}>
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedEmployee?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={handleDeleteCancel}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update the details for "{selectedEmployee?.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={editData.name || ''}
              onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}

            />
            <Input
              placeholder="Email"
              value={editData.email || ''}
              onChange={(e) => setEditData((prev) => ({ ...prev, email: e.target.value }))}

            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">{editData.role || 'Select Role'}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setEditData((prev) => ({ ...prev, role: 'INTERN' }))}>Intern</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditData((prev) => ({ ...prev, role: 'ADMIN' }))}>Admin</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditData((prev) => ({ ...prev, role: 'ENGINEER' }))}>Engineer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DialogFooter className='gap-2'>
            <Button variant="secondary" onClick={handleEditCancel}>Cancel</Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';

interface Employee {
  id: number;
  name: string;
  role: 'INTERN' | 'ADMIN' | 'ENGINEER';  // Enum-like role values
  email: string;
}


export default function EmployeesPage() {
  // Employee state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [nameFilter, setNameFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<'INTERN' | 'ADMIN' | 'ENGINEER' | ''>('');
  const [emailFilter, setEmailFilter] = useState('');

  // Fetch filtered data when filters change
  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (nameFilter) queryParams.append('name', nameFilter);
    if (roleFilter) queryParams.append('role', roleFilter);
    if (emailFilter) queryParams.append('email', emailFilter);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


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
  }, [nameFilter, roleFilter, emailFilter]);  // Re-fetch on filter changes

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Employees List</h1>

      {/* Filter Inputs */}
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Search by name"
        />
      </div>

      <div>
        <label>Role:</label>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as 'INTERN' | 'ADMIN' | 'ENGINEER' | '')}
        >
          <option value="">All</option>
          <option value="INTERN">Intern</option>
          <option value="ADMIN">Admin</option>
          <option value="ENGINEER">Engineer</option>
        </select>
      </div>

      <div>
        <label>Email:</label>
        <input
          type="text"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          placeholder="Search by email"
        />
      </div>

      {/* Employee List */}
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name} - {employee.role} - {employee.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

// app/api/employees/route.js

export async function GET() {
    const res = await fetch('http://localhost:3001/api/employees');
  
    if (!res.ok) {
      return new Response('Failed to fetch data', { status: 500 });
    }
  
    const employees = await res.json();
    return new Response(JSON.stringify(employees), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
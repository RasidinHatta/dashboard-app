"use client"

import { MegaMenu } from 'primereact/megamenu';
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

    return (
        <div className="text-neutral-100 p-3">
            <MegaMenu model={items} orientation="horizontal" className='pl-20 gap-10 h-auto' />
        </div>
    );
}

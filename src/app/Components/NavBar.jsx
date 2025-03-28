'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        //Home
        { href: '/LoginScreen', label: 'Inicio' },
        
        //Registro
        { href: '/RegistrationForm', label: 'Registro' },
    ];

    return (
        <nav className="flex items-center space-x-4">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`
            ${pathname === item.href ? 'text-primary font-bold' : 'text-gray-600'}
            hover:text-primary transition-colors
            `}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Inicio' },

        //!Sobre COV 
        { href: '/Historia', label: 'Historia' },
        { href: '/GaleriaPresidentes', label: 'Galeria de Presidentes' },
        { href: '/JuntaDirectiva', label: 'Junta Directiva' },
        { href: '/LeyesReglamentos', label: 'Leyes y Reglamentosoria' },
        { href: '/DescargarLogo', label: 'Descargar Logo' },
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
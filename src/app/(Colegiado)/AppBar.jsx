"use client";

import {
    Description,
    EventNote,
    Forum,
    Home,
    Inbox,
    School
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useColegiadoUserStore from "@/store/colegiadoUserStore";

export default function AppBar({ solvencyInfo }) {
    const [selectedItem, setSelectedItem] = useState("Inicio");
    const pathname = usePathname();
    const colegiadoUser = useColegiadoUserStore((state) => state.colegiadoUser)

    // Actualizar elemento seleccionado basado en la ruta actual
    useEffect(() => {
        if (pathname === "/") {
            setSelectedItem("Inicio");
        } else if (pathname.includes("/Solicitudes")) {
            setSelectedItem("Solicitudes");
        } else if (pathname.includes("/eventos")) {
            setSelectedItem("Eventos");
        } else if (pathname.includes("/cursos")) {
            setSelectedItem("Cursos");
        } else if (pathname.includes("/notificaciones")) {
            setSelectedItem("Notificaciones");
        } else if (pathname.includes("/bandeja")) {
            setSelectedItem("Bandeja");
        } else if (pathname.includes("/perfil")) {
            setSelectedItem("Perfil");
        }
    }, [pathname]);

    return (
        <div className="h-full w-full">
            {/* Logo */}
            <div className="p-4 sm:p-8">
                <Link href="/">
                    <Image
                        src="/assets/logo.png"
                        alt="Colegio de Odontólogos de Venezuela"
                        width={220}
                        height={80}
                        className="mx-auto"
                    />
                </Link>
            </div>

            {/* Separador */}
            <div className="border-t border-gray-300/40 w-11/12 mx-auto"></div>

            {/* Menú */}
            <nav className="mt-6 space-y-6">
                <SidebarItem
                    icon={<Home className="h-5 w-5" />}
                    text="Inicio"
                    active={selectedItem === "Inicio"}
                    href="/Colegiado"
                />
                <Divider />
                <SidebarItem
                    icon={<Description className="h-5 w-5" />}
                    text="Solicitudes"
                    active={selectedItem === "Solicitudes"}
                    href="/Solicitudes"
                />
                <Divider />
                <SidebarItem
                    icon={<EventNote className="h-5 w-5" />}
                    text="Eventos"
                    active={selectedItem === "Eventos"}
                    href="/eventos"
                />
                <Divider />
                <SidebarItem
                    icon={<School className="h-5 w-5" />}
                    text="Cursos"
                    active={selectedItem === "Cursos"}
                    href="/cursos"
                />
                <Divider />
                <SidebarItem
                    icon={<Forum className="h-5 w-5" />}
                    text="Notificaciones"
                    active={selectedItem === "Notificaciones"}
                    href="/notificaciones"
                />
                <Divider />
                <SidebarItem
                    icon={<Inbox className="h-5 w-5" />}
                    text="Bandeja"
                    active={selectedItem === "Bandeja"}
                    href="/bandeja"
                />
                <Divider />

                {/* Ítem de Solvencia (solo visible en md, sm y móviles) */}
                <div className="my-4 w-5/6 mx-auto px-4 py-3 bg-white/5 rounded-lg md:block md:hidden lg:hidden">
                    <div className="flex items-center">
                        <div className="flex flex-col">
                            <span className="text-md text-gray-300 mb-2">Estado:</span>
                            <span className="text-[16px] font-semibold text-white">
                                <span
                                    className={colegiadoUser?.solvencia_status ? "text-green-400" : "text-red-400"}
                                >
                                    {colegiadoUser?.solvencia_status ? "Solvente" : "No Solvente"}
                                </span>{" "}
                                hasta: {colegiadoUser?.solvente}
                            </span>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

function SidebarItem({ icon, text, active, href }) {
    return (
        <Link
            href={href}
            className={`flex items-center px-4 py-2 rounded-lg mx-auto transition-colors w-4/5 ${active
                    ? "bg-gray-200 text-[#41023B] font-bold"
                    : "bg-transparent text-white/60 hover:bg-[#41023B] hover:text-white"
                }`}
        >
            <span className="mr-3">{icon}</span>
            <span className="whitespace-nowrap">{text}</span>
        </Link>
    );
}

function Divider() {
    return <div className="border-t border-gray-300/40 w-4/5 mx-auto"></div>;
}
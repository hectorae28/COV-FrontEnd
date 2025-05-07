"use client";

import { fetchMe } from "@/api/endpoints/colegiado";
import Chat from "@/app/(Colegiado)/Chat";
import DashboardLayout from "@/Components/DashboardLayout";
import Perfil from "@/Components/Perfil/Perfil";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function PerfilPage() {
    const [userInfo, setUserInfo] = useState(null);
    const [isSolvent, setIsSolvent] = useState(true);
    const [showSolvencyWarning, setShowSolvencyWarning] = useState(false);
    const { data: session, status } = useSession();

    // Efecto para cargar la información del usuario
    useEffect(() => {
        if (status === "loading") return;

        if (session) {
            fetchMe(session)
                .then((response) => {
                    setUserInfo(response.data);

                    // Verificar estado de solvencia
                    if (response.data?.solvente) {
                        const today = new Date();
                        const [day, month, year] = response.data.solvente.split("-").map(Number);
                        const solvencyDate = new Date(year, month - 1, day);
                        const warningDate = new Date(solvencyDate);
                        warningDate.setDate(warningDate.getDate() - 14);

                        if (today > solvencyDate) {
                            setIsSolvent(false);
                        } else if (today >= warningDate) {
                            setShowSolvencyWarning(true);
                        }
                    }
                })
                .catch((error) => console.error("Error fetching user info:", error));
        }
    }, [session, status]);

    // Mientras carga la información
    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D7008A]"></div>
            </div>
        );
    }

    // Si no hay sesión activa, redireccionar (en un entorno real)
    if (status === "unauthenticated") {
        // Aquí se podría usar router.push("/login") en una app real
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-2xl font-bold text-[#41023B] mb-4">Acceso no autorizado</h1>
                <p className="text-gray-600 mb-6">Debes iniciar sesión para ver esta página</p>
                <a
                    href="/Login"
                    className="bg-[#D7008A] text-white px-6 py-2 rounded-lg hover:bg-[#41023B] transition-colors"
                >
                    Iniciar Sesión
                </a>
            </div>
        );
    }

    const solvencyInfo = {
        date: userInfo?.solvente || "01-01-2025",
    };

    return (
        <DashboardLayout
            solvencyInfo={solvencyInfo.date}
            isSolvent={isSolvent}
            showSolvencyWarning={showSolvencyWarning}
            userInfo={userInfo}
            session={session}
        >
            <Perfil userInfo={userInfo} />
            <Chat />
        </DashboardLayout>
    );
}
"use client";
import DetallePendiente from "@/app/Components/Solicitudes/ListaColegiados/DetallePendiente";

export default function DetallePendienteWrapper({ id, isAdmin }) {
    const handleAprobarPendiente = () => {
        alert('tiene vida');
    };
    
    return (
        <DetallePendiente
            params={{ id }}
            onVolver={handleAprobarPendiente}
            isAdmin={isAdmin}
        />
    );
}
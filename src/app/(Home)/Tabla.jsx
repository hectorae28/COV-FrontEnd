"use client";

import { useState, useEffect } from "react";

export default function Tabla() {
    const [historialSolicitudes, setHistorialSolicitudes] = useState([
        { tipo: "Solvencia", fecha: "01/01/2023", costo: "$20" },
        { tipo: "Constancia", fecha: "02/01/2023", costo: "$15" },
        { tipo: "Carnet", fecha: "15/02/2023", costo: "$25" },
        { tipo: "Multiple", fecha: "10/03/2023", costo: "$40" },
    ]);

    // Sort solicitudes by date (most recent first) when component mounts or historialSolicitudes changes
    useEffect(() => {
        const sortedSolicitudes = [...historialSolicitudes].sort((a, b) => {
            // Convert DD/MM/YYYY to Date objects for comparison
            const dateA = new Date(a.fecha.split('/').reverse().join('-'));
            const dateB = new Date(b.fecha.split('/').reverse().join('-'));
            return dateB - dateA; // Sort in descending order (most recent first)
        });
        
        setHistorialSolicitudes(sortedSolicitudes);
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold text-black mb-4 ml-12">
                Historial Solicitudes
            </h2>
            <div className="bg-white shadow overflow-hidden rounded-lg mb-20">
                <table className="min-w-full divide-y divide-gray-200">
                    {/* Encabezado de la tabla */}
                    <thead>
                        {/* Contenedor del degradado para toda la fila */}
                        <tr className="bg-gradient-to-t from-[#D7008A] to-[#41023B]">
                            <th
                                scope="col"
                                className="px-6 py-3 text-white text-center text-sm font-bold uppercase tracking-wider"
                            >
                                Tipo
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-white text-center text-sm font-bold uppercase tracking-wider"
                            >
                                Fecha
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-white text-center text-sm font-bold uppercase tracking-wider"
                            >
                                Costo
                            </th>
                        </tr>
                    </thead>

                    {/* Cuerpo de la tabla */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {historialSolicitudes.length > 0 ? (
                            historialSolicitudes.map((solicitud, index) => (
                                <tr 
                                    key={index} 
                                    className={index % 2 === 0 ? "bg-white" : "bg-[#f2f2f2ff]"}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                        {solicitud.tipo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                        {solicitud.fecha}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                        {solicitud.costo}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                                >
                                    No hay solicitudes registradas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
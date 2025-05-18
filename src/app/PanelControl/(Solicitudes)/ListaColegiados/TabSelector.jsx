// TabSelector.jsx
import { fetchDataUsuario } from "@/api/endpoints/colegiado";
import { useEffect, useState } from "react";

export default function TabSelector({
    tabActivo,
    setTabActivo,
    setCurrentPage
}) {
    // Estado para almacenar los contadores
    const [contadores, setContadores] = useState({
        pendientes: 0,
        rechazados: 0,
        anulados: 0,
        registrados: 0
    });

    // Efecto para cargar todos los datos necesarios para los contadores
    //para el futuro hector en diferentes stores
    useEffect(() => {
        const cargarContadores = async () => {
            try {
                // Cargar datos sin filtros para obtener todos los registros
                const [pendientesResponse, colegiadosResponse] = await Promise.all([
                    fetchDataUsuario("register"),  // Obtener todos los pendientes
                    fetchDataUsuario("colegiado")  // Obtener todos los colegiados
                ]);

                // Extraer los resultados
                const pendientes = pendientesResponse.data.results || [];
                const colegiados = colegiadosResponse.data.results || [];

                // Calcular contadores
                const pendientesCount = pendientes.filter(p => p.status === "revisando").length;
                console.log({ pendientes, pendientesCount })
                const rechazadosCount = pendientes.filter(p => p.status === "rechazado").length;
                const anuladosCount = pendientes.filter(p => p.status === "denegado" || p.estado === "Anuladas").length;
                const registradosCount = colegiados.length;

                // Actualizar contadores
                setContadores({
                    pendientes: pendientesCount,
                    rechazados: rechazadosCount,
                    anulados: anuladosCount,
                    registrados: registradosCount
                });
            } catch (error) {
                console.error("Error al cargar contadores:", error);
            }
        };

        // Cargar contadores al inicio
        cargarContadores();

        // Actualizar periódicamente
        const intervalo = setInterval(cargarContadores, 60000); // Cada minuto

        return () => clearInterval(intervalo);
    }, []);

    // Manejadores de clic para cada tab
    const handleClickPendientes = () => {
        setTabActivo("pendientes");
        setCurrentPage(1);
    };

    const handleClickRechazados = () => {
        setTabActivo("rechazados");
        setCurrentPage(1);
    };

    const handleClickAnulados = () => {
        setTabActivo("anulados");
        setCurrentPage(1);
    };

    const handleClickRegistrados = () => {
        setTabActivo("registrados");
        setCurrentPage(1);
    };

    return (
        <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-4 flex-wrap">
                <button
                    className={`py-4 cursor-pointer px-1 font-medium text-sm sm:text-base border-b-2 ${tabActivo === "pendientes"
                        ? "border-[#C40180] text-[#C40180]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        } transition-colors`}
                    onClick={handleClickPendientes}
                >
                    Pendientes por Aprobación ({contadores.pendientes})
                </button>

                <button
                    className={`py-4 cursor-pointer px-1 font-medium text-sm sm:text-base border-b-2 ${tabActivo === "rechazados"
                        ? "border-[#C40180] text-[#C40180]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        } transition-colors`}
                    onClick={handleClickRechazados}
                >
                    Rechazados ({contadores.rechazados})
                </button>

                <button
                    className={`py-4 cursor-pointer px-1 font-medium text-sm sm:text-base border-b-2 ${tabActivo === "anulados"
                        ? "border-[#C40180] text-[#C40180]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        } transition-colors`}
                    onClick={handleClickAnulados}
                >
                    Anulados ({contadores.anulados})
                </button>

                <button
                    className={`py-4 px-1 cursor-pointer font-medium text-sm sm:text-base border-b-2 ${tabActivo === "registrados"
                        ? "border-[#C40180] text-[#C40180]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        } transition-colors`}
                    onClick={handleClickRegistrados}
                >
                    Colegiados Registrados ({contadores.registrados})
                </button>
            </nav>
        </div>
    );
}
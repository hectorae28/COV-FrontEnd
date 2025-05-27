import Pagination from "@/Components/Paginations.jsx";
import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    CheckCircle,
    Search,
    UserX,
    XCircle
} from "lucide-react";

export default function DataTable({
    tabActivo,
    loading,
    colegiados,
    colegiadosPendientes,
    verDetalleColegiado,
    verDetallePendiente,
    ordenFecha,
    toggleOrdenFecha,
    currentPage,
    colegiadosPagination,
    colegiadosPendientesPagination,
    setCurrentPage,
    recordsPerPage
}) {
    // Obtener la fecha formateada - ahora sin hora
    const obtenerFechaFormateada = (fechaStr) => {
        if (!fechaStr) return "-";
        try {
            const fecha = new Date(fechaStr);
            const dia = String(fecha.getDate()).padStart(2, "0");
            const mes = String(fecha.getMonth() + 1).padStart(2, "0");
            const año = fecha.getFullYear();
            return `${dia}/${mes}/${año}`;
        } catch (e) {
            return fechaStr || "-";
        }
    };

    // Si está cargando, mostrar spinner
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
            </div>
        );
    }

    // Verificar si no hay datos para mostrar
    const noDataMessage = () => {
        let icon = <Search size={48} className="text-gray-300" />;
        let title = "No se encontraron registros";
        let desc = "No hay registros que coincidan con tu búsqueda";

        if (tabActivo === "anulados") {
            icon = <UserX size={48} className="text-gray-300" />;
            title = "No hay solicitudes anuladas";
            desc = "No se han anulado solicitudes";
        } else if (tabActivo === "rechazados") {
            icon = <AlertCircle size={48} className="text-gray-300" />;
            title = "No hay solicitudes rechazadas";
            desc = "No se han rechazado solicitudes";
        } else if (tabActivo === "pendientes") {
            icon = <CheckCircle size={48} className="text-gray-300" />;
            title = "No hay solicitudes pendientes";
            desc = "Todas las solicitudes han sido procesadas";
        }

        return (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-center mb-4">{icon}</div>
                <h3 className="text-lg font-medium text-gray-500">{title}</h3>
                <p className="text-gray-400 mt-1">{desc}</p>
            </div>
        );
    };

    // Comprobar si no hay datos para mostrar
    if ((tabActivo === "registrados" && colegiados.length === 0) ||
        (tabActivo !== "registrados" && colegiadosPendientes.length === 0)) {
        return noDataMessage();
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {tabActivo === "registrados" && (
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                N° COV
                            </th>
                        )}
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                        </th>
                        {/* N° Registro solo para colegiados registrados */}
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Cédula
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            <button
                                className="cursor-pointer flex items-center justify-center gap-1 w-full"
                                onClick={toggleOrdenFecha}
                            >
                                {tabActivo === "registrados" ? "FECHA REGISTRO" : "FECHA SOLICITUD"}
                                {ordenFecha === "desc" ? (
                                    <ArrowDown size={14} className="text-purple-600" />
                                ) : (
                                    <ArrowUp size={14} className="text-purple-600" />
                                )}
                            </button>
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                            Profesión/Ocupación
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tabActivo === "registrados" ? (
                        // Colegiados registrados
                        colegiados.map((colegiado, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => verDetalleColegiado(colegiado.id)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-center hidden md:table-cell">
                                    {colegiado.num_cov || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="font-medium text-gray-900">
                                        {colegiado.recaudos.persona.nombre+" "+colegiado.recaudos.persona.primer_apellido || "-"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell">
                                    {colegiado.recaudos.persona.identificacion || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center hidden md:table-cell">
                                    {obtenerFechaFormateada(colegiado.recaudos.fecha_registro_principal)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center hidden lg:table-cell">
                                    {colegiado.recaudos.tipo_profesion_display}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colegiado.solvencia_status
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {colegiado.solvencia_status ? "Solvente" : "No Solvente"}
                                    </span>
                                    {colegiado.solicitudes &&
                                        colegiado.solicitudes.length > 0 && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                                                Solicitudes
                                            </span>
                                        )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        // Pendientes, rechazados o anulados
                        colegiadosPendientes.map((pendiente, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => verDetallePendiente(pendiente.id)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="font-medium text-gray-900">
                                        {pendiente.persona.nombre + " " + pendiente.persona.primer_apellido}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell">
                                    {pendiente.persona.identificacion}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center hidden md:table-cell">
                                    {obtenerFechaFormateada(pendiente.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center hidden lg:table-cell">
                                    {pendiente.tipo_profesion_display || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex flex-col sm:flex-row gap-1 justify-center items-center">
                                        {pendiente.status === "rechazado" ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                <AlertCircle size={12} /> Rechazada
                                            </span>
                                        ) : pendiente.status === "anulado" ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <UserX size={12} /> Anulada
                                            </span>
                                        ) : pendiente.status === "revisando" ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <CheckCircle size={12} /> Pendiente por aprobación
                                            </span>
                                        ) : (
                                            <>
                                                {pendiente.archivos_faltantes?.tiene_faltantes && (
                                                    <span
                                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                                                    >
                                                        <XCircle size={12} /> Documentos Incompletos
                                                    </span>
                                                )}
                                                {pendiente.pago === null &&
                                                    pendiente.pago_exonerado && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1 sm:mt-0 sm:ml-2">
                                                            <XCircle size={12} /> Pagos Exonerado
                                                        </span>
                                                    )}
                                                {pendiente.pago === null &&
                                                    !pendiente.pago_exonerado && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1 sm:mt-0 sm:ml-2">
                                                            <XCircle size={12} /> Pagos Pendientes
                                                        </span>
                                                    )}
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(
                    (tabActivo === "registrados"
                        ? (colegiadosPagination.count || 0)
                        : (colegiadosPendientesPagination.count || 0)) /
                    recordsPerPage
                )}
                onPageChange={setCurrentPage}
                onNextPage={() => setCurrentPage((prev) => prev + 1)}
                onPrevPage={() => setCurrentPage((prev) => prev - 1)}
                isNextDisabled={tabActivo === "registrados"
                    ? !colegiadosPagination.next
                    : !colegiadosPendientesPagination.next}
                isPrevDisabled={tabActivo === "registrados"
                    ? !colegiadosPagination.previous
                    : !colegiadosPendientesPagination.previous}
            />
        </div>
    );
}
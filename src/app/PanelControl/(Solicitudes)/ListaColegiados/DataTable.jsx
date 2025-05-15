import Pagination from "@/Components/Paginations.jsx";
import {
    AlertCircle,
    ArrowUpDown,
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
    ordenFechaRegistrados,
    toggleOrdenFecha,
    toggleOrdenFechaRegistrados,
    currentPage,
    colegiadosPagination,
    colegiadosPendientesPagination,
    setCurrentPage,
    recordsPerPage
}) {
    // Función para filtrar los pendientes según el tab activo
    const obtenerPendientesFiltrados = () => {
        // if (tabActivo === "pendientes") {
        //     return colegiadosPendientes.filter(p => p.status === "revisando");
        // } else if (tabActivo === "rechazados") {
        //     return colegiadosPendientes.filter(p => p.status === "rechazado");
        // } else if (tabActivo === "anulados") {
        //     return colegiadosPendientes.filter(p => p.status === "denegado" || p.estado === "Anuladas");
        // }
        return colegiadosPendientes;
    };

    // Obtener la fecha formateada
    const obtenerFechaFormateada = (fechaStr) => {
        if (!fechaStr) return "-";
        try {
            const fecha = new Date(fechaStr);
            const dia = String(fecha.getDate()).padStart(2, "0");
            const mes = String(fecha.getMonth() + 1).padStart(2, "0");
            const año = fecha.getFullYear();
            const horas = String(fecha.getHours()).padStart(2, "0");
            const minutos = String(fecha.getMinutes()).padStart(2, "0");
            const segundos = String(fecha.getSeconds()).padStart(2, "0");
            return `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
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

    // Tabla de colegiados registrados
    if (tabActivo === "registrados") {
        if (colegiados.length === 0) {
            return (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-center mb-4">
                        <Search size={48} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-500">
                        No se encontraron colegiados
                    </h3>
                    <p className="text-gray-400 mt-1">
                        No hay registros que coincidan con tu búsqueda
                    </p>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                Cédula
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                N° Registro
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                <button
                                    className="cursor-pointer flex items-center justify-center gap-1 w-full"
                                    onClick={toggleOrdenFechaRegistrados}
                                >
                                    FECHA REGISTRO
                                    <ArrowUpDown
                                        size={14}
                                        className={`transition-transform ${ordenFechaRegistrados === "desc"
                                            ? "text-purple-600"
                                            : "text-gray-400 rotate-180"
                                            }`}
                                    />
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
                        {colegiados.map((colegiado, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => verDetalleColegiado(colegiado.id)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="font-medium text-gray-900">
                                        {colegiado.recaudos.persona.nombre || "-"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell">
                                    {colegiado.recaudos.persona.identificacion || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center hidden md:table-cell">
                                    {colegiado.recaudos.num_registro_principal || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center hidden md:table-cell">
                                    {colegiado.recaudos.fecha_registro_principal || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center hidden lg:table-cell">
                                    {colegiado.especialidades.map(
                                        (especialidad, index) => (
                                            <div key={index}>
                                                <span>
                                                    {especialidad?.nombre == undefined
                                                        ? "-"
                                                        : especialidad?.nombre}
                                                </span>
                                                <br />
                                            </div>
                                        )
                                    )}
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
                        ))}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                        (colegiadosPagination.count || 0) /
                        recordsPerPage
                    )}
                    onPageChange={setCurrentPage}
                    onNextPage={() => setCurrentPage((prev) => prev + 1)}
                    onPrevPage={() => setCurrentPage((prev) => prev - 1)}
                    isNextDisabled={!colegiadosPagination.next}
                    isPrevDisabled={!colegiadosPagination.previous}
                />
            </div>
        );
    }

    // Tabla de colegiados pendientes, rechazados o anulados
    const pendientesFiltrados = obtenerPendientesFiltrados();

    if (pendientesFiltrados.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-center mb-4">
                    {tabActivo === "anulados" ? (
                        <UserX size={48} className="text-gray-300" />
                    ) : tabActivo === "rechazados" ? (
                        <AlertCircle size={48} className="text-gray-300" />
                    ) : (
                        <CheckCircle size={48} className="text-gray-300" />
                    )}
                </div>
                <h3 className="text-lg font-medium text-gray-500">
                    {tabActivo === "anulados"
                        ? "No hay solicitudes anuladas"
                        : tabActivo === "rechazados"
                            ? "No hay solicitudes rechazadas"
                            : "No hay solicitudes pendientes"}
                </h3>
                <p className="text-gray-400 mt-1">
                    {tabActivo === "anulados"
                        ? "No se han anulado solicitudes"
                        : tabActivo === "rechazados"
                            ? "No se han rechazado solicitudes"
                            : "Todas las solicitudes han sido procesadas"}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Cédula
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            <button
                                className="cursor-pointer flex items-center justify-center gap-1 w-full"
                                onClick={toggleOrdenFecha}
                            >
                                FECHA SOLICITUD
                                <ArrowUpDown
                                    size={14}
                                    className={`transition-transform ${ordenFecha === "desc"
                                        ? "text-purple-600"
                                        : "text-gray-400 rotate-180"
                                        }`}
                                />
                            </button>
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {pendientesFiltrados.map((pendiente, index) => (
                        <tr
                            key={index}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => verDetallePendiente(pendiente.id)}
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="font-medium text-gray-900">
                                    {pendiente.persona.nombre + " " + pendiente.persona.primer_apellido}
                                </div>
                                <div className="text-sm text-gray-500 md:hidden">
                                    {pendiente.persona.cedula}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell">
                                {pendiente.persona.identificacion}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center hidden md:table-cell">
                                {obtenerFechaFormateada(pendiente.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex flex-col sm:flex-row gap-1 justify-center items-center">
                                    {pendiente.status === "rechazado" ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                            <AlertCircle size={12} /> Rechazada
                                        </span>
                                    ) : pendiente.status === "denegado" ? (
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
                    ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(
                    (colegiadosPendientesPagination.count || 0) /
                    recordsPerPage
                )}
                onPageChange={setCurrentPage}
                onNextPage={() => setCurrentPage((prev) => prev + 1)}
                onPrevPage={() => setCurrentPage((prev) => prev - 1)}
                isNextDisabled={!colegiadosPendientesPagination.next}
                isPrevDisabled={!colegiadosPendientesPagination.previous}
            />
        </div>
    );
}
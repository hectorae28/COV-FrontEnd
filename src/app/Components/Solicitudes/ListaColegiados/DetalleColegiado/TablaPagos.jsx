import {
    AlertCircle,
    CheckCircle,
    CreditCard,
    Search,
    X,
    FileText,
    Download
} from "lucide-react";
import { useEffect, useState } from "react";
import useDataListaColegiados from "@/app/Models/PanelControl/Solicitudes/ListaColegiadosData";
import ComprobantesSection from "./ComprobantesSection";
import RegistroPagoModal from "./RegistroPagoModal";

export default function TablaPagos({ colegiadoId, handleVerDocumento, documentos }) {
    // Obtener funciones del store centralizado
    const {
        getPagos,
        addPago,
        getColegiado,
        updateColegiado
    } = useDataListaColegiados();

    // Estados locales
    const [pagos, setPagos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showRegistroPago, setShowRegistroPago] = useState(false);
    const [nuevoPago, setNuevoPago] = useState({
        concepto: "",
        referencia: "",
        monto: "",
        metodoPago: "Transferencia bancaria"
    });
    const [pagoRegistrado, setPagoRegistrado] = useState(false);

    // Cargar pagos del colegiado
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Obtener pagos desde el store centralizado
                const pagosColegiado = getPagos(colegiadoId);
                setPagos(pagosColegiado);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [colegiadoId, getPagos]);

    // Función para registrar un nuevo pago
    const handleRegistrarPago = async () => {
        // Validación de campos requeridos
        if (!nuevoPago.concepto || !nuevoPago.referencia || !nuevoPago.monto) {
            alert("Por favor complete todos los campos requeridos");
            return;
        }

        try {
            // Simular procesamiento
            await new Promise(resolve => setTimeout(resolve, 800));

            const pagoParaRegistrar = {
                ...nuevoPago,
                fecha: new Date().toLocaleDateString(),
                estado: "Pagado",
                monto: parseFloat(nuevoPago.monto),
                comprobante: false
            };

            // Añadir pago al store centralizado
            addPago(colegiadoId, pagoParaRegistrar);

            // Refrescar la lista de pagos
            setPagos(getPagos(colegiadoId));

            // Verificar si el pago hace que el colegiado sea solvente
            const colegiado = getColegiado(colegiadoId);
            if (colegiado && !colegiado.solvente && nuevoPago.concepto.toLowerCase().includes('cuota')) {
                // Actualizar estado de solvencia
                updateColegiado(colegiadoId, { solvente: true });
            }

            // Mostrar notificación de éxito
            setPagoRegistrado(true);
            setTimeout(() => setPagoRegistrado(false), 3000);

            // Resetear formulario
            setNuevoPago({
                concepto: "",
                referencia: "",
                monto: "",
                metodoPago: "Transferencia bancaria"
            });

            // Cerrar modal
            setShowRegistroPago(false);
        } catch (error) {
            console.error("Error al registrar pago:", error);
        }
    };

    // Filtrar pagos según el término de búsqueda
    const pagosFiltrados = pagos.filter(pago =>
        pago.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pago.referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pago.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pago.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pago.metodoPago?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcular totales
    const totalPagado = pagos
        .filter(pago => pago.estado === "Pagado")
        .reduce((suma, pago) => suma + pago.monto, 0);

    const totalPendiente = pagos
        .filter(pago => pago.estado === "Pendiente")
        .reduce((suma, pago) => suma + pago.monto, 0);

    // Obtener datos del colegiado
    const colegiado = getColegiado(colegiadoId);

    return (
        <div className="space-y-6">
            {/* Notificación de éxito */}
            {pagoRegistrado && (
                <div className="bg-green-100 text-green-800 p-4 rounded-md flex items-start justify-between">
                    <div className="flex items-center">
                        <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                        <span>El pago ha sido registrado correctamente.</span>
                    </div>
                    <button
                        onClick={() => setPagoRegistrado(false)}
                        className="text-green-700"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Pagos y cuotas</h3>
                    <p className="text-sm text-gray-500 mt-1">Historial de pagos y estado de cuotas</p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar pago..."
                            className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>

                    <button
                        onClick={() => setShowRegistroPago(true)}
                        className="bg-[#C40180] text-white px-4 py-2 rounded-md hover:bg-[#590248] transition-colors flex items-center justify-center gap-2"
                    >
                        <CreditCard size={18} />
                        <span>Registrar pago</span>
                    </button>
                </div>
            </div>

            {/* Resumen de pagos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Total pagado</p>
                    <p className="text-xl font-semibold text-green-600">${totalPagado.toFixed(2)}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Pendiente por pagar</p>
                    <p className="text-xl font-semibold text-red-600">${totalPendiente.toFixed(2)}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Estado general</p>
                    <p className={`text-lg font-semibold flex items-center ${totalPendiente > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {totalPendiente > 0 ? (
                            <>
                                <AlertCircle size={18} className="mr-1" />
                                Pagos pendientes
                            </>
                        ) : (
                            <>
                                <CheckCircle size={18} className="mr-1" />
                                Al día
                            </>
                        )}
                    </p>
                </div>
            </div>

            {/* Sección de comprobantes de pago */}
            <ComprobantesSection
                documentos={documentos}
                handleVerDocumento={handleVerDocumento}
            />

            {/* Tabla de pagos */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
                </div>
            ) : (
                <>
                    {pagosFiltrados.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <CreditCard size={48} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-500">No se encontraron pagos</h3>
                            <p className="text-gray-400 mt-1">No hay registros de pago que coincidan con tu búsqueda</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Concepto
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Referencia
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Monto
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pagosFiltrados.map((pago) => (
                                            <tr key={pago.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="font-medium text-gray-900">{pago.concepto}</div>
                                                    <div className="text-sm text-gray-500">{pago.metodoPago}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                    {pago.referencia}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                    {pago.fecha}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        ${pago.monto.toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pago.estado === 'Pagado'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {pago.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                    <div className="flex justify-center space-x-2">
                                                        {pago.comprobante && (
                                                            <button
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Descargar comprobante"
                                                            >
                                                                <Download size={18} />
                                                            </button>
                                                        )}
                                                        <button
                                                            className="text-purple-600 hover:text-purple-800"
                                                            title="Ver detalles"
                                                        >
                                                            <FileText size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal para registrar nuevo pago */}
            {showRegistroPago && colegiado && (
                <RegistroPagoModal
                    onClose={() => setShowRegistroPago(false)}
                    onRegistrarPago={handleRegistrarPago}
                    nuevoPago={nuevoPago}
                    setNuevoPago={setNuevoPago}
                    nombreColegiado={colegiado.nombre}
                    numeroRegistro={colegiado.numeroRegistro}
                    cedula={colegiado.cedula}
                />
            )}
        </div>
    );
}
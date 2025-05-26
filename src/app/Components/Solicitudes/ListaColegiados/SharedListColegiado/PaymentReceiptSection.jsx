"use client";

import { motion } from "framer-motion";
import {
    AlertCircle,
    ArrowLeft,
    Check,
    CheckCircle,
    Copy,
    CreditCard,
    DollarSign,
    Eye,
    Upload,
    X,
    XCircle
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchDataSolicitudes } from "@/api/endpoints/landingPage";

export default function PaymentReceiptSection({
    comprobanteData,
    onUploadComprobante,
    onViewComprobante,
    onStatusChange,
    readOnly = false,
    isAdmin = false
}) {
    // Estados existentes
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [showUploadModal, setShowUploadModal] = useState(false);
    const fileInputRef = useRef(null);

    // Estados para métodos de pago
    const [metodoPago, setMetodoPago] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [showMethodSelection, setShowMethodSelection] = useState(false);
    const [tasaBCV, setTasaBCV] = useState(0);
    
    // Estados para datos de pago
    const [referenceNumber, setReferenceNumber] = useState("");
    const [paymentDate, setPaymentDate] = useState({
        day: "",
        month: "",
        year: ""
    });
    const [montoEnBs, setMontoEnBs] = useState("");
    
    // Estados para copiar
    const [copiedAccount, setCopiedAccount] = useState(false);
    const [copiedRif, setCopiedRif] = useState(false);

    // Verificar si hay comprobante
    const hasComprobante = comprobanteData?.url || comprobanteData?.archivo;
    const isApproved = comprobanteData?.status === 'approved';
    const isRejected = comprobanteData?.status === 'rechazado';

    // Datos de los meses
    const months = [
        { value: "01", label: "Enero" },
        { value: "02", label: "Febrero" },
        { value: "03", label: "Marzo" },
        { value: "04", label: "Abril" },
        { value: "05", label: "Mayo" },
        { value: "06", label: "Junio" },
        { value: "07", label: "Julio" },
        { value: "08", label: "Agosto" },
        { value: "09", label: "Septiembre" },
        { value: "10", label: "Octubre" },
        { value: "11", label: "Noviembre" },
        { value: "12", label: "Diciembre" }
    ];

    // Generar años
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 13 }, (_, i) => {
        const year = currentYear - 10 + i;
        return { value: year.toString(), label: year.toString() };
    });

    // Generar días según el mes y año
    const getDaysInMonth = (year, month) => {
        if (!year || !month) return [];
        const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            return {
                value: day < 10 ? `0${day}` : day.toString(),
                label: day.toString()
            };
        });
    };

    // Verificar si hay más de 4 métodos de pago para cambiar el estilo de visualización
    const showAsList = metodoPago.length > 4;

    // Cargar datos iniciales
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Cargar tasa BCV
                const tasa = await fetchDataSolicitudes("tasa-bcv");
                setTasaBCV(tasa.data.rate);

                // Cargar métodos de pago activos
                const metodos = await fetchDataSolicitudes("metodo-de-pago");
                const metodosActivos = metodos.data.filter(metodo => metodo.activo === true);
                setMetodoPago(metodosActivos);
                console.log("Métodos de pago activos cargados:", metodosActivos);
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };

        loadInitialData();
    }, []);

    // Función para copiar solo números al portapapeles
    const copyToClipboard = async (text, type) => {
        try {
            const numbersToCopy = text.replace(/\D/g, '');
            await navigator.clipboard.writeText(numbersToCopy);

            if (type === 'account') {
                setCopiedAccount(true);
                setTimeout(() => setCopiedAccount(false), 2000);
            } else if (type === 'rif') {
                setCopiedRif(true);
                setTimeout(() => setCopiedRif(false), 2000);
            }
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    // Manejar cambios en la fecha
    const handleDateChange = (field, value) => {
        const newDate = { ...paymentDate, [field]: value };
        setPaymentDate(newDate);

        if ((field === 'year' || field === 'month') && newDate.day) {
            const daysInMonth = getDaysInMonth(newDate.year, newDate.month);
            const dayExists = daysInMonth.some(day => day.value === newDate.day);
            if (!dayExists) {
                setPaymentDate(prev => ({ ...prev, day: "" }));
            }
        }
    };

    // Manejar selección de método de pago
    const handleSelectPaymentMethod = (metodo) => {
        setPaymentMethod({
            nombre: metodo.datos_adicionales.slug,
            metodoId: metodo.id,
            datos: metodo
        });
        setShowMethodSelection(false);
    };

    // Manejar selección de archivo
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ["application/pdf", "image/jpeg", "image/png"];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            setError("Tipo de archivo no válido. Por favor suba un archivo PDF, JPG o PNG.");
            setSelectedFile(null);
            return;
        }

        if (file.size > maxSize) {
            setError("El archivo es demasiado grande. El tamaño máximo es 5MB.");
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        setError("");
    };

    // Manejar drag & drop
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            const validTypes = ["application/pdf", "image/jpeg", "image/png"];
            const maxSize = 5 * 1024 * 1024;

            if (!validTypes.includes(file.type)) {
                setError("Tipo de archivo no válido. Por favor suba un archivo PDF, JPG o PNG.");
                return;
            }

            if (file.size > maxSize) {
                setError("El archivo es demasiado grande. El tamaño máximo es 5MB.");
                return;
            }

            setSelectedFile(file);
            setError("");
        }
    };

    // Manejar subida de archivo con datos de pago
    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Por favor seleccione un archivo para subir.");
            return;
        }

        if (!paymentMethod) {
            setError("Por favor seleccione un método de pago.");
            return;
        }

        // Validaciones específicas según el método de pago
        if (paymentMethod.nombre === "bdv") {
            if (!referenceNumber.trim()) {
                setError("Por favor ingrese el número de referencia.");
                return;
            }
            if (!paymentDate.year || !paymentDate.month || !paymentDate.day) {
                setError("Por favor seleccione la fecha completa del pago.");
                return;
            }
            if (!montoEnBs.trim()) {
                setError("Por favor ingrese el monto en bolívares.");
                return;
            }
        }

        setIsUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append('comprobante', selectedFile);
            
            // Agregar datos del pago según el método
            if (paymentMethod.nombre === "bdv") {
                formData.append('numero_referencia', referenceNumber);
                formData.append('fecha_pago', `${paymentDate.year}-${paymentDate.month}-${paymentDate.day}`);
                formData.append('monto_bs', montoEnBs);
                formData.append('tasa_bcv', tasaBCV.toString());
            }
            
            formData.append('metodo_pago_id', paymentMethod.metodoId.toString());
            formData.append('metodo_pago_slug', paymentMethod.nombre);

            await onUploadComprobante(formData);

            // Cerrar modal y limpiar
            setShowUploadModal(false);
            setSelectedFile(null);
            setPaymentMethod(null);
            setReferenceNumber("");
            setPaymentDate({ day: "", month: "", year: "" });
            setMontoEnBs("");
            setShowMethodSelection(false);
        } catch (error) {
            console.error("Error al subir comprobante:", error);
            setError("Ocurrió un error al subir el comprobante. Por favor intente nuevamente.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
        >
            <div className="flex items-center justify-between mb-5 border-b pb-3">
                <div className="flex items-center">
                    <CreditCard size={20} className="text-[#C40180] mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">
                        Comprobante de Pago
                    </h2>
                </div>
            </div>

            {/* Estado del comprobante */}
            <div className="bg-gray-50 rounded-lg p-6">
                {hasComprobante ? (
                    <div className="space-y-4">
                        {/* Información del comprobante */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-md ${isApproved ? 'bg-green-100' :
                                        isRejected ? 'bg-red-100' :
                                            'bg-yellow-100'
                                    }`}>
                                    {isApproved ? (
                                        <CheckCircle size={20} className="text-green-600" />
                                    ) : isRejected ? (
                                        <XCircle size={20} className="text-red-600" />
                                    ) : (
                                        <AlertCircle size={20} className="text-yellow-600" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        Comprobante de pago
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {comprobanteData?.archivo || 'comprobante_pago.pdf'}
                                    </p>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => onViewComprobante(comprobanteData)}
                                    className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="Ver comprobante"
                                >
                                    <Eye size={18} />
                                </button>

                                {!readOnly && !isApproved && (
                                    <button
                                        onClick={() => setShowUploadModal(true)}
                                        className="cursor-pointer p-2 text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                                        title="Reemplazar comprobante"
                                    >
                                        <Upload size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mensaje de estado */}
                        {isApproved && (
                            <div className="mt-4 bg-green-50 p-3 rounded-md border border-green-200">
                                <p className="text-sm text-green-700 flex items-center">
                                    <CheckCircle size={16} className="mr-2" />
                                    El comprobante de pago ha sido verificado y aprobado
                                </p>
                            </div>
                        )}

                        {isRejected && comprobanteData?.rejectionReason && (
                            <div className="mt-4 bg-red-50 p-3 rounded-md border border-red-200">
                                <p className="text-sm text-red-700">
                                    <span className="font-medium">Motivo de rechazo:</span>{' '}
                                    {comprobanteData.rejectionReason}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <CreditCard size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No se ha subido comprobante de pago
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Es necesario subir el comprobante de pago para completar el registro
                        </p>
                        {!readOnly && (
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="cursor-pointer inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-md hover:opacity-90 transition-colors"
                            >
                                <Upload size={16} className="mr-2" />
                                Subir comprobante
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal para subir comprobante */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <div className="flex items-center">
                                <CreditCard className="text-[#C40180] mr-2" size={20} />
                                <h3 className="text-lg font-medium text-gray-900">
                                    {hasComprobante ? "Actualizar comprobante de pago" : "Subir comprobante de pago"}
                                </h3>
                            </div>
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFile(null);
                                    setPaymentMethod(null);
                                    setShowMethodSelection(false);
                                    setError("");
                                }}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Selección de método de pago similar a PagosModal */}
                            <div className="mb-8">
                                <h4 className="text-lg font-medium text-[#41023B] mb-4 text-center">
                                    Seleccione el método de pago utilizado
                                </h4>

                                {/* Exchange rate */}
                                <div className="flex justify-center mb-6">
                                    <div className="bg-[#D7008A]/10 px-3 py-2 rounded-lg border border-[#D7008A]">
                                        <p className="text-sm font-bold text-[#41023B]">
                                            USD$ 1 = {tasaBCV} Bs
                                        </p>
                                    </div>
                                </div>

                                {showAsList ? (
                                    // Vista de lista para más de 4 métodos
                                    <div className="mb-8">
                                        {!showMethodSelection ? (
                                            <motion.div
                                                key="payment-method-summary"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {paymentMethod ? (
                                                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={
                                                                    paymentMethod.datos.logo_url
                                                                        ? paymentMethod.datos.logo_url.startsWith("/")
                                                                            ? `${process.env.NEXT_PUBLIC_BACK_HOST}${paymentMethod.datos.logo_url}`
                                                                            : paymentMethod.datos.logo_url
                                                                        : "/placeholder.svg"
                                                                }
                                                                alt={paymentMethod.datos.nombre}
                                                                className="w-10 h-10 mr-3 object-contain"
                                                            />
                                                            <div>
                                                                <p className="font-medium text-gray-900">{paymentMethod.datos.nombre}</p>
                                                                <p className="text-xs text-gray-500">Método de pago seleccionado</p>
                                                            </div>
                                                        </div>
                                                        <motion.button
                                                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors duration-200"
                                                            onClick={() => setShowMethodSelection(true)}
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            <span>Cambiar</span>
                                                        </motion.button>
                                                    </div>
                                                ) : (
                                                    <motion.button
                                                        className="w-full bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center justify-center gap-2 hover:border-[#D7008A] hover:bg-[#D7008A]/5 transition-all duration-300"
                                                        onClick={() => setShowMethodSelection(true)}
                                                        whileHover={{ scale: 1.01 }}
                                                        whileTap={{ scale: 0.99 }}
                                                    >
                                                        <CreditCard className="w-5 h-5 text-[#D7008A]" />
                                                        <span className="font-medium text-gray-700">Seleccionar método de pago</span>
                                                    </motion.button>
                                                )}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="payment-method-selector"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                                            >
                                                {/* Header */}
                                                <div className="p-3 border-b border-gray-200 flex items-center bg-[#f8f9fa]">
                                                    <button
                                                        className="mr-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                                                        onClick={() => setShowMethodSelection(false)}
                                                    >
                                                        <ArrowLeft className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <h3 className="text-base font-medium text-[#41023B]">
                                                        Seleccione un método de pago
                                                    </h3>
                                                </div>

                                                {/* Methods grid */}
                                                <div className="p-3">
                                                    <div className="flex flex-wrap justify-center gap-2">
                                                        {metodoPago.map((metodo, index) => {
                                                            let widthClass = "w-32";
                                                            if (metodoPago.length <= 4) widthClass = "w-40";
                                                            else if (metodoPago.length === 5) widthClass = "w-36";
                                                            else if (metodoPago.length >= 6) widthClass = "w-32";

                                                            return (
                                                                <motion.div
                                                                    key={index}
                                                                    className={`cursor-pointer rounded-lg border transition-all overflow-hidden p-3 ${widthClass} ${paymentMethod?.nombre === metodo.datos_adicionales.slug
                                                                        ? "border-[#D7008A] ring-1 ring-[#D7008A] bg-[#D7008A]/5"
                                                                        : "border-gray-200 hover:border-[#D7008A]"
                                                                        }`}
                                                                    onClick={() => handleSelectPaymentMethod(metodo)}
                                                                    whileHover={{ y: -2, scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                >
                                                                    <div className="flex flex-col items-center text-center">
                                                                        <div className="w-12 h-12 flex items-center justify-center mb-2 relative">
                                                                            <img
                                                                                src={
                                                                                    metodo.logo_url
                                                                                        ? metodo.logo_url.startsWith("/")
                                                                                            ? `${process.env.NEXT_PUBLIC_BACK_HOST}${metodo.logo_url}`
                                                                                            : metodo.logo_url
                                                                                        : "/placeholder.svg"
                                                                                }
                                                                                alt={metodo.nombre}
                                                                                className="max-w-full max-h-full object-contain"
                                                                            />
                                                                            {paymentMethod?.nombre === metodo.datos_adicionales.slug && (
                                                                                <div className="absolute -top-1 -right-1 bg-[#D7008A] rounded-full w-5 h-5 flex items-center justify-center">
                                                                                    <Check className="w-3 h-3 text-white" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <h4 className="text-sm font-medium text-gray-900 truncate w-full mb-1">{metodo.nombre}</h4>
                                                                        <p className="text-xs text-gray-500 truncate w-full">{metodo.descripcion}</p>
                                                                    </div>
                                                                </motion.div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                ) : (
                                    // Vista original de botones para 4 métodos o menos
                                    <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
                                        {metodoPago.map((metodo, index) => (
                                            <button
                                                key={index}
                                                className={`cursor-pointer flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-300 max-w-xs ${metodo.datos_adicionales.slug === "bdv"
                                                    ? "bg-red-50 border-red-300 text-red-700"
                                                    : "bg-blue-50 border-blue-300 text-blue-700"
                                                    } ${paymentMethod?.nombre === metodo.datos_adicionales.slug
                                                        ? 'ring-2 ring-offset-2 ring-[#D7008A]'
                                                        : ''
                                                    }`}
                                                onClick={() => handleSelectPaymentMethod(metodo)}
                                            >
                                                <img
                                                    src={
                                                        metodo.logo_url
                                                            ? metodo.logo_url.startsWith("/")
                                                                ? `${process.env.NEXT_PUBLIC_BACK_HOST}${metodo.logo_url}`
                                                                : metodo.logo_url
                                                            : "/placeholder.svg"
                                                    }
                                                    alt={metodo.nombre}
                                                    className="w-7 h-7"
                                                />
                                                <span className="font-medium">{metodo.nombre}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Contenido específico según método de pago */}
                            {paymentMethod && (
                                <div className="space-y-6 border-t pt-6">
                                    {paymentMethod.nombre === "bdv" ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Datos bancarios */}
                                            <div className="space-y-4">
                                                <h5 className="text-lg font-bold text-center text-[#590248] mb-4">
                                                    Datos Bancarios
                                                </h5>
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                                                    <p className="font-semibold">
                                                        Números de cuentas del Colegio de Odontólogos de Venezuela
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium">Número de cuenta:</p>
                                                            <p className="text-sm font-mono">0102-0127-63-0000007511</p>
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard("0102-0127-63-0000007511", "account")}
                                                            className="ml-2 p-2 bg-[#D7008A] text-white rounded-lg hover:bg-[#b8006b] transition-colors"
                                                            title="Copiar número de cuenta"
                                                        >
                                                            {copiedAccount ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium">RIF:</p>
                                                            <p className="text-sm font-mono">J-00041277-4</p>
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard("J-00041277-4", "rif")}
                                                            className="ml-2 p-2 bg-[#D7008A] text-white rounded-lg hover:bg-[#b8006b] transition-colors"
                                                            title="Copiar RIF"
                                                        >
                                                            {copiedRif ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                        </button>
                                                    </div>

                                                    <p className="text-sm">A nombre del Colegio de Odontólogos de Venezuela</p>
                                                    <p className="text-sm">
                                                        Correo: <a href="mailto:secretariafinanzas@elcov.org" className="text-[#590248] hover:underline">
                                                            secretariafinanzas@elcov.org
                                                        </a>
                                                    </p>
                                                </div>

                                                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                                    <p className="font-semibold text-red-700">ALERTA:</p>
                                                    <p className="text-sm text-red-700">
                                                        SI VA A REALIZAR TRÁMITES EN LINEA DEBERÁ DEPOSITAR SOLAMENTE EN LA CUENTA DEL BANCO DE VENEZUELA.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Formulario de datos de pago */}
                                            <div className="space-y-4">
                                                <h5 className="text-lg font-bold text-center text-[#41023B] mb-4">
                                                    Detalles del Pago
                                                </h5>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Número de referencia <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        value={referenceNumber}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (/^\d{0,14}$/.test(value)) {
                                                                setReferenceNumber(value);
                                                            }
                                                        }}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                                                        placeholder="Ingrese el número de referencia completo"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Fecha de pago <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div className="relative">
                                                            <select
                                                                value={paymentDate.year}
                                                                onChange={(e) => handleDateChange('year', e.target.value)}
                                                                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] appearance-none text-gray-700"
                                                            >
                                                                <option value="">Año</option>
                                                                {years.map(year => (
                                                                    <option key={`year-${year.value}`} value={year.value}>
                                                                        {year.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                                </svg>
                                                            </div>
                                                        </div>

                                                        <div className="relative">
                                                            <select
                                                                value={paymentDate.month}
                                                                onChange={(e) => handleDateChange('month', e.target.value)}
                                                                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] appearance-none text-gray-700"
                                                            >
                                                                <option value="">Mes</option>
                                                                {months.map(month => (
                                                                    <option key={`month-${month.value}`} value={month.value}>
                                                                        {month.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                                </svg>
                                                            </div>
                                                        </div>

                                                        <div className="relative">
                                                            <select
                                                                value={paymentDate.day}
                                                                onChange={(e) => handleDateChange('day', e.target.value)}
                                                                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] appearance-none text-gray-700"
                                                            >
                                                                <option value="">Día</option>
                                                                {getDaysInMonth(paymentDate.year, paymentDate.month).map(day => (
                                                                    <option key={`day-${day.value}`} value={day.value}>
                                                                        {day.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Monto en Bs <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                            Bs
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={montoEnBs}
                                                            onChange={(e) => setMontoEnBs(e.target.value)}
                                                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] text-sm"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Otros métodos de pago
                                        <div className="space-y-4">
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                                <p className="text-sm text-blue-700">
                                                    Para pagos con {paymentMethod.datos.nombre}, el comprobante debe incluir la referencia de la transacción.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Subida de archivo */}
                                    <div className="space-y-4 border-t pt-6">
                                        <h5 className="font-medium text-gray-900">
                                            Suba el comprobante de pago
                                        </h5>
                                        
                                        <div
                                            className={`border-2 border-dashed rounded-lg p-8 text-center ${error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-[#C40180] bg-gray-50"
                                                }`}
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                            />

                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />

                                            <p className="mt-2 text-sm font-medium text-gray-700">
                                                {selectedFile ? selectedFile.name : "Haga clic o arrastre un archivo aquí"}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                PDF, JPG o PNG (máx. 5MB)
                                            </p>

                                            {selectedFile && (
                                                <div className="mt-2 text-sm text-green-600 font-medium">
                                                    Archivo seleccionado: {selectedFile.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="flex items-start bg-red-100 p-3 rounded text-sm text-red-600">
                                    <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <button
                                    onClick={() => {
                                        setShowUploadModal(false);
                                        setSelectedFile(null);
                                        setPaymentMethod(null);
                                        setShowMethodSelection(false);
                                        setError("");
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                                    disabled={isUploading}
                                >
                                    Cancelar
                                </button>
                                
                                {paymentMethod && (
                                    <button
                                        onClick={handleUpload}
                                        disabled={!selectedFile || isUploading}
                                        className={`px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-md hover:opacity-90 transition-colors flex items-center gap-2 ${!selectedFile || isUploading ? "opacity-70 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                                <span>Subiendo...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={16} />
                                                <span>{hasComprobante ? "Actualizar comprobante" : "Subir comprobante"}</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
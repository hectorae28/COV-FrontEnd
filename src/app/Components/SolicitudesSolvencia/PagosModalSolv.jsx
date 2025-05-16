"use client";
import { motion } from "framer-motion";
import { Banknote, CreditCard, DollarSign, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

export default function PagosModalSolv({ onPaymentComplete, totalPendiente = 0 }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState("")
    const [montoPago, setMontoPago] = useState("0.00")
    const [montoEnBs, setMontoEnBs] = useState("0.00")
    const [referenceNumber, setReferenceNumber] = useState("")
    const [paymentDate, setPaymentDate] = useState("")
    const [paymentFile, setPaymentFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState("")

    // Tasa de cambio
    const exchangeRate = 80

    // Inicializar valores cuando totalPendiente cambia
    useEffect(() => {
        if (totalPendiente) {
            setMontoPago(totalPendiente.toFixed(2))
            setMontoEnBs((totalPendiente * exchangeRate).toFixed(2))
        } else {
            setMontoPago("0.00")
            setMontoEnBs("0.00")
        }

        // Establecer fecha por defecto
        const hoy = new Date();
        const fechaFormateada = hoy.toISOString().split('T')[0]; // formato YYYY-MM-DD
        setPaymentDate(fechaFormateada);
    }, [totalPendiente, exchangeRate])

    // Actualizar el monto en USD cuando se ingresa en Bs
    const handleBsChange = (e) => {
        const value = e.target.value
        if (!value) {
            setMontoEnBs("")
            setMontoPago("0.00")
            return
        }

        // Solo permitir números y un punto decimal
        if (!/^\d*\.?\d*$/.test(value)) return

        setMontoEnBs(value)

        // Convertir a USD
        const usdAmount = (parseFloat(value) / exchangeRate).toFixed(2)

        // Verificar que no exceda el monto pendiente
        if (parseFloat(usdAmount) > totalPendiente) {
            alert(`El monto no puede ser mayor a USD$ ${totalPendiente.toFixed(2)}`)
            // Reajustar al monto máximo
            setMontoEnBs((totalPendiente * exchangeRate).toFixed(2))
            setMontoPago(totalPendiente.toFixed(2))
            return
        }

        setMontoPago(usdAmount)
    }

    // Validar y actualizar el monto de pago en USD
    const handleMontoChange = (e) => {
        const value = e.target.value
        if (!value) {
            setMontoPago("0.00")
            setMontoEnBs("")
            return
        }

        // Solo permitir números y un punto decimal
        if (!/^\d*\.?\d*$/.test(value)) return

        const numericValue = parseFloat(value)

        if (numericValue > totalPendiente) {
            alert(`El monto no puede ser mayor a USD$ ${totalPendiente.toFixed(2)}`)
            return
        }

        // Actualizar valor sin formatear para que sea más fácil de editar
        setMontoPago(value)
        // Calcular el equivalente en Bs
        setMontoEnBs((numericValue * exchangeRate).toFixed(2))
    }

    // Manejar archivo adjunto
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setPaymentFile(file)
            const fileUrl = URL.createObjectURL(file)
            setPreviewUrl(fileUrl)
        }
    }

    // Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validar selección de método de pago
        if (!paymentMethod) {
            alert("Por favor seleccione un método de pago");
            return;
        }

        // Validar que el monto sea mayor que cero
        if (!montoPago || parseFloat(montoPago) <= 0) {
            alert("Por favor ingrese un monto válido");
            return;
        }

        // Formatear el monto para asegurar que tenga dos decimales
        const formattedAmount = parseFloat(montoPago).toFixed(2);

        // Validaciones específicas según el método
        if (paymentMethod === "transferencia" || paymentMethod === "efectivo" || paymentMethod === "pago_movil") {
            if (!referenceNumber || !paymentDate) {
                alert("Por favor complete todos los campos requeridos");
                return;
            }

            if (!paymentFile) {
                alert("Por favor adjunte el comprobante de pago");
                return;
            }
        }

        // Crear objeto con información del pago
        const paymentInfo = {
            monto: formattedAmount,
            metodoPago: paymentMethod === "transferencia" ? "Transferencia bancaria" :
                paymentMethod === "efectivo" ? "Efectivo" : "Pago móvil",
            referencia: referenceNumber || "N/A",
            fecha: paymentDate || new Date().toLocaleDateString(),
            archivo: paymentFile ? paymentFile.name : 'comprobante.jpg'
        }

        setIsSubmitting(true)

        try {
            // Simular procesamiento
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Llamar a la función de completado
            onPaymentComplete(paymentInfo)

            // Reiniciar formulario
            resetForm()
        } catch (error) {
            console.error("Error al procesar el pago:", error)
            alert("Ocurrió un error al procesar el pago. Por favor intente nuevamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Reiniciar formulario
    const resetForm = () => {
        setPaymentMethod("")

        if (totalPendiente) {
            setMontoPago(totalPendiente.toFixed(2))
            setMontoEnBs((totalPendiente * exchangeRate).toFixed(2))
        } else {
            setMontoPago("0.00")
            setMontoEnBs("0.00")
        }

        setReferenceNumber("")
        const hoy = new Date();
        const fechaFormateada = hoy.toISOString().split('T')[0]; // formato YYYY-MM-DD
        setPaymentDate(fechaFormateada);
        setPaymentFile(null)
        setPreviewUrl("")
    }

    return (
        <div className="select-none cursor-default w-full">
            {/* Encabezado */}
            <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-[#41023B] mb-2">Registro de Pago de Solvencia</h2>
                <p className="text-gray-600 text-sm">
                    Complete la información de su pago para finalizar el proceso
                </p>
            </div>

            {/* Monto a pagar destacado */}
            <div className="bg-[#f8f9fa] p-5 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-[#D7008A] flex items-center justify-center mr-3">
                            <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#41023B]">Información de Pago</h3>
                        </div>
                    </div>

                    {/* Tasa de cambio */}
                    <div className="bg-[#D7008A]/10 px-3 py-1.5 rounded-lg border border-[#D7008A]">
                        <p className="text-sm font-bold text[#41023B]">USD$ 1 = 80Bs</p>
                    </div>
                </div>

                {/* Mostrar montos totales */}
                <div className="text-center mb-6">
                    <p className="text-base text-gray-600">Monto total a pagar:</p>
                    <p className="text-2xl font-bold text-[#D7008A]">USD$ {parseFloat(totalPendiente).toFixed(2)}</p>
                    <p className="text-lg font-medium text-gray-700 mt-1">Monto en Bs: {(parseFloat(totalPendiente) * exchangeRate).toFixed(2)}</p>
                </div>

                {/* Botones de selección de método de pago */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center">
                    <button
                        className={`cursor-pointer flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-300 max-w-xs ${paymentMethod === "transferencia" ? "bg-blue-50 border-blue-300 text-blue-700" : "text-blue-600 hover:bg-blue-50 border-gray-300"}`}
                        onClick={() => setPaymentMethod("transferencia")}
                    >
                        <DollarSign size={18} />
                        <span className="font-medium">Transferencia</span>
                    </button>

                    <button
                        className={`cursor-pointer flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-300 max-w-xs ${paymentMethod === "efectivo" ? "bg-green-50 border-green-300 text-green-700" : "text-green-600 hover:bg-green-50 border-gray-300"}`}
                        onClick={() => setPaymentMethod("efectivo")}
                    >
                        <Banknote size={18} />
                        <span className="font-medium">Efectivo</span>
                    </button>

                    <button
                        className={`cursor-pointer flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-300 max-w-xs ${paymentMethod === "pago_movil" ? "bg-purple-50 border-purple-300 text-purple-700" : "text-purple-600 hover:bg-purple-50 border-gray-300"}`}
                        onClick={() => setPaymentMethod("pago_movil")}
                    >
                        <Smartphone size={18} />
                        <span className="font-medium">Pago Móvil</span>
                    </button>
                </div>

                {/* Contenido condicional según el método de pago */}
                {paymentMethod && (
                    <div className="mt-6 border-t pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Información del banco o método de pago */}
                            <div className="space-y-4">
                                <div className="flex justify-center mb-4">
                                    {paymentMethod === "transferencia" && <DollarSign size={36} className="text-blue-600" />}
                                    {paymentMethod === "efectivo" && <Banknote size={36} className="text-green-600" />}
                                    {paymentMethod === "pago_movil" && <Smartphone size={36} className="text-purple-600" />}
                                </div>

                                <div className="space-y-3 text-gray-700">
                                    <h3 className="text-base font-bold text-center text-[#590248] mb-2">Información de Pago</h3>

                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <p className="font-semibold text-sm">Colegio de Odontólogos de Venezuela</p>
                                        <p className="text-xs mt-1">RIF.: J-00041277-4</p>

                                        {paymentMethod === "transferencia" && (
                                            <>
                                                <p className="font-semibold text-sm mt-2">Cuenta Bancaria:</p>
                                                <p className="text-xs">Banco de Venezuela</p>
                                                <p className="text-xs">Cuenta Corriente: 0102-0127-63-0000007511</p>
                                            </>
                                        )}

                                        {paymentMethod === "pago_movil" && (
                                            <>
                                                <p className="font-semibold text-sm mt-2">Pago Móvil:</p>
                                                <p className="text-xs">Banco de Venezuela</p>
                                                <p className="text-xs">RIF: J-00041277-4</p>
                                                <p className="text-xs">Teléfono: 0412-1234567</p>
                                            </>
                                        )}

                                        {paymentMethod === "efectivo" && (
                                            <>
                                                <p className="font-semibold text-sm mt-2">Pago en Efectivo:</p>
                                                <p className="text-xs">Sede COV - Caracas</p>
                                                <p className="text-xs">Dirección: Av. Principal</p>
                                                <p className="text-xs">Horario: Lunes a Viernes 8am - 4pm</p>
                                            </>
                                        )}

                                        <p className="text-xs mt-2">Correo: <a href="mailto:tesoreria@cov.org" className="text-[#590248] hover:underline">tesoreria@cov.org</a></p>
                                    </div>
                                </div>
                            </div>

                            {/* Formulario de detalles del pago */}
                            <div className="space-y-4">
                                <h3 className="text-base font-bold text-[#41023B] mb-2 mt-3">Detalles del Pago</h3>

                                {/* Monto a pagar en Bs */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Monto a pagar en Bs <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            Bs
                                        </span>
                                        <input
                                            type="text"
                                            value={montoEnBs}
                                            onChange={handleBsChange}
                                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Equivalente a USD$ {montoPago}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Número de referencia <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={referenceNumber}
                                        onChange={(e) => setReferenceNumber(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] text-sm"
                                        placeholder="Ingrese el número de referencia o recibo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha de pago <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Comprobante de pago <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg">
                                        <div className="space-y-1 text-center">
                                            {previewUrl ? (
                                                <div className="flex flex-col items-center">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Vista previa"
                                                        className="max-h-36 max-w-full mb-2 rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setPaymentFile(null)
                                                            setPreviewUrl("")
                                                        }}
                                                        className="cursor-pointer text-xs text-red-600 hover:text-red-800"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <svg
                                                        className="mx-auto h-10 w-10 text-gray-400"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <div className="flex text-xs text-gray-600">
                                                        <label
                                                            htmlFor="file-upload"
                                                            className="relative cursor-pointer bg-white rounded-md font-medium text-[#D7008A] hover:text-[#41023B] focus-within:outline-none"
                                                        >
                                                            <span>Subir archivo</span>
                                                            <input
                                                                id="file-upload"
                                                                name="file-upload"
                                                                type="file"
                                                                className="sr-only"
                                                                accept="image/*,.pdf"
                                                                onChange={handleFileChange}
                                                            />
                                                        </label>
                                                        <p className="pl-1">o arrastre y suelte</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PNG, JPG, PDF hasta 10MB</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Botón de enviar */}
                {paymentMethod && (
                    <div className="pt-5 mt-5 border-t">
                        <motion.button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Procesando pago...
                                </>
                            ) : (
                                "Registrar Pago"
                            )}
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Nota importante */}
            <div className="bg-[#D7008A]/10 p-3 rounded-lg border border-[#D7008A] text-[#41023B] text-sm">
                <p className="flex items-start">
                    <span className="mr-2 mt-0.5 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    </span>
                    <span>
                        <strong>Nota importante:</strong> Guarde su comprobante de pago. El personal administrativo verificará su pago para generar la solvencia correspondiente.
                    </span>
                </p>
            </div>
        </div>
    )
}
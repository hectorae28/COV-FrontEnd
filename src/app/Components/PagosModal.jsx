"use client";
import { fetchDataSolicitudes } from "@/api/endpoints/landingPage";
import PaypalPaymentComponent from "@/utils/PaypalPaymentComponent.jsx";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, CreditCard, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

export default function PagosColg({ props }) {
  const { costo, allowMultiplePayments, handlePago } =
    props;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(costo);
  const [paymentFile, setPaymentFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [tasaBCV, setTasaBCV] = useState(0);
  const [metodoDePago, setMetodoDePago] = useState([]);

  const getTasa = async () => {
    try {
      const tasa = await fetchDataSolicitudes("tasa-bcv");
      setTasaBCV(tasa.data.rate);
      setMontoEnBs((parseFloat(costo) * tasaBCV).toFixed(2));
    } catch (error) {
      console.log(`Ha ocurrido un error: ${error}`)
    }
  }

  const getMetodosDePago = async () => {
    try {
      const metodos = await fetchDataSolicitudes("metodo-de-pago");
      setMetodoDePago(metodos.data);
    } catch (error) {
      console.log(`Ha ocurrido un error: ${error}`)
    }
  }

  useEffect(() => {
    getTasa();
    getMetodosDePago();
  }, [tasaBCV])
  const [montoEnBs, setMontoEnBs] = useState((parseFloat(costo) * tasaBCV).toFixed(2));
  const [showMethodSelection, setShowMethodSelection] = useState(false);

  // Verificar si hay más de 4 métodos de pago para cambiar el estilo de visualización
  const showAsList = metodoDePago.length > 4;

  // PayPal fee calculation
  const calculatePaypalFee = (amount) => {
    if (!amount || isNaN(parseFloat(amount))) return "";
    const numAmount = parseFloat(amount);
    const total = (numAmount + 0.3) / (1 - 0.054);
    return total.toFixed(2);
  };
  const paypalAmount = calculatePaypalFee(paymentAmount);

  const handleSubmit = async (e) => {
    console.log(paymentMethod)
    e.preventDefault();
    setIsSubmitting(true);
    handlePago({
      paymentDate,
      referenceNumber,
      paymentFile,
      totalAmount: paymentMethod === "bdv" ? montoEnBs : paypalAmount,
      metodo_de_pago: metodoDePago.find(
        (m) => m.datos_adicionales.slug === paymentMethod
      ),
    });

    setIsSubmitting(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentFile(file);

      // Create a URL for previewing the image
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  // Manejar la selección de método de pago
  const handleSelectPaymentMethod = (slug) => {
    debugger
    setPaymentMethod(slug);
    setShowMethodSelection(false); // Cerrar automáticamente después de seleccionar
  };

  return (
    <div id="pagos-modal" className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-[#41023B] mb-2">
          Registro de Pago
        </h2>
        <p className="text-gray-600">
          Complete la información de su pago para finalizar el proceso de
          registro
        </p>
      </div>

      <div className="bg-[#f8f9fa] p-6 rounded-xl mb-8">
        <div className="md:flex items-center justify-between mb-6 ">
          <div className="flex items-center mb-2 md:mb-0">
            <div className="w-10 h-10 rounded-full bg-[#D7008A] flex items-center justify-center mr-4">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#41023B]">
                Información de Pago
              </h3>
            </div>
          </div>

          {/* Exchange rate */}
          <div className="bg-[#D7008A]/10 px-3 py-2 rounded-lg border border-[#D7008A]">
            <p className="text-sm font-bold text-[#41023B]">
              USD$ 1 = {tasaBCV} bs
            </p>
          </div>
        </div>

        {/* Amount to pay highlighted */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600">Monto a pagar:</p>
          <p className="text-4xl font-bold text-[#D7008A]">
            USD$ {costo}
          </p>
          <p className="text-xl font-medium text-gray-700 mt-2">
            Monto en Bs: {montoEnBs}
          </p>
        </div>

        {/* Payment method selection - Conditional rendering based on number of methods */}
        {showAsList ? (
          <div className="mb-8">
            <AnimatePresence mode="wait">
              {!showMethodSelection ? (
                <motion.div
                  key="payment-method-summary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-lg font-medium text-[#41023B] mb-4 text-center">
                    Seleccione un método de pago
                  </label>

                  {/* Selected method display or selection button */}
                  {paymentMethod ? (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={
                            metodoDePago.find(m => m.datos_adicionales.slug === paymentMethod)?.logo_url
                              ? metodoDePago.find(m => m.datos_adicionales.slug === paymentMethod)?.logo_url.startsWith("/")
                                ? `${process.env.NEXT_PUBLIC_BACK_HOST}${metodoDePago.find(m => m.datos_adicionales.slug === paymentMethod)?.logo_url}`
                                : metodoDePago.find(m => m.datos_adicionales.slug === paymentMethod)?.logo_url
                              : "/placeholder.svg"
                          }
                          alt={metodoDePago.find(m => m.datos_adicionales.slug === paymentMethod)?.nombre}
                          className="w-10 h-10 mr-3 object-contain"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{metodoDePago.find(m => m.datos_adicionales.slug === paymentMethod)?.nombre}</p>
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

                  {/* Methods grid - Versión más compacta y ordenada */}
                  <div className="p-3">
                    <div className="flex flex-wrap justify-center gap-2">
                      {metodoDePago.map((metodo, index) => {
                        // Calcular ancho basado en cantidad de métodos
                        let widthClass = "";
                        const totalMetodos = metodoDePago.length;

                        if (totalMetodos <= 4) {
                          // Si hay 4 o menos, todos en una fila
                          widthClass = "w-20"; // Ancho fijo para hasta 4 elementos
                        } else if (totalMetodos === 5) {
                          // Si hay 5, mostramos 3 arriba y 2 abajo centrados
                          widthClass = "w-40"; // Un poco más ancho para mejor distribución
                        } else if (totalMetodos === 6) {
                          // Si hay 6, mostramos 3 arriba y 3 abajo
                          widthClass = "w-32";
                        } else if (totalMetodos <= 8) {
                          // Si hay 7-8, mostramos 4 arriba y el resto abajo
                          widthClass = "w-20";
                        } else {
                          // Para 9 o más
                          widthClass = "w-20";
                        }

                        return (
                          <motion.div
                            key={index}
                            className={`cursor-pointer rounded-lg border transition-all overflow-hidden p-2 ${widthClass} ${paymentMethod === metodo.datos_adicionales.slug
                              ? "border-[#D7008A] ring-1 ring-[#D7008A] bg-[#D7008A]/5"
                              : "border-gray-200 hover:border-[#D7008A]"
                              }`}
                            onClick={() => handleSelectPaymentMethod({
                              nombre: metodo.datos_adicionales.slug,
                              metodoId: metodo.id
                            })}
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex flex-col items-center text-center">
                              <div className="w-10 h-10 flex items-center justify-center mb-1 relative">
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
                                {paymentMethod === metodo.datos_adicionales.slug && (
                                  <div className="absolute -top-1 -right-1 bg-[#D7008A] rounded-full w-4 h-4 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <h4 className="text-xs font-medium text-gray-900 truncate w-full">{metodo.nombre}</h4>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // Vista original de botones para 4 métodos o menos
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
            {metodoDePago.map((metodo, index) => (
              <button
                key={index}
                className={`cursor-pointer flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-300 max-w-xs ${metodo.datos_adicionales.slug === "bdv"
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "bg-blue-50 border-blue-300 text-blue-700"
                  } ${paymentMethod === metodo.datos_adicionales.slug
                    ? 'ring-2 ring-offset-2 ring-[#D7008A]'
                    : ''
                  }`}
                onClick={() => setPaymentMethod({
                  nombre: metodo.datos_adicionales.slug,
                  metodoId: metodo.id
                })}
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

        {/* Conditional content based on payment method */}
        {paymentMethod && (
          <div className="mt-6 border-t pt-6">
            {paymentMethod.nombre === "bdv" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Banco de Venezuela information */}
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <img
                      src="/assets/icons/BDV.png"
                      alt="Banco de Venezuela"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-4 text-gray-700">
                    <h3 className="text-lg font-bold text-center text-[#590248] mb-2">
                      Cuentas Bancarias
                    </h3>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="font-semibold">
                        Números de cuentas del Colegio de Odontólogos de
                        Venezuela
                      </p>
                      <p className="text-sm">
                        Cuenta Corriente Nº 0102-0127-63-0000007511
                      </p>
                      <p className="text-sm mt-2">RIF.: J-00041277-4</p>
                      <p className="text-sm">
                        A nombre del Colegio de Odontólogos de Venezuela
                      </p>
                      <p className="text-sm mt-2">
                        Correo:{" "}
                        <a
                          href="mailto:secretariafinanzas@elcov.org"
                          className="text-[#590248] hover:underline"
                        >
                          secretariafinanzas@elcov.org
                        </a>
                      </p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="font-semibold text-red-700">ALERTA:</p>
                      <p className="text-sm text-red-700">
                        SI VA A REALIZAR TRÁMITES EN LINEA DEBERÁ DEPOSITAR
                        SOLAMENTE EN LA CUENTA DEL BANCO DE VENEZUELA.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment details form */}
                <div className="space-y-4 md:pt-12">
                  <h3 className="text-lg font-bold text-center text-[#41023B] mb-4">
                    Detalles del Pago
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de referencia
                    </label>
                    <input
                      type="number"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                      placeholder="Ingrese el número de referencia completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de pago
                    </label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comprobante de pago
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        {previewUrl ? (
                          <div className="flex flex-col items-center">
                            <img
                              src={previewUrl}
                              alt="Vista previa"
                              className="max-h-40 max-w-full mb-3 rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setPaymentFile(null);
                                setPreviewUrl("");
                              }}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Eliminar
                            </button>
                          </div>
                        ) : (
                          <>
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
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
                            <div className="flex text-sm text-gray-600">
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
                            <p className="text-xs text-gray-500">
                              PNG, JPG, PDF hasta 10MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* PayPal information */}
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <img
                      src="/assets/icons/Paypal.png"
                      alt="PayPal"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-4 text-gray-700">
                    <p className="text-sm">
                      Para realizar los pagos desde PayPal deberás calcular la
                      comisión en el siguiente formulario. Una vez conozca el
                      monto a depositar deberás colocarlo en el formulario y
                      sabrás el monto a depositar por PayPal. Tienes el botón de
                      acceso directo para pagar en PayPal o el correo.
                    </p>

                    <p className="text-sm">
                      Si estás realizando el trámite en línea deberás reportarlo
                      adjuntando el pago a la página. En caso contrario deberás
                      notificarlo al correo{" "}<a
                        href="mailto:secretariafinanzas@elcov.org"
                        className="text-[#118AB2] hover:underline"
                      >
                        secretariafinanzas@elcov.org
                      </a> indicando información necesaria.
                    </p>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="font-semibold text-blue-700">ATENCIÓN:</p>
                      <p className="text-sm text-blue-700">
                        Recomendamos no colocar dirección de envío y liberar el
                        pago. Hasta que este disponible el pago puede ser
                        aceptado su trámite.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">
                          Monto a depositar en PayPal:
                        </p>
                        <div className="relative mt-1">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                          </span>
                          <input
                            type="text"
                            value={paypalAmount}
                            disabled
                            className="pl-10 w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-semibold"
                          />
                        </div>
                      </div>

                      <p className="text-center text-sm mt-4">
                        Correo:{" "}<a
                          href="mailto:paypalelcov@gmail.com"
                          className="text-[#118AB2] hover:underline"
                        >
                          paypalelcov@gmail.com
                        </a>
                      </p>

                      <div className="mt-4 flex justify-center">
                        <PaypalPaymentComponent
                          totalPendiente={parseFloat(costo)}
                          onPaymentInfoChange={(info) => {
                            setPaymentAmount(info.montoPago);
                          }}
                          allowMultiplePayments={allowMultiplePayments} // Set this to false for single payment mode
                          metodoDePagoId={paymentMethod.metodoId}
                          handlePago={(detallesPago) => handlePago(detallesPago)}
                          tasaBCV={tasaBCV}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Send button only shows if a payment method is selected */}
        {paymentMethod && (
          <div className="pt-6 mt-6 border-t">
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
    </div>
  );
}
"use client";
import PayPalProvider from "@/utils/paypalProvider";
import { motion } from "framer-motion";
import { CreditCard, DollarSign } from "lucide-react";
import { useState } from "react";

// Default values for props (in case they're not provided)
const DEFAULT_COSTO = 75;
const DEFAULT_TAZA = 36.55;
const DEFAULT_METODOS = [
  {
    nombre: "Banco de Venezuela",
    datos_adicionales: { slug: "bdv" },
    logo_url: "/assets/icons/BDV.png"
  },
  {
    nombre: "PayPal",
    datos_adicionales: { slug: "paypal" },
    logo_url: "/assets/icons/Paypal.png"
  }
];

export default function PagosColg({
  onPaymentComplete,
  costoInscripcion = DEFAULT_COSTO,
  tazaBcv = DEFAULT_TAZA,
  metodoPago = DEFAULT_METODOS,
  handlePaymentComplete
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(costoInscripcion);
  const [paymentFile, setPaymentFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Tasa de cambio
  const amountInBs = (parseFloat(costoInscripcion) * tazaBcv).toFixed(2);

  // PayPal fee calculation
  const calculatePaypalFee = (amount) => {
    if (!amount || isNaN(parseFloat(amount))) return "";
    const numAmount = parseFloat(amount);
    const total = (numAmount + 0.3) / (1 - 0.054);
    return total.toFixed(2);
  };

  const paypalAmount = calculatePaypalFee(paymentAmount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Use the onPaymentComplete prop if handlePaymentComplete is not provided
    const completeFn = handlePaymentComplete || onPaymentComplete;

    if (typeof completeFn === 'function') {
      completeFn({
        paymentDate,
        paymentMethod,
        referenceNumber,
        paymentFile,
        totalAmount: paymentMethod === "bdv" ? amountInBs : paypalAmount,
        metodo_de_pago: metodoPago.find(m => m.datos_adicionales.slug === paymentMethod)
      });
    }

    setIsSubmitting(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentFile(file);

      // Crear una URL para previsualizar la imagen
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  return (
    <div className="w-full">
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
              <h3 className="font-semibold text-[#41023B">
                Información de Pago
              </h3>
            </div>
          </div>

          {/* Tasa de cambio */}
          <div className="bg-[#D7008A]/10 px-3 py-2 rounded-lg border border-[#D7008A]">
            <p className="text-sm font-bold text[#41023B]">
              USD$ 1 = {tazaBcv} bs
            </p>
          </div>
        </div>

        {/* Monto a pagar destacado */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600">Monto a pagar:</p>
          <p className="text-4xl font-bold text-[#D7008A]">
            USD$ {costoInscripcion}
          </p>
          <p className="text-xl font-medium text-gray-700 mt-2">
            Monto en Bs: {amountInBs}
          </p>
        </div>

        {/* Botones de selección de método de pago */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          {metodoPago.map((metodo, index) => (
            <button
              key={index}
              className={`cursor-pointer flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-300 max-w-xs ${metodo.datos_adicionales.slug === "bdv"
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "bg-blue-50 border-blue-300 text-blue-700"
                }`}
              onClick={() => setPaymentMethod(metodo.datos_adicionales.slug)}
            >
              <img
                src={
                  metodo.logo_url
                    ? metodo.logo_url.startsWith('/')
                      ? metodo.logo_url
                      : `${process.env.NEXT_PUBLIC_BACK_HOST}${metodo.logo_url}`
                    : "/placeholder.svg"
                }
                alt={metodo.nombre}
                className="w-7 h-7"
              />
              <span className="font-medium">{metodo.nombre}</span>
            </button>
          ))}
        </div>

        {/* Contenido condicional según el método de pago */}
        {paymentMethod && (
          <div className="mt-6 border-t pt-6">
            {paymentMethod === "bdv" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Información del Banco de Venezuela */}
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

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="font-semibold">BANCO DE VENEZUELA</p>
                      <p className="text-sm">
                        Cuenta Corriente Nº 0102-0127-63-0000007511
                      </p>
                    </div>
                  </div>
                </div>

                {/* Formulario de detalles del pago */}
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
                {/* Información de PayPal */}
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
                      notificarlo al correo{" "}
                      <a
                        href="mailto:secretariafinanzas@elcov.org"
                        className="text-[#118AB2] hover:underline"
                      >
                        secretariafinanzas@elcov.org
                      </a>{" "}
                      indicando información necesaria.
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
                        Correo:{" "}
                        <a
                          href="mailto:paypalelcov@gmail.com"
                          className="text-[#118AB2] hover:underline"
                        >
                          paypalelcov@gmail.com
                        </a>
                      </p>

                      <div className="mt-4 flex justify-center">
                        {/* Pass the calculated paypalAmount to the PayPalProvider */}
                        <PayPalProvider amount={paypalAmount} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Botón de enviar solo se muestra si se ha seleccionado un método de pago */}
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

      <div className="bg-[#D7008A]/10 p-4 rounded-lg border border-[#D7008A] text-[#41023B] text-sm">
        <p className="flex items-start">
          <span className="mr-2 mt-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </span>
          <span>
            <strong>Nota importante:</strong> Guarde su comprobante de pago. El
            personal administrativo verificará su pago para activar
            completamente su cuenta.
          </span>
        </p>
      </div>
    </div>
  );
}
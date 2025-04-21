"use client";

import { useState, useEffect } from "react";
import { Calendar, DollarSign, CreditCard, Info, Check } from "lucide-react";

export default function SolvencyPayment() {
  const [selectedDate, setSelectedDate] = useState("");
  const [isDateValid, setIsDateValid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Variables para costo y duración
  const cost = 50;
  const extendMonths = 12;

  // Fecha actual y fecha límite (2 semanas después)
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 14); // Solo 2 semanas de anticipación

  // Formatear fechas para el input date
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Validar la fecha seleccionada
  useEffect(() => {
    if (!selectedDate) {
      setIsDateValid(false);
      return;
    }

    const dateObj = new Date(selectedDate);
    const isAfterToday = dateObj >= today;
    const isBeforeMaxDate = dateObj <= maxDate;
    
    setIsDateValid(isAfterToday && isBeforeMaxDate);
    
    if (!isAfterToday) {
      setErrorMessage("La fecha debe ser igual o posterior a hoy");
    } else if (!isBeforeMaxDate) {
      setErrorMessage("Solo puedes pagar con 2 semanas de anticipación máximo");
    } else {
      setErrorMessage("");
    }
  }, [selectedDate]);

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isDateValid) return;
    
    setIsSubmitting(true);
    
    // Simular procesamiento de pago
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Restablecer después de mostrar éxito
      setTimeout(() => {
        setSuccess(false);
        setSelectedDate("");
        setPaymentMethod("card");
      }, 3000);
    }, 1500);
  };

  // Calcular nueva fecha de solvencia (1 año después de la fecha seleccionada)
  const calculateNewSolvencyDate = () => {
    if (!selectedDate) return "---";
    
    const dateObj = new Date(selectedDate);
    dateObj.setMonth(dateObj.getMonth() + extendMonths);
    
    return dateObj.toLocaleDateString("es-VE");
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-[#41023B] to-[#D7008A] p-4">
        <h2 className="text-lg font-bold text-white flex items-center">
          <DollarSign className="mr-2" size={20} />
          Pago de Solvencia
        </h2>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {success ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">¡Pago Exitoso!</h3>
            <p className="text-gray-600 text-center">
              Tu solvencia ha sido extendida hasta {calculateNewSolvencyDate()}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Info de restricción */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
              <Info className="text-blue-500 mr-2 mt-1 flex-shrink-0" size={18} />
              <p className="text-sm text-blue-700">
                Solo puedes realizar el pago de solvencia con un máximo de 2 semanas de anticipación.
                Este pago extenderá tu solvencia por {extendMonths} meses.
              </p>
            </div>

            {/* Detalles de pago */}
            <div className="space-y-6">
              {/* Fecha de pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Pago
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={formatDateForInput(today)}
                    max={formatDateForInput(maxDate)}
                    className={`pl-10 w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
                      errorMessage 
                        ? "border-red-300 focus:ring-red-200" 
                        : "border-gray-300 focus:ring-purple-200"
                    }`}
                    required
                  />
                </div>
                {errorMessage && (
                  <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
                )}
              </div>

              {/* Costo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="text"
                    value={`$${cost}.00`}
                    className="pl-10 w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              {/* Método de pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`border rounded-md p-4 cursor-pointer ${
                      paymentMethod === "card"
                        ? "bg-purple-50 border-purple-300"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="flex items-center">
                      <CreditCard className="mr-2 text-gray-600" size={20} />
                      <span>Tarjeta</span>
                    </div>
                  </div>
                  <div
                    className={`border rounded-md p-4 cursor-pointer ${
                      paymentMethod === "transfer"
                        ? "bg-purple-50 border-purple-300"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setPaymentMethod("transfer")}
                  >
                    <div className="flex items-center">
                      <DollarSign className="mr-2 text-gray-600" size={20} />
                      <span>Transferencia</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nueva fecha de solvencia */}
              {selectedDate && isDateValid && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700">
                    Tu nueva fecha de solvencia será hasta:{" "}
                    <strong>{calculateNewSolvencyDate()}</strong>
                  </p>
                </div>
              )}

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={!isDateValid || isSubmitting}
                className={`w-full p-3 rounded-md text-white font-medium shadow-sm
                  ${
                    isDateValid && !isSubmitting
                      ? "bg-gradient-to-r from-[#41023B] to-[#D7008A] hover:from-[#510449] hover:to-[#e20091]"
                      : "bg-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {isSubmitting ? "Procesando..." : "Procesar Pago"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
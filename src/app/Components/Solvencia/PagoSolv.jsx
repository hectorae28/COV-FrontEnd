"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import PagosColg from "../PagosModal";

export default function SolvenciaPago() {
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePaymentComplete = () => {
    setIsSuccess(true);
    
    // Reiniciar después de 3 segundos
    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Mensaje de información en una sola línea horizontal */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex items-center space-x-2 text-gray-700">
          <Info size={18} className="text-[#D7008A] flex-shrink-0" />
          <p className="text-sm">
            La solvencia del Colegio de Odontólogos es un requisito indispensable para el ejercicio profesional. El pago solo puede realizarse con un máximo de dos semanas de anticipación.
          </p>
        </div>
      </div>

      {/* Mostrar directamente el componente PagosColg */}
      <div className="bg-white rounded-xl shadow-md">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-xl font-semibold text-green-600">¡Pago Procesado!</h3>
            <p className="text-gray-600 text-center mt-2">
              Su solicitud ha sido recibida y está siendo procesada.
            </p>
          </div>
        ) : (
          <PagosColg onPaymentComplete={handlePaymentComplete} />
        )}
      </div>
    </div>
  );
}
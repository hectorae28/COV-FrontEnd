"use client";

import { fetchMe } from "@/api/endpoints/colegiado";
import { solicitarPagosSolvencia, solicitarSolvencia } from "@/api/endpoints/solicitud";
import useColegiadoUserStore from "@/store/colegiadoUserStore";
import { Warning } from "@mui/icons-material";
import { AlertCircle, Calendar, CheckCircle } from "lucide-react";

export default function SolvencyStatus({solvencyAmount, onPayClick, isExpiringSoon }) {
  /*
    Condicion para saber si el colegiado puede pedir costo especial:
      - Si el colegiado es antiguo y no posee solvencia (requiere solvencia especial)
    El colegiado puede solicitar el costo especial (crear la solicitud directamente) y el admin lo revisara
    El admin ingresa el monto en la solicitud de solvencia (de lo contrario el monto llega -1.0)
    
    Boton de pago:
      -Si el colegiado no requiere solvencia especial o si el costo es mayor a 0 se muestra el boton de pago
      -Si el colegiado puede pedir el monto especial se muestra el boton de solicitar costo de solvencia
      -Si el colegiado requiere la solvencia especial y el costo < 0, no mostrar nigun boton
  */

  const colegiadoUser = useColegiadoUserStore((state) => state.colegiadoUser);
  const setColegiadoUser = useColegiadoUserStore((state) => state.setColegiadoUser);

  const costoEspecialMessage = (colegiadoUser.requiere_solvencia_esp && colegiadoUser.puede_pedir_costo_especial) ?
    "" : "Su costo esta siendo calculado";

  const mensajeDeCosto = (colegiadoUser.requiere_solvencia_esp && colegiadoUser.costo_de_solvencia < 0) ?
    costoEspecialMessage : `Monto: ${colegiadoUser.costo_de_solvencia}`;

  const mostraBoton = () => {
    if (colegiadoUser.requiere_solvencia_esp && !colegiadoUser.puede_pedir_costo_especial) {
      return Math.floor(colegiadoUser.costo_de_solvencia) > 0
    }
    return true
  }

  const puedeMostrarBoton = mostraBoton();

  const handleSolicitarSolvencia = async () => {
    try {
      if(colegiadoUser.requiere_solvencia_esp && colegiadoUser.puede_pedir_costo_especial){
        const pagoResult = await solicitarSolvencia({user_id: colegiadoUser.id});
        const colegiadoResult = await fetchMe();
        setColegiadoUser(colegiadoResult.data);
        return [undefined, pagoResult]
      }else{
        if(colegiadoUser.solicitud_solvencia_activa){
          try {
            const pagosResult = await solicitarPagosSolvencia({user_id: colegiadoUser.id});
          } catch (error) {
            console.error("Error al solicitar pagos de solvencia:", error);
          }
        }else{
          try {
            const pagoResult = await solicitarSolvencia({user_id: colegiadoUser.id});
          } catch (error) {
            console.error("Error al solicitar solvencia:", error);
          }
        }
        // Siempre llamar onPayClick para abrir el modal de pago
        if (onPayClick && typeof onPayClick === 'function') {
          onPayClick();
        }
      }
    } catch(error) {
      console.error("Error en handleSolicitarSolvencia:", error);
      return [error, undefined];
    }
  }

  const botonDePago = () => {
    if (!puedeMostrarBoton) return <></>;

    if (colegiadoUser.requiere_solvencia_esp && colegiadoUser.puede_pedir_costo_especial) {
      return (
        <button
          className="bg-gradient-to-b from-[#41023B] to-[#D7008A] text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-colors"
          onClick={() => handleSolicitarSolvencia()}
        >
          Solicitar costo de solvencia
        </button>
      )
    }

    return (
      <button
        onClick={() => handleSolicitarSolvencia()}
        className="bg-gradient-to-b from-[#41023B] to-[#D7008A] text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-colors"
      >
        {colegiadoUser.solicitud_solvencia_activa ? 'Completar Pago' : colegiadoUser.solvencia_status ? "Renovar Solvencia" : "Realizar Pago"}
      </button>
    )
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden mb-6" id="estado-de-solvencia">
      <div className="bg-gradient-to-b from-[#41023B] to-[#D7008A] p-4">
        <h2 className="text-white font-semibold text-lg">Estado de Solvencia</h2>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {colegiadoUser.solvencia_status ? (
              <>
                {isExpiringSoon ? (
                  <div className="flex items-center text-amber-600 mb-2">
                    <Warning fontSize="small" className="mr-2" />
                    <span className="font-semibold text-lg">Solvencia próxima a vencer</span>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 mb-2">
                    <CheckCircle size={20} className="mr-2" />
                    <span className="font-semibold text-lg">Solvente</span>
                  </div>
                )}
                <div className="flex items-center text-gray-700">
                  <Calendar size={16} className="mr-2" />
                  <span>Válido hasta: <span className="font-semibold">{colegiadoUser.solvente}</span></span>
                </div>
                {isExpiringSoon && (
                  <div className="text-amber-600 text-sm mt-2">
                    <span>Se recomienda renovar su solvencia antes de la fecha de vencimiento</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center text-red-600 mb-2">
                  <AlertCircle size={20} className="mr-2" />
                  <span className="font-semibold text-lg">No Solvente</span>
                </div>
                <div className="text-gray-700">
                  <span>Debe regularizar su situación para acceder a todos los servicios</span>
                </div>
              </>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-gray-700 mb-2">
              <span className="font-semibold text-lg">{mensajeDeCosto}</span>
            </div>
            {botonDePago()}
          </div>
        </div>
      </div>
    </div>
  );
}
import { postDataSolicitud } from "@/api/endpoints/solicitud"
import { ShoppingCart, CreditCard, Trash2 } from "lucide-react"
import api from "@/api/api"
import { useSolicitudesStore } from "@/store/SolicitudesStore"

const ServiciosSection = ({ solicitud, totales, onIniciarPago, pagosAprobados, pagosSolicitud }) => {
  const { 
    totalOriginal, 
    totalExonerado, 
    totalPendiente, 
    totalPagado, 
    todoExonerado,
    totalEnRevision
  } = totales
  const { getSolicitudById } = useSolicitudesStore()
  const handleEliminarServicio = async (item) => {
    await api.post(`solicitudes/solicitud/${solicitud.id}/delete-sub-solicitudes/`, {
      sub_solicitudes: [
        {
          id: item.id,
          tipo_solicitud: item.tipo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        }
      ]
    })
   await getSolicitudById(solicitud.id)
  }
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-5">
      <h2 className="text-base font-medium text-gray-900 mb-3 flex items-center">
        <ShoppingCart size={18} className="mr-2 text-[#C40180]" />
        Servicios solicitados
      </h2>
      
      <div className="border rounded-lg overflow-hidden">
        {/* Encabezado de la tabla */}
        <div className="bg-gray-50 p-2.5 border-b grid grid-cols-12 text-sm font-medium text-gray-600">
          <div className="col-span-8">Servicio</div>
          <div className="col-span-4 text-right">Costo</div>
        </div>
        {/* Listado de servicios */}
        <div className="divide-y">
          {solicitud.itemsSolicitud && solicitud.itemsSolicitud.map((item, index) => (
            <div key={index} className="p-2.5 grid grid-cols-12 items-center text-sm">
              <div className="col-span-8">
                <span className="font-medium">{item.nombre}</span> <span className="text-xs text-gray-500">{item.institucion}</span>
              </div>
              <div className="col-span-4 text-right flex items-center justify-end gap-2">
                <span className={item.exonerado ? 'line-through text-gray-400' : 'text-[#C40180] font-medium'}>
                  ${item.costo.toFixed(2)}
                </span>
                {
                  pagosSolicitud.length==0 && (
                    <button
                      type="button"
                      onClick={() => handleEliminarServicio(item)} 
                      className="cursor-pointer text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )
                }
              </div>
            </div>
          ))}
        </div>
        {/* Resumen de costos */}
        <div className="bg-gray-50 p-4 border-t">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Subtotal:</span>
            <span className="font-medium">${totalOriginal.toFixed(2)}</span>
          </div>
          {totalExonerado > 0 && (
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Exonerado:</span>
              <span className="font-medium text-teal-600">-${totalExonerado.toFixed(2)}</span>
            </div>
          )}
          
          {totalPagado > 0 && (
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Pagado:</span>
              <span className="font-medium text-green-600">${totalPagado.toFixed(2)}</span>
            </div>
          )}
          
          {totalPendiente > 0 && (
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">En revisión:</span>
              <span className="font-medium text-orange-600">${totalEnRevision.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center font-bold mt-2 pt-2 border-t border-gray-200">
            <span>Total Pendiente:</span>
            <span className="text-[#C40180]">${totalPendiente.toFixed(2)}</span>
          </div>
          
          {/* Botón de acción */}
          <div className="mt-4">
            {totalPendiente > 0 && !pagosAprobados && (
              <button
                onClick={onIniciarPago}
                className="cursor-pointer w-full bg-[#C40180] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#A00060] text-sm transition-colors"
              >
                <CreditCard size={18} />
                <span>Realizar pago</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiciosSection
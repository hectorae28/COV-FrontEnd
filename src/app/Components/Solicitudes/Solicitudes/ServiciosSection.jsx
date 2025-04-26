import { ShoppingCart, CreditCard } from "lucide-react"

const ServiciosSection = ({ solicitud, totales, onIniciarPago }) => {
  const { 
    totalOriginal, 
    totalExonerado, 
    totalPendiente, 
    totalPagado, 
    todoExonerado 
  } = totales
  
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
          {solicitud.itemsSolicitud && solicitud.itemsSolicitud.map((item) => (
            <div key={item.id} className="p-2.5 grid grid-cols-12 items-center text-sm">
              <div className="col-span-8">
                <span className="font-medium">{item.nombre}</span>
              </div>
              <div className="col-span-4 text-right">
                <span className={item.exonerado ? 'line-through text-gray-400' : 'text-[#C40180] font-medium'}>
                  ${item.costo.toFixed(2)}
                </span>
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
              <span className="text-sm text-gray-600">Pendiente:</span>
              <span className="font-medium text-orange-600">${totalPendiente.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center font-bold mt-2 pt-2 border-t border-gray-200">
            <span>Total a pagar:</span>
            <span className="text-[#C40180]">${totalPendiente.toFixed(2)}</span>
          </div>
          
          {/* Botón de acción */}
          <div className="mt-4">
            {totalPendiente > 0 && (
              <button
                onClick={onIniciarPago}
                className="w-full bg-[#C40180] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#A00060] text-sm transition-colors"
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
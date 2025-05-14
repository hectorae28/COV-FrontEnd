import { User, Book, Briefcase, CheckCircle, AlertCircle } from "lucide-react"

export default function TablaInformacionPersonal({ colegiado }) {
  // Función para formatear fechas
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "No especificada"
    return new Date(fechaISO).toLocaleDateString('es-ES')
  }

  // Para mostrar el nombre completo
  const nombreCompleto = `${colegiado.recaudos.persona.nombre} ${colegiado.recaudos.persona.segundo_nombre || ''} ${colegiado.recaudos.persona.primer_apellido} ${colegiado.recaudos.persona.segundo_apellido || ''}`.trim()

  return (
    <div className="space-y-6">
      {/* Estado de solvencia */}
      <div className="mt-8">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Estado de solvencia</p>
              <p className={`font-bold text-xl ${colegiado.solvencia_status ? 'text-green-600' : 'text-red-600'} flex items-center justify-center`}>
                {colegiado.solvencia_status ? (
                  <>
                    <CheckCircle size={20} className="mr-2" />
                    Solvente
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} className="mr-2" />
                    No Solvente
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Información personal */}
      <div>
        <div className="flex items-center mb-5 border-b pb-3">
          <User size={20} className="text-[#C40180] mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Información personal</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Nombre completo</p>
              <p className="font-medium text-gray-800">{nombreCompleto}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Cédula</p>
              <p className="font-medium text-gray-800">{colegiado.recaudos.persona.nacionalidad}-{colegiado.recaudos.persona.identificacion}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de nacimiento</p>
              <p className="font-medium text-gray-800">{formatearFecha(colegiado.recaudos.persona.fecha_nacimiento)}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Correo electrónico</p>
              <p className="font-medium text-gray-800">{colegiado.recaudos.persona.correo}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Teléfono</p>
              <p className="font-medium text-gray-800">{colegiado.recaudos.persona.telefono_movil}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Dirección</p>
              <p className="font-medium text-gray-800">{colegiado.recaudos.persona.direccion.referencia}, {colegiado.recaudos.persona.direccion.estado}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Título entregado en oficina</p>
              <p className={`font-medium flex items-center ${colegiado.titulo ? 'text-green-600' : 'text-yellow-600'}`}>
                {colegiado.titulo ? (
                  <>
                    <CheckCircle size={16} className="mr-1" />
                    Sí, entregado
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="mr-1" />
                    No entregado
                  </>
                )}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de registro</p>
              <p className="font-medium text-gray-800">{formatearFecha(colegiado.fecha_registro_principal)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información académica */}
      <div className="mt-8">
        <div className="flex items-center mb-5 border-b pb-3">
          <Book size={20} className="text-[#C40180] mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Información académica</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Universidad</p>
            <p className="font-medium text-gray-800">{colegiado.universidad || "No especificada"}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Especialidad</p>
            <p className="font-medium text-gray-800">{colegiado.especialidad || "No especificada"}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Año de graduación</p>
            <p className="font-medium text-gray-800">{colegiado.anio_graduacion || "No especificado"}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha MPPS</p>
            <p className="font-medium text-gray-800">{formatearFecha(colegiado.fecha_mpps)}</p>
          </div>
        </div>
      </div>

      {/* Información profesional */}
      <div className="mt-8">
        <div className="flex items-center mb-5 border-b pb-3">
          <Briefcase size={20} className="text-[#C40180] mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Información profesional</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número de registro</p>
            <p className="font-medium text-gray-800">{colegiado.numeroRegistro}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Años de experiencia</p>
            <p className="font-medium text-gray-800">{colegiado.anios_experiencia || "No especificado"}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Estado del carnet</p>
            <p className={`font-medium flex items-center ${colegiado.carnetVigente ? 'text-green-600' : 'text-yellow-600'}`}>
              {colegiado.carnetVigente ? (
                <>
                  <CheckCircle size={16} className="mr-1" />
                  Vigente hasta {colegiado.carnetVencimiento}
                </>
              ) : (
                <>
                  <AlertCircle size={16} className="mr-1" />
                  Vencido desde {colegiado.carnetVencimiento}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Instituciones donde trabaja */}
      <div className="mt-8">
        <div className="flex items-center mb-5 border-b pb-3">
          <Briefcase size={20} className="text-[#C40180] mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Instituciones donde trabaja</h2>
        </div>
        {colegiado.instituciones && colegiado.instituciones.length > 0 ? (
          <div className="space-y-6">
            {colegiado.instituciones.map((institucion, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md mb-4 last:mb-0">
                <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center">
                  <Briefcase size={16} className="mr-2 text-[#C40180]" />
                  {institucion.nombre}
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Cargo</p>
                    <p className="font-medium text-gray-800">{institucion.cargo || "No especificado"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Teléfono</p>
                    <p className="font-medium text-gray-800">{institucion.telefono || "No especificado"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Dirección</p>
                    <p className="font-medium text-gray-800">{institucion.direccion || "No especificada"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md text-gray-500 italic flex items-center justify-center h-32">
            <div className="text-center">
              <Briefcase size={24} className="mx-auto mb-2 text-gray-400" />
              No hay instituciones registradas
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
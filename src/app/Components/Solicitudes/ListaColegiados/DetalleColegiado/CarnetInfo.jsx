import { CreditCard, CheckCircle, AlertCircle } from "lucide-react"

export default function CarnetInfo({ colegiado }) {
    // Función para obtener iniciales del nombre
    const obtenerIniciales = () => {
        if (!colegiado) return "CN"

        const { nombre, primer_apellido } = colegiado.persona
        return `${nombre.charAt(0)}${primer_apellido.charAt(0)}`
    }

    // Función para formatear fechas
    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return "No especificada"
        return new Date(fechaISO).toLocaleDateString('es-ES')
    }

    // Para mostrar el nombre completo
    const nombreCompleto = `${colegiado.persona.nombre} ${colegiado.persona.segundo_nombre || ''} ${colegiado.persona.primer_apellido} ${colegiado.persona.segundo_apellido || ''}`.trim()

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900">Carnet de colegiado</h3>
                <p className="text-sm text-gray-500 mt-1">Información sobre el carnet del colegiado</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Vista previa del carnet */}
                    <div className="md:w-1/2 flex justify-center">
                        <div className="w-full max-w-md bg-gradient-to-r from-[#C40180] to-[#590248] rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-xl font-bold">Colegio de Odontólogos</h4>
                                        <p className="text-sm opacity-80">de Venezuela</p>
                                    </div>
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <span className="text-sm font-semibold">N° {colegiado.numeroRegistro}</span>
                                    </div>
                                </div>

                                <div className="flex mt-8 items-center gap-4">
                                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center text-[#C40180] text-2xl font-bold">
                                        {obtenerIniciales()}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-lg">{nombreCompleto}</h5>
                                        <p className="text-white/80 text-sm">{colegiado.persona.nacionalidad}-{colegiado.persona.identificacion}</p>
                                        <p className="text-white/80 text-sm">{colegiado.especialidad}</p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 border-t border-white/20 text-sm flex justify-between">
                                    <div>
                                        <p className="opacity-70">Válido hasta:</p>
                                        <p className="font-semibold">{colegiado.carnetVencimiento}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="opacity-70">Emitido:</p>
                                        <p className="font-semibold">{formatearFecha(colegiado.fechaRegistro)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información del carnet */}
                    <div className="md:w-1/2">
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-medium text-gray-900">Estado del carnet</h4>
                                <div className="mt-4">
                                    {colegiado.carnetVigente ? (
                                        <div className="bg-green-100 text-green-800 p-4 rounded-md flex items-center">
                                            <CheckCircle className="mr-2" size={20} />
                                            <div>
                                                <p className="font-medium">Carnet vigente</p>
                                                <p className="text-sm">El carnet está activo y es válido hasta {colegiado.carnetVencimiento}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md flex items-center">
                                            <AlertCircle className="mr-2" size={20} />
                                            <div>
                                                <p className="font-medium">Carnet vencido</p>
                                                <p className="text-sm">El carnet venció el {colegiado.carnetVencimiento} y debe ser renovado</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número de registro</p>
                                    <p className="font-medium text-gray-800">{colegiado.numeroRegistro}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de emisión</p>
                                    <p className="font-medium text-gray-800">{formatearFecha(colegiado.fechaRegistro)}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de vencimiento</p>
                                    <p className="font-medium text-gray-800">{colegiado.carnetVencimiento}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Especialidad</p>
                                    <p className="font-medium text-gray-800">{colegiado.especialidad}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
                                    <CreditCard size={16} />
                                    <span>{colegiado.carnetVigente ? 'Descargar carnet' : 'Renovar carnet'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
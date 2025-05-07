import { CreditCard, Mail, MapPin, Phone, PlusCircle, User, Calendar, CheckCircle } from "lucide-react"
import SessionInfo from "@/Components/SessionInfo"

export default function ColegiadoCard({ colegiado, onNuevaSolicitud, onConfirmarTitulo }) {
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col items-center md:flex-row">
                <div className="md:w-1/5 flex justify-center items-center mb-8 md:mb-0">
                    {/* Iniciales en lugar de foto de perfil */}
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg shadow-black/40 bg-gradient-to-br from-[#C40180] to-[#7D0053] flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                            {obtenerIniciales()}
                        </span>
                    </div>
                </div>

                <div className="md:w-3/4 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{nombreCompleto}</h1>
                            <p className="text-sm text-gray-500">N° COV: {colegiado.numeroRegistro}</p>
                        </div>

                        <div className="mt-4 md:mt-0 flex flex-wrap justify-center md:justify-end gap-2">
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colegiado.solvente ? 'bg-green-100 text-green-800 font-bold' : 'bg-red-100 text-red-800'}`}
                            >
                                {colegiado.solvente ? 'Solvente' : 'No Solvente'}
                            </span>

                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colegiado.carnetVigente ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}
                            >
                                {colegiado.carnetVigente ? 'Carnet vigente' : 'Carnet vencido'}
                            </span>
                        </div>
                    </div>

                    {/* Grid de información de contacto */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Columna izquierda */}
                        <div>
                            <div className="flex items-center justify-center md:justify-start">
                                <User className="text-gray-400 h-5 w-5 mr-2" />
                                <span className="text-gray-700">
                                    {colegiado.persona.nacionalidad}-{colegiado.persona.identificacion}
                                </span>
                            </div>

                            <div className="flex items-center justify-center md:justify-start mt-4">
                                <Mail className="text-gray-400 h-5 w-5 mr-2" />
                                <span className="text-gray-700">{colegiado.persona.correo}</span>
                            </div>

                            <div className="flex items-center justify-center md:justify-start mt-4">
                                <Phone className="text-gray-400 h-5 w-5 mr-2" />
                                <span className="text-gray-700">{colegiado.persona.telefono_movil}</span>
                            </div>
                        </div>

                        {/* Columna derecha */}
                        <div>
                            <div className="flex items-start justify-center md:justify-start mt-4">
                                <MapPin className="text-gray-400 h-5 w-5 mr-2 mt-0.5" />
                                <span className="text-gray-700">
                                    {colegiado.persona.direccion.referencia}, {colegiado.persona.direccion.estado}
                                </span>
                            </div>

                            <div className="flex items-center justify-center md:justify-start mt-4">
                                <Calendar className="text-gray-400 h-5 w-5 mr-2" />
                                <span className="text-gray-700">Registrado: {formatearFecha(colegiado.fecha_registro_principal)}</span>
                            </div>
                        </div>
                        <div className="flex space-x-8">
                            {/* Información del creador del registro */}
                            {colegiado.creador && (
                                <div className="mt-4">
                                    <SessionInfo
                                        creador={colegiado.creador}
                                        variant="compact"
                                        className="justify-center md:justify-start"
                                    />
                                </div>
                            )}

                            {/* Información de quien aprobó el registro */}
                            {colegiado.aprobadoPor && (
                                <div className="col-span-2 mt-4">
                                    <SessionInfo
                                        creador={{
                                            ...colegiado.aprobadoPor,
                                            esAdmin: colegiado.aprobadoPor.esAdmin || false,
                                            tipo: 'aprobado'
                                        }}
                                        variant="compact"
                                        className="justify-center md:justify-start"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                        <button
                            onClick={onNuevaSolicitud}
                            className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <PlusCircle size={18} />
                            <span>Nueva solicitud</span>
                        </button>

                        {!colegiado.tituloEntregado && (
                            <button
                                onClick={onConfirmarTitulo}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                            >
                                <CheckCircle size={18} />
                                <span>Confirmar entrega de título</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
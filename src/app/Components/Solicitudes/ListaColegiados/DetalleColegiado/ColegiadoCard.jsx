import SessionInfo from "@/Components/SessionInfo"
import { Calendar, CheckCircle, Mail, MapPin, Phone, PlusCircle, User,GraduationCap } from "lucide-react"

export default function ColegiadoCard({ colegiado, onNuevaSolicitud, onConfirmarTitulo }) {
    // Función para obtener iniciales del nombre
    const obtenerIniciales = () => {
        if (!colegiado) return "CN"

        const { nombre, primer_apellido } = colegiado.recaudos.persona
        return `${nombre.charAt(0)}${primer_apellido.charAt(0)}`
    }

    // Función para formatear fechas
    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return "No especificada"
        return new Date(fechaISO).toLocaleDateString('es-ES')
    }

    // Para mostrar el nombre completo
    const nombreCompleto = `${colegiado.recaudos.persona.nombre} ${colegiado.recaudos.persona.segundo_nombre || ''} ${colegiado.recaudos.persona.primer_apellido} ${colegiado.recaudos.persona.segundo_apellido || ''}`.trim()

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
                            <p className="text-sm text-gray-500">N° COV: {colegiado.num_cov}</p>
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
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mt-4 w-full">
                        <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
                            <Mail className="text-[#C40180] h-5 w-5 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Correo electrónico</p>
                                <p className="text-sm text-gray-700 truncate max-w-full">{colegiado.recaudos.persona.correo}</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
                            <Phone className="text-[#C40180] h-5 w-5 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Teléfono</p>
                                <p className="text-sm text-gray-700">{colegiado.recaudos.persona.telefono_movil}</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
                            <User className="text-[#C40180] h-5 w-5 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Identificación</p>
                                <p className="text-sm text-gray-700">
                                    {colegiado.recaudos.persona.nacionalidad}-{colegiado.recaudos.persona.identificacion}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
                            <Calendar className="text-[#C40180] h-5 w-5 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Fecha de inscripcion</p>
                                <p className="text-sm text-gray-700">{formatearFecha(colegiado.fecha_de_inscripcion)}</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
                            <GraduationCap className="text-[#C40180] h-5 w-5 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Ejercicio profesional</p>
                                <p className="text-sm text-gray-700">{colegiado.recaudos.tipo_profesion_display}</p>
                            </div>
                        </div>

                        {/* Información del creador del registro */}
                        {colegiado.recaudos.user_admin_create_username && (
                            <div className="bg-gray-50 p-2 rounded-md col-span-2 mt-4 w-full">
                                <SessionInfo creador={{username:colegiado.recaudos.user_admin_create_username,fecha:colegiado.recaudos.created_at}} variant="compact" />
                            </div>
                        )}
                        {colegiado.recaudos.user_admin_update_username && (
                            <div className="bg-gray-50 p-2 rounded-md col-span-2 mt-4 w-full">
                                <SessionInfo creador={{username:colegiado.recaudos.user_admin_update_username,fecha:colegiado.recaudos.created_at, tipo:"aprobado"}} variant="compact" />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                        <button
                            onClick={onNuevaSolicitud}
                            className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <PlusCircle size={18} />
                            <span>Nueva solicitud</span>
                        </button>

                        {!colegiado.titulo && (
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
"use client"
import { Check, Clock, FileText, Search, User } from "lucide-react"
import { useEffect, useState } from "react"

export default function SeleccionarTipoSolvencia({
    onFinalizarSolvencia,
    onClose,
    mostrarSeleccionColegiado = true,
    colegiados = [],
    colegiadoPreseleccionado = null,
    creadorInfo,
}) {
    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        colegiadoId: colegiadoPreseleccionado ? colegiadoPreseleccionado.id : "",
        tipoSolvencia: "",
        descripcion: "",
        conCosto: true,
        documentosAdjuntos: {},
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [showColegiadosList, setShowColegiadosList] = useState(false)

    // Si hay un colegiado preseleccionado, establecer el ID en el formulario
    useEffect(() => {
        if (colegiadoPreseleccionado) {
            setFormData((prev) => ({
                ...prev,
                colegiadoId: colegiadoPreseleccionado.id,
            }))
        }
    }, [colegiadoPreseleccionado])

    // Definición de tipos de solvencia
    const TIPOS_SOLVENCIA = {
        profesional: {
            id: "profesional",
            nombre: "Solvencia Profesional",
            costo: 50.00,
            descripcion: "Certifica que el colegiado está al día con sus obligaciones gremiales",
            documentosRequeridos: [
                "Cédula de identidad",
                "Comprobante de pago",
                "Certificado de inscripción"
            ]
        },
        ejercicio: {
            id: "ejercicio",
            nombre: "Solvencia de Ejercicio",
            costo: 75.00,
            descripcion: "Certifica que el colegiado está habilitado para ejercer la profesión",
            documentosRequeridos: [
                "Cédula de identidad",
                "Comprobante de pago",
                "Certificado de inscripción",
                "Constancia de trabajo vigente"
            ]
        },
        especialidad: {
            id: "especialidad",
            nombre: "Solvencia de Especialidad",
            costo: 100.00,
            descripcion: "Certifica una especialidad odontológica reconocida",
            documentosRequeridos: [
                "Cédula de identidad",
                "Comprobante de pago",
                "Certificado de especialidad",
                "Título de especialista",
                "Constancia de trabajo vigente"
            ]
        }
    };

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
        // Limpiar error cuando el usuario escribe
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }))
        }
    }

    // Manejar subida de archivos
    const handleFileChange = (e, documento) => {
        const file = e.target.files[0]
        if (file) {
            setFormData((prev) => ({
                ...prev,
                documentosAdjuntos: {
                    ...prev.documentosAdjuntos,
                    [documento.toLowerCase().replace(/\s+/g, '_')]: file
                }
            }))
        }
    }

    // Seleccionar un colegiado de la lista
    const selectColegiado = (colegiado) => {
        setFormData((prev) => ({
            ...prev,
            colegiadoId: colegiado.id,
        }))
        setShowColegiadosList(false)
        setSearchTerm("")
        // Limpiar error si existe
        if (errors.colegiadoId) {
            setErrors((prev) => ({
                ...prev,
                colegiadoId: null,
            }))
        }
    }

    // Filtrar colegiados por término de búsqueda
    const colegiadosFiltrados = colegiados.filter(
        (colegiado) =>
            colegiado.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (colegiado.cedula && colegiado.cedula.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (colegiado.numeroRegistro && colegiado.numeroRegistro.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    // Obtener el colegiado seleccionado
    const colegiadoSeleccionado = colegiadoPreseleccionado || colegiados.find((c) => c.id === formData.colegiadoId)

    // Validar el formulario antes de enviar
    const validarFormulario = () => {
        const nuevosErrores = {}
        if (!formData.colegiadoId) nuevosErrores.colegiadoId = "Debe seleccionar un colegiado"
        if (!formData.tipoSolvencia) nuevosErrores.tipoSolvencia = "Debe seleccionar un tipo de solvencia"
        setErrors(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validarFormulario()) return
        setIsSubmitting(true)
        try {
            // Obtener datos del tipo de solvencia seleccionado
            const tipoSolvenciaSeleccionada = TIPOS_SOLVENCIA[formData.tipoSolvencia]

            // Crear objeto de nueva solvencia
            const nuevaSolvencia = {
                id: `solv-${Date.now()}`,
                tipo: tipoSolvenciaSeleccionada.nombre,
                colegiadoId: formData.colegiadoId,
                colegiadoNombre: colegiadoSeleccionado?.nombre || "Colegiado",
                fecha: new Date().toLocaleDateString(),
                estado: "Revisión",
                descripcion: formData.descripcion || `Solicitud de ${tipoSolvenciaSeleccionada.nombre}`,
                referencia: `SOLV-${Date.now().toString().slice(-6)}`,
                costo: formData.conCosto ? tipoSolvenciaSeleccionada.costo : 0,
                exonerado: !formData.conCosto,
                documentosRequeridos: tipoSolvenciaSeleccionada.documentosRequeridos,
                documentosAdjuntos: formData.documentosAdjuntos,
                estadoPago: formData.conCosto ? "Pendiente" : "Sin costo",
                tipoId: formData.tipoSolvencia
            }

            // Pasar la solvencia creada al componente padre
            onFinalizarSolvencia(nuevaSolvencia)
        } catch (error) {
            console.error("Error al crear solvencia:", error)
            setErrors({
                general: "Ocurrió un error al procesar la solvencia. Inténtelo nuevamente.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-6">
            {/* Selección de colegiado (solo si es necesario) */}
            {mostrarSeleccionColegiado && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Colegiado <span className="text-red-500">*</span>
                    </label>
                    {errors.colegiadoId && (
                        <div className="text-red-500 text-xs mb-2">
                            {errors.colegiadoId}
                        </div>
                    )}
                    <div className="relative">
                        {colegiadoSeleccionado ? (
                            <div className="flex items-center justify-between border rounded-lg p-3 mb-2">
                                <div className="flex items-center">
                                    <User size={20} className="text-gray-400 mr-2" />
                                    <div>
                                        <p className="font-medium">
                                            {colegiadoSeleccionado.nombre}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {colegiadoSeleccionado.cedula} ·{" "}
                                            {colegiadoSeleccionado.numeroRegistro}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData((prev) => ({ ...prev, colegiadoId: "" }));
                                        setShowColegiadosList(true);
                                    }}
                                    className="text-[#C40180] text-sm hover:underline"
                                >
                                    Cambiar
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar colegiado por nombre, cédula o registro..."
                                    className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowColegiadosList(true);
                                    }}
                                    onFocus={() => setShowColegiadosList(true)}
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        )}
                        {/* Lista de colegiados */}
                        {showColegiadosList && !colegiadoSeleccionado && (
                            <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                {colegiadosFiltrados.length === 0 ? (
                                    <div className="p-3 text-sm text-gray-500">
                                        No se encontraron colegiados
                                    </div>
                                ) : (
                                    colegiadosFiltrados.map((colegiado) => (
                                        <div
                                            key={colegiado.id}
                                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                            onClick={() => selectColegiado(colegiado)}
                                        >
                                            <p className="font-medium">{colegiado.nombre}</p>
                                            <p className="text-xs text-gray-500">
                                                {colegiado.cedula} · {colegiado.numeroRegistro}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Selección de tipo de solvencia */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de solvencia <span className="text-red-500">*</span>
                </label>
                {errors.tipoSolvencia && (
                    <div className="text-red-500 text-xs mb-2">
                        {errors.tipoSolvencia}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.keys(TIPOS_SOLVENCIA).map(key => {
                        const tipo = TIPOS_SOLVENCIA[key];
                        return (
                            <div
                                key={tipo.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${formData.tipoSolvencia === tipo.id
                                        ? "border-[#C40180] bg-purple-50 shadow-md"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                                onClick={() => setFormData(prev => ({ ...prev, tipoSolvencia: tipo.id }))}
                            >
                                <div className="flex justify-between mb-2">
                                    <div className="font-medium text-gray-800">{tipo.nombre}</div>
                                    {formData.tipoSolvencia === tipo.id && (
                                        <div className="bg-[#C40180] text-white rounded-full p-1">
                                            <Check size={16} />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mb-2">{tipo.descripcion}</p>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-[#C40180]">${tipo.costo.toFixed(2)}</span>
                                    <span className="text-xs text-gray-500">{tipo.documentosRequeridos.length} documentos</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Opción de costo */}
            <div className="mb-6">
                <div className="flex items-center">
                    <input
                        id="conCosto"
                        name="conCosto"
                        type="checkbox"
                        checked={formData.conCosto}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#C40180] focus:ring-[#C40180] border-gray-300 rounded"
                    />
                    <label htmlFor="conCosto" className="ml-2 block text-sm text-gray-700">
                        Aplicar costo estándar ({formData.tipoSolvencia ? `$${TIPOS_SOLVENCIA[formData.tipoSolvencia]?.costo.toFixed(2)}` : "$0.00"})
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Si esta opción está desactivada, la solvencia se marcará como exonerada de pago.
                </p>
            </div>

            {/* Documentos requeridos - solo mostrar si se ha seleccionado un tipo */}
            {formData.tipoSolvencia && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Documentos requeridos
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="space-y-3">
                            {TIPOS_SOLVENCIA[formData.tipoSolvencia].documentosRequeridos.map((documento, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FileText size={16} className="text-gray-400 mr-2" />
                                        <span className="text-sm">{documento}</span>
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            id={`documento-${index}`}
                                            onChange={(e) => handleFileChange(e, documento)}
                                            className="hidden"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <label
                                            htmlFor={`documento-${index}`}
                                            className="cursor-pointer text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            {formData.documentosAdjuntos[documento.toLowerCase().replace(/\s+/g, '_')] ? (
                                                <span className="text-green-600 flex items-center">
                                                    <Check size={14} className="mr-1" />
                                                    {formData.documentosAdjuntos[documento.toLowerCase().replace(/\s+/g, '_')].name}
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <Clock size={14} className="mr-1 text-yellow-500" />
                                                    Adjuntar
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Puede adjuntar los documentos ahora o posteriormente en la vista de detalle.
                    </p>
                </div>
            )}

            {/* Campo de descripción opcional */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones (opcional)
                </label>
                <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#C40180] focus:border-[#C40180]"
                    rows="3"
                    placeholder="Agregue detalles adicionales o notas sobre esta solvencia..."
                ></textarea>
            </div>

            {/* Mensaje de error general */}
            {errors.general && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                    {errors.general}
                </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`cursor-pointer px-4 py-2 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-lg hover:opacity-90 flex items-center gap-2 ${isSubmitting ? "opacity-70" : ""
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Procesando...
                        </>
                    ) : (
                        <>
                            Crear solvencia
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
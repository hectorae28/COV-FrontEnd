"use client"

import { useState } from "react"
import { X, Upload, AlertCircle } from "lucide-react"

export default function RegistrarColegiadoModal({ onClose, onRegistroExitoso }) {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        cedula: "",
        email: "",
        telefono: "",
        direccion: "",
        fechaNacimiento: "",
        universidad: "",
        anoGraduacion: "",
        especialidad: "",
    })
    const [documentos, setDocumentos] = useState({
        titulo: null,
        cedula: null,
        foto: null
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [paso, setPaso] = useState(1) // 1: Datos personales, 2: Datos profesionales, 3: Documentos

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Limpiar error cuando el usuario escribe
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }))
        }
    }

    const handleDocumentoChange = (e) => {
        const { name, files } = e.target
        if (files && files[0]) {
            setDocumentos(prev => ({
                ...prev,
                [name]: files[0]
            }))

            // Limpiar error
            if (errors[`documento_${name}`]) {
                setErrors(prev => ({
                    ...prev,
                    [`documento_${name}`]: null
                }))
            }
        }
    }

    const validarPaso1 = () => {
        const nuevosErrores = {}

        if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es requerido"
        if (!formData.apellido.trim()) nuevosErrores.apellido = "El apellido es requerido"
        if (!formData.cedula.trim()) nuevosErrores.cedula = "La cédula es requerida"
        if (!formData.email.trim()) nuevosErrores.email = "El correo electrónico es requerido"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) nuevosErrores.email = "Formato de correo inválido"
        if (!formData.telefono.trim()) nuevosErrores.telefono = "El teléfono es requerido"

        setErrors(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const validarPaso2 = () => {
        const nuevosErrores = {}

        if (!formData.universidad.trim()) nuevosErrores.universidad = "La universidad es requerida"
        if (!formData.anoGraduacion.trim()) nuevosErrores.anoGraduacion = "El año de graduación es requerido"

        setErrors(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const validarPaso3 = () => {
        const nuevosErrores = {}

        if (!documentos.titulo) nuevosErrores.documento_titulo = "El título universitario es requerido"
        if (!documentos.cedula) nuevosErrores.documento_cedula = "La copia de la cédula es requerida"
        if (!documentos.foto) nuevosErrores.documento_foto = "La foto es requerida"

        setErrors(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const avanzarPaso = () => {
        switch (paso) {
            case 1:
                if (validarPaso1()) setPaso(2)
                break
            case 2:
                if (validarPaso2()) setPaso(3)
                break
            default:
                break
        }
    }

    const retrocederPaso = () => {
        if (paso > 1) setPaso(paso - 1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validarPaso3()) return

        setIsSubmitting(true)

        try {
            // Simulando envío de datos al servidor
            await new Promise(resolve => setTimeout(resolve, 1500))

            const nuevoColegiado = {
                id: `temp-${Date.now()}`,
                nombre: `${formData.nombre} ${formData.apellido}`,
                cedula: formData.cedula,
                email: formData.email,
                telefono: formData.telefono,
                universidad: formData.universidad,
                anoGraduacion: formData.anoGraduacion,
                especialidad: formData.especialidad,
                fechaSolicitud: new Date().toLocaleDateString()
            }

            onRegistroExitoso(nuevoColegiado)
        } catch (error) {
            console.error("Error al registrar:", error)
            setErrors(prev => ({
                ...prev,
                general: "Ocurrió un error al procesar la solicitud. Inténtelo nuevamente."
            }))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Registrar nuevo colegiado</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Pasos */}
                <div className="px-6 pt-4">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${paso >= 1 ? 'bg-[#C40180] text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                1
                            </div>
                            <span className="text-xs mt-1">Datos personales</span>
                        </div>

                        <div className={`flex-1 h-1 mx-2 ${paso >= 2 ? 'bg-[#C40180]' : 'bg-gray-200'}`}></div>

                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${paso >= 2 ? 'bg-[#C40180] text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                2
                            </div>
                            <span className="text-xs mt-1">Datos profesionales</span>
                        </div>

                        <div className={`flex-1 h-1 mx-2 ${paso >= 3 ? 'bg-[#C40180]' : 'bg-gray-200'}`}></div>

                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${paso >= 3 ? 'bg-[#C40180] text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                3
                            </div>
                            <span className="text-xs mt-1">Documentos</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        {/* Paso 1: Datos personales */}
                        {paso === 1 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            className={`w-full p-2 border rounded-md ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Ingrese su nombre"
                                        />
                                        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                                        <input
                                            type="text"
                                            name="apellido"
                                            value={formData.apellido}
                                            onChange={handleChange}
                                            className={`w-full p-2 border rounded-md ${errors.apellido ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Ingrese su apellido"
                                        />
                                        {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cédula de identidad</label>
                                    <input
                                        type="text"
                                        name="cedula"
                                        value={formData.cedula}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded-md ${errors.cedula ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="V-12345678"
                                    />
                                    {errors.cedula && <p className="text-red-500 text-xs mt-1">{errors.cedula}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="ejemplo@mail.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            className={`w-full p-2 border rounded-md ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="+58 412-1234567"
                                        />
                                        {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                    <textarea
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Ingrese su dirección completa"
                                        rows="2"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                                    <input
                                        type="date"
                                        name="fechaNacimiento"
                                        value={formData.fechaNacimiento}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Paso 2: Datos profesionales */}
                        {paso === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Universidad</label>
                                    <input
                                        type="text"
                                        name="universidad"
                                        value={formData.universidad}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded-md ${errors.universidad ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Universidad donde se graduó"
                                    />
                                    {errors.universidad && <p className="text-red-500 text-xs mt-1">{errors.universidad}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Año de graduación</label>
                                    <input
                                        type="text"
                                        name="anoGraduacion"
                                        value={formData.anoGraduacion}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded-md ${errors.anoGraduacion ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Año en que obtuvo su título"
                                    />
                                    {errors.anoGraduacion && <p className="text-red-500 text-xs mt-1">{errors.anoGraduacion}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad (opcional)</label>
                                    <select
                                        name="especialidad"
                                        value={formData.especialidad}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Seleccione una especialidad</option>
                                        <option value="Ortodoncia">Ortodoncia</option>
                                        <option value="Endodoncia">Endodoncia</option>
                                        <option value="Periodoncia">Periodoncia</option>
                                        <option value="Odontopediatría">Odontopediatría</option>
                                        <option value="Cirugía oral">Cirugía oral</option>
                                        <option value="Odontología estética">Odontología estética</option>
                                        <option value="Prostodoncia">Prostodoncia</option>
                                        <option value="Patología oral">Patología oral</option>
                                        <option value="Odontología general">Odontología general</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Paso 3: Documentos */}
                        {paso === 3 && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3">
                                    <AlertCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium mb-1">Documentos requeridos</p>
                                        <p>Todos los documentos deben estar en formato PDF, JPG o PNG y no deben exceder los 5MB.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Título universitario</label>
                                    <div className={`border-2 border-dashed rounded-md p-4 ${errors.documento_titulo ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                                        <div className="flex flex-col items-center justify-center">
                                            <Upload className="text-gray-400 mb-2" size={24} />
                                            <p className="text-sm text-gray-600 mb-2">Arrastra el archivo o haz clic para seleccionar</p>
                                            <input
                                                type="file"
                                                name="titulo"
                                                onChange={handleDocumentoChange}
                                                className="hidden"
                                                id="titulo-upload"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                            />
                                            <label
                                                htmlFor="titulo-upload"
                                                className="bg-[#C40180] text-white text-sm px-4 py-2 rounded-md hover:bg-[#590248] transition-colors cursor-pointer"
                                            >
                                                Seleccionar archivo
                                            </label>
                                            {documentos.titulo && (
                                                <p className="text-sm text-gray-800 mt-2">
                                                    <span className="font-medium">Archivo seleccionado:</span> {documentos.titulo.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {errors.documento_titulo && <p className="text-red-500 text-xs mt-1">{errors.documento_titulo}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Copia de la cédula de identidad</label>
                                    <div className={`border-2 border-dashed rounded-md p-4 ${errors.documento_cedula ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                                        <div className="flex flex-col items-center justify-center">
                                            <Upload className="text-gray-400 mb-2" size={24} />
                                            <p className="text-sm text-gray-600 mb-2">Arrastra el archivo o haz clic para seleccionar</p>
                                            <input
                                                type="file"
                                                name="cedula"
                                                onChange={handleDocumentoChange}
                                                className="hidden"
                                                id="cedula-upload"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                            />
                                            <label
                                                htmlFor="cedula-upload"
                                                className="bg-[#C40180] text-white text-sm px-4 py-2 rounded-md hover:bg-[#590248] transition-colors cursor-pointer"
                                            >
                                                Seleccionar archivo
                                            </label>
                                            {documentos.cedula && (
                                                <p className="text-sm text-gray-800 mt-2">
                                                    <span className="font-medium">Archivo seleccionado:</span> {documentos.cedula.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {errors.documento_cedula && <p className="text-red-500 text-xs mt-1">{errors.documento_cedula}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto tipo carnet</label>
                                    <div className={`border-2 border-dashed rounded-md p-4 ${errors.documento_foto ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                                        <div className="flex flex-col items-center justify-center">
                                            <Upload className="text-gray-400 mb-2" size={24} />
                                            <p className="text-sm text-gray-600 mb-2">Arrastra el archivo o haz clic para seleccionar</p>
                                            <input
                                                type="file"
                                                name="foto"
                                                onChange={handleDocumentoChange}
                                                className="hidden"
                                                id="foto-upload"
                                                accept=".jpg,.jpeg,.png"
                                            />
                                            <label
                                                htmlFor="foto-upload"
                                                className="bg-[#C40180] text-white text-sm px-4 py-2 rounded-md hover:bg-[#590248] transition-colors cursor-pointer"
                                            >
                                                Seleccionar archivo
                                            </label>
                                            {documentos.foto && (
                                                <p className="text-sm text-gray-800 mt-2">
                                                    <span className="font-medium">Archivo seleccionado:</span> {documentos.foto.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {errors.documento_foto && <p className="text-red-500 text-xs mt-1">{errors.documento_foto}</p>}
                                </div>
                            </div>
                        )}

                        {errors.general && (
                            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                                {errors.general}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between p-6 border-t bg-gray-50">
                        {paso > 1 ? (
                            <button
                                type="button"
                                onClick={retrocederPaso}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Anterior
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {paso < 3 ? (
                            <button
                                type="button"
                                onClick={avanzarPaso}
                                className="px-4 py-2 bg-[#C40180] text-white rounded-md hover:bg-[#590248]"
                            >
                                Siguiente
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 bg-[#C40180] text-white rounded-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#590248]'}`}
                            >
                                {isSubmitting ? 'Procesando...' : 'Enviar solicitud'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}
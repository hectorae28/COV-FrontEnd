// components/DynamicEventForm.jsx
"use client";
import api from "@/api/api";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function DynamicEventForm({
    formulario,
    title = "Formulario de inscripción",
    description = "Complete todos los campos requeridos",
    onSuccess,
    singleStep = false
}) {
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [formStep, setFormStep] = useState(0);

    // Define field groups
    const personalFields = [
        { tipo: "texto", nombre: "nombre", requerido: "true" },
        { tipo: "texto", nombre: "apellido", requerido: "true" },
        { tipo: "texto", nombre: "identificacion", requerido: "true" },
        { tipo: "texto", nombre: "correo", requerido: "true", isEmail: true },
        { tipo: "texto", nombre: "telefono_movil", requerido: "true" },
        { tipo: "fecha", nombre: "fecha_de_nacimiento", requerido: "true" }
    ];

    const customFields = formulario?.campos || [];

    // If singleStep is true, we combine all fields
    const allFields = singleStep ? [...personalFields, ...customFields] : [];
    const currentFields = singleStep ? allFields : (formStep === 0 ? personalFields : customFields);

    const handleChange = (e) => {
        const { name, value, files, type, checked } = e.target;

        if (files && files.length > 0) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
            setSelectedFileName((prev) => ({ ...prev, [name]: files[0].name }));
        } else if (type === 'checkbox') {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleDrop = (e, inputName) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            setFormData((prev) => ({ ...prev, [inputName]: file }));
            setSelectedFileName((prev) => ({ ...prev, [inputName]: file.name }));
        }
    };

    const handleDragEvents = (e, isDraggingState) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(isDraggingState);
    };

    const validateForm = () => {
        const fieldsToValidate = currentFields.filter(field => field.requerido === "true");
        return fieldsToValidate.every(field => {
            if (field.isEmail) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return formData[field.nombre] && emailRegex.test(formData[field.nombre]);
            }
            return formData[field.nombre];
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setSubmitStatus({
                success: false,
                message: "Por favor complete todos los campos requeridos"
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        const extra = new FormData();
        const personaData = {
            nombre: formData.nombre,
            apellido: formData.apellido,
            identificacion: formData.identificacion,
            correo: formData.correo,
            telefono_movil: formData.telefono_movil,
            fecha_de_nacimiento: formData.fecha_de_nacimiento,
            evento: formulario.evento,
            curso: formulario.curso,
        };

        customFields.forEach((campo) => {
            if (campo.tipo === "archivo") {
                extra.append(campo.nombre, formData[campo.nombre] || '');
            } else {
                extra.append(campo.nombre, formData[campo.nombre] || "");
            }
        });

        extra.append("persona", JSON.stringify(personaData));

        try {
            const response = await api.post("eventos/inscripcion/", extra, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status !== 201) {
                throw new Error("Error al enviar el formulario", response.status);
            }

            setSubmitStatus({
                success: true,
                message: "¡Inscripción exitosa! Recibirás un correo con la confirmación."
            });

            // Reiniciar el formulario después de 2 segundos
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 2000);

        } catch (error) {
            console.error("Error:", error);
            setSubmitStatus({
                success: false,
                message: "Ha ocurrido un error al procesar tu inscripción. Por favor intenta nuevamente."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Si no hay campos, mostrar un mensaje
    if (!formulario) {
        return (
            <div className="w-full max-w-2xl mx-auto bg-white rounded-lg overflow-hidden">
                <div className="p-6 text-center">
                    <p className="text-gray-600">
                        No hay formulario disponible para este evento.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto">
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {title}
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                    {description}
                </p>

                <form className="space-y-6">
                    {/* All form fields */}
                    <div className="space-y-5">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="all-fields"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {currentFields.map((campo, idx) => (
                                    <div key={`${campo.nombre}-${idx}`} className="space-y-2 mb-5">
                                        <label
                                            htmlFor={campo.nombre}
                                            className="block text-sm font-medium text-gray-700 flex items-center gap-1"
                                        >
                                            {campo.nombre.charAt(0).toUpperCase() + campo.nombre.slice(1).replace(/_/g, ' ')}
                                            {campo.requerido === "true" && (
                                                <span className="text-red-500">*</span>
                                            )}
                                        </label>

                                        {campo.tipo === "texto" && (
                                            <input
                                                id={campo.nombre}
                                                type={campo.isEmail ? "email" : "text"}
                                                name={campo.nombre}
                                                maxLength={campo.longitud_maxima || 100}
                                                required={campo.requerido === "true"}
                                                onChange={handleChange}
                                                value={formData[campo.nombre] || ""}
                                                placeholder={`Ingrese ${campo.nombre.replace(/_/g, ' ')}`}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] outline-none bg-white"
                                            />
                                        )}

                                        {campo.tipo === "numero" && (
                                            <input
                                                id={campo.nombre}
                                                type="number"
                                                name={campo.nombre}
                                                required={campo.requerido === "true"}
                                                onChange={handleChange}
                                                value={formData[campo.nombre] || ""}
                                                placeholder={`Ingrese ${campo.nombre.replace(/_/g, ' ')}`}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] outline-none bg-white"
                                            />
                                        )}

                                        {campo.tipo === "seleccion" && (
                                            <div className="relative">
                                                <select
                                                    id={campo.nombre}
                                                    name={campo.nombre}
                                                    required={campo.requerido === "true"}
                                                    value={formData[campo.nombre] || ""}
                                                    onChange={handleChange}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] outline-none appearance-none bg-white"
                                                >
                                                    <option value="" disabled>
                                                        {`Seleccione ${campo.nombre.replace(/_/g, ' ')}`}
                                                    </option>
                                                    {campo.opciones?.map((opcion, i) => (
                                                        <option key={`${opcion}-${i}`} value={opcion}>
                                                            {opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <svg
                                                        className="h-4 w-4 fill-current"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}

                                        {campo.tipo === "archivo" && (
                                            <div className="flex flex-col gap-2">
                                                <div
                                                    className={`flex items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 ${isDragging ? "border-[#C40180] bg-[#C40180]/5" : "border-gray-300"}`}
                                                    onDrop={(e) => handleDrop(e, campo.nombre)}
                                                    onDragEnter={(e) => handleDragEvents(e, true)}
                                                    onDragLeave={(e) => handleDragEvents(e, false)}
                                                    onDragOver={(e) => handleDragEvents(e, true)}
                                                >
                                                    <label
                                                        htmlFor={campo.nombre}
                                                        className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                                                    >
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <svg
                                                                className="w-8 h-8 text-gray-400"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                                ></path>
                                                            </svg>
                                                            <div className="text-center">
                                                                <p className="text-sm font-medium text-gray-700">
                                                                    Haz clic para subir o arrastra y suelta
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {campo.tipo_archivo === "imagen"
                                                                        ? "PNG, JPG o GIF"
                                                                        : "Cualquier tipo de archivo"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <input
                                                            id={campo.nombre}
                                                            type="file"
                                                            name={campo.nombre}
                                                            accept={campo.tipo_archivo === "imagen" ? "image/*" : "*"}
                                                            required={campo.requerido === "true"}
                                                            onChange={handleChange}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>
                                                {selectedFileName[campo.nombre] && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-white p-2 rounded-md border border-gray-200">
                                                        <svg
                                                            className="w-4 h-4 text-[#C40180]"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M5 13l4 4L19 7"
                                                            ></path>
                                                        </svg>
                                                        {selectedFileName[campo.nombre]}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {campo.tipo === "fecha" && (
                                            <div className="relative">
                                                <input
                                                    id={campo.nombre}
                                                    type="date"
                                                    name={campo.nombre}
                                                    required={campo.requerido === "true"}
                                                    onChange={handleChange}
                                                    value={formData[campo.nombre] || ""}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] outline-none bg-white"
                                                />
                                            </div>
                                        )}

                                        {campo.tipo === "interruptor" && (
                                            <div className="flex items-center">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name={campo.nombre}
                                                        checked={formData[campo.nombre] || false}
                                                        onChange={handleChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#C40180]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C40180]"></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-700">
                                                        {formData[campo.nombre] ? "Sí" : "No"}
                                                    </span>
                                                </label>
                                            </div>
                                        )}

                                        {campo.descripcion && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {campo.descripcion}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Estado de envío */}
                    {submitStatus && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`w-full p-4 rounded-md text-sm ${submitStatus.success
                                ? "bg-green-50 text-green-700 border border-green-100"
                                : "bg-red-50 text-red-700 border border-red-100"
                                }`}
                        >
                            {submitStatus.message}
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <div className="flex pt-2">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 rounded-md font-medium text-white bg-gradient-to-r from-[#C40180] to-[#590248] hover:from-[#a80166] hover:to-[#470137] focus:outline-none focus:ring-2 focus:ring-[#C40180] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enviando...
                                </span>
                            ) : "Completar inscripción"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
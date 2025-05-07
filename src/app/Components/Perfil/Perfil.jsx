"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    Save,
    UserCog,
    X
} from "lucide-react";
import { useRef, useState } from "react";

// Import section components
import ColegiadoSection from "./InfoColg";
import ContactSection from "./InfoCont";
import LaboralSection from "./InfoLab";
import PersonalSection from "./InfoPers";

// Import form components for editing mode
import InfoColegiado from "@/app/(Registro)/InfoColg";
import InfoContacto from "@/app/(Registro)/InfoCont";
import InfoLaboral from "@/app/(Registro)/InfoLab";
import InfoPersonal from "@/app/(Registro)/InfoPers";

import ProfileSidebar from "./ProfileSidebar.jsx";
import TabNavigation from "./TabNavigation";
import ValidationAlert from "./ValidationAlert";

export default function PerfilColegiado({ userInfo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState("personal");
    const [validationErrors, setValidationErrors] = useState({});
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);

    // Estado inicial del formulario (desde props o valores por defecto)
    const [formData, setFormData] = useState({
        // Datos Personales
        nationality: userInfo?.nationality || "venezolana",
        idType: userInfo?.idType || "V",
        identityCard: userInfo?.identityCard || userInfo?.cedula?.replace(/[^0-9]/g, "") || "",
        firstName: userInfo?.firstName || userInfo?.nombre || "Nombre",
        secondName: userInfo?.secondName || "",
        firstLastName: userInfo?.firstLastName || userInfo?.apellido || "Apellido",
        secondLastName: userInfo?.secondLastName || "",
        birthDate: userInfo?.birthDate || "",
        gender: userInfo?.gender || "",
        age: userInfo?.age || "",
        maritalStatus: userInfo?.maritalStatus || "",

        // Datos de Contacto
        email: userInfo?.email || "email@ejemplo.com",
        countryCode: userInfo?.countryCode || "+58",
        phoneNumber: userInfo?.phoneNumber || userInfo?.telefono?.replace(/[^0-9]/g, "") || "",
        homePhone: userInfo?.homePhone || "",
        address: userInfo?.address || userInfo?.direccion || "",
        state: userInfo?.state || "",
        city: userInfo?.city || "",

        // Datos de Colegiado
        graduateInstitute: userInfo?.graduateInstitute || "",
        universityTitle: userInfo?.universityTitle || userInfo?.universidad || "",
        mainRegistrationNumber: userInfo?.mainRegistrationNumber || userInfo?.numeroColegiatura?.replace("COV-", "") || "",
        mainRegistrationDate: userInfo?.mainRegistrationDate || "",
        mppsRegistrationNumber: userInfo?.mppsRegistrationNumber || "",
        mppsRegistrationDate: userInfo?.mppsRegistrationDate || "",
        titleIssuanceDate: userInfo?.titleIssuanceDate || userInfo?.fechaGraduacion || "",

        // Datos Laborales
        workStatus: userInfo?.workStatus || "labora",
        institutionName: userInfo?.institutionName || "",
        institutionAddress: userInfo?.institutionAddress || "",
        institutionPhone: userInfo?.institutionPhone || "",
        cargo: userInfo?.cargo || "",
        laboralRegistros: userInfo?.laboralRegistros || []
    });

    // Manejar cambios en los inputs del formulario
    const handleInputChange = (updates) => {
        setFormData((prevState) => ({
            ...prevState,
            ...updates,
        }));

        // Limpiar errores de validación para los campos actualizados
        if (updates) {
            const updatedFields = Object.keys(updates);
            const newValidationErrors = { ...validationErrors };

            updatedFields.forEach(field => {
                if (newValidationErrors[field]) {
                    delete newValidationErrors[field];
                }
            });

            setValidationErrors(newValidationErrors);
        }
    };

    // Manejar subida de imagen
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    // Abrir selector de archivos
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    // Validar formulario basado en el tab activo
    const validateTab = (tabName) => {
        // Implementación de validación (código de validación aquí)
        // ...
    };

    // Validar todos los tabs
    const validateAllTabs = () => {
        // Implementación de validación de todos los tabs
        // ...
    };

    // Enviar formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        setAttemptedSubmit(true);

        // Validar todos los tabs
        const isValid = validateAllTabs();

        if (isValid) {
            // Aquí iría la lógica para enviar datos al backend
            console.log("Datos actualizados:", formData);
            console.log("Nueva imagen:", previewImage);

            // Terminar modo edición
            setIsEditing(false);
            setAttemptedSubmit(false);
        } else {
            // Mostrar un mensaje de error o cambiar a la primera pestaña con errores
            // ...
        }
    };

    // Cancelar edición
    const handleCancel = () => {
        // Restaurar valores originales
        // ...
        setPreviewImage(null);
        setIsEditing(false);
        setAttemptedSubmit(false);
        setValidationErrors({});
    };

    return (
        <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="max-w-6xl mx-auto">
                {/* Cabecera */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#41023B]">Perfil del Colegiado</h1>

                    {/* Botones de acción */}
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-[#D7008A] hover:bg-[#41023B] text-white rounded-lg px-4 py-2 transition-colors duration-300 shadow-md hover:shadow-lg"
                        >
                            <UserCog size={18} />
                            <span>Actualizar Datos</span>
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg px-3 py-2 transition-colors duration-300"
                            >
                                <X size={18} />
                                <span>Cancelar</span>
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-2 transition-colors duration-300 shadow-md"
                            >
                                <Save size={18} />
                                <span>Guardar</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Sección principal con foto y datos */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar con foto e información básica */}
                    <ProfileSidebar 
                        formData={formData}
                        previewImage={previewImage}
                        userInfo={userInfo}
                        isEditing={isEditing}
                        handleImageClick={handleImageClick}
                        handleImageChange={handleImageChange}
                        fileInputRef={fileInputRef}
                    />

                    {/* Columna derecha - Información y formulario */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            {/* Pestañas de navegación */}
                            <TabNavigation 
                                activeTab={activeTab} 
                                setActiveTab={setActiveTab} 
                            />

                            {!isEditing ? (
                                /* Modo de visualización */
                                <AnimatePresence mode="wait">
                                    {activeTab === "personal" && (
                                        <PersonalSection formData={formData} />
                                    )}

                                    {activeTab === "contacto" && (
                                        <ContactSection formData={formData} />
                                    )}

                                    {activeTab === "colegiado" && (
                                        <ColegiadoSection formData={formData} />
                                    )}

                                    {activeTab === "laboral" && (
                                        <LaboralSection formData={formData} />
                                    )}
                                </AnimatePresence>
                            ) : (
                                /* Modo de edición - Formulario */
                                <AnimatePresence mode="wait">
                                    {activeTab === "personal" && (
                                        <motion.div
                                            key="personal-form"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <InfoPersonal 
                                                formData={formData} 
                                                onInputChange={handleInputChange} 
                                                validationErrors={validationErrors}
                                            />
                                        </motion.div>
                                    )}

                                    {activeTab === "contacto" && (
                                        <motion.div
                                            key="contacto-form"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <InfoContacto 
                                                formData={formData} 
                                                onInputChange={handleInputChange} 
                                                validationErrors={validationErrors}
                                            />
                                        </motion.div>
                                    )}

                                    {activeTab === "colegiado" && (
                                        <motion.div
                                            key="colegiado-form"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <InfoColegiado 
                                                formData={formData} 
                                                onInputChange={handleInputChange} 
                                                validationErrors={validationErrors}
                                            />
                                        </motion.div>
                                    )}

                                    {activeTab === "laboral" && (
                                        <motion.div
                                            key="laboral-form"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <InfoLaboral 
                                                formData={formData} 
                                                onInputChange={handleInputChange} 
                                                validationErrors={validationErrors}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}

                            {/* Indicaciones de validación */}
                            {attemptedSubmit && Object.keys(validationErrors).length > 0 && (
                                <ValidationAlert />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
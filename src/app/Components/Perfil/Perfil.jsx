"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Save, UserCog, X, Check } from "lucide-react";
import { useRef, useState, useEffect } from "react";

// Import section components
import ColegiadoSection from "./InfoColg";
import ContactSection from "./InfoCont";
import LaboralSection from "./InfoLab";
import PersonalSection from "./InfoPers";
import ProfileSidebar from "./ProfileSidebar.jsx";

// Import form components for editing mode
import InfoColegiado from "@/app/(Registro)/InfoColg";
import InfoContacto from "@/app/(Registro)/InfoCont";
import InfoLaboral from "@/app/(Registro)/InfoLab";
import InfoPersonal from "@/app/(Registro)/InfoPers";

import TabNavigation from "@/app/(Colegiado)/Perfil/TabNavigation";

// Importamos el contexto para actualizar el título de la barra
import { useBarraContext } from "@/app/(Colegiado)/BarraContext";

export default function PerfilColegiado({ userInfo }) {
    const [activeTab, setActiveTab] = useState("personal");
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showPhotoControls, setShowPhotoControls] = useState(false);
    const fileInputRef = useRef(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success"); // success, error, warning
    const [validationErrors, setValidationErrors] = useState(null);
    // Estado compartido para la foto de perfil (para sincronizar con PerfilDropdown)
    const [profilePhotoChanged, setProfilePhotoChanged] = useState(false);

    // Accedemos al contexto para cambiar el título en la barra
    const { setCurrentSection } = useBarraContext();

    // Actualizamos el título de la barra cuando cambiamos de pestaña o modo de edición
    useEffect(() => {
        let sectionTitle = "Perfil";
        switch (activeTab) {
            case "personal":
                sectionTitle = "Perfil - Datos Personales";
                break;
            case "contacto":
                sectionTitle = "Perfil - Datos de Contacto";
                break;
            case "colegiado":
                sectionTitle = "Perfil - Información Profesional";
                break;
            case "laboral":
                sectionTitle = "Perfil - Situación Laboral";
                break;
            default:
                sectionTitle = "Perfil";
        }

        if (isEditing) {
            sectionTitle += " (Editando)";
        }

        setCurrentSection(sectionTitle);

        // Restaurar el título original al desmontar el componente
        return () => {
            setCurrentSection("Inicio - Panel de Solicitudes");
        };
    }, [activeTab, isEditing, setCurrentSection]);

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

    // Evento personalizado para comunicar cambios en la foto de perfil a otros componentes
    const updateProfilePhoto = (imageData) => {
        // Crear un evento personalizado para notificar a otros componentes
        const photoUpdateEvent = new CustomEvent('profile-photo-update', {
            detail: { imageData }
        });
        window.dispatchEvent(photoUpdateEvent);
    };

    // Manejar cambios en los inputs del formulario
    const handleInputChange = (updates) => {
        setFormData((prevState) => ({
            ...prevState,
            ...updates,
        }));
    };

    // Mostrar mensaje toast
    const showToastMessage = (message, type = "success") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Manejar subida de imagen
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validar tamaño (máx 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToastMessage("La imagen no debe superar los 5MB", "error");
                return;
            }

            // Validar tipo (solo imágenes)
            if (!file.type.match('image.*')) {
                showToastMessage("Por favor selecciona una imagen válida", "error");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result;
                setPreviewImage(imageData);
                showToastMessage("Imagen cargada correctamente.", "success");

                // Notificar a otros componentes sobre el cambio de imagen
                updateProfilePhoto(imageData);
                setProfilePhotoChanged(true);
            };
            reader.readAsDataURL(file);
        }
    };

    // Abrir selector de archivos
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    // Eliminar imagen de perfil
    const handleDeleteImage = () => {
        setPreviewImage(null);
        showToastMessage("Imagen eliminada. Guarda los cambios para confirmar.");
        // Notificar a otros componentes que la imagen fue eliminada
        updateProfilePhoto(null);
        setProfilePhotoChanged(true);
    };

    // Manejar guardado del formulario
    const handleSubmit = () => {
        // Aquí iría la lógica para enviar datos al backend
        // Simulamos una actualización exitosa
        setTimeout(() => {
            setIsEditing(false);
            showToastMessage(`Datos de ${getTabTitle()} actualizados correctamente`);

            // Si se cambió la foto de perfil, confirmar el cambio
            if (profilePhotoChanged) {
                // En este punto, la foto de perfil se guardaría en el servidor
                // y se actualizaría en toda la aplicación
                setProfilePhotoChanged(false);
            }
        }, 500);
    };

    // Cancelar edición
    const handleCancel = () => {
        setPreviewImage(null); // Restaurar imagen original
        setIsEditing(false);
        setShowPhotoControls(false);
    };

    // Obtener título del tab actual
    const getTabTitle = () => {
        switch (activeTab) {
            case "personal": return "Datos Personales";
            case "contacto": return "Información de Contacto";
            case "colegiado": return "Información Profesional";
            case "laboral": return "Situación Laboral";
            default: return "Perfil";
        }
    };

    return (
        <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-0 md:p-6 shadow-lg">
            <div className="w-full mx-auto">
                {/* Cabecera */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#41023B]"></h1>

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
                        activeTab={activeTab}
                        showPhotoControls={showPhotoControls}
                        setShowPhotoControls={setShowPhotoControls}
                        handleImageClick={handleImageClick}
                        handleImageChange={handleImageChange}
                        handleDeleteImage={handleDeleteImage}
                        fileInputRef={fileInputRef}
                    />

                    {/* Columna derecha - Información y formulario */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            {/* Pestañas de navegación */}
                            <TabNavigation
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                isEditing={isEditing}
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
                                                isProfileEdit={true} // Indicamos que estamos en el perfil
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
                                                isProfileEdit={true} // Indicamos que estamos en el perfil
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
                                                isProfileEdit={true} // Indicamos que estamos en el perfil
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
                                            // No necesitamos isProfileEdit para laboral
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast de notificación */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-6 right-6 p-4 rounded-lg shadow-lg max-w-md z-50 flex items-center gap-2 
                            ${toastType === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' :
                                toastType === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' :
                                    'bg-amber-50 text-amber-800 border-l-4 border-amber-500'}`}
                    >
                        {toastType === 'success' ? (
                            <Check className="h-5 w-5 text-green-500" />
                        ) : toastType === 'error' ? (
                            <X className="h-5 w-5 text-red-500" />
                        ) : (
                            <div className="h-5 w-5 text-amber-500">!</div>
                        )}
                        <p className="text-sm">{toastMessage}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
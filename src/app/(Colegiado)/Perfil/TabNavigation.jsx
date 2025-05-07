import { motion } from "framer-motion";
import { User, Phone, Briefcase, GraduationCap } from "lucide-react";

export default function TabNavigation({ activeTab, setActiveTab, isEditing }) {
    // Si está en modo edición y cambia de tab, mostrar un mensaje de confirmación
    const handleTabChange = (newTab) => {
        if (isEditing) {
            const confirmChange = window.confirm(
                '¿Estás seguro de cambiar de sección? Los cambios no guardados se perderán.'
            );
            if (confirmChange) {
                setActiveTab(newTab);
            }
        } else {
            setActiveTab(newTab);
        }
    };

    const tabs = [
        {
            id: "personal",
            label: "Datos Personales",
            icon: User
        },
        {
            id: "contacto",
            label: "Datos de Contacto",
            icon: Phone
        },
        {
            id: "colegiado",
            label: "Información Profesional",
            icon: GraduationCap
        },
        {
            id: "laboral",
            label: "Situación Laboral",
            icon: Briefcase
        }
    ];

    // Si estamos en modo edición, solo mostrar el tab activo
    const tabsToShow = isEditing ? tabs.filter(tab => tab.id === activeTab) : tabs;

    return (
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
            {tabsToShow.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-3 sm:px-4 py-2.5 font-medium text-sm whitespace-nowrap flex items-center gap-1.5 transition-colors duration-300 relative ${activeTab === tab.id
                            ? "text-[#D7008A]"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    disabled={isEditing && activeTab !== tab.id}
                >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTabIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D7008A]"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}
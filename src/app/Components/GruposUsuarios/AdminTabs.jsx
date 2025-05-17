import { motion } from "framer-motion";

export default function AdminTabs({ activeTab, setActiveTab, isEditing, tabs }) {
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

    // Mapa de iconos para cada tab
    const getTabIcon = (tabIcon) => {
        return tabIcon || null;
    };

    // Si estamos en modo edición, solo mostrar el tab activo
    const tabsToShow = isEditing ? tabs.filter(tab => tab.id === activeTab) : tabs;

    return (
        <div className="select-none cursor-default flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
            {tabsToShow.map((tab) => {
                const TabIcon = getTabIcon(tab.icon);

                return (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`cursor-pointer px-3 sm:px-4 py-2.5 font-medium text-sm whitespace-nowrap flex items-center gap-1.5 transition-colors duration-300 relative ${activeTab === tab.id
                                ? "text-[#D7008A]"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                        disabled={isEditing && activeTab !== tab.id}
                    >
                        {TabIcon && <TabIcon size={16} />}
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
                );
            })}
        </div>
    );
}
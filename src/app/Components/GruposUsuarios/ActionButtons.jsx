// Componente para botones de acción estandarizados
export default function ActionButtons({ 
    primaryAction = null,  // { label, onClick, icon, isLoading }
    secondaryAction = null, // { label, onClick, icon }
    dangerAction = null,   // { label, onClick, icon, confirmMessage }
    isDisabled = false,
    align = "right"        // "right", "left", "center", "between"
}) {
    // Manejar acción peligrosa con confirmación
    const handleDangerAction = () => {
        if (!dangerAction) return;
        
        const message = dangerAction.confirmMessage || "¿Estás seguro de realizar esta acción?";
        const confirmed = window.confirm(message);
        
        if (confirmed) {
            dangerAction.onClick();
        }
    };
    
    // Alineación de botones
    const alignmentClass = {
        right: "justify-end",
        left: "justify-start",
        center: "justify-center",
        between: "justify-between"
    }[align] || "justify-end";
    
    return (
        <div className={`flex items-center gap-2 ${alignmentClass}`}>
            {secondaryAction && (
                <button
                    type="button"
                    onClick={secondaryAction.onClick}
                    disabled={isDisabled}
                    className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                    {secondaryAction.icon && (
                        secondaryAction.icon
                    )}
                    <span>{secondaryAction.label}</span>
                </button>
            )}
            
            {dangerAction && (
                <button
                    type="button"
                    onClick={handleDangerAction}
                    disabled={isDisabled}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                    {dangerAction.icon && (
                        dangerAction.icon
                    )}
                    <span>{dangerAction.label}</span>
                </button>
            )}
            
            {primaryAction && (
                <button
                    type="button"
                    onClick={primaryAction.onClick}
                    disabled={isDisabled || primaryAction.isLoading}
                    className="px-4 py-2 bg-[#D7008A] text-white rounded-md hover:bg-[#B0006E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                    {primaryAction.isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : primaryAction.icon ? (
                        primaryAction.icon
                    ) : null}
                    <span>{primaryAction.label}</span>
                </button>
            )}
        </div>
    );
}
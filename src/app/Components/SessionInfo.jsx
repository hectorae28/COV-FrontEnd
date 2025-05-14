import { User, ShieldCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function SessionInfo({ creador, className = "", variant = "default" }) {
    if (!creador) return null;

    // Formatear la fecha relativa (hace X tiempo)
    const formatearFechaRelativa = (fecha) => {
        try {
            return formatDistanceToNow(new Date(fecha), { addSuffix: true, locale: es });
        } catch (error) {
            return "fecha desconocida";
        }
    };

    // Formatear fecha completa
    const formatearFechaCompleta = (fecha) => {
        try {
            return new Date(fecha).toLocaleString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch (error) {
            return "fecha desconocida";
        }
    };

    // Diferentes estilos según la variante
    const getStyles = () => {
        switch (variant) {
            case "compact":
                return "flex items-center gap-2 text-xs";
            case "full":
                return "flex items-start gap-2 p-3 rounded-md bg-purple-50";
            case "default":
            default:
                return "flex items-center gap-2";
        }
    };

    // Determinar el texto según el tipo de acción y el rol del usuario
    const getActionText = () => {
        if (creador.tipo === 'aprobado') {
            return "Aprobado por administrador";
        } else {
            // Verificar si es admin usando la propiedad esAdmin
            return creador.esAdmin
                ? "Creado por administrador"
                : "Creado por usuario";
        }
    };

    // Determinar el icono según el tipo de acción
    const getIcon = () => {
        if (creador.tipo === 'aprobado') {
            return <ShieldCheck className={`flex-shrink-0 ${variant === "compact" ? "h-4 w-4" : "h-5 w-5"} text-green-600`} />;
        } else {
            return <User className={`flex-shrink-0 ${variant === "compact" ? "h-4 w-4" : "h-5 w-5"} text-purple-600`} />;
        }
    };

    // Determinar el color del texto según el tipo de acción
    const getTextColor = () => {
        if (creador.tipo === 'aprobado') {
            return "text-green-500";
        } else {
            return "text-gray-500";
        }
    };

    return (
        <div className={`${getStyles()} ${className}`}>
            {getIcon()}
            <div>
                <p className={`${variant === "compact" ? "text-xs" : "text-sm"} ${getTextColor()}`}>
                    {getActionText()}:
                    <span className="font-medium text-gray-700 ml-1">
                        {creador.username}
                    </span>
                </p>
                {variant !== "compact" && (
                    <p className="text-xs text-gray-500">
                        <span className="text-purple-600">{creador.email}</span>
                    </p>
                )}
                <p className="text-xs text-gray-400">
                    {variant === "full"
                        ? formatearFechaCompleta(creador.fecha)
                        : formatearFechaRelativa(creador.fecha)
                    }
                </p>
            </div>
        </div>
    );
}

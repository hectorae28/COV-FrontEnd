import { Shield } from "lucide-react";

// Componente que controla el acceso a funcionalidades basado en niveles de permiso
export default function PermissionGuard({ children, minPermissionLevel, adminPermissionLevel }) {
  // Niveles de permiso ordenados de menor a mayor
  const permissionLevels = ["bajo", "intermedio", "total"];
  
  // Función para verificar si el usuario tiene acceso
  const hasAccess = () => {
    // Si no se especifica un adminPermissionLevel, lo obtenemos del contexto actual
    const currentPermission = adminPermissionLevel || "bajo";
    
    // Obtener índices de niveles para comparación
    const requiredLevelIndex = permissionLevels.indexOf(minPermissionLevel);
    const userLevelIndex = permissionLevels.indexOf(currentPermission);
    
    // Verificar que el nivel del usuario es mayor o igual al requerido
    return userLevelIndex >= requiredLevelIndex;
  };
  
  // Si no tiene acceso, mostrar mensaje de permiso denegado
  if (!hasAccess()) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-gray-200 rounded-lg bg-gray-50">
        <Shield className="text-gray-400 mb-4" size={48} />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Acceso Restringido</h3>
        <p className="text-gray-500 text-center max-w-md">
          No tienes los permisos necesarios para acceder a esta funcionalidad. 
          Contacta con un administrador de nivel superior.
        </p>
      </div>
    );
  }
  
  // Si tiene acceso, renderizar los componentes hijos
  return children;
}
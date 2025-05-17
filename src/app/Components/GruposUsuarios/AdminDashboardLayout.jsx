import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
    User, 
    Users, 
    Home, 
    FileText, 
    Calendar, 
    CreditCard, 
    Settings, 
    Bell, 
    Menu, 
    X, 
    Shield,
    LogOut,
    ChevronDown,
    BarChart2
} from "lucide-react";

export default function AdminDashboardLayout({ children, userInfo, session }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    
    // Cargar notificaciones (simulado)
    useEffect(() => {
        // Datos simulados para notificaciones
        const mockNotifications = [
            {
                id: 1,
                title: "Nuevo usuario registrado",
                message: "El usuario María Rodríguez se ha registrado en el sistema.",
                date: "Hace 10 minutos",
                read: false
            },
            {
                id: 2,
                title: "Pago registrado",
                message: "Se ha registrado un nuevo pago de Carlos Méndez.",
                date: "Hace 2 horas",
                read: false
            },
            {
                id: 3,
                title: "Actualización del sistema",
                message: "Se ha programado una actualización para el 20/05/2025.",
                date: "Ayer",
                read: true
            }
        ];
        
        setNotifications(mockNotifications);
    }, []);
    
    // Número de notificaciones no leídas
    const unreadCount = notifications.filter(n => !n.read).length;
    
    // Menú de navegación
    const navigationItems = [
        { 
            name: "Dashboard", 
            icon: BarChart2, 
            href: "/admin",
            minPermission: "bajo"
        },
        { 
            name: "Usuarios", 
            icon: Users, 
            href: "/admin/usuarios",
            minPermission: "bajo"
        },
        { 
            name: "Contenido", 
            icon: FileText, 
            href: "/admin/contenido",
            minPermission: "bajo"
        },
        { 
            name: "Eventos", 
            icon: Calendar, 
            href: "/admin/eventos",
            minPermission: "bajo"
        },
        { 
            name: "Pagos", 
            icon: CreditCard, 
            href: "/admin/pagos",
            minPermission: "intermedio"
        },
        { 
            name: "Permisos", 
            icon: Shield, 
            href: "/admin/permisos",
            minPermission: "total"
        },
        { 
            name: "Configuración", 
            icon: Settings, 
            href: "/admin/configuracion",
            minPermission: "intermedio"
        }
    ];
    
    // Verificar si el usuario tiene acceso a una opción de menú
    const hasAccess = (minPermission) => {
        const permissionLevels = ["bajo", "intermedio", "total"];
        const requiredLevelIndex = permissionLevels.indexOf(minPermission);
        const userLevelIndex = permissionLevels.indexOf(userInfo?.nivelPermiso || "bajo");
        
        return userLevelIndex >= requiredLevelIndex;
    };
    
    // Filtrar opciones de menú según permisos
    const filteredNavigation = navigationItems.filter(item => hasAccess(item.minPermission));
    
    // Cerrar sesión
    const handleLogout = async () => {
        // En producción, implementar lógica de cierre de sesión
        alert("Cerrando sesión...");
        // Para navegación, se usaría:
        // router.push("/login");
    };
    
    // Marcar notificación como leída
    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Barra lateral */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo y cierre en móvil */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <Link href="/admin" className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C40180] to-[#590248] flex items-center justify-center text-white font-bold">
                                C
                            </div>
                            <span className="text-xl font-semibold">COV Admin</span>
                        </Link>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="p-1 rounded-md hover:bg-gray-200 transition-colors lg:hidden"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    {/* Opciones de navegación */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3">
                        <ul className="space-y-1">
                            {filteredNavigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                                    >
                                        <item.icon size={18} className="mr-3 text-gray-500" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    
                    {/* Información del usuario */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {userInfo?.fotoPerfil ? (
                                    <img 
                                        src={userInfo.fotoPerfil} 
                                        alt="Foto de perfil" 
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <User size={18} className="text-gray-500" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {userInfo?.nombre} {userInfo?.apellido}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {userInfo?.nivelPermiso === "total" 
                                        ? "Administrador Total" 
                                        : userInfo?.nivelPermiso === "intermedio"
                                            ? "Administrador Intermedio"
                                            : "Administrador Básico"
                                    }
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <LogOut size={16} />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </aside>
            
            {/* Contenido principal */}
            <div className={`lg:pl-64 transition-all duration-300 ${sidebarOpen ? "pl-64" : "pl-0"}`}>
                {/* Barra superior */}
                <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                        {/* Botón de menú móvil */}
                        <button 
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-md hover:bg-gray-100 transition-colors lg:hidden"
                        >
                            <Menu size={20} />
                        </button>
                        
                        {/* Título de la página (en móvil) */}
                        <div className="lg:hidden">
                            <span className="text-lg font-semibold">COV Admin</span>
                        </div>
                        
                        {/* Acciones rápidas */}
                        <div className="flex items-center space-x-4">
                            {/* Notificaciones */}
                            <div className="relative">
                                <button 
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                
                                {/* Panel de notificaciones */}
                                {notificationsOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50"
                                    >
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-sm font-semibold">Notificaciones</h3>
                                                {unreadCount > 0 && (
                                                    <span className="text-xs text-blue-600 cursor-pointer hover:underline">
                                                        Marcar todas como leídas
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto py-1">
                                            {notifications.length > 0 ? (
                                                notifications.map(notification => (
                                                    <div 
                                                        key={notification.id}
                                                        className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                                                            !notification.read ? "bg-blue-50" : ""
                                                        }`}
                                                        onClick={() => markAsRead(notification.id)}
                                                    >
                                                        <div className="flex justify-between">
                                                            <h4 className="text-sm font-medium text-gray-900">
                                                                {notification.title}
                                                            </h4>
                                                            <span className="text-xs text-gray-500">
                                                                {notification.date}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {notification.message}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-6 text-center">
                                                    <p className="text-sm text-gray-500">
                                                        No tienes notificaciones
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="px-4 py-2 border-t border-gray-200">
                                            <Link 
                                                href="/admin/notificaciones"
                                                className="text-xs text-blue-600 hover:underline block text-center"
                                            >
                                                Ver todas las notificaciones
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                            
                            {/* Menú de usuario */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-1 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        {userInfo?.fotoPerfil ? (
                                            <img 
                                                src={userInfo.fotoPerfil} 
                                                alt="Foto de perfil" 
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <User size={16} className="text-gray-500" />
                                        )}
                                    </div>
                                    <ChevronDown size={14} className="text-gray-500" />
                                </button>
                                
                                {/* Menú desplegable */}
                                {userMenuOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                                    >
                                        <div className="py-2 px-4 border-b border-gray-200">
                                            <p className="text-sm font-medium text-gray-900">
                                                {userInfo?.nombre} {userInfo?.apellido}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {userInfo?.email}
                                            </p>
                                        </div>
                                        <div className="py-1">
                                            <a 
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setUserMenuOpen(false);
                                                    // Aquí iría la navegación
                                                }}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <User size={16} className="mr-3 text-gray-500" />
                                                Mi Perfil
                                            </a>
                                            <a 
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setUserMenuOpen(false);
                                                    // Aquí iría la navegación
                                                }}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <Settings size={16} className="mr-3 text-gray-500" />
                                                Configuración
                                            </a>
                                        </div>
                                        <div className="py-1 border-t border-gray-200">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                <LogOut size={16} className="mr-3 text-gray-500" />
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>
                
                {/* Contenido de la página */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
                
                {/* Pie de página */}
                <footer className="py-4 px-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Colegio Odontológico de Venezuela. Todos los derechos reservados.
                    </p>
                </footer>
            </div>
            
            {/* Overlay para móvil */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
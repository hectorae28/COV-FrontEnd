"use client";
import { AccountBalance, Assessment, Celebration, ChevronRight, ContactPage, DescriptionRounded, ExpandMore, Forum, Group, Handshake, Home, House, Message, Newspaper, NoteAdd, Notifications, PersonRounded, PriceChange, RequestQuote, Settings, Web } from "@mui/icons-material";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DIVIDER_OPACITY = "60";
const BORDER_OPACITY = "60";
const DIVIDER_CLASS = `w-10/12 mx-auto h-px bg-gradient-to-r from-transparent via-white/${DIVIDER_OPACITY} to-transparent`;
const BORDER_CLASS = `border-b border-white/${BORDER_OPACITY} shadow-sm`;

// Componente de divisor
const ModernDivider = () => (
  <div className="pt-3 pb-1">
    <div className={DIVIDER_CLASS} suppressHydrationWarning={true}></div>
  </div>
);

// Sidebar Item
const SidebarItem = ({ icon, text, active, onClick }) => {
  const baseClass = "flex items-center px-4 py-2.5 rounded-lg mx-auto transition-all duration-200 w-4/5 cursor-pointer";
  const activeClass = active
    ? "bg-white/10 text-white font-medium shadow-sm backdrop-blur-sm"
    : "bg-transparent text-white/70 hover:bg-[#41023B]/40 hover:text-white";

  const className = `${baseClass} ${activeClass}`;

  return (
    <div
      onClick={onClick}
      className={className}
      suppressHydrationWarning={true}
    >
      <span className="mr-3">{icon}</span>
      <span className="whitespace-nowrap text-sm">{text}</span>
    </div>
  );
};

// Menu Section
const MenuSection = ({ title, icon, children, isExpanded, onClick, isActive }) => {
  const baseClass = "flex items-center w-4/5 mx-auto px-4 py-3 rounded-lg transition-all duration-200";
  const stateClass = isActive
    ? "bg-[#41023B]/80 text-white font-medium"
    : "bg-transparent text-white/70 hover:bg-[#41023B]/40 hover:text-white";

  const buttonClass = `${baseClass} ${stateClass}`;

  return (
    <div className="mb-4">
      <button
        onClick={onClick}
        className={buttonClass}
        suppressHydrationWarning={true}
      >
        <span className="mr-3">{icon}</span>
        <span className="text-sm font-semibold">{title}</span>
        <span className="ml-auto">
          {isExpanded ? (
            <ExpandMore className={`h-5 w-5 ${isActive ? "text-white" : "text-white/70"}`} suppressHydrationWarning={true} />
          ) : (
            <ChevronRight className={`h-5 w-5 ${isActive ? "text-white" : "text-white/70"}`} suppressHydrationWarning={true} />
          )}
        </span>
      </button>
      {isExpanded && <div className="mt-3 space-y-2 pl-6">{children}</div>}
      <ModernDivider />
    </div>
  );
};

// Define menu items in the desired order
const menuItems = [
  {
    key: "/PanelControl",
    config: {
      title: "Inicio",
      icon: <Home className="h-5 w-5" />,
      isDirectNav: true,
      path: "/PanelControl"
    }
  },
  {
    key: "Colegiados",
    config: {
      title: "Colegiados",
      icon: <Group className="h-5 w-5" />,
      path: "/PanelControl/ListaColegiados",
      isDirectNav: true
    }
  },
  {
    key: "Solicitudes",
    config: {
      title: "Solicitudes",
      icon: <DescriptionRounded className="h-5 w-5" />,
      routes: [
        { path: "/PanelControl/Solicitudes", title: "Solicitudes", icon: <NoteAdd className="h-5 w-5" /> },
        { path: "/PanelControl/Solvencias", title: "Solvencias", icon: <PriceChange className="h-5 w-5" /> },
      ],
    }
  },
  {
    key: "Pagos",
    config: {
      title: "Pagos",
      icon: <RequestQuote className="h-5 w-5" />,
      path: "/PanelControl/Pagos",
      isDirectNav: true
    }
  },
  {
    key: "Comunicaciones",
    config: {
      title: "Comunicaciones",
      icon: <Forum className="h-5 w-5" />,
      routes: [
        { path: "/PanelControl/Mensajes", title: "Mensajes", icon: <Message className="h-5 w-5" /> },
        { path: "/PanelControl/Notificaciones", title: "Notificaciones", icon: <Notifications className="h-5 w-5" /> },
      ],
    }
  },
  {
    key: "CursosEventos",
    config: {
      title: "Cursos y Eventos",
      icon: <Celebration className="h-5 w-5" />,
      path: "/PanelControl/CursosEventos",
      isDirectNav: true
    }
  },
  {
    key: "Página Web",
    config: {
      title: "Página Web",
      icon: <Web className="h-5 w-5" />,
      routes: [
        { path: "/PanelControl/Inicio", title: "Inicio", icon: <House className="h-5 w-5" /> },
        { path: "/PanelControl/SobreCOV", title: "Sobre Nosotros", icon: <Handshake className="h-5 w-5" /> },
        { path: "/PanelControl/Noticias", title: "Noticias", icon: <Newspaper className="h-5 w-5" /> },
        { path: "/PanelControl/NuevaLey", title: "Nueva Ley", icon: <AccountBalance className="h-5 w-5" /> },
        { path: "/PanelControl/Tramites", title: "Tramites", icon: <RequestQuote className="h-5 w-5" /> },
        { path: "/PanelControl/Contactenos", title: "Contactenos", icon: <ContactPage className="h-5 w-5" /> }
      ],
    }
  },
  {
    key: "Estadisticas",
    config: {
      title: "Estadisticas",
      icon: <Assessment className="h-5 w-5" />,
      path: "/PanelControl/Estadisticas",
      isDirectNav: true
    }
  },
  {
    key: "Configuración",
    config: {
      title: "Configuración",
      icon: <Settings className="h-5 w-5" />,
      routes: [
        { path: "/PanelControl/Usuarios", title: "Usuarios", icon: <PersonRounded className="h-5 w-5" /> },
        { path: "/PanelControl/Grupos", title: "Grupos", icon: <Group className="h-5 w-5" /> },
        { path: "/PanelControl/MetodoPago", title: "Metodos de Pagos", icon: <RequestQuote className="h-5 w-5" /> },
      ],
    }
  }
];

// Convert to object format for easier access
const menuStructure = Object.fromEntries(menuItems.map(item => [item.key, item.config]));

export default function AppBar({ setSelectedTitle, setSidebarOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedSection, setExpandedSection] = useState(null);

  // Fixed isRouteActive function to properly check exact matches and subpaths
  const isRouteActive = (route) => {
    // Ensure both paths are normalized with leading slashes
    const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
    const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;

    // For the home/panel control route, only match exactly to avoid matching all panel control subpaths
    if (normalizedRoute === '/PanelControl') {
      return normalizedPathname === '/PanelControl';
    }

    // For other routes, check if pathname exactly matches or is a subpath
    return normalizedPathname === normalizedRoute ||
      normalizedPathname.startsWith(`${normalizedRoute}/`);
  };

  useEffect(() => {
    if (!setSelectedTitle) return;
    if (pathname === "/") {
      setSelectedTitle({
        title: "Inicio",
        icon: <Home className="h-5 w-5" />,
      });
      return;
    }
    if (pathname === "/PanelControl/CursosEventos") {
      setSelectedTitle({
        title: "Cursos y Eventos",
        icon: <Celebration className="h-5 w-5" />,
      });
      return;
    }
    if (pathname === "/PanelControl/Estadisticas") {
      setSelectedTitle({
        title: "Estadisticas",
        icon: <Assessment className="h-5 w-5" />,
      });
      return;
    }
    if (pathname === "/PanelControl/ListaColegiados") {
      setSelectedTitle({
        title: "Colegiados",
        icon: <Group className="h-5 w-5" />,
      });
      return;
    }
    if (pathname === "/PanelControl/Pagos") {
      setSelectedTitle({
        title: "Pagos",
        icon: <RequestQuote className="h-5 w-5" />,
      });
      return;
    }

    const paginaWebRoutes = menuStructure["Página Web"].routes.map(r => r.path);
    if (paginaWebRoutes.some(route => pathname.startsWith(route))) {
      setSelectedTitle({
        title: "Página Web",
        icon: <Web className="h-5 w-5" />,
      });
      return;
    }

    for (const section of Object.values(menuStructure)) {
      if (section.routes) {
        for (const route of section.routes) {
          if (isRouteActive(route.path)) {
            setSelectedTitle({
              title: route.title,
              icon: route.icon,
            });
            return;
          }
        }
      }
    }
  }, [pathname, setSelectedTitle]);

  useEffect(() => {
    for (const [sectionKey, section] of Object.entries(menuStructure)) {
      if (section.routes && section.routes.some((route) => isRouteActive(route.path))) {
        setExpandedSection(sectionKey);
        break;
      }
    }
  }, [pathname]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const navigateTo = (route) => {
    // Asegurarse de usar rutas absolutas añadiendo una barra al inicio
    const absoluteRoute = route.startsWith('/') ? route : `/${route}`;
    router.push(absoluteRoute);
    if (setSidebarOpen) setSidebarOpen(false);
  };

  return (
    <div className="h-full w-full text-white" suppressHydrationWarning={true}>
      <div className="p-4 sm:p-8">
        <Image
          src="/assets/logo.png"
          alt="Colegio de Odontólogos de Venezuela"
          width={220}
          height={80}
          className="mx-auto"
        />
      </div>
      <div className="w-11/12 mx-auto">
        <div className={BORDER_CLASS} suppressHydrationWarning={true}></div>
      </div>
      <nav className="mt-6 space-y-2">
        {/* Render all menu items in the defined order */}
        {menuItems.map(({ key, config }) => {
          if (config.isDirectNav) {
            return (
              <div key={key}>
                <SidebarItem
                  icon={config.icon}
                  text={config.title}
                  active={isRouteActive(config.path)}
                  onClick={() => navigateTo(config.path)}
                />
                <ModernDivider />
              </div>
            );
          } else {
            return (
              <MenuSection
                key={key}
                title={config.title}
                icon={config.icon}
                isExpanded={expandedSection === key}
                onClick={() => toggleSection(key)}
                isActive={config.routes && config.routes.some((route) => isRouteActive(route.path))}
              >
                {config.routes &&
                  config.routes.map((route, index) => (
                    <SidebarItem
                      key={index}
                      icon={route.icon}
                      text={route.title}
                      active={isRouteActive(route.path)}
                      onClick={() => navigateTo(route.path)}
                    />
                  ))}
              </MenuSection>
            );
          }
        })}
      </nav>
    </div>
  );
}

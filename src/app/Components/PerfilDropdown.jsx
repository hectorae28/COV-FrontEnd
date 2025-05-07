"use client";

import { useState, useRef, useEffect } from "react";
import { AccountCircle, ExpandMore, Person } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import api from "@/api/api";
import { fetchMe } from "@/api/endpoints/colegiado";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { Divider } from "@mui/material";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { data: sessionData, status } = useSession();
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const [profileImage, setProfileImage] = useState(null);
  
  // Determinar si estamos en el panel de administradores o en la sección de colegiados
  const isAdminPanel = pathname?.startsWith('/PanelControl');
  
  // Obtener información del usuario cuando la sesión esté lista
  useEffect(() => {
    if (status === "loading") return;
    
    if (sessionData?.user?.access) {
      fetchMe(sessionData)
        .then((response) => {
          setUserInfo(response.data);
          // Si hay imagen de perfil en la respuesta, configurarla
          if (response.data?.imagenPerfil) {
            setProfileImage(response.data.imagenPerfil);
          }
        })
        .catch((error) => {
          console.error("Error al obtener datos del usuario:", error);
          // Si hay un error de autenticación, cerrar la sesión
          if (error.response?.status === 401) {
            handleSignOut();
          }
        });
    }
  }, [sessionData, status]);
  
  // Escuchar eventos de cambio de foto de perfil (solo para colegiados)
  useEffect(() => {
    // Solo activar el listener si no estamos en el panel de administradores
    if (!isAdminPanel) {
      const handleProfilePhotoUpdate = (event) => {
        setProfileImage(event.detail.imageData);
      };
      // Escuchar el evento personalizado
      window.addEventListener('profile-photo-update', handleProfilePhotoUpdate);
      // Limpiar el listener cuando el componente se desmonte
      return () => {
        window.removeEventListener('profile-photo-update', handleProfilePhotoUpdate);
      };
    }
  }, [isAdminPanel]);
  
  // Obtener las iniciales del nombre para el avatar por defecto
  const getInitials = () => {
    const nombre = userInfo?.firstName?.charAt(0) || userInfo?.nombre?.charAt(0) || "";
    const apellido = userInfo?.firstLastName?.charAt(0) || userInfo?.apellido?.charAt(0) || "";
    return (nombre + apellido).toUpperCase() || "U";
  };
  
  const handleSignOut = async () => {
    try {
      // Solo hacer la llamada al API si tenemos los datos de sesión
      if (sessionData?.user?.access) {
        await api.post('/usuario/logout/', 
          {
            username: sessionData.user.username
          },
          {
            headers: {
              Authorization: `Bearer ${sessionData.user.access}`,
            }
          }
        );
        console.log("Cierre de sesión exitoso en el servidor");
      }
      
      // Cerrar sesión en el cliente y redirigir a la página de login
      await signOut({ 
        redirect: true,
        callbackUrl: '/Login' // Redirigir al Login después de cerrar sesión (con L mayúscula)
      });
      
      // Esta línea podría no ejecutarse debido a la redirección anterior
      router.push('/Login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // En caso de error, intentar cerrar la sesión en el cliente de todos modos
      signOut({ redirect: true, callbackUrl: '/Login' });
    }
  };
  
  // Si no hay sesión, mostrar un botón de inicio de sesión
  if (status === "unauthenticated") {
    return (
      <Link href="/Login" className="flex items-center justify-center">
        <button className="px-4 py-2 text-sm font-medium text-white bg-[#41023B] rounded-md hover:bg-[#D7008A]">
          Iniciar sesión
        </button>
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón del perfil */}
      <button
        className="flex items-center space-x-1 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isAdminPanel ? (
          // Para panel de administradores - nombre o icono
          <>
            {userInfo?.firstName || userInfo?.nombre ? (
              <span className="text-gray-700 font-semibold mr-1">
                {userInfo?.firstName || userInfo?.nombre}
              </span>
            ) : (
              <AccountCircle className="text-[#41023B] mr-1" />
            )}
          </>
        ) : (
          // Para colegiados - con imagen de perfil o iniciales
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm shadow-black">
            {profileImage ? (
              <img 
                src={profileImage}
                alt="Perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#41023B] to-[#D7008A] text-white font-semibold">
                {getInitials()}
              </div>
            )}
          </div>
        )}
        {isOpen && (
          <ExpandMore className="text-[#41023B] transition-transform duration-200 rotate-180" />
        )}
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-100">
          {/* Información del usuario */}
          <div className="px-4 py-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userInfo?.firstName || userInfo?.nombre || ""} {userInfo?.firstLastName || userInfo?.apellido || ""}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {sessionData?.user?.email || userInfo?.email || ""}
            </p>
            {userInfo?.numeroColegiatura && (
              <p className="text-xs font-medium text-[#D7008A] mt-1">
                {userInfo.numeroColegiatura}
              </p>
            )}
          </div>

          {/* Opciones del menú - diferentes según la sección */}
          {!isAdminPanel && (
            <>
              <a href="/Perfil" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Person className="mr-2 text-[#41023B]" fontSize="small" />
                Mi Perfil
              </a>
              <Divider />
            </>
          )}
          
          {/* Botón de cerrar sesión */}
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            <LogOut size={16} className="mr-2 text-[#41023B]" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import { AccountCircle } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import api from "@/api/api";
import { fetchMe } from "@/api/endpoints/colegiado";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: sessionData, status } = useSession();
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    if(status === "loading") return;
    if (sessionData) {
          fetchMe(sessionData)
            .then((response) => setUserInfo(response.data))
            .catch((error) => console.log(error));
        }
  }, [sessionData]);
  const router = useRouter();

  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSingOut = () => {
    api.post(
      '/usuario/logout/',
      {
      headers: {
        Accept: '/',
        Authorization: 'Bearer ' + sessionData?.user?.access,
      },
      data: {"username": sessionData?.user?.username},
    }
      )
      .then(() => {
        console.log("Logout successful");
        signOut(session);
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };
  
  const navigateToProfile = () => {
    setIsOpen(false);
    router.push("/Perfil");
  };
  
  useEffect(() => {
    if(status=="loading")return
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none"
      >
        <AccountCircle fontSize="medium" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && userInfo && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl pt-1 z-10 border border-gray-200 overflow-hidden">
          {/* Cabecera */}
          <div 
            onClick={navigateToProfile}
            className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              {/* Foto de perfil más grande */}
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-[#41023B] flex items-center justify-center bg-gray-100">
                {userInfo?.imagenPerfil ? (
                  <img 
                    src={userInfo.imagenPerfil} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={26} className="text-gray-400" />
                )}
              </div>
              
              {/* Información del usuario */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {userInfo.nombre ? `${userInfo.nombre} ${userInfo.apellido}` : userInfo.username}
                </p>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {userInfo.email}
                </p>
                {userInfo.numeroColegiatura && (
                  <p className="text-xs font-medium text-[#D7008A] mt-1">
                    {userInfo.numeroColegiatura}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Opciones del menú */}
          <div className="py-1">
            <Link href="/Perfil" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors w-full">
              <User size={16} className="mr-3 text-[#41023B]" />
              <span>Mi Perfil</span>
            </Link>
            
            {/* Botón de cerrar sesión */}
            <button
              onClick={handleSingOut}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors w-full"
            >
              <LogOut size={16} className="mr-3 text-[#41023B]" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
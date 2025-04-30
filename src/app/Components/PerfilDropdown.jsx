"use client";

import { useState, useRef, useEffect } from "react";
import { AccountCircle } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import api from "@/api/api";
import { fetchMe } from "@/api/endpoints/colegiado";

export default function ProfileDropdown({ userInfo, session }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: sessionData, status } = useSession();

  useEffect(() => {
    if(status === "loading") return;
    if (sessionData) {
          fetchMe(sessionData)
            .then((response) => userInfo = response.data)
            .catch((error) => console.log(error));
        }
  }, [sessionData]);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleSingOut = () => {
      api.post(
        '/usuario/logout/',
        {
        headers: {
          Accept: '*/*',
          Authorization: 'Bearer ' + sessionData?.user?.access,
        },
        data: {"username": sessionData?.user?.username},
      }
        )
        .then(() => {
          console.log("Logout successful");
          signOut(sessionData);
        })
        .catch((error) => {
          console.error("Logout error:", error);
        });
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

      {isOpen && userInfo && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg pt-1 z-10 border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 cursor-pointer">
            <p className="text-sm font-medium text-gray-900">
              {userInfo.username}
            </p>
            <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
          </div>

          <div
            onClick={handleSingOut}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 transition-colors border-t border-gray-200 w-full cursor-pointer"
          >
            Cerrar sesión
          </div>
        </div>
      )}
    </div>
  );
}

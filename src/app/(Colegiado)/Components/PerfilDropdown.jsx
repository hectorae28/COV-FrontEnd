"use client";

import { useState, useRef, useEffect } from "react";
import { AccountCircle } from "@mui/icons-material";
import { signOut } from "next-auth/react";

export default function ProfileDropdown({ userInfo }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg pt-1 z-10 border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {userInfo.username}
            </p>
            <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
          </div>

          <div
            onClick={() => signOut()}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 transition-colors border-t border-gray-200 w-full"
          >
            Cerrar sesión
          </div>
        </div>
      )}
    </div>
  );
}

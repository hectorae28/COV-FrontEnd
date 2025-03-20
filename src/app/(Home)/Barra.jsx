"use client";

import { Notifications, AccountCircle } from "@mui/icons-material";

export default function Barra() {
  return (
    <header className="fixed top-0 right-0 z-50 bg-[#f2f2f2ff] shadow-sm py-4 w-440">
      <div className="flex justify-between items-center">
        {/* Texto en el lado izquierdo */}
        <div>
          <h1 className="text-xl font-semibold text-green-600 cursor-default px-88">
            Solvente{" "}
            <span className="text-black font-semibold">hasta 12/12/2025</span>
          </h1>
        </div>

        {/* Iconos en el lado derecho */}
        <div className="flex items-center space-x-6 mr-38">
          {/* Notificación */}
          <button className="text-[#41023B] cursor-pointer hover:scale-110 transition-transform duration-200">
            <Notifications sx={{ fontSize: 32 }} />
          </button>

          {/* Usuario */}
          <button className="text-[#41023B] cursor-pointer hover:scale-110 transition-transform duration-200">
            <AccountCircle sx={{ fontSize: 32 }} />
          </button>
        </div>
      </div>
    </header>
  );
}
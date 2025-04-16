"use client";

import { LibraryBooks, LibraryAddCheck, VerifiedUser, AssignmentInd, InfoOutlined } from "@mui/icons-material";
import { useState } from "react";

export default function Cards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-8 max-w-6xl mx-auto">
      <SolicitudCard 
        title="Solicitud Multiple" 
        icon={<LibraryBooks sx={{ fontSize: 30 }} />}
        description="Gestiona múltiples solicitudes en un solo proceso"
        color="from-purple-600 to-blue-500"
      />
      
      <SolicitudCard 
        title="Solicitar Solvencia" 
        icon={<LibraryAddCheck sx={{ fontSize: 30 }} />}
        description="Obtén tus documentos de solvencia financiera"
        color="from-pink-500 to-orange-400"
      />
      
      <SolicitudCard 
        title="Solicitar Constancia" 
        icon={<VerifiedUser sx={{ fontSize: 30 }} />}
        description="Certificación de status y documentos oficiales"
        color="from-teal-400 to-emerald-500"
      />
      
      <SolicitudCard 
        title="Solicitar Carnet" 
        icon={<AssignmentInd sx={{ fontSize: 30 }} />}
        description="Procesa tu identificación institucional"
        color="from-blue-400 to-cyan-600"
      />
    </div>
  );
}

function SolicitudCard({ title, icon, description, color }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`
        relative overflow-hidden bg-white rounded-xl border-0 shadow-lg
        transition-all duration-500 ease-out h-full
        ${isHovered ? 'shadow-2xl translate-y-[-5px] sm:translate-y-[-10px]' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fondo decorativo animado */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-br ${color} opacity-5
          transition-all duration-500 ease-out
          ${isHovered ? 'opacity-20 scale-110' : 'scale-100'}
        `}
      />
      
      <div className="relative p-4 sm:p-6 flex flex-col h-full">
        {/* Encabezado con el ícono */}
        <div className="flex items-start">
          <div 
            className={`
              flex items-center justify-center mb-4 sm:mb-8 p-2 sm:p-3 rounded-lg text-white
              bg-gradient-to-br ${color} shadow-md
              transition-all duration-500 ease-out
              ${isHovered ? 'scale-110 rotate-7' : 'rotate-0'}
            `}
          >
            {icon}
          </div>
          <div className="ml-4 sm:ml-8 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-black">{title}</h2>
            <div className={`h-0.5 w-0 bg-gradient-to-r ${color} mt-1 transition-all duration-500 ease-out ${isHovered ? 'w-full' : ''}`}></div>
          </div>
        </div>
        
        {/* Cuerpo de la card */}
        <div className="flex-1">
          <p className="text-gray-600 text-xs sm:text-sm">{description}</p>
        </div>
        
        {/* Pie de la card con info */}
        <div 
          className={`
            mt-4 sm:mt-6 flex items-center text-xs text-black
            transition-all duration-500 ease-out
            ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}
        >
          <InfoOutlined sx={{ fontSize: 14 }} className="mr-2" />
          <span>Click para más información</span>
        </div>
        
        {/* Botón invisible para accesibilidad */}
        <button className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label={`Abrir ${title}`} />
      </div>
    </div>
  );
}
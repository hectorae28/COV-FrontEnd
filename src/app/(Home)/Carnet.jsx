"use client";

import React, { useState } from 'react';
import { Expand, Download } from 'lucide-react';

export default function Carnet() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full h-full">
      {/* Versión completa para pantallas grandes (lg y más grandes) */}
      <div className="hidden lg:flex bg-white rounded-xl overflow-hidden transition-all duration-300 ease-out hover:shadow-xl h-full flex-col">
        {/* Encabezado del visor */}
        <div className="bg-gradient-to-b from-[#41023B] to-[#D7008A] p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-white">
              <h2 className="text-sm font-semibold">Carnet Vigente hasta: 12/12/2025</h2>
            </div>
            <div className="flex space-x-2">
              <a
                href="/assets/carnet.pdf"
                download
                className="text-white hover:text-gray-200 transition-colors"
                title="Descargar PDF"
              >
                <Download size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Contenedor del PDF */}
        <div 
          className="relative flex-1"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="pdf-container overflow-hidden relative border-t border-gray-100 h-full">
            {/* Visor de PDF */}
            <iframe
              src="/assets/carnet.pdf#toolbar=0&navpanes=0&scrollbar=0&view=Fit"
              title="Carnet PDF"
              className="w-full h-full min-h-[400px]"
              style={{ overflow: 'hidden' }}
            />
            
            {/* Overlay con efecto hover */}
            <a
              href="/assets/carnet.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 flex items-end justify-center p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}
            >
              <div className="bg-white/90 rounded-lg py-2 px-4 text-sm text-gray-800 font-medium shadow-lg transform transition-transform duration-300 ease-out translate-y-0 flex items-center">
                <Expand size={16} className="text-[#D7008A] mr-2" />
                <span>Click para ver en pantalla completa</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Versión simplificada para pantallas medianas y pequeñas (md, sm y móvil) */}
      <div className="lg:hidden flex flex-col items-center justify-center bg-white rounded-xl p-6 shadow-md">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-[#41023B]">Carnet Vigente</h2>
          <p className="text-sm text-gray-600 mt-1">Válido hasta: 12/12/2025</p>
        </div>
        <a
          href="/assets/carnet.pdf"
          download
          className="flex items-center justify-center gap-2 bg-gradient-to-b from-[#41023B] to-[#D7008A] hover:from-[#510549] hover:to-[#e20091] text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
        >
          <Download size={20} />
          <span>Descargar Carnet</span>
        </a>
      </div>
    </div>
  );
}
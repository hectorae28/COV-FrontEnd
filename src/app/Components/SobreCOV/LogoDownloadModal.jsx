'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FaCloudDownloadAlt, FaTimes, FaDownload } from 'react-icons/fa';

export default function LogoDownloadModal({ onClose }) {
  const [selectedFormat, setSelectedFormat] = useState(null);

  const downloadPng = () => {
    setSelectedFormat('PNG');
    window.open('https://drive.google.com/drive/folders/15Pvbh846B3mnUos9RKCnuHqvdSFcFGWJ', '_blank');
  };

  const downloadJpg = () => {
    setSelectedFormat('JPG');
    window.open('https://drive.google.com/drive/folders/1MRVYKWIuSbbSac7ei4VuzA0LVkAgdW5K', '_blank');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-1110 p-4">
      <div className="bg-gradient-to-t from-white to-[#41023B] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-fadeIn">
        <div className="bg-[#41023B] p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Descargar Logo COV</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="relative w-80 h-80">
              <Image 
                src="/assets/logo.png"
                alt="Logo COV"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
          
          <p className="text-center text-black mb-6">
            Seleccione el formato que desea descargar:
          </p>
          
          <div className="space-y-3">
            <button
              onClick={downloadPng}
              className={`flex items-center justify-between w-full p-4 rounded-lg transition-all ${
                selectedFormat === 'PNG' 
                  ? 'bg-purple-100 border-2 border-[#D7008A] text-[#D7008A]'
                  : 'bg-gray-100 hover:bg-purple-50 text-gray-700 hover:text-[#D7008A]'
              }`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 mr-4 flex items-center justify-center bg-purple-200 rounded-full">
                  <FaDownload size={18} className="text-[#41023B]" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Formato PNG</p>
                  <p className="text-xs text-gray-500">Fondo transparente, ideal para web</p>
                </div>
              </div>
              <span className="text-2xl">→</span>
            </button>
            
            <button
              onClick={downloadJpg}
              className={`flex items-center justify-between w-full p-4 rounded-lg transition-all ${
                selectedFormat === 'JPG' 
                  ? 'bg-purple-100 border-2 border-[#D7008A] text-[#D7008A]'
                  : 'bg-gray-100 hover:bg-purple-50 text-gray-700 hover:text-[#D7008A]'
              }`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 mr-4 flex items-center justify-center bg-purple-200 rounded-full">
                  <FaDownload size={18} className="text-[#41023B]" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Formato JPG</p>
                  <p className="text-xs text-gray-500">Alta calidad, ideal para impresión</p>
                </div>
              </div>
              <span className="text-2xl">→</span>
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="text-black hover:text-[#D7008A] text-sm font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Estilos adicionales */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

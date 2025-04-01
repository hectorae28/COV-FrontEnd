'use client';
import { useEffect, useState } from 'react';
import LogoDownloadModal from '../../Components/SobreCOV/LogoDownloadModal';

export default function DescargarLogo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Show modal automatically when this page is directly accessed
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  // If modal is closed, this empty page will be shown
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 pt-28">
      {/* Empty container - the page exists just to support the route */}
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#41023B] text-center">
          Descargar Logo COV
        </h1>
      </div>
      
      {/* Modal */}
      {isModalOpen && <LogoDownloadModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
"use client"

import Image from 'next/image';
import Link from 'next/link';

export default function AppBar() {
  return (
    <>
      {/* AppBar con fondo blanco */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/assets/logo.png" 
              alt="logos"
              width={150}
              height={60}
              className="mr-4"
            />
          </div>
          
          {/* Menú de navegación */}
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-800 hover:text-purple-900 font-medium">
              Inicio
            </Link>
            <Link href="/sobre-cov" className="text-gray-800 hover:text-purple-900 font-medium">
              Sobre COV
            </Link>
            <Link href="/nueva-ley" className="text-gray-800 hover:text-purple-900 font-medium">
              Nueva Ley
            </Link>
            <Link href="/especialistas" className="text-gray-800 hover:text-purple-900 font-medium">
              Especialistas
            </Link>
            <Link href="/eventos" className="text-gray-800 hover:text-purple-900 font-medium">
              Eventos
            </Link>
            <Link href="/tramites" className="text-gray-800 hover:text-purple-900 font-medium">
              Trámites
            </Link>
            <Link href="/contactenos" className="text-gray-800 hover:text-purple-900 font-medium">
              Contáctenos
            </Link>
          </nav>
          
          {/* Botón de trámites e Instagram */}
          <div className="flex items-center space-x-4">
            <Link href="/tramites-online" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full">
              Trámites Online
            </Link>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Síguenos en instagram</span>
              <Link href="https://instagram.com/colegioodontologos" className="text-pink-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Sección con fondo degradado morado (slider section) */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-row items-center">
            {/* Imagen/Contenido principal */}
            <div className="w-3/5 p-4">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/directiva.jpg" 
                  alt="Directiva de Odontólogos"
                  width={800}
                  height={600}
                  className="w-full"
                />
              </div>
              
              {/* Indicadores de navegación */}
              <div className="flex justify-center mt-4 space-x-2">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' : 'bg-white'
                    }`}
                    aria-label={`Ir a diapositiva ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Texto y botón */}
            <div className="w-2/5 p-4 text-white">
              <h2 className="text-3xl font-bold mb-6">
                Colegio de Odontólogos de Guárico Eligió Nueva Directiva.
              </h2>
              <div className="mt-8">
                <Link href="/conoce-mas" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full inline-block">
                  Conoce Más
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Botón de WhatsApp */}
        <div className="fixed bottom-6 right-6">
          <Link href="https://wa.me/58XXXXXXXXXX" className="block">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#25D366">
                <path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm6 15.5c-.2.63-1.18 1.44-1.63 1.5-.45.05-1.13.15-2.38-.5-1.26-.65-2.54-2.13-3.55-3.55-.6-.85-1.2-2.28-.66-3.25.54-.97 1-1.35 1.4-1.62.42-.3.75-.15.9.15.16.3.58 1.2.7 1.5.12.3 0 .65-.1.85-.1.2-.29.3-.48.5-.18.2-.38.45-.18.85.2.4 1.07 1.9 2.3 2.78.83.6 1.53.7 1.93.5.4-.2.45-.35.65-.75.2-.4.75-.38.95-.2.2.18 1.13.86 1.33 1.04.2.18.35.35.15.98z"/>
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
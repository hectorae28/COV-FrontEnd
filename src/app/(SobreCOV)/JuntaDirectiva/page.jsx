'use client';

import { useRouter } from 'next/navigation';
import AppBar from '../../(Home)/AppBar';
import Footer from '../../(Home)/Footer';

export default function SobreCOV() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <AppBar />
      </header>
      
      <main className="container mx-auto mt-28 mb-20 flex-grow">
        <h1 className="text-3xl font-bold">Junta Directiva</h1>
        
        <section className="bg-red-300 p-6 rounded-lg shadow-md">
          <p className="mb-4">
            Información sobre la organización, misión, visión y objetivos del Colegio de Odontólogos de Venezuela.
          </p>
          
          <button 
            onClick={() => router.push('/')}
            className="bg-primary text-black px-4 py-2 rounded mt-20"
          >
            Volver al inicio
          </button>
        </section>
      </main>
      
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
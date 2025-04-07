'use client';

import { useEffect, useState } from 'react';
import Presents from "./Presents";
import Cards from "./Cards";
import Noticias from "./Noticias";
import Publications from "./Publications";
import Sponser from "./Sponser";
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import BackgroundAnimation from "../Components/BackgroundAnimation";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Para evitar problemas de hidratación con SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Background animation con opacidad reducida */}
      <div className="fixed inset-0 z-[-1]">
        <BackgroundAnimation />
      </div>

      {mounted && (
        <ParallaxProvider>
          <main className="relative z-10 bg-transparent">
            {/* Sección Presents */}
            <section className="relative">
              <Parallax speed={-3}>
                <Presents />
              </Parallax>
            </section>

            {/* Sección Cards */}
            <section className="relative">
              <Parallax speed={-1}>
                <Cards />
              </Parallax>
            </section>

            {/* Sección Noticias */}
            <section className="relative">
              <Parallax speed={2}>
                <Noticias />
              </Parallax>
            </section>

            {/* Sección Publications */}
            <section className="relative">
              <Parallax speed={-2}>
                <Publications />
              </Parallax>
            </section>

            {/* Sección Sponser */}
            <section className="relative">
              <Parallax speed={4}>
                <Sponser />
              </Parallax>
            </section>
          </main>
        </ParallaxProvider>
      )}
    </div>
  );
}
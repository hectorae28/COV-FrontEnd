"use client";

import { useEffect, useState } from "react";
import Presents from "./Presents";
import Cards from "./Cards";
import Noticias from "./Noticias";
import Publications from "./Publications";
import Sponser from "./Sponser";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import BackgroundAnimation from "../Components/BackgroundAnimation";
import { fetchNoticias } from "../../api/endpoints/landingPage";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [presents, setPresents] = useState([]);
  const [noticias, setNoticias] = useState([]);

  // Para evitar problemas de hidratación con SSR
  useEffect(() => {
    const loadData = async () => {
      const destacadas = await fetchNoticias("?destacado=true");
      const noticiasData = await fetchNoticias("");
      if (destacadas.length > 0) {
        const destacadas5 = destacadas.data.slice(0, 5);
        const otrosItems = noticiasData.data.filter(
          (item) => !destacadas5.some((destacado) => destacado.id === item.id)
        );

        setPresents(destacadas5);
        setNoticias(otrosItems);
        setMounted(true);
        return;
      }
      const destacadas3 = noticiasData.data.slice(0, 3);
      const otrosItems = noticiasData.data.filter(
        (item) => !destacadas3.some((destacado) => destacado.id === item.id)
      );

      setPresents(destacadas3);
      setNoticias(otrosItems);
      setMounted(true);
    };
    loadData();
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
                <Presents props={presents} />
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
                <Noticias props={noticias} />
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

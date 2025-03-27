'use client';

import Presents from "./Presents";
import Cards from "./Cards";
import Sponser from "./Sponser";
import Noticias from "./Noticias";

export default function Home() {

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <main>
        <Presents />
        <Cards />
        <Sponser />
        <Noticias />
      </main>
    </div>
  );
}
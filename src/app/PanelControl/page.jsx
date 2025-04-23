"use client";

import Cards from "./Components/Cards";
import Graficos from "./Components/Graficos";

export default function PanelControl() {
  return (
    <div className="max-w-8xl mx-auto flex flex-col gap-8 py-10 px-4 mt-20">
      <div className="md:col-span-2 lg:col-span-2 xl:col-span-8 flex items-center">
        <div className="h-full w-full">
          <Cards />
        </div>
      </div>
      {/* Sección de Graficos*/}
      <div>
        <Graficos />
      </div>
    </div>
  );
}

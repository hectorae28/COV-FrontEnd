import { createContext, useState, useContext } from "react";

// Creamos el contexto con un valor por defecto
const BarraContext = createContext({
  currentSection: "Inicio - Panel de Solicitudes", // Valor inicial cambiado a "Inicio - Panel de Solicitudes"
  setCurrentSection: () => {}
});

export function BarraProvider({ children }) {
  const [currentSection, setCurrentSection] = useState("Inicio - Panel de Solicitudes");

  return (
    <BarraContext.Provider value={{ currentSection, setCurrentSection }}>
      {children}
    </BarraContext.Provider>
  );
}

export function useBarraContext() {
  const context = useContext(BarraContext);
  if (context === undefined) {
    throw new Error("useBarraContext debe ser usado dentro de un BarraProvider");
  }
  return context;
}
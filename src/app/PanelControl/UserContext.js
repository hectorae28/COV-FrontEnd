"use client";

import { createContext, useContext } from "react";

// Crear contexto para información de usuarios
const UserContext = createContext(null);

// Proveedor de contexto
export function UserProvider({ children, value }) {
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Hook personalizado para acceder al contexto
export function useUserContext() {
  const context = useContext(UserContext);
  
  if (context === null) {
    throw new Error('useUserContext debe usarse dentro de un UserProvider');
  }
  
  return context;
}
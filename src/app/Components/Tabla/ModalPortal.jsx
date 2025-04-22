"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ModalPortal({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Prevenir scroll cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Solo renderizamos el portal en el cliente
  return mounted 
    ? createPortal(
        children,
        document.body
      ) 
    : null;
}
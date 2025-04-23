"use client"

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import Cards from './Cards';

export default function RecomendacionesModal({ isOpen, onClose, anchorRef }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - comienza debajo de la barra */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-20 bg-black/20 z-40"
          />
          
          {/* Modal como extensión de la barra */}
          <motion.div
            ref={modalRef}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-20 right-0 left-0 lg:left-72 z-50 bg-white dark:bg-gray-800 shadow-xl"
          >
            <div className="max-h-[70vh] overflow-y-auto py-10 px-4">
              <div className="max-w-8xl mx-auto">
                <Cards />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
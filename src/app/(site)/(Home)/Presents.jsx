"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CarruselPresents from "../../Components/Home/CarruselPresents";

export default function Presents({ props }) {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="rounded-b-4xl bg-black flex flex-col justify-center relative overflow-hidden">
      {/* Carrusel */}
      <CarruselPresents props={props} />
    </div>
  );
}
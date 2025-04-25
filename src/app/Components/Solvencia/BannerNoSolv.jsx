"use client";

import { AlertTriangle } from "lucide-react";

export default function NoSolventBanner() {
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
      <AlertTriangle size={18} className="text-red-500 mr-2" />
      <p className="text-red-700 text-sm">
        Algunas funciones están limitadas debido a su estado de solvencia. Por favor, regularice su situación para acceder a todas las funcionalidades.
      </p>
    </div>
  );
}
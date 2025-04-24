
import React from "react";

export default function AliadosDashboard({ moduleInfo }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: moduleInfo.color }}>
        {moduleInfo.title}
      </h2>
      <p className="text-gray-600 mb-6">
        Aquí se edita la sección de aliados de la página web
      </p>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p>Editor de contenido para la sección de aliados</p>
      </div>
    </div>
  );
}

import { Edit, FileText, Save, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { tramitesInfo } from "../../../Models/PaginaWeb/Tramites/TramitesData";

export default function AvalCursosDashboard({ moduleInfo }) {
  // Estado para la información de Aval para Cursos
  const [avalCursosInfo, setAvalCursosInfo] = useState({
    title: "Aval para Cursos",
    color: "#073B4C",
    image: "/assets/tramites/AvalCursos.avif",
    icon: <GraduationCap className="w-6 h-6" />,
    contenido: "El aval académico del Colegio Odontológico de Venezuela certifica la calidad y pertinencia de cursos, diplomados y eventos científicos en el área odontológica. Este respaldo institucional garantiza el nivel académico de las actividades formativas y les otorga reconocimiento oficial dentro del gremio.",
    pdfViewer: true,
    pdfUrl: "/AvalCursos.pdf",
    costo: "100 USD",
  });

  // Estado para edición de contenido
  const [editingContenido, setEditingContenido] = useState(false);

  // Estado para edición de PDF URL
  const [editingPdfUrl, setEditingPdfUrl] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (tramitesInfo && tramitesInfo.avalCursos) {
      setAvalCursosInfo({ ...tramitesInfo.avalCursos });
    }
  }, []);

  // Guardar todos los cambios
  const handleSaveAll = () => {
    console.log("Información de Aval para Cursos actualizada:", avalCursosInfo);
    alert("Cambios guardados con éxito");
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: moduleInfo.color }}>
          {moduleInfo.title}
        </h2>
      </div>
      <p className="text-gray-600 mb-8">
        Edite la información del trámite de Aval para Cursos que se muestra en la sección de trámites.
      </p>

      {/* Contenido descriptivo */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <FileText className="mr-2" size={20} />
            Descripción General
          </h3>
        </div>
        <div className="mb-4">
          {!editingContenido ? (
            <div className="relative">
              <p className="text-gray-700 mb-2 p-4">{avalCursosInfo.contenido}</p>
              <button
                onClick={() => setEditingContenido(true)}
                className="absolute my-auto right-0 text-blue-500 hover:text-blue-700"
                title="Editar"
              >
                <Edit size={16} />
              </button>
            </div>
          ) : (
            <div>
              <textarea
                value={avalCursosInfo.contenido}
                onChange={(e) => setAvalCursosInfo({ ...avalCursosInfo, contenido: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={4}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => setEditingContenido(false)}
                  className="flex items-center gap-1 text-white px-3 py-1 rounded-md text-sm transition-colors"
                  style={{ backgroundColor: moduleInfo.color }}
                >
                  <Save size={16} />
                  Guardar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF URL */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <FileText className="mr-2" size={20} />
            Documento PDF
          </h3>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">URL del PDF</label>
          </div>
          {!editingPdfUrl ? (
            <div className="relative">
              <p className="text-gray-700 mb-2">{avalCursosInfo.pdfUrl}</p>
              <button
                onClick={() => setEditingPdfUrl(true)}
                className="absolute my-auto right-0 text-blue-500 hover:text-blue-700"
                title="Editar"
              >
                <Edit size={16} />
              </button>
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={avalCursosInfo.pdfUrl}
                onChange={(e) => setAvalCursosInfo({ ...avalCursosInfo, pdfUrl: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: /AvalCursos.pdf"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => setEditingPdfUrl(false)}
                  className="flex items-center gap-1 text-white px-3 py-1 rounded-md text-sm transition-colors"
                  style={{ backgroundColor: moduleInfo.color }}
                >
                  <Save size={16} />
                  Guardar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botón de guardar */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 text-white px-6 py-3 rounded-md shadow-md transition-colors"
          style={{ backgroundColor: moduleInfo.color }}
        >
          <Save size={20} />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}

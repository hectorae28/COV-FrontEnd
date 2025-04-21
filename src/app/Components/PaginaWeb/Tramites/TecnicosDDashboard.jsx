import { Edit, FileText, Plus, Save, Trash2, Download, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { tramitesInfo } from "../../../Models/PaginaWeb/Tramites/TramitesData";

export default function TecnicosDashboard({ moduleInfo }) {
  // Estado para la información de técnicos
  const [tecnicosInfo, setTecnicosInfo] = useState({
    title: "",
    color: "",
    image: "",
    requisitos: [],
    botones: []
  });

  // Estado para edición de requisitos
  const [editingRequisito, setEditingRequisito] = useState(null);
  const [newRequisito, setNewRequisito] = useState("");

  // Estado para edición de botones
  const [editingBoton, setEditingBoton] = useState(null);
  const [newBoton, setNewBoton] = useState({ texto: "", icon: "", link: "" });

  // Cargar datos iniciales
  useEffect(() => {
    if (tramitesInfo && tramitesInfo.tecnicosDentales) {
      setTecnicosInfo({ ...tramitesInfo.tecnicosDentales });
    }
  }, []);

  // Manejadores para requisitos
  const handleEditRequisito = (index) => {
    setEditingRequisito(index);
    setNewRequisito(tecnicosInfo.requisitos[index]);
  };

  const handleSaveRequisito = (index) => {
    if (newRequisito.trim()) {
      const updatedRequisitos = [...tecnicosInfo.requisitos];
      updatedRequisitos[index] = newRequisito;
      setTecnicosInfo({
        ...tecnicosInfo,
        requisitos: updatedRequisitos
      });
    }
    setEditingRequisito(null);
    setNewRequisito("");
  };

  const handleDeleteRequisito = (index) => {
    const updatedRequisitos = [...tecnicosInfo.requisitos];
    updatedRequisitos.splice(index, 1);
    setTecnicosInfo({
      ...tecnicosInfo,
      requisitos: updatedRequisitos
    });
  };

  const handleAddRequisito = () => {
    if (newRequisito.trim()) {
      setTecnicosInfo({
        ...tecnicosInfo,
        requisitos: [...tecnicosInfo.requisitos, newRequisito]
      });
      setNewRequisito("");
    }
  };

  // Manejadores para botones
  const handleEditBoton = (index) => {
    setEditingBoton(index);
    setNewBoton({ ...tecnicosInfo.botones[index] });
  };

  // Mover elementos arriba y abajo
  const moveItemUp = (array, index, stateUpdater) => {
    if (index > 0) {
      const newArray = [...array];
      [newArray[index], newArray[index - 1]] = [newArray[index - 1], newArray[index]];
      stateUpdater(newArray);
    }
  };

  const moveItemDown = (array, index, stateUpdater) => {
    if (index < array.length - 1) {
      const newArray = [...array];
      [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
      stateUpdater(newArray);
    }
  };

  // Guardar todos los cambios
  const handleSaveAll = () => {
    console.log("Información de Técnicos Dentales actualizada:", tecnicosInfo);
    alert("Cambios guardados con éxito");
  };

  // Renderizar icono según el tipo
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "Download":
        return <Download size={16} />;
      case "ExternalLink":
        return <ExternalLink size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: moduleInfo.color }}>
          {moduleInfo.title}
        </h2>
      </div>
      <p className="text-gray-600 mb-8">
        Edite la información del trámite de Técnicos Dentales que se muestra en la sección de trámites.
      </p>

      {/* Requisitos */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <FileText className="mr-2" size={20} />
            Requisitos
          </h3>
        </div>
        {/* Lista de requisitos */}
        <div className="space-y-3 mb-4">
          {tecnicosInfo.requisitos.map((requisito, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-3 bg-gray-50">
                <div className="flex-1">
                  <p className="text-gray-700">{requisito}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItemUp(tecnicosInfo.requisitos, index, (newArray) =>
                      setTecnicosInfo({ ...tecnicosInfo, requisitos: newArray })
                    )}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Mover arriba"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={() => moveItemDown(tecnicosInfo.requisitos, index, (newArray) =>
                      setTecnicosInfo({ ...tecnicosInfo, requisitos: newArray })
                    )}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Mover abajo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEditRequisito(index)}
                    className="text-blue-500 hover:text-blue-700 p-1"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteRequisito(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {editingRequisito === index && (
                <div className="p-4 border-t border-gray-200">
                  <textarea
                    value={newRequisito}
                    onChange={(e) => setNewRequisito(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={2}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleSaveRequisito(index)}
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
          ))}
        </div>
        {/* Formulario para agregar nuevo requisito */}
        {editingRequisito === null && (
          <div className="border border-dashed border-gray-300 rounded-lg p-4">
            <textarea
              value={newRequisito}
              onChange={(e) => setNewRequisito(e.target.value)}
              placeholder="Ingrese un nuevo requisito"
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddRequisito}
                className="flex items-center gap-1 text-white px-3 py-1 rounded-md text-sm transition-colors"
                style={{ backgroundColor: moduleInfo.color }}
              >
                <Plus size={16} />
                Añadir
              </button>
            </div>
          </div>
        )}
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

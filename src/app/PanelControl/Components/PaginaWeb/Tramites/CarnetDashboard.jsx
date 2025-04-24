import { Edit, FileText, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { tramitesInfo } from "@/app/Models/PanelControl/PaginaWeb/Tramites/TramitesData";

export default function CarnetDashboard({ moduleInfo }) {
  // Estado para la información del carnet
  const [carnetInfo, setCarnetInfo] = useState({
    title: "",
    color: "",
    image: "",
    requisitos: [],
    notas: [],
    botones: []
  });

  // Estado para edición de requisitos
  const [editingRequisito, setEditingRequisito] = useState(null);
  const [newRequisito, setNewRequisito] = useState("");

  // Estado para edición de notas
  const [editingNota, setEditingNota] = useState(null);
  const [newNota, setNewNota] = useState("");

  // Cargar datos iniciales
  useEffect(() => {
    if (tramitesInfo && tramitesInfo.carnet) {
      setCarnetInfo({ ...tramitesInfo.carnet });
    }
  }, []);

  // Manejadores para requisitos
  const handleEditRequisito = (index) => {
    setEditingRequisito(index);
    setNewRequisito(carnetInfo.requisitos[index]);
  };

  const handleSaveRequisito = (index) => {
    if (newRequisito.trim()) {
      const updatedRequisitos = [...carnetInfo.requisitos];
      updatedRequisitos[index] = newRequisito;
      setCarnetInfo({
        ...carnetInfo,
        requisitos: updatedRequisitos
      });
    }
    setEditingRequisito(null);
    setNewRequisito("");
  };

  const handleDeleteRequisito = (index) => {
    const updatedRequisitos = [...carnetInfo.requisitos];
    updatedRequisitos.splice(index, 1);
    setCarnetInfo({
      ...carnetInfo,
      requisitos: updatedRequisitos
    });
  };

  const handleAddRequisito = () => {
    if (newRequisito.trim()) {
      setCarnetInfo({
        ...carnetInfo,
        requisitos: [...carnetInfo.requisitos, newRequisito]
      });
      setNewRequisito("");
    }
  };

  // Manejadores para notas
  const handleEditNota = (index) => {
    setEditingNota(index);
    setNewNota(carnetInfo.notas[index]);
  };

  const handleSaveNota = (index) => {
    if (newNota.trim()) {
      const updatedNotas = [...carnetInfo.notas];
      updatedNotas[index] = newNota;
      setCarnetInfo({
        ...carnetInfo,
        notas: updatedNotas
      });
    }
    setEditingNota(null);
    setNewNota("");
  };

  const handleDeleteNota = (index) => {
    const updatedNotas = [...carnetInfo.notas];
    updatedNotas.splice(index, 1);
    setCarnetInfo({
      ...carnetInfo,
      notas: updatedNotas
    });
  };

  const handleAddNota = () => {
    if (newNota.trim()) {
      setCarnetInfo({
        ...carnetInfo,
        notas: [...carnetInfo.notas, newNota]
      });
      setNewNota("");
    }
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
    console.log("Información de Carnet actualizada:", carnetInfo);
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
        Edite la información del trámite de Carnet que se muestra en la sección de trámites.
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
          {carnetInfo.requisitos.map((requisito, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-3 bg-gray-50">
                <div className="flex-1">
                  <p className="text-gray-700">{requisito}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItemUp(carnetInfo.requisitos, index, (newArray) =>
                      setCarnetInfo({ ...carnetInfo, requisitos: newArray })
                    )}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Mover arriba"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={() => moveItemDown(carnetInfo.requisitos, index, (newArray) =>
                      setCarnetInfo({ ...carnetInfo, requisitos: newArray })
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

      {/* Notas */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <FileText className="mr-2" size={20} />
            Notas Importantes
          </h3>
        </div>

        {/* Lista de notas */}
        <div className="space-y-3 mb-4">
          {carnetInfo.notas.map((nota, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-3 bg-gray-50">
                <div className="flex-1">
                  <p className="text-gray-700">{nota}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItemUp(carnetInfo.notas, index, (newArray) =>
                      setCarnetInfo({ ...carnetInfo, notas: newArray })
                    )}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Mover arriba"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={() => moveItemDown(carnetInfo.notas, index, (newArray) =>
                      setCarnetInfo({ ...carnetInfo, notas: newArray })
                    )}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Mover abajo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEditNota(index)}
                    className="text-blue-500 hover:text-blue-700 p-1"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteNota(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {editingNota === index && (
                <div className="p-4 border-t border-gray-200">
                  <textarea
                    value={newNota}
                    onChange={(e) => setNewNota(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleSaveNota(index)}
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

        {/* Formulario para agregar nueva nota */}
        {editingNota === null && (
          <div className="border border-dashed border-gray-300 rounded-lg p-4">
            <textarea
              value={newNota}
              onChange={(e) => setNewNota(e.target.value)}
              placeholder="Ingrese una nueva nota importante"
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddNota}
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
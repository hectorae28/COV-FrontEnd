import { Edit, FileText, Plus, Save, Trash2, Download, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { tramitesInfo } from "../../../Models/PaginaWeb/Tramites/TramitesData";

export default function EspecialidadesDashboard({ moduleInfo }) {
  // Estado para la información de especialidades
  const [especialidadesInfo, setEspecialidadesInfo] = useState({
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

  // Estado para edición de botones
  const [editingBoton, setEditingBoton] = useState(null);
  const [newBoton, setNewBoton] = useState({ texto: "", icon: "", link: "" });

  // Cargar datos iniciales
  useEffect(() => {
    if (tramitesInfo && tramitesInfo.especialidades) {
      setEspecialidadesInfo({ ...tramitesInfo.especialidades });
    }
  }, []);

  // Manejadores para requisitos
  const handleEditRequisito = (index) => {
    setEditingRequisito(index);
    setNewRequisito(especialidadesInfo.requisitos[index]);
  };

  const handleSaveRequisito = (index) => {
    if (newRequisito.trim()) {
      const updatedRequisitos = [...especialidadesInfo.requisitos];
      updatedRequisitos[index] = newRequisito;
      setEspecialidadesInfo({
        ...especialidadesInfo,
        requisitos: updatedRequisitos
      });
    }
    setEditingRequisito(null);
    setNewRequisito("");
  };

  const handleDeleteRequisito = (index) => {
    const updatedRequisitos = [...especialidadesInfo.requisitos];
    updatedRequisitos.splice(index, 1);
    setEspecialidadesInfo({
      ...especialidadesInfo,
      requisitos: updatedRequisitos
    });
  };

  const handleAddRequisito = () => {
    if (newRequisito.trim()) {
      setEspecialidadesInfo({
        ...especialidadesInfo,
        requisitos: [...especialidadesInfo.requisitos, newRequisito]
      });
      setNewRequisito("");
    }
  };

  // Manejadores para notas
  const handleEditNota = (index) => {
    setEditingNota(index);
    setNewNota(especialidadesInfo.notas[index]);
  };

  const handleSaveNota = (index) => {
    if (newNota.trim()) {
      const updatedNotas = [...especialidadesInfo.notas];
      updatedNotas[index] = newNota;
      setEspecialidadesInfo({
        ...especialidadesInfo,
        notas: updatedNotas
      });
    }
    setEditingNota(null);
    setNewNota("");
  };

  const handleDeleteNota = (index) => {
    const updatedNotas = [...especialidadesInfo.notas];
    updatedNotas.splice(index, 1);
    setEspecialidadesInfo({
      ...especialidadesInfo,
      notas: updatedNotas
    });
  };

  const handleAddNota = () => {
    if (newNota.trim()) {
      setEspecialidadesInfo({
        ...especialidadesInfo,
        notas: [...especialidadesInfo.notas, newNota]
      });
      setNewNota("");
    }
  };

  // Manejadores para botones
  const handleEditBoton = (index) => {
    setEditingBoton(index);
    setNewBoton({ ...especialidadesInfo.botones[index] });
  };

  const handleSaveBoton = (index) => {
    if (newBoton.texto.trim() && newBoton.link.trim()) {
      const updatedBotones = [...especialidadesInfo.botones];
      updatedBotones[index] = newBoton;
      setEspecialidadesInfo({
        ...especialidadesInfo,
        botones: updatedBotones
      });
    }
    setEditingBoton(null);
    setNewBoton({ texto: "", icon: "", link: "" });
  };

  const handleDeleteBoton = (index) => {
    const updatedBotones = [...especialidadesInfo.botones];
    updatedBotones.splice(index, 1);
    setEspecialidadesInfo({
      ...especialidadesInfo,
      botones: updatedBotones
    });
  };

  const handleAddBoton = () => {
    if (newBoton.texto.trim() && newBoton.link.trim()) {
      setEspecialidadesInfo({
        ...especialidadesInfo,
        botones: [...especialidadesInfo.botones, newBoton]
      });
      setNewBoton({ texto: "", icon: "", link: "" });
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
    console.log("Información de Especialidades actualizada:", especialidadesInfo);
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
        Edite la información del trámite de Especialidades Odontológicas que se muestra en la sección de trámites.
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
          {especialidadesInfo.requisitos.map((requisito, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-3 bg-gray-50">
                <div className="flex-1">
                  <p className="text-gray-700">{requisito}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItemUp(especialidadesInfo.requisitos, index, (newArray) =>
                      setEspecialidadesInfo({ ...especialidadesInfo, requisitos: newArray })
                    )}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Mover arriba"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={() => moveItemDown(especialidadesInfo.requisitos, index, (newArray) =>
                      setEspecialidadesInfo({ ...especialidadesInfo, requisitos: newArray })
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
          {especialidadesInfo.notas && especialidadesInfo.notas.map((nota, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-3 bg-gray-50">
                <div className="flex-1">
                  <p className="text-gray-700">{nota}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItemUp(especialidadesInfo.notas, index, (newArray) =>
                      setEspecialidadesInfo({ ...especialidadesInfo, notas: newArray })
                    )}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Mover arriba"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={() => moveItemDown(especialidadesInfo.notas, index, (newArray) =>
                      setEspecialidadesInfo({ ...especialidadesInfo, notas: newArray })
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

      {/* Botones */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <FileText className="mr-2" size={20} />
            Botones de Acción
          </h3>
        </div>
        {/* Lista de botones */}
        <div className="space-y-3 mb-4">
          {especialidadesInfo.botones && especialidadesInfo.botones.map((boton, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-3 bg-gray-50">
                <div className="flex-1 flex items-center">
                  {renderIcon(boton.icon)}
                  <p className="text-gray-700 ml-2">{boton.texto} - <span className="text-gray-500 text-sm">({boton.link})</span></p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItemUp(especialidadesInfo.botones, index, (newArray) =>
                      setEspecialidadesInfo({ ...especialidadesInfo, botones: newArray })
                    )}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Mover arriba"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={() => moveItemDown(especialidadesInfo.botones, index, (newArray) =>
                      setEspecialidadesInfo({ ...especialidadesInfo, botones: newArray })
                    )}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Mover abajo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEditBoton(index)}
                    className="text-blue-500 hover:text-blue-700 p-1"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteBoton(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {editingBoton === index && (
                <div className="p-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Texto del botón</label>
                      <input
                        type="text"
                        value={newBoton.texto}
                        onChange={(e) => setNewBoton({ ...newBoton, texto: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Enlace</label>
                      <input
                        type="text"
                        value={newBoton.link}
                        onChange={(e) => setNewBoton({ ...newBoton, link: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icono</label>
                    <select
                      value={newBoton.icon}
                      onChange={(e) => setNewBoton({ ...newBoton, icon: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccionar icono</option>
                      <option value="Download">Descargar</option>
                      <option value="ExternalLink">Enlace externo</option>
                    </select>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleSaveBoton(index)}
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
        {/* Formulario para agregar nuevo botón */}
        {editingBoton === null && (
          <div className="border border-dashed border-gray-300 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto del botón</label>
                <input
                  type="text"
                  value={newBoton.texto}
                  onChange={(e) => setNewBoton({ ...newBoton, texto: e.target.value })}
                  placeholder="Ej: Planilla de inscripción"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enlace</label>
                <input
                  type="text"
                  value={newBoton.link}
                  onChange={(e) => setNewBoton({ ...newBoton, link: e.target.value })}
                  placeholder="Ej: https://ejemplo.com/planilla.pdf"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Icono</label>
              <select
                value={newBoton.icon}
                onChange={(e) => setNewBoton({ ...newBoton, icon: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Seleccionar icono</option>
                <option value="Download">Descargar</option>
                <option value="ExternalLink">Enlace externo</option>
              </select>
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddBoton}
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

      {/* Información de Costo */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <FileText className="mr-2" size={20} />
            Costo del Trámite
          </h3>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Costo (USD)</label>
          <input
            type="text"
            value={especialidadesInfo.costo || ""}
            onChange={(e) => setEspecialidadesInfo({ ...especialidadesInfo, costo: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ej: 150 USD"
          />
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

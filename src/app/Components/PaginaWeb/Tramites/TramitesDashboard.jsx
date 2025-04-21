import { Edit, FileText, Plus, Save, Trash2, Download, ExternalLink, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { tramitesInfo } from "../../../Models/PaginaWeb/Tramites/TramitesData";

export default function EspecialidadesDashboard({ moduleInfo }) {
  // Estado para la información de especialidades
  const [especialidadesInfo, setEspecialidadesInfo] = useState({
    title: "Especialidades",
    color: "#C40180",
    image: "/assets/tramites/Especialidades.avif",
    icon: <Award className="w-6 h-6" />,
    requisitos: [
      "Original y fondo negro del título de la especialización (Tamaño carta)",
      "Fondo negro del título de odontólogo (tamaño carta)",
      "Apostilla original y copia del título (en caso de ser extranjero)",
      "Fotocopia ampliada de la Cédula de Identidad (150%)",
      "2 Fotos tipo carnet",
      "Carta dirigida a la Junta Directiva Nacional solicitando el reconocimiento de la especialidad",
      "Solvencia del Colegio de Odontólogos de Venezuela"
    ],
    notas: [
      "Para los posgrados cursados en otras latitudes, se requiere presentar programas certificados (Con excepción a los ya aprobados)",
      "Especialidades dirigidas a: Cirugía Bucal, Cirugía Buco Máxilo-Facial, Endodoncia, Implantología, Odontología Biológica, Odontología Forense, Odontopediatría, Ortodoncia, Ortopedia Funcional de los Maxilares, Patología Bucal, Periodoncia, Prótesis Bucal, Prótesis Máxilo-Facial, Equilibrio Oclusal, Salud Pública, Medicina Bucal"
    ],
    botones: [
      { texto: "Planilla de inscripción", icon: "Download", link: "#", color: "#C40180" }
    ],
    costo: "100 USD"
  });

  // Estado para edición de requisitos
  const [editingRequisito, setEditingRequisito] = useState(null);
  const [newRequisito, setNewRequisito] = useState("");

  // Estado para edición de notas
  const [editingNota, setEditingNota] = useState(null);
  const [newNota, setNewNota] = useState("");

  // Estado para edición de botones
  const [editingBoton, setEditingBoton] = useState(null);
  const [newBoton, setNewBoton] = useState({ texto: "", icon: "", link: "", color: "#C40180" });

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
    setNewBoton({ texto: "", icon: "", link: "", color: "#C40180" });
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
      setNewBoton({ texto: "", icon: "", link: "", color: "#C40180" });
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

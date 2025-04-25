"use client";

import { Edit, Image as ImageIcon, Plus, Save, Trash, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { generateMockImagePath, initialAliados } from "@/app/Models/PanelControl/PaginaWeb/Inicio/AliadosData";;

export default function AliadosDashboard({ moduleInfo }) {
  // Estado inicial de aliados - ahora importado desde AliadosData
  const [aliados, setAliados] = useState(initialAliados);

  const [editingAliado, setEditingAliado] = useState(null);
  const [newAliado, setNewAliado] = useState({
    name: '',
    logo: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleDeleteAliado = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este aliado?")) {
      setAliados(aliados.filter(aliado => aliado.id !== id));
    }
  };

  const handleEditAliado = (aliado) => {
    setEditingAliado({ ...aliado });
  };

  const handleSaveAliado = () => {
    if (!editingAliado.name) {
      alert("El nombre del aliado es obligatorio");
      return;
    }

    setAliados(aliados.map(aliado =>
      aliado.id === editingAliado.id ? editingAliado : aliado
    ));
    setEditingAliado(null);
  };

  const handleAddAliado = () => {
    if (!newAliado.name) {
      alert("El nombre del aliado es obligatorio");
      return;
    }

    if (!newAliado.logo) {
      alert("La imagen del logo es obligatoria");
      return;
    }

    const newId = Math.max(...aliados.map(a => a.id), 0) + 1;
    setAliados([...aliados, { ...newAliado, id: newId }]);
    setNewAliado({ name: '', logo: '' });
    setShowAddForm(false);
  };

  // Simulación de carga de imagen - usando la función del archivo de datos
  const handleImageUpload = (setter) => {
    // En un caso real, aquí se implementaría la carga de archivos
    const mockImagePath = generateMockImagePath();
    setter(mockImagePath);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4" style={{ color: moduleInfo.color }}>
        {moduleInfo.title}
      </h2>
      <p className="text-gray-600 mb-6">
        Administra los aliados que se muestran en la sección de patrocinadores
      </p>

      {/* Gestión de aliados */}
      <div className="bg-white mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#590248]"></h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2  text-white rounded-md transition-colors flex items-center"
            style={{ backgroundColor: moduleInfo.color, color: 'white' }}
          >
            {showAddForm ? (
              <>
                <X className="w-4 h-4 mr-2" /> Cancelar
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Añadir Aliado
              </>
            )}
          </button>
        </div>

        {/* Formulario para añadir nuevo aliado */}
        {showAddForm && (
          <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="font-bold text-lg mb-4 text-[#590248]">Añadir nuevo aliado</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre del aliado
                </label>
                <input
                  type="text"
                  value={newAliado.name}
                  onChange={(e) => setNewAliado({ ...newAliado, name: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Logo
                </label>
                <div className="flex items-center">
                  {newAliado.logo ? (
                    <div className="relative w-24 h-24 mr-4 border rounded-md overflow-hidden">
                      <Image
                        src={newAliado.logo}
                        alt="Logo preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 mr-4 border rounded-md flex items-center justify-center bg-gray-100">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleImageUpload((path) => setNewAliado({ ...newAliado, logo: path }))}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Subir logo
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleAddAliado}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" /> Guardar aliado
              </button>
            </div>
          </div>
        )}

        {/* Formulario para editar aliado existente */}
        {editingAliado && (
          <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="font-bold text-lg mb-4 text-[#590248]">Editar aliado</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre del aliado
                </label>
                <input
                  type="text"
                  value={editingAliado.name}
                  onChange={(e) => setEditingAliado({ ...editingAliado, name: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Logo
                </label>
                <div className="flex items-center">
                  <div className="relative w-24 h-24 mr-4 border rounded-md overflow-hidden">
                    <Image
                      src={editingAliado.logo}
                      alt={editingAliado.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleImageUpload((path) => setEditingAliado({ ...editingAliado, logo: path }))}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Cambiar logo
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingAliado(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAliado}
                className="px-4 py-2 transition-colors flex items-center"
                style={{ backgroundColor: moduleInfo.color, color: 'white' }}
              >
                <Save className="w-4 h-4 mr-2" /> Guardar cambios
              </button>
            </div>
          </div>
        )}

        {/* Lista de aliados */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {aliados.map((aliado) => (
            <div
              key={aliado.id}
              className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-[#590248]">{aliado.name}</h4>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditAliado(aliado)}
                    className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                    title="Editar aliado"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAliado(aliado.id)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="Eliminar aliado"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="relative h-32 w-full bg-gray-50 rounded flex items-center justify-center p-2">
                <Image
                  src={aliado.logo}
                  alt={aliado.name}
                  width={120}
                  height={80}
                  className="object-contain max-h-full"
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 truncate">
                {aliado.logo}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón de guardar cambios */}
      <div className="flex justify-end mt-8">
        <button className="px-6 py-3 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 flex items-center"
        style={{ backgroundColor: moduleInfo.color, color: 'white' }}>
          Guardar todos los cambios
          <Save className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}
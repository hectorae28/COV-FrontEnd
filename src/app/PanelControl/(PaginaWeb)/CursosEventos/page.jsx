"use client";

import { cursosData, eventosData } from "@/app/Models/PanelControl/PaginaWeb/CursosEventos/CursoEventosData";
import { Tab } from "@headlessui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Import components
import EventForm from "@/Components/PaginaWeb/CursosEventos/EventForm";
import EventList from "@/Components/PaginaWeb/CursosEventos/EventList";
import FormBuilder from "@/Components/PaginaWeb/CursosEventos/FormInscripcion/FormBuilder";

const initialValues = {
  title: "",
  date: "2025-08-10",
  hora_inicio: "09:00",
  location: "",
  image: "",
  direccionMapa: "",
  linkText: "Inscríbete"
};

export default function DashboardEventos() {
  const [formValues, setFormValues] = useState(initialValues);
  const [eventos, setEventos] = useState(eventosData);
  const [cursos, setCursos] = useState(cursosData);
  const [tabIndex, setTabIndex] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  
  // Nuevo estado para manejar el formulario
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [currentFormItem, setCurrentFormItem] = useState(null);

  useEffect(() => {
    const currentData = tabIndex === 0 ? eventos : cursos;
    if (searchTerm) {
      setFilteredData(
        currentData.filter(item => 
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredData(currentData);
    }
  }, [searchTerm, tabIndex, eventos, cursos]);

  const handleAdd = () => {
    const newItem = { ...formValues, id: Date.now() };
    if (tabIndex === 0) {
      setEventos((prev) => [newItem, ...prev]);
    } else {
      setCursos((prev) => [newItem, ...prev]);
    }
  };

  const handleSave = () => {
    if (editingId) {
      const updatedItem = { ...formValues, id: editingId };
      if (tabIndex === 0) {
        setEventos((prev) => prev.map((e) => (e.id === editingId ? updatedItem : e)));
      } else {
        setCursos((prev) => prev.map((c) => (c.id === editingId ? updatedItem : c)));
      }
    } else {
      handleAdd();
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setFormValues(initialValues);
    setIsCreating(true);
  };

  const handleDelete = (id, type) => {
    if (type === "evento") {
      setEventos((prev) => prev.filter((e) => e.id !== id));
    } else {
      setCursos((prev) => prev.filter((c) => c.id !== id));
    }
    if (editingId === id) {
      resetForm();
    }
  };

  const handleSelect = (item) => {
    // Ensure all form fields have defined values
    const safeItem = {
      ...initialValues,
      ...item,
      title: item.title || "",
      date: item.date || "2025-08-10",
      hora_inicio: item.hora_inicio || "09:00",
      location: item.location || "",
      image: item.image || "",
      direccionMapa: item.direccionMapa || "",
      linkText: item.linkText || "Inscríbete"
    };
    
    setFormValues(safeItem);
    setEditingId(item.id);
    setIsCreating(false);
  };

  const handleNewItem = () => {
    resetForm();
  };

  // Funciones para el constructor de formularios
  const handleFormBuilder = (item) => {
    setCurrentFormItem(item);
    setShowFormBuilder(true);
  };

  const handleSaveForm = (updatedItem) => {
    // Actualizar el item con el formulario
    if (tabIndex === 0) {
      setEventos(prev => prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
    } else {
      setCursos(prev => prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
    }
    setShowFormBuilder(false);
  };

  // Si estamos mostrando el constructor de formularios
  if (showFormBuilder) {
    return (
      <FormBuilder 
        item={currentFormItem} 
        onBack={() => setShowFormBuilder(false)}
        onSave={handleSaveForm}
      />
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-10 mt-36 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
        >
          Inicio ELCOV
        </motion.h1>
        <motion.p
          className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Gestión de contenidos del <span className="font-bold text-[#C40180]">Inicio</span> del sitio web del Colegio Odontológico de Venezuela
        </motion.p>
      </motion.div>

      <Tab.Group selectedIndex={tabIndex} onChange={(i) => { 
        setTabIndex(i); 
        resetForm();
        setSearchTerm("");
      }}>
        <Tab.List className="flex space-x-2 mb-4 bg-white p-1 rounded-lg shadow-sm">
          <Tab className={({ selected }) => 
            `px-4 py-2 rounded-md transition-all duration-200 flex-1 text-center font-medium ${
              selected 
                ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white shadow-md" 
                : "text-gray-700 hover:bg-gray-100"
            }`
          }>
            Eventos
          </Tab>
          <Tab className={({ selected }) => 
            `px-4 py-2 rounded-md transition-all duration-200 flex-1 text-center font-medium ${
              selected 
                ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white shadow-md" 
                : "text-gray-700 hover:bg-gray-100"
            }`
          }>
            Cursos
          </Tab>
        </Tab.List>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left side: Form with Preview */}
          <div className="lg:col-span-4 space-y-4">
            <EventForm 
              formValues={formValues}
              setFormValues={setFormValues}
              handleSave={handleSave}
              isCreating={isCreating}
              handleNewItem={handleNewItem}
              tabIndex={tabIndex}
            />
          </div>
          
          {/* Right side: List */}
          <div className="lg:col-span-8">
            <EventList 
              filteredData={filteredData}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              tabIndex={tabIndex}
              editingId={editingId}
              handleSelect={handleSelect}
              handleDelete={handleDelete}
              handleFormBuilder={handleFormBuilder}
            />
          </div>
        </div>

        <Tab.Panels className="hidden">
          {[eventos, cursos].map((data, idx) => (
            <Tab.Panel key={idx}></Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
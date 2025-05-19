"use client";

import { cursosData, eventosData } from "@/app/Models/PanelControl/CursosEventos/CursoEventosData";
import { Tab } from "@headlessui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Import components
import CardPreview from "@/app/Components/CursosEventos/CardPreview";
import EventList from "@/app/Components/CursosEventos/EventList";
import FormBuilder from "@/app/Components/CursosEventos/FormInscripcion/FormBuilder";

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
  const [isCreating, setIsCreating] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  // Estado para manejar el formulario
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
    
    // Auto-select first item for preview without opening edit form
    if (currentData.length > 0 && !editingId && !isCreating) {
      // Just update formValues without setting editingId
      setFormValues({
        ...initialValues,
        ...currentData[0]
      });
    }
  }
}, [searchTerm, tabIndex, eventos, cursos, editingId, isCreating]);

  const handleAdd = () => {
    // Reset any current editing
    setEditingId(null);

    // Set creating mode
    setIsCreating(true);

    // Set default values
    setFormValues({
      ...initialValues,
      id: Date.now()
    });
  };

  const handleSave = () => {
    if (isCreating) {
      // Add new item
      if (tabIndex === 0) {
        setEventos((prev) => [formValues, ...prev]);
      } else {
        setCursos((prev) => [formValues, ...prev]);
      }
      setIsCreating(false);
    } else if (editingId) {
      // Update existing item
      if (tabIndex === 0) {
        setEventos((prev) => prev.map((e) => (e.id === editingId ? formValues : e)));
      } else {
        setCursos((prev) => prev.map((c) => (c.id === editingId ? formValues : c)));
      }
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormValues(initialValues);
  };

  const handleDelete = (id, type) => {
    if (type === "evento") {
      setEventos((prev) => prev.filter((e) => e.id !== id));
    } else {
      setCursos((prev) => prev.filter((c) => c.id !== id));
    }
    if (editingId === id) {
      setEditingId(null);
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

    // If already creating, finish that first
    if (isCreating) {
      setIsCreating(false);
    }

    setFormValues(safeItem);
    setEditingId(item.id);
  };

  // Funciones para el constructor de formularios
  const handleFormBuilder = (item) => {
    setCurrentFormItem(item);
    setShowFormBuilder(true);
  };

  const handleSaveForm = (updatedItem) => {
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
          Cursos y Eventos
        </motion.h1>
        <motion.p
          className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Gestión de contenidos de <span className="font-bold text-[#C40180]">Cursos y Eventos</span> del sitio web del Colegio Odontológico de Venezuela
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left side: List */}
        <div className="lg:col-span-8">
          <Tab.Group selectedIndex={tabIndex} onChange={(i) => {
            setTabIndex(i);
            handleCancel();
            setSearchTerm("");
          }}>
            {/* Tabs are now inside the EventList component */}
            <EventList
              filteredData={filteredData}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              tabIndex={tabIndex}
              editingId={editingId}
              handleSelect={handleSelect}
              handleDelete={handleDelete}
              handleFormBuilder={handleFormBuilder}
              handleAdd={handleAdd}
              formValues={formValues}
              setFormValues={setFormValues}
              handleSave={handleSave}
              handleCancel={handleCancel}
              isCreating={isCreating}
              TabList={Tab.List}
              Tab={Tab}
            />
          </Tab.Group>
        </div>

        {/* Right side: Preview only */}
        <div className="lg:col-span-4">
          <div className="bg-white p-5 rounded-xl shadow-md">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Vista Previa
              </h2>
            </div>
            <div className="mb-6">
              <CardPreview {...formValues} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
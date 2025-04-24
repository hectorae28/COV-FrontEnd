"use client";

import { FileCheck, SearchCheck, User } from 'lucide-react';
import { useState } from 'react';

// Función para obtener el componente de icono según el nombre
export const getIconComponent = (iconName) => {
    switch (iconName) {
        case "User": return User;
        case "SearchCheck": return SearchCheck;
        case "FileCheck": return FileCheck;
        default: return User;
    }
};

// Hook personalizado para gestionar los datos de servicios
export const useServiciosData = () => {
    // Datos iniciales de servicios
    const [services, setServices] = useState([
        {
            icon: "User",
            title: "Sistema Solicitudes",
            description: "Inscripción de Odontólogos (Nuevos Colegiados)"
        },
        {
            icon: "SearchCheck",
            title: "Sistema Buscador",
            description: "Buscar colegiados agremiado por CI y N°COV (Sólo Odontólogos)"
        },
        {
            icon: "FileCheck",
            title: "Verificar Documentos",
            description: "Verificación de documentos digitales del COV"
        }
    ]);

    const [editingIndex, setEditingIndex] = useState(null);
    const [headerData, setHeaderData] = useState({
        title: "Tu Carrera Profesional Comienza Aquí",
        subtitle: "Servicios Digitales",
        description: "Forma parte del Colegio de Odontólogos de Venezuela y accede a todos nuestros servicios digitales diseñados para impulsar tu desarrollo profesional."
    });
    const [editingHeader, setEditingHeader] = useState(false);

    const handleEditService = (index) => {
        setEditingIndex(index);
    };

    const handleSaveService = (index, updatedService) => {
        const newServices = [...services];
        newServices[index] = updatedService;
        setServices(newServices);
        setEditingIndex(null);
    };

    const handleDeleteService = (index) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
            const newServices = services.filter((_, i) => i !== index);
            setServices(newServices);
        }
    };

    const handleAddService = () => {
        setServices([
            ...services,
            {
                icon: "User",
                title: "Nuevo Servicio",
                description: "Descripción del nuevo servicio"
            }
        ]);
        setEditingIndex(services.length);
    };

    const handleSaveHeader = (e) => {
        e.preventDefault();
        setEditingHeader(false);
    };

    // Lista de opciones de iconos para el selector
    const iconOptions = [
        { value: "User", label: "Usuario" },
        { value: "SearchCheck", label: "Búsqueda" },
        { value: "FileCheck", label: "Documento" }
    ];

    return {
        services,
        setServices,
        editingIndex,
        setEditingIndex,
        headerData,
        setHeaderData,
        editingHeader,
        setEditingHeader,
        handleEditService,
        handleSaveService,
        handleDeleteService,
        handleAddService,
        handleSaveHeader,
        iconOptions
    };
};

export default useServiciosData;
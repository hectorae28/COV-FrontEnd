export const initialSections = [
    {
        id: 1,
        image: "/assets/presentacion/imagen1.jpg",
        title: "Bienvenidos a nuestra plataforma",
        description: "Ofrecemos servicios de alta calidad para nuestros usuarios"
    },
    {
        id: 2,
        image: "/assets/presentacion/imagen2.jpg",
        title: "Nuestra misión",
        description: "Brindar soluciones innovadoras y accesibles para todos"
    },
    {
        id: 3,
        image: "/assets/presentacion/imagen3.jpg",
        title: "Valores institucionales",
        description: "Compromiso, excelencia y atención personalizada"
    }
];

// Imágenes disponibles para el selector de imágenes
export const availableImages = [
    "/assets/presentacion/imagen1.jpg",
    "/assets/presentacion/imagen2.jpg",
    "/assets/presentacion/imagen3.jpg",
    "/assets/presentacion/placeholder.jpg"
];

// Función para obtener la siguiente imagen en rotación
export const getNextImage = (currentImage) => {
    const currentIndex = availableImages.indexOf(currentImage);
    const nextIndex = (currentIndex + 1) % availableImages.length;
    return availableImages[nextIndex];
};

// Crear una nueva sección con valores predeterminados
export const createNewSection = () => {
    return {
        id: Date.now(),
        image: "/assets/presentacion/placeholder.jpg",
        title: "Nuevo título",
        description: "Nueva descripción"
    };
};
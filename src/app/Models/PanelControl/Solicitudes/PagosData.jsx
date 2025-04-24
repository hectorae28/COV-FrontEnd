export const colegiados = [
    {
        id: "1",
        nombre: "María González",
        cedula: "V-12345678",
        numeroRegistro: "ODV-1234",
    },
    {
        id: "2",
        nombre: "Juan Pérez",
        cedula: "V-23456789",
        numeroRegistro: "ODV-2345",
    },
    {
        id: "3",
        nombre: "Carlos Ramírez",
        cedula: "V-34567890",
        numeroRegistro: "ODV-3456",
    },
];

export const tiposSolicitud = [
    { id: "constancia", nombre: "Constancia de inscripción", costo: 20, documentosRequeridos: ["Copia de cédula", "Comprobante de pago"] },
    { id: "certificado", nombre: "Certificado de solvencia", costo: 15, documentosRequeridos: ["Comprobante de pago"] },
    { id: "carnet", nombre: "Renovación de carnet", costo: 30, documentosRequeridos: ["Foto tipo carnet", "Comprobante de pago"] },
    { id: "especialidad", nombre: "Registro de especialidad", costo: 50, documentosRequeridos: ["Título de especialidad", "Copia de cédula", "Comprobante de pago"] },
    { id: "cambio", nombre: "Cambio de jurisdicción", costo: 40, documentosRequeridos: ["Constancia de residencia", "Comprobante de pago"] },
    { id: "duplicado", nombre: "Duplicado de título", costo: 25, documentosRequeridos: ["Denuncia de pérdida", "Comprobante de pago"] },
    { id: "actualizacion", nombre: "Actualización de datos", costo: 0, documentosRequeridos: ["Constancia de residencia"] },
    { id: "informacion", nombre: "Solicitud de información", costo: 0, documentosRequeridos: [] },
    { id: "otros", nombre: "Otro tipo de solicitud", costo: 0, documentosRequeridos: [] }
];

export const solicitudesIniciales = [
    {
        id: "1",
        tipo: "Constancia de inscripción",
        colegiadoId: "1",
        colegiadoNombre: "María González",
        fecha: "15/04/2025",
        estado: "Pendiente",
        urgente: true,
        descripcion: "Solicitud de constancia de inscripción al Colegio de Odontólogos",
        referencia: "CONST-2025-001",
        costo: 20,
        observaciones: "",
        documentosRequeridos: ["Copia de cédula", "Comprobante de pago"],
        documentosAdjuntos: ["cedula.pdf"]
    },
    {
        id: "2",
        tipo: "Registro de especialidad",
        colegiadoId: "2",
        colegiadoNombre: "Juan Pérez",
        fecha: "10/04/2025",
        estado: "Aprobada",
        urgente: false,
        descripcion: "Registro de especialidad en Endodoncia",
        referencia: "ESP-2025-005",
        costo: 50,
        fechaAprobacion: "12/04/2025",
        aprobadoPor: "Admin",
        observaciones: "Verificados todos los documentos",
        documentosRequeridos: ["Título de especialidad", "Copia de cédula", "Comprobante de pago"],
        documentosAdjuntos: ["titulo_especialidad.pdf", "cedula.pdf", "comprobante.pdf"]
    },
    {
        id: "3",
        tipo: "Cambio de jurisdicción",
        colegiadoId: "3",
        colegiadoNombre: "Carlos Ramírez",
        fecha: "05/04/2025",
        estado: "Rechazada",
        urgente: false,
        descripcion: "Cambio de jurisdicción de Caracas a Maracaibo",
        referencia: "CAMB-2025-010",
        costo: 40,
        fechaRechazo: "08/04/2025",
        rechazadoPor: "Admin",
        motivoRechazo: "Documentación incompleta. Falta constancia de residencia",
        documentosRequeridos: ["Constancia de residencia", "Comprobante de pago"],
        documentosAdjuntos: ["comprobante.pdf"]
    },
    {
        id: "4",
        tipo: "Certificado de solvencia",
        colegiadoId: "1",
        colegiadoNombre: "María González",
        fecha: "18/04/2025",
        estado: "Pendiente",
        urgente: false,
        descripcion: "Solicitud de certificado de solvencia",
        referencia: "SOLV-2025-008",
        costo: 15,
        observaciones: "",
        documentosRequeridos: ["Comprobante de pago"],
        documentosAdjuntos: ["comprobante.pdf"]
    },
    {
        id: "5",
        tipo: "Solicitud de información",
        colegiadoId: "2",
        colegiadoNombre: "Juan Pérez",
        fecha: "12/04/2025",
        estado: "Aprobada",
        urgente: false,
        descripcion: "Solicitud de información sobre cursos disponibles",
        referencia: "INFO-2025-015",
        costo: 0,
        fechaAprobacion: "14/04/2025",
        aprobadoPor: "Admin",
        observaciones: "Información enviada por correo electrónico",
        documentosRequeridos: [],
        documentosAdjuntos: []
    },
    {
        id: "6",
        tipo: "Actualización de datos",
        colegiadoId: "3",
        colegiadoNombre: "Carlos Ramírez",
        fecha: "09/04/2025",
        estado: "Aprobada",
        urgente: false,
        descripcion: "Actualización de dirección y teléfono",
        referencia: "ACT-2025-020",
        costo: 0,
        fechaAprobacion: "10/04/2025",
        aprobadoPor: "Admin",
        observaciones: "Datos actualizados correctamente",
        documentosRequeridos: ["Constancia de residencia"],
        documentosAdjuntos: ["residencia.pdf"]
    }
];

// Helper functions
export const generarReferencia = (tipoId) => {
    const prefijo = tipoId.toUpperCase().slice(0, 4);
    const identificador = Date.now().toString().slice(-4);
    return `${prefijo}-${new Date().getFullYear()}-${identificador}`;
};

export const getEstadoClasses = (estado) => {
    switch (estado) {
        case 'Pendiente':
            return 'bg-yellow-100 text-yellow-800';
        case 'Aprobada':
            return 'bg-green-100 text-green-800';
        case 'Rechazada':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
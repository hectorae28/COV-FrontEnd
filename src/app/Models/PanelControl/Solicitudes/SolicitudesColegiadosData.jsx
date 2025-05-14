// SolicitudesColegiado.jsx - Archivo central de datos para solicitudes del colegiado

// Datos del colegiado autenticado
export const colegiado = {
    id: "2",
    nombre: "Juan Pérez",
    cedula: "V-23456789",
    numeroRegistro: "ODV-2345",
};

// Datos de ejemplo de solicitudes para el colegiado
export const solicitudes = [
    {
        id: "1",
        tipo: "Constancia: Inscripción del COV",
        colegiadoId: "2",
        colegiadoNombre: "Juan Pérez",
        fecha: "15/04/2025",
        estado: "Pendiente",
        descripcion: "Solicitud de constancia de inscripción al Colegio de Odontólogos",
        referencia: "CONST-INSC-2025-001",
        costo: 60,
        observaciones: "",
        documentosRequeridos: ["Copia de cédula", "Comprobante de pago"],
        documentosAdjuntos: ["cedula.pdf"],
        itemsSolicitud: [
            {
                id: "CONST-INSC-20250415",
                tipo: "Constancia",
                subtipo: "Inscripción del COV",
                nombre: "Constancia: Inscripción del COV",
                costo: 60,
                exonerado: false,
                codigo: "CONST-INSC",
                documentosRequeridos: ["Copia de cédula", "Comprobante de pago"]
            }
        ]
    },
    {
        id: "2",
        tipo: "Especialización",
        colegiadoId: "2",
        colegiadoNombre: "Juan Pérez",
        fecha: "10/04/2025",
        estado: "Aprobada",
        descripcion: "Registro de especialidad en Endodoncia",
        referencia: "ESPEC-2025-005",
        costo: 150,
        fechaAprobacion: "12/04/2025",
        aprobadoPor: "Admin",
        observaciones: "Verificados todos los documentos",
        documentosRequeridos: ["Título de especialidad", "Copia de cédula", "Comprobante de pago"],
        documentosAdjuntos: ["titulo_especialidad.pdf", "cedula.pdf", "comprobante.pdf"],
        itemsSolicitud: [
            {
                id: "ESPEC-20250410",
                tipo: "Especialización",
                subtipo: null,
                nombre: "Especialización",
                costo: 150,
                exonerado: false,
                codigo: "ESPEC",
                documentosRequeridos: ["Título de especialidad", "Copia de cédula", "Comprobante de pago"]
            }
        ]
    },
    {
        id: "3",
        tipo: "Carnet",
        colegiadoId: "2",
        colegiadoNombre: "Juan Pérez",
        fecha: "05/04/2025",
        estado: "Rechazada",
        descripcion: "Solicitud de carnet de identificación profesional",
        referencia: "CARNET-2025-010",
        costo: 75,
        fechaRechazo: "08/04/2025",
        rechazadoPor: "Admin",
        motivoRechazo: "Documentación incompleta. Falta foto tipo carnet.",
        documentosRequeridos: ["Foto tipo carnet", "Comprobante de pago"],
        documentosAdjuntos: ["comprobante.pdf"],
        itemsSolicitud: [
            {
                id: "CARNET-20250405",
                tipo: "Carnet",
                subtipo: null,
                nombre: "Carnet",
                costo: 75,
                exonerado: false,
                codigo: "CARNET",
                documentosRequeridos: ["Foto tipo carnet", "Comprobante de pago"]
            }
        ]
    },
    {
        id: "4",
        tipo: "Solicitud múltiple (2 ítems)",
        colegiadoId: "2",
        colegiadoNombre: "Juan Pérez",
        fecha: "18/04/2025",
        estado: "Exonerada",
        descripcion: "Solicitud múltiple de servicios",
        referencia: "MULTI-2025-008",
        costo: 0,
        observaciones: "Solicitud exonerada de pago",
        documentosRequeridos: ["Constancia de residencia", "Copia de cédula"],
        documentosAdjuntos: ["residencia.pdf", "cedula.pdf"],
        estadoPago: "Exonerado",
        itemsSolicitud: [
            {
                id: "CONST-SOLV-20250418",
                tipo: "Constancia",
                subtipo: "Solvencia",
                nombre: "Constancia: Solvencia",
                costo: 45,
                exonerado: true,
                codigo: "CONST-SOLV",
                documentosRequeridos: ["Copia de cédula", "Comprobante de pago"]
            },
            {
                id: "SOLV-20250418",
                tipo: "Solvencia",
                subtipo: null,
                nombre: "Solvencia",
                costo: 50,
                exonerado: true,
                codigo: "SOLV",
                documentosRequeridos: ["Comprobante de pago"]
            }
        ]
    },
    {
        id: "5",
        tipo: "Solvencia",
        colegiadoId: "2",
        colegiadoNombre: "Juan Pérez",
        fecha: "20/04/2025",
        estado: "Pendiente",
        descripcion: "Certificado de solvencia profesional",
        referencia: "SOLV-2025-012",
        costo: 50,
        observaciones: "",
        documentosRequeridos: ["Comprobante de pago"],
        documentosAdjuntos: [],
        itemsSolicitud: [
            {
                id: "SOLV-20250420",
                tipo: "Solvencia",
                subtipo: null,
                nombre: "Solvencia",
                costo: 50,
                exonerado: false,
                codigo: "SOLV",
                documentosRequeridos: ["Comprobante de pago"]
            }
        ]
    }
];

// Definición de tipos de solicitud y sus costos
export const TIPOS_SOLICITUD = {
    Carnet: {
        id: "carnet",
        nombre: "Carnet",
        costo: 75.00,
        codigo: "CARNET",
        descripcion: "Solicitud de carnet de identificación profesional",
        documentosRequeridos: ["Foto tipo carnet", "Comprobante de pago"]
    },
    Especializacion: {
        id: "especializacion",
        nombre: "Especialización",
        costo: 150.00,
        codigo: "ESPEC",
        descripcion: "Registro de título de especialización odontológica",
        documentosRequeridos: ["Título de especialidad", "Copia de cédula", "Comprobante de pago"]
    },
    Solvencia: {
        id: "solvencia",
        nombre: "Solvencia",
        costo: 50.00,
        codigo: "SOLV",
        descripcion: "Certificado de solvencia profesional",
        documentosRequeridos: ["Comprobante de pago"]
    },
    Constancia: {
        id: "constancia",
        nombre: "Constancia",
        costo: 0, // El costo dependerá del subtipo
        codigo: "CONST",
        descripcion: "Constancia profesional (requiere seleccionar tipo específico)",
        documentosRequeridos: ["Copia de cédula", "Comprobante de pago"],
        subtipos: [
            { nombre: "Inscripción del COV", costo: 60.00, codigo: "CONST-INSC" },
            { nombre: "Solvencia", costo: 45.00, codigo: "CONST-SOLV" },
            { nombre: "Libre ejercicio", costo: 55.00, codigo: "CONST-LIBRE" },
            { nombre: "Declaración de habilitación", costo: 70.00, codigo: "CONST-HAB" },
            { nombre: "Continuidad laboral", costo: 65.00, codigo: "CONST-CONT" },
            { nombre: "Deontología odontológica", costo: 80.00, codigo: "CONST-DEONT" }
        ]
    }
};
// SolvenciasData.jsx - Datos de ejemplo para la sección de solvencias

// Datos de ejemplo de colegiados para el dropdown (reutilizados de SolicitudesData)
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

// Datos de ejemplo de solvencias
export const solvencias = [
    {
        id: "1",
        tipo: "Solvencia Profesional",
        colegiadoId: "1",
        colegiadoNombre: "María González",
        fecha: "15/04/2025",
        estado: "Revisión",
        descripcion: "Solvencia profesional para trámites legales",
        referencia: "SOLV-PROF-2025-001",
        costo: 50,
        exonerado: false,
        observaciones: "",
        documentosRequeridos: ["Cédula de identidad", "Comprobante de pago", "Certificado de inscripción"],
        documentosAdjuntos: {
            cedula_de_identidad: "cedula_maria.pdf",
            comprobante_de_pago: "comprobante_pago_maria.pdf"
        },
        tipoId: "profesional",
        creador: {
            nombre: "Administrador",
            email: "admin@cov.org",
            esAdmin: true,
            fecha: "2025-04-15T10:30:00Z"
        }
    },
    {
        id: "2",
        tipo: "Solvencia de Ejercicio",
        colegiadoId: "2",
        colegiadoNombre: "Juan Pérez",
        fecha: "10/04/2025",
        estado: "Aprobada",
        descripcion: "Solvencia para ejercicio profesional",
        referencia: "SOLV-EJER-2025-002",
        costo: 75,
        exonerado: false,
        fechaAprobacion: "12/04/2025",
        fechaVencimiento: "2026-04-12",
        aprobadoPor: "Admin",
        observaciones: "Aprobada con todos los documentos verificados",
        documentosRequeridos: [
            "Cédula de identidad",
            "Comprobante de pago",
            "Certificado de inscripción",
            "Constancia de trabajo vigente"
        ],
        documentosAdjuntos: {
            cedula_de_identidad: "cedula_juan.pdf",
            comprobante_de_pago: "comprobante_pago_juan.pdf",
            certificado_de_inscripcion: "certificado_juan.pdf",
            constancia_de_trabajo_vigente: "constancia_trabajo_juan.pdf"
        },
        certificadoUrl: "/solvencias/certificado-2.pdf",
        comprobantesPago: [
            {
                id: "pago_1",
                archivo: "comprobante_pago_juan.pdf",
                fecha: "11/04/2025",
                monto: "75.00",
                metodoPago: "Transferencia bancaria",
                referencia: "TRF123456"
            }
        ],
        tipoId: "ejercicio",
        creador: {
            nombre: "Administrador",
            email: "admin@cov.org",
            esAdmin: true,
            fecha: "2025-04-10T14:20:00Z"
        }
    },
    {
        id: "3",
        tipo: "Solvencia de Especialidad",
        colegiadoId: "3",
        colegiadoNombre: "Carlos Ramírez",
        fecha: "05/04/2025",
        estado: "Rechazada",
        descripcion: "Solvencia para especialidad en ortodoncia",
        referencia: "SOLV-ESP-2025-003",
        costo: 100,
        exonerado: false,
        fechaRechazo: "08/04/2025",
        rechazadoPor: "Admin",
        motivoRechazo: "Documentación incompleta. Falta título de especialista original.",
        documentosRequeridos: [
            "Cédula de identidad",
            "Comprobante de pago",
            "Certificado de especialidad",
            "Título de especialista",
            "Constancia de trabajo vigente"
        ],
        documentosAdjuntos: {
            cedula_de_identidad: "cedula_carlos.pdf",
            comprobante_de_pago: "comprobante_pago_carlos.pdf",
            certificado_de_especialidad: "certificado_carlos.pdf"
        },
        tipoId: "especialidad",
        creador: {
            nombre: "Asistente",
            email: "asistente@cov.org",
            esAdmin: false,
            fecha: "2025-04-05T09:15:00Z"
        }
    },
    {
        id: "4",
        tipo: "Solvencia Profesional",
        colegiadoId: "1",
        colegiadoNombre: "María González",
        fecha: "01/04/2025",
        estado: "Aprobada",
        descripcion: "Solvencia profesional para concurso público",
        referencia: "SOLV-PROF-2025-004",
        costo: 0,
        exonerado: true,
        fechaAprobacion: "02/04/2025",
        fechaVencimiento: "2026-04-02",
        aprobadoPor: "Admin",
        observaciones: "Exonerada por ser miembro de la directiva",
        documentosRequeridos: ["Cédula de identidad", "Comprobante de pago", "Certificado de inscripción"],
        documentosAdjuntos: {
            cedula_de_identidad: "cedula_maria_2.pdf",
            certificado_de_inscripcion: "certificado_maria.pdf"
        },
        certificadoUrl: "/solvencias/certificado-4.pdf",
        tipoId: "profesional",
        creador: {
            nombre: "Administrador",
            email: "admin@cov.org",
            esAdmin: true,
            fecha: "2025-04-01T11:45:00Z"
        }
    },
    {
        id: "5",
        tipo: "Solvencia de Ejercicio",
        colegiadoId: "2",
        colegiadoNombre: "Juan Pérez",
        fecha: "20/03/2025",
        estado: "Revisión",
        descripcion: "Solvencia para ejercicio en institución pública",
        referencia: "SOLV-EJER-2025-005",
        costo: 75,
        exonerado: false,
        observaciones: "",
        documentosRequeridos: [
            "Cédula de identidad",
            "Comprobante de pago",
            "Certificado de inscripción",
            "Constancia de trabajo vigente"
        ],
        documentosAdjuntos: {
            cedula_de_identidad: "cedula_juan_2.pdf",
            comprobante_de_pago: "comprobante_pago_juan_2.pdf",
            certificado_de_inscripcion: "certificado_juan_2.pdf"
        },
        tipoId: "ejercicio",
        creador: {
            nombre: "Asistente",
            email: "asistente@cov.org",
            esAdmin: false,
            fecha: "2025-03-20T16:30:00Z"
        }
    },
    {
        id: "6",
        tipo: "Solvencia Profesional",
        colegiadoId: "3",
        colegiadoNombre: "Carlos Ramírez",
        fecha: "15/03/2025",
        estado: "Aprobada",
        descripcion: "Solvencia profesional para trámites internacionales",
        referencia: "SOLV-PROF-2025-006",
        costo: 50,
        exonerado: false,
        fechaAprobacion: "17/03/2025",
        fechaVencimiento: "2026-03-17",
        aprobadoPor: "Admin",
        observaciones: "Aprobación expedita por urgencia declarada",
        documentosRequeridos: ["Cédula de identidad", "Comprobante de pago", "Certificado de inscripción"],
        documentosAdjuntos: {
            cedula_de_identidad: "cedula_carlos_2.pdf",
            comprobante_de_pago: "comprobante_pago_carlos_2.pdf",
            certificado_de_inscripcion: "certificado_carlos_2.pdf"
        },
        certificadoUrl: "/solvencias/certificado-6.pdf",
        comprobantesPago: [
            {
                id: "pago_2",
                archivo: "comprobante_pago_carlos_2.pdf",
                fecha: "16/03/2025",
                monto: "50.00",
                metodoPago: "Pago móvil",
                referencia: "PM789012"
            }
        ],
        tipoId: "profesional",
        creador: {
            nombre: "Administrador",
            email: "admin@cov.org",
            esAdmin: true,
            fecha: "2025-03-15T10:00:00Z"
        }
    },
    {
        id: "7",
        tipo: "Solvencia de Especialidad",
        colegiadoId: "1",
        colegiadoNombre: "María González",
        fecha: "10/03/2025",
        estado: "Aprobada",
        descripcion: "Solvencia para especialidad en endodoncia",
        referencia: "SOLV-ESP-2025-007",
        costo: 100,
        exonerado: false,
        fechaAprobacion: "14/03/2025",
        fechaVencimiento: "2026-03-14",
        aprobadoPor: "Admin",
        observaciones: "Todos los documentos verificados correctamente",
        documentosRequeridos: [
            "Cédula de identidad",
            "Comprobante de pago",
            "Certificado de especialidad",
            "Título de especialista",
            "Constancia de trabajo vigente"
        ],
        documentosAdjuntos: {
            cedula_de_identidad: "cedula_maria_3.pdf",
            comprobante_de_pago: "comprobante_pago_maria_2.pdf",
            certificado_de_especialidad: "certificado_especialidad_maria.pdf",
            titulo_de_especialista: "titulo_especialista_maria.pdf",
            constancia_de_trabajo_vigente: "constancia_trabajo_maria.pdf"
        },
        certificadoUrl: "/solvencias/certificado-7.pdf",
        comprobantesPago: [
            {
                id: "pago_3",
                archivo: "comprobante_pago_maria_2.pdf",
                fecha: "12/03/2025",
                monto: "100.00",
                metodoPago: "Transferencia bancaria",
                referencia: "TRF345678"
            }
        ],
        tipoId: "especialidad",
        creador: {
            nombre: "Administrador",
            email: "admin@cov.org",
            esAdmin: true,
            fecha: "2025-03-10T14:45:00Z"
        }
    }
];
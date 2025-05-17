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

export const solvencias = [
    {
        id: "1",
        tipo: "Solvencia Profesional",
        colegiadoId: "1",
        colegiadoNombre: "María González",
        fecha: "15/04/2025",
        estado: "Revisión",
        descripcion: "Solvencia profesional para trámites legales",
        costo: null, // Pendiente de asignación de costo
        exonerado: false,
        observaciones: "",
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
        costo: 75,
        exonerado: false,
        fechaAprobacion: "12/04/2025",
        fechaVencimiento: "2026-04-12",
        aprobadoPor: "Admin",
        observaciones: "Aprobada con todos los documentos verificados",
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
        costo: 100,
        exonerado: false,
        fechaRechazo: "08/04/2025",
        rechazadoPor: "Admin",
        motivoRechazo: "Información incorrecta o faltante",
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
        costo: 0,
        exonerado: true,
        fechaAprobacion: "02/04/2025",
        fechaVencimiento: "2026-04-02",
        aprobadoPor: "Admin",
        observaciones: "Exonerada por ser miembro de la directiva",
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
        costo: 75,
        exonerado: false,
        observaciones: "",
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
        costo: 50,
        exonerado: false,
        fechaAprobacion: "17/03/2025",
        fechaVencimiento: "2026-03-17",
        aprobadoPor: "Admin",
        observaciones: "Aprobación expedita por urgencia declarada",
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
        costo: 100,
        exonerado: false,
        fechaAprobacion: "14/03/2025",
        fechaVencimiento: "2026-03-14",
        aprobadoPor: "Admin",
        observaciones: "Todos los documentos verificados correctamente",
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
    },
    {
        id: "8",
        tipo: "Solvencia Profesional",
        colegiadoId: "2",
        colegiadoNombre: "Juan Pérez",
        fecha: "12/04/2025",
        estado: "Revisión",
        descripcion: "Solvencia profesional para registro en clínica",
        costo: null, // Pendiente de asignación de costo
        exonerado: false,
        observaciones: "",
        tipoId: "profesional",
        creador: {
            nombre: "Administrador",
            email: "admin@cov.org",
            esAdmin: true,
            fecha: "2025-04-12T09:15:00Z"
        }
    },
    {
        id: "9",
        tipo: "Solvencia de Especialidad",
        colegiadoId: "3",
        colegiadoNombre: "Carlos Ramírez",
        fecha: "11/04/2025",
        estado: "Revisión",
        descripcion: "Solvencia para especialidad en cirugía maxilofacial",
        costo: null, // Pendiente de asignación de costo
        exonerado: false,
        observaciones: "",
        tipoId: "especialidad",
        creador: {
            nombre: "Asistente",
            email: "asistente@cov.org",
            esAdmin: false,
            fecha: "2025-04-11T15:45:00Z"
        }
    }
];
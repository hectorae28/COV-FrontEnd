// ListaColegiadosData.js
import { create } from 'zustand'

// Custom store using Zustand for state management
const ListaColegiadosData = create((set, get) => ({
    // Main data collections
    colegiados: [
        {
            id: "1",
            nombre: "María González",
            cedula: "V-12345678",
            numeroRegistro: "ODV-1234",
            email: "maria.gonzalez@mail.com",
            telefono: "+58 412-1234567",
            fechaRegistro: "12/04/2023",
            estado: "Activo",
            solvente: true,
            especialidad: "Ortodoncia",

            // Detailed data for the colegiado
            persona: {
                nombre: "María",
                segundo_nombre: "Alejandra",
                primer_apellido: "González",
                segundo_apellido: "Rodríguez",
                genero: "F",
                tipo_identificacion: "V",
                identificacion: "12345678",
                correo: "maria.gonzalez@mail.com",
                id_adicional: "RIF-12345678-9",
                telefono_movil: "+58 412-1234567",
                telefono_de_habitacion: "+58 212-5555555",
                fecha_de_nacimiento: "1985-03-15",
                estado_civil: "Casada",
                direccion: {
                    referencia: "Av. Libertador, Edificio Centro, Apto 5-B",
                    estado: "Caracas"
                },
                user: null
            },
            instituto_bachillerato: "Liceo Andrés Bello",
            universidad: "Universidad Central de Venezuela",
            fecha_egreso_universidad: "2010-07-15",
            num_registro_principal: "12345",
            fecha_registro_principal: "2010-08-20",
            num_mpps: "MP-789",
            fecha_mpps: "2010-09-10",
            instituciones: [
                {
                    nombre: "Hospital Universitario de Caracas",
                    cargo: "Odontólogo",
                    direccion: "Av. Los Ilustres, Ciudad Universitaria",
                    telefono: "+58 212-6060606",
                },
                {
                    nombre: "Clínica Dental Sonrisas",
                    cargo: "Ortodoncista",
                    direccion: "Av. Francisco de Miranda, Centro Plaza, Torre A",
                    telefono: "+58 212-9090909",
                }
            ],
            file_ci: "cedula_maria_gonzalez.jpg",
            file_rif: "rif_maria_gonzalez.pdf",
            file_fondo_negro: "titulo_fondo_negro_maria_gonzalez.pdf",
            file_mpps: "registro_mpps_maria_gonzalez.pdf",
            carnetVigente: true,
            carnetVencimiento: "12/04/2025",
            tituloEntregado: false,
            estadisticas: {
                solicitudesMes: 2,
                inscripcionesMes: 1,
                asistenciaEventos: 5,
                pagosPendientes: 0,
                ultimoAcceso: "Hace 3 días"
            },
            pagos: [
                {
                    id: "1-1",
                    concepto: "Cuota anual 2024",
                    referencia: "REF-AN-2024",
                    fecha: "15/01/2024",
                    monto: 120.00,
                    estado: "Pagado",
                    metodoPago: "Tarjeta de crédito",
                    comprobante: true
                },
                {
                    id: "1-2",
                    concepto: "Inscripción curso de ortodoncia",
                    referencia: "REF-CURSO-052",
                    fecha: "05/02/2024",
                    monto: 85.00,
                    estado: "Pagado",
                    metodoPago: "Transferencia bancaria",
                    comprobante: true
                }
            ],
            inscripciones: [
                {
                    id: "1-1",
                    nombre: "Congreso Nacional de Odontología 2024",
                    tipo: "Congreso",
                    fecha: "05/03/2024 - 07/03/2024",
                    lugar: "Hotel Eurobuilding, Caracas",
                    estado: "Completado",
                    certificado: true,
                    ponentes: "Varios especialistas nacionales e internacionales",
                    creditos: 30
                },
                {
                    id: "1-2",
                    nombre: "Taller de actualización en materiales dentales",
                    tipo: "Taller",
                    fecha: "20/03/2024",
                    lugar: "Sede COV, Caracas",
                    estado: "Completado",
                    certificado: true,
                    ponentes: "Dra. María González",
                    creditos: 8
                }
            ],
            solicitudes: [
                {
                    id: "1-1",
                    tipo: "Constancia de inscripción",
                    fecha: "10/02/2024",
                    estado: "Completada",
                    descripcion: "Constancia de inscripción al COV",
                    urgente: false,
                    monto: 20.00
                },
                {
                    id: "1-2",
                    tipo: "Carnet nuevo o renovación",
                    fecha: "15/03/2024",
                    estado: "En proceso",
                    descripcion: "Renovación de carnet COV",
                    urgente: true,
                    monto: 30.00
                }
            ],
            documentos: [
                {
                    id: "file_ci",
                    nombre: "Cédula de identidad",
                    descripcion: "Copia escaneada por ambos lados",
                    archivo: "cedula_maria_gonzalez.jpg",
                    requerido: true,
                },
                {
                    id: "file_rif",
                    nombre: "RIF",
                    descripcion: "Registro de Información Fiscal",
                    archivo: "rif_maria_gonzalez.pdf",
                    requerido: true,
                },
                {
                    id: "file_fondo_negro",
                    nombre: "Título universitario fondo negro",
                    descripcion: "Título de Odontólogo con fondo negro",
                    archivo: "titulo_fondo_negro_maria_gonzalez.pdf",
                    requerido: true,
                },
                {
                    id: "file_mpps",
                    nombre: "Registro MPPS",
                    descripcion: "Registro del Ministerio del Poder Popular para la Salud",
                    archivo: "registro_mpps_maria_gonzalez.pdf",
                    requerido: true,
                },
                {
                    id: "comprobante_pago",
                    nombre: "Comprobante de pago",
                    descripcion: "Comprobante de pago de inscripción",
                    archivo: "pago_maria_gonzalez.pdf",
                    requerido: true,
                }
            ],
        },
        {
            id: "2",
            nombre: "Juan Pérez",
            cedula: "V-23456789",
            numeroRegistro: "ODV-2345",
            email: "juan.perez@mail.com",
            telefono: "+58 414-7654321",
            fechaRegistro: "15/05/2023",
            estado: "Activo",
            solvente: false,
            especialidad: "Endodoncia",

            // Detailed data for the colegiado
            persona: {
                nombre: "Juan",
                segundo_nombre: "Antonio",
                primer_apellido: "Pérez",
                segundo_apellido: "Martínez",
                genero: "M",
                tipo_identificacion: "V",
                identificacion: "23456789",
                correo: "juan.perez@mail.com",
                id_adicional: "RIF-23456789-0",
                telefono_movil: "+58 414-7654321",
                telefono_de_habitacion: "+58 212-4444444",
                fecha_de_nacimiento: "1982-07-22",
                estado_civil: "Soltero",
                direccion: {
                    referencia: "Calle Principal, Residencias El Mirador, Apto 12-A",
                    estado: "Miranda"
                },
                user: null
            },
            instituto_bachillerato: "Colegio San Ignacio",
            universidad: "Universidad Santa María",
            fecha_egreso_universidad: "2008-06-20",
            num_registro_principal: "23456",
            fecha_registro_principal: "2008-07-30",
            num_mpps: "MP-890",
            fecha_mpps: "2008-08-15",
            instituciones: [
                {
                    nombre: "Clínica Santa Paula",
                    cargo: "Endodoncista",
                    direccion: "Av. Principal de Santa Paula, Torre Médica, Consultorio 202",
                    telefono: "+58 212-9876543",
                }
            ],
            file_ci: "cedula_juan_perez.jpg",
            file_rif: "rif_juan_perez.pdf",
            file_fondo_negro: "titulo_fondo_negro_juan_perez.pdf",
            file_mpps: "registro_mpps_juan_perez.pdf",
            carnetVigente: false,
            carnetVencimiento: "10/05/2023",
            tituloEntregado: true,
            estadisticas: {
                solicitudesMes: 1,
                inscripcionesMes: 0,
                asistenciaEventos: 2,
                pagosPendientes: 1,
                ultimoAcceso: "Hace 10 días"
            },
            pagos: [
                {
                    id: "2-1",
                    concepto: "Cuota anual 2023",
                    referencia: "REF-AN-2023",
                    fecha: "10/05/2023",
                    monto: 100.00,
                    estado: "Pagado",
                    metodoPago: "Zelle",
                    comprobante: true
                },
                {
                    id: "2-2",
                    concepto: "Cuota anual 2024",
                    referencia: "REF-AN-2024",
                    fecha: "01/04/2024",
                    monto: 120.00,
                    estado: "Pendiente",
                    metodoPago: "-",
                    comprobante: false
                }
            ],
            inscripciones: [
                {
                    id: "2-1",
                    nombre: "Curso avanzado de endodoncia",
                    tipo: "Curso",
                    fecha: "10/11/2023 - 12/11/2023",
                    lugar: "Centro Especializado de Odontología, Caracas",
                    estado: "Completado",
                    certificado: true,
                    ponentes: "Dr. Luis Mendoza, Dra. Carmen Jiménez",
                    creditos: 15
                }
            ],
            solicitudes: [
                {
                    id: "2-1",
                    tipo: "Renovación de carnet",
                    fecha: "01/04/2024",
                    estado: "Pendiente",
                    descripcion: "Renovación de carnet vencido",
                    urgente: false,
                    monto: 30.00
                }
            ],
            documentos: [
                {
                    id: "file_ci",
                    nombre: "Cédula de identidad",
                    descripcion: "Copia escaneada por ambos lados",
                    archivo: "cedula_juan_perez.jpg",
                    requerido: true,
                },
                {
                    id: "file_rif",
                    nombre: "RIF",
                    descripcion: "Registro de Información Fiscal",
                    archivo: "rif_juan_perez.pdf",
                    requerido: true,
                },
                {
                    id: "file_fondo_negro",
                    nombre: "Título universitario fondo negro",
                    descripcion: "Título de Odontólogo con fondo negro",
                    archivo: "titulo_fondo_negro_juan_perez.pdf",
                    requerido: true,
                },
                {
                    id: "file_mpps",
                    nombre: "Registro MPPS",
                    descripcion: "Registro del Ministerio del Poder Popular para la Salud",
                    archivo: "registro_mpps_juan_perez.pdf",
                    requerido: true,
                }
            ],
        }
    ],

    colegiadosPendientes: [
        {
            id: "p1",
            nombre: "Carlos Ramírez",
            cedula: "V-34567890",
            email: "carlos.ramirez@mail.com",
            telefono: "+58 416-7777777",
            fechaSolicitud: "10/04/2024",
            documentosCompletos: true,

            // Detailed data
            persona: {
                nombre: "Carlos",
                segundo_nombre: "José",
                primer_apellido: "Ramírez",
                segundo_apellido: "Pérez",
                genero: "M",
                tipo_identificacion: "V",
                identificacion: "34567890",
                correo: "carlos.ramirez@mail.com",
                id_adicional: "",
                telefono_movil: "+58 416-7777777",
                telefono_de_habitacion: "+58 212-5555555",
                fecha_de_nacimiento: "1988-05-12",
                estado_civil: "Soltero",
                direccion: {
                    referencia: "Av. Francisco de Miranda, Edificio Torre Europa, Piso 8",
                    estado: "Caracas"
                },
                user: null
            },
            instituto_bachillerato: "Liceo Andrés Bello",
            universidad: "Universidad Central de Venezuela",
            fecha_egreso_universidad: "2015-07-15",
            num_registro_principal: "12345",
            fecha_registro_principal: "2015-08-20",
            num_mpps: "MP-789",
            fecha_mpps: "2015-09-10",
            instituciones: [
                {
                    nombre: "Hospital Universitario de Caracas",
                    cargo: "Odontólogo",
                    direccion: "Av. Los Ilustres, Ciudad Universitaria",
                    telefono: "+58 212-6060606",
                }
            ],
            file_ci: "cedula_carlos_ramirez.jpg",
            file_rif: "rif_carlos_ramirez.pdf",
            file_fondo_negro: "titulo_fondo_negro_carlos_ramirez.pdf",
            file_mpps: "registro_mpps_carlos_ramirez.pdf",
            observaciones: "Solicita inscripción en el Colegio de Odontólogos de Venezuela",
            documentos: [
                {
                    id: "file_ci",
                    nombre: "Cédula de identidad",
                    descripcion: "Copia escaneada por ambos lados",
                    archivo: "cedula_carlos_ramirez.jpg",
                    requerido: true,
                },
                {
                    id: "file_rif",
                    nombre: "RIF",
                    descripcion: "Registro de Información Fiscal",
                    archivo: "rif_carlos_ramirez.pdf",
                    requerido: true,
                },
                {
                    id: "file_fondo_negro",
                    nombre: "Título universitario fondo negro",
                    descripcion: "Título de Odontólogo con fondo negro",
                    archivo: "titulo_fondo_negro_carlos_ramirez.pdf",
                    requerido: true,
                },
                {
                    id: "file_mpps",
                    nombre: "Registro MPPS",
                    descripcion: "Registro del Ministerio del Poder Popular para la Salud",
                    archivo: "registro_mpps_carlos_ramirez.pdf",
                    requerido: true,
                },
                {
                    id: "comprobante_pago",
                    nombre: "Comprobante de pago",
                    descripcion: "Comprobante de pago de inscripción",
                    archivo: "pago_carlos_ramirez.pdf",
                    requerido: true,
                }
            ]
        },
        {
            id: "p2",
            nombre: "Ana López",
            cedula: "V-45678901",
            email: "ana.lopez@mail.com",
            telefono: "+58 424-8888888",
            fechaSolicitud: "11/04/2024",
            documentosCompletos: false,

            // Detailed data
            persona: {
                nombre: "Ana",
                segundo_nombre: "María",
                primer_apellido: "López",
                segundo_apellido: "García",
                genero: "F",
                tipo_identificacion: "V",
                identificacion: "45678901",
                correo: "ana.lopez@mail.com",
                id_adicional: "",
                telefono_movil: "+58 424-8888888",
                telefono_de_habitacion: "+58 212-7777777",
                fecha_de_nacimiento: "1990-09-18",
                estado_civil: "Casada",
                direccion: {
                    referencia: "Urb. El Paraíso, Calle Principal, Casa 15",
                    estado: "Caracas"
                },
                user: null
            },
            instituto_bachillerato: "Colegio La Salle",
            universidad: "Universidad Santa María",
            fecha_egreso_universidad: "2016-06-30",
            num_registro_principal: "54321",
            fecha_registro_principal: "2016-07-15",
            num_mpps: "MP-456",
            fecha_mpps: "2016-08-01",
            instituciones: [
                {
                    nombre: "Clínica Dental Moderna",
                    cargo: "Odontólogo General",
                    direccion: "C.C. Sambil, Nivel Feria, Local F-12",
                    telefono: "+58 212-5551234",
                }
            ],
            file_ci: "cedula_ana_lopez.jpg",
            file_rif: "rif_ana_lopez.pdf",
            file_fondo_negro: "titulo_fondo_negro_ana_lopez.pdf",
            observaciones: "Solicita inscripción en el Colegio de Odontólogos de Venezuela",
            documentos: [
                {
                    id: "file_ci",
                    nombre: "Cédula de identidad",
                    descripcion: "Copia escaneada por ambos lados",
                    archivo: "cedula_ana_lopez.jpg",
                    requerido: true,
                },
                {
                    id: "file_rif",
                    nombre: "RIF",
                    descripcion: "Registro de Información Fiscal",
                    archivo: "rif_ana_lopez.pdf",
                    requerido: true,
                },
                {
                    id: "file_fondo_negro",
                    nombre: "Título universitario fondo negro",
                    descripcion: "Título de Odontólogo con fondo negro",
                    archivo: "titulo_fondo_negro_ana_lopez.pdf",
                    requerido: true,
                },
                {
                    id: "file_mpps",
                    nombre: "Registro MPPS",
                    descripcion: "Registro del Ministerio del Poder Popular para la Salud",
                    archivo: "",
                    requerido: true,
                },
                {
                    id: "comprobante_pago",
                    nombre: "Comprobante de pago",
                    descripcion: "Comprobante de pago de inscripción",
                    archivo: "",
                    requerido: true,
                }
            ]
        }
    ],

    // Fetch functions
    getColegiado: (id) => {
        const colegiado = get().colegiados.find(col => col.id === id);
        return colegiado || null;
    },

    getColegiadoPendiente: (id) => {
        const pendiente = get().colegiadosPendientes.find(pend => pend.id === id);
        return pendiente || null;
    },

    // Get specialized arrays for each tab
    getPagos: (colegiadoId) => {
        const colegiado = get().getColegiado(colegiadoId);
        return colegiado ? colegiado.pagos : [];
    },

    getInscripciones: (colegiadoId) => {
        const colegiado = get().getColegiado(colegiadoId);
        return colegiado ? colegiado.inscripciones : [];
    },

    getSolicitudes: (colegiadoId) => {
        const colegiado = get().getColegiado(colegiadoId);
        return colegiado ? colegiado.solicitudes : [];
    },

    getDocumentos: (colegiadoId) => {
        const colegiado = get().getColegiado(colegiadoId);
        return colegiado ? colegiado.documentos : [];
    },

    getDocumentosPendiente: (pendienteId) => {
        const pendiente = get().getColegiadoPendiente(pendienteId);
        return pendiente ? pendiente.documentos : [];
    },

    // Modify functions
    addColegiado: (nuevoColegiado) => {
        set(state => ({
            colegiados: [...state.colegiados, {
                ...nuevoColegiado,
                pagos: [],
                inscripciones: [],
                solicitudes: [],
                documentos: nuevoColegiado.documentos || []
            }]
        }));
    },

    addColegiadoPendiente: (nuevoPendiente) => {
        set(state => ({
            colegiadosPendientes: [...state.colegiadosPendientes, nuevoPendiente]
        }));
    },

    removeColegiadoPendiente: (id) => {
        set(state => ({
            colegiadosPendientes: state.colegiadosPendientes.filter(
                pendiente => pendiente.id !== id
            )
        }));
    },

    // Update functions
    updateColegiado: (id, updatedData) => {
        set(state => ({
            colegiados: state.colegiados.map(colegiado =>
                colegiado.id === id ? { ...colegiado, ...updatedData } : colegiado
            )
        }));
    },

    updateColegiadoPendiente: (id, updatedData) => {
        set(state => ({
            colegiadosPendientes: state.colegiadosPendientes.map(pendiente =>
                pendiente.id === id ? { ...pendiente, ...updatedData } : pendiente
            )
        }));
    },

    // Add specific data to a colegiado
    addPago: (colegiadoId, nuevoPago) => {
        set(state => ({
            colegiados: state.colegiados.map(colegiado => {
                if (colegiado.id === colegiadoId) {
                    return {
                        ...colegiado,
                        pagos: [...colegiado.pagos, {
                            id: `${colegiadoId}-${colegiado.pagos.length + 1}`,
                            ...nuevoPago
                        }]
                    };
                }
                return colegiado;
            })
        }));
    },

    addInscripcion: (colegiadoId, nuevaInscripcion) => {
        set(state => ({
            colegiados: state.colegiados.map(colegiado => {
                if (colegiado.id === colegiadoId) {
                    return {
                        ...colegiado,
                        inscripciones: [...colegiado.inscripciones, {
                            id: `${colegiadoId}-${colegiado.inscripciones.length + 1}`,
                            ...nuevaInscripcion
                        }]
                    };
                }
                return colegiado;
            })
        }));
    },

    addSolicitud: (colegiadoId, nuevaSolicitud) => {
        set(state => ({
            colegiados: state.colegiados.map(colegiado => {
                if (colegiado.id === colegiadoId) {
                    return {
                        ...colegiado,
                        solicitudes: [...colegiado.solicitudes, {
                            id: `${colegiadoId}-${colegiado.solicitudes.length + 1}`,
                            ...nuevaSolicitud
                        }]
                    };
                }
                return colegiado;
            })
        }));
    },

    // Handle registration approval
    approveRegistration: (pendienteId, datosRegistro) => {
        const pendiente = get().getColegiadoPendiente(pendienteId);

        if (!pendiente) return false;

        // Create a new colegiado from pendiente data
        const nombreCompleto = `${pendiente.persona.nombre} ${pendiente.persona.segundo_nombre || ''} ${pendiente.persona.primer_apellido} ${pendiente.persona.segundo_apellido || ''}`.trim();

        const nuevoColegiado = {
            id: `cov-${Date.now()}`,
            nombre: nombreCompleto,
            cedula: `${pendiente.persona.tipo_identificacion}-${pendiente.persona.identificacion}`,
            numeroRegistro: datosRegistro.num_cov || `ODV-${Math.floor(1000 + Math.random() * 9000)}`,
            email: pendiente.persona.correo,
            telefono: pendiente.persona.telefono_movil,
            fechaRegistro: new Date().toLocaleDateString(),
            estado: "Activo",
            solvente: true,
            especialidad: datosRegistro.tipo_profesion || "Odontología general",

            // Transfer detailed data
            persona: pendiente.persona,
            instituto_bachillerato: pendiente.instituto_bachillerato,
            universidad: pendiente.universidad,
            fecha_egreso_universidad: pendiente.fecha_egreso_universidad,
            num_registro_principal: pendiente.num_registro_principal,
            fecha_registro_principal: pendiente.fecha_registro_principal,
            num_mpps: pendiente.num_mpps,
            fecha_mpps: pendiente.fecha_mpps,
            instituciones: pendiente.instituciones,

            // Files
            file_ci: pendiente.file_ci,
            file_rif: pendiente.file_rif,
            file_fondo_negro: pendiente.file_fondo_negro,
            file_mpps: pendiente.file_mpps,

            // Default values
            carnetVigente: true,
            carnetVencimiento: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString(),
            tituloEntregado: false,

            // Empty arrays for collections
            pagos: [],
            inscripciones: [],
            solicitudes: [],
            documentos: pendiente.documentos || [],

            // Initial statistics
            estadisticas: {
                solicitudesMes: 0,
                inscripcionesMes: 0,
                asistenciaEventos: 0,
                pagosPendientes: 0,
                ultimoAcceso: "Hoy"
            }
        };

        // Add the new colegiado
        get().addColegiado(nuevoColegiado);

        // Remove the pending registration
        get().removeColegiadoPendiente(pendienteId);

        return nuevoColegiado;
    },

    // Mark title as delivered
    marcarTituloEntregado: (colegiadoId, entregado = true) => {
        set(state => ({
            colegiados: state.colegiados.map(colegiado => {
                if (colegiado.id === colegiadoId) {
                    return {
                        ...colegiado,
                        tituloEntregado: entregado
                    };
                }
                return colegiado;
            })
        }));
    }
}));

export default ListaColegiadosData;
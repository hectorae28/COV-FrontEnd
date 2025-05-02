import { create } from 'zustand';

const useDataListaColegiados = create((set, get) => ({

    session: null, // Almacenar la sesión del usuario

    // Función para inicializar la sesión
    initSession: (sessionData) => {
        set({ session: sessionData });
    },

    colegiados: [
        {
            id: "1",
            nombre: "María González",
            cedula: "V-12345678",
            numeroRegistro: "ODV-1234",
            email: "maria.gonzalez@mail.com",
            telefono: "+58 412-1234567",
            fechaRegistro: "12/04/2025",
            estado: "Activo",
            solvente: true,
            especialidad: "Ortodoncia",
            pagosPendientes: false,

            // Datos detallados del colegiado
            persona: {
                nombre: "María",
                segundo_nombre: "Alejandra",
                primer_apellido: "González",
                segundo_apellido: "Rodríguez",
                genero: "F",
                nacionalidad: "V",
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
            carnetVencimiento: "12/01/2025",
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
            fechaRegistro: "01/05/2025",
            estado: "Activo",
            solvente: false,
            especialidad: "Endodoncia",
            pagosPendientes: false,

            // Detailed data for the colegiado
            persona: {
                nombre: "Juan",
                segundo_nombre: "Antonio",
                primer_apellido: "Pérez",
                segundo_apellido: "Martínez",
                genero: "M",
                nacionalidad: "V",
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
        },
        // Nuevos usuarios agregados con distintos filtros y solicitudes
        {
            id: "3",
            nombre: "Laura Mendoza",
            cedula: "V-34567890",
            numeroRegistro: "ODV-3456",
            email: "laura.mendoza@mail.com",
            telefono: "+58 416-9876543",
            fechaRegistro: "02/06/2025",
            estado: "Activo",
            solvente: true,
            especialidad: "Odontopediatría",
            pagosPendientes: false,

            persona: {
                nombre: "Laura",
                segundo_nombre: "Cristina",
                primer_apellido: "Mendoza",
                segundo_apellido: "Blanco",
                genero: "F",
                nacionalidad: "V",
                identificacion: "34567890",
                correo: "laura.mendoza@mail.com",
                id_adicional: "RIF-34567890-1",
                telefono_movil: "+58 416-9876543",
                telefono_de_habitacion: "+58 212-3333333",
                fecha_de_nacimiento: "1990-05-15",
                estado_civil: "Soltera",
                direccion: {
                    referencia: "Urb. El Cafetal, Calle Los Arrayanes, Residencia Amapola, Apto 4-C",
                    estado: "Caracas"
                },
                user: null
            },
            universidad: "Universidad de Los Andes",
            fecha_egreso_universidad: "2015-07-10",
            num_registro_principal: "45678",
            fecha_registro_principal: "2015-08-15",
            especialidad: "Odontopediatría",
            carnetVigente: true,
            carnetVencimiento: "15/06/2025",
            tituloEntregado: true,
            estadisticas: {
                solicitudesMes: 3,
                inscripcionesMes: 1,
                asistenciaEventos: 4,
                pagosPendientes: 0,
                ultimoAcceso: "Hace 2 días"
            },
            pagos: [
                {
                    id: "3-1",
                    concepto: "Cuota anual 2024",
                    referencia: "REF-AN-2024-L",
                    fecha: "10/01/2024",
                    monto: 120.00,
                    estado: "Pagado",
                    metodoPago: "Transferencia bancaria",
                    comprobante: true
                },
                {
                    id: "3-2",
                    concepto: "Inscripción curso pediátrico",
                    referencia: "REF-CURSO-P123",
                    fecha: "05/03/2024",
                    monto: 90.00,
                    estado: "Pagado",
                    metodoPago: "Tarjeta de crédito",
                    comprobante: true
                }
            ],
            solicitudes: [
                {
                    id: "3-1",
                    tipo: "Constancia de solvencia",
                    fecha: "15/02/2024",
                    estado: "Completada",
                    descripcion: "Constancia de solvencia para trámites externos",
                    urgente: false,
                    monto: 25.00
                },
                {
                    id: "3-2",
                    tipo: "Certificado profesional",
                    fecha: "27/03/2024",
                    estado: "En proceso",
                    descripcion: "Certificado para ejercicio profesional",
                    urgente: true,
                    monto: 40.00
                },
                {
                    id: "3-3",
                    tipo: "Inscripción congreso anual",
                    fecha: "10/04/2024",
                    estado: "Pendiente",
                    descripcion: "Inscripción al congreso anual 2024",
                    urgente: false,
                    monto: 150.00
                }
            ],
            documentos: [
                // Documentos similares a los anteriores
            ],
        },
        {
            id: "4",
            nombre: "Roberto Castillo",
            cedula: "V-45678901",
            numeroRegistro: "ODV-4567",
            email: "roberto.castillo@mail.com",
            telefono: "+58 424-1234567",
            fechaRegistro: "10/07/2025",
            estado: "Activo",
            solvente: false,
            especialidad: "Cirugía maxilofacial",
            pagosPendientes: false,

            persona: {
                nombre: "Roberto",
                segundo_nombre: "José",
                primer_apellido: "Castillo",
                segundo_apellido: "Rodríguez",
                genero: "M",
                nacionalidad: "V",
                identificacion: "45678901",
                correo: "roberto.castillo@mail.com",
                id_adicional: "RIF-45678901-2",
                telefono_movil: "+58 424-1234567",
                telefono_de_habitacion: "+58 212-2222222",
                fecha_de_nacimiento: "1975-08-20",
                estado_civil: "Casado",
                direccion: {
                    referencia: "Av. Casanova, Residencias Palmira, Piso 8, Apto 8-C",
                    estado: "Caracas"
                },
                user: null
            },
            universidad: "Universidad Central de Venezuela",
            fecha_egreso_universidad: "2000-07-15",
            especialidad: "Cirugía maxilofacial",
            carnetVigente: false,
            carnetVencimiento: "05/06/2023",
            tituloEntregado: true,
            estadisticas: {
                solicitudesMes: 0,
                inscripcionesMes: 0,
                asistenciaEventos: 1,
                pagosPendientes: 2,
                ultimoAcceso: "Hace 15 días"
            },
            pagos: [
                {
                    id: "4-1",
                    concepto: "Cuota anual 2023",
                    referencia: "REF-AN-2023-R",
                    fecha: "15/06/2023",
                    monto: 100.00,
                    estado: "Pagado",
                    metodoPago: "Transferencia bancaria",
                    comprobante: true
                },
                {
                    id: "4-2",
                    concepto: "Cuota anual 2024",
                    referencia: "REF-AN-2024-R",
                    fecha: "Pendiente",
                    monto: 120.00,
                    estado: "Pendiente",
                    metodoPago: "-",
                    comprobante: false
                },
                {
                    id: "4-3",
                    concepto: "Multa por atraso",
                    referencia: "MULTA-2024-R",
                    fecha: "15/03/2024",
                    monto: 30.00,
                    estado: "Pendiente",
                    metodoPago: "-",
                    comprobante: false
                }
            ],
            solicitudes: [
                // No tiene solicitudes activas
            ],
            documentos: [
                // Documentos similares a los anteriores
            ],
        },
        {
            id: "5",
            nombre: "Carmen Delgado",
            cedula: "V-56789012",
            numeroRegistro: "ODV-5678",
            email: "carmen.delgado@mail.com",
            telefono: "+58 426-7654321",
            fechaRegistro: "05/08/2025",
            estado: "Activo",
            solvente: true,
            especialidad: "Periodoncia",
            pagosPendientes: false,

            persona: {
                nombre: "Carmen",
                segundo_nombre: "Elena",
                primer_apellido: "Delgado",
                segundo_apellido: "Fuentes",
                genero: "F",
                nacionalidad: "V",
                identificacion: "56789012",
                correo: "carmen.delgado@mail.com",
                id_adicional: "RIF-56789012-3",
                telefono_movil: "+58 426-7654321",
                telefono_de_habitacion: "+58 212-1111111",
                fecha_de_nacimiento: "1988-11-10",
                estado_civil: "Casada",
                direccion: {
                    referencia: "Calle Los Palos Grandes, Edificio Altamira, Piso 5, Apto 52",
                    estado: "Caracas"
                },
                user: null
            },
            universidad: "Universidad de Carabobo",
            fecha_egreso_universidad: "2012-12-15",
            especialidad: "Periodoncia",
            carnetVigente: true,
            carnetVencimiento: "15/08/2025",
            tituloEntregado: true,
            estadisticas: {
                solicitudesMes: 1,
                inscripcionesMes: 2,
                asistenciaEventos: 3,
                pagosPendientes: 0,
                ultimoAcceso: "Hace 5 días"
            },
            pagos: [
                {
                    id: "5-1",
                    concepto: "Cuota anual 2024",
                    referencia: "REF-AN-2024-C",
                    fecha: "05/01/2024",
                    monto: 120.00,
                    estado: "Pagado",
                    metodoPago: "Zelle",
                    comprobante: true
                },
                {
                    id: "5-2",
                    concepto: "Inscripción taller avanzado",
                    referencia: "REF-TALLER-P456",
                    fecha: "20/02/2024",
                    monto: 75.00,
                    estado: "Pagado",
                    metodoPago: "Tarjeta de crédito",
                    comprobante: true
                }
            ],
            solicitudes: [
                {
                    id: "5-1",
                    tipo: "Actualización de datos",
                    fecha: "10/04/2024",
                    estado: "Completada",
                    descripcion: "Actualización de datos profesionales",
                    urgente: false,
                    monto: 0.00
                },
                {
                    id: "5-2",
                    tipo: "Registro de consultorio",
                    fecha: "12/04/2024",
                    estado: "Pendiente",
                    descripcion: "Registro de nuevo consultorio",
                    urgente: false,
                    monto: 35.00
                }
            ],
            documentos: [
                // Documentos similares a los anteriores
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
            fechaSolicitud: "10/04/2025",
            documentosCompletos: true,
            pagosPendientes: false,

            // Datos detallados
            persona: {
                nombre: "Carlos",
                segundo_nombre: "José",
                primer_apellido: "Ramírez",
                segundo_apellido: "Pérez",
                genero: "M",
                nacionalidad: "V",
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
            fechaSolicitud: "11/04/2025",
            documentosCompletos: false,
            pagosPendientes: true,

            // Detailed data
            persona: {
                nombre: "Ana",
                segundo_nombre: "María",
                primer_apellido: "López",
                segundo_apellido: "García",
                genero: "F",
                nacionalidad: "V",
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
                    archivo: "cedula_sofia_martinez.jpg",
                    requerido: true,
                },
                {
                    id: "file_rif",
                    nombre: "RIF",
                    descripcion: "Registro de Información Fiscal",
                    archivo: "",
                    requerido: true,
                },
                {
                    id: "file_fondo_negro",
                    nombre: "Título universitario fondo negro",
                    descripcion: "Título de Odontólogo con fondo negro",
                    archivo: "",
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
                    archivo: "pago_sofia_martinez.pdf",
                    requerido: true,
                }
            ]
        },
        // Nuevas solicitudes pendientes con diferentes fechas y estados
        {
            id: "p3",
            nombre: "Pedro Blanco",
            cedula: "V-56789012",
            email: "pedro.blanco@mail.com",
            telefono: "+58 414-5555555",
            fechaSolicitud: "05/04/2025", // Fecha anterior
            documentosCompletos: true,
            pagosPendientes: false,

            persona: {
                nombre: "Pedro",
                segundo_nombre: "Luis",
                primer_apellido: "Blanco",
                segundo_apellido: "Rojas",
                genero: "M",
                nacionalidad: "V",
                identificacion: "56789012",
                correo: "pedro.blanco@mail.com",
                telefono_movil: "+58 414-5555555",
                fecha_de_nacimiento: "1985-10-18",
                estado_civil: "Casado",
                direccion: {
                    referencia: "Urb. La Tahona, Calle Los Mirtos, Residencias Alamo, Apto 5B",
                    estado: "Caracas"
                },
                user: null
            },
            instituto_bachillerato: "Colegio Santo Tomás",
            universidad: "Universidad José María Vargas",
            fecha_egreso_universidad: "2012-06-15",
            num_registro_principal: "67890",
            fecha_registro_principal: "2012-07-10",
            num_mpps: "MP-123",
            fecha_mpps: "2012-08-05",
            instituciones: [
                {
                    nombre: "Centro Médico Docente La Trinidad",
                    cargo: "Odontólogo",
                    direccion: "Av. La Trinidad, Caracas",
                    telefono: "+58 212-9998877",
                }
            ],
            file_ci: "cedula_pedro_blanco.jpg",
            file_rif: "rif_pedro_blanco.pdf",
            file_fondo_negro: "titulo_fondo_negro_pedro_blanco.pdf",
            file_mpps: "registro_mpps_pedro_blanco.pdf",
            observaciones: "Solicita inscripción en el Colegio de Odontólogos de Venezuela, tiene experiencia internacional",
            documentos: [
                {
                    id: "file_ci",
                    nombre: "Cédula de identidad",
                    descripcion: "Copia escaneada por ambos lados",
                    archivo: "cedula_pedro_blanco.jpg",
                    requerido: true,
                },
                {
                    id: "file_rif",
                    nombre: "RIF",
                    descripcion: "Registro de Información Fiscal",
                    archivo: "rif_pedro_blanco.pdf",
                    requerido: true,
                },
                {
                    id: "file_fondo_negro",
                    nombre: "Título universitario fondo negro",
                    descripcion: "Título de Odontólogo con fondo negro",
                    archivo: "titulo_fondo_negro_pedro_blanco.pdf",
                    requerido: true,
                },
                {
                    id: "file_mpps",
                    nombre: "Registro MPPS",
                    descripcion: "Registro del Ministerio del Poder Popular para la Salud",
                    archivo: "registro_mpps_pedro_blanco.pdf",
                    requerido: true,
                },
                {
                    id: "comprobante_pago",
                    nombre: "Comprobante de pago",
                    descripcion: "Comprobante de pago de inscripción",
                    archivo: "pago_pedro_blanco.pdf",
                    requerido: true,
                }
            ]
        },
        {
            id: "p4",
            nombre: "Sofía Martínez",
            cedula: "V-67890123",
            email: "sofia.martinez@mail.com",
            telefono: "+58 412-9999999",
            fechaSolicitud: "03/03/2025",
            documentosCompletos: false,
            pagosPendientes: true,

            persona: {
                nombre: "Sofía",
                segundo_nombre: "Alejandra",
                primer_apellido: "Martínez",
                segundo_apellido: "Flores",
                genero: "F",
                nacionalidad: "V",
                identificacion: "67890123",
                correo: "sofia.martinez@mail.com",
                telefono_movil: "+58 412-9999999",
                fecha_de_nacimiento: "1992-03-25",
                estado_civil: "Soltera",
                direccion: {
                    referencia: "Las Mercedes, Calle París, Edificio Milán, Piso 3, Apto 3C",
                    estado: "Caracas"
                },
                user: null
            },
            universidad: "Universidad Nacional Experimental Rómulo Gallegos",
            fecha_egreso_universidad: "2017-12-10",
            documentos: [
                {
                    id: "file_ci",
                    nombre: "Cédula de identidad",
                    descripcion: "Copia escaneada por ambos lados",
                    archivo: "cedula_sofia_martinez.jpg",
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
                    archivo: "titulo_fondo_negro_sofia_martinez.pdf",
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
                    archivo: "pago_sofia_martinez.pdf",
                    requerido: true,
                }
            ]
        },
        {
            id: "p5",
            nombre: "Luis Torres",
            cedula: "V-78901234",
            email: "luis.torres@mail.com",
            telefono: "+58 424-1111111",
            fechaSolicitud: "10/12/2025",
            documentosCompletos: true,
            pagosPendientes: true,

            persona: {
                nombre: "Luis",
                segundo_nombre: "Alberto",
                primer_apellido: "Torres",
                segundo_apellido: "Silva",
                genero: "M",
                nacionalidad: "V",
                identificacion: "78901234",
                correo: "luis.torres@mail.com",
                telefono_movil: "+58 424-1111111",
                fecha_de_nacimiento: "1987-07-15",
                estado_civil: "Casado",
                direccion: {
                    referencia: "El Hatillo, Calle Los Mangos, Casa 45",
                    estado: "Miranda"
                },
                user: null
            },
            universidad: "Universidad de Carabobo",
            fecha_egreso_universidad: "2013-07-15",
            documentos: [
                {
                    id: "file_ci",
                    nombre: "Cédula de identidad",
                    descripcion: "Copia escaneada por ambos lados",
                    archivo: "cedula_luis_torres.jpg",
                    requerido: true,
                },
                {
                    id: "file_rif",
                    nombre: "RIF",
                    descripcion: "Registro de Información Fiscal",
                    archivo: "rif_luis_torres.pdf",
                    requerido: true,
                },
                {
                    id: "file_fondo_negro",
                    nombre: "Título universitario fondo negro",
                    descripcion: "Título de Odontólogo con fondo negro",
                    archivo: "titulo_fondo_negro_luis_torres.pdf",
                    requerido: true,
                },
                {
                    id: "file_mpps",
                    nombre: "Registro MPPS",
                    descripcion: "Registro del Ministerio del Poder Popular para la Salud",
                    archivo: "registro_mpps_luis_torres.pdf",
                    requerido: true,
                },
                {
                    id: "comprobante_pago",
                    nombre: "Comprobante de pago",
                    descripcion: "Comprobante de pago de inscripción",
                    archivo: "pago_luis_torres.pdf",
                    requerido: true,
                }
            ]
        }
    ],

    // Funciones para obtener datos específicos
    getColegiado: (id) => {
        return get().colegiados.find(col => col.id === id) || null;
    },

    getColegiadoPendiente: (id) => {
        return get().colegiadosPendientes.find(pend => pend.id === id) || null;
    },

    // Funciones para obtener colecciones específicas de cada colegiado
    getPagos: (colegiadoId) => {
        const colegiado = get().getColegiado(colegiadoId);
        return colegiado ? colegiado.pagos : [];
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

    // Funciones para añadir nuevas entidades
    addColegiado: (nuevoColegiado) => {
        set(state => ({
            colegiados: [...state.colegiados, {
                ...nuevoColegiado,
                pagos: nuevoColegiado.pagos || [],
                solicitudes: nuevoColegiado.solicitudes || [],
                documentos: nuevoColegiado.documentos || []
            }]
        }));
        return nuevoColegiado;
    },

    addColegiadoPendiente: (nuevoPendiente) => {
        set(state => ({
            colegiadosPendientes: [...state.colegiadosPendientes, nuevoPendiente]
        }));
        return nuevoPendiente;
    },

    // Funciones para actualizar entidades
    updateColegiado: (id, updatedData) => {
        set(state => ({
            colegiados: state.colegiados.map(colegiado =>
                colegiado.id === id ? { ...colegiado, ...updatedData } : colegiado
            )
        }));

        return get().getColegiado(id);
    },

    updateColegiadoPendiente: (id, updatedData) => {
        set(state => ({
            colegiadosPendientes: state.colegiadosPendientes.map(pendiente =>
                pendiente.id === id ? { ...pendiente, ...updatedData } : pendiente
            )
        }));

        return get().getColegiadoPendiente(id);
    },

    // Funciones para eliminar entidades
    removeColegiadoPendiente: (id) => {
        set(state => ({
            colegiadosPendientes: state.colegiadosPendientes.filter(
                pendiente => pendiente.id !== id
            )
        }));
    },

    // Funciones para añadir elementos a las colecciones de un colegiado
    addPago: (colegiadoId, nuevoPago) => {
        set(state => ({
            colegiados: state.colegiados.map(colegiado => {
                if (colegiado.id === colegiadoId) {
                    const pagoId = `${colegiadoId}-${colegiado.pagos.length + 1}`;
                    return {
                        ...colegiado,
                        pagos: [...colegiado.pagos, {
                            id: pagoId,
                            ...nuevoPago
                        }]
                    };
                }
                return colegiado;
            })
        }));

        // Actualizar estado de solvencia si es necesario
        const colegiado = get().getColegiado(colegiadoId);
        if (colegiado && !colegiado.solvente &&
            nuevoPago.concepto &&
            nuevoPago.concepto.toLowerCase().includes('cuota') &&
            nuevoPago.estado === 'Pagado') {
            get().updateColegiado(colegiadoId, { solvente: true });
        }

        return get().getPagos(colegiadoId);
    },

    addSolicitud: (colegiadoId, nuevaSolicitud) => {
        set(state => ({
            colegiados: state.colegiados.map(colegiado => {
                if (colegiado.id === colegiadoId) {
                    const solicitudId = `${colegiadoId}-${colegiado.solicitudes.length + 1}`;
                    return {
                        ...colegiado,
                        solicitudes: [...colegiado.solicitudes, {
                            id: solicitudId,
                            ...nuevaSolicitud
                        }]
                    };
                }
                return colegiado;
            })
        }));

        return get().getSolicitudes(colegiadoId);
    },

    // Funciones para gestionar el registro de colegiados
    approveRegistration: (pendienteId, datosRegistro) => {
        const pendiente = get().getColegiadoPendiente(pendienteId);
        if (!pendiente) {
            console.error("No se encontró el pendiente con ID:", pendienteId);
            return null;
        }

        // Crear un nombre completo con los datos disponibles
        const nombreCompleto = `${pendiente.persona.nombre} ${pendiente.persona.segundo_nombre || ''} ${pendiente.persona.primer_apellido} ${pendiente.persona.segundo_apellido || ''}`.trim();

        // Obtener la sesión actual del store
        const session = get().session;

        // Crear el nuevo colegiado a partir de los datos del pendiente
        const nuevoColegiado = {
            id: `cov-${Date.now()}`,
            nombre: nombreCompleto,
            cedula: `${pendiente.persona.nacionalidad}-${pendiente.persona.identificacion}`,
            numeroRegistro: datosRegistro.num_cov || `ODV-${Math.floor(1000 + Math.random() * 9000)}`,
            email: pendiente.persona.correo,
            telefono: pendiente.persona.telefono_movil,
            fechaRegistro: new Date().toLocaleDateString(),
            estado: "Activo",
            solvente: true,
            especialidad: datosRegistro.tipo_profesion || "Odontología General",

            // Datos detallados
            persona: pendiente.persona,
            instituto_bachillerato: pendiente.instituto_bachillerato,
            universidad: pendiente.universidad,
            fecha_egreso_universidad: pendiente.fecha_egreso_universidad,
            num_registro_principal: pendiente.num_registro_principal,
            fecha_registro_principal: pendiente.fecha_registro_principal,
            num_mpps: pendiente.num_mpps,
            fecha_mpps: pendiente.fecha_mpps,
            instituciones: pendiente.instituciones || [],

            // Archivos
            file_ci: pendiente.file_ci,
            file_rif: pendiente.file_rif,
            file_fondo_negro: pendiente.file_fondo_negro,
            file_mpps: pendiente.file_mpps,

            // Valores por defecto
            carnetVigente: true,
            carnetVencimiento: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString(),
            tituloEntregado: false,

            // Colecciones
            pagos: [],
            solicitudes: [],
            documentos: pendiente.documentos || [],

            // Estadísticas iniciales
            estadisticas: {
                solicitudesMes: 0,
                inscripcionesMes: 0,
                asistenciaEventos: 0,
                pagosPendientes: 0,
                ultimoAcceso: "Hoy"
            },

            // Información del creador original (del registro pendiente)
            creador: pendiente.creador,

            // Información de quien aprobó el registro
            aprobadoPor: session ? {
                username: session.user?.username || 'admin',
                email: session.user?.email || 'admin@cov.com',
                fecha: new Date().toISOString(),
                esAdmin: session.user?.role === 'admin' || false
            } : null
        };

        // Añadir el colegiado y eliminar el pendiente
        get().addColegiado(nuevoColegiado);
        get().removeColegiadoPendiente(pendienteId);

        return nuevoColegiado;
    },

    // Funciones específicas
    marcarTituloEntregado: (colegiadoId, entregado = true) => {
        return get().updateColegiado(colegiadoId, { tituloEntregado: entregado });
    }
}));

export const useDataListaColegiadosWithSession = () => {
    const store = useDataListaColegiados();
    const [sessionInitialized, setSessionInitialized] = useState(false);

    useEffect(() => {
        // En Next.js, debemos importar useSession aquí para evitar problemas con SSR
        import('next-auth/react').then(({ useSession }) => {
            const { data: session } = useSession();
            if (session && !sessionInitialized) {
                store.initSession(session);
                setSessionInitialized(true);
            }
        });
    }, [store, sessionInitialized]);

    return store;
};

export default useDataListaColegiados;
// Datos de ejemplo para el módulo de Grupos y Usuarios Administradores

// Administradores
export const administradoresData = [
    {
        id: 1,
        nombre: "Ana María",
        apellido: "Rodríguez",
        email: "ana.rodriguez@ejemplo.com",
        grupo: "Personal Administrativo",
        telefono: "+58 412 555 1234",
        permiso: "alto",
        status: "activo",
        fechaRegistro: "10-01-2023",
        ultimoAcceso: "17-05-2025 10:30",
        direccion: "Av. Principal #123, Caracas",
        permisos: {
            usuarios: true,
            contenido: true,
            finanzas: true,
            reportes: true,
            ajustes: true,
            grupos: true
        },
        estadisticas: {
            accionesMensuales: [120, 140, 160, 180, 200, 210],
            distribucionAcciones: [
                { nombre: "Usuarios creados", valor: 45, color: "#D7008A" },
                { nombre: "Contenido editado", valor: 30, color: "#41023B" },
                { nombre: "Reportes generados", valor: 15, color: "#FF6B6B" },
                { nombre: "Otros", valor: 10, color: "#4ECDC4" }
            ],
            ultimasAcciones: [
                { tipo: "usuario", accion: "Creación de usuario", fecha: "15-05-2025" },
                { tipo: "permiso", accion: "Modificación de permisos", fecha: "14-05-2025" },
                { tipo: "contenido", accion: "Actualización de contenido", fecha: "13-05-2025" },
                { tipo: "reporte", accion: "Generación de reporte", fecha: "10-05-2025" }
            ]
        }
    },
    {
        id: 2,
        nombre: "Carlos",
        apellido: "Méndez",
        email: "carlos.mendez@ejemplo.com",
        grupo: "Protocolo",
        telefono: "+58 414 555 5678",
        permiso: "medio",
        status: "inactivo",
        fechaRegistro: "15-03-2023",
        ultimoAcceso: "15-05-2025 09:45",
        direccion: "Calle Las Flores #45, Valencia",
        permisos: {
            usuarios: true,
            contenido: true,
            finanzas: false,
            reportes: true,
            ajustes: false,
            grupos: false
        },
        estadisticas: {
            accionesMensuales: [80, 90, 85, 95, 100, 90],
            distribucionAcciones: [
                { nombre: "Usuarios creados", valor: 20, color: "#D7008A" },
                { nombre: "Contenido editado", valor: 50, color: "#41023B" },
                { nombre: "Reportes generados", valor: 20, color: "#FF6B6B" },
                { nombre: "Otros", valor: 10, color: "#4ECDC4" }
            ],
            ultimasAcciones: [
                { tipo: "contenido", accion: "Actualización de contenido", fecha: "15-05-2025" },
                { tipo: "contenido", accion: "Creación de contenido", fecha: "14-05-2025" },
                { tipo: "reporte", accion: "Generación de reporte", fecha: "12-05-2025" },
                { tipo: "usuario", accion: "Edición de usuario", fecha: "10-05-2025" }
            ]
        }
    },
    {
        id: 3,
        nombre: "Gabriela",
        apellido: "Torres",
        email: "gabriela.torres@ejemplo.com",
        grupo: "Secretario de Finanzas",
        telefono: "+58 416 555 9012",
        permiso: "alto",
        status: "activo",
        fechaRegistro: "05-06-2023",
        ultimoAcceso: "16-05-2025 14:20",
        direccion: "Urb. Los Samanes, Casa 78, Maracaibo",
        permisos: {
            usuarios: true,
            contenido: true,
            finanzas: true,
            reportes: true,
            ajustes: true,
            grupos: true
        },
        estadisticas: {
            accionesMensuales: [150, 160, 155, 170, 180, 190],
            distribucionAcciones: [
                { nombre: "Usuarios creados", valor: 10, color: "#D7008A" },
                { nombre: "Contenido editado", valor: 20, color: "#41023B" },
                { nombre: "Finanzas", valor: 60, color: "#FF6B6B" },
                { nombre: "Otros", valor: 10, color: "#4ECDC4" }
            ],
            ultimasAcciones: [
                { tipo: "finanzas", accion: "Registro de pago", fecha: "17-05-2025" },
                { tipo: "finanzas", accion: "Emisión de factura", fecha: "16-05-2025" },
                { tipo: "finanzas", accion: "Aprobación de presupuesto", fecha: "15-05-2025" },
                { tipo: "reporte", accion: "Generación de reporte financiero", fecha: "12-05-2025" }
            ]
        }
    },
    {
        id: 4,
        nombre: "Roberto",
        apellido: "Fernández",
        email: "roberto.fernandez@ejemplo.com",
        grupo: "Protocolo",
        telefono: "+58 424 555 3456",
        permiso: "bajo",
        status: "activo",
        fechaRegistro: "20-04-2025",
        ultimoAcceso: "14-05-2025 11:15",
        direccion: "Av. Los Mangos #230, Puerto La Cruz",
        permisos: {
            usuarios: false,
            contenido: true,
            finanzas: false,
            reportes: false,
            ajustes: false,
            grupos: false
        },
        estadisticas: {
            accionesMensuales: [30, 35, 40, 45, 50, 55],
            distribucionAcciones: [
                { nombre: "Contenido editado", valor: 90, color: "#41023B" },
                { nombre: "Otros", valor: 10, color: "#4ECDC4" }
            ],
            ultimasAcciones: [
                { tipo: "contenido", accion: "Actualización de contenido", fecha: "14-05-2025" },
                { tipo: "contenido", accion: "Creación de contenido", fecha: "13-05-2025" },
                { tipo: "contenido", accion: "Revisión de contenido", fecha: "12-05-2025" },
                { tipo: "contenido", accion: "Actualización de contenido", fecha: "10-05-2025" }
            ]
        }
    },
    {
        id: 5,
        nombre: "Laura",
        apellido: "Sánchez",
        email: "laura.sanchez@ejemplo.com",
        grupo: "Personal Administrativo",
        telefono: "+58 426 555 7890",
        permiso: "medio",
        status: "activo",
        fechaRegistro: "15-07-2023",
        ultimoAcceso: "16-05-2025 16:40",
        direccion: "Calle Las Acacias #56, Mérida",
        permisos: {
            usuarios: true,
            contenido: true,
            finanzas: false,
            reportes: true,
            ajustes: false,
            grupos: false
        },
        estadisticas: {
            accionesMensuales: [90, 95, 100, 105, 110, 115],
            distribucionAcciones: [
                { nombre: "Usuarios creados", valor: 40, color: "#D7008A" },
                { nombre: "Contenido editado", valor: 40, color: "#41023B" },
                { nombre: "Reportes generados", valor: 15, color: "#FF6B6B" },
                { nombre: "Otros", valor: 5, color: "#4ECDC4" }
            ],
            ultimasAcciones: [
                { tipo: "usuario", accion: "Creación de usuario", fecha: "16-05-2025" },
                { tipo: "contenido", accion: "Actualización de contenido", fecha: "15-05-2025" },
                { tipo: "usuario", accion: "Edición de usuario", fecha: "14-05-2025" },
                { tipo: "reporte", accion: "Generación de reporte", fecha: "12-05-2025" }
            ]
        }
    }
];

// Grupos
export const gruposData = [
    {
        id: 1,
        nombre: "Personal Administrativo",
        descripcion: "Personal encargado de tareas administrativas generales y coordinación de actividades internas.",
        nivelPermiso: "medio",
        fechaCreacion: "15-01-2023",
        cantidadUsuarios: 8,
        permisos: {
            usuarios: true,
            contenido: true,
            finanzas: false,
            reportes: true,
            ajustes: false,
            grupos: false
        },
        miembros: [
            {
                id: 1,
                nombre: "Ana María",
                apellido: "Rodríguez",
                email: "ana.rodriguez@ejemplo.com",
                permiso: "alto", // Personalizado
                permisosPersonalizados: true
            },
            {
                id: 5,
                nombre: "Laura",
                apellido: "Sánchez",
                email: "laura.sanchez@ejemplo.com",
                permiso: "medio", // Heredado del grupo
                permisosPersonalizados: false
            }
        ]
    },
    {
        id: 2,
        nombre: "Protocolo",
        descripcion: "Equipo responsable de eventos y relaciones públicas.",
        nivelPermiso: "bajo",
        fechaCreacion: "20-02-2023",
        cantidadUsuarios: 5,
        permisos: {
            usuarios: false,
            contenido: true,
            finanzas: false,
            reportes: false,
            ajustes: false,
            grupos: false
        },
        miembros: [
            {
                id: 2,
                nombre: "Carlos",
                apellido: "Méndez",
                email: "carlos.mendez@ejemplo.com",
                permiso: "medio", // Personalizado
                permisosPersonalizados: true
            },
            {
                id: 4,
                nombre: "Roberto",
                apellido: "Fernández",
                email: "roberto.fernandez@ejemplo.com",
                permiso: "bajo", // Heredado del grupo
                permisosPersonalizados: false
            }
        ]
    },
    {
        id: 3,
        nombre: "Secretario de Finanzas",
        descripcion: "Encargados de la gestión financiera y contabilidad.",
        nivelPermiso: "alto",
        fechaCreacion: "10-03-2023",
        cantidadUsuarios: 3,
        permisos: {
            usuarios: true,
            contenido: true,
            finanzas: true,
            reportes: true,
            ajustes: true,
            grupos: true
        },
        miembros: [
            {
                id: 3,
                nombre: "Gabriela",
                apellido: "Torres",
                email: "gabriela.torres@ejemplo.com",
                permiso: "alto", // Heredado del grupo
                permisosPersonalizados: false
            }
        ]
    }
];

// Función para obtener un administrador por ID
export const getAdministradorById = (id) => {
    const numericId = parseInt(id, 10);
    return administradoresData.find(admin => admin.id === numericId);
};

// Función para obtener un grupo por ID
export const getGrupoById = (id) => {
    const numericId = parseInt(id, 10);
    return gruposData.find(grupo => grupo.id === numericId);
};

// Función para obtener administradores por grupo
export const getAdministradoresByGrupo = (grupoNombre) => {
    return administradoresData.filter(admin => admin.grupo === grupoNombre);
};

// Función para obtener usuarios disponibles para añadir a un grupo
export const getUsuariosDisponiblesParaGrupo = (grupoId) => {
    const grupo = getGrupoById(grupoId);
    if (!grupo) return [];

    // IDs de los miembros actuales del grupo
    const miembrosIds = grupo.miembros.map(miembro => miembro.id);

    // Filtrar administradores que no están en el grupo
    return administradoresData
        .filter(admin => !miembrosIds.includes(admin.id))
        .map(admin => ({
            id: admin.id,
            nombre: admin.nombre,
            apellido: admin.apellido,
            email: admin.email,
            grupoActual: admin.grupo
        }));
};
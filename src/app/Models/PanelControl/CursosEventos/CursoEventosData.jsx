export const eventosData = [
    {
        "id": 1,
        "logo": "logo1.png",
        "logo_url": "/assets/eventos/evento1.avif", // Usando la imagen disponible
        "cover": "cover1.png",
        "cover_url": "/assets/eventos/evento1.avif",
        "certificado": "cert1.png",
        "certificado_url": "/assets/eventos/evento1.avif", // Usando la misma imagen como placeholder
        "nombre": "Congreso Internacional 80 Aniversario del Colegio de Odontólogos de Venezuela",
        "precio": "150.00",
        "slug": "congreso-internacional-80-aniversario",
        "cupos": 200,
        "hora_inicio": "08:00:00",
        "hora_final": "18:00:00",
        "fecha": "2025-08-11",
        "lugar": "Hotel Gran Meliá Caracas",
        "descripcion": "Congreso internacional con ponentes de renombre en el campo de la odontología.",
        "showPriceTag": true,
        "currency": "USD",
        "formulario": {
            "campos": [
                {
                    "tipo": "seleccion",
                    "nombre": "Tipo identificación",
                    "opciones": [
                        "Cédula",
                        "Pasaporte",
                        "Otro"
                    ],
                    "requerido": "true"
                },
                {
                    "tipo": "numero",
                    "nombre": "Número identificación",
                    "requerido": "true",
                    "longitud_maxima": 20
                },
                {
                    "tipo": "texto",
                    "nombre": "Nombres y Apellidos",
                    "requerido": "true",
                    "longitud_maxima": 100
                },
                {
                    "tipo": "fecha",
                    "nombre": "Fecha nacimiento",
                    "formato": "DD/MM/YYYY",
                    "requerido": "true"
                }
            ]
        },
        "create_at": "2025-01-15",
        "update_at": "2025-01-15",
        // Compatibilidad con el código anterior
        "title": "Congreso Internacional 80 Aniversario del Colegio de Odontólogos de Venezuela",
        "date": "2025-08-11",
        "location": "Hotel Gran Meliá Caracas",
        "image": "/assets/eventos/evento1.avif",
        "linkText": "Inscríbete"
    },
    {
        "id": 2,
        "logo": "logo2.png",
        "logo_url": "/assets/eventos/evento2.avif",
        "cover": "cover2.png",
        "cover_url": "/assets/eventos/evento2.avif",
        "certificado": "cert2.png",
        "certificado_url": "/assets/eventos/evento2.avif",
        "nombre": "Desde la historia hasta la biopsia",
        "precio": "97.50",
        "slug": "historia-hasta-biopsia",
        "cupos": 75,
        "hora_inicio": "10:00:00",
        "hora_final": "16:00:00",
        "fecha": "2025-06-23",
        "lugar": "Auditorio COV Las Palmas, Caracas",
        "descripcion": "Un recorrido por la evolución de las técnicas de biopsia en odontología.",
        "showPriceTag": true,
        "currency": "BS",
        "formulario": {
            "campos": [
                {
                    "tipo": "seleccion",
                    "nombre": "Tipo identificación",
                    "opciones": [
                        "Cédula",
                        "Pasaporte",
                        "Otro"
                    ],
                    "requerido": "true"
                },
                {
                    "tipo": "numero",
                    "nombre": "Número identificación",
                    "requerido": "true",
                    "longitud_maxima": 20
                },
                {
                    "tipo": "archivo",
                    "nombre": "Comprobante de pago",
                    "requerido": "true",
                    "tipo_archivo": "imagen",
                    "tamano_maximo": "5MB"
                },
                {
                    "tipo": "numero",
                    "nombre": "Monto cancelado",
                    "requerido": "true",
                    "longitud_maxima": 10
                }
            ]
        },
        "create_at": "2025-02-10",
        "update_at": "2025-02-10",
        // Compatibilidad con el código anterior
        "title": "Desde la historia hasta la biopsia",
        "date": "2025-06-23",
        "location": "Auditorio COV Las Palmas, Caracas",
        "image": "/assets/eventos/evento2.avif",
        "linkText": "Inscripciones clic aquí"
    }
];

export const cursosData = [
    {
        "id": 3,
        "logo": "logo3.png",
        "logo_url": "/assets/eventos/evento3.avif",
        "cover": "cover3.png",
        "cover_url": "/assets/eventos/evento3.avif",
        "certificado": "cert3.png",
        "certificado_url": "/assets/eventos/evento3.avif",
        "nombre": "Ortodoncia al 100%",
        "precio": "250.00",
        "instructores": "Dr. Juan Pérez, Dra. María Rodríguez",
        "hora_inicio": "09:00:00",
        "duracion": "8 horas",
        "starts_at": "2025-07-07",
        "ends_at": "2025-07-07",
        "lugar": "Auditorio COV Las Palmas, Caracas",
        "descripcion": "Nuevas tendencias en la ortodoncia moderna",
        "cupos": 30,
        "showPriceTag": true,
        "currency": "USD",
        "formulario": {
            "campos": [
                {
                    "tipo": "seleccion",
                    "nombre": "Tipo identificación",
                    "opciones": [
                        "Cédula",
                        "Pasaporte",
                        "Otro"
                    ],
                    "requerido": "true"
                },
                {
                    "tipo": "numero",
                    "nombre": "Número identificación",
                    "requerido": "true",
                    "longitud_maxima": 20
                },
                {
                    "tipo": "texto",
                    "nombre": "Nombres y Apellidos",
                    "requerido": "true",
                    "longitud_maxima": 100
                },
                {
                    "tipo": "interruptor",
                    "nombre": "¿Requiere constancia de participación?",
                    "requerido": "true",
                    "valor_predeterminado": "true"
                }
            ]
        },
        "create_at": "2025-03-15",
        "update_at": "2025-03-15",
        // Compatibilidad con el código anterior
        "title": "Ortodoncia al 100%",
        "date": "2025-07-07",
        "location": "Auditorio COV Las Palmas, Caracas",
        "image": "/assets/eventos/evento3.avif",
        "linkText": "Inscripciones clic aquí"
    }
];
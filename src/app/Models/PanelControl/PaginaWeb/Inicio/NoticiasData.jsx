const newsItems = [
  // Ejemplo con el JSON proporcionado
  {
    id: 1,
    titulo: "Congreso Nacional de Odontología 2023",
    destacado: true,
    imagen_portada_url: "https://www.youtube.com/watch?v=OaGSreqHCXE",
    date: "15/05/2024",
    time: "10:30am",
    category: "Conferencias",
    contenido:
      '[\n  {\n    "id": "element-1747160244582",\n    "type": "heading1",\n    "content": "Encabezado principal",\n    "style": {\n      "textAlign": "left",\n      "width": "100%",\n      "color": "#1f2937"\n    },\n    "rowData": {\n      "row": 0,\n      "gridPosition": 0\n    }\n  },\n  {\n    "id": "element-1747160233622",\n    "type": "quote",\n    "content": "Añade una cita importante aquí",\n    "style": {\n      "textAlign": "left",\n      "width": "100%",\n      "color": "#4b5563"\n    },\n    "rowData": {\n      "row": 1,\n      "gridPosition": 0\n    },\n    "author": "Autor de la cita"\n  },\n  {\n    "id": "p0",\n    "type": "paragraph",\n    "content": "El Congreso Nacional de Odontología 2023 reunirá a los mejores especialistas del país para discutir los avances más recientes en el campo. Este evento imperdible tendrá lugar en Caracas y contará con talleres prácticos, conferencias y oportunidades de networking.",\n    "style": {\n      "textAlign": "left",\n      "width": "100%",\n      "color": "#4b5563"\n    },\n    "rowData": {\n      "row": 2,\n      "gridPosition": 0\n    }\n  },\n  {\n    "id": "p1",\n    "type": "paragraph",\n    "content": "Este año, el congreso se enfocará en cuatro áreas principales: implantología avanzada, odontología digital, estética dental y gestión de consultorios. Los asistentes podrán elegir entre más de 30 sesiones especializadas impartidas por ponentes nacionales e internacionales.",\n    "style": {\n      "textAlign": "left",\n      "width": "100%",\n      "color": "#4b5563"\n    },\n    "rowData": {\n      "row": 3,\n      "gridPosition": 0\n    }\n  },\n  {\n    "id": "p2",\n    "type": "paragraph",\n    "content": "Entre los ponentes destacados se encuentran el Dr. Luis Ramírez, reconocido por sus innovaciones en técnicas de implantes dentales; la Dra. María González, especialista en odontología digital y flujos de trabajo CAD/CAM; y el Dr. Carlos Mendoza, referente en restauraciones estéticas de mínima invasión.",\n    "style": {\n      "textAlign": "left",\n      "width": "100%",\n      "color": "#4b5563"\n    },\n    "rowData": {\n      "row": 4,\n      "gridPosition": 0\n    }\n  },\n  {\n    "id": "p3",\n    "type": "paragraph",\n    "content": "Además de las conferencias, el evento ofrecerá una amplia exposición comercial donde los asistentes podrán conocer las últimas tecnologías, equipos y materiales disponibles en el mercado odontológico.",\n    "style": {\n      "textAlign": "left",\n      "width": "100%",\n      "color": "#4b5563"\n    },\n    "rowData": {\n      "row": 5,\n      "gridPosition": 0\n    }\n  },\n  {\n    "id": "p4",\n    "type": "paragraph",\n    "content": "La inscripción temprana está disponible con descuentos especiales para miembros de asociaciones odontológicas y estudiantes. El evento contará con certificación de horas académicas válidas para recertificación profesional.",\n    "style": {\n      "textAlign": "left",\n      "width": "100%",\n      "color": "#4b5563"\n    },\n    "rowData": {\n      "row": 6,\n      "gridPosition": 0\n    }\n  }\n]',
  },

  {
    id: 2,
    titulo: "Nuevas Técnicas en Implantología Dental",
    destacado: true,
    imagen_portada_url: "https://www.orientacionlaboral.org/wp-content/uploads/2022/09/odontologo.jpg",
    date: "12/05/2024",
    time: "09:15am",
    category: "Investigación",
    contenido: JSON.stringify([
      {
        id: "heading-1",
        type: "heading1",
        content: "Avances en Implantología Dental",
        style: {
          textAlign: "center",
          width: "100%",
          color: "#1f2937",
        },
        rowData: {
          row: 0,
          gridPosition: 0,
        },
      },
      {
        id: "p-1",
        type: "paragraph",
        content:
          "La implantología dental ha experimentado avances significativos en los últimos años, con nuevas técnicas que mejoran la precisión y reducen los tiempos de recuperación.",
        style: {
          textAlign: "left",
          width: "100%",
          color: "#4b5563",
        },
        rowData: {
          row: 1,
          gridPosition: 0,
        },
      },
      {
        id: "image-1",
        type: "image",
        content: "/assets/noticias/implante-dental.jpg",
        style: {
          width: "100%",
        },
        rowData: {
          row: 2,
          gridPosition: 0,
        },
      },
      {
        id: "p-2",
        type: "paragraph",
        content:
          "Los nuevos sistemas de navegación guiada por computadora permiten una colocación más precisa de los implantes, minimizando el riesgo de complicaciones y mejorando los resultados estéticos.",
        style: {
          textAlign: "left",
          width: "100%",
          color: "#4b5563",
        },
        rowData: {
          row: 3,
          gridPosition: 0,
        },
      },
    ]),
  },

  {
    id: 3,
    date: "05/05/2024",
    time: "03:15pm",
    title: "NUEVO EPISODIO: Podcast Odontología Actual",
    description:
      "No te pierdas el más reciente episodio de nuestro podcast donde expertos discuten las últimas tendencias en implantes dentales y tecnologías de vanguardia para procedimientos restaurativos.",
    imageUrl: "https://www.orientacionlaboral.org/wp-content/uploads/2022/09/odontologo.jpg",
    category: "Podcast",
  },
]

export default newsItems
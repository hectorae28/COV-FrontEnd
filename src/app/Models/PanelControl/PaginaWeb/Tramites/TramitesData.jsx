import { IdCard, Users, WandSparkles, Award, GraduationCap, Wand } from "lucide-react";

export const tramitesInfo = {
    "carnet": {
        title: "Carnet",
        color: "#590248",
        image: "/assets/tramites/Carnet.avif",
        icon: <IdCard className="w-6 h-6" />,
        requisitos: [
            "Foto tipo carnet fondo blanco (reciente)",
            "Poseer la siguiente información:",
            "- Nombre de la Universidad de egreso",
            "- Apellidos completos",
            "- Nombres completos",
            "- Número de Cédula de Identidad",
            "- Número de C.O.V.",
            "- Número de M.P.P.S."
        ],
        notas: [
            "Recuerde que debe estar solvente con el COV al momento de realizar la renovación.",
            "Las cancelaciones en la institución solo podrán ser recibidas por tarjeta de débito y crédito, de lo contrario deberá hacer depósitos o transferencias bancarias.",
            "Para la solicitud en línea deberá registrarse su usuario, luego que mande los datos se validará en el sistema. Siguiente paso deberá pagar la solvencia, luego de validar el pago de solvencia podrá solicitar su renovación de carnet digital."
        ],
        botones: [
            { texto: "Enviar solicitud online", icon: "ExternalLink", link: "#", color: "#590248" }
        ],
        costo: "20 USD",
    },
    "odontologos": {
        title: "Odontólogos",
        color: "#118AB2",
        image: "/assets/tramites/Odontologos.avif",
        icon: <Users className="w-6 h-6" />,
        requisitos: [
            "Título original ya inscrito en el Registro Principal",
            "Copia del Registro ante el Ministerio del Poder Popular para la Salud (MPPS)",
            "Fondo negro del título",
            "Fotocopia ampliada de la Cédula de Identidad (150%)",
            "Copia del RIF actualizado y ampliada",
            "1 Foto tipo carnet (fondo blanco)"
        ],
        notas: [
            "TODOS LOS DOCUMENTOS DEBEN VENIR EN UNA CARPETA MANILA TAMAÑO CARTA",
            "La solvencia depende de lo que deba el odontólogo",
            "Métodos de Pago: Tarjeta de Débito, tarjeta de Crédito, depósitos y transferencia bancaria en las Cuentas COV"
        ],
        botones: [
            { texto: "Planilla de inscripción", icon: "Download", link: "#", color: "#118AB2" },
            { texto: "Enviar solicitud online", icon: "ExternalLink", link: "#", color: "#118AB2" }
        ],
        costo: "170 USD",
    },
    "higienistasDentales": {
        title: "Higienistas Dentales",
        color: "#ffba1a",
        image: "/assets/tramites/Higienistas.avif",
        icon: <WandSparkles className="w-6 h-6" />,
        requisitos: [
            "Título original y fondo negro",
            "Constancia de Registro ante Ministerio del Poder Popular para la Salud (MPPS)",
            "Fondo negro de la credencial tamaño carta",
            "Notas del curso de higienista",
            "Fondo negro del título de bachiller (Solo para los que no son Odontólogos Colegiados)",
            "Fotocopia ampliada de la Cédula",
            "Copia del RIF actualizado",
            "1 Foto tipo carnet fondo (blanco vigente)"
        ],
        botones: [
            { texto: "Planilla de inscripción", icon: "Download", link: "#", color: "#ffba1a" }
        ],
        costo: "120 USD",
    },
    "tecnicosDentales": {
        title: "Técnicos Dentales",
        color: "#037254",
        image: "/assets/tramites/Tecnicos.avif",
        icon: <Wand className="w-6 h-6" />,
        requisitos: [
            "Título original y fondo negro",
            "Constancia de Registro ante Ministerio del Poder Popular para la Salud (MPPS)",
            "Fondo negro de la credencial tamaño carta",
            "Notas del curso de técnico dental",
            "Fondo negro del título de bachiller (Solo para los que no son Odontólogos Colegiados)",
            "Fotocopia ampliada de la cédula de identidad (150%)",
            "Copia del RIF actualizado",
            "1 Foto tipo carnet fondo blanco"
        ],
        botones: [
            { texto: "Planilla de inscripción", icon: "Download", link: "#", color: "#037254" }
        ],
        costo: "120 USD",
    },
    "especialidades": {
        title: "Especialidades",
        color: "#C40180",
        image: "/assets/tramites/Especialidades.avif",
        icon: <Award className="w-6 h-6" />,
        requisitos: [
            "Original y fondo negro del título de la especialización (Tamaño carta)",
            "Fondo negro del título de odontólogo (tamaño carta)",
            "Apostilla original y copia del título (en caso de ser extranjero)",
            "Fotocopia ampliada de la Cédula de Identidad (150%)",
            "2 Fotos tipo carnet",
            "Carta dirigida a la Junta Directiva Nacional solicitando el reconocimiento de la especialidad",
            "Solvencia del Colegio de Odontólogos de Venezuela"
        ],
        notas: [
            "Para los posgrados cursados en otras latitudes, se requiere presentar programas certificados (Con excepción a los ya aprobados)",
            "Especialidades dirigidas a: Cirugía Bucal, Cirugía Buco Máxilo-Facial, Endodoncia, Implantología, Odontología Biológica, Odontología Forense, Odontopediatría, Ortodoncia, Ortopedia Funcional de los Maxilares, Patología Bucal, Periodoncia, Prótesis Bucal, Prótesis Máxilo-Facial, Equilibrio Oclusal, Salud Pública, Medicina Bucal"
        ],
        botones: [
            { texto: "Planilla de inscripción", icon: "Download", link: "#", color: "#C40180" }
        ],
        costo: "100 USD",
    },
    "avalCursos": {
        title: "Aval para Cursos",
        color: "#073B4C",
        image: "/assets/tramites/AvalCursos.avif",
        icon: <GraduationCap className="w-6 h-6" />,
        contenido: "El aval académico del Colegio Odontológico de Venezuela certifica la calidad y pertinencia de cursos, diplomados y eventos científicos en el área odontológica. Este respaldo institucional garantiza el nivel académico de las actividades formativas y les otorga reconocimiento oficial dentro del gremio.",
        pdfViewer: true,
        pdfUrl: "/AvalCursos.pdf",
        costo: "100 USD",
    }
};

// Mapping of procedure names for comparison in the fee table
export const tramiteMapping = {
    "carnet": "Carnet",
    "odontologos": "Odontólogos",
    "higienistasDentales": "Higienistas Dentales",
    "tecnicosDentales": "Técnicos Dentales",
    "especialidades": "Especialidades"
};

// Fee table data
export const tarifasData = [
    { tramite: "Odontólogos", monto: "170$" },
    { tramite: "Higienistas Dentales", monto: "120$" },
    { tramite: "Técnicos Dentales", monto: "120$" },
    { tramite: "Especialidades", monto: "100$" },
    { tramite: "Carnet", monto: "20$" },
    { tramite: "Cartas c/u", monto: "15$" },
    { tramite: "Solvencia cada mes en el año 2025", monto: "7$" }
];

// Información de métodos de pago
export const metodosPageData = {
    tituloPrincipal: "Tarifas y Pagos",
    notaCarnet: "Para obtener el carnet (físico o digital), es necesario estar solvente con el COV. El físico se retira en las oficinas y el digital se descarga desde el Sistema Colegiados.",
    notaEspecialidades: "Debe estar solvente con el COV.",
    notaOdontologos: "Las inscripciones se cobran a partir de la fecha de la emisión del título. Consultar por vía telefónica para obtener un monto exacto.",
    tituloMetodosPago: "Métodos de Pago:",
    textoBtnPresencial: "Instalaciones del COV (Tarjeta de Débito / Crédito)",
    textoBtnBDV: "Banco de Venezuela",
    textoBtnPaypal: "PayPal"
};

// Datos del modal de Banco de Venezuela
export const bdvModalData = {
    title: "Banco de Venezuela",
    mensaje1: "Cuentas Bancarias",
    mensaje2: "Números de cuentas del Colegio de Odontólogos de Venezuela",
    rif: "RIF.: J-00041277-4",
    nombreCuenta: "A nombre del Colegio de Odontólogos de Venezuela",
    correo: "secretariafinanzas@elcov.org",
    alertaTexto: "SI VA A REALIZAR TRÁMITES EN LINEA DEBERÁ DEPOSITAR SOLAMENTE EN LA CUENTA DEL BANCO DE VENEZUELA.",
    bancoInfo: "BANCO DE VENEZUELA",
    numeroCuenta: "Cuenta Corriente Nº 0102-0127-63-0000007511",
    btnCerrar: "Cerrar",
    btnContactar: "Contactar"
};

// Datos del modal de PayPal
export const paypalModalData = {
    title: "PayPal COV",
    textoInfo1: "Para realizar los pagos desde PayPal deberás calcular la comisión en el siguiente formulario. Una vez conozca el monto a depositar deberás colocarlo en el formulario y sabrás el monto a depositar por PayPal. Tienes el botón de acceso directo para pagar en PayPal o el correo.",
    textoInfo2: "Si estás realizando el trámite en línea deberás reportarlo adjuntando el pago a la página. En caso contrario deberás notificarlo al correo secretariafinanzas@elcov.org indicando información necesaria.",
    alertaTexto: "Recomendamos no colocar dirección de envío y liberar el pago. Hasta que este disponible el pago puede ser aceptado su trámite.",
    labelMonto: "Ingrese el Monto a cancelar (USD):",
    labelResultado: "Monto a depositar en PayPal:",
    correoPaypal: "paypalelcov@gmail.com",
    btnCerrar: "Cerrar",
    btnPagar: "Pagar en PayPal"
};

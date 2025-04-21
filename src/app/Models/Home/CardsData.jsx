import { HiOutlineHome, HiOutlineInformationCircle, HiOutlineExclamation } from 'react-icons/hi';

const cards = [
    {
        title: "Bienvenido",
        subtitle: "Panel ELCOV",
        description: [
            "Bienvenido al sistema de administración, eventos, inscripciones y estadísticas de ELCOV.",
            <br key="break" />,
            "Según tu Rol o Rango en el panel podrás modificar, crear y observar las listas de datos que te interesen."
        ],
        icon: <HiOutlineHome className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500" />,
        accentColor: "indigo"
    },
    {
        title: "Instrucciones",
        subtitle: "Guía de uso",
        description: "Al lado izquierdo tendrás un menú donde podrás interactuar al seleccionar el enlace Inscripciones, después se desplegará una lista de los inscritos. Puede editar el inscrito al evento o verificar su pago.",
        icon: <HiOutlineInformationCircle className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />,
        accentColor: "blue"
    },
    {
        title: "Advertencias",
        subtitle: "Precauciones importantes",
        description: "Ten en cuenta las advertencias del sistema antes de continuar. Asegúrate de guardar los cambios y verificar la información antes de confirmar cualquier acción.",
        icon: <HiOutlineExclamation className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500" />,
        accentColor: "amber"
    }
];

export default cards;
import { Clock, Award, BookOpen, Users, GlobeIcon, MedalIcon } from "lucide-react"

// Array of gradient combinations that look good together
const gradientCombinations = [
  "from-blue-500 to-cyan-400",
  "from-purple-600 to-indigo-500",
  "from-green-500 to-emerald-400",
  "from-pink-500 to-rose-400",
  "from-orange-500 to-yellow-400",
  "from-indigo-500 to-blue-400",
  "from-teal-500 to-green-400",
  "from-amber-500 to-orange-400",
  "from-violet-500 to-purple-400",
  "from-fuchsia-500 to-pink-400",
  "from-emerald-500 to-teal-400",
  "from-sky-500 to-blue-400",
  "from-lime-500 to-green-400",
  "from-rose-500 to-red-400"
];

// Function to assign a gradient color based on index
const getGradientColor = (index) => {
  // Use modulo to cycle through the array if there are more items than gradients
  return gradientCombinations[index % gradientCombinations.length];
};

// Timeline data with automatically assigned gradient colors
export const LineaTSection = [
  {
    date: "10 de marzo de 1835",
    title: "Primeros Pasos",
    icon: Clock,
    // Color is now automatically assigned
    get color() { return getGradientColor(0) },
    description: "La Facultad Médica de Caracas confiere el primer título de Cirujano Dentista a Vicente Toledo.",
    fullDescription: (
      <p>
        En esta fecha histórica, la Facultad Médica de Caracas otorga el primer título de Cirujano Dentista a don
        Vicente Toledo, consagrándolo como el Patriarca de la Familia Odontológica Venezolana. Este momento marca el
        inicio formal de la odontología profesional en Venezuela.
      </p>
    ),
  },
  {
    date: "2 de noviembre de 1895",
    title: "Primeras Publicaciones",
    icon: BookOpen,
    get color() { return getGradientColor(1) },
    description: "Fundación de La Unión Dental, primera publicación especializada.",
    fullDescription: (
      <p>
        Luis María Cotton funda La Unión Dental en Valencia, la primera publicación especializada que inicia el
        período formativo del gremio odontológico venezolano. Esta publicación fue crucial para el desarrollo y la
        difusión del conocimiento odontológico en el país.
      </p>
    ),
  },
  {
    date: "10 de septiembre de 1904",
    title: "Asociación Profesional",
    icon: Users,
    get color() { return getGradientColor(2) },
    description: "Fundación de la Unión Dental Venezolana, primera asociación profesional.",
    fullDescription: (
      <p>
        Se crea la Unión Dental Venezolana, la primera asociación de su índole en el país. Esta organización sentó las
        bases para la futura organización gremial de los odontólogos venezolanos, representando un paso crucial en la
        profesionalización de la odontología.
      </p>
    ),
  },
  {
    date: "19 de marzo de 1934",
    title: "Federación Odontológica",
    icon: GlobeIcon,
    get color() { return getGradientColor(3) },
    description: "Instalación de la Federación Odontológica Venezolana en Caracas.",
    fullDescription: (
      <p>
        Se instala en Caracas la Federación Odontológica Venezolana, con el objetivo de establecer una confraternidad
        entre dentistas, defender sus intereses profesionales y representar al gremio ante instituciones nacionales e
        internacionales.
      </p>
    ),
  },
  {
    date: "24 de julio de 1940",
    title: "Reconocimiento Académico",
    icon: Award,
    get color() { return getGradientColor(4) },
    description: "Aprobación de la Ley de Educación que crea la Facultad de Odontología.",
    fullDescription: (
      <p>
        El Congreso Nacional aprueba la nueva Ley de Educación que crea la Facultad de Odontología, elevando la
        profesión a un nivel universitario y científico sin precedentes. Con esta ley, el odontólogo venezolano
        obtiene el título de Doctor y un rango académico equiparable a otras profesiones tradicionales.
      </p>
    ),
  },
  {
    date: "10 de agosto de 1944",
    title: "Fundación del Colegio",
    icon: MedalIcon,
    get color() { return getGradientColor(5) },
    description: "Instalación oficial del Colegio de Odontólogos de Venezuela.",
    fullDescription: (
      <p>
        En un acto solemne en el Paraninfo de la Universidad Central, se instala el Colegio de Odontólogos de
        Venezuela. Su misión: procurar el adelanto de la ciencia odontológica, velar por la dignidad del gremio y
        fomentar la solidaridad entre profesionales.
      </p>
    ),
  },
];
"use client"
import { Assessment, Celebration, PersonRounded, RequestQuote, Web } from "@mui/icons-material";
import Link from "next/link";

const SectionAccesD = () => {
  const accesoRapido = [
    {
      icon: <Web className="h-5 w-5" />,
      title: "Pagina Web",
      path: "/PanelControl/Inicio"
    },
    {
      icon: <Celebration className="h-5 w-5" />,
      title: "Cursos y Eventos",
      path: "/PanelControl/CursosEventos"
    },
    {
      icon: <RequestQuote className="h-5 w-5" />,
      title: "Pagos",
      path: "/PanelControl/Pagos"
    },
    {
      icon: <Assessment className="h-5 w-5" />,
      title: "Estadisticas",
      path: "/PanelControl/Estadisticas"
    },
    {
      icon: <PersonRounded className="h-5 w-5" />,
      title: "Usuarios",
      path: "/PanelControl/Usuario"
    }
  ]

  return (
    <div className="group flex flex-wrap justify-center gap-4 py-4 px-2 transition-all duration-150 hover:bg-gray-50 rounded-xl">
      {accesoRapido.map((acceso, index) => (
        <Link
          key={index}
          href={acceso.path}
          className="group/card flex flex-row items-center justify-center w-auto text-[#590248] transition-all duration-150 px-4 py-3 rounded-lg
                      group-hover:bg-white group-hover:shadow-md group-hover:border-b-3 group-hover:border-[#C40180]
                      hover:bg-gradient-to-b hover:from-[#C40180] hover:to-[#590248] hover:text-white 
                      hover:shadow-lg hover:translate-y-[-2px] hover:border-b-3 hover:border-[#C40180]"
        >
          <div className="bg-transparent rounded-full p-2 transition-all duration-150 
                          group-hover:bg-[#C40180]/10
                          group-hover:text-[#C40180]
                          group-hover/card:text-white
                          group-hover/card:bg-white/20">
            {acceso.icon}
          </div>
          <span className="text-sm font-medium ml-3 transition-all duration-150 
                            group-hover:font-semibold">
            {acceso.title}
          </span>
        </Link>
      ))}
    </div>
  )
}

export default SectionAccesD
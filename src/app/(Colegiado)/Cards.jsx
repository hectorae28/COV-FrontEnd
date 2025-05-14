"use client"

import { AssignmentInd, InfoOutlined, LibraryAddCheck, LibraryBooks, VerifiedUser } from "@mui/icons-material"
import { useEffect, useState } from "react"

export default function Cards({ isSolvent, session, selectedCardType = null, onModalOpen }) {
  const [showModal, setShowModal] = useState(false)
  const [solicitudTipo, setSolicitudTipo] = useState(null)
  const [activeCardType, setActiveCardType] = useState(selectedCardType)

  // Si se pasa un tipo de tarjeta seleccionada desde el componente padre
  useEffect(() => {
    if (selectedCardType) {
      setActiveCardType(selectedCardType)
    }
  }, [selectedCardType])

  const handleOpenModal = (tipo) => {
    setSolicitudTipo(tipo)
    setShowModal(true)

    // Si se proporciona la función onModalOpen, la llamamos para abrir el modal a nivel de página
    if (onModalOpen) {
      onModalOpen(tipo)
    }
  }

  const handleSolicitudCreada = (nuevaSolicitud) => {
    // Aquí podrías manejar la creación de la solicitud, por ejemplo, refrescando datos
    console.log("Solicitud creada:", nuevaSolicitud)
  }

  // Definición de las tarjetas para cada tipo de solicitud
  const cardDefinitions = {
    multiple: {
      title: "Solicitud Multiple",
      icon: <LibraryBooks sx={{ fontSize: 30 }} />,
      description: "Gestiona múltiples solicitudes en un solo proceso",
      color: "from-purple-600 to-blue-500",
      onClick: () => handleOpenModal("multiple"),
    },
    especializacion: {
      title: "Solicitar Especialidad",
      icon: <LibraryAddCheck sx={{ fontSize: 30 }} />,
      description: "Obtén tus documentos de Especialidad",
      color: "from-pink-500 to-orange-400",
      onClick: () => handleOpenModal("especializacion"),
    },
    constancia: {
      title: "Solicitar Constancia",
      icon: <VerifiedUser sx={{ fontSize: 30 }} />,
      description: "Certificación de status y documentos oficiales",
      color: "from-teal-400 to-emerald-500",
      onClick: () => handleOpenModal("constancia"),
    },
    carnet: {
      title: "Solicitar Carnet",
      icon: <AssignmentInd sx={{ fontSize: 30 }} />,
      description: "Procesa tu identificación institucional",
      color: "from-blue-400 to-cyan-600",
      onClick: () => handleOpenModal("carnet"),
    },
  }

  // Si hay un tipo activo, solo mostrar esa tarjeta
  return (
    <>
      <div
        className={`grid ${activeCardType ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"} gap-4 sm:gap-8 max-w-6xl mx-auto`}
      >
        {activeCardType ? (
          // Si hay un tipo activo, mostrar solo esa tarjeta con estilos especiales
          <div className="col-span-full flex justify-center items-center">
            <div className="w-full max-w-md">
              <SolicitudCard
                title={cardDefinitions[activeCardType].title}
                icon={cardDefinitions[activeCardType].icon}
                description={cardDefinitions[activeCardType].description}
                color={cardDefinitions[activeCardType].color}
                onClick={cardDefinitions[activeCardType].onClick}
                highlighted={true}
              />
            </div>
          </div>
        ) : (
          // Si no hay tipo activo, mostrar todas las tarjetas
          <>
            <SolicitudCard
              title={cardDefinitions.multiple.title}
              icon={cardDefinitions.multiple.icon}
              description={cardDefinitions.multiple.description}
              color={cardDefinitions.multiple.color}
              onClick={cardDefinitions.multiple.onClick}
            />
            <SolicitudCard
              title={cardDefinitions.especializacion.title}
              icon={cardDefinitions.especializacion.icon}
              description={cardDefinitions.especializacion.description}
              color={cardDefinitions.especializacion.color}
              onClick={cardDefinitions.especializacion.onClick}
            />
            <SolicitudCard
              title={cardDefinitions.constancia.title}
              icon={cardDefinitions.constancia.icon}
              description={cardDefinitions.constancia.description}
              color={cardDefinitions.constancia.color}
              onClick={cardDefinitions.constancia.onClick}
            />
            <SolicitudCard
              title={cardDefinitions.carnet.title}
              icon={cardDefinitions.carnet.icon}
              description={cardDefinitions.carnet.description}
              color={cardDefinitions.carnet.color}
              onClick={cardDefinitions.carnet.onClick}
            />
          </>
        )}
      </div>

      {/* El modal ahora se renderiza a nivel de página */}
    </>
  )
}

function SolicitudCard({ title, icon, description, color, onClick, highlighted = false }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`
                relative overflow-hidden bg-white rounded-xl border-0 shadow-lg
                transition-all duration-500 ease-out h-full
                ${isHovered ? "shadow-2xl translate-y-[-5px] sm:translate-y-[-10px]" : ""}
                ${highlighted ? "scale-110 shadow-xl" : ""}
            `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Fondo decorativo animado */}
      <div
        className={`
                    absolute inset-0 bg-gradient-to-br ${color} opacity-5
                    transition-all duration-500 ease-out
                    ${isHovered ? "opacity-20 scale-110" : "scale-100"}
                    ${highlighted ? "opacity-15" : ""}
                `}
      />

      <div className="relative p-4 sm:p-6 flex flex-col h-full">
        {/* Encabezado con el ícono */}
        <div className="flex items-start">
          <div
            className={`
                            flex items-center justify-center mb-4 sm:mb-8 p-2 sm:p-3 rounded-lg text-white
                            bg-gradient-to-br ${color} shadow-md
                            transition-all duration-500 ease-out
                            ${isHovered ? "scale-110 rotate-7" : "rotate-0"}
                            ${highlighted ? "scale-120" : ""}
                        `}
          >
            {icon}
          </div>
          <div className="ml-4 sm:ml-8 flex-1">
            <h2 className={`text-lg sm:text-xl font-bold text-black ${highlighted ? "text-2xl text-center" : ""}`}>
              {title}
            </h2>
            <div
              className={`h-0.5 bg-gradient-to-r ${color} mt-1 transition-all duration-500 ease-out ${isHovered || highlighted ? "w-full" : "w-0"}`}
            ></div>
          </div>
        </div>

        {/* Cuerpo de la card */}
        <div className="flex-1">
          <p className={`text-gray-600 ${highlighted ? "text-sm sm:text-base text-center" : "text-xs sm:text-sm"}`}>
            {description}
          </p>
        </div>

        {/* Pie de la card con info */}
        <div
          className={`
                        mt-4 sm:mt-6 flex items-center text-xs text-black justify-center
                        transition-all duration-500 ease-out
                        ${isHovered || highlighted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
                    `}
        >
          <InfoOutlined sx={{ fontSize: 14 }} className="mr-2" />
          <span>Click para crear tu solicitud</span>
        </div>

        {/* Botón invisible para accesibilidad */}
        <button className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label={`Abrir ${title}`} />
      </div>
    </div>
  )
}

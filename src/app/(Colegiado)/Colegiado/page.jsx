"use client"
import { fetchMe } from "@/api/endpoints/colegiado"
import DashboardLayout from "@/Components/DashboardLayout"
import SolvencyStatus from "@/Components/Solvencia/EstatusSolv"
import SolvenciaPago from "@/Components/Solvencia/PagoSolv"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Cards from "../Cards"
import Carnet from "../Carnet"
import Chat from "../Chat"
import TablaHistorial from "../Tabla"
import CrearSolicitudModal from "@/Components/Solicitudes/Solicitudes/CrearSolicitudModal"
import { colegiado } from "@/app/Models/PanelControl/Solicitudes/SolicitudesColegiadosData"

export default function Home() {
  const [activeTab, setActiveTab] = useState("solicitudes")
  const [showSolvencyWarning, setShowSolvencyWarning] = useState(false)
  const [showTabs, setShowTabs] = useState(true)
  const [userInfo, setUser_info] = useState(null)
  const { data: session, status } = useSession()
  const [isSolvent, setIsSolvent] = useState(true)
  // Estado para controlar el tipo de solicitud seleccionado
  const [selectedSolicitudType, setSelectedSolicitudType] = useState(null)

  // Estado para controlar el modal a nivel de página
  const [showModal, setShowModal] = useState(false)
  const [solicitudTipo, setSolicitudTipo] = useState(null)

  // Función para capturar el tipo de solicitud seleccionado desde las URLs
  useEffect(() => {
    // Verificar si hay un parámetro de tipo en la URL
    const queryParams = new URLSearchParams(window.location.search)
    const tipoParam = queryParams.get("tipo")

    if (tipoParam && ["multiple", "constancia", "carnet", "especializacion"].includes(tipoParam)) {
      setSelectedSolicitudType(tipoParam)
    }
  }, [])

  // Calcular estado de solvencia basado en la fecha actual y la fecha de vencimiento
  useEffect(() => {
    if (status === "loading") return
    const checkSolvencyStatus = () => {
      const today = new Date()
      const [day, month, year] = solvencyInfo.date.split("-").map(Number)
      const solvencyDate = new Date(year, month - 1, day)

      const warningDate = new Date(solvencyDate)
      warningDate.setDate(warningDate.getDate() - 14)

      if (today > solvencyDate) {
        setIsSolvent(false)
      } else if (today >= warningDate) {
        setShowSolvencyWarning(true)
      } else {
        setShowSolvencyWarning(false)
      }
    }
    if (userInfo) {
      checkSolvencyStatus()
    }

    const intervalId = setInterval(checkSolvencyStatus, 86400000) // 24 horas

    if (session) {
      fetchMe(session)
        .then((response) => {
          setUser_info(response.data)
        })
        .catch((error) => console.log(error))
    }
    return () => clearInterval(intervalId)
  }, [session, status])

  const solvencyInfo = {
    date: userInfo?.solvente,
    amount: "7.00",
  }

  // Manejar clic en botón de pago
  const handlePayClick = () => {
    setActiveTab("solvencia")
  }

  // Función para volver al estado inicial (mostrar todas las solicitudes)
  const handleBackToAllSolicitudes = () => {
    setSelectedSolicitudType(null)

    // Actualizar la URL sin el parámetro tipo
    const url = new URL(window.location)
    url.searchParams.delete("tipo")
    window.history.pushState({}, "", url)
  }

  // Función para abrir el modal desde Cards
  const handleOpenModal = (tipo) => {
    setSolicitudTipo(tipo)
    setShowModal(true)
  }

  // Función para manejar la creación de solicitud
  const handleSolicitudCreada = (nuevaSolicitud) => {
    console.log("Solicitud creada:", nuevaSolicitud)
    // Aquí podrías agregar lógica adicional después de crear una solicitud
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout
      solvencyInfo={solvencyInfo.date}
      isSolvent={isSolvent}
      showSolvencyWarning={showSolvencyWarning}
      userInfo={userInfo}
      session={session}
    >
      {/* Contenido principal sin pestañas cuando el usuario está completamente solvente */}
      {!showTabs ? (
        <>
          {/* Sección principal con Cards y Carnet - responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 gap-8">
            {/* Sección de tarjetas (8/12 del ancho en xl, distribución variable en otros tamaños) */}
            <div className="md:col-span-2 lg:col-span-2 xl:col-span-8 flex items-center">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm h-full w-full">
                {selectedSolicitudType && (
                  <div className="mb-4">
                    <button
                      onClick={handleBackToAllSolicitudes}
                      className="text-[#D7008A] hover:underline flex items-center text-sm"
                    >
                      ← Volver a todas las solicitudes
                    </button>
                  </div>
                )}
                <Cards
                  isSolvent={isSolvent}
                  session={session}
                  selectedCardType={selectedSolicitudType}
                  onModalOpen={handleOpenModal}
                />
              </div>
            </div>
            {/* Sección de carnet (4/12 del ancho en xl) */}
            <div className="md:col-span-2 lg:col-span-1 xl:col-span-4">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm h-full">
                <Carnet />
              </div>
            </div>
          </div>
          {/* Sección de tabla (12/12 del ancho total) */}
          <div className="bg-white/50 rounded-2xl p-4 sm:p-6 shadow-sm">
            <TablaHistorial isSolvent={isSolvent} />
          </div>
        </>
      ) : (
        <>
          {/* Pestañas de navegación cuando se necesitan mostrar */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab("solicitudes")
              }}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "solicitudes"
                  ? "text-[#D7008A] border-b-2 border-[#D7008A]"
                  : "text-gray-500 hover:text-[#41023B]"
              }`}
            >
              Panel Principal
            </button>

            <button
              onClick={() => setActiveTab("solvencia")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "solvencia"
                  ? "text-[#D7008A] border-b-2 border-[#D7008A]"
                  : "text-gray-500 hover:text-[#41023B]"
              }`}
            >
              Pago de Solvencia
            </button>
          </div>

          {/* Contenido según la pestaña activa */}
          {activeTab === "solicitudes" ? (
            <>
              {/* Estado de Solvencia (solo si no está solvente o está por vencer) */}
              {(!isSolvent || showSolvencyWarning) && (
                <SolvencyStatus
                  isSolvent={isSolvent}
                  solvencyDate={solvencyInfo.date}
                  solvencyAmount={solvencyInfo.amount}
                  onPayClick={handlePayClick}
                  isExpiringSoon={showSolvencyWarning && isSolvent}
                />
              )}

              {/* Sección principal con Cards y Carnet - responsive */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 gap-8">
                {/* Sección de tarjetas */}
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-8 flex items-center">
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm h-full w-full">
                    {selectedSolicitudType && (
                      <div className="mb-4">
                        <button
                          onClick={handleBackToAllSolicitudes}
                          className="text-[#D7008A] hover:underline flex items-center text-sm"
                        >
                          ← Volver a todas las solicitudes
                        </button>
                      </div>
                    )}
                    <Cards
                      isSolvent={isSolvent}
                      session={session}
                      selectedCardType={selectedSolicitudType}
                      onModalOpen={handleOpenModal}
                    />
                  </div>
                </div>
                {/* Sección de carnet */}
                <div className="md:col-span-2 lg:col-span-1 xl:col-span-4">
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm h-full">
                    <Carnet />
                  </div>
                </div>
              </div>
              {/* Sección de tabla */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm">
                <TablaHistorial isSolvent={isSolvent} />
              </div>
            </>
          ) : null}

          {/* Página de Pago de Solvencia */}
          {activeTab === "solvencia" && <SolvenciaPago />}
        </>
      )}

      {/* Modal para crear solicitud - renderizado a nivel de página */}
      {showModal && (
        <CrearSolicitudModal
          onClose={() => setShowModal(false)}
          onSolicitudCreada={handleSolicitudCreada}
          colegiadoPreseleccionado={colegiado}
          mostrarSeleccionColegiado={false}
          session={session}
          tipoSolicitud={solicitudTipo}
        />
      )}

      <Chat />
    </DashboardLayout>
  )
}

"use client";
import { fetchMe } from "@/api/endpoints/colegiado";
import { fetchDataSolicitudes } from "@/api/endpoints/landingPage";
import SolvencyStatus from "@/Components/Solvencia/EstatusSolv";
import SolvenciaPago from "@/Components/Solvencia/PagoSolv";
import CrearSolicitudModal from "@/Components/Solicitudes/Solicitudes/CrearSolicitudModal"
import useColegiadoUserStore from "@/store/colegiadoUserStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Cards from "../Cards";
import Carnet from "../Carnet";
import Chat from "../Chat";
import TablaHistorial from "../Tabla";

export default function Home() {
  const [activeTab, setActiveTab] = useState("solicitudes"); // 'solicitudes', 'solvencia'
  const [showSolicitudForm, setShowSolicitudForm] = useState(false);
  const [showSolvencyWarning, setShowSolvencyWarning] = useState(false); // Estado para la advertencia
  const [showTabs, setShowTabs] = useState(true); // Estado para mostrar/ocultar pestañas
  const [userInfo, setUserInfo] = useState(null);
  const { data: session, status } = useSession();
  const [isSolvent, setIsSolvent] = useState(true); // Estado de solvencia
  const [solvencyInfo, setSolvencyInfo] = useState(null);
  const [selectedSolicitudType, setSelectedSolicitudType] = useState(null)
  // Datos de solvencia
  const setColegiadoUser = useColegiadoUserStore((state) => state.setColegiadoUser);
  const setCostos = useColegiadoUserStore((state) => state.setCostos);
  const setTasaBcv = useColegiadoUserStore((state) => state.setTasaBcv);
  const colegiadoUser = useColegiadoUserStore((state) => state.colegiadoUser);

  const checkSolvencyStatus = () => {
    if (!colegiadoUser) return;
    
    const today = new Date();
    const [year, month, day] = colegiadoUser?.solvente.split("-").map(Number);
    const solvencyDate = new Date(year, month - 1, day);

    const warningDate = new Date(solvencyDate);
    warningDate.setDate(warningDate.getDate() - 14);

    setShowSolvencyWarning(today >= warningDate);
  };

  async function fetchCostos() {
  try {
    const response = await fetchDataSolicitudes("costo", "?es_vigente=true");
    const costosData = response.data;
    const costo = Number(
      costosData.filter(
        (item) => item.tipo_costo_nombre === "Solvencia"
      )[0].monto_usd
    );
    setCostos(costosData);
    return costo; // Return the Solvencia cost for potential use elsewhere
  } catch (error) {
    console.error("Error fetching costos:", error);
  }
}

// Separate method for fetching tasa BCV
async function fetchTasaBcv() {
  try {
    const response = await fetchDataSolicitudes("tasa-bcv");
    const tasaBcvData = Number(response.data.rate);
    setTasaBcv(tasaBcvData);
  } catch (error) {
    console.error("Error fetching tasa BCV:", error);
  }
}

// Separate method for fetching user data and solvency info
async function fetchUserAndSolvency() {
  try {
    if (!session) return;
    
    const userResponse = await fetchMe(session);
    const userData = userResponse.data;
    
    setUserInfo(userData);
    setColegiadoUser(userData);
    setIsSolvent(userData.solvencia_status);
    
    // Get costos from the store to calculate solvency amount
    const costos = useColegiadoUserStore.getState().costos;
    const costo = costos?.find(
      (item) => item.tipo_costo_nombre === "Solvencia"
    )?.monto_usd;
    
    setSolvencyInfo({
      date: userData.solvente,
      amount: Number(costo),
      status: userData.solvencia_status,
    });

    checkSolvencyStatus();
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

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
    const loadUserData = async () => {
      // Fetch costos and tasa-bcv in parallel
      await Promise.all([fetchCostos(), fetchTasaBcv()]);
      // Fetch user data after costos are available
      await fetchUserAndSolvency();
    };

    if (session) {
      loadUserData();
    }
  }, [session, status]);

  useEffect(() => {
    fetchUserAndSolvency();
  }, [useColegiadoUserStore((state) => state.colegiadoUser?.solvente)]);

  const handleCardClick = (cardId) => {
    if (cardId === "multiple") {
      setShowSolicitudForm(true);
    }
  };

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
    // <DashboardLayout
    //   isSolvent={isSolvent}
    //   showSolvencyWarning={showSolvencyWarning}
    //   userInfo={userInfo}
    // 
    <>
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
            {(!isSolvent || showSolvencyWarning) && 
              <button
                onClick={() => {
                  setActiveTab("solicitudes");
                  setShowSolicitudForm(false);
                }}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "solicitudes"
                    ? "text-[#D7008A] border-b-2 border-[#D7008A]"
                    : "text-gray-500 hover:text-[#41023B]"
                }`}
              >
                Panel Principal
              </button>
            }
            

            {(!isSolvent || showSolvencyWarning) && 
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
            }            
          </div>

          {/* Contenido según la pestaña activa */}
          {activeTab === "solicitudes" ? (
            <>
              {/* Estado de Solvencia (solo si no está solvente o está por vencer) */}
              {(!isSolvent || showSolvencyWarning) && (
                <SolvencyStatus
                  solvencyAmount={colegiadoUser?.costo_de_solvencia}
                  onPayClick={handlePayClick}
                  isExpiringSoon={showSolvencyWarning}
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
          {activeTab === "solvencia" && <SolvenciaPago props={{ setActiveTab }} />}
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
      {/* </DashboardLayout> */}
      </>
  )
}

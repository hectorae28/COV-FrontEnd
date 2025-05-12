"use client";
import { fetchMe } from "@/api/endpoints/colegiado";
import SolicitudesForm from "@/Components/Cards/MultipleSol/FormMult";
import DashboardLayout from "@/Components/DashboardLayout";
import SolvencyStatus from "@/Components/Solvencia/EstatusSolv";
import SolvenciaPago from "@/Components/Solvencia/PagoSolv";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Cards from "../Cards";
import Carnet from "../Carnet";
import Chat from "../Chat";
import TablaHistorial from "../Tabla";
import { fetchDataSolicitudes } from "@/api/endpoints/landingPage";
import useColegiadoUserStore from "@/utils/colegiadoUserStore";

export default function Home() {
  const [activeTab, setActiveTab] = useState("solicitudes"); // 'solicitudes', 'solvencia'
  const [showSolicitudForm, setShowSolicitudForm] = useState(false);
  const [showSolvencyWarning, setShowSolvencyWarning] = useState(false); // Estado para la advertencia
  const [showTabs, setShowTabs] = useState(true); // Estado para mostrar/ocultar pestañas
  const [userInfo, setUserInfo] = useState(null);
  const { data: session, status } = useSession();
  const [isSolvent, setIsSolvent] = useState(false); // Estado de solvencia
  const [solvencyInfo, setSolvencyInfo] = useState({
    date: session?.user.solvente,
    amount: "7.00",
    status: session?.user?.solvenciaStatus,
  }); // Datos de solvencia
  // Datos de solvencia
  const setColegiadoUser = useColegiadoUserStore((state) => state.setColegiadoUser);
  const setCostos = useColegiadoUserStore((state) => state.setCostos);
  const setTasaBcv = useColegiadoUserStore((state) => state.setTasaBcv);
  const colegiadoUser = useColegiadoUserStore((state) => state.colegiadoUser);

  const checkSolvencyStatus = () => {
    if (!colegiadoUser) return;
    
    const today = new Date();
    const [year, month, day] = colegiadoUser.solvente.split("-").map(Number);
    const solvencyDate = new Date(year, month - 1, day);

    const warningDate = new Date(solvencyDate);
    warningDate.setDate(warningDate.getDate() - 14);

    setShowSolvencyWarning(today >= warningDate);
  };

  async function fetchCostosAndUserData() {
    try {
      // Se asume que fetchDataSolicitudes y fetchMe son funciones existentes en tu proyecto
      const costoResponse = await fetchDataSolicitudes("costo", `?es_vigente=true`);
      const tasaBcvResponse = await fetchDataSolicitudes("tasa-bcv");
      const costosData = costoResponse.data;
      // Obtén el costo filtrando por "Solvencia"
      const costo = Number(
        costosData.filter(
          (item) => item.tipo_costo_nombre === "Solvencia"
        )[0].monto_usd
      );
      setCostos(costosData);
      setTasaBcv(Number(tasaBcvResponse.data.rate))

      const userResponse = await fetchMe(session);
      const userData = userResponse.data;
      setUserInfo(userData);
      setColegiadoUser(userData);
      setIsSolvent(userData.solvencia_status);
      setSolvencyInfo({
        date: userData.solvente,
        amount: costo,
        status: userData.solvencia_status,
      });

      if (userData) {
        checkSolvencyStatus();
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }

  // Calcular estado de solvencia basado en la fecha actual y la fecha de vencimiento
  useEffect(() => {
    const intervalId = setInterval(checkSolvencyStatus, 86400000); // 24h check

    if (session) {
      fetchCostosAndUserData();
    }

    return () => clearInterval(intervalId);
  }, [session, status]);

  useEffect(() => {
    checkSolvencyStatus();
  }, [useColegiadoUserStore((state) => state.colegiadoUser.solvente)]);

  const handleCardClick = (cardId) => {
    if (cardId === "multiple") {
      setShowSolicitudForm(true);
    }
  };

  // Manejar clic en botón de pago
  const handlePayClick = () => {
    setActiveTab("solvencia");
  };

  // Manejar retorno al panel principal
  const handleBackToPanel = () => {
    setShowSolicitudForm(false);
  };
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout
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
                <Cards isSolvent={isSolvent} onCardClick={handleCardClick} />
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
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm">
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
          {activeTab === "solicitudes" && !showSolicitudForm ? (
            <>
              {/* Estado de Solvencia (solo si no está solvente o está por vencer) */}
              {(!isSolvent || showSolvencyWarning) && (
                <SolvencyStatus
                  solvencyAmount={solvencyInfo.amount}
                  onPayClick={handlePayClick}
                  isExpiringSoon={showSolvencyWarning}
                />
              )}

              {/* Sección principal con Cards y Carnet - responsive */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 gap-8">
                {/* Sección de tarjetas */}
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-8 flex items-center">
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm h-full w-full">
                    <Cards
                      isSolvent={isSolvent}
                      onCardClick={handleCardClick}
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

          {/* Formulario de Solicitud Múltiple */}
          {activeTab === "solicitudes" && showSolicitudForm && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <SolicitudesForm
                  initialSolicitudTipo="multiple"
                  onCancel={handleBackToPanel}
                />
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl overflow-hidden shadow-md h-full">
                  <div className="bg-gradient-to-b from-[#41023B] to-[#D7008A] p-4">
                    <h2 className="text-white font-semibold text-lg">
                      Información
                    </h2>
                  </div>
                  <div className="p-5">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[#41023B]">
                        Tipos de Solicitudes:
                      </h3>

                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-[#D7008A]">
                            Constancia
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Documento que certifica su inscripción y estado de
                            solvencia con la institución.
                          </p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-[#D7008A]">Carnet</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Credencial oficial que lo identifica como miembro
                            activo del Colegio de Odontólogos.
                          </p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-[#D7008A]">
                            Especialidad
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Certificación de especialidades odontológicas
                            reconocidas por el Colegio.
                          </p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-[#D7008A]">
                            Múltiple
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Permite solicitar varios documentos en un solo
                            proceso, ahorrando tiempo y gestiones.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Página de Pago de Solvencia */}
          {activeTab === "solvencia" && <SolvenciaPago />}
        </>
      )}

      <Chat />
    </DashboardLayout>
  );
}

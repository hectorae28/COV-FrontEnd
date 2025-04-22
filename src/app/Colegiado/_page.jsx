"use client";
import { useState, useEffect } from "react";
import SolicitudesForm from "@/Components/Cards/MultipleSol/FormMult";
import SolvencyStatus from "@/Components/Solvencia/EstatusSolv";
import SolvenciaPago from "@/Components/Solvencia/PagoSolv";
import DashboardLayout from "@/Components/DashboardLayout";
import { useSession } from "next-auth/react";
import { fetchMe } from "@/api/endpoints/colegiado";
import Cards from "./Components/Cards";
import Carnet from "./Components/Carnet";
import Chat from "./Components/Chat";
import TablaHistorial from "./Components/Tabla";

export default function Home() {
  const [activeTab, setActiveTab] = useState("solicitudes"); // 'solicitudes', 'solvencia'
  const [showSolicitudForm, setShowSolicitudForm] = useState(false);
  const [userInfo, setUser_info] = useState(null);
  const { data: session, status } = useSession();
  const [isSolvent, setIsSolvent] = useState(true); // Estado de solvencia
  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      fetchMe(session)
        .then((response) => {
          setUser_info(response.data);
        })
        .catch((error) => console.log(error));
      const fechaExpiracion = new Date(session.user.solvente);
      setIsSolvent(fechaExpiracion >= new Date());
    }
  }, [session, status]);
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  // Datos de solvencia
  const solvencyInfo = {
    date: session?.user.solvente,
    amount: "7.00",
  };

  // Manejar clic en card
  const handleCardClick = (cardId) => {
    if (cardId === "multiple") {
      setShowSolicitudForm(true);
    }
  };

  // Manejar clic en botón de pago
  const handlePayClick = () => {
    setActiveTab("solvencia");
  };

  // Alternar estado de solvencia (solo para demostración)
  const toggleSolvencyStatus = () => {
    setIsSolvent(!isSolvent);
  };

  // Manejar retorno al panel principal
  const handleBackToPanel = () => {
    setShowSolicitudForm(false);
  };

  return (
    <DashboardLayout
      solvencyInfo={solvencyInfo.date}
      isSolvent={isSolvent}
      userInfo={userInfo}
    >
      {/* Pestañas de navegación */}
      <div className="flex border-b border-gray-200">
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

      {/* Contenido de la pestaña activa */}
      {activeTab === "solicitudes" && !showSolicitudForm && (
        <>
          {/* Estado de Solvencia (solo si no está solvente) */}
          {!isSolvent && (
            <SolvencyStatus
              isSolvent={isSolvent}
              solvencyDate={solvencyInfo.date}
              solvencyAmount={solvencyInfo.amount}
              onPayClick={handlePayClick}
            />
          )}

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
      )}

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
                      <h4 className="font-medium text-[#D7008A]">Constancia</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Documento que certifica su inscripción y estado de
                        solvencia con la institución.
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-[#D7008A]">Carnet</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Credencial oficial que lo identifica como miembro activo
                        del Colegio de Odontólogos.
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
                      <h4 className="font-medium text-[#D7008A]">Múltiple</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Permite solicitar varios documentos en un solo proceso,
                        ahorrando tiempo y gestiones.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "solvencia" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-1">
            <SolvenciaPago />
          </div>
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl overflow-hidden shadow-md h-full">
              <div className="bg-gradient-to-b from-[#41023B] to-[#D7008A] p-4">
                <h2 className="text-white font-semibold text-lg">
                  Información
                </h2>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    La solvencia del Colegio de Odontólogos de Venezuela es un
                    requisito indispensable para el ejercicio profesional.
                  </p>
                  <h3 className="font-semibold text-[#41023B]">Requisitos:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Estar inscrito en el Colegio de Odontólogos</li>
                    <li>Tener al día el pago de sus cuotas</li>
                    <li>Realizar el pago correspondiente</li>
                  </ul>
                  <p className="text-gray-700">
                    <strong>Nota importante:</strong> El pago de solvencia solo
                    puede realizarse con un máximo de dos semanas de
                    anticipación a la fecha actual.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Chat />

      {/* Botón de demostración para alternar estado de solvencia */}
      <div className="flex justify-end">
        <button
          onClick={toggleSolvencyStatus}
          className={`text-xs py-1 px-3 rounded ${
            isSolvent
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {isSolvent ? "Demostrar No Solvente" : "Demostrar Solvente"}
        </button>
      </div>
    </DashboardLayout>
  );
}

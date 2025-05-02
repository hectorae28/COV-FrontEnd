"use client";

import { ArrowLeft, ArrowRight, CheckCircle, UserPlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";

// Import components and data store
import { fetchDataSolicitudes } from "@/api/endpoints/landingPage";
import DocsRequirements from "@/app/(Registro)/DocsRequirements";
import InfoColegiado from "@/app/(Registro)/InfoColg";
import InfoContacto from "@/app/(Registro)/InfoCont";
import InfoLaboral from "@/app/(Registro)/InfoLab";
import InfoPersonal from "@/app/(Registro)/InfoPers";
import PagosColg from "@/app/Components/PagosModal";
import ListaColegiadosData from "@/app/Models/PanelControl/Solicitudes/ListaColegiadosData";

export default function RegistroColegiados({
  isAdmin = true,
  onClose,
  onRegistroExitoso,
}) {
  // Get methods from Zustand store
  const addColegiadoPendiente = ListaColegiadosData(state => state.addColegiadoPendiente);

  // Estado para seguimiento de pasos
  const [pasoActual, setPasoActual] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exonerarPagos, setExonerarPagos] = useState(false);
  const [pagarLuego, setPagarLuego] = useState(false);
  const [tazaBcv, setTazaBcv] = useState(0);
  const [costoInscripcion, setCostoInscripcion] = useState(0);
  const [metodoPago, setMetodoPago] = useState([]);
  const initialState = {
    nationality: "",
    identityCard: "",
    firstName: "",
    lastName: "",
    birthPlace: "",
    birthDate: "",
    gender: "",
    age: "",
    maritalStatus: "",
    email: "",
    phoneNumber: "",
    homePhone: "",
    address: "",
    city: "",
    collegeNumber: "",
    professionalField: "",
    institutionName: "",
    institutionAddress: "",
    institutionPhone: "",
    clinicName: "",
    clinicAddress: "",
    clinicPhone: "",
    selectedOption: "",
    graduateInstitute: "",
    universityTitle: "",
    mainRegistrationNumber: "",
    mainRegistrationDate: "",
    mppsRegistrationNumber: "",
    mppsRegistrationDate: "",
    titleIssuanceDate: "",
    state: "",
    ci: {},
    rif: {},
    titulo: {},
    mpps: {},
  };

  // Estado para los datos del formulario
  const [formData, setFormData] = useState(initialState);

  // Función para actualizar datos del formulario
  const handleInputChange = (data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Función para manejar cambios en documentos
  const handleDocumentosChange = (docs) => {
    setFormData((prev) => ({
      ...prev,
      documentos: {
        ...prev.documentos,
        ...docs,
      },
    }));
  };

  // Marcamos un paso como completado
  const marcarPasoCompletado = (paso) => {
    if (!completedSteps.includes(paso)) {
      setCompletedSteps((prev) => [...prev, paso]);
    }
  };

  // Función para avanzar al siguiente paso sin validaciones
  const avanzarPaso = () => {
    // Marcamos el paso actual como completado
    marcarPasoCompletado(pasoActual);

    // Si estamos en el paso 5 (documentos), pasamos directamente a pagos (paso 6)
    if (pasoActual === 5) {
      setPasoActual(6);
    } else if (pasoActual < 5) {
      // Para los pasos 1-4, avanzamos normalmente
      setPasoActual(pasoActual + 1);
    }
  };

  // Función para retroceder al paso anterior
  const retrocederPaso = () => {
    setPasoActual(Math.max(1, pasoActual - 1));
  };

  // Función para reiniciar el formulario y comenzar un nuevo registro
  const iniciarNuevoRegistro = () => {
    // Reiniciamos todos los estados
    setPasoActual(1);
    setCompletedSteps([]);
    setExonerarPagos(false);
    setPagarLuego(false);
    setFormData(initialState);
  };

  // Manejar cambio de exonerar pagos
  const handleExonerarPagosChange = (e) => {
    const isChecked = e.target.checked;
    setExonerarPagos(isChecked);

    // Si se activa exonerar pagos, desactivamos pagar luego
    if (isChecked) {
      setPagarLuego(false);
    }
  };

  // Manejar cambio de pagar luego
  const handlePagarLuegoChange = (e) => {
    const isChecked = e.target.checked;
    setPagarLuego(isChecked);

    // Si se activa pagar luego, desactivamos exonerar pagos
    if (isChecked) {
      setExonerarPagos(false);
    }
  };

  // Función para manejar la finalización del registro
  const handlePaymentComplete = async () => {
    setIsSubmitting(true);

    try {
      // Preparar los datos para el nuevo colegiado pendiente
      const nombre = `${formData.firstName} ${formData.lastName}`;

      // Convertir datos del formulario al formato esperado por ListaColegiadosData
      const nuevoPendiente = {
        id: `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        nombre: nombre,
        cedula: `${formData.nationality}-${formData.identityCard}`,
        email: formData.email,
        telefono: formData.phoneNumber,
        fechaSolicitud: new Date().toLocaleDateString(),
        documentosCompletos: true,

        // Detailed data
        persona: {
          nombre: formData.firstName,
          segundo_nombre: "",
          primer_apellido: formData.lastName,
          segundo_apellido: "",
          genero: formData.gender === "M" ? "M" : "F",
          tipo_identificacion: formData.nationality,
          identificacion: formData.identityCard,
          correo: formData.email,
          id_adicional: "",
          telefono_movil: formData.phoneNumber,
          telefono_de_habitacion: formData.homePhone || "",
          fecha_de_nacimiento: formData.birthDate,
          estado_civil: formData.maritalStatus,
          direccion: {
            referencia: formData.address,
            estado: formData.state
          },
          user: null
        },
        instituto_bachillerato: formData.graduateInstitute,
        universidad: formData.universityTitle,
        fecha_egreso_universidad: formData.titleIssuanceDate,
        num_registro_principal: formData.mainRegistrationNumber,
        fecha_registro_principal: formData.mainRegistrationDate,
        num_mpps: formData.mppsRegistrationNumber,
        fecha_mpps: formData.mppsRegistrationDate,
        instituciones: [
          formData.institutionName ? {
            nombre: formData.institutionName,
            cargo: formData.professionalField,
            direccion: formData.institutionAddress,
            telefono: formData.institutionPhone,
          } : null,
          formData.clinicName ? {
            nombre: formData.clinicName,
            cargo: formData.professionalField,
            direccion: formData.clinicAddress,
            telefono: formData.clinicPhone,
          } : null
        ].filter(Boolean), // Remove null values

        // Files (using provided data or empty strings)
        file_ci: formData.ci?.name || "",
        file_rif: formData.rif?.name || "",
        file_fondo_negro: formData.titulo?.name || "",
        file_mpps: formData.mpps?.name || "",

        // Add observation about payment status
        observaciones: exonerarPagos
          ? "Colegiado exonerado de pagos por administración"
          : pagarLuego
            ? "Pago pendiente. Se debe procesar posteriormente."
            : "Solicita inscripción en el Colegio de Odontólogos de Venezuela. Pago procesado.",

        // Convert document objects to the expected format for the store
        documentos: [
          {
            id: "file_ci",
            nombre: "Cédula de identidad",
            descripcion: "Copia escaneada por ambos lados",
            archivo: formData.ci?.name || "",
            requerido: true,
          },
          {
            id: "file_rif",
            nombre: "RIF",
            descripcion: "Registro de Información Fiscal",
            archivo: formData.rif?.name || "",
            requerido: true,
          },
          {
            id: "file_fondo_negro",
            nombre: "Título universitario fondo negro",
            descripcion: "Título de Odontólogo con fondo negro",
            archivo: formData.titulo?.name || "",
            requerido: true,
          },
          {
            id: "file_mpps",
            nombre: "Registro MPPS",
            descripcion: "Registro del Ministerio del Poder Popular para la Salud",
            archivo: formData.mpps?.name || "",
            requerido: true,
          },
          {
            id: "comprobante_pago",
            nombre: "Comprobante de pago",
            descripcion: "Comprobante de pago de inscripción",
            archivo: "comprobante_pago.pdf",
            requerido: true,
          }
        ]
      };

      // Add the pending member to the central store
      addColegiadoPendiente(nuevoPendiente);

      // Clean up files from formData to avoid circular references
      const cleanNuevoPendiente = { ...nuevoPendiente };
      delete cleanNuevoPendiente.ci;
      delete cleanNuevoPendiente.rif;
      delete cleanNuevoPendiente.titulo;
      delete cleanNuevoPendiente.mpps;

      // Llamamos a la función de registro exitoso del componente padre
      if (typeof onRegistroExitoso === 'function') {
        onRegistroExitoso(cleanNuevoPendiente);
      }

      // Avanzamos al paso de confirmación
      setPasoActual(7);
    } catch (error) {
      console.error("Error al registrar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const LoadData = async () => {
      try {
        const taza = await fetchDataSolicitudes("tasa-bcv");
        setTazaBcv(taza.data.rate);
        const costo = await fetchDataSolicitudes(
          "costo",
          "?tipo_costo=1&es_vigente=true"
        );
        setCostoInscripcion(Number(costo.data[0].monto_usd));
        const Mpagos = await fetchDataSolicitudes("metodo-de-pago");
        setMetodoPago(Mpagos.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    LoadData();
  }, []);

  // Renderizar paso actual
  const renderPasoActual = () => {
    switch (pasoActual) {
      case 1:
        return (
          <InfoPersonal formData={formData} onInputChange={handleInputChange} />
        );
      case 2:
        return (
          <InfoContacto formData={formData} onInputChange={handleInputChange} />
        );
      case 3:
        return (
          <InfoColegiado
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 4:
        return (
          <InfoLaboral formData={formData} onInputChange={handleInputChange} />
        );
      case 5:
        return (
          <DocsRequirements
            formData={formData}
            onInputChange={handleDocumentosChange}
          />
        );
      case 6:
        return (
          <div className="space-y-6">
            {!exonerarPagos && !pagarLuego && (
              <PagosColg
                props={{
                  handlePaymentComplete,
                  costo: costoInscripcion,
                  metodoPago,
                }}
              />
            )}

            {isAdmin && (
              <div className="flex flex-col space-y-4 mt-6">
                {!pagarLuego && (
                  <div className="p-4 bg-[#41023B]/20 rounded-xl border border-[#41023B]">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exonerarPagos}
                        onChange={handleExonerarPagosChange}
                        className="h-5 w-5 text-[#D7008A] focus:ring-[#41023B] focus:bg-[#D7008A] rounded"
                      />
                      <p className="text-md text-gray-800">
                        <span className="text-[#41023B] font-bold text-lg">
                          Exonerar pagos:
                        </span>{" "}
                        Al habilitar esta opción, el colegiado quedará registrado como solvente sin necesidad de realizar un pago.
                      </p>
                    </label>
                  </div>
                )}

                {!exonerarPagos && (
                  <div className="p-4 bg-[#41023B]/20 rounded-xl border border-[#41023B]">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pagarLuego}
                        onChange={handlePagarLuegoChange}
                        className="h-5 w-5 text-[#D7008A] focus:ring-[#41023B] focus:bg-[#D7008A] rounded"
                      />
                      <p className="text-md text-gray-800">
                        <span className="text-[#41023B] font-bold text-lg">
                          Pagar luego:
                        </span>{" "}
                        Al habilitar esta opción, el colegiado quedará registrado con pago pendiente y podrá completarlo posteriormente.
                      </p>
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 7:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-r from-[#D7008A] to-[#41023B] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#41023B] mb-4">
              ¡Registro Completado!
            </h2>
            <p className="text-gray-800 mb-8">
              El colegiado ha sido registrado exitosamente en el sistema.
              {pagarLuego && (
                <span className="block mt-2 text-amber-600 font-medium">
                  Nota: El colegiado tiene pendiente realizar el pago de inscripción.
                </span>
              )}
            </p>
            <button
              onClick={iniciarNuevoRegistro}
              className="px-8 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
            >
              <UserPlus size={20} />
              ¿Quieres Registrar otro colegiado?
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // Títulos de los pasos (completos)
  const titulosPasos = [
    "Información Personal",
    "Información de Contacto",
    "Información Profesional",
    "Información Laboral",
    "Documentos Requeridos",
    "Pagos",
    "Confirmación",
  ];

  // Títulos para mostrar en el indicador de pasos (divididos en dos líneas excepto para documentos)
  const getTituloIndicador = (paso) => {
    switch (paso) {
      case 1:
        return (
          <div className="flex flex-col items-center text-center">
            <span className="text-xs leading-tight">Información</span>
            <span className="text-xs leading-tight">Personal</span>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center text-center">
            <span className="text-xs leading-tight">Información</span>
            <span className="text-xs leading-tight">Contacto</span>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center text-center">
            <span className="text-xs leading-tight">Información</span>
            <span className="text-xs leading-tight">Profesional</span>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center text-center">
            <span className="text-xs leading-tight">Información</span>
            <span className="text-xs leading-tight">Laboral</span>
          </div>
        );
      case 5:
        return <span className="text-xs">Documentos</span>;
      default:
        return null;
    }
  };

  // Determinar si mostrar el encabezado con los pasos (no se muestra en la pantalla de pagos o confirmación)
  const mostrarEncabezadoPasos = pasoActual <= 5;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        {/* Header con Título y Botón de Cerrar */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold text-[#41023B]">
            Registrar nuevo colegiado
            {pasoActual <= 6 && (
              <span className="ml-2 text-sm text-gray-500">
                {pasoActual &&
                  `• Paso ${pasoActual}: ${titulosPasos[pasoActual - 1]}`}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[#41023B] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Indicador de pasos - Solo visible hasta el paso 5 */}
        {mostrarEncabezadoPasos && (
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-6">
              {/* Pasos de 1 a 5 */}
              {[1, 2, 3, 4, 5].map((paso, index) => (
                <React.Fragment key={paso}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full 
                    ${completedSteps.includes(paso)
                          ? "bg-[#41023B] text-white"
                          : pasoActual === paso
                            ? "bg-[#D7008A] text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {completedSteps.includes(paso) ? (
                        <CheckCircle size={18} />
                      ) : (
                        paso
                      )}
                    </div>
                    {/* Aquí usamos la función para mostrar el título dividido */}
                    <div className="mt-1 min-h-10">
                      {getTituloIndicador(paso)}
                    </div>
                  </div>

                  {index < 4 && (
                    <div
                      className={`h-1 flex-1 mx-1 ${completedSteps.includes(paso)
                        ? "bg-[#41023B]"
                        : "bg-gray-200"
                        }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Contenido del paso actual */}
        <div className="p-6">{renderPasoActual()}</div>

        {/* Botones de navegación */}
        {pasoActual !== 7 && pasoActual !== 6 && (
          <div className="flex justify-between p-6 border-t bg-gray-50">
            {pasoActual > 1 ? (
              <button
                type="button"
                onClick={retrocederPaso}
                className="flex items-center gap-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={16} />
                Anterior
              </button>
            ) : (
              <div></div>
            )}

            {pasoActual < 5 ? (
              <button
                type="button"
                onClick={avanzarPaso}
                className="flex items-center gap-1 px-4 py-2 bg-[#D7008A] text-white rounded-lg hover:bg-[#590248] transition-colors"
              >
                Siguiente
                <ArrowRight size={16} />
              </button>
            ) : (
              pasoActual === 5 && (
                <button
                  type="button"
                  onClick={avanzarPaso}
                  className="flex items-center gap-1 px-4 py-2 bg-[#D7008A] text-white rounded-lg hover:bg-[#590248] transition-colors"
                >
                  Completar Registro
                  <ArrowRight size={16} />
                </button>
              )
            )}
          </div>
        )}

        {/* Botón para la sección de pagos cuando hay exoneración o pago posterior */}
        {pasoActual === 6 && (exonerarPagos || pagarLuego) && (
          <div className="flex justify-center p-6 border-t bg-gray-100">
            <button
              type="button"
              onClick={handlePaymentComplete}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                "Completar Registro"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
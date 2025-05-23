"use client";

import { ArrowLeft, ArrowRight, CheckCircle, UserPlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";

// Import components and data store
import api from "@/api/api";
import { fetchExistencePersona } from "@/api/endpoints/persona"
import { fetchDataSolicitudes } from "@/api/endpoints/landingPage";
import DocsRequirements from "@/app/(Registro)/DocsRequirements";
import InfoColegiado from "@/app/(Registro)/InfoColg";
import InfoContacto from "@/app/(Registro)/InfoCont";
import InfoLaboral from "@/app/(Registro)/InfoLab";
import InfoPersonal from "@/app/(Registro)/InfoPers";
import PagosColg from "@/app/Components/PagosModal";

export default function RegistroColegiados({
  isAdmin = true,
  onClose,
  onRegistroExitoso,
}) {


  // Estado para seguimiento de pasos
  const [pasoActual, setPasoActual] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exonerarPagos, setExonerarPagos] = useState(false);
  const [pagarLuego, setPagarLuego] = useState(false);
  const [tasaBcv, setTasaBcv] = useState(0);
  const [error, setError] = useState(null)
  const [costoInscripcion, setCostoInscripcion] = useState(0);
  const [metodoPago, setMetodoPago] = useState([]);
  const initialState = {
    tipo_profesion: "",
    nationality: "",
    identityCard: "",
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
    birthPlace: "",
    birthDate: "",
    gender: "",
    age: "",
    maritalStatus: "",
    email: "",
    countryCode: "+58",
    phoneNumber: "",
    homePhone: "",
    address: "",
    city: "",
    state: "",
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
    ci: null,
    rif: null,
    titulo: null,
    mpps: null,
    documentos: {}
  };

  // Estado para los datos del formulario
  const [formData, setFormData] = useState(initialState);

  // Función para actualizar datos del formulario
  const handleInputChange = (data) => {
    if (data && data.isPersonalInfoValid !== undefined) {
      const { isPersonalInfoValid, ...rest } = data;
      data = rest;
    }
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Función para manejar cambios en documentos
  const handleDocumentosChange = (docs) => {
    // Actualizar directamente los campos individuales para archivos
    if (docs.ci) {
      setFormData(prev => ({ ...prev, ci: docs.ci }));
    }
    if (docs.rif) {
      setFormData(prev => ({ ...prev, rif: docs.rif }));
    }
    if (docs.titulo) {
      setFormData(prev => ({ ...prev, titulo: docs.titulo }));
    }
    if (docs.mpps) {
      setFormData(prev => ({ ...prev, mpps: docs.mpps }));
    }

    // También mantener la estructura de documentos para coherencia
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
  const avanzarPaso = async () => {
    if(pasoActual==1){
      /*Validar formulario y handleIdentityCardDuplicateVerification()*/ 
    }
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

  // Función para validar Número de identificación Duplicado
  const handleIdentityCardDuplicateVerification = async() => {
    const queryParams = new URLSearchParams({
      "tipo_identificacion": formData.documentType,
      "inicial": formData.idType,
      "identificacion": formData.identityCard,
    }).toString();
    const res = await fetchExistencePersona(`check-existence`, queryParams);
    return res.exists
  }

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
  const handlePaymentComplete = async ({
    paymentDate = null,
    referenceNumber = null,
    paymentFile = null,
    totalAmount = null,
    metodo_de_pago = null,
  }) => {
    setIsSubmitting(true);
    const Form = new FormData();
    Form.append("tipo_profesion", formData.tipo_profesion);
    Form.append(
      "persona",
      JSON.stringify({
        direccion: {
          referencia: formData.address,
          estado: 1,
        },
        nombre: formData.firstName,
        primer_apellido: formData.firstLastName,
        segundo_apellido: formData.secondLastName,
        segundo_nombre: formData.secondName,
        genero: formData.gender,
        nacionalidad: formData.nationality,
        identificacion: `${formData.idType}-${formData.identityCard}`,
        correo: formData.email,
        telefono_movil: `${formData.countryCode} ${formData.phoneNumber}`,
        telefono_de_habitacion: formData.homePhone,
        fecha_de_nacimiento: formData.birthDate,
        estado_civil: formData.maritalStatus,
      })
    );
    Form.append("instituto_bachillerato", formData.graduateInstitute);
    Form.append("universidad", formData.universityTitle);
    Form.append("fecha_egreso_universidad", formData.titleIssuanceDate);
    if (formData.tipo_profesion === "odontologo") {
      Form.append("num_registro_principal", formData.mainRegistrationNumber);
      Form.append("fecha_registro_principal", formData.mainRegistrationDate);
    }
    Form.append("num_mpps", formData.mppsRegistrationNumber);
    Form.append("fecha_mpps", formData.mppsRegistrationDate);
    Form.append(
      "instituciones",
      JSON.stringify(
        formData.laboralRegistros.map((registro) => ({
          nombre: registro.institutionName,
          cargo: registro.cargo,
          direccion: registro.institutionAddress,
          telefono: registro.institutionPhone,
          tipo_institucion: registro.institutionType,
        })) || []
      )
    );
    Form.append("file_ci", formData.ci);
    Form.append("file_rif", formData.rif);
    Form.append("file_fondo_negro", formData.titulo);
    Form.append("file_mpps", formData.mpps);
    Form.append("comprobante", paymentFile);
    if (
      formData.tipo_profesion === "tecnico" ||
      formData.tipo_profesion === "higienista"
    ) {
      Form.append("fondo_negro_credencial", formData.fondo_negro_credencial);
      Form.append("notas_curso", formData.notas_curso);
      Form.append(
        "fondo_negro_titulo_bachiller",
        formData.fondo_negro_titulo_bachiller
      );
    }

    (!pagarLuego && !exonerarPagos)
      ? Form.append(
        "pago",
        JSON.stringify({
          fecha_pago: paymentDate,
          metodo_de_pago: metodo_de_pago.id,
          num_referencia: referenceNumber,
          monto: totalAmount,
        })
      )
      : Form.append("pago", null);
    exonerarPagos && Form.append("pago_exonerado", true)
    try {
      const response = await api.post("usuario/register/", Form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        setPasoActual(7);
        onRegistroExitoso();
        setIsSubmitting(false);

      }
    } catch (error) {
      console.error(
        "Error al enviar los datos:",
        error.response?.data || error
      );
      setIsSubmitting(false);

    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const LoadData = async () => {
      try {
        const tasa = await fetchDataSolicitudes("tasa-bcv");
        setTasaBcv(tasa.data.rate);
        const costo = await fetchDataSolicitudes(
          "costo",
          `?search=Inscripcion+${formData.tipo_profesion}&es_vigente=true`
        );
        setCostoInscripcion(Number(costo.data[0].monto_usd));
        const Mpagos = await fetchDataSolicitudes("metodo-de-pago");
        setMetodoPago(Mpagos.data);
      } catch (error) {
        setError(
          "Ocurrió un error al cargar los datos, verifique su conexión a internet"
        );
      }
    };
    if (formData.tipo_profesion.length > 0) {
      LoadData();
    }
  }, [formData.tipo_profesion]);

  // Renderizar paso actual
  const renderPasoActual = () => {
    switch (pasoActual) {
      case 1:
        return (
          <InfoPersonal formData={formData} onInputChange={handleInputChange} />
        );
      case 2:
        return (
          <InfoContacto formData={formData} onInputChange={handleInputChange} isAdmin={true} />
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
            onInputChange={handleInputChange}
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

            <div className="w-full max-w-md mx-auto mt-6">
              <div className="flex justify-center">
                {/* Exonerar (solo visible si no está seleccionado pagar luego) */}
                {!pagarLuego && (
                  <button
                    type="button"
                    onClick={() => {
                      setExonerarPagos(!exonerarPagos)
                    }}
                    className={`flex-1 px-6 py-2 rounded-full text-sm font-semibold border transition-all duration-300
          ${exonerarPagos
                        ? "bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white border-white shadow-md"
                        : "bg-white text-[#41023B] border-[#41023B] hover:bg-[#41023B]/20"
                      }`}
                  >
                    Exonerar
                  </button>
                )}
                {/* Separador */}
                {!pagarLuego && !exonerarPagos && <span className="px-2"></span>}

                {/* Pagar luego (solo visible si no está seleccionado exonerar) */}
                {!exonerarPagos && (
                  <button
                    type="button"
                    onClick={() => {
                      setPagarLuego(!pagarLuego)
                    }}
                    className={`flex-1 px-6 py-2 rounded-full text-sm font-semibold border transition-all duration-300
          ${pagarLuego
                        ? "bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white border-white shadow-md"
                        : "bg-white text-[#41023B] border-[#41023B] hover:bg-[#41023B]/20"
                      }`}
                  >
                    Pagar luego
                  </button>
                )}
              </div>

              {/* Mensaje informativo opcional */}
              {(pagarLuego || exonerarPagos) && (
                <div className="mt-4 text-center text-sm">
                  {pagarLuego && (
                    <span className="text-[#41023B] font-medium">
                      El usuario podrá completar el pago más adelante.
                    </span>
                  )}
                  {exonerarPagos && (
                    <span className="text-[#41023B] font-medium">
                      El usuario será registrado como solvente sin pago.
                    </span>
                  )}
                </div>
              )}
            </div>
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
                  Nota: El colegiado tiene pendiente realizar el pago de
                  inscripción.
                </span>
              )}
              {exonerarPagos && (
                <span className="block mt-2 text-green-600 font-medium">
                  Nota: El colegiado ha sido exonerado del pago por administración.
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
                  Completar Solicitud de Registro
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
                "Completar Solicitud de Registro"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

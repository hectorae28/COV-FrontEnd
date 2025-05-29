"use client";

import { ArrowLeft, ArrowRight, CheckCircle, UserPlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import api from "@/api/api";
import { fetchDataSolicitudes } from "@/api/endpoints/landingPage";
import { fetchExistencePersona } from "@/api/endpoints/persona";
import DocsRequirements from "@/app/(Registro)/DocsRequirements";
import FotoColegiado from "@/app/(Registro)/FotoColegiado";
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
  const [pasoActual, setPasoActual] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exonerarPagos, setExonerarPagos] = useState(false);
  const [pagarLuego, setPagarLuego] = useState(false);
  const [tasaBcv, setTasaBcv] = useState(0);
  const [error, setError] = useState(null);
  const [costoInscripcion, setCostoInscripcion] = useState(0);
  const [metodoPago, setMetodoPago] = useState([]);

  const initialState = {
    tipo_profesion: "",
    documentType: "cedula",
    nationality: "",
    identityCard: "",
    idType: "V",
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
    municipio: "",
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
    titleIssuanceDate: "",
    ci: null,
    rif: null,
    titulo: null,
    mpps: null,
    foto_colegiado: null,
    fondo_negro_credencial: null,
    notas_curso: null,
    fondo_negro_titulo_bachiller: null,
    documentos: {},
    workStatus: "",
    institutionType: "",
    cargo: "",
    selectedEstado: "",
    selectedMunicipio: "",
    laboralRegistros: [
      {
        id: 1,
        institutionType: "",
        institutionName: "",
        institutionAddress: "",
        institutionPhone: "",
        cargo: "",
        selectedEstado: "",
        selectedMunicipio: "",
      },
    ],
  };

  const [formData, setFormData] = useState(initialState);

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

  const handleDocumentosChange = (docs) => {
    if (docs.ci) setFormData((prev) => ({ ...prev, ci: docs.ci }));
    if (docs.rif) setFormData((prev) => ({ ...prev, rif: docs.rif }));
    if (docs.titulo) setFormData((prev) => ({ ...prev, titulo: docs.titulo }));
    if (docs.mpps) setFormData((prev) => ({ ...prev, mpps: docs.mpps }));
    if (docs.foto_colegiado)
      setFormData((prev) => ({ ...prev, foto_colegiado: docs.foto_colegiado }));
    if (docs.fondo_negro_credencial)
      setFormData((prev) => ({
        ...prev,
        fondo_negro_credencial: docs.fondo_negro_credencial,
      }));
    if (docs.notas_curso)
      setFormData((prev) => ({ ...prev, notas_curso: docs.notas_curso }));
    if (docs.fondo_negro_titulo_bachiller)
      setFormData((prev) => ({
        ...prev,
        fondo_negro_titulo_bachiller: docs.fondo_negro_titulo_bachiller,
      }));

    setFormData((prev) => ({
      ...prev,
      documentos: {
        ...prev.documentos,
        ...docs,
      },
    }));
  };

  const marcarPasoCompletado = (paso) => {
    if (!completedSteps.includes(paso)) {
      setCompletedSteps((prev) => [...prev, paso]);
    }
  };

  const avanzarPaso = async () => {
    marcarPasoCompletado(pasoActual);

    if (pasoActual === 6) {
      setPasoActual(7);
    } else if (pasoActual < 6) {
      setPasoActual(pasoActual + 1);
    }
  };

  const retrocederPaso = () => {
    setPasoActual(Math.max(1, pasoActual - 1));
  };

  const iniciarNuevoRegistro = () => {
    setPasoActual(1);
    setCompletedSteps([]);
    setExonerarPagos(false);
    setPagarLuego(false);
    setError(null);
    setFormData(initialState);
  };

  const handleIdentityCardDuplicateVerification = async () => {
    const queryParams = new URLSearchParams({
      tipo_identificacion: formData.documentType,
      inicial: formData.idType,
      identificacion: formData.identityCard,
    }).toString();
    const res = await fetchExistencePersona(`check-existence`, queryParams);
    return res.exists;
  };

  const handlePaymentComplete = async ({
    paymentDate = null,
    referenceNumber = null,
    paymentFile = null,
    totalAmount = null,
    metodo_de_pago = null,
  }) => {
    setIsSubmitting(true);

    try {
      if (!formData.tipo_profesion) {
        throw new Error("Tipo de profesión es requerido");
      }

      if (!formData.firstName || !formData.firstLastName) {
        throw new Error("Nombre y apellido son requeridos");
      }

      if (!formData.email || !formData.phoneNumber) {
        throw new Error("Email y teléfono son requeridos");
      }

      if (!formData.universityTitle || formData.universityTitle.trim() === "") {
        throw new Error("Universidad es requerida");
      }

      const Form = new FormData();
      Form.append("tipo_profesion", formData.tipo_profesion);

      // Formatear teléfono móvil (máximo 13 caracteres)
      const countryCode = formData.countryCode || "+58";
      const phoneNumber = formData.phoneNumber || "";
      let telefonoMovil = `${countryCode} ${phoneNumber}`.trim();

      if (telefonoMovil.length > 13) {
        telefonoMovil = `${countryCode}${phoneNumber}`;
        if (telefonoMovil.length > 13) {
          telefonoMovil = telefonoMovil.substring(0, 13);
        }
      }

      const personaData = {
        direccion: {
          referencia: formData.address || "",
          estado: Number(formData.state) || 1,
          municipio: Number(formData.municipio) || 1,
        },
        nombre: formData.firstName || "",
        primer_apellido: formData.firstLastName || "",
        segundo_apellido: formData.secondLastName || "",
        segundo_nombre: formData.secondName || "",
        genero: formData.gender || "",
        nacionalidad:
          formData.documentType === "cedula" ? "venezolana" : "extranjera",
        identificacion:
          formData.documentType === "cedula"
            ? `${formData.idType || "V"}${formData.identityCard || ""}`
            : formData.identityCard || "",
        correo: formData.email || "",
        telefono_movil: telefonoMovil,
        telefono_de_habitacion: formData.homePhone || "",
        fecha_de_nacimiento: formData.birthDate || "",
        estado_civil: formData.maritalStatus || "",
      };

      Form.append("persona", JSON.stringify(personaData));
      Form.append("instituto_bachillerato", formData.graduateInstitute || "");
      Form.append("universidad", formData.universityTitle || "");
      Form.append("fecha_egreso_universidad", formData.titleIssuanceDate || "");

      if (formData.tipo_profesion === "odontologo") {
        Form.append(
          "num_registro_principal",
          formData.mainRegistrationNumber || ""
        );
      }
      Form.append("num_mpps", formData.mppsRegistrationNumber || "");

      const instituciones =
        formData.workStatus === "noLabora"
          ? []
          : formData.laboralRegistros &&
            Array.isArray(formData.laboralRegistros)
            ? formData.laboralRegistros
              .filter(
                (registro) =>
                  registro.institutionName &&
                  registro.institutionName.trim() !== ""
              )
              .map((registro) => ({
                nombre: registro.institutionName || "",
                cargo: registro.cargo || "",
                direccion: {
                  estado: Number(registro.selectedEstado) || 1,
                  municipio: Number(registro.selectedMunicipio) || 1,
                  referencia: registro.institutionAddress || "",
                },
                telefono: registro.institutionPhone || "",
                tipo_institucion: registro.institutionType || "CDP",
              }))
            : [];

      Form.append("instituciones", JSON.stringify(instituciones));

      if (formData.ci) Form.append("file_ci", formData.ci);
      if (formData.rif) Form.append("file_rif", formData.rif);
      if (formData.titulo) Form.append("file_fondo_negro", formData.titulo);
      if (formData.mpps) Form.append("file_mpps", formData.mpps);
      if (formData.foto_colegiado)
        Form.append("file_foto_colegiado", formData.foto_colegiado);

      if (
        formData.tipo_profesion === "tecnico" ||
        formData.tipo_profesion === "higienista"
      ) {
        if (formData.fondo_negro_credencial) {
          Form.append(
            "fondo_negro_credencial",
            formData.fondo_negro_credencial
          );
        }
        if (formData.notas_curso) {
          Form.append("notas_curso", formData.notas_curso);
        }
        if (formData.fondo_negro_titulo_bachiller) {
          Form.append(
            "fondo_negro_titulo_bachiller",
            formData.fondo_negro_titulo_bachiller
          );
        }
      }

      if (!pagarLuego && !exonerarPagos && paymentFile && metodo_de_pago) {
        const pagoData = {
          fecha_pago: paymentDate,
          metodo_de_pago: metodo_de_pago.id,
          num_referencia: referenceNumber,
          monto: totalAmount,
        };
        Form.append("pago", JSON.stringify(pagoData));
        Form.append("comprobante", paymentFile);
      } else {
        Form.append("pago", "null");
      }

      if (exonerarPagos) {
        Form.append("pago_exonerado", "true");
      }

      const response = await api.post("usuario/register/", Form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setPasoActual(8);
        onRegistroExitoso();
      }
    } catch (error) {
      let errorMessage = "Error al registrar el colegiado.";

      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (typeof error.response.data === "object") {
          const errorDetails = [];
          Object.entries(error.response.data).forEach(([key, value]) => {
            if (key === "persona" && typeof value === "object") {
              Object.entries(value).forEach(([personaKey, personaValue]) => {
                if (Array.isArray(personaValue)) {
                  errorDetails.push(
                    `${personaKey}: ${personaValue.join(", ")}`
                  );
                }
              });
            } else if (key === "universidad" && typeof value === "object") {
              Object.entries(value).forEach(([uniKey, uniValue]) => {
                if (Array.isArray(uniValue)) {
                  errorDetails.push(
                    `Universidad ${uniKey}: ${uniValue.join(", ")}`
                  );
                }
              });
            } else if (Array.isArray(value)) {
              errorDetails.push(`${key}: ${value.join(", ")}`);
            } else {
              errorDetails.push(`${key}: ${value}`);
            }
          });
          if (errorDetails.length > 0) {
            errorMessage = errorDetails.join("; ");
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
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

  const renderPasoActual = () => {
    switch (pasoActual) {
      case 1:
        return (
          <InfoPersonal formData={formData} onInputChange={handleInputChange} />
        );
      case 2:
        return (
          <InfoContacto
            formData={formData}
            onInputChange={handleInputChange}
            isAdmin={true}
          />
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
          <FotoColegiado
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 7:
        return (
          <div className="space-y-6">
            {!exonerarPagos && !pagarLuego && (
              <PagosColg
                props={{
                  handlePago: handlePaymentComplete,
                  costo: costoInscripcion,
                  metodoPago,
                }}
              />
            )}

            <div className="w-full max-w-md mx-auto mt-6">
              <div className="flex justify-center">
                {!pagarLuego && (
                  <button
                    type="button"
                    onClick={() => setExonerarPagos(!exonerarPagos)}
                    className={`flex-1 px-6 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${exonerarPagos
                        ? "bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white border-white shadow-md"
                        : "bg-white text-[#41023B] border-[#41023B] hover:bg-[#41023B]/20"
                      }`}
                  >
                    Exonerar
                  </button>
                )}
                {!pagarLuego && !exonerarPagos && (
                  <span className="px-2"></span>
                )}

                {!exonerarPagos && (
                  <button
                    type="button"
                    onClick={() => setPagarLuego(!pagarLuego)}
                    className={`flex-1 px-6 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${pagarLuego
                        ? "bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white border-white shadow-md"
                        : "bg-white text-[#41023B] border-[#41023B] hover:bg-[#41023B]/20"
                      }`}
                  >
                    Pagar luego
                  </button>
                )}
              </div>

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
      case 8:
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
                  Nota: El colegiado ha sido exonerado del pago por
                  administración.
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

  const titulosPasos = [
    "Información Personal",
    "Información de Contacto",
    "Información Profesional",
    "Información Laboral",
    "Documentos Requeridos",
    "Foto tipo Carnet",
    "Pagos",
    "Confirmación",
  ];

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
      case 6:
        return (
          <div className="flex flex-col items-center text-center">
            <span className="text-xs leading-tight">Foto</span>
            <span className="text-xs leading-tight">Carnet</span>
          </div>
        );
      default:
        return null;
    }
  };

  const mostrarEncabezadoPasos = pasoActual <= 6;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold text-[#41023B]">
            Registrar nuevo colegiado
            {pasoActual <= 7 && (
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

        {error && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError(null)}
                    className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {mostrarEncabezadoPasos && (
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-6">
              {[1, 2, 3, 4, 5, 6].map((paso, index) => (
                <React.Fragment key={paso}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full ${completedSteps.includes(paso)
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
                    <div className="mt-1 min-h-10">
                      {getTituloIndicador(paso)}
                    </div>
                  </div>

                  {index < 5 && (
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

        <div className="p-6">{renderPasoActual()}</div>

        {pasoActual !== 8 && pasoActual !== 7 && (
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

            {pasoActual < 6 ? (
              <button
                type="button"
                onClick={avanzarPaso}
                className="flex items-center gap-1 px-4 py-2 bg-[#D7008A] text-white rounded-lg hover:bg-[#590248] transition-colors"
              >
                Siguiente
                <ArrowRight size={16} />
              </button>
            ) : (
              pasoActual === 6 && (
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

        {pasoActual === 7 && (
          <div className="flex justify-between p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={retrocederPaso}
              className="flex items-center gap-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={16} />
              Atras
            </button>

            {(exonerarPagos || pagarLuego) && (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

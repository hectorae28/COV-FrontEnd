"use client";

import { fetchMe } from "@/api/endpoints/colegiado";
import { pagoSolvencia, pagoSolvenciaEspecial } from "@/api/endpoints/solicitud";
import PagosColg from "@/app/Components/PagosModal";
import useColegiadoUserStore from "@/store/colegiadoUserStore";
import { useSolicitudesStore } from "@/store/SolicitudesStore";
import { AlertCircle, Calendar, CheckCircle, Clock, CreditCard, FileText, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

// Datos de ejemplo para mostrar cómo se vería la lista
const SOLICITUDES_EJEMPLO = [
  {
    idSolicitudSolvencia: 1,
    statusSolicitud: "revisando",
    fechaSolicitud: "2024-01-15",
    fechaExpSolvencia: "2024-12-31",
    costoRegularSolicitud: 50.00,
    observaciones: "Solicitud regular de solvencia para ejercicio profesional",
    creador: {
      isAdmin: false,
      nombre: "Colegiado"
    },
    pagada: false
  },
  {
    idSolicitudSolvencia: 2,
    statusSolicitud: "costo_especial",
    fechaSolicitud: "2024-01-10",
    fechaExpSolvencia: null,
    costoRegularSolicitud: -1,
    observaciones: "Solicitud de costo especial por situación económica especial debido a circunstancias personales comprobadas",
    creador: {
      isAdmin: true,
      nombre: "Administrador"
    },
    pagada: false
  },
  {
    idSolicitudSolvencia: 3,
    statusSolicitud: "aprobado",
    fechaSolicitud: "2023-12-01",
    fechaExpSolvencia: "2024-11-30",
    costoRegularSolicitud: 50.00,
    observaciones: "Solvencia aprobada y pagada correctamente. Certificado emitido.",
    creador: {
      isAdmin: false,
      nombre: "Colegiado"
    },
    pagada: true
  },
  {
    idSolicitudSolvencia: 4,
    statusSolicitud: "revisando",
    fechaSolicitud: "2024-01-20",
    fechaExpSolvencia: "2024-12-31",
    costoRegularSolicitud: 75.00,
    observaciones: "Solicitud de solvencia con especialidad en Endodoncia - Requiere documentación adicional",
    creador: {
      isAdmin: false,
      nombre: "Colegiado"
    },
    pagada: false
  },
  {
    idSolicitudSolvencia: 5,
    statusSolicitud: "rechazado",
    fechaSolicitud: "2024-01-05",
    fechaExpSolvencia: null,
    costoRegularSolicitud: 50.00,
    observaciones: "Solicitud rechazada por documentación incompleta. Falta: Certificado de estudios actualizado y comprobante de residencia vigente.",
    creador: {
      isAdmin: false,
      nombre: "Colegiado"
    },
    pagada: false
  },
  {
    idSolicitudSolvencia: 6,
    statusSolicitud: "revisando",
    fechaSolicitud: "2024-01-25",
    fechaExpSolvencia: "2025-01-24",
    costoRegularSolicitud: 125.00,
    observaciones: "Solicitud de solvencia para múltiples especialidades: Ortodoncia y Periodoncia",
    creador: {
      isAdmin: false,
      nombre: "Colegiado"
    },
    pagada: false
  },
  {
    idSolicitudSolvencia: 7,
    statusSolicitud: "aprobado",
    fechaSolicitud: "2023-11-15",
    fechaExpSolvencia: "2024-11-14",
    costoRegularSolicitud: 60.00,
    observaciones: "Solvencia para ejercicio temporal - 6 meses. Renovación automática aprobada.",
    creador: {
      isAdmin: true,
      nombre: "Administrador"
    },
    pagada: true
  },
  {
    idSolicitudSolvencia: 8,
    statusSolicitud: "costo_especial",
    fechaSolicitud: "2024-01-12",
    fechaExpSolvencia: null,
    costoRegularSolicitud: -1,
    observaciones: "Evaluación de costo especial en proceso - Caso de colegiado jubilado con más de 30 años de ejercicio",
    creador: {
      isAdmin: true,
      nombre: "Administrador"
    },
    pagada: false
  }
];

export default function SolvenciaPago({ props }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [costoSolvencia, setCostoSolvencia] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [montoPagado, setMontoPagado] = useState(0); // Monto ya pagado en partes
  const [tipoSolvenciaSeleccionada, setTipoSolvenciaSeleccionada] = useState(null); // 'trimestre' o 'anual'
  const [solicitudesEjemplo, setSolicitudesEjemplo] = useState(SOLICITUDES_EJEMPLO);
  const [solicitudesSeleccionadas, setSolicitudesSeleccionadas] = useState(new Set());
  
  // Store states
  const costos = useColegiadoUserStore((store) => store.costos);
  const setColegiadoUser = useColegiadoUserStore((store) => store.setColegiadoUser);
  const colegiadoUser = useColegiadoUserStore((store) => store.colegiadoUser);
  const solicitudesDeSolvencia = useSolicitudesStore((store) => store.solicitudesDeSolvencia);
  const fetchSolicitudesDeSolvencia = useSolicitudesStore((store) => store.fetchSolicitudesDeSolvencia);
  
  const { setActiveTab } = props;

  useEffect(() => {
    if (colegiadoUser && colegiadoUser.costo_de_solvencia) {
      setCostoSolvencia(colegiadoUser.costo_de_solvencia);
      // Aquí puedes obtener el monto ya pagado desde el backend
      // setMontoPagado(colegiadoUser.monto_pagado_solvencia || 0);
    }
  }, [colegiadoUser]);

  // Cargar solicitudes de solvencia si existe solicitud activa
  useEffect(() => {
    if (colegiadoUser?.solicitud_solvencia_activa) {
      const cargarSolicitudes = async () => {
        try {
          setLoadingSolicitudes(true);
          await fetchSolicitudesDeSolvencia();
        } catch (error) {
          console.error("Error al cargar solicitudes de solvencia:", error);
          // Si es error 403, es probable que el endpoint no esté disponible o no tenga permisos
          if (error.response?.status === 403) {
            console.log("No se tienen permisos para acceder a las solicitudes de solvencia o el endpoint no está disponible");
          }
        } finally {
          setLoadingSolicitudes(false);
        }
      };
      
      cargarSolicitudes();
    }
  }, [colegiadoUser?.solicitud_solvencia_activa, fetchSolicitudesDeSolvencia]);

  // Lógica de trimestres
  const obtenerInfoTrimestre = () => {
    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1; // getMonth() retorna 0-11, necesitamos 1-12
    const anoActual = ahora.getFullYear();
    
    let trimestreActual;
    let esUltimoTrimestre = false;
    
    if (mesActual >= 1 && mesActual <= 3) {
      trimestreActual = 1;
    } else if (mesActual >= 4 && mesActual <= 6) {
      trimestreActual = 2;
    } else if (mesActual >= 7 && mesActual <= 9) {
      trimestreActual = 3;
    } else {
      trimestreActual = 4;
      esUltimoTrimestre = true;
    }
    
    return {
      trimestre: trimestreActual,
      ano: anoActual,
      esUltimoTrimestre,
      nombreTrimestre: `${trimestreActual}° Trimestre ${anoActual}`
    };
  };

  const infoTrimestre = obtenerInfoTrimestre();
  const montoRestante = costoSolvencia - montoPagado;
  const esPagoCompleto = montoPagado >= costoSolvencia;

  // Calcular costos según el tipo seleccionado
  const calcularCosto = (tipo) => {
    if (tipo === 'trimestre') {
      return costoSolvencia; // Costo por trimestre
    } else if (tipo === 'anual') {
      return costoSolvencia * 4; // Costo anual (4 trimestres)
    }
    return 0;
  };

  const handlePagoSolvencia = async (detallesPagoSolvencia) => {
    try {
      const pagoResult = colegiadoUser.requiere_solvencia_esp ?
          await pagoSolvenciaEspecial(detallesPagoSolvencia) : await pagoSolvencia(detallesPagoSolvencia);
      
      const colegiadoResult = await fetchMe();
      setColegiadoUser(colegiadoResult.data);
      
      // Recargar solicitudes si hay solicitud activa (con manejo de errores)
      if (colegiadoUser?.solicitud_solvencia_activa) {
        try {
          await fetchSolicitudesDeSolvencia();
        } catch (error) {
          console.log("No se pudieron recargar las solicitudes de solvencia, pero el pago se procesó correctamente");
        }
      }
      
      setShowPagoModal(false);
      setTipoSolvenciaSeleccionada(null);
      setIsSuccess(true);
      
      // Auto-cerrar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setIsSuccess(false);
        setActiveTab("solicitudes");
      }, 3000);
      
      return [undefined, pagoResult]
    } catch(error) {
      return [error, undefined];
    }
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'revisando':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'aprobado':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rechazado':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'costo_especial':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEstadoIcono = (estado) => {
    switch (estado) {
      case 'revisando':
        return <Clock size={16} />;
      case 'aprobado':
        return <CheckCircle size={16} />;
      case 'rechazado':
        return <AlertCircle size={16} />;
      case 'costo_especial':
        return <FileText size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'revisando':
        return 'En Revisión';
      case 'aprobado':
        return 'Aprobada';
      case 'rechazado':
        return 'Rechazada';
      case 'costo_especial':
        return 'Costo Especial';
      default:
        return estado;
    }
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'No especificada';
    
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return fechaStr;
    }
  };

  // Determinar qué mostrar según solicitud_solvencia_activa
  const mostrarOpcionesTrimestre = !colegiadoUser?.solicitud_solvencia_activa;
  const mostrarSolvenciaActiva = colegiadoUser?.solicitud_solvencia_activa;

  return (
    <div className="space-y-6" id="solvencia-pagos">
      {/* Mensaje de información */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex items-center space-x-2 text-gray-700">
          <Info size={18} className="text-[#D7008A] flex-shrink-0" />
          <p className="text-sm">
            {mostrarOpcionesTrimestre
              ? "Seleccione el tipo de solvencia que desea pagar. Puede optar por pago trimestral o anual según su conveniencia."
              : "La solvencia del Colegio de Odontólogos es un requisito indispensable para el ejercicio profesional. Puede realizar el pago completo o pagos parciales según su conveniencia."
            }
          </p>
        </div>
      </div>

      {/* Mensaje de éxito */}
      {isSuccess && (
        <div className="bg-white rounded-xl shadow-md">
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-600">
              ¡Pago Procesado!
            </h3>
            <p className="text-gray-600 text-center mt-2">
              Su pago ha sido recibido y está siendo procesado.
            </p>
          </div>
        </div>
      )}

      {/* Opciones de Trimestre - Solo cuando solicitud_solvencia_activa es false */}
      {!isSuccess && mostrarOpcionesTrimestre && (
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#41023B] to-[#D7008A] flex items-center justify-center mr-4">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#41023B]">
                  Opciones de Pago de Solvencia
                </h3>
                <p className="text-sm text-gray-600">
                  Seleccione el período que desea cubrir
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opción Trimestre Actual */}
              <div
                className="border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-[#D7008A] hover:bg-[#D7008A]/5 hover:shadow-lg"
                onClick={() => {
                  setTipoSolvenciaSeleccionada('trimestre');
                  setShowPagoModal(true);
                }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Pago Trimestral
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {infoTrimestre.nombreTrimestre}
                  </p>
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-2xl font-bold text-blue-700">
                      USD$ {calcularCosto('trimestre').toFixed(2)}
                    </p>
                    <p className="text-xs text-blue-600">Por trimestre</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    Válido hasta final del trimestre actual
                  </div>
                </div>
              </div>

              {/* Opción Anual - Solo si NO es último trimestre */}
              {!infoTrimestre.esUltimoTrimestre && (
                <div
                  className="border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-[#D7008A] hover:bg-[#D7008A]/5 hover:shadow-lg"
                  onClick={() => {
                    setTipoSolvenciaSeleccionada('anual');
                    setShowPagoModal(true);
                  }}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Pago Anual
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Todo el año {infoTrimestre.ano}
                    </p>
                    <div className="bg-green-50 rounded-lg p-3 mb-4">
                      <p className="text-2xl font-bold text-green-700">
                        USD$ {calcularCosto('anual').toFixed(2)}
                      </p>
                      <p className="text-xs text-green-600">Por año completo</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      Válido hasta el 31 de diciembre {infoTrimestre.ano}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mensaje si es último trimestre */}
            {infoTrimestre.esUltimoTrimestre && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <Info size={16} className="text-yellow-600 mr-2" />
                  <p className="text-sm text-yellow-700">
                    <strong>Último trimestre del año:</strong> Solo está disponible el pago trimestral. 
                    El pago anual estará disponible a partir de enero del próximo año.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Solvencia Activa - Solo cuando solicitud_solvencia_activa es true */}
      {!isSuccess && mostrarSolvenciaActiva && (
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#41023B] to-[#D7008A] flex items-center justify-center mr-4">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#41023B]">
                  Pago de Solvencia
                </h3>
                <p className="text-sm text-gray-600">
                  Complete el pago de su solvencia
                </p>
              </div>
            </div>

            {/* Tarjeta de la solvencia */}
            <div
              className="border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 border-gray-200 hover:border-[#D7008A] hover:bg-[#D7008A]/5 hover:shadow-lg"
              onClick={() => setShowPagoModal(true)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="w-4 h-4 rounded-full mr-3 bg-blue-500"></div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      Solvencia
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-blue-500" />
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Fecha de Expiracion</div>
                          <div className="font-semibold text-gray-900">{formatearFecha(colegiadoUser?.solvente)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center">
                        <CreditCard size={16} className="mr-2 text-green-500" />
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Costo Total</div>
                          <div className="font-semibold text-gray-900">USD$ {costoSolvencia.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center">
                        <CreditCard size={16} className="mr-2 text-red-500" />
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Restante</div>
                          <div className="font-semibold text-red-700">USD$ {montoRestante.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Barra de progreso de pago */}
                  {montoPagado > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progreso de pago</span>
                        <span>{((montoPagado / costoSolvencia) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-300 bg-blue-500"
                          style={{ width: `${Math.min((montoPagado / costoSolvencia) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>USD$ {montoPagado.toFixed(2)} pagado</span>
                        <span>USD$ {costoSolvencia.toFixed(2)} total</span>
                      </div>
                    </div>
                  )}

                  {/* Botón de acción */}
                  <div className="bg-gradient-to-r from-[#D7008A]/10 to-[#41023B]/10 rounded-lg p-4 border border-[#D7008A]/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#41023B]">
                          {montoPagado > 0 ? 'Continuar pago' : 'Realizar pago'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {montoPagado > 0 
                            ? `Faltan USD$ ${montoRestante.toFixed(2)} por pagar`
                            : 'Haga clic para proceder con el pago'
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <CreditCard className="w-6 h-6 text-[#D7008A]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pago */}
      {showPagoModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#41023B]">
                Pago de Solvencia
                {tipoSolvenciaSeleccionada && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    ({tipoSolvenciaSeleccionada === 'trimestre' ? 'Trimestral' : 'Anual'} - USD$ {calcularCosto(tipoSolvenciaSeleccionada).toFixed(2)})
                  </span>
                )}
                {mostrarSolvenciaActiva && montoPagado > 0 && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    (Pago parcial - Restante: USD$ {montoRestante.toFixed(2)})
                  </span>
                )}
              </h3>
              <button
                onClick={() => {
                  setShowPagoModal(false);
                  setTipoSolvenciaSeleccionada(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-0">
              <PagosColg
                props={{
                  costo: mostrarOpcionesTrimestre 
                    ? calcularCosto(tipoSolvenciaSeleccionada) 
                    : montoRestante, // Para solvencia activa, solo el monto restante
                  allowMultiplePayments: true, // Permitir pagos parciales
                  handlePago: handlePagoSolvencia
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

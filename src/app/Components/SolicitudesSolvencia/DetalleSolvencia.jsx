"use client";
import {
  AlertCircle,
  Ban,
  Check,
  CheckCircle,
  ChevronLeft,
  Clock,
  DollarSign,
  Download,
  User,
  Calendar,
  X,
  Shield,
  Clock3,
  ArrowRight
} from "lucide-react";
import { useEffect, useState } from "react";

// Componentes importados
import ConfirmacionModal from "./ConfirmacionModal";
import RechazoModal from "./RechazoModal";
import ExoneracionModal from "./ExoneracionModal";
import {patchDataSolicitud, postDataSolicitud, fetchSolicitudes} from "@/api/endpoints/solicitud"
import { useSolicitudesStore } from "@/store/SolicitudesStore"
import { colegiado } from "@/app/Models/PanelControl/Solicitudes/SolicitudesColegiadosData";

export default function DetalleSolvencia({ solvenciaId, onVolver, solvencias, actualizarSolvencia }) {
  // Estados principales
  const [solvencia, setSolvencia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alertaExito, setAlertaExito] = useState(null);

  // Estados de modales
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarRechazo, setMostrarRechazo] = useState(false);
  const [mostrarExoneracion, setMostrarExoneracion] = useState(false);

  // Estados para formularios
  // MODIFICADO: Ya no usamos un estado único para la fecha, sino componentes separados
  const [diaVencimiento, setDiaVencimiento] = useState("");
  const [mesVencimiento, setMesVencimiento] = useState("");
  const [anioVencimiento, setAnioVencimiento] = useState("");
  const [costoNuevo, setCostoNuevo] = useState("");
  const [metodosDePago, setMetodoDePago] = useState([]);
  const [fechaVencimiento, setFechaVencimiento] = useState(getEndOfTrimester(getTrimester()));

  const getMetodosDePago = async () => {
      try {
        const metodos = await fetchSolicitudes("metodo-de-pago");
        setMetodoDePago(metodos.data);
        console.log(metodos.data)
      } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`)
      }
    }

  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();

  const fetchSolicitudesDeSolvencia = useSolicitudesStore((state) => state.fetchSolicitudesDeSolvencia);

  function getTrimester() {
    const today = new Date();
    const month = today.getMonth();
    return Math.floor(month / 3) + 1;
  }

  // Function to get the end date of a specific trimester
  function getEndOfTrimester(trimester) {
    const year = new Date().getFullYear();
    let nextMonth;

    switch (trimester) {
      case 1: nextMonth = 3; break; // April (0-based)
      case 2: nextMonth = 6; break; // July
      case 3: nextMonth = 9; break; // October
      case 4: nextMonth = 12; break; // January (next year)
      default: throw new Error('Invalid trimester (must be 1-4)');
    }

    // Create a date for the first day of the next month, then subtract one day
    const endDate = new Date(year, nextMonth, 1);
    endDate.setDate(0); // Set to the last day of the previous month
    return endDate;
  }

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fechasDeVencimiento = [
      { trimestre: 1, fecha: getEndOfTrimester(1) },
      { trimestre: 2, fecha: getEndOfTrimester(2) },
      { trimestre: 3, fecha: getEndOfTrimester(3) },
      { trimestre: 4, fecha: getEndOfTrimester(4) },
  ];

  // Obtener datos de la solvencia
  useEffect(() => {
    if (solvencias && solvenciaId) {
      const solvenciaEncontrada = solvencias.find(s => s.idSolicitudSolvencia === solvenciaId);
      if (solvenciaEncontrada) {
        setSolvencia(solvenciaEncontrada);
        getMetodosDePago();

        // Si tiene fecha de vencimiento, establecerla en los campos separados
        if (solvenciaEncontrada.fechaExpSolvencia) {
          try {
            // Intentar parsear la fecha (podría estar en formato ISO o en formato DD/MM/YYYY)
            let fechaObj = getEndOfTrimester(getTrimester());

            if (fechaObj && !isNaN(fechaObj.getTime())) {
              setDiaVencimiento(fechaObj.getDate());
              setMesVencimiento(fechaObj.getMonth() + 1);
              setAnioVencimiento(fechaObj.getFullYear());
            }
          } catch (error) {
            console.error("Error al parsear fecha de vencimiento:", error);
          }
        } else {
          // Por defecto, establecer fecha de vencimiento a 1 año desde la fecha actual
          const fechaExp = getEndOfTrimester(getTrimester());
          setDiaVencimiento(fechaExp.getDate());
          setMesVencimiento(fechaExp.getMonth() + 1);
          setAnioVencimiento(fechaExp.getFullYear());
        }
      }

      setIsLoading(false);
    }
  }, [solvenciaId, solvencias]);

  // Función para validar la fecha de vencimiento seleccionada
  const validarFechaVencimiento = () => {
    if (!diaVencimiento || !mesVencimiento || !anioVencimiento) {
      alert("Debe seleccionar una fecha de vencimiento completa");
      return false;
    }

    // Validar que la fecha sea válida (por ejemplo, 30/02 no es válido)
    const fechaObj = new Date(anioVencimiento, mesVencimiento - 1, diaVencimiento);
    if (
      fechaObj.getFullYear() !== parseInt(anioVencimiento) ||
      fechaObj.getMonth() !== parseInt(mesVencimiento) - 1 ||
      fechaObj.getDate() !== parseInt(diaVencimiento)
    ) {
      alert("La fecha seleccionada no es válida");
      return false;
    }

    return true;
  };

  // Función para formatear la fecha de vencimiento
  const obtenerFechaVencimientoFormateada = () => {
    // Formato YYYY-MM-DD para almacenamiento
    return `${anioVencimiento}-${mesVencimiento.toString().padStart(2, '0')}-${diaVencimiento.toString().padStart(2, '0')}`;
  };

  // Función para actualizar el costo asignado
  const handleAsignarCosto = () => {
    if (!costoNuevo || parseFloat(costoNuevo) <= 0) {
      alert("Por favor ingrese un monto válido mayor a cero");
      return;
    }

    try {
      const solvenciaActualizada = {
        costo: parseFloat(costoNuevo),
        solicitud_solvencia_id: solvenciaId
      };

      patchDataSolicitud('asignar_costo_solicitud_solvencia', solvenciaActualizada);
      fetchSolicitudesDeSolvencia();
      mostrarAlerta("exito", "Se ha asignado el costo correctamente");
    } catch (error) {
      console.error("Error al asignar costo:", error);
      mostrarAlerta("alerta", "Ocurrió un error al procesar la solicitud");
    }
  };

  // Función para exonerar el pago
  const handleExonerarPago = (motivo) => {
    try {

      const solvenciaActualizada = {
        solicitud_solvencia_id: solvencia.idSolicitudSolvencia,
        motivo_exoneracion: motivo,
        colegiado_id: solvencia.idColegiado,
        fecha_exp: fechaVencimiento
      };

      postDataSolicitud('exonerar_solicitud_solvencia', solvenciaActualizada);
      setMostrarExoneracion(false);
      fetchSolicitudesDeSolvencia();
      mostrarAlerta("exito", "La solvencia ha sido exonerada de pago");
    } catch (error) {
      console.error("Error al exonerar pago:", error);
      mostrarAlerta("alerta", "Ocurrió un error al procesar la exoneración");
    }
  };

  // Función para aprobar la solvencia
  const handleAprobarSolvencia = async () => {
    try {
      // Validar que la fecha de vencimiento sea válida
      if (!validarFechaVencimiento()) {
        return;
      }

      const solvenciaActualizada = {
        solicitud_solvencia_id: solvencia.idSolicitudSolvencia,
        colegiado_id: solvencia.idColegiado,
        costo: solvencia.costoRegularSolicitud,
        fecha_exp: fechaVencimiento
      };

      postDataSolicitud('aprobar_solicitud_solvencia', solvenciaActualizada);
      setMostrarConfirmacion(false);
      fetchSolicitudesDeSolvencia();
      mostrarAlerta("exito", "La solvencia ha sido aprobada correctamente");
    } catch (error) {
      console.error("Error al aprobar solvencia:", error);
    }
  };

  // Función para rechazar la solvencia
  const handleRechazarSolvencia = async (motivo) => {
    try {
      if (!motivo) {
        alert("Debe ingresar un motivo de rechazo");
        return;
      }

      const solvenciaActualizada = {
        solicitud_solvencia_id: solvencia.idSolicitudSolvencia,
        motivo_rechazo: motivo,
        colegiado_id: solvencia.idColegiado
      };

      patchDataSolicitud('rechazar_solicitud_solvencia', solvenciaActualizada);
      setMostrarRechazo(false);
      fetchSolicitudesDeSolvencia();
      mostrarAlerta("alerta", "La solvencia ha sido rechazada");
    } catch (error) {
      console.error("Error al rechazar solvencia:", error);
    }
  };

  // Función para mostrar alertas temporales
  const mostrarAlerta = (tipo, mensaje) => {
    setAlertaExito({
      tipo: tipo,
      mensaje: mensaje
    });

    // Limpiar alerta después de un tiempo
    setTimeout(() => {
      setAlertaExito(null);
    }, 5000);
  };

  const handleSeleccionarFecha = (e) => {
    setFechaVencimiento(e.target.value);
  }

  // Renderizado principal
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
      </div>
    );
  }

  if (!solvencia) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Solvencia no encontrada</h2>
        <button
          onClick={onVolver}
          className="inline-flex items-center text-[#C40180] hover:text-[#590248] transition-colors"
        >
          <ChevronLeft className="mr-2" size={20} />
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 mt-28">
      {/* Header con botón de volver y estado */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={onVolver}
            className="inline-flex items-center text-gray-600 hover:text-[#C40180] "
          >
            <ChevronLeft className="mr-2" size={20} />
            <span>Volver a la lista</span>
          </button>
          <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${solvencia.statusSolicitud === 'revisando'
            ? 'bg-yellow-100 text-yellow-800'
            : solvencia.statusSolicitud === 'aprobado'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }`}>
            {solvencia.statusSolicitud === 'revisando' && <Clock size={16} />}
            {solvencia.statusSolicitud === 'aprobado' && <CheckCircle size={16} />}
            {solvencia.statusSolicitud === 'rechazado' && <X size={16} />}
            {solvencia.estado}
          </div>
        </div>

        {/* Alertas */}
        {alertaExito && (
          <div className={`mt-4 p-4 rounded-xl flex items-center justify-between shadow-md ${alertaExito.tipo === "exito" ? "bg-green-50 text-green-800 border" +
            "border-green-200" : "bg-red-50 text-red-800 border border-red-200"
            }`}>
            <div className="flex items-center">
              {alertaExito.tipo === "exito" ? (
                <CheckCircle className="mr-2" size={20} />
              ) : (
                <AlertCircle className="mr-2" size={20} />
              )}
              <span className="font-medium">{alertaExito.mensaje}</span>
            </div>
            <button
              onClick={() => setAlertaExito(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto">
        {/* Cabecera de la solvencia con estilo moderno */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-[#590248]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-[#590248] flex items-center">
                <Calendar size={16} className="mr-1" />
                Solicitada el: {solvencia.fechaSolicitud}
              </p>
            </div>

            {/*<div className="flex flex-col sm:flex-row gap-3">
              {solvencia.estado === "aprobado" && (
                <button
                  onClick={() => window.open(solvencia.certificadoUrl, '_blank')}
                  className="inline-flex items-center justify-center px-4 py-2
                  bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-lg transition-colors"
                >
                  <Download className="mr-2" size={18} />
                  Descargar Certificado
                </button>
              )}
            </div>*/}
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna 1: Información del colegiado */}
          <div>
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg
            transition-shadow p-6 border-l-4 border-[#D7008A] mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center ">
                <User className="mr-2 text-[#590248] bg-[#590248]/20 rounded-full px-2 py-0.5 w-10 h-10 " />
                Información del Colegiado
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium text-gray-900 text-lg">{solvencia.nombreColegiado}</p>
                </div>

                {/* Información del creador */}
                {solvencia.creador.isAdmin && (
                  <div className="pt-3 mt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Creada por</p>
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${solvencia.creadoPor !== null ? "bg-[#590248]/20" : "bg-gray-100"
                        }`}>
                        <Shield size={20} className={solvencia.creador.isAdmin ?
                          "text-[#590248]" : "text-gray-600"} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{solvencia.creador.nombre}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{solvencia.creador.email}</span>
                          {solvencia.creador.esAdmin && (
                            <span className="ml-2 px-2 py-0.5 bg-[#590248]/20 text-[#590248] text-xs rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Panel de fechas */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="mr-2 text-[#590248]" size={22} />
                Fechas
              </h2>
              <div className="space-y-3">
                {solvencia.fechaAprobacion && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha de aprobación</p>
                      <p className="font-medium text-gray-900">{solvencia.fechaAprobacion}</p>
                    </div>
                  </div>
                )}

                {solvencia.fechaExpSolvencia && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <Calendar size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha de vencimiento</p>
                      <p className="font-medium text-gray-900">{solvencia.fechaExpSolvencia}</p>
                    </div>
                  </div>
                )}

                {solvencia.fechaRechazo && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <X size={20} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha de rechazo</p>
                      <p className="font-medium text-gray-900">{solvencia.fechaRechazo}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna 2 + 3: Detalles y acciones (ocupa 2 columnas) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Panel principal con costo y acciones */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              {/* Información de costo con fondo degradado */}
              <div className={`bg-gradient-to-r ${solvencia.statusSolicitud === 'exonerado'
                ? "from-teal-500 to-teal-700"
                : solvencia.costoRegularSolicitud >= 0
                  ? "from-[#D7008A] to-[#41023B]"
                  : "from-[#D7008A] to-[#41023B]"
                } p-6 text-white`}>
                <h2 className="text-xl font-semibold mb-2 flex items-center">
                  <DollarSign className="mr-2" size={24} />
                  {solvencia.costoRegularSolicitud >= 0
                    ? "Información de Pago"
                    : "Asignación de Costo"}
                </h2>

                {solvencia.costoRegularSolicitud >= 0 ? (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-white/80 mb-1">Costo de la solvencia</p>
                      <div className="text-3xl font-bold">
                        {solvencia.statusSolicitud === 'exonerado' ? (
                          <span>Exonerado</span>
                        ) : (
                          <span>
                            ${solvencia.costoRegularSolicitud < 0 ?
                              "Costo por definir" : solvencia.costoRegularSolicitud.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {solvencia.motivoExoneracion && (
                        <div className="mt-2 inline-flex items-center text-sm bg-white/20 rounded-full px-3 py-1">
                          <Ban size={14} className="mr-1" />
                          <span>Motivo: {solvencia.motivoExoneracion}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="mb-3">Esta solvencia requiere que se le asigne un costo o se exonere de pago.</p>
                  </div>
                )}
              </div>

              {/* Acciones principales o formulario de costo */}
              <div className="p-6">
                {/* Asignación de costo si es necesario */}
                {solvencia.costoRegularSolicitud < 0 && (
                  <div className="space-y-6">
                    <div className="bg-[white p-6 rounded-xl border
                    border-[#41023B] shadow-sm hover:shadow transition-shadow">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        Asignación de Costo
                      </h3>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monto a cobrar ($)
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-4 py-2.5 rounded-l-md
                          border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-lg">
                            $
                          </span>
                          <input
                            type="text"
                            value={costoNuevo}
                            onChange={(e) => {
                              // Permitir solo números y punto decimal
                              const value = e.target.value.replace(/[^0-9.]/g, '');
                              setCostoNuevo(value);
                            }}
                            className="flex-1 rounded-r-md px-4 py-2.5 border
                            border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-lg"
                            placeholder="0.00"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Ingrese el monto en dólares que se cobrará por esta solvencia.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleAsignarCosto}
                          disabled={!costoNuevo || parseFloat(costoNuevo) <= 0}
                          className={`flex-1 inline-flex items-center justify-center px-4 py-2.5 
                            ${!costoNuevo || parseFloat(costoNuevo) <= 0
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-gradient-to-r from-[#D7008A] to-[#41023B]' +
                              'hover:from-blue-700 hover:to-blue-800'}
                            text-white rounded-lg transition-colors text-base font-medium`}
                        >
                          <DollarSign className="mr-2" size={20} />
                          Asignar Costo
                        </button>

                        <button
                          onClick={() => setMostrarExoneracion(true)}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2.5
                          bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800
                          text-white rounded-lg transition-colors text-base font-medium"
                        >
                          <CheckCircle className="mr-2" size={20} />
                          Exonerar de Pago
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Acciones para solvencias en revisión con costo asignado */}
                {solvencia.statusSolicitud === "revisando" && solvencia.costoRegularSolicitud >= 0 && (
                  <div className="space-y-6">
                    {/* MODIFICADO: Selector de fecha de vencimiento con selects */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Calendar className="mr-2 text-orange-600" size={20} />
                        Fecha de vencimiento
                      </h3>
                      <div className="mb-4">
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <select name="fechaVencimientoRevisando" id="fechaVencimientoRevisando" className="w-full px-3 py-2 border border-gray-300 rounded-md
                              focus:ring-[#C40180] focus:border-[#C40180]"
                              onChange={(e) => handleSeleccionarFecha(e)}>
                                <option value="" disabled>Seleccione una fecha</option>
                                {fechasDeVencimiento.map(({trimestre, fecha}) => (
                                  <option key={trimestre} value={fecha} disabled={fechaActual > fecha}>{formatDate(fecha)}</option>
                                ))}
                            </select>
                          </div>
                        </div>
                        {/*
                        <div className="grid grid-cols-3 gap-3">

                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Día</label>
                            <select
                              value={diaVencimiento}
                              onChange={(e) => setDiaVencimiento(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md
                              focus:ring-[#C40180] focus:border-[#C40180]"
                            >
                              <option value="">Día</option>
                              {dias.map(dia => (
                                <option key={dia} value={dia}>{dia}</option>
                              ))}
                            </select>
                          </div>


                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Mes</label>
                            <select
                              value={mesVencimiento}
                              onChange={(e) => setMesVencimiento(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md
                              focus:ring-[#C40180] focus:border-[#C40180]"
                            >
                              <option value="">Mes</option>
                              {meses.map(mes => (
                                <option key={mes.valor} value={mes.valor}>{mes.nombre}</option>
                              ))}
                            </select>
                          </div>


                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Año</label>
                            <select
                              value={anioVencimiento}
                              onChange={(e) => setAnioVencimiento(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md
                              focus:ring-[#C40180] focus:border-[#C40180]"
                            >
                              <option value="">Año</option>
                              {anios.map(anio => (
                                <option key={anio} value={anio}>{anio}</option>
                              ))}
                            </select>
                          </div>
                        </div>*/}
                        <p className="mt-2 text-sm text-gray-500">
                          La solvencia será válida hasta esta fecha
                        </p>
                      </div>
                    </div>

                    {/* Acciones para solvencias en revisión */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        onClick={() => setMostrarConfirmacion(true)}
                        className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r
                        from-green-600 to-green-700 hover:from-green-700 hover:to-green-800
                        text-white rounded-lg transition-colors font-medium text-base"
                      >
                        <Check className="mr-2" size={20} />
                        Aprobar Solvencia
                      </button>

                      <button
                        onClick={() => setMostrarExoneracion(true)}
                        className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r
                        from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white
                        rounded-lg transition-colors font-medium text-base"
                      >
                        <CheckCircle className="mr-2" size={20} />
                        Exonerar
                      </button>

                      <button
                        onClick={() => setMostrarRechazo(true)}
                        className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r
                        from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg
                        transition-colors font-medium text-base"
                      >
                        <X className="mr-2" size={20} />
                        Rechazar
                      </button>
                    </div>
                  </div>
                )}

                {/* Información adicional - Motivo de rechazo */}
                {solvencia.statusSolicitud === "rechazado" && solvencia.motivoRechazo && (
                  <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                    <h3 className="text-lg font-medium text-red-800 mb-3 flex items-center">
                      <X className="mr-2" size={20} />
                      Motivo del Rechazo
                    </h3>
                    <p className="text-red-700">{solvencia.motivoRechazo}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      {mostrarConfirmacion && (
        <ConfirmacionModal
          onCancel={() => setMostrarConfirmacion(false)}
          onConfirm={handleAprobarSolvencia}
          titulo="Confirmar Aprobación"
          mensaje="¿Está seguro que desea aprobar esta solvencia? Una vez aprobada, no podrá revertir esta acción."
        />
      )}

      {mostrarRechazo && (
        <RechazoModal
          onCancel={() => setMostrarRechazo(false)}
          onConfirm={handleRechazarSolvencia}
        />
      )}

      {mostrarExoneracion && (
        <ExoneracionModal
          onCancel={() => setMostrarExoneracion(false)}
          onConfirm={handleExonerarPago}
        />
      )}
    </div>
  );
}
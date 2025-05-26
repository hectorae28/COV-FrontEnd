"use client"
import { Check, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchDataUsuario } from "@/api/endpoints/colegiado";

export default function SeleccionarTipoSolvencia({
  onFinalizarSolvencia,
  onClose,
  mostrarSeleccionColegiado = true,
  colegiados = [],
  colegiadoPreseleccionado = null,
  creadorInfo,
}) {

  // Lista de motivos para solvencia personalizada
  const MOTIVOS_PERSONALIZACION = [
    "Convenio especial",
    "Caso excepcional",
    "Servicio comunitario",
    "Acuerdo institucional",
    "Requerimiento específico",
    "Decisión directiva",
    "Otro"
  ];

  // Arrays para selects de fecha
  const dias = Array.from({ length: 31 }, (_, i) => i + 1);
  const meses = [
    { valor: 1, nombre: "Enero" },
    { valor: 2, nombre: "Febrero" },
    { valor: 3, nombre: "Marzo" },
    { valor: 4, nombre: "Abril" },
    { valor: 5, nombre: "Mayo" },
    { valor: 6, nombre: "Junio" },
    { valor: 7, nombre: "Julio" },
    { valor: 8, nombre: "Agosto" },
    { valor: 9, nombre: "Septiembre" },
    { valor: 10, nombre: "Octubre" },
    { valor: 11, nombre: "Noviembre" },
    { valor: 12, nombre: "Diciembre" }
  ];
  const anioActual = new Date().getFullYear();
  const anios = Array.from({ length: 10 }, (_, i) => anioActual + i);

  // Estado inicial del formulario (MODIFICADO)
  const [formData, setFormData] = useState({
    colegiadoId: colegiadoPreseleccionado ? colegiadoPreseleccionado.id : "",
    documentosAdjuntos: {},
    // NUEVO - Campos para solvencia personalizada
    montoPersonalizado: "",
    motivoPersonalizacion: "",
    observacionesPersonalizacion: "",
    // NUEVO - Campos para fecha de vencimiento
    diaVencimiento: "",
    mesVencimiento: "",
    anioVencimiento: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showColegiadosList, setShowColegiadosList] = useState(false);

  // Si hay un colegiado preseleccionado, establecer el ID en el formulario
  useEffect(() => {
    if (colegiadoPreseleccionado) {
      setFormData((prev) => ({
        ...prev,
        colegiadoId: colegiadoPreseleccionado.id,
      }));
    }

    // Establecer valores predeterminados para fecha de vencimiento (1 año desde hoy)
    const hoy = new Date();
    const unAnioDelante = new Date(hoy.setFullYear(hoy.getFullYear() + 1));

    setFormData(prev => ({
      ...prev,
      diaVencimiento: unAnioDelante.getDate(),
      mesVencimiento: unAnioDelante.getMonth() + 1,
      anioVencimiento: unAnioDelante.getFullYear()
    }));
  }, [colegiadoPreseleccionado]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Para el campo montoPersonalizado, eliminar caracteres no numéricos
    if (name === "montoPersonalizado") {
      const numericValue = value.replace(/[^0-9.]/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Seleccionar un colegiado de la lista
  const selectColegiado = (colegiado) => {
    setFormData((prev) => ({
      ...prev,
      colegiadoId: colegiado.id,
    }));
    setShowColegiadosList(false);
    setSearchTerm("");
    // Limpiar error si existe
    if (errors.colegiadoId) {
      setErrors((prev) => ({
        ...prev,
        colegiadoId: null,
      }));
    }
  };

  // Filtrar colegiados por término de búsqueda
  const colegiadosFiltrados = colegiados.filter(
    (colegiado) =>
      colegiado.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (colegiado.cedula && colegiado.cedula.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (colegiado.numeroRegistro && colegiado.numeroRegistro.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Obtener el colegiado seleccionado
  const colegiadoSeleccionado = colegiadoPreseleccionado || colegiados.find((c) => c.id === formData.colegiadoId);

  // Validar el formulario antes de enviar (MODIFICADO)
  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.colegiadoId) nuevosErrores.colegiadoId = "Debe seleccionar un colegiado";
    if (!formData.tipoSolvencia) nuevosErrores.tipoSolvencia = "Debe seleccionar una solvencia";

    // Validaciones específicas para solvencia personalizada
    if (formData.tipoSolvencia === "personalizada") {
      if (!formData.montoPersonalizado || parseFloat(formData.montoPersonalizado) <= 0) {
        nuevosErrores.montoPersonalizado = "Debe ingresar un monto válido mayor a cero";
      }
      if (!formData.motivoPersonalizacion) {
        nuevosErrores.motivoPersonalizacion = "Debe seleccionar un motivo para la personalización";
      }
      if (!formData.diaVencimiento || !formData.mesVencimiento || !formData.anioVencimiento) {
        nuevosErrores.fechaVencimiento = "Debe seleccionar una fecha de vencimiento completa";
      }
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar envío del formulario (MODIFICADO)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setIsSubmitting(true);
    try {
      // Crear objeto de nueva solvencia
      const nuevaSolvencia = {
        colegiadoId: formData.colegiadoId,
        fecha: new Date().toLocaleDateString(),
        exonerado: false, // Ya no hay exoneración en este paso
      };

      // Pasar la solvencia creada al componente padre
      onFinalizarSolvencia(nuevaSolvencia);
    } catch (error) {
      console.error("Error al crear solvencia:", error);
      setErrors({
        general: "Ocurrió un error al procesar la solvencia. Inténtelo nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      {/* Selección de colegiado (solo si es necesario) */}
      {mostrarSeleccionColegiado && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Colegiado <span className="text-red-500">*</span>
          </label>
          {errors.colegiadoId && (
            <div className="text-red-500 text-xs mb-2">
              {errors.colegiadoId}
            </div>
          )}
          <div className="relative">
            {colegiadoSeleccionado ? (
              <div className="flex items-center justify-between border rounded-lg p-3 mb-2">
                <div className="flex items-center">
                  <User size={20} className="text-gray-400 mr-2" />
                  <div>
                    <p className="font-medium">
                      {colegiadoSeleccionado.nombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      {colegiadoSeleccionado.cedula} ·{" "}
                      {colegiadoSeleccionado.numeroRegistro}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, colegiadoId: "" }));
                    setShowColegiadosList(true);
                  }}
                  className="text-[#C40180] text-sm hover:underline"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar colegiado por nombre, cédula o registro..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowColegiadosList(true);
                  }}
                  onFocus={() => setShowColegiadosList(true)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            )}
            {/* Lista de colegiados */}
            {showColegiadosList && !colegiadoSeleccionado && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {colegiadosFiltrados.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">
                    No se encontraron colegiados
                  </div>
                ) : (
                  colegiadosFiltrados.map((colegiado) => (
                    <div
                      key={colegiado.id}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      onClick={() => selectColegiado(colegiado)}
                    >
                      <p className="font-medium">{colegiado.nombre}</p>
                      <p className="text-xs text-gray-500">
                        {colegiado.cedula} · {colegiado.numeroRegistro}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selección de solvencia (MODIFICADO - cambio de título y opciones) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Solvencia <span className="text-red-500">*</span>
        </label>
        {errors.tipoSolvencia && (
          <div className="text-red-500 text-xs mb-2">
            {errors.tipoSolvencia}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.keys(OPCIONES_SOLVENCIA).map(key => {
            const opcion = OPCIONES_SOLVENCIA[key];
            return (
              <div
                key={opcion.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${formData.tipoSolvencia === opcion.id
                    ? "border-[#C40180] bg-purple-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                  }`}
                onClick={() => setFormData(prev => ({ ...prev, tipoSolvencia: opcion.id }))}
              >
                <div className="flex justify-between mb-2">
                  <div className="font-medium text-gray-800">{opcion.nombre}</div>
                  {formData.tipoSolvencia === opcion.id && (
                    <div className="bg-[#C40180] text-white rounded-full p-1">
                      <Check size={16} />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">{opcion.descripcion}</p>
                <div className="flex justify-between items-center text-sm">
                  {opcion.id !== "personalizada" ? (
                    <span className="font-medium text-[#C40180]">${opcion.costo.toFixed(2)}</span>
                  ) : (
                    <span className="font-medium text-[#C40180]">Monto personalizado</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NUEVO - Sección para solvencia personalizada */}
      {formData.tipoSolvencia === "personalizada" && (
        <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles de la Solvencia Personalizada</h3>

          {/* Campo de monto personalizado */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto de la solvencia <span className="text-red-500">*</span>
            </label>
            {errors.montoPersonalizado && (
              <div className="text-red-500 text-xs mb-2">
                {errors.montoPersonalizado}
              </div>
            )}
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                $
              </span>
              <input
                type="text"
                name="montoPersonalizado"
                value={formData.montoPersonalizado}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:ring-[#C40180] focus:border-[#C40180]"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Selección de motivo de personalización */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de personalización <span className="text-red-500">*</span>
            </label>
            {errors.motivoPersonalizacion && (
              <div className="text-red-500 text-xs mb-2">
                {errors.motivoPersonalizacion}
              </div>
            )}
            <select
              name="motivoPersonalizacion"
              value={formData.motivoPersonalizacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#C40180] focus:border-[#C40180]"
            >
              <option value="">Seleccione un motivo</option>
              {MOTIVOS_PERSONALIZACION.map(motivo => (
                <option key={motivo} value={motivo}>{motivo}</option>
              ))}
            </select>
          </div>

          {/* Selección de fecha de vencimiento */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de vencimiento <span className="text-red-500">*</span>
            </label>
            {errors.fechaVencimiento && (
              <div className="text-red-500 text-xs mb-2">
                {errors.fechaVencimiento}
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              {/* Select para día */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Día</label>
                <select
                  name="diaVencimiento"
                  value={formData.diaVencimiento}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#C40180] focus:border-[#C40180]"
                >
                  <option value="">Día</option>
                  {dias.map(dia => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
              </div>

              {/* Select para mes */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mes</label>
                <select
                  name="mesVencimiento"
                  value={formData.mesVencimiento}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#C40180] focus:border-[#C40180]"
                >
                  <option value="">Mes</option>
                  {meses.map(mes => (
                    <option key={mes.valor} value={mes.valor}>{mes.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Select para año */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Año</label>
                <select
                  name="anioVencimiento"
                  value={formData.anioVencimiento}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#C40180] focus:border-[#C40180]"
                >
                  <option value="">Año</option>
                  {anios.map(anio => (
                    <option key={anio} value={anio}>{anio}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Observaciones opcionales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones (opcional)
            </label>
            <textarea
              name="observacionesPersonalizacion"
              value={formData.observacionesPersonalizacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#C40180] focus:border-[#C40180]"
              rows="2"
              placeholder="Detalles adicionales sobre esta solvencia personalizada..."
            ></textarea>
          </div>
        </div>
      )}

      {/* Mensaje de error general */}
      {errors.general && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
          {errors.general}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`cursor-pointer px-4 py-2 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-lg hover:opacity-90 flex items-center gap-2 ${isSubmitting ? "opacity-70" : ""
            }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Procesando...
            </>
          ) : (
            <>
              Crear solvencia
            </>
          )}
        </button>
      </div>
    </form>
  );
}
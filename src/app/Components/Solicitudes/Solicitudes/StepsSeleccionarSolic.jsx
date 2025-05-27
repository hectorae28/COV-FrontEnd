"use client"

import useDataListaColegiados from "@/store/ListaColegiadosData"
import { useSolicitudesStore } from "@/store/SolicitudesStore"
import { Building, Check, FileCheck, FileText, Search, ShoppingCart, Trash2, User } from "lucide-react"
import { useEffect, useState } from "react"
import SeleccionarInstitucionesModal from "./SelectInstitutionsModal"

export default function SeleccionarSolicitudesStep({
  onFinalizarSolicitud,
  onClose,
  mostrarSeleccionColegiado = true,
  colegiadoPreseleccionado = null,
  creadorInfo,
  tipoSolicitudPreseleccionado = null,
  isAdmin = false
}) {
  const tipos_solicitud = useSolicitudesStore((state) => state.tipos_solicitud)
  const loading = useSolicitudesStore((state) => state.loading)
  const colegiados = useDataListaColegiados((state) => state.colegiados)
  const fetchColegiados = useDataListaColegiados((state) => state.fetchColegiados)
  const getColegiado = useDataListaColegiados((state) => state.getColegiado)
  const [formData, setFormData] = useState({
    colegiadoId: colegiadoPreseleccionado ? colegiadoPreseleccionado.id : "",
    urgente: false,
    descripcion: "",
  })
  const [documentosAdjuntos, setDocumentosAdjuntos] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showColegiadosList, setShowColegiadosList] = useState(false)

  // Estados para gestionar las funcionalidades
  const [tiposSeleccionados, setTiposSeleccionados] = useState([])
  const [subtiposConstanciaSeleccionados, setSubtiposConstanciaSeleccionados] = useState([])
  const [itemsCarrito, setItemsCarrito] = useState([])
  const [totalCarrito, setTotalCarrito] = useState(0)

  // Nuevos estados para el modal de instituciones y bloqueo
  const [mostrarModalInstituciones, setMostrarModalInstituciones] = useState(false)
  const [tipoConstanciaParaInstituciones, setTipoConstanciaParaInstituciones] = useState(null)
  const [institucionesColegiado, setInstitucionesColegiado] = useState([])
  const [bloqueadoPorUsuario, setBloqueadoPorUsuario] = useState(true)

  // Constancias que requieren selección de instituciones
  const CONSTANCIAS_CON_INSTITUCIONES = [
    'continuidad laboral',
    'libre ejercicio',
    'declaración de habilitación'
  ]

  const fetchColegiadosData = async () => {
    try {
      await fetchColegiados(1, 10, searchTerm);
    } catch (error) {
      console.error("Error al cargar colegiados:", error);
    }
  };
  const cargarInstitucionesColegiado = async (colegiadoId) => {
    try {
      // Datos de prueba fijos - siempre cargar estas 3 instituciones
      const colegiado = await getColegiado(colegiadoId)
      setInstitucionesColegiado(colegiado.recaudos.instituciones);
    } catch (error) {
      console.error("Error cargando instituciones:", error);
    }
  };

  // Efecto para manejar el colegiado preseleccionado
  useEffect(() => {
    if (colegiadoPreseleccionado) {
      setFormData((prev) => ({
        ...prev,
        colegiadoId: colegiadoPreseleccionado.id,
      }));
    }
  }, [colegiadoPreseleccionado]);

  // Efecto para manejar el bloqueo por usuario
  useEffect(() => {
    if (colegiadoPreseleccionado || formData.colegiadoId) {
      setBloqueadoPorUsuario(false);
      // Cargar instituciones del colegiado
      const colegiadoId = colegiadoPreseleccionado?.id || formData.colegiadoId;
      cargarInstitucionesColegiado(colegiadoId);
    } else if (mostrarSeleccionColegiado) {
      setBloqueadoPorUsuario(true);
    } else {
      setBloqueadoPorUsuario(false);
    }
  }, [colegiadoPreseleccionado, formData.colegiadoId, mostrarSeleccionColegiado]);

  useEffect(() => {
    fetchColegiadosData()
  }, [searchTerm]);

  // Efecto para manejar el tipo de solicitud preseleccionado
  useEffect(() => {
    if (!tipos_solicitud || !tipos_solicitud[0]?.costo) return;

    if (tipoSolicitudPreseleccionado) {
      // Convertir a formato correcto (primera letra mayúscula, resto minúsculas)
      let tipoFormateado = "";

      // Manejo especial para "multiple" (se ignora, ya que es para selección múltiple)
      if (tipoSolicitudPreseleccionado === "multiple") {
        return;
      }

      // Para tipos específicos:
      if (tipoSolicitudPreseleccionado === "constancia") {
        tipoFormateado = "Constancia";
      } else if (tipoSolicitudPreseleccionado === "carnet") {
        tipoFormateado = "Carnet";
      } else if (tipoSolicitudPreseleccionado === "especializacion") {
        tipoFormateado = "Especializacion";
      }

      // Verificamos si existe el tipo y lo añadimos a los seleccionados
      if (tipos_solicitud[tipoFormateado]) {
        // Pre-seleccionar el tipo en la lista de tipos
        setTiposSeleccionados([tipoFormateado]);

        // Si es una constancia, no hacemos nada más (el usuario debe seleccionar el subtipo)
        if (tipoFormateado !== "Constancia") {
          // Para los demás tipos, pre-agregar al carrito
          const tipoInfo = tipos_solicitud[tipoFormateado];
          // Verificamos que tipoInfo y sus propiedades existan antes de usarlas
          if (tipoInfo && tipoInfo.codigo && tipoInfo.nombre && tipoInfo.costo) {
            const nuevoItem = {
              id: `${tipoInfo.codigo}-${Date.now()}`,
              tipo: tipoFormateado,
              subtipo: null,
              nombre: tipoInfo.nombre,
              costo: tipoInfo.costo,
              exonerado: false,
              codigo: tipoInfo.codigo,
              documentosRequeridos: tipoInfo.documentosRequeridos ?
                tipoInfo.documentosRequeridos.map(doc => doc.displayName) : []
            };
            setItemsCarrito([nuevoItem]);
            actualizarTotal([nuevoItem]);
          }
        }
      }
    }
  }, [tipoSolicitudPreseleccionado, tipos_solicitud]);

  // Función para agregar un item al carrito
  const agregarAlCarrito = (tipo) => {
    if (tipo === "Constancia" && subtiposConstanciaSeleccionados.length === 0) {
      alert("Debe seleccionar al menos un tipo específico de constancia")
      return
    }
    if (tipo === "Constancia") {
      // No hacemos nada aquí, ya que las constancias se agregan al seleccionar el subtipo
      return
    } else {
      // Para otros tipos de solicitud
      const tipoInfo = tipos_solicitud[tipo]
      // Verificar que tipoInfo exista
      if (!tipoInfo) return;

      const nuevoItem = {
        id: `${tipoInfo.codigo}-${Date.now()}`,
        tipo: tipo,
        subtipo: null,
        nombre: tipoInfo.nombre,
        costo: tipoInfo.costo || { monto: 0 }, // Valor predeterminado para costo
        exonerado: false,
        codigo: tipoInfo.codigo,
        documentosRequeridos: tipoInfo.documentosRequeridos ?
          tipoInfo.documentosRequeridos.map(doc => doc.displayName) : [],
      }
      setItemsCarrito([...itemsCarrito, nuevoItem])
      actualizarTotal([...itemsCarrito, nuevoItem])
    }
  }

  // Función para actualizar el total del carrito con protección contra undefined
  const actualizarTotal = (items) => {
    if (!items || !Array.isArray(items)) {
      setTotalCarrito(0);
      return;
    }

    const nuevoTotal = items.reduce((sum, item) => {
      // Verificar que item.costo y item.costo.monto existen
      if (!item || !item.costo || typeof item.costo.monto === 'undefined') {
        return sum;
      }
      return sum + (item.exonerado ? 0 : item.costo.monto);
    }, 0);

    setTotalCarrito(nuevoTotal);
  }

  // Función para eliminar un item del carrito
  const eliminarDelCarrito = (itemId) => {
    // Encontrar el item a eliminar para obtener su tipo
    const itemAEliminar = itemsCarrito.find((item) => item.id === itemId)
    if (itemAEliminar) {
      // Eliminar del carrito
      const nuevosItems = itemsCarrito.filter((item) => item.id !== itemId)
      setItemsCarrito(nuevosItems)
      actualizarTotal(nuevosItems)
      // Actualizar la selección en la lista de tipos
      if (itemAEliminar.tipo === "Constancia") {
        // Si era una constancia, quitar la selección del subtipo
        if (itemAEliminar.subtipo) {
          // Verificar si hay más items del mismo subtipo
          const hayMasDelMismoSubtipo = nuevosItems.some(
            item => item.tipo === "Constancia" && item.subtipo === itemAEliminar.subtipo
          );

          // Si no hay más del mismo subtipo, quitar de la selección
          if (!hayMasDelMismoSubtipo) {
            setSubtiposConstanciaSeleccionados((prev) =>
              prev.filter((subtipo) => subtipo !== itemAEliminar.subtipo)
            );
          }
        }
        // Verificar si aún hay otras constancias
        const sigueHabiendoConstancias = nuevosItems.some((item) => item.tipo === "Constancia")
        // Si no hay más constancias, quitar también del tipo principal
        if (!sigueHabiendoConstancias) {
          setTiposSeleccionados((prev) => prev.filter((tipo) => tipo !== "Constancia"))
        }
      } else {
        // Para otros tipos, verificar si aún hay otros items del mismo tipo
        const sigueHabiendoDelMismoTipo = nuevosItems.some((item) => item.tipo === itemAEliminar.tipo)
        // Si no hay más items del mismo tipo, quitar de la selección
        if (!sigueHabiendoDelMismoTipo) {
          setTiposSeleccionados((prev) => prev.filter((tipo) => tipo !== itemAEliminar.tipo))
        }
      }
    }
  }

  // Función para toggle de exoneración de pago
  const toggleExoneracion = (itemId) => {
    const nuevosItems = itemsCarrito.map((item) => {
      if (item.id === itemId) {
        return { ...item, exonerado: !item.exonerado }
      }
      return item
    })
    setItemsCarrito(nuevosItems)
    actualizarTotal(nuevosItems)
  }

  // Función para exonerar todos los pagos
  const exonerarTodos = () => {
    const nuevosItems = itemsCarrito.map((item) => ({
      ...item,
      exonerado: true,
    }))
    setItemsCarrito(nuevosItems)
    setTotalCarrito(0)
  }

  // Manejar selección de tipos
  const handleSeleccionTipo = (tipo) => {
    // Verificar que tipos_solicitud existe y contiene el tipo
    if (!tipos_solicitud || !tipos_solicitud[tipo]) return;

    // Ignorar si es Solvencia
    if (tipo === "Solvencia") {
      return
    }

    // Para Constancia, solo toggle de selección
    if (tipo === "Constancia") {
      // Si ya está seleccionada, la quitamos
      if (tiposSeleccionados.includes(tipo)) {
        setTiposSeleccionados(tiposSeleccionados.filter((t) => t !== tipo))
        // También limpiamos los subtipos seleccionados
        setSubtiposConstanciaSeleccionados([])
        // Y eliminamos todas las constancias del carrito
        const nuevosItems = itemsCarrito.filter((item) => item.tipo !== "Constancia")
        setItemsCarrito(nuevosItems)
        actualizarTotal(nuevosItems)
      } else {
        // Si no está, la agregamos
        setTiposSeleccionados([...tiposSeleccionados, tipo])
      }
    } else {
      // Para otros tipos, toggle normal y agregar/quitar automáticamente del carrito
      if (tiposSeleccionados.includes(tipo)) {
        // Si está seleccionado, lo quitamos
        setTiposSeleccionados(tiposSeleccionados.filter((t) => t !== tipo))
        // También eliminar del carrito
        const nuevosItems = itemsCarrito.filter((item) => item.tipo !== tipo)
        setItemsCarrito(nuevosItems)
        actualizarTotal(nuevosItems)
      } else {
        // Si no está seleccionado, lo agregamos
        setTiposSeleccionados([...tiposSeleccionados, tipo])
        // Y agregamos automáticamente al carrito
        const tipoInfo = tipos_solicitud[tipo]
        // Verificar que tipoInfo y sus propiedades existen
        if (!tipoInfo) return;

        const nuevoItem = {
          id: `${tipoInfo.codigo}`,
          tipo: tipo,
          subtipo: null,
          nombre: tipoInfo.nombre || "",
          costo: tipoInfo.costo || { monto: 0 },
          exonerado: false,
          codigo: tipoInfo.codigo || "",
          documentosRequeridos: tipoInfo.documentosRequeridos ? [...tipoInfo.documentosRequeridos] : [],
        }
        // Actualizar carrito
        const nuevosItems = [...itemsCarrito, nuevoItem]
        setItemsCarrito(nuevosItems)
        actualizarTotal(nuevosItems)
      }
    }
  }

  // Función para manejar la selección de subtipos de constancia
  const handleSeleccionSubtipoConstancia = (subtipo) => {
    // Verificar que subtipo existe y tiene las propiedades requeridas
    if (!subtipo || !subtipo.nombre) return;

    // Verificar si requiere selección de instituciones
    if (CONSTANCIAS_CON_INSTITUCIONES.includes(subtipo.nombre.toLowerCase())) {
      // NUEVO: Obtener instituciones ya seleccionadas para este subtipo
      const institucionesYaSeleccionadas = itemsCarrito
        .filter(item => item.tipo === "Constancia" && item.subtipo === subtipo.nombre)
        .map(item => item.institucionId)
        .filter(Boolean); // Filtrar valores undefined/null

      // Mostrar modal de instituciones
      setTipoConstanciaParaInstituciones({
        ...subtipo,
        tipoCompleto: `Constancia: ${subtipo.nombre}`,
        institucionesYaSeleccionadas // NUEVO: Pasar las instituciones ya seleccionadas
      });
      setMostrarModalInstituciones(true);
      return;
    }

    // Comportamiento normal para otras constancias...
    const yaSeleccionado = subtiposConstanciaSeleccionados.includes(subtipo.nombre)
    if (yaSeleccionado) {
      // Si ya está seleccionado, lo quitamos
      setSubtiposConstanciaSeleccionados((prev) => prev.filter((nombre) => nombre !== subtipo.nombre))
      // También eliminamos este subtipo del carrito
      const nuevosItems = itemsCarrito.filter(
        (item) => !(item.tipo === "Constancia" && item.subtipo === subtipo.nombre),
      )
      setItemsCarrito(nuevosItems)
      actualizarTotal(nuevosItems)
    } else {
      // Si no está seleccionado, lo agregamos
      setSubtiposConstanciaSeleccionados((prev) => [...prev, subtipo.nombre])
      // Y agregamos al carrito - Constancias no tienen documentos requeridos
      const nuevoItem = {
        id: `${subtipo.codigo || "constancia"}-${Date.now()}`,
        tipo: "Constancia",
        subtipo: subtipo.nombre,
        nombre: `Constancia: ${subtipo.nombre}`,
        costo: subtipo.costo || { monto: 0 },
        exonerado: false,
        codigo: subtipo.codigo || "constancia",
        documentosRequeridos: [], // Constancias no tienen documentos requeridos
      }
      const nuevosItems = [...itemsCarrito, nuevoItem]
      setItemsCarrito(nuevosItems)
      actualizarTotal(nuevosItems)
    }
  }

  // Función para manejar la confirmación de instituciones
  const handleConfirmarInstituciones = (resultado) => {
    if (!tipoConstanciaParaInstituciones) return;

    const { nuevas: institucionesNuevas, eliminadas: institucionesEliminadas } = resultado;

    // NUEVO: Primero eliminar las instituciones deseleccionadas del carrito
    let itemsActualizados = [...itemsCarrito];

    if (institucionesEliminadas && institucionesEliminadas.length > 0) {
      itemsActualizados = itemsActualizados.filter(item => {
        // Mantener el item si NO es una constancia del tipo actual con institución eliminada
        if (item.tipo === "Constancia" &&
          item.subtipo === tipoConstanciaParaInstituciones.nombre &&
          item.institucionId &&
          institucionesEliminadas.includes(item.institucionId)) {
          return false; // Eliminar este item
        }
        return true; // Mantener este item
      });
    }

    // Luego agregar las nuevas instituciones seleccionadas
    if (institucionesNuevas && institucionesNuevas.length > 0) {
      const nuevosItems = institucionesNuevas.map((instData, index) => ({
        id: `${tipoConstanciaParaInstituciones.codigo}-${instData.institucionId}-${Date.now()}-${index}`,
        tipo: "Constancia",
        subtipo: tipoConstanciaParaInstituciones.nombre,
        nombre: `Constancia: ${tipoConstanciaParaInstituciones.nombre} - ${instData.institucionNombre}`,
        costo: tipoConstanciaParaInstituciones.costo || { monto: 0 },
        exonerado: false,
        codigo: tipoConstanciaParaInstituciones.codigo || "constancia",
        documentosRequeridos: [],
        // Información adicional de la institución
        institucionId: instData.institucionId,
        institucionNombre: instData.institucionNombre,
        institucionDireccion: instData.institucionDireccion,
        institucionVerificacion: instData.verificacionStatus
      }));

      itemsActualizados = [...itemsActualizados, ...nuevosItems];
    }

    // Actualizar el carrito con los cambios
    setItemsCarrito(itemsActualizados);
    actualizarTotal(itemsActualizados);

    // NUEVO: Verificar si aún quedan constancias de este subtipo
    const quedanConstanciasDeEsteTipo = itemsActualizados.some(
      item => item.tipo === "Constancia" && item.subtipo === tipoConstanciaParaInstituciones.nombre
    );

    // Si no quedan constancias de este tipo, quitar de subtipos seleccionados
    if (!quedanConstanciasDeEsteTipo) {
      setSubtiposConstanciaSeleccionados(prev =>
        prev.filter(subtipo => subtipo !== tipoConstanciaParaInstituciones.nombre)
      );

      // También verificar si quedan otras constancias
      const quedanOtrasConstancias = itemsActualizados.some(item => item.tipo === "Constancia");
      if (!quedanOtrasConstancias) {
        setTiposSeleccionados(prev => prev.filter(tipo => tipo !== "Constancia"));
      }
    } else {
      // Si quedan constancias, asegurar que el subtipo esté en la lista
      if (!subtiposConstanciaSeleccionados.includes(tipoConstanciaParaInstituciones.nombre)) {
        setSubtiposConstanciaSeleccionados(prev => [...prev, tipoConstanciaParaInstituciones.nombre]);
      }
    }

    // Cerrar modal
    setMostrarModalInstituciones(false);
    setTipoConstanciaParaInstituciones(null);
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  // Manejar subida de archivos
  const handleFileChange = (e, itemId) => {
    const file = e.target.files[0]
    if (file) {
      setDocumentosAdjuntos((prev) => ({
        ...prev,
        [itemId]: file
      }))
    }
  }

  // Seleccionar un colegiado de la lista
  const selectColegiado = (colegiado) => {
    if (!colegiado) return;

    setFormData((prev) => ({
      ...prev,
      colegiadoId: colegiado.id,
    }))
    setShowColegiadosList(false)
    setSearchTerm("")
    // Limpiar error si existe
    if (errors.colegiadoId) {
      setErrors((prev) => ({
        ...prev,
        colegiadoId: null,
      }))
    }
  }

  // Filtrar colegiados por término de búsqueda
  const colegiadosFiltrados = colegiados || []

  // Obtener el colegiado seleccionado
  const colegiadoSeleccionado = colegiadoPreseleccionado || colegiados.find((c) => c && c.id === formData.colegiadoId)

  // Verificar si todo está exonerado
  const todoExonerado = totalCarrito === 0 && itemsCarrito.length > 0

  // Validar el formulario antes de enviar
  const validarFormulario = () => {
    const nuevosErrores = {}
    if (!formData.colegiadoId) nuevosErrores.colegiadoId = "Debe seleccionar un colegiado"
    if (itemsCarrito.length === 0) nuevosErrores.items = "Debe agregar al menos un tipo de solicitud"

    const documentosFaltantes = []
    itemsCarrito.forEach(item => {
      if (!item || !item.documentosRequeridos) return;

      item.documentosRequeridos.forEach(doc => {
        // Verificar si doc es un objeto o un string
        const campo = typeof doc === 'object' ? doc.campo : doc;
        if (!documentosAdjuntos[campo] ||
          (documentosAdjuntos[campo] instanceof File && documentosAdjuntos[campo].size === 0)) {
          documentosFaltantes.push(typeof doc === 'object' ? doc.displayName : doc);
        }
      })
    })

    if (documentosFaltantes.length > 0) {
      nuevosErrores.documentos = { text: `Debe adjuntar los siguientes documentos:`, list: documentosFaltantes }
    }

    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setIsSubmitting(true);
    try {
      // Crear lista de documentos requeridos
      const todosDocumentosRequeridos = [];
      itemsCarrito.forEach((item) => {
        if (!item || !item.documentosRequeridos) return;

        item.documentosRequeridos.forEach((doc) => {
          if (!todosDocumentosRequeridos.includes(doc)) {
            todosDocumentosRequeridos.push(doc);
          }
        });
      });
      // Determinar el tipo principal para mostrar
      let tipoMostrar = "";
      if (itemsCarrito.length > 1) {
        tipoMostrar = `Solicitud múltiple (${itemsCarrito.length} ítems)`;
      } else if (itemsCarrito.length === 1) {
        tipoMostrar = itemsCarrito[0]?.nombre || "Solicitud";
      }

      // Verificar que el colegiado seleccionado existe
      if (!colegiadoSeleccionado) {
        throw new Error("No se pudo identificar al colegiado seleccionado");
      }

      // Crear objeto de nueva solicitud
      const nuevaSolicitud = {
        id: `sol-${Date.now()}`,
        tipo: tipoMostrar,
        colegiadoId: formData.colegiadoId,
        colegiadoNombre:
          (colegiadoSeleccionado.recaudos?.persona?.nombre) ||
          colegiadoSeleccionado.firstname ||
          "Colegiado",
        fecha: new Date().toLocaleDateString(),
        estado: todoExonerado ? "Exonerada" : "Pendiente",
        descripcion: formData.descripcion || "",
        referencia: `REF-${Date.now().toString().slice(-6)}`,
        costo: totalCarrito,
        documentosRequeridos: todosDocumentosRequeridos,
        documentosAdjuntos: documentosAdjuntos,
        itemsSolicitud: itemsCarrito,
        comprobantePago: null,
        estadoPago: todoExonerado ? "Exonerado" : "Pendiente de verificación",
        fechaCompletado: new Date().toLocaleDateString(),
        // Información del creador
        creador: {
          username: creadorInfo?.name || "Usuario",
          email: creadorInfo?.email || "usuario@ejemplo.com",
          esAdmin:
            creadorInfo?.role === "admin" || creadorInfo?.isAdmin || false,
          fecha: new Date().toISOString(),
          tipo: "creado",
        },
      };
      // Pasar la solicitud creada al componente padre
      onFinalizarSolicitud(nuevaSolicitud);
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      setErrors({
        general:
          "Ocurrió un error al procesar la solicitud. Inténtelo nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrar tipos de solicitud para excluir "Solvencia"
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="p-6 relative">
          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C40180]"></div>
            </div>
          )}
          {/* Error state */}
          {!loading && !tipos_solicitud && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-800 mb-4">
              <p>Error al cargar los tipos de solicitud. Por favor, intente nuevamente.</p>
            </div>
          )}
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
                          {colegiadoSeleccionado.recaudos?.persona?.nombre || "Nombre no disponible"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {colegiadoSeleccionado.recaudos?.persona?.identificacion || "ID no disponible"} ·{" "}
                          COV: {colegiadoSeleccionado.num_cov || "Nº no disponible"}
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
                        colegiado && colegiado.id && (
                          <div
                            key={colegiado.id}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                            onClick={() => selectColegiado(colegiado)}
                          >
                            <p className="font-medium">{colegiado.recaudos?.persona?.nombre || "Nombre no disponible"}</p>
                            <p className="text-xs text-gray-500">
                              {colegiado.recaudos?.persona?.identificacion || "ID no disponible"} · COV: {colegiado.num_cov || "Nº no disponible"}
                            </p>
                          </div>
                        )
                      ))
                    )}
                  </div>
                )}
                {/* Overlay de bloqueo */}
                {mostrarSeleccionColegiado && bloqueadoPorUsuario && (
                  <strong className="mt-2 ml-8 text-[10px] text-[#590248]">
                    Debe seleccionar un colegiado para continuar con la solicitud.
                  </strong>
                )}
              </div>
            </div>
          )}

          <div className={`transition-opacity duration-200 ${bloqueadoPorUsuario ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Selección de tipos de solicitud */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tipoSolicitudPreseleccionado &&
                  tipoSolicitudPreseleccionado !== "multiple"
                  ? "Tipo de solicitud seleccionado"
                  : "Tipos de solicitud"}{" "}
                <span className="text-red-500">*</span>
              </label>
              {errors.items && (
                <div className="text-red-500 text-xs mb-2">{errors.items}</div>
              )}
              {/* Si no hay tipo preseleccionado o es "multiple", mostrar todos los tipos*/}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {tipos_solicitud && Object.keys(tipos_solicitud).map((tipo) => (
                  <div
                    key={tipo}
                    className={`
                                          border rounded-md p-3 cursor-pointer transition-colors
                                          ${tiposSeleccionados.includes(tipo)
                        ? "border-[#C40180] bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                      }`}
                    onClick={() => handleSeleccionTipo(tipo)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {tipos_solicitud[tipo]?.nombre || tipo}
                        </p>
                        {tipo !== "Constancia" ? (
                          <p className="text-xs text-gray-500">
                            Costo: ${tipos_solicitud[tipo]?.costo?.monto?.toFixed(2) || "0.00"}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Requiere selección de tipo específico
                          </p>
                        )}
                      </div>
                      {tiposSeleccionados.includes(tipo) && (
                        <div className="bg-[#C40180] text-white rounded-full p-1">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtipos de constancia si está seleccionada */}
              {tiposSeleccionados.includes("Constancia") && tipos_solicitud?.Constancia?.subtipos && (
                <div className="border border-[#C40180] rounded-md p-4 mb-4 bg-purple-50">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">
                    Seleccione los tipos de constancia que necesita:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tipos_solicitud.Constancia.subtipos.map((subtipo) => (
                      subtipo && subtipo.codigo && (
                        <div
                          key={subtipo.codigo}
                          className={`
                                            border rounded p-2 cursor-pointer
                                            ${subtiposConstanciaSeleccionados.includes(
                            subtipo.nombre
                          )
                              ? "border-[#C40180] bg-white"
                              : "border-gray-200 hover:border-gray-300"
                            }`}
                          onClick={() => handleSeleccionSubtipoConstancia(subtipo)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm">{subtipo.nombre}</p>
                              <p className="text-xs text-gray-500">
                                ${subtipo.costo?.monto?.toFixed(2) || "0.00"}
                              </p>
                            </div>
                            {subtiposConstanciaSeleccionados.includes(
                              subtipo.nombre
                            ) && <Check size={16} className="text-[#C40180]" />}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Carrito de compras */}
            {errors.documentos && (
              <div className="text-red-500 text-xs mb-2">
                {errors.documentos.text}
              </div>
            )}
            <div className="mb-6 border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                <h3 className="font-medium text-gray-800 flex items-center">
                  <ShoppingCart size={18} className="mr-2 text-[#C40180]" />
                  Servicios seleccionados
                </h3>
                {itemsCarrito.length > 0 && (
                  <span className="text-sm text-gray-600">
                    Total:{" "}
                    <strong className="text-[#C40180]">
                      ${totalCarrito.toFixed(2)}
                    </strong>
                  </span>
                )}
              </div>
              {itemsCarrito.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Aún no ha agregado servicios a su solicitud
                </div>
              ) : (
                <div>
                  {/* Lista de items */}
                  <ul className="divide-y">
                    {itemsCarrito.map((item) => (
                      item && item.id && (
                        <li key={item.id} className="p-3">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex-1">
                              <span className="font-medium">{item.nombre || "Sin nombre"}</span>
                              {/* Mostrar información de institución si existe */}
                              {item.institucionNombre && (
                                <p className="text-xs text-gray-500 mt-1">
                                  <Building size={12} className="inline mr-1" />
                                  {item.institucionNombre}
                                </p>
                              )}
                              <span
                                className={`ml-3 ${item.exonerado
                                  ? "line-through text-gray-400"
                                  : "text-[#C40180]"
                                  }`}
                              >
                                ${item.costo?.monto?.toFixed(2) || "0.00"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              {isAdmin && (
                                <label className="inline-flex items-center cursor-pointer">
                                  <span className="text-xs text-gray-600 mr-2">
                                    Exonerar
                                  </span>
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={item.exonerado}
                                    onChange={() => toggleExoneracion(item.id)}
                                  />
                                  <div className="relative w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                              )}
                              <button
                                type="button"
                                onClick={() => eliminarDelCarrito(item.id)}
                                className="cursor-pointer text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          {/* Documentos requeridos para este item - Solo mostrar si no es constancia */}
                          {item.tipo !== "Constancia" &&
                            item.documentosRequeridos &&
                            item.documentosRequeridos.length > 0 && (
                              <div className="pl-2 border-l-2 border-gray-200 mt-1">
                                <p className="text-xs text-gray-500 mb-1">
                                  Documentos requeridos:
                                </p>
                                <ul className="space-y-2">
                                  {item.documentosRequeridos.map((doc, index) => {
                                    // Manejar tanto el caso donde doc es un objeto como donde es un string
                                    const displayName = typeof doc === 'object' ? doc.displayName : doc;
                                    const campo = typeof doc === 'object' ? doc.campo : doc;

                                    return (
                                      <li
                                        key={`${item.id}-${index}`}
                                        className="flex items-center"
                                      >
                                        <FileText
                                          size={14}
                                          className="text-gray-400 mr-1"
                                        />
                                        <span className={`text-xs ${errors?.documentos?.list?.includes(displayName) ? "text-red-500" : ""}`}>
                                          {displayName}
                                        </span>
                                        <input
                                          type="file"
                                          id={`documento-${item.id}-${index}`}
                                          onChange={(e) =>
                                            handleFileChange(e, campo)
                                          }
                                          className="hidden"
                                          accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <label
                                          htmlFor={`documento-${item.id}-${index}`}
                                          className="ml-2 text-xs text-blue-600 cursor-pointer hover:underline"
                                        >
                                          {documentosAdjuntos[campo] ? (
                                            <span className="text-green-600 flex items-center">
                                              <FileCheck size={14} className="mr-1" />
                                              {documentosAdjuntos[campo].name.length > 15
                                                ? documentosAdjuntos[campo].name.substring(0, 15) + "..."
                                                : documentosAdjuntos[campo].name}
                                            </span>
                                          ) : (
                                            "Adjuntar"
                                          )}
                                        </label>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}
                        </li>
                      )
                    ))}
                  </ul>
                  {/* Acciones del carrito */}

                  <div className="bg-gray-50 p-3 border-t flex justify-between items-center">
                    <span className="text-sm font-bold">
                      Total a pagar: ${totalCarrito.toFixed(2)}
                    </span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={exonerarTodos}
                        className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                      >
                        Exonerar todos
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mensaje si todo está exonerado */}
            {todoExonerado && (
              <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-lg text-green-800">
                <h3 className="font-medium flex items-center mb-2">
                  <Check size={20} className="mr-2" />
                  No se requiere comprobante de pago
                </h3>
                <p className="text-sm">
                  Todos los servicios solicitados han sido exonerados de pago. Su
                  solicitud será procesada directamente
                </p>
              </div>
            )}

            {/* Campo opcional de descripción */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción adicional (opcional)
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] text-sm"
                placeholder="Ingrese detalles adicionales para su solicitud..."
                rows={3}
              />
            </div>

            {/* Mensaje de error general */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                {errors.general}
              </div>
            )}
          </div>
          <div className="flex justify-end p-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 mr-3"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || bloqueadoPorUsuario}
              className={`cursor-pointer px-6 py-2 bg-[#C40180] text-white rounded-md ${isSubmitting || bloqueadoPorUsuario
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-[#590248]"
                }`}
            >
              {isSubmitting ? "Procesando..." : "Continuar"}
            </button>
          </div>
        </div>
      </form>

      {/* Modal de selección de instituciones */}
      {mostrarModalInstituciones && (
        <SeleccionarInstitucionesModal
          isOpen={mostrarModalInstituciones}
          onClose={() => {
            setMostrarModalInstituciones(false);
            setTipoConstanciaParaInstituciones(null);
          }}
          instituciones={institucionesColegiado}
          tipoConstancia={tipoConstanciaParaInstituciones?.tipoCompleto}
          costoBase={tipoConstanciaParaInstituciones?.costo?.monto || 0}
          onConfirm={handleConfirmarInstituciones}
          institucionesYaSeleccionadas={tipoConstanciaParaInstituciones?.institucionesYaSeleccionadas || []}
        />
      )}
    </>
  );
}
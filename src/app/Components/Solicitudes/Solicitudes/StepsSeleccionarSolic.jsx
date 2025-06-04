"use client"

import useDataListaColegiados from "@/store/ListaColegiadosData"
import { useSolicitudesStore } from "@/store/SolicitudesStore"
import { Building, Check, FileCheck, FileText, Search, Trash2, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import SeleccionarInstitucionesModal from "./SelectInstitutionsModal"

export default function SeleccionarSolicitudesStep({
  onFinalizarSolicitud,
  onClose,
  mostrarSeleccionColegiado = true,
  colegiadoPreseleccionado = null,
  tipoSolicitudPreseleccionado = null,
  isAdmin = false
}) {
  const tipos_solicitud = useSolicitudesStore((state) => state.tipos_solicitud)
  const loading = useSolicitudesStore((state) => state.loading)
  const colegiados = useDataListaColegiados((state) => state.colegiados)
  const fetchColegiados = useDataListaColegiados((state) => state.fetchColegiados)
  const getColegiado = useDataListaColegiados((state) => state.getColegiado)
  console.log({colegiadoPreseleccionado})
  const [formData, setFormData] = useState({
    colegiadoId: colegiadoPreseleccionado ? colegiadoPreseleccionado.colegiado_id : "",
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
        colegiadoId: colegiadoPreseleccionado.colegiado_id,
      }));
    }
  }, [colegiadoPreseleccionado]);

  // Efecto para manejar el bloqueo por usuario
  useEffect(() => {
    if (colegiadoPreseleccionado || formData.colegiadoId) {
      setBloqueadoPorUsuario(false);
      // Cargar instituciones del colegiado
      const colegiadoId = colegiadoPreseleccionado?.colegiado_id || formData.colegiadoId;
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
    // Verificar que tipos_solicitud existe y no está vacío
    if (!tipos_solicitud || Object.keys(tipos_solicitud).length === 0) {
      console.log("tipos_solicitud no está disponible aún");
      return;
    }

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
          console.log("Agregando al carrito tipo preseleccionado:", tipoFormateado, tipoInfo);
          
          // Verificación más robusta de tipoInfo
          if (!tipoInfo || typeof tipoInfo !== 'object') {
            console.error("TipoInfo no es un objeto válido:", tipoInfo);
            return;
          }

          // Verificar propiedades requeridas con valores por defecto
          const codigo = tipoInfo.codigo || `${tipoFormateado.toUpperCase()}`;
          const nombre = tipoInfo.nombre || tipoFormateado;
          const costo = tipoInfo.costo || { monto: 0 };
          
          // Verificar que el costo tenga la estructura correcta
          const costoValido = typeof costo === 'object' && costo !== null ? costo : { monto: 0 };
          
          if (codigo && nombre) {
            const nuevoItem = {
              id: `${codigo}-${Date.now()}`,
              tipo: tipoFormateado,
              subtipo: null,
              nombre: nombre,
              costo: costoValido,
              exonerado: false,
              codigo: codigo,
              documentosRequeridos: tipoInfo.documentosRequeridos ?
                tipoInfo.documentosRequeridos.map(doc => doc.displayName || doc) : []
            };
            console.log("Item creado:", nuevoItem);
            setItemsCarrito([nuevoItem]);
            actualizarTotal([nuevoItem]);
          } else {
            console.error("TipoInfo incompleto - faltan propiedades esenciales:", {
              tipoInfo,
              codigo,
              nombre,
              costo: costoValido
            });
          }
        }
      } else {
        console.error("Tipo no encontrado en tipos_solicitud:", tipoFormateado, tipos_solicitud);
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
      // Verificar que item existe y tiene la estructura mínima
      if (!item || typeof item !== 'object') {
        console.warn("Item inválido en carrito:", item);
        return sum;
      }

      // Verificar que item.costo existe y tiene monto
      if (!item.costo || typeof item.costo !== 'object') {
        console.warn("Item sin costo válido:", item);
        return sum;
      }

      const monto = item.costo.monto;
      if (typeof monto !== 'number' || isNaN(monto)) {
        console.warn("Monto inválido en item:", item);
        return sum;
      }

      return sum + (item.exonerado ? 0 : monto);
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
    if (!tipos_solicitud || !tipos_solicitud[tipo]) {
      console.error("tipos_solicitud no disponible o tipo no encontrado:", tipo);
      return;
    }

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
        
        // Verificación más robusta de tipoInfo
        if (!tipoInfo || typeof tipoInfo !== 'object') {
          console.error("TipoInfo no es un objeto válido en handleSeleccionTipo:", tipoInfo);
          return;
        }

        // Verificar propiedades requeridas con valores por defecto
        const codigo = tipoInfo.codigo || tipo.toUpperCase();
        const nombre = tipoInfo.nombre || tipo;
        const costo = tipoInfo.costo || { monto: 0 };
        
        // Verificar que el costo tenga la estructura correcta
        const costoValido = typeof costo === 'object' && costo !== null ? costo : { monto: 0 };

        const nuevoItem = {
          id: `${codigo}`,
          tipo: tipo,
          subtipo: null,
          nombre: nombre,
          costo: costoValido,
          exonerado: false,
          codigo: codigo,
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
        tipo: tipoMostrar,
        colegiadoId: formData.colegiadoId,
        colegiadoNombre:
          (colegiadoSeleccionado.recaudos?.persona?.nombre) ||
          colegiadoSeleccionado.firstname ||
          "Colegiado",
        fecha: new Date().toLocaleDateString(),
        descripcion: formData.descripcion || "",
        costo: totalCarrito,
        documentosRequeridos: todosDocumentosRequeridos,
        documentosAdjuntos: documentosAdjuntos,
        itemsSolicitud: itemsCarrito,
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
            <div className="mb-8">
              {/* Título sin numeración */}
              <div className="flex items-center mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">
                    Seleccionar Colegiado
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Busque y seleccione el colegiado para quien realizará la solicitud
                  </p>
                </div>
                <span className="text-red-500 text-lg">*</span>
              </div>
              
              {!colegiadoSeleccionado && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-[12px] text-blue-700">
                        <strong>Instrucción:</strong> Para continuar debe seleccionar primero el colegiado.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {errors.colegiadoId && (
                <div className="text-red-500 text-xs mb-2">
                  {errors.colegiadoId}
                </div>
              )}
              
              <div className="relative">
                {colegiadoSeleccionado ? (
                  <div className="flex items-center justify-between border border-green-300 bg-green-50 rounded-lg p-4 mb-2">
                    <div className="flex items-center">
                      <div className="bg-green-500 text-white rounded-full p-2 mr-3">
                        <Check size={20} />
                      </div>
                      <User size={24} className="text-gray-600 mr-3" />
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">
                          {colegiadoSeleccionado.recaudos?.persona?.nombre || "Nombre no disponible"}
                        </p>
                        <p className="text-sm text-gray-600">
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
                      className="text-[#C40180] text-sm hover:underline font-medium bg-white px-3 py-1 rounded border"
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar colegiado por nombre, cédula o registro..."
                      className="pl-12 pr-4 py-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180] text-lg"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowColegiadosList(true);
                      }}
                      onFocus={() => setShowColegiadosList(true)}
                    />
                    <Search className="absolute left-4 top-4.5 h-6 w-6 text-gray-400" />
                  </div>
                )}
                {/* Lista de colegiados */}
                {showColegiadosList && isAdmin && (
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

              </div>
            </div>
          )}

          <div className={`transition-opacity duration-200 ${bloqueadoPorUsuario ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Selección de tipos de solicitud - Solo mostrar si no hay tipo preseleccionado específico */}
            {(!tipoSolicitudPreseleccionado || tipoSolicitudPreseleccionado === "multiple") && (
              <div className="mb-8">
                {/* Título sin numeración */}
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">
                      Seleccionar Tipo de Solicitud
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Elija el tipo de solicitud que desea realizar
                    </p>
                  </div>
                  <span className="text-red-500 text-lg">*</span>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-[12px] text-blue-700">
                        <strong>Instrucción:</strong> Seleccione el tipo de solicitud que desea realizar. Puede elegir una o múltiples opciones según sus necesidades.
                      </p>
                    </div>
                  </div>
                </div>

                {errors.items && (
                  <div className="text-red-500 text-xs mb-2">{errors.items}</div>
                )}
                
                {/* Opciones de tipo de solicitud */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {tipos_solicitud && Object.keys(tipos_solicitud).map((tipo) => (
                    <div
                      key={tipo}
                      className={`
                        flex-1 min-w-[220px] border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-101
                        ${tiposSeleccionados.includes(tipo)
                          ? "border-[#C40180] bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 shadow-xl"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      onClick={() => handleSeleccionTipo(tipo)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 mb-2 text-lg">
                            {tipos_solicitud[tipo]?.nombre || tipo}
                          </p>
                          {tipo !== "Constancia" ? (
                            <p className="text-sm text-gray-600 font-semibold">
                              Costo: ${tipos_solicitud[tipo]?.costo?.monto?.toFixed(2) || "0.00"}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-600 italic">
                              Requiere selección específica
                            </p>
                          )}
                        </div>
                        {tiposSeleccionados.includes(tipo) && (
                          <div className="bg-[#C40180] text-white rounded-full p-2 ml-3 shadow-lg">
                            <Check size={20} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtipos de constancia como desplegable directo - Solo para selección manual */}
                {tiposSeleccionados.includes("Constancia") && tipos_solicitud?.Constancia?.subtipos && (
                  <div className="-mt-2">
                    {/* Lista desplegable directa del botón */}
                    <div className="bg-white border-2 border-[#C40180] rounded-b-xl overflow-hidden shadow-lg">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b border-[#C40180]">
                        <h5 className="font-semibold text-gray-800 flex items-center">
                          <span className="mr-2">📋</span>
                          Seleccione los tipos de constancia que necesita:
                        </h5>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto">
                        {tipos_solicitud.Constancia.subtipos.map((subtipo, index) => (
                          subtipo && subtipo.codigo && (
                            <div
                              key={subtipo.codigo}
                              className={`
                                flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 hover:bg-gray-50
                                ${subtiposConstanciaSeleccionados.includes(subtipo.nombre)
                                  ? "bg-purple-50 border-l-4 border-l-[#C40180]"
                                  : "hover:bg-gray-50"
                                }`}
                              onClick={() => handleSeleccionSubtipoConstancia(subtipo)}
                            >
                              <div className="flex items-center flex-1">
                                <div className={`
                                  w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors duration-200
                                  ${subtiposConstanciaSeleccionados.includes(subtipo.nombre)
                                    ? "bg-[#C40180] border-[#C40180]"
                                    : "border-gray-300"
                                  }`}
                                >
                                  {subtiposConstanciaSeleccionados.includes(subtipo.nombre) && (
                                    <Check size={14} className="text-white" />
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">
                                    {subtipo.nombre}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Código: {subtipo.codigo}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="font-bold text-[#C40180] text-lg">
                                  ${subtipo.costo?.monto?.toFixed(2) || "0.00"}
                                </p>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                      
                      {subtiposConstanciaSeleccionados.length > 0 && (
                        <div className="bg-green-50 px-4 py-3 border-t border-green-200">
                          <p className="text-sm text-green-700 font-medium">
                            ✅ <strong>{subtiposConstanciaSeleccionados.length}</strong> tipo{subtiposConstanciaSeleccionados.length === 1 ? '' : 's'} de constancia seleccionado{subtiposConstanciaSeleccionados.length === 1 ? '' : 's'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lista de constancias para tipo preseleccionado - Solo mostrar si es constancia preseleccionada */}
            {tipoSolicitudPreseleccionado === "constancia" && tipos_solicitud?.Constancia?.subtipos && (
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">
                      Tipos de Constancia Disponibles
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Seleccione los tipos específicos de constancia que necesita
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-[12px] text-blue-700">
                        <strong>Instrucción:</strong> Puede seleccionar múltiples tipos de constancia según sus necesidades.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lista de constancias directa */}
                <div className="bg-white border-2 border-[#C40180] rounded-xl overflow-hidden shadow-lg">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b border-[#C40180]">
                    <h5 className="font-semibold text-gray-800 flex items-center">
                      <span className="mr-2">📋</span>
                      Seleccione los tipos de constancia que necesita:
                    </h5>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {tipos_solicitud.Constancia.subtipos.map((subtipo, index) => (
                      subtipo && subtipo.codigo && (
                        <div
                          key={subtipo.codigo}
                          className={`
                            flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 hover:bg-gray-50
                            ${subtiposConstanciaSeleccionados.includes(subtipo.nombre)
                              ? "bg-purple-50 border-l-4 border-l-[#C40180]"
                              : "hover:bg-gray-50"
                            }`}
                          onClick={() => handleSeleccionSubtipoConstancia(subtipo)}
                        >
                          <div className="flex items-center flex-1">
                            <div className={`
                              w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors duration-200
                              ${subtiposConstanciaSeleccionados.includes(subtipo.nombre)
                                ? "bg-[#C40180] border-[#C40180]"
                                : "border-gray-300"
                              }`}
                            >
                              {subtiposConstanciaSeleccionados.includes(subtipo.nombre) && (
                                <Check size={14} className="text-white" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">
                                {subtipo.nombre}
                              </p>
                              <p className="text-sm text-gray-600">
                                Código: {subtipo.codigo}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-[#C40180] text-lg">
                              ${subtipo.costo?.monto?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                  
                  {subtiposConstanciaSeleccionados.length > 0 && (
                    <div className="bg-green-50 px-4 py-3 border-t border-green-200">
                      <p className="text-sm text-green-700 font-medium">
                        ✅ <strong>{subtiposConstanciaSeleccionados.length}</strong> tipo{subtiposConstanciaSeleccionados.length === 1 ? '' : 's'} de constancia seleccionado{subtiposConstanciaSeleccionados.length === 1 ? '' : 's'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Carrito de compras - Sin numeración */}
            {errors.documentos && (
              <div className="text-red-500 text-xs mb-2 ml-14">
                {errors.documentos.text}
              </div>
            )}
            
            <div className="mb-8">
              {/* Título sin numeración */}
              <div className="flex items-center mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">
                    Resumen de Servicios Seleccionados
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Revise y confirme los servicios que ha seleccionado
                  </p>
                </div>
                {itemsCarrito.length > 0 && (
                  <div className="bg-[#C40180] text-white px-4 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-semibold">
                      Total: ${totalCarrito.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b">
                  <div className="flex items-center justify-between">

                    {itemsCarrito.length > 0 && (
                      <span className="bg-[#C40180] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {itemsCarrito.length} {itemsCarrito.length === 1 ? 'servicio' : 'servicios'}
                      </span>
                    )}
                  </div>
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

            {/* Mensaje de error general */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                {errors.general}
              </div>
            )}
          </div>
          
          {/* Botones de acción mejorados */}
          <div className="flex flex-col sm:flex-row-reverse sm:justify-between gap-3 p-6 border-t bg-gradient-to-r from-gray-50 to-gray-100">
            <button
              type="submit"
              disabled={isSubmitting || bloqueadoPorUsuario}
              className={`cursor-pointer px-8 py-3 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isSubmitting || bloqueadoPorUsuario
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-[#D7008A] to-[#41023B] hover:shadow-xl hover:scale-105"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Procesando solicitud...</span>
                </>
              ) : (
                <>
                  <FileCheck size={20} />
                  <span>Crear Solicitud</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-6 py-3 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 font-medium flex items-center justify-center gap-2"
            >
              <X size={18} />
              <span>Cancelar</span>
            </button>
            
            {bloqueadoPorUsuario && (
              <div className="absolute bottom-2 left-6 right-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-700 text-center font-medium">
                    ⚠️ Complete todos los pasos anteriores para habilitar la creación de la solicitud
                  </p>
                </div>
              </div>
            )}
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
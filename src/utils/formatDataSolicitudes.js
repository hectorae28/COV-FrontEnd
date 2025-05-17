import { TIPOS_SOLICITUD } from '@/store/SolicitudesStore';

export default function transformBackendData(backendData) {
  const frontendData = {
    id: backendData.id, // Generar un ID similar al frontend
    tipo:  Object.keys(backendData.detalles_solicitud).length + " ítems",
    colegiadoId: "1", // Asignar un ID temporal
    colegiadoNombre: backendData.colegiado,
    fecha: formatDate(backendData.created_at),
    estado: mapEstado(backendData.detalles_solicitud),
    descripcion: backendData.descripcion || "",
    referencia: `REF-${backendData.id}`,
    costo: calcularTotal(backendData.detalles_solicitud),
    documentosRequeridos: getDocumentosRequeridos(backendData.detalles_solicitud),
    documentosAdjuntos: getDocumentosAdjuntos(backendData.detalles_solicitud),
    itemsSolicitud: [],
    comprobantePago: null,
    estadoPago: "Pendiente de verificación",
    fechaCompletado: formatDate(backendData.updated_at),
    creador: {
      username: "Administrador",
      email: "admin@ejemplo.com",
      esAdmin: true,
      fecha: backendData.created_at,
      tipo: "creado"
    }
  };

  // Transformar ítems
  if (backendData.detalles_solicitud.carnet) {
    frontendData.itemsSolicitud.push(transformItem(backendData.detalles_solicitud.carnet, "Carnet"));
  }

  if (backendData.detalles_solicitud.constancias) {
    backendData.detalles_solicitud.constancias.forEach(constancia => {
      frontendData.itemsSolicitud.push(transformItem(constancia, "Constancia"));
    });
  }

  if (backendData.detalles_solicitud.especializacion) {
    frontendData.itemsSolicitud.push(transformItem(
      backendData.detalles_solicitud.especializacion,
      "Especialización"
    ));
  }

  return frontendData;
}

// Funciones auxiliares para la transformación
function transformItem(item, type) {
  return {
    id: `${type}-${item.id}`,
    tipo: type,
    subtipo: type === "Constancia" ? getConstanciaSubtype(item.id) : null,
    nombre: type === "Constancia"
      ? `Constancia: ${item.tipo_constancia.split("_").slice(1).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")}`
      : type,
    costo: parseFloat(item.monto.toFixed(2)),
    exonerado: false,
    codigo: type === "Especialización" ? "ESPEC" : type === "Carnet" ? "CARNET" : "CONST",
    documentosRequeridos: type === "Especialización"
      ? Object.keys(item.archivos || {})
      : []
  };
}

function mapEstado(detalles) {
  const allItems = [
    detalles.carnet,
    ...(detalles.constancias || []),
    detalles.especializacion
  ].filter(item => item);

  const estados = allItems.map(item => item.status);
  return estados.includes("aprobado") ? "Aprobada"
    : estados.includes("rechazado") ? "Rechazada"
      : "Pendiente";
}

function calcularTotal(detalles) {
  return [
    detalles.carnet?.monto || 0,
    ...(detalles.constancias ? detalles.constancias.map(c => c.monto) : []),
    detalles.especializacion?.monto || 0
  ].reduce((sum, monto) => sum + monto, 0);
}

function getDocumentosRequeridos(detalles) {
  const documentos = [];
  
  // Carnet
  if (detalles.carnet) {
    documentos.push(...(TIPOS_SOLICITUD.Carnet.documentosRequeridos.map(doc => doc.displayName)));
  }
  
  // Especializacion
  if (detalles.especializacion) {
    documentos.push(...(TIPOS_SOLICITUD.Especializacion.documentosRequeridos.map(doc => doc.displayName)));
  }
  
  
  return [...new Set(documentos)]; // Remove duplicates
}

function getDocumentosAdjuntos(detalles) {
  // Combine all document files from different request types
  return {
    // Carnet documents
    ...(detalles.carnet?.archivos || {}),
    
    // Especialización documents
    ...(detalles.especializacion?.archivos || {}),
      };
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
}

function getConstanciaSubtype(id) {
  // Mapear ID a subtipo de constancia
  const map = {
    9: "Inscripción del COV",
    10: "Solvencia",
    11: "Libre ejercicio",
    12: "Declaración de habilitación",
    13: "Continuidad laboral",
    14: "Deontología odontológica"
  };
  return map[id] || "";
}

function getConstanciaNombre(id) {
  const subtype = getConstanciaSubtype(id);
  return subtype ? `Constancia: ${subtype}` : "Constancia";
}
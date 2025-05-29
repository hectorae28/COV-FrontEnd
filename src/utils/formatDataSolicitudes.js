import { TIPOS_SOLICITUD } from '@/store/SolicitudesStore';

export default function transformBackendData(backendData) {
  const detallesSolicitud = backendData?.detalles_solicitud || {};
  const frontendData = {
    id: backendData.id, // Generar un ID similar al frontend
    tipo:  Object.keys(detallesSolicitud).length + " ítems",
    colegiadoId: "1", // Asignar un ID temporal
    colegiadoNombre: backendData.colegiado,
    fecha: formatDate(backendData.created_at),
    estado: mapEstado(backendData.detalles_solicitud),
    descripcion: backendData.descripcion || "",
    referencia: `REF-${backendData.id}`,
    costo: calcularTotal(backendData.detalles_solicitud),
    documentosRequeridos: getDocumentosRequeridos(backendData.detalles_solicitud),
    documentosAdjuntos: getDocumentosAdjuntos(backendData.detalles_solicitud),
    isAllDocumentosValidados: isAllDocumentosValidados(backendData.detalles_solicitud),
    detallesSolicitud: detallesSolicitud, // Preservar los detalles originales para validación de documentos
    itemsSolicitud: [],
    comprobantePago: null,
    estadoPago: "Pendiente de verificación",
    fechaCompletado: formatDate(backendData.updated_at),
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
function isAllDocumentosValidados(detalles) {
  const allValidateKeys = [];
  
  if (detalles.carnet?.archivos) {
    const carnetValidateKeys = Object.keys(detalles.carnet.archivos).filter(key => key.endsWith('_validate'));
    allValidateKeys.push(...carnetValidateKeys.map(key => detalles.carnet.archivos[key]));
  }
  
  if (detalles.especializacion?.archivos) {
    const especValidateKeys = Object.keys(detalles.especializacion.archivos).filter(key => key.endsWith('_validate'));
    allValidateKeys.push(...especValidateKeys.map(key => detalles.especializacion.archivos[key]));
  }
  
  if (detalles.constancias) {
    detalles.constancias.forEach(constancia => {
      if (constancia.archivos) {
        const constanciaValidateKeys = Object.keys(constancia.archivos).filter(key => key.endsWith('_validate'));
        allValidateKeys.push(...constanciaValidateKeys.map(key => constancia.archivos[key]));
      }
    });
  }
  
  if (allValidateKeys.length === 0) return true;
  
  return allValidateKeys.every(value => value === true);
}

// Funciones auxiliares para la transformación
function transformItem(item, type) {
  return {
    id: item.id,
    tipo: type,
    subtipo: type === "Constancia" ? getConstanciaSubtype(item.id) : null,
    nombre: type === "Constancia"
      ? `Constancia: ${item.tipo_constancia.split("_").slice(1).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")}`
      : type,
    costo: parseFloat(item.monto.toFixed(2)),
    institucion: item.institucion,
    exonerado: false,
    codigo: type === "Especialización" ? "ESPEC" : type === "Carnet" ? "CARNET" : "CONST",
    documentosRequeridos: type === "Especialización"
      ? Object.keys(item.archivos || {})
      : [],
    estado: mapStatusToEstado(item.status),
    tipoConstancia: type === "Constancia" ? item.tipo_constancia : null
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
  const documentos = {};
  
  // Carnet documents
  if (detalles.carnet?.archivos) {
    // Map carnet photo specifically
    if (detalles.carnet.archivos.file_foto) {
      documentos.file_foto = detalles.carnet.archivos.file_foto;
    }
    
    // Add any other carnet documents
    Object.entries(detalles.carnet.archivos).forEach(([key, value]) => {
      if (key !== 'file_foto' && !key.includes('_validate') && !key.includes('_motivo_rechazo')) {
        documentos[key] = value;
      }
    });
  }
  
  // Especialización documents
  if (detalles.especializacion?.archivos) {
    Object.entries(detalles.especializacion.archivos).forEach(([key, value]) => {
      if (!key.includes('_validate') && !key.includes('_motivo_rechazo')) {
        // Map especialización document names to expected frontend format
        let mappedKey = key;
        if (key === 'titulo_especializacion') mappedKey = 'file_titulo_especializacion';
        else if (key === 'fondo_negro_titulo_especializacion') mappedKey = 'file_fondo_negro_titulo_especializacion';
        else if (key === 'titulo_odontologo') mappedKey = 'file_titulo_odontologo';
        else if (key === 'fondo_negro_titulo_odontologo') mappedKey = 'file_fondo_negro_titulo_odontologo';
        else if (key === 'cedula_ampliada') mappedKey = 'file_cedula_ampliada';
        else if (key === 'fotos_carnet') mappedKey = 'file_fotos_carnet';
        else if (key === 'carta_solicitud') mappedKey = 'file_carta_solicitud';
        else if (key === 'solvencia') mappedKey = 'file_solvencia';
        
        documentos[mappedKey] = value;
      }
    });
  }
  
  return documentos;
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

function mapStatusToEstado(status) {
  // Mapear el status del backend al estado del frontend
  switch (status) {
    case "aprobado":
      return "Aprobada";
    case "rechazado":
      return "Rechazada";
    default:
      return "Pendiente";
  }
}
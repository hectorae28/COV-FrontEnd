"use client";

import { useState } from "react";

// Lista de asuntos predefinidos para el Colegio de Odontólogos de Venezuela
export const asuntosPredefinidos = [
  "Solicitud de Inscripción",
  "Solicitud de Constancia de Colegiatura",
  "Solicitud de Solvencia",
  "Solicitud de Certificación Profesional",
  "Renovación de Carnet",
  "Cambio de Residencia",
  "Trámite de Jubilación",
  "Consulta Deontológica",
  "Denuncia Ética",
  "Eventos y Formación Continua",
  "Pago de Cuotas",
  "Otro",
];

const initialMessages = [
  {
    id: "1",
    remitente: "Juan Pérez",
    asunto: "Renovación de Carnet",
    contenido:
      "Hola, necesito información sobre el proceso para renovar mi carnet de odontólogo colegiado.",
    fecha: "2023-05-15",
    hora: "10:30",
    leido: true,
    favorito: false,
    importante: true,
    archivado: false,
    eliminado: false,
    respuestas: [
      {
        id: "1-1",
        contenido:
          "Buenos días, para renovar el carnet necesita presentar los siguientes documentos: cédula vigente, comprobante de pago de la cuota anual y una foto tipo carnet reciente.",
        fecha: "2023-05-15",
        hora: "11:45",
        status: "read",
      },
      {
        id: "1-2",
        contenido:
          "Perfecto, gracias por la información. ¿Cuál es el horario de atención para realizar este trámite?",
        fecha: "2023-05-15",
        hora: "12:20",
        status: "delivered",
      },
    ],
  },
  {
    id: "2",
    remitente: "María González",
    asunto: "Solicitud de Constancia de Colegiatura",
    contenido:
      "Necesito una constancia que certifique mi colegiatura para trabajar en el extranjero. ¿Cuál es el procedimiento?",
    fecha: "2023-05-14",
    hora: "15:20",
    leido: false,
    favorito: true,
    importante: false,
    archivado: false,
    eliminado: false,
    respuestas: [],
  },
  {
    id: "3",
    remitente: "Carlos Rodríguez",
    asunto: "Trámite de Jubilación",
    contenido:
      "Quisiera iniciar los trámites para mi jubilación como odontólogo. Por favor, indíquenme qué documentos debo presentar.",
    fecha: "2023-05-13",
    hora: "09:15",
    leido: true,
    favorito: false,
    importante: false,
    archivado: true,
    eliminado: false,
    respuestas: [
      {
        id: "3-1",
        contenido:
          "Estimado Dr. Rodríguez, le enviaré toda la información sobre el proceso de jubilación. ¿Podría confirmarme cuántos años lleva colegiado?",
        fecha: "2023-05-13",
        hora: "10:30",
        status: "read",
      },
    ],
  },
  {
    id: "4",
    remitente: "Ana Martínez",
    asunto: "Denuncia Ética",
    contenido:
      "Necesito presentar una denuncia por mala praxis contra un profesional. ¿Cuál es el procedimiento a seguir?",
    fecha: "2023-05-12",
    hora: "14:45",
    leido: true,
    favorito: false,
    importante: false,
    archivado: false,
    eliminado: true,
    respuestas: [],
  },
  {
    id: "5",
    remitente: "Luis Sánchez",
    asunto: "Eventos y Formación Continua",
    contenido:
      "Quisiera saber las fechas del próximo congreso de odontología y cómo puedo inscribirme.",
    fecha: new Date().toISOString().split("T")[0],
    hora: "08:30",
    leido: false,
    favorito: false,
    importante: true,
    archivado: false,
    eliminado: false,
    respuestas: [],
  },
];

export function useMessages(activeTab, searchQuery, filtroAsunto = "") {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Calcular contadores correctamente
  const messageCounts = {
    recibidos: messages.filter((m) => !m.eliminado && !m.archivado).length,
    favoritos: messages.filter((m) => m.favorito && !m.eliminado).length,
    importantes: messages.filter((m) => m.importante && !m.eliminado).length,
    archivados: messages.filter((m) => m.archivado && !m.eliminado).length,
    eliminados: messages.filter((m) => m.eliminado).length,
  };

  // Filtrar mensajes según la pestaña activa, búsqueda y asunto
  const filteredMessages = messages
    .filter((message) => {
      // Filtrar por pestaña
      switch (activeTab) {
        case "recibidos":
          return !message.eliminado && !message.archivado;
        case "favoritos":
          return message.favorito && !message.eliminado;
        case "importantes":
          return message.importante && !message.eliminado;
        case "archivados":
          return message.archivado && !message.eliminado;
        case "eliminados":
          return message.eliminado;
        default:
          return !message.eliminado && !message.archivado;
      }
    })
    .filter((message) => {
      // Filtrar por asunto
      if (!filtroAsunto) return true;
      return message.asunto === filtroAsunto;
    })
    .filter((message) => {
      // Filtrar por búsqueda
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        message.remitente.toLowerCase().includes(query) ||
        message.asunto.toLowerCase().includes(query) ||
        message.contenido.toLowerCase().includes(query) ||
        message.respuestas?.some((resp) =>
          resp.contenido.toLowerCase().includes(query)
        )
      );
    });

  // Obtener la lista de asuntos usados en los mensajes actuales
  const asuntosUsados = [...new Set(messages.map((message) => message.asunto))]
    .filter(Boolean)
    .sort((a, b) => {
      // Ordenar según el orden original de asuntosPredefinidos
      const indexA = asuntosPredefinidos.indexOf(a);
      const indexB = asuntosPredefinidos.indexOf(b);
      return indexA - indexB;
    });

  // Marcar mensaje como leído
  const markMessageAsRead = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, leido: true } : msg
      )
    );
  };

  // Alternar favorito
  const handleToggleFavorite = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, favorito: !msg.favorito } : msg
      )
    );
  };

  // Alternar importante
  const handleToggleImportant = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, importante: !msg.importante } : msg
      )
    );
  };

  // Eliminar mensaje
  const handleDeleteMessage = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, eliminado: true } : msg
      )
    );
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(null);
    }
  };

  // Restaurar mensaje
  const handleRestoreMessage = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, eliminado: false } : msg
      )
    );
  };

  // Eliminar permanentemente
  const handlePermanentDelete = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId)
    );
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(null);
    }
  };

  // Enviar respuesta - Corregido para actualizar el mensaje seleccionado
  const handleSendReply = (messageId, content, attachment = null) => {
    if (!content.trim() && !attachment) return;
    // Crear nueva respuesta
    const newReply = {
      id: `${messageId}-${Date.now()}`,
      contenido: attachment
        ? `${content} ${attachment.type === "image"
          ? "[Imagen]"
          : "[Archivo: " + attachment.name + "]"
        }`
        : content,
      fecha: new Date().toISOString().split("T")[0],
      hora: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sending",
    };
    // Actualizar mensajes y mensaje seleccionado
    const updatedMessages = messages.map((msg) => {
      if (msg.id === messageId) {
        const updatedMsg = {
          ...msg,
          respuestas: [...(msg.respuestas || []), newReply],
        };
        // Actualizar también el mensaje seleccionado
        if (selectedMessage && selectedMessage.id === messageId) {
          setSelectedMessage(updatedMsg);
        }
        return updatedMsg;
      }
      return msg;
    });
    setMessages(updatedMessages);
    // Simular cambio de estado a enviado
    setTimeout(() => {
      const updatedWithSent = messages.map((msg) => {
        if (msg.id === messageId) {
          const updatedMsg = {
            ...msg,
            respuestas: msg.respuestas.map((reply) => {
              if (reply.id === newReply.id) {
                return { ...reply, status: "sent" };
              }
              return reply;
            }),
          };
          // Actualizar también el mensaje seleccionado
          if (selectedMessage && selectedMessage.id === messageId) {
            setSelectedMessage(updatedMsg);
          }
          return updatedMsg;
        }
        return msg;
      });
      setMessages(updatedWithSent);
    }, 500);
    // Simular cambio de estado a entregado
    setTimeout(() => {
      const updatedWithDelivered = messages.map((msg) => {
        if (msg.id === messageId) {
          const updatedMsg = {
            ...msg,
            respuestas: msg.respuestas.map((reply) => {
              if (reply.id === newReply.id) {
                return { ...reply, status: "delivered" };
              }
              return reply;
            }),
          };
          // Actualizar también el mensaje seleccionado
          if (selectedMessage && selectedMessage.id === messageId) {
            setSelectedMessage(updatedMsg);
          }
          return updatedMsg;
        }
        return msg;
      });
      setMessages(updatedWithDelivered);
    }, 1500);
    // Simular cambio de estado a leído
    setTimeout(() => {
      const updatedWithRead = messages.map((msg) => {
        if (msg.id === messageId) {
          const updatedMsg = {
            ...msg,
            respuestas: msg.respuestas.map((reply) => {
              if (reply.id === newReply.id) {
                return { ...reply, status: "read" };
              }
              return reply;
            }),
          };
          // Actualizar también el mensaje seleccionado
          if (selectedMessage && selectedMessage.id === messageId) {
            setSelectedMessage(updatedMsg);
          }
          return updatedMsg;
        }
        return msg;
      });
      setMessages(updatedWithRead);
    }, 3000);
  };

  // Enviar nuevo mensaje
  const handleSendNewMessage = (messageData) => {
    const newMessage = {
      id: Date.now().toString(),
      remitente: messageData.destinatario,
      asunto: messageData.asunto, // Usar directamente el asunto seleccionado
      contenido: messageData.contenido,
      fecha: new Date().toISOString().split("T")[0],
      hora: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      leido: false,
      favorito: false,
      importante: false,
      archivado: false,
      eliminado: false,
      respuestas: [],
    };
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
  };

  return {
    messages,
    selectedMessage,
    setSelectedMessage,
    filteredMessages,
    handleToggleFavorite,
    handleToggleImportant,
    allMessages: messages,
    messageCounts,
    handleDeleteMessage,
    handleRestoreMessage,
    handlePermanentDelete,
    handleSendReply,
    handleSendNewMessage,
    markMessageAsRead,
    asuntosUsados,
  };
}

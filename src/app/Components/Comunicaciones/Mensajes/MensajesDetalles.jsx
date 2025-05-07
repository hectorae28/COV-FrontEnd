"use client"

import { AlertCircle, ArrowLeft, Clock, ImageIcon, Paperclip, Reply, Send, Star, Trash2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function MessageDetail({
  message,
  onToggleFavorite,
  onToggleImportant,
  onDeleteMessage,
  onRestoreMessage,
  onPermanentDelete,
  onSendReply,
  onComposeNew,
  onBackToList,
}) {
  const [replyContent, setReplyContent] = useState("")
  const [attachmentPreview, setAttachmentPreview] = useState(null)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [message?.respuestas?.length])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [replyContent])

  const handleSendReply = () => {
    if (!replyContent.trim() && !attachmentPreview) return

    onSendReply(message.id, replyContent, attachmentPreview)
    setReplyContent("")
    setAttachmentPreview(null)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  // Manejar envío con Enter (Shift+Enter para nueva línea)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendReply()
    }
  }

  // Manejar selección de archivo
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Simular vista previa
      setAttachmentPreview({
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : "file",
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      })
    }
  }

  // Renderizar el indicador de estado del mensaje
  const renderMessageStatus = (status) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3.5 w-3.5 text-gray-400" />
      case "sent":
        return <Reply className="h-3.5 w-3.5 text-gray-400" />
      case "delivered":
        return <Reply className="h-3.5 w-3.5 text-gray-400" />
      case "read":
        return <Reply className="h-3.5 w-3.5 text-[#D7008A]" />
      default:
        return null
    }
  }

  // Determinar qué nombre mostrar (destinatario si el remitente es Administrador)
  const getDisplayName = (msg) => {
    return msg.remitente === "Administrador" ? msg.destinatario : msg.remitente
  }

  // Obtener la inicial para el avatar
  const getAvatarInitial = (msg) => {
    const displayName = getDisplayName(msg)
    return displayName.charAt(0)
  }

  if (!message) {
    return (
      <div className="hidden md:flex md:w-2/3 lg:w-3/5 bg-gray-50 items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#D7008A]/20 to-[#41023B]/20 flex items-center justify-center mx-auto mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#D7008A] to-[#41023B] opacity-30 flex items-center justify-center">
              <Send className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Selecciona un mensaje</h3>
          <p className="text-gray-500 mb-6">Elige un mensaje de la lista para ver su contenido</p>
          <button
            onClick={onComposeNew}
            className="inline-flex items-center px-4 py-2 text-white rounded-md bg-gradient-to-r from-[#D7008A] to-[#41023B] hover:opacity-90"
          >
            <Send className="mr-2 h-4 w-4" />
            Nuevo mensaje
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`${isMobile ? "absolute inset-0 z-10" : ""} bg-gray-50 md:w-2/3 lg:w-3/5 flex flex-col h-full`}>
      {/* Encabezado */}
      <div className="p-3 border-b flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center">
          {isMobile && (
            <button
              onClick={onBackToList}
              className="h-10 w-10 mr-2 flex-shrink-0 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
              aria-label="Volver a la lista"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-300 text-[#41023B] flex items-center justify-center font-bold text-sm mr-3">
              {getAvatarInitial(message)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{getDisplayName(message)}</h2>
              <div className="text-sm text-gray-500 flex items-center">
                <span>{message.fecha}</span>
                <span className="mx-1">•</span>
                <span>{message.asunto}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <button
            className={`h-10 w-10 rounded-full flex items-center justify-center ${message.favorito ? "text-yellow-500" : "text-gray-400"
              } hover:bg-gray-100`}
            onClick={() => onToggleFavorite(message.id)}
            title={message.favorito ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <Star className="h-5 w-5" />
          </button>
          <button
            className={`h-10 w-10 rounded-full flex items-center justify-center ${message.importante ? "text-red-500" : "text-gray-400"
              } hover:bg-gray-100`}
            onClick={() => onToggleImportant(message.id)}
            title={message.importante ? "Quitar importancia" : "Marcar como importante"}
          >
            <AlertCircle className="h-5 w-5" />
          </button>
          {message.eliminado ? (
            <>
              <button
                className="h-10 w-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                onClick={() => onRestoreMessage(message.id)}
                title="Restaurar mensaje"
              >
                <Reply className="h-5 w-5" />
              </button>
              <button
                className="h-10 w-10 rounded-full flex items-center justify-center text-red-400 hover:bg-gray-100"
                onClick={() => onPermanentDelete(message.id)}
                title="Eliminar permanentemente"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              className="h-10 w-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
              onClick={() => onDeleteMessage(message.id)}
              title="Eliminar mensaje"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Contenido del mensaje */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Mensaje original */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-base whitespace-pre-line">{message.contenido}</div>
          </div>

          {/* Respuestas */}
          {message.respuestas && message.respuestas.length > 0 && (
            <div className="space-y-4">
              {message.respuestas.map((resp) => (
                <div key={resp.id} className="flex justify-end">
                  <div className="bg-gradient-to-r from-[#D7008A]/10 to-[#41023B]/10 rounded-lg p-4 max-w-[80%] shadow-sm">
                    <div className="text-base whitespace-pre-line">{resp.contenido}</div>
                    <div className="flex justify-end items-center text-xs text-gray-500 mt-2">
                      <span className="mr-1">{resp.hora}</span>
                      {renderMessageStatus(resp.status || "sent")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Área de respuesta */}
      {!message.eliminado && (
        <div className="border-t bg-white p-3 mt-auto">
          {attachmentPreview && (
            <div className="mb-3 p-2 bg-gray-100 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                {attachmentPreview.type === "image" ? (
                  <ImageIcon className="h-5 w-5 text-gray-500 mr-2" />
                ) : (
                  <Paperclip className="h-5 w-5 text-gray-500 mr-2" />
                )}
                <div>
                  <p className="text-sm truncate max-w-[200px]">{attachmentPreview.name}</p>
                  <p className="text-xs text-gray-500">{attachmentPreview.size}</p>
                </div>
              </div>
              <button onClick={() => setAttachmentPreview(null)} className="text-gray-400 hover:text-red-500 p-1">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex items-end">
            <button
              onClick={() => fileInputRef.current.click()}
              className="h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
              title="Adjuntar archivo"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
            <div className="flex-1 bg-gray-100 rounded-2xl px-3 py-2 mx-2">
              <textarea
                ref={textareaRef}
                placeholder="Escribe tu respuesta..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent resize-none outline-none text-sm max-h-[120px] min-h-[20px] mt-2"
                rows={1}
              />
            </div>
            <button
              onClick={handleSendReply}
              className={`h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white ${!replyContent.trim() && !attachmentPreview && "opacity-50 cursor-not-allowed"
                }`}
              disabled={!replyContent.trim() && !attachmentPreview}
              title="Enviar respuesta"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

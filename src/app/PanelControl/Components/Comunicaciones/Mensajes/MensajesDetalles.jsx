"use client"

import { AlertCircle, Check, CheckCheck, ChevronLeft, Clock, ImageIcon, Paperclip, Reply, Send, Star, Trash2 } from "lucide-react"
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
  const [isMobile, setIsMobile] = useState(false)
  const [attachmentPreview, setAttachmentPreview] = useState(null)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const chatContainerRef = useRef(null)
  const fileInputRef = useRef(null)

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
    if (!message || (!replyContent.trim() && !attachmentPreview)) return
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
        return <Check className="h-3.5 w-3.5 text-gray-400" />
      case "delivered":
        return <CheckCheck className="h-3.5 w-3.5 text-gray-400" />
      case "read":
        return <CheckCheck className="h-3.5 w-3.5 text-[#D7008A]" />
      default:
        return null
    }
  }

  useEffect(() => {
    if (message && isMobile) {
    }
  }, [message, isMobile])

  if (!message) {
    return (
      <div className="hidden md:flex w-full h-full flex-col items-center justify-center bg-gray-50">
        <div className="relative w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-[#D7008A] to-[#41023B] opacity-20"></div>
          <Send className="h-8 w-8 text-[#D7008A] z-10 relative mt-1 mr-0.5" />
        </div>
        <h3 className="text-xl font-medium text-gray-500 mb-2">No hay mensaje seleccionado</h3>
        <p className="text-gray-400 text-center max-w-md px-4">
          Selecciona un mensaje de la lista para ver la conversación o crea un nuevo mensaje
        </p>
        <button
          onClick={onComposeNew}
          className="mt-6 mx-auto flex items-center px-4 py-2 text-white rounded-md bg-gradient-to-r from-[#D7008A] to-[#41023B] hover:opacity-90 relative"
          title="Crear nuevo mensaje"
        >
          <Send className="mr-2 h-4 w-4" />
          Nuevo Mensaje
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full w-full bg-gray-50 ${!message && isMobile ? "hidden" : "flex"}`}>
      <div className="p-3 border-b flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center">
          {isMobile && (
            <button
              onClick={onBackToList}
              className="h-8 w-8 mr-2 flex-shrink-0 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
              aria-label="Volver a la lista"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-gray-300 text-[#41023B] flex items-center justify-center font-bold text-sm mr-3 relative">
              {message.remitente.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{message.remitente}</h2>
            </div>
          </div>
        </div>
        <div className="flex">
          <button
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              message.favorito ? "text-yellow-500" : "text-gray-400"
            } hover:bg-gray-100`}
            onClick={() => onToggleFavorite(message.id)}
            title={message.favorito ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <Star className="h-4 w-4" />
          </button>
          <button
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              message.importante ? "text-red-500" : "text-gray-400"
            } hover:bg-gray-100`}
            onClick={() => onToggleImportant(message.id)}
            title={message.importante ? "Quitar importancia" : "Marcar como importante"}
          >
            <AlertCircle className="h-4 w-4" />
          </button>
          {message.eliminado ? (
            <>
              <button
                className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                onClick={() => onRestoreMessage(message.id)}
                title="Restaurar mensaje"
              >
                <Reply className="h-4 w-4" />
              </button>
              <button
                className="h-8 w-8 rounded-full flex items-center justify-center text-red-400 hover:bg-gray-100"
                onClick={() => onPermanentDelete(message.id)}
                title="Eliminar permanentemente"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
              onClick={() => onDeleteMessage(message.id)}
              title="Eliminar mensaje"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {/* Área de chat con scroll */}
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex justify-center">
            <div className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">{message.fecha}</div>
          </div>
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
              <div className="text-sm whitespace-pre-line">{message.contenido}</div>
              <div className="text-right text-xs text-gray-500 mt-1">{message.hora}</div>
            </div>
          </div>
          {/* Respuestas */}
          {message.respuestas && message.respuestas.length > 0 && (
            <>
              {message.respuestas.map((resp) => (
                <div key={resp.id} className="flex justify-end">
                  <div className="bg-gradient-to-r from-[#D7008A]/10 to-[#41023B]/10 rounded-lg p-3 max-w-[80%] shadow-sm">
                    <div className="text-sm whitespace-pre-line">{resp.contenido}</div>
                    <div className="flex justify-end items-center text-xs text-gray-500 mt-1">
                      <span className="mr-1">{resp.hora}</span>
                      {renderMessageStatus(resp.status || "sent")}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {!message.eliminado && (
        <div className="border-t bg-white p-2 mt-auto">
          {attachmentPreview && (
            <div className="mb-2 p-2 bg-gray-100 rounded-md flex items-center justify-between">
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
                <Trash2 className="h-4 w-4" />
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
                placeholder="Escribe un mensaje..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent resize-none outline-none text-sm max-h-[120px] min-h-[20px] mt-2"
                rows={1}
              />
            </div>
            <button
              onClick={handleSendReply}
              className={`h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white ${
                !replyContent.trim() && !attachmentPreview && "opacity-50 cursor-not-allowed"
              }`}
              disabled={!replyContent.trim() && !attachmentPreview}
              title="Enviar mensaje"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
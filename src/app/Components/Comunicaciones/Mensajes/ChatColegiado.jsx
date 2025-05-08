"use client"

import { useMessages } from "@/app/Models/PanelControl/Comunicaciones/Mensajes/MensajesData"
import {
    AlertCircle,
    Check,
    CheckCheck,
    ChevronLeft,
    Clock,
    ImageIcon,
    Paperclip,
    Plus,
    Reply,
    Send,
    Star,
    Trash2,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function ChatColegiado({
    colegiado,
    onBackToList = null,
    initialMessage = null,
    onSendReply,
    onToggleFavorite,
    onToggleImportant,
    onDeleteMessage,
    onRestoreMessage,
    onPermanentDelete,
    refreshTrigger = 0,
}) {
    const [replyContent, setReplyContent] = useState("")
    const [attachmentPreview, setAttachmentPreview] = useState(null)
    const messagesEndRef = useRef(null)
    const textareaRef = useRef(null)
    const chatContainerRef = useRef(null)
    const fileInputRef = useRef(null)

    // Obtener los mensajes y funciones del hook useMessages
    const { filteredMessages, markMessageAsRead } = useMessages("recibidos", "", "")

    // Filtrar mensajes solo para este colegiado
    const colegiadoMessages = filteredMessages.filter(
        (msg) =>
            msg.colegiadoId === colegiado.id ||
            msg.remitente === `${colegiado.persona.nombre} ${colegiado.persona.primer_apellido}`,
    )

    // Seleccionar el mensaje inicial o el primero disponible
    const [currentMessage, setCurrentMessage] = useState(initialMessage)

    useEffect(() => {
        // Si hay un mensaje inicial, usarlo
        if (initialMessage) {
            setCurrentMessage(initialMessage)
            if (!initialMessage.leido) {
                markMessageAsRead(initialMessage.id)
            }
        }
        // Si no hay mensaje inicial pero hay mensajes para este colegiado, seleccionar el primero
        else if (colegiadoMessages.length > 0 && !currentMessage) {
            setCurrentMessage(colegiadoMessages[0])
            if (!colegiadoMessages[0].leido) {
                markMessageAsRead(colegiadoMessages[0].id)
            }
        }
    }, [colegiadoMessages, initialMessage, refreshTrigger])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [currentMessage?.respuestas?.length])

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
        }
    }, [replyContent])

    const handleSendMessage = () => {
        if (!replyContent.trim() && !attachmentPreview) return
        if (!currentMessage) return

        // Usar la función proporcionada para enviar respuesta
        onSendReply(currentMessage.id, replyContent, attachmentPreview)

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
            handleSendMessage()
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

    return (
        <div className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden">
            <div className="p-3 border-b flex justify-between items-center bg-white shadow-sm">
                <div className="flex items-center">
                    {onBackToList && (
                        <button
                            onClick={onBackToList}
                            className="cursor-pointer h-8 w-8 mr-2 flex-shrink-0 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            aria-label="Volver a la lista"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    )}
                    <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-gray-300 text-[#41023B] flex items-center justify-center font-bold text-sm mr-3 relative">
                            {colegiado.persona.nombre.charAt(0)}
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">{`${colegiado.persona.nombre} ${colegiado.persona.primer_apellido}`}</h2>
                            <span className="text-xs text-gray-500">
                                {colegiado.numeroRegistro ? `Registro: ${colegiado.numeroRegistro}` : "Colegiado"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    {currentMessage && (
                        <>
                            <button
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${currentMessage.favorito ? "text-yellow-500" : "text-gray-400"
                                    } hover:bg-gray-100`}
                                onClick={() => onToggleFavorite(currentMessage.id)}
                                title={currentMessage.favorito ? "Quitar de favoritos" : "Añadir a favoritos"}
                            >
                                <Star className="h-4 w-4" />
                            </button>
                            <button
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${currentMessage.importante ? "text-red-500" : "text-gray-400"
                                    } hover:bg-gray-100`}
                                onClick={() => onToggleImportant(currentMessage.id)}
                                title={currentMessage.importante ? "Quitar importancia" : "Marcar como importante"}
                            >
                                <AlertCircle className="h-4 w-4" />
                            </button>
                            {currentMessage.eliminado ? (
                                <>
                                    <button
                                        className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                                        onClick={() => onRestoreMessage(currentMessage.id)}
                                        title="Restaurar mensaje"
                                    >
                                        <Reply className="h-4 w-4" />
                                    </button>
                                    <button
                                        className="h-8 w-8 rounded-full flex items-center justify-center text-red-400 hover:bg-gray-100"
                                        onClick={() => onPermanentDelete(currentMessage.id)}
                                        title="Eliminar permanentemente"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                                    onClick={() => onDeleteMessage(currentMessage.id)}
                                    title="Eliminar mensaje"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </>
                    )}
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent("openComposeModal"))}
                        className="h-8 w-8 rounded-full flex items-center justify-center text-[#D7008A] hover:bg-gray-100"
                        title="Nuevo mensaje"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Área de chat con scroll */}
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4">
                {currentMessage ? (
                    <div className="max-w-3xl mx-auto space-y-3">
                        <div className="flex justify-center">
                            <div className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                                {currentMessage.fecha}
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
                                <div className="text-sm whitespace-pre-line">{currentMessage.contenido}</div>
                                <div className="text-right text-xs text-gray-500 mt-1">{currentMessage.hora}</div>
                            </div>
                        </div>
                        {/* Respuestas */}
                        {currentMessage.respuestas && currentMessage.respuestas.length > 0 && (
                            <>
                                {currentMessage.respuestas.map((resp) => (
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
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#D7008A]/20 to-[#41023B]/20 flex items-center justify-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D7008A] to-[#41023B] opacity-30 flex items-center justify-center">
                                <Send className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <p className="mb-2">No hay mensajes con este colegiado</p>
                        <p className="text-sm text-center max-w-md">Escribe un mensaje para iniciar una conversación</p>
                    </div>
                )}
            </div>

            {/* Área de entrada de mensaje */}
            {currentMessage && !currentMessage.eliminado && (
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
                            onClick={handleSendMessage}
                            className={`h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white ${!replyContent.trim() && !attachmentPreview && "opacity-50 cursor-not-allowed"
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

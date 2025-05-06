"use client"

import { useMessages } from "@/app/Models/PanelControl/Comunicaciones/Mensajes/MensajesData"
import { Check, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

export function ChatHistorial({ colegiadoId, onSelectColegiado }) {
    const [isMobile, setIsMobile] = useState(false)

    // Obtener los mensajes y funciones del hook useMessages
    const { filteredMessages, handleToggleFavorite, handleDeleteMessage, handleRestoreMessage, handlePermanentDelete } =
        useMessages("recibidos", "", "")

    // Agrupar mensajes por colegiado
    const messagesByColegiado = filteredMessages.reduce((acc, message) => {
        // Si estamos filtrando por un colegiado específico, solo mostrar esos mensajes
        if (colegiadoId && message.colegiadoId !== colegiadoId) {
            return acc
        }

        // Determinar la clave del colegiado
        const colegiadoKey = message.colegiadoId || message.remitente

        // Determinar el nombre a mostrar
        const displayName = message.remitente === "Administrador" ? message.destinatario : message.remitente

        if (!acc[colegiadoKey]) {
            acc[colegiadoKey] = {
                id: message.colegiadoId,
                nombre: displayName,
                mensajes: [],
            }
        }

        acc[colegiadoKey].mensajes.push(message)
        return acc
    }, {})

    // Convertir a array y ordenar por fecha del último mensaje
    const colegiadosConMensajes = Object.values(messagesByColegiado).sort((a, b) => {
        const lastMessageA = a.mensajes[a.mensajes.length - 1]
        const lastMessageB = b.mensajes[b.mensajes.length - 1]
        return new Date(lastMessageB.fecha) - new Date(lastMessageA.fecha)
    })

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

    // Función para formatear la fecha
    const formatDate = (dateStr) => {
        const today = new Date()
        const messageDate = new Date(dateStr)
        // Si es hoy, mostrar solo la hora
        if (messageDate.toDateString() === today.toDateString()) {
            return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
        // Si es esta semana, mostrar el día
        const diffDays = Math.round((today - messageDate) / (1000 * 60 * 60 * 24))
        if (diffDays < 7) {
            return messageDate.toLocaleDateString([], { weekday: "short" })
        }
        // Si es este año, mostrar día y mes
        if (messageDate.getFullYear() === today.getFullYear()) {
            return messageDate.toLocaleDateString([], { day: "numeric", month: "short" })
        }
        // Si es otro año, mostrar día, mes y año
        return messageDate.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })
    }

    // Función para obtener el último mensaje de un colegiado
    const getLastMessage = (messages) => {
        if (!messages || messages.length === 0) return null

        const lastMessage = messages[messages.length - 1]

        if (lastMessage.respuestas && lastMessage.respuestas.length > 0) {
            const lastReply = lastMessage.respuestas[lastMessage.respuestas.length - 1]
            return {
                content: lastReply.contenido,
                isReply: true,
                time: lastReply.hora,
                date: lastReply.fecha,
            }
        }

        return {
            content: lastMessage.contenido,
            isReply: false,
            time: lastMessage.hora,
            date: lastMessage.fecha,
        }
    }

    return (
        <div className="bg-white rounded-lg overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="font-bold text-lg text-[#D7008A]">Conversaciones</h2>
                <span className="text-sm text-gray-500">
                    {colegiadosConMensajes.length} {colegiadosConMensajes.length === 1 ? "conversación" : "conversaciones"}
                </span>
            </div>

            <div className="flex-1 overflow-auto">
                {colegiadosConMensajes.length > 0 ? (
                    <div className="divide-y">
                        {colegiadosConMensajes.map((colegiado) => {
                            const lastMessage = getLastMessage(colegiado.mensajes)
                            const formattedDate = lastMessage ? formatDate(lastMessage.date) : ""
                            const hasUnread = colegiado.mensajes.some((msg) => !msg.leido)

                            return (
                                <div
                                    key={colegiado.id || colegiado.nombre}
                                    onClick={() => onSelectColegiado(colegiado)}
                                    className={`cursor-pointer hover:bg-gray-100 transition-colors ${hasUnread ? "bg-pink-50" : ""}`}
                                >
                                    <div className="p-3">
                                        <div className="flex items-start">
                                            <div className="h-12 w-12 rounded-full bg-gray-300 text-[#41023B] flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0">
                                                {colegiado.nombre.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-medium truncate">{colegiado.nombre}</div>
                                                    <div className="text-xs text-gray-500 whitespace-nowrap ml-2">{formattedDate}</div>
                                                </div>

                                                {lastMessage && (
                                                    <div className="flex items-center mt-1">
                                                        {lastMessage.isReply && (
                                                            <div className="mr-1 text-[#D7008A]">
                                                                <Check className="h-3.5 w-3.5" />
                                                            </div>
                                                        )}
                                                        <div className="text-sm text-gray-600 truncate flex-1">
                                                            {lastMessage.isReply ? "Tú: " : ""}
                                                            {lastMessage.content}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center mt-1">
                                                    <div className="flex space-x-1">
                                                        {hasUnread && (
                                                            <span className="bg-[#D7008A] text-white text-xs px-1.5 py-0.5 rounded-full">Nuevo</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <ChevronRight className="h-5 w-5 text-gray-400 ml-1" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-gray-500 h-full py-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#D7008A]/20 to-[#41023B]/20 flex items-center justify-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D7008A] to-[#41023B] opacity-30 flex items-center justify-center">
                                <Check className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <p>No hay conversaciones para mostrar</p>
                    </div>
                )}
            </div>
        </div>
    )
}

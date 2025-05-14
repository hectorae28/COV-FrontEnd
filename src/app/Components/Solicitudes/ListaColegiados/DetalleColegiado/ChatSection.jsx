"use client"

import { useMessages, asuntosPredefinidos } from "@/app/Models/PanelControl/Comunicaciones/Mensajes/MensajesData"
import { MessageCircle, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { ComposeModal } from "@/Components/Comunicaciones/Mensajes/ModalCompose"
import { ChatColegiado } from "@/Components/Comunicaciones/Mensajes/ChatColegiado"

export default function ChatSection({ colegiado }) {
    const [showComposeModal, setShowComposeModal] = useState(false)
    const [selectedChat, setSelectedChat] = useState(null)
    const [refreshChats, setRefreshChats] = useState(0)

    // Obtener los mensajes y funciones del hook useMessages
    const {
        filteredMessages,
        handleSendNewMessage,
        handleSendReply,
        handleToggleFavorite,
        handleToggleImportant,
        handleDeleteMessage,
        handleRestoreMessage,
        handlePermanentDelete,
    } = useMessages("recibidos", "", "")

    // Filtrar mensajes solo para este colegiado
    const colegiadoMessages = filteredMessages.filter(
        (msg) =>
            msg.colegiadoId === colegiado.id ||
            msg.remitente === `${colegiado.persona.nombre} ${colegiado.persona.primer_apellido}`,
    )

    // Función para manejar el envío de un nuevo mensaje
    const handleSendMessage = (nuevoMensaje) => {
        // Asegurarse de que el mensaje tenga el ID del colegiado
        const mensajeConColegiado = {
            ...nuevoMensaje,
            colegiadoId: colegiado.id,
            destinatario: `${colegiado.persona.nombre} ${colegiado.persona.primer_apellido}`,
        }

        // Enviar el mensaje usando la función del hook
        const mensajeCreado = handleSendNewMessage(mensajeConColegiado)

        // Actualizar el estado para mostrar el chat recién creado
        setSelectedChat(mensajeCreado)
        setRefreshChats((prev) => prev + 1)

        // Asegurarse de que el modal se cierre
        setShowComposeModal(false)

        return mensajeCreado
    }

    // Efecto para escuchar el evento de abrir el modal de composición
    useEffect(() => {
        const handleOpenComposeModal = () => {
            setShowComposeModal(true)
        }

        window.addEventListener("openComposeModal", handleOpenComposeModal)

        return () => {
            window.removeEventListener("openComposeModal", handleOpenComposeModal)
        }
    }, [])

    // Efecto para seleccionar el primer chat si hay mensajes y no hay chat seleccionado
    useEffect(() => {
        if (colegiadoMessages.length > 0 && !selectedChat) {
            setSelectedChat(colegiadoMessages[0])
        }
    }, [colegiadoMessages, selectedChat])

    // Si no hay mensajes, mostrar pantalla de inicio
    if (colegiadoMessages.length === 0 && !selectedChat) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-12 bg-gray-50 rounded-lg">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#D7008A]/20 to-[#41023B]/20 flex items-center justify-center mb-6">
                    <MessageCircle size={36} className="text-[#D7008A]" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-3">No hay conversaciones</h3>
                <p className="text-gray-500 text-center max-w-md mb-8">
                    No hay mensajes intercambiados con este colegiado. Inicia una nueva conversación para comunicarte.
                </p>
                <button
                    onClick={() => setShowComposeModal(true)}
                    className="flex items-center px-5 py-2.5 text-white rounded-md bg-gradient-to-r from-[#D7008A] to-[#41023B] hover:opacity-90 shadow-md"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Nuevo Mensaje
                </button>

                {/* Modal para componer nuevo mensaje */}
                {showComposeModal && (
                    <ComposeModal
                        onClose={() => setShowComposeModal(false)}
                        onSendMessage={(mensaje) => {
                            const mensajeCreado = handleSendMessage(mensaje)
                            setShowComposeModal(false)
                            return mensajeCreado
                        }}
                        asuntosPredefinidos={asuntosPredefinidos}
                        destinatarioPreseleccionado={`${colegiado.persona.nombre} ${colegiado.persona.primer_apellido}`}
                        colegiadoId={colegiado.id}
                    />
                )}
            </div>
        )
    }

    // Si hay un chat seleccionado o mensajes, mostrar la interfaz de chat
    return (
        <div className="h-[600px] flex flex-col">
            <div className="flex-1">
                <ChatColegiado
                    colegiado={colegiado}
                    initialMessage={selectedChat}
                    onSendReply={handleSendReply}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleImportant={handleToggleImportant}
                    onDeleteMessage={handleDeleteMessage}
                    onRestoreMessage={handleRestoreMessage}
                    onPermanentDelete={handlePermanentDelete}
                    refreshTrigger={refreshChats}
                />
            </div>

            {/* Modal para componer nuevo mensaje */}
            {showComposeModal && (
                <ComposeModal
                    onClose={() => setShowComposeModal(false)}
                    onSendMessage={(mensaje) => {
                        const mensajeCreado = handleSendMessage(mensaje)
                        setShowComposeModal(false)
                        return mensajeCreado
                    }}
                    asuntosPredefinidos={asuntosPredefinidos}
                    destinatarioPreseleccionado={`${colegiado.persona.nombre} ${colegiado.persona.primer_apellido}`}
                    colegiadoId={colegiado.id}
                />
            )}
        </div>
    )
}

"use client"

import { useEffect, useState } from "react"

// Importar los componentes separados
import SectionAccesD from "../../Components/Home/SectionAccesD"
import SectionGraf from "../../Components/Home/SectionGraf"
import SectionMessag from "../../Components/Home/SectionMessag"
import SectionPendientes from "../../Components/Home/SectionPendientes"
import SectionSolict from "../../Components/Home/SectionSolict"

// Componente principal Home
export default function Home() {
  // Estado para almacenar datos simulados
  const [ultimasSolicitudes, setUltimasSolicitudes] = useState([])
  const [ultimosMensajes, setUltimosMensajes] = useState([])
  const [estadisticasSolicitudes, setEstadisticasSolicitudes] = useState({
    total: 0,
    pendientes: 0,
    aprobadas: 0,
    rechazadas: 0
  })
  const [datosTendencia, setDatosTendencia] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [tendencia, setTendencia] = useState("up") // "up" o "down"

  // Efecto para cargar datos simulados
  useEffect(() => {
    // Simulando carga de datos con un pequeño retraso
    setTimeout(() => {
      // Solicitudes de ejemplo
      const solicitudesMock = [
        {
          id: "1",
          tipo: "Constancia de inscripción",
          colegiadoNombre: "María González",
          fecha: "18/04/2025",
          estado: "Pendiente"
        },
        {
          id: "2",
          tipo: "Registro de especialidad",
          colegiadoNombre: "Juan Pérez",
          fecha: "12/04/2025",
          estado: "Aprobada"
        },
        {
          id: "3",
          tipo: "Cambio de jurisdicción",
          colegiadoNombre: "Carlos Ramírez",
          fecha: "10/04/2025",
          estado: "Rechazada"
        },
        {
          id: "4",
          tipo: "Especilidades",
          colegiadoNombre: "Alberto Rodriguez",
          fecha: "10/04/2025",
          estado: "Pendiente"
        }
      ]

      // Mensajes de ejemplo
      const mensajesMock = [
        {
          id: "1",
          remitente: "Ana Rodríguez",
          contenido: "Solicitud de información sobre el próximo congreso de odontología",
          fecha: "20/04/2025",
          leido: false
        },
        {
          id: "2",
          remitente: "Pedro Martínez",
          contenido: "Consulta sobre certificados de solvencia para concurso público",
          fecha: "18/04/2025",
          leido: true
        },
        {
          id: "3",
          remitente: "Laura Hernández",
          contenido: "Gracias por la rápida respuesta a mi solicitud de cambio de datos",
          fecha: "15/04/2025",
          leido: true
        }
      ]

      // Estadísticas simuladas
      const estadisticasMock = {
        total: 75,
        pendientes: 23,
        aprobadas: 42,
        rechazadas: 10
      }

      // Datos para el gráfico de tendencia
      const datosTendenciaMock = [
        { dia: "Lun", cantidad: 5 },
        { dia: "Mar", cantidad: 7 },
        { dia: "Mié", cantidad: 3 },
        { dia: "Jue", cantidad: 8 },
        { dia: "Vie", cantidad: 12 },
        { dia: "Sáb", cantidad: 10 },
        { dia: "Dom", cantidad: 6 }
      ]

      // Determinar tendencia comparando los últimos dos días
      const tendenciaMock = datosTendenciaMock[datosTendenciaMock.length - 1].cantidad >
        datosTendenciaMock[datosTendenciaMock.length - 2].cantidad ? "up" : "down"

      setUltimasSolicitudes(solicitudesMock)
      setUltimosMensajes(mensajesMock)
      setEstadisticasSolicitudes(estadisticasMock)
      setDatosTendencia(datosTendenciaMock)
      setTendencia(tendenciaMock)
      setIsLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="select-none cursor-default max-w-8xl mx-auto flex flex-col gap-8 py-8 px-4 mt-28">
      {/* Cabecera de bienvenida */}
      <div className="text-center">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text">
          Bienvenido
        </h2>
        <p className="text-gray-600 mt-2">
          Panel de administración del Colegio de Odontólogos de Venezuela
        </p>
      </div>

      {/* Estado de carga */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
        </div>
      ) : (
        <>
          {/* Accesos Rápidos - Ahora centrados en la parte superior */}
          <div className="">
            <SectionAccesD />
          </div>

          {/* Widgets en grid responsivo - 3 columnas reordenadas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SectionPendientes />
            <SectionSolict solicitudes={ultimasSolicitudes} />
            <SectionMessag mensajes={ultimosMensajes} />
          </div>

          {/* Gráfico */}
          <SectionGraf
            datos={datosTendencia}
            estadisticasSolicitudes={estadisticasSolicitudes}
            tendencia={tendencia}
          />
        </>
      )}
    </div>
  )
}
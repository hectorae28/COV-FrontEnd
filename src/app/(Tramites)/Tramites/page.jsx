"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { IdCard, Users, WandSparkles, Award, GraduationCap, Wand, ArrowRight, Calendar, Clock, Download, ExternalLink, CreditCard, DollarSign } from "lucide-react"
import { BancoVenezuelaModal, PayPalModal } from "../../Components/Tramites/PaymentModals"

export default function TramitesPanel() {
  const [activeTab, setActiveTab] = useState("carnet")
  const [hoveredCard, setHoveredCard] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isBancoVenezuelaModalOpen, setIsBancoVenezuelaModalOpen] = useState(false)
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false)
  const contentRef = useRef(null)
  const controls = useAnimation()

  const tramitesInfo = {
    "carnet": {
      title: "Carnet",
      color: "#590248",
      image: "/assets/tramites/Carnet.avif",
      icon: <IdCard className="w-6 h-6" />,
      contenido: "El carnet de colegiado es un documento oficial que identifica a los profesionales de la odontología registrados en el Colegio Odontológico de Venezuela. Este documento es necesario para el ejercicio legal de la profesión y debe ser renovado periódicamente según las normativas vigentes.",
      requisitos: [
        "Título universitario original y copia",
        "Cédula de identidad vigente",
        "Comprobante de pago de la cuota de colegiación",
        "Fotografía reciente tamaño carnet",
        "Planilla de solicitud debidamente completada"
      ],
      tiempo: "5 días hábiles",
      costo: "20 USD",
      vigencia: "2 años"
    },
    "odontologos": {
      title: "Odontólogos",
      color: "#118AB2",
      image: "/assets/tramites/Odontologos.avif", icon: <Users className="w-6 h-6" />,
      contenido: "El Colegio Odontológico de Venezuela ofrece diversos servicios para los profesionales de la odontología, incluyendo colegiación, solvencias profesionales y constancias de buena práctica. La colegiación es obligatoria para ejercer legalmente la odontología en Venezuela.",
      requisitos: [
        "Título de Odontólogo expedido por universidad reconocida",
        "Documentos de identidad vigentes",
        "Pago de aranceles correspondientes",
        "Completar formulario de registro profesional",
        "Asistir a la juramentación profesional"
      ],
      tiempo: "15 días hábiles",
      costo: "170 USD",
      vigencia: "Permanente"
    },
    "higienistasDentales": {
      title: "Higienistas Dentales",
      color: "#ffba1a",
      image: "/assets/tramites/Higienistas.avif", icon: <WandSparkles className="w-6 h-6" />,
      contenido: "Los higienistas dentales pueden registrarse en el Colegio Odontológico para obtener reconocimiento profesional y acceder a beneficios específicos para su área. El registro facilita la integración al sistema de salud bucal y garantiza el cumplimiento de los estándares profesionales.",
      requisitos: [
        "Título o certificado de Higienista Dental",
        "Documento de identidad vigente",
        "Comprobante de pago de la cuota de registro",
        "Dos fotografías recientes",
        "Curriculum vitae actualizado"
      ],
      tiempo: "10 días hábiles",
      costo: "120 USD",
      vigencia: "3 años"
    },
    "tecnicosDentales": {
      title: "Técnicos Dentales",
      color: "#037254",
      image: "/assets/tramites/Tecnicos.avif", icon: <Wand className="w-6 h-6" />,
      contenido: "El registro de Técnicos Dentales permite a estos profesionales contar con el respaldo del Colegio Odontológico y ejercer legalmente su profesión. Los técnicos dentales registrados pueden acceder a programas de actualización profesional y participar en eventos científicos organizados por el Colegio.",
      requisitos: [
        "Título de Técnico Dental de institución reconocida",
        "Cédula de identidad",
        "Pago de arancel para registro técnico",
        "Dos fotografías tamaño carnet",
        "Completar formulario específico para técnicos"
      ],
      tiempo: "7 días hábiles",
      costo: "120 USD",
      vigencia: "2 años"
    },
    "especialidades": {
      title: "Especialidades",
      color: "#C40180",
      image: "/assets/tramites/Especialidades.avif", icon: <Award className="w-6 h-6" />,
      contenido: "El registro de especialidades permite a los odontólogos con estudios de postgrado validar y certificar su especialidad ante el Colegio Odontológico de Venezuela. Este trámite es fundamental para ejercer legalmente como especialista y ser reconocido oficialmente dentro del gremio profesional.",
      requisitos: [
        "Título de especialista emitido por universidad acreditada",
        "Carnet de colegiado vigente",
        "Comprobante de pago de arancel por registro de especialidad",
        "Curriculum vitae actualizado",
        "Documentación complementaria según la especialidad"
      ],
      tiempo: "20 días hábiles",
      costo: "100 USD",
      vigencia: "Permanente"
    },
    "avalCursos": {
      title: "Aval para Cursos",
      color: "#073B4C",
      image: "/assets/tramites/AvalCursos.avif", icon: <GraduationCap className="w-6 h-6" />,
      contenido: "El aval académico del Colegio Odontológico de Venezuela certifica la calidad y pertinencia de cursos, diplomados y eventos científicos en el área odontológica. Este respaldo institucional garantiza el nivel académico de las actividades formativas y les otorga reconocimiento oficial dentro del gremio.",
      requisitos: [
        "Programa académico detallado del curso o evento",
        "Curriculum vitae de los ponentes o instructores",
        "Formulario de solicitud de aval completado",
        "Pago del arancel correspondiente",
        "Presentación con al menos 30 días de anticipación"
      ],
      tiempo: "15 días hábiles",
      costo: "100 USD",
      vigencia: "Duración del evento"
    }
  }

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 2000);

    controls.start({ opacity: 1, y: 0 });

    return () => clearTimeout(timer);
  }, [activeTab, controls]);

  const generateStars = () => {
    return Array.from({ length: 25 }).map((_, index) => {
      const size = Math.random() * 5 + 2;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 1;
      const duration = Math.random() * 3 + 1;

      return (
        <motion.div
          key={index}
          className="absolute rounded-full bg-white opacity-0"
          style={{ width: size, height: size, top: `${y}%`, left: `${x}%` }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: duration,
            delay: delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 3
          }}
        />
      );
    });
  };

  const tramiteInfo = tramitesInfo[activeTab] || tramitesInfo["carnet"];

  // Mapeo de nombres de tramites para comparación en la tabla
  const tramiteMapping = {
    "carnet": "Carnet",
    "odontologos": "Odontólogos",
    "higienistasDentales": "Higienistas Dentales",
    "tecnicosDentales": "Técnicos Dentales",
    "especialidades": "Especialidades"
  };

  // Tabla de tarifas
  const tarifasData = [
    { tramite: "Odontólogos", monto: "170$" },
    { tramite: "Higienistas Dentales", monto: "120$" },
    { tramite: "Técnicos Dentales", monto: "120$" },
    { tramite: "Especialidades", monto: "100$" },
    { tramite: "Carnet", monto: "20$" },
    { tramite: "Cartas c/u", monto: "15$" },
    { tramite: "Solvencia cada mes en el año 2025", monto: "7$" }
  ];

  return (
    <div className="w-full px-20 py-12">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-16 mt-28"
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-4xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
        >
          Trámites Odontológicos
        </motion.h1>
        <motion.p
          className="mt-4 max-w-full mx-auto text-gray-600 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Gestión de trámites profesionales del Colegio Odontológico de Venezuela
        </motion.p>
      </motion.div>

      <div className={`grid ${activeTab === "avalCursos" ? "grid-cols-[1fr_4fr]" : "grid-cols-[1fr_3fr_1.5fr]"} gap-8`} ref={contentRef}>
        {/* Columna 1: Cards de opciones */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-4">
            {Object.entries(tramitesInfo).map(([id, info], index) => (
              <motion.div
                key={id}
                className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-300 group ${activeTab === id
                  ? "ring-2 transform scale-[1.02] z-10"
                  : "hover:shadow-xl bg-white"
                  }`}
                style={{
                  ringColor: activeTab === id ? info.color : "transparent",
                  height: "93px"
                }}
                onClick={() => setActiveTab(id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  scale: activeTab === id ? 1.03 : 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setHoveredCard(id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <motion.div
                  className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: hoveredCard === id ? 1.15 : 1.05,
                    filter: hoveredCard === id ? "brightness(0.7)" : "brightness(0.6)"
                  }}
                  transition={{ duration: 0.7 }}
                  style={{
                    backgroundImage: `url(${info.image})`,
                  }}
                />
                <div
                  className="absolute inset-0 z-5 opacity-90 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(to right, ${info.color}DD, ${activeTab === id ? info.color + '88' : 'rgba(0,0,0,0.6)'})`
                  }}
                />
                <motion.div
                  className="absolute inset-0 px-4 flex items-center z-10"
                  initial={{ y: 5 }}
                  animate={{ y: hoveredCard === id ? 0 : 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center w-full">
                    <div className="mr-3">
                      <div style={{ color: "white" }}>
                        {info.icon}
                      </div>
                    </div>

                    <div className="flex-1">
                      <motion.h3
                        className="text-lg font-bold text-white drop-shadow-md"
                        initial={{ x: -5, opacity: 0.9 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {info.title}
                      </motion.h3>
                    </div>

                    <motion.div
                      initial={{ x: 0 }}
                      animate={{ x: hoveredCard === id ? 5 : 0 }}
                      transition={{ duration: 0.2, type: "spring" }}
                    >
                      <ArrowRight className="h-5 w-5 text-white" />
                    </motion.div>
                  </div>
                </motion.div>
                {activeTab === id && (
                  <motion.div
                    className="absolute right-0 top-0 bottom-0 w-1 z-10"
                    style={{ backgroundColor: "white" }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Columna 2: Contenido */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="w-full bg-white rounded-xl shadow-xl overflow-hidden relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {showConfetti && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                {generateStars()}
              </div>
            )}
            <motion.div
              className="h-1 w-full"
              style={{ backgroundColor: tramiteInfo.color }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <div className="p-8 h-full overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <h3 className="text-xl font-semibold mb-3" style={{ color: tramiteInfo.color }}>
                  {tramiteInfo.title}
                </h3>
                <p className="text-gray-700 mb-6">{tramiteInfo.contenido}</p>

                <div className="mt-8">
                  <h4 className="font-medium text-lg mb-3" style={{ color: tramiteInfo.color }}>
                    Requisitos:
                  </h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {tramiteInfo.requisitos.map((req, index) => (
                      <li key={index} className="text-gray-700">{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" style={{ color: tramiteInfo.color }} />
                  <span className="font-medium mr-2">Tiempo de procesamiento:</span>
                  <span className="text-gray-700">{tramiteInfo.tiempo}</span>
                </div>

                <div className="mt-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" style={{ color: tramiteInfo.color }} />
                  <span className="font-medium mr-2">Vigencia:</span>
                  <span className="text-gray-700">{tramiteInfo.vigencia}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Columna 3: Tarifas (se oculta para aval cursos) */}
        {activeTab !== "avalCursos" && (
          <motion.div
            className="w-full bg-white rounded-xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="h-1 w-full"
              style={{ backgroundColor: tramiteInfo.color }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <div className="p-6 h-full flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 overflow-auto"
              >
                <h3 className="text-xl font-semibold mb-4 text-center" style={{ color: tramiteInfo.color }}>
                  Tarifas y Pagos
                </h3>

                {/* Tabla de tarifas */}
                <div className="mb-4">
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trámite
                          </th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monto
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tarifasData.map((item, index) => (
                          <tr
                            key={index}
                            className={tramiteMapping[activeTab] === item.tramite ? "" : ""}
                            style={{
                              backgroundColor: tramiteMapping[activeTab] === item.tramite ? `${tramiteInfo.color}15` : "",
                              fontWeight: tramiteMapping[activeTab] === item.tramite ? "bold" : "normal"
                            }}
                          >
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                              {item.tramite}
                            </td>
                            <td
                              className="px-4 py-2 whitespace-nowrap text-sm"
                              style={{
                                color: tramiteMapping[activeTab] === item.tramite ? tramiteInfo.color : "rgb(55, 65, 81)"
                              }}
                            >
                              {item.monto}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="text-sm text-gray-700 space-y-2 mb-4">
                  {activeTab === "odontologos" && (
                    <p className="font-medium">
                      * Las inscripciones de <span className="font-bold">Odontólogos</span> se cobran a partir de la fecha de la emisión del título. Consultar por vía telefónica para obtener un monto exacto.
                    </p>
                  )}
                  <p className="text-justify">
                    <span className="font-bold">Solvencia:</span> Los pagos se hacen de manera trimestral.
                  </p>
                  <p className="text-justify">
                    <span className="font-bold">Carnet COV:</span> Para obtener el carnet (físico o digital), es necesario estar solvente con el COV. El físico se retira en las oficinas y el digital se descarga desde el Sistema Colegiados.
                  </p>
                  {activeTab === "especialidades" && (
                    <p>
                      <span className="font-bold">Especialidades:</span> Debe estar solvente con el COV.
                    </p>
                  )}
                </div>

                {/* Métodos de pago */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Métodos de Pago:</h4>
                  <div className="flex flex-col gap-2">

                    {/* Pago en instalaciones */}
                    <button
                      className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 text-sm"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Instalaciones del COV (Tarjeta de Débito / Crédito)</span>
                    </button>

                    <div className="flex gap-2">
                      {/* Banco de Venezuela */}
                      <button
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-red-600 border hover:bg-red-100 transition-all duration-300 text-sm"
                        onClick={() => setIsBancoVenezuelaModalOpen(true)}
                      >
                        <img src="/assets/icons/BDV.png" alt="Banco de Venezuela" className="w-7 h-7" />
                        <span>Banco de Venezuela</span>
                      </button>

                      {/* PayPal */}
                      <button
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-blue-600 border hover:bg-blue-100 transition-all duration-300 text-sm"
                        onClick={() => setIsPayPalModalOpen(true)}
                      >
                        <img src="/assets/icons/Paypal.png" alt="PayPal" className="w-5 h-5" />
                        <span>PayPal</span>
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Render the modals */}
      <BancoVenezuelaModal isOpen={isBancoVenezuelaModalOpen} onClose={() => setIsBancoVenezuelaModalOpen(false)} />
      <PayPalModal isOpen={isPayPalModalOpen} onClose={() => setIsPayPalModalOpen(false)} />
    </div>
  )
}

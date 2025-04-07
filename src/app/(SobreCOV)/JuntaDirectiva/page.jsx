"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Award,
  Users,
  FileText,
  Briefcase,
  BookOpen,
  MessageSquare,
  Globe,
  Scale,
  Calculator,
  Calendar,
  Trophy,
} from "lucide-react";
import { fetchOrganizacion } from "../../../api/endpoints/landingPage";
import { useEffect, useState } from "react";

/**
 * Constants and configuration
 */
// Gradient color combinations for visual styling
const GRADIENTS = [
  "from-[#C40180] to-[#590248]", // Primary gradient
  "from-purple-600 to-indigo-500",
  "from-blue-500 to-cyan-400",
  "from-pink-500 to-rose-400",
  "from-orange-500 to-yellow-400",
  "from-indigo-500 to-blue-400",
  "from-teal-500 to-green-400",
  "from-amber-500 to-orange-400",
  "from-blue-500 to-cyan-400",
];

// Animation variants for container elements
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Animation variants for individual items
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200,
    },
  },
};

const getGradientColor = (index) => GRADIENTS[index % GRADIENTS.length];
const primaryMembersIcons = [Award, Users];
const secondaryMembersIcons = [
  FileText,
  Briefcase,
  BookOpen,
  Scale,
  MessageSquare,
  Globe,
  Calculator,
];

export default function JuntaDirectiva() {
  const [organizacion, setOrganizacion] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchOrganizacion();
        setOrganizacion(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching presidentes:", error);
      }
    };

    loadData();
  }, []);
  if (isLoading) {
    return <div className="text-center py-8">Cargando Junta Directiva...</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-12 mt-22">
        {/* Animated Title */}
        <AnimatedTitle />

        {/* Main Board Section */}
        <BoardSection
          primaryMembers={organizacion.primaryMembers}
          secondaryMembers={organizacion.secondaryMembers}
        />

        {/* Events Commission Section */}
        <CommissionSection
          title="COMISIÓN DE JORNADAS Y EVENTOS DEL C.O.V."
          icon={<Calendar className="w-6 h-6" />}
          description="La Comisión Científica de Jornadas y Eventos es creada por la JUNTA DIRECTIVA NACIONAL DEL COV en el año 2008, como una alternativa a la demanda del gremio por poseer un programa de Educación Continua al alcance de todos los odontólogos del país."
          members={organizacion.eventsCommissionMembers}
          displayRole={true}
          columns="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        />

        {/* Sports Commission Section */}
        <CommissionSection
          title="COMISIÓN DE DEPORTE"
          icon={<Trophy className="w-6 h-6" />}
          members={organizacion.sportsCommissionMembers.map((name) => ({
            name,
          }))}
          displayRole={false}
          columns="grid-cols-1 sm:grid-cols-3 md:grid-cols-5" // Changed to 1 column on mobile
          delay={0.2}
        />
      </main>
    </div>
  );
}

/**
 * Component for animated main title
 */
function AnimatedTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-8 relative z-20"
    >
      <motion.h1
        className="text-4xl sm:text-5xl md:text-4xl font-bold bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text px-8 py-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
      >
        Junta Directiva
      </motion.h1>

      <motion.p
        className="mt-6 max-w-4xl mx-auto text-gray-600 text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Conoce a los líderes que dirigen nuestra organización con compromiso y
        dedicación.
      </motion.p>
    </motion.div>
  );
}

/**
 * Component for main board section with primary and secondary members
 */
function BoardSection({ primaryMembers, secondaryMembers }) {
  return (
    <div className="glass-container mb-16 bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-8">
        {/* Left column - Logo and primary members */}
        <div className="md:col-span-5">
          {/* Animated logo */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <Image
                src="/assets/escudo.png"
                alt="Logo COV"
                width={160}
                height={200}
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Primary members */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {primaryMembers.map((member, index) => (
              <PrimaryMemberCard
                key={index}
                member={{ ...member, icon: primaryMembersIcons[index] }}
              />
            ))}
          </motion.div>
        </div>

        {/* Right column - Secondary members */}
        <div className="md:col-span-7">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
              {secondaryMembers.map((member, index) => (
                <SecondaryMemberCard
                  key={index}
                  member={{ ...member, icon: secondaryMembersIcons[index] }}
                  index={index}
                  isLastOdd={
                    index === secondaryMembers.length - 1 &&
                    secondaryMembers.length % 2 !== 0
                  }
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/**
 * Component for a primary member card (President, Vice President)
 */
function PrimaryMemberCard({ member }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border-0 group transition-all duration-300 relative">
        {/* Decorative background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[0]} opacity-5 group-hover:opacity-10 transition-all duration-300`}
        />

        <div className="p-4 relative">
          <div className="flex items-center mb-2">
            <div className="mr-4">
              <div
                className={`flex items-center justify-center p-2 sm:p-3 rounded-lg text-white bg-gradient-to-br ${GRADIENTS[0]} shadow-md w-10 h-10 sm:w-14 sm:h-14 group-hover:shadow-lg transition-all duration-300`}
              >
                <member.icon className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
            <div className="ml-1 sm:ml-4 flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[#C40180]">
                {member.role}
              </h3>
              <p className="text-lg sm:text-xl text-gray-800">{member.name}</p>
              <div
                className={`h-0.5 w-0 bg-gradient-to-r ${GRADIENTS[0]} mt-2 transition-all duration-300 group-hover:w-full`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Component for a secondary member card
 */
function SecondaryMemberCard({ member, index, isLastOdd }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
      whileTap={{ scale: 0.97 }}
      className={isLastOdd ? "col-span-full flex justify-center" : ""}
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full w-full transition-all duration-200 relative">
        {/* Decorative background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getGradientColor(
            index + 2
          )} opacity-5 transition-all duration-300`}
        />

        <div className="p-4 flex items-center relative">
          <div className="mr-3">
            <div
              className={`flex items-center justify-center p-2 rounded-lg text-white bg-gradient-to-br ${getGradientColor(
                index + 2
              )} shadow-sm w-10 h-10`}
            >
              <member.icon className="w-5 h-5" />
            </div>
          </div>
          <div className="ml-2 flex-1">
            <h3 className="text-lg font-bold text-gray-800">{member.role}</h3>
            <p className="text-gray-700">{member.name}</p>
            <div
              className={`h-0.5 w-0 bg-gradient-to-r ${getGradientColor(
                index + 2
              )} mt-2 transition-all duration-300 group-hover:w-full`}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Component for Commission sections (Events and Sports)
 */
function CommissionSection({
  title,
  icon,
  description,
  members,
  displayRole = true,
  columns = "grid-cols-3",
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true, amount: 0.3 }}
      className="mb-16"
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden relative">
        <div className="p-8">
          {/* Section header */}
          <div className="flex items-center mb-6">
            <div className="mr-4">
              <div className="flex items-center justify-center p-3 rounded-lg text-white bg-gradient-to-r from-[#C40180] to-[#590248] shadow-md w-12 h-12">
                {icon}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              <div className="h-0.5 w-full bg-gradient-to-r from-[#590248] to-transparent mt-2"></div>
            </div>
          </div>

          {/* Description (if provided) */}
          {description && (
            <p className="text-gray-700 mb-8 max-w-full">{description}</p>
          )}

          {/* Members grid */}
          <motion.div
            className={`grid ${columns} gap-4`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {members.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                  boxShadow: "0 15px 30px -10px rgba(21, 128, 61, 0.2)",
                }}
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border-0 h-full transition-all duration-300 relative">
                  {/* Decorative background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C40180] to-[#590248] opacity-5 transition-all duration-300"></div>

                  <div className="p-4 relative text-center sm:text-left">
                    {displayRole && (
                      <h3 className="text-sm font-bold text-gray-800">
                        {member.role}
                      </h3>
                    )}
                    <p className="text-gray-700">{member.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

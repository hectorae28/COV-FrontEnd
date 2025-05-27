"use client";
import { postDataUsuario } from "@/api/endpoints/colegiado";
import DetallePendiente from "@/app/Components/Solicitudes/ListaColegiados/DetalleInfo";
import BackgroundAnimation from "@/Components/Home/BackgroundAnimation";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function DetallePendienteWrapper({
  id,
  isAdmin,
  recaudos,
  isColegiado,
  error,
}) {
  const [isSubmited, setIsSubmited] = useState(false);
  const handleAprobarPendiente = () => {
    alert("tiene vida");
  };
  const handleForward = async () => {
    postDataUsuario("recaudos-token", {
      token: id,
      status: "revisando",
    }).then(() => setIsSubmited(true));
  };

  return (
    <>
      <div className="flex justify-center items-start min-h-screen w-full">
        <div className="relative w-full min-h-screen flex justify-center items-center">
          {/* Background Animation fixed to viewport */}
          <div className="fixed inset-0 z-0">
            <BackgroundAnimation />
          </div>

          {/* Backdrop blur fixed to viewport */}
          <div className="fixed inset-0 bg-white/13 backdrop-blur-md z-10" />

          {/* Content with relative positioning to allow scrolling */}
          <div className="relative max-w-7xl z-20 ">
            <div className="w-full flex justify-center py-10">
              <Image
                src="/assets/logo.png"
                alt="Logo Colegio de Odontólogos de Venezuela"
                width={300}
                height={80}
                className="relative drop-shadow-md object-contain max-w-full h-auto"
              />
            </div>
            {error ? (
              <motion.div
                className="relative overflow-hidden rounded-2xl group"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border border-white/40 shadow-xl rounded-2xl z-1"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#41023B]/20 to-[#D7008A]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                <div className="relative p-6 sm:p-8 z-10 text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#41023B] mb-4 sm:mb-5">
                    Error
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    Token invalido, por favor pida denuevo el token.
                  </p>
                  <div className="w-full flex items-center justify-center">
                    <Link
                      href="/Login"
                      className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white p-4 rounded-md flex items-center text-sm font-medium hover:bg-purple-200 transition-colors "
                    >
                      <span>Regresar a Inicio de Sesion</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : !isSubmited ? (
              <DetallePendiente
                params={{ id }}
                onVolver={handleAprobarPendiente}
                isAdmin={isAdmin}
                recaudos={recaudos}
                handleForward={handleForward}
                isColegiado={isColegiado}
              />
            ) : (
              <>
                <motion.div
                  className="relative overflow-hidden rounded-2xl group"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border border-white/40 shadow-xl rounded-2xl z-1"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#41023B]/20 to-[#D7008A]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                  <div className="relative p-6 sm:p-8 z-10 text-center flex flex-col items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#41023B]  sm:mb-5 flex gap-5">
                      Solicitud Actualizada<BadgeCheck className=" size-10 text-green-600 " />
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600  sm:mb-6">
                      Sus datos han sido actualizados correctamente. <br />{" "}
                      Recibira un correo electronico una vez que los
                      administradores hayan revisado su solicitud.
                    </p>

                    <div className="w-full flex items-center justify-center">
                      <Link
                        href="/Login"
                        className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white p-4 rounded-md flex items-center text-sm font-medium hover:bg-purple-200 transition-colors "
                      >
                        <span>Regresar a Inicio de Sesion</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

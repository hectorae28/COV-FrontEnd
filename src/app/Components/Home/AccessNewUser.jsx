"use client";
import api from "@/api/api";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import Alert from "@/app/Components/Alert";
import { useState } from "react";

export default function ClaimAccountForm({ onBackToLogin }) {
    const [correoUsuario, setCorreoUsuario] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "info" });

    const handleInputChange = (e) => {
        setCorreoUsuario(e.target.value);
    };

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        api.post("/usuario/claim-account/", {
            email: correoUsuario,
        })
            .then((_) => {
                setIsLoading(false);
                setMessage({
                    text: "Se ha enviado un correo con instrucciones para acceder a tu cuenta.",
                    type: "success"
                });
            })
            .catch((error) => {
                setIsLoading(false);
                setMessage({
                    text: error.status == 404
                        ? "El correo no está registrado en nuestro sistema."
                        : error.status == 500
                            ? "Error interno del servidor."
                            : "Error desconocido.",
                    type: "alert"
                });
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            {(message.text.length > 0 && !isLoading) && (
                <Alert type={message.type}>{message.text}</Alert>
            )}
            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        name="correoUsuario"
                        value={correoUsuario}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:border-transparent shadow-sm"
                        placeholder="Correo Electrónico"
                        required
                    />
                </div>
            </div>

            <motion.button
                type="submit"
                className="cursor-pointer w-full bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white py-4 px-6 rounded-xl text-lg font-medium
        shadow-md hover:shadow-lg transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:ring-opacity-50 inline"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
            >
                Obtener acceso a mi cuenta
            </motion.button>

            <div className="text-center mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <a
                    href="#"
                    className="text-[#D7008A] font-medium hover:underline flex items-center justify-center"
                    onClick={(e) => {
                        e.preventDefault();
                        onBackToLogin();
                    }}
                >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Volver a Iniciar Sesión
                </a>
            </div>
        </form>
    );
}

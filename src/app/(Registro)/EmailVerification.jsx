"use client";
import { postDataUsuario } from "@/api/endpoints/colegiado";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MailCheck, RefreshCw, UserCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function EmailVerification({
    email,
    onVerificationSuccess,
    onGoBack,
    isResending = false,
    onResendCode
}) {
    const hasSentEmail = useRef(false);
    const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(null);
    const [canResend, setCanResend] = useState(null);
    const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(true);

    const inputRefs = useRef([]);

    const handleSendEmailCode = async () => {
        const startTime = Date.now();

        try {
            const res = await postDataUsuario(`send-verification-email`, {
                "email": email
            })
            if (res.status === 200) {
                setCanResend(false);
                setTimeLeft(60);
                setEmailAlreadyExists(false);
            }
        } catch (err) {
            if (err.status === 409) {
                setEmailAlreadyExists(true);
                setError("El correo electrónico ya se encuentra registrado en nuestro sistema")
            } else {
                setError("Error al enviar el código. Por favor, intente nuevamente.")
            }
        }

        // Tiempo mínimo de 1 segundo
        const elapsed = Date.now() - startTime;
        const minLoadingTime = 1000; // 1 segundo mínimo
        const remainingTime = Math.max(minLoadingTime - elapsed, 0);

        setTimeout(() => {
            setIsCheckingEmail(false);
        }, remainingTime);
    }

    useEffect(() => {
        if (!hasSentEmail.current) {
            handleSendEmailCode();
            hasSentEmail.current = true;
        }
    }, [])

    // Timer para reenviar código
    useEffect(() => {
        if (timeLeft > 0 && !canResend) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setCanResend(true);
        }
    }, [timeLeft, canResend]);

    // Enfoque automático en el primer input al montar
    useEffect(() => {
        if (inputRefs.current[0] && !emailAlreadyExists && !isCheckingEmail) {
            setTimeout(() => {
                inputRefs.current[0].focus();
            }, 100);
        }
    }, [emailAlreadyExists, isCheckingEmail]);

    const handleCodeChange = (index, value) => {
        if (value && !/^[0-9]+$/.test(value)) return;

        const newCode = [...verificationCode];

        if (value.length > 1) {
            const pastedCode = value.replace(/\D/g, '').split('').slice(0, 6);
            const updatedCode = [...verificationCode];
            pastedCode.forEach((digit, idx) => {
                if (idx < 6) updatedCode[idx] = digit;
            });

            setVerificationCode(updatedCode);
            const nextIndex = Math.min(5, index + pastedCode.length);
            if (inputRefs.current[nextIndex]) {
                inputRefs.current[nextIndex].focus();
            }
            return;
        }

        newCode[index] = value;
        setVerificationCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }

        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus();
        }

        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleVerify = async () => {
        const code = verificationCode.join('');
        if (code.length !== 6) {
            setError("Por favor, ingrese el código completo de 6 dígitos");
            return;
        }
        setIsVerifying(true);
        setError("");
        try {
            const rest = await postDataUsuario(`verify-email`, {
                "email": email,
                "code": code
            })
            if (rest.status === 200) {
                onVerificationSuccess()
            } else {
                setError("Error al verificar el código. Por favor, intente nuevamente.")
            }
        } catch (err) {
            if (err.status === 409) {
                setEmailAlreadyExists(true);
                setError("El correo electrónico ya se encuentra registrado en nuestro sistema")
            } else {
                setError("Error al verificar el código. Por favor, intente nuevamente.");
            }
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        if (!canResend) return;

        try {
            onResendCode?.();
            setCanResend(false);
            setTimeLeft(60);
            setVerificationCode(Array(6).fill(""));
            setError("");

            setTimeout(() => {
                if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
            }, 100);
        } catch (err) {
            setError("Error al reenviar el código. Por favor, intente nuevamente.");
        }
    };

    // Pantalla de carga inicial (con 1 segundo mínimo)
    if (isCheckingEmail) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#D7008A]/10 rounded-full mx-auto flex items-center justify-center mb-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <MailCheck className="w-8 h-8 text-[#D7008A]" />
                        </motion.div>
                    </div>
                    <h2 className="text-xl font-bold text-[#41023B]">Verificando Correo Electrónico</h2>
                    <p className="text-gray-600 mt-2">
                        Verificando disponibilidad del correo:<br />
                        <span className="font-medium text-[#D7008A]">{email}</span>
                    </p>
                </div>

                <div className="flex justify-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-[#D7008A] rounded-full animate-pulse"></div>
                        <span>Procesando...</span>
                    </div>
                </div>

                {/* Botón para regresar durante la verificación */}
                <div className="flex justify-center pt-4">
                    <button
                        type="button"
                        onClick={onGoBack}
                        className="flex items-center px-4 py-2 bg-white text-[#41023B] border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Modificar Correo
                    </button>
                </div>
            </motion.div>
        );
    }

    // Pantalla elegante para correo ya registrado
    if (emailAlreadyExists) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-gradient-to-r from-[#D7008A] to-[#41023B] rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg"
                    >
                        <UserCheck className="w-10 h-10 text-white" />
                    </motion.div>

                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold text-[#41023B] mb-3"
                    >
                        Correo Ya Registrado
                    </motion.h2>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                    >
                        <p className="text-gray-600">
                            El correo electrónico
                        </p>
                        <div className="bg-[#41023B]/20 rounded-xl p-4 border border-[#41023B]">
                            <span className="font-semibold text-[#41023B] text-lg">{email}</span>
                        </div>
                        <p className="text-gray-600">
                            ya está asociado a una cuenta existente en nuestro sistema.
                        </p>
                    </motion.div>
                </div>

                {/* Opciones elegantes */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                >
                    {/* Botones de acción */}
                    <div className="space-y-4">
                        {/* Botón principal para cambiar correo */}
                        <div className="flex justify-center">
                            <motion.button
                                type="button"
                                onClick={onGoBack}
                                className="flex items-center px-6 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                Cambiar Correo Electrónico
                            </motion.button>
                        </div>

                        {/* Enlace para iniciar sesión */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">
                                ¿Ya tienes una cuenta con este correo?
                            </p>

                            <a href="/Login"
                                className="inline-flex items-center text-[#D7008A] hover:text-[#41023B] font-medium text-sm transition-colors duration-200"
                            >
                                Iniciar Sesión en su Cuenta
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                    </div>

                    {/* Información adicional sutil */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center pt-4"
                    >
                        <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                            <UserCheck className="w-4 h-4" />
                            <span>Cada correo puede estar asociado a una sola cuenta</span>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        );
    }

    // Pantalla normal de verificación de código (sin cambios)
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#D7008A]/10 rounded-full mx-auto flex items-center justify-center mb-4">
                    <MailCheck className="w-8 h-8 text-[#D7008A]" />
                </div>
                <h2 className="text-xl font-bold text-[#41023B]">Verificación de Correo Electrónico</h2>
                <p className="text-gray-600 mt-2">
                    Hemos enviado un código de verificación a:<br />
                    <span className="font-medium text-[#D7008A]">{email}</span>
                </p>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-full gap-2">
                        {/* Grupo de los primeros tres dígitos */}
                        <div className="flex gap-2">
                            {[0, 1, 2].map((index) => (
                                <div key={`digit-${index}`} className="w-12 h-14 relative">
                                    <input
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        value={verificationCode[index]}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        maxLength={1}
                                        className={`w-full h-full text-center text-2xl font-bold bg-white border-2 ${error ? "border-red-300" : "border-gray-300"
                                            } rounded-lg focus:outline-none focus:border-[#D7008A] focus:ring-2 focus:ring-[#D7008A]/30`}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Separador */}
                        <div className="text-gray-400 text-2xl font-bold">-</div>

                        {/* Grupo de los últimos tres dígitos */}
                        <div className="flex gap-2">
                            {[3, 4, 5].map((index) => (
                                <div key={`digit-${index}`} className="w-12 h-14 relative">
                                    <input
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        value={verificationCode[index]}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        maxLength={1}
                                        className={`w-full h-full text-center text-2xl font-bold bg-white border-2 ${error ? "border-red-300" : "border-gray-300"
                                            } rounded-lg focus:outline-none focus:border-[#D7008A] focus:ring-2 focus:ring-[#D7008A]/30`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && !emailAlreadyExists && (
                        <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿No recibiste el código?{" "}
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={!canResend || isResending}
                                className={`${canResend && !isResending
                                    ? "text-[#D7008A] font-medium hover:underline"
                                    : "text-gray-400 cursor-default"
                                    }`}
                            >
                                {isResending ? (
                                    <span className="flex items-center">
                                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                        Reenviando...
                                    </span>
                                ) : canResend ? (
                                    "Reenviar código"
                                ) : (
                                    `Reenviar código (${timeLeft}s)`
                                )}
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    type="button"
                    onClick={onGoBack}
                    disabled={isVerifying}
                    className="flex items-center px-4 py-2 bg-white text-[#41023B] border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Modificar Correo
                </button>

                <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isVerifying || verificationCode.join('').length !== 6}
                    className={`flex items-center px-6 py-2 rounded-xl text-sm font-medium transition-colors ${isVerifying || verificationCode.join('').length !== 6
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white hover:opacity-90"
                        }`}
                >
                    {isVerifying ? (
                        <>
                            <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verificando...
                        </>
                    ) : (
                        <>
                            Verificar
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
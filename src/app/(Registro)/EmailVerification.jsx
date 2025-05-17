import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MailCheck, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function EmailVerification({
    email,
    onVerificationSuccess,
    onGoBack,
    isResending = false,
    onResendCode
}) {
    const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef([]);

    // Timer para resentir código
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
        if (inputRefs.current[0]) {
            setTimeout(() => {
                inputRefs.current[0].focus();
            }, 100);
        }
    }, []);

    // Manejar entrada de código con diferentes métodos
    const handleCodeChange = (index, value) => {
        // Validar que solo sean números
        if (value && !/^[0-9]+$/.test(value)) return;

        const newCode = [...verificationCode];

        // Para manejar pegar texto
        if (value.length > 1) {
            // Si se pega un código completo
            const pastedCode = value.replace(/\D/g, '').split('').slice(0, 6);

            // Llenar el formulario con los dígitos pegados
            const updatedCode = [...verificationCode];
            pastedCode.forEach((digit, idx) => {
                if (idx < 6) updatedCode[idx] = digit;
            });

            setVerificationCode(updatedCode);

            // Enfocar el último campo completado o el siguiente
            const nextIndex = Math.min(5, index + pastedCode.length);
            if (inputRefs.current[nextIndex]) {
                inputRefs.current[nextIndex].focus();
            }
            return;
        }

        // Para entrada normal de un solo caracter
        newCode[index] = value;
        setVerificationCode(newCode);

        // Si se ingresó un dígito, pasar al siguiente campo
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Si presiona retroceso y está vacío, ir al anterior
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }

        // Permite usar las flechas izquierda y derecha para navegar
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus();
        }

        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleVerify = async () => {
        const code = verificationCode.join('');

        // Validar que todos los campos estén completos
        if (code.length !== 6) {
            setError("Por favor, ingrese el código completo de 6 dígitos");
            return;
        }

        setIsVerifying(true);
        setError("");

        try {
            // Aquí se implementaría la llamada a la API para verificar el código
            // Por ahora simulamos una verificación exitosa (código 123456)
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (code === "123456") { // Simular verificación exitosa con código 123456
                onVerificationSuccess();
            } else {
                setError("El código ingresado no es válido. Por favor, intente nuevamente.");
            }
        } catch (err) {
            setError("Error al verificar el código. Por favor, intente nuevamente.");
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

            // Volver a enfocar el primer campo
            setTimeout(() => {
                if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
            }, 100);
        } catch (err) {
            setError("Error al reenviar el código. Por favor, intente nuevamente.");
        }
    };

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

                    {error && (
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
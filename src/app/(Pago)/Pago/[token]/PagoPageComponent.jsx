"use client"
import { postDataSolicitud } from '@/api/endpoints/solicitud';
import BackgroundAnimation from '@/Components/Home/BackgroundAnimation';
import PaymentFooter from '@/Components/PaymentLink/Footer';
import PageHeader from '@/Components/PaymentLink/Header';
import PagosColg from '@/Components/PagosModal';
import {CreditCard, AlertTriangle, BadgeCheck} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from "framer-motion";

const Page = ({ props }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const { data, error } = props;

    // Si hay error, mostrar página de error simple
    if (error) {
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
                            <div className="w-full flex justify-center mt-18 mb-6">
                                <Image
                                    src="/assets/logo.png"
                                    alt="Logo Colegio de Odontólogos de Venezuela"
                                    width={420}
                                    height={80}
                                    className="relative drop-shadow-md object-contain max-w-full h-auto"
                                />
                            </div>
                            <motion.div
                                className="relative overflow-hidden rounded-2xl group"
                                whileHover={{ y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border border-white/40 shadow-xl rounded-2xl z-1"></div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#41023B]/20 to-[#D7008A]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                                <div className="relative p-6 sm:p-8 z-10 text-center">
                                    <div className="flex justify-center mb-4">
                                        <AlertTriangle className="w-8 h-8 text-red-500" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#41023B] mb-4 sm:mb-5">
                                        Error de Pago
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                        {error || "Token inválido, por favor solicite un nuevo enlace de pago."}
                                    </p>
                                    <div className="w-full flex items-center justify-center">
                                        <Link
                                            href="/Login"
                                            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white p-4 rounded-md flex items-center text-sm font-medium hover:bg-purple-200 transition-colors "
                                        >
                                            <span>Regresar a Inicio de Sesión</span>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Si no hay datos válidos, mostrar error genérico
    if (!data) {
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
                            <div className="w-full flex justify-center mt-18">
                                <Image
                                    src="/assets/logo.png"
                                    alt="Logo Colegio de Odontólogos de Venezuela"
                                    width={420}
                                    height={80}
                                    className="relative drop-shadow-md object-contain max-w-full h-auto"
                                />
                            </div>
                            <motion.div
                                className="relative overflow-hidden rounded-2xl group"
                                whileHover={{ y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border border-white/40 shadow-xl rounded-2xl z-1"></div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#41023B]/20 to-[#D7008A]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                                <div className="relative p-6 sm:p-8 z-10 text-center">
                                    <div className="flex justify-center mb-4">
                                        <AlertTriangle className="w-8 h-8 text-yellow-500" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#41023B] mb-4 sm:mb-5">
                                        Sin Datos
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                        No se encontraron datos válidos para este enlace de pago.
                                    </p>
                                    <div className="w-full flex items-center justify-center">
                                        <Link
                                            href="/Login"
                                            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white p-4 rounded-md flex items-center text-sm font-medium hover:bg-purple-200 transition-colors "
                                        >
                                            <span>Regresar a Inicio de Sesión</span>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    
    const formatDate = (dateString) => {
        if (!dateString) return "No especificada";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return "USD$ 0.00";
        return `USD$ ${parseFloat(amount).toFixed(2)}`;
    };

    const formatTime = (timeString) => {
        if (!timeString) return "";
        return timeString.slice(0, 5); // "09:00:00" -> "09:00"
    };
    
    const paymentData = {
        expires_at: formatDate(data.expires_at),
        token: data.token,
        objeto_info: data.objeto_info
    };

    const costoInscripcion = data.costo_total.total_usd;
    const totalCost = data.costo_total.total_usd;
    
    // Determinar el tipo de contenido y si hay múltiples items
    const getContentInfo = () => {
        const objetoInfo = data.objeto_info;
        
        if (objetoInfo.tipo === "inscripcion") {
            if (objetoInfo.evento) {
                return {
                    type: "evento",
                    title: objetoInfo.evento.nombre,
                    description: objetoInfo.evento.descripcion,
                    coverUrl: objetoInfo.evento.cover_url,
                    logoUrl: objetoInfo.evento.logo_url,
                    hasMultiple: false,
                    details: {
                        lugar: objetoInfo.evento.lugar,
                        fecha: formatDate(objetoInfo.evento.fecha),
                        horario: `${formatTime(objetoInfo.evento.hora_inicio)} - ${formatTime(objetoInfo.evento.hora_final)}`,
                        cupos: objetoInfo.evento.cupos,
                        precio: objetoInfo.evento.precio
                    }
                };
            } else if (objetoInfo.curso) {
                return {
                    type: "curso",
                    title: objetoInfo.curso.nombre,
                    description: objetoInfo.curso.descripcion,
                    coverUrl: objetoInfo.curso.cover_url,
                    hasMultiple: false,
                    details: {
                        instructores: objetoInfo.curso.instructores,
                        lugar: objetoInfo.curso.lugar,
                        fecha_inicio: formatDate(objetoInfo.curso.fecha_inicio),
                        fecha_fin: formatDate(objetoInfo.curso.fecha_fin),
                        horario: formatTime(objetoInfo.curso.hora_inicio),
                        duracion: objetoInfo.curso.duracion,
                        cupos: objetoInfo.curso.cupos,
                        precio: objetoInfo.curso.precio
                    }
                };
            }
        } else if (objetoInfo.tipo === "solicitud") {
            const carnet = objetoInfo.detalles?.carnet;
            const constancias = objetoInfo.detalles?.constancias || [];
            const hasMultiple = (carnet && constancias.length > 0) || constancias.length > 1;
            
            return {
                type: "solicitud",
                title: objetoInfo.descripcion,
                description: "Solicitud de documentos del colegio",
                hasMultiple,
                details: {
                    carnet,
                    constancias,
                    fecha_creacion: formatDate(objetoInfo.fecha_creacion)
                }
            };
        } else if (objetoInfo.tipo === "solicitud_solvencia") {
            return {
                type: "solvencia",
                title: objetoInfo.descripcion,
                description: `Solvencia con vigencia de ${objetoInfo.vigencia_meses} meses`,
                hasMultiple: false,
                details: {
                    modelo: objetoInfo.modelo_solvencia?.nombre,
                    duracion: objetoInfo.modelo_solvencia?.duracion,
                    vigencia_meses: objetoInfo.vigencia_meses,
                    fecha_creacion: formatDate(objetoInfo.fecha_creacion)
                }
            };
        }
        
        return {
            type: "unknown",
            title: objetoInfo.descripcion || "Pago",
            description: "",
            hasMultiple: false,
            details: {}
        };
    };

    const contentInfo = getContentInfo();
    const hasMultipleItems = contentInfo.hasMultiple;

    const handlePago = async (pagoData) => {
        setIsSubmitting(true);
        
        try {
            // Preparar los datos según la nueva estructura requerida
            const objetoInfo = data.objeto_info;
            
            const paymentPayload = {
                type_id: objetoInfo.tipo,
                object_id: objetoInfo.id,
                monto: parseFloat(pagoData.totalAmount),
                moneda: pagoData.metodo_de_pago?.datos_adicionales?.slug === "paypal" ? "usd" : "bs",
                num_referencia: pagoData.referenceNumber || "",
                metodo_de_pago: pagoData.metodo_de_pago?.id || 0,
                tasa_bcv_del_dia: parseFloat(pagoData.tasa_bcv_del_dia) || 0
            };

            console.log("Enviando datos de pago:", paymentPayload);

            // Crear FormData para envío
            const formData = new FormData();
            
            // Agregar todos los campos del payload
            Object.keys(paymentPayload).forEach(key => {
                formData.append(key, paymentPayload[key]);
            });

            // Agregar archivo si existe
            if (pagoData.paymentFile) {
                formData.append('comprobante', pagoData.paymentFile);
            }

            // Agregar fecha de pago si existe
            if (pagoData.paymentDate) {
                formData.append('fecha_pago', pagoData.paymentDate);
            }

            const response = await postDataSolicitud("pagos-generico", formData);
            
            console.log("Respuesta del pago:", response);
            
            // Manejar respuesta exitosa
            if (response.success || response.status === 'success' || response.data) {
                setIsPaymentSuccess(true);
            } else {
                throw new Error(response.message || "Error al procesar el pago");
            }
            
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            alert(`Error al procesar el pago: ${error.message || "Error desconocido"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderContentDetails = () => {
        const { type, details, coverUrl, logoUrl } = contentInfo;

        return (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">
                    {contentInfo.title}
                </h3>

                {/* Mostrar imagen si existe */}
                {(coverUrl || logoUrl) && (
                    <div className="mb-3">
                        <img
                            src={
                                (coverUrl || logoUrl).startsWith("/")
                                    ? `${process.env.NEXT_PUBLIC_BACK_HOST}${coverUrl || logoUrl}`
                                    : (coverUrl || logoUrl)
                            }
                            alt={contentInfo.title}
                            className="w-full object-contain rounded-lg"
                        />
                    </div>
                )}

                {/* Descripción */}
                {contentInfo.description && (
                    <p className="text-sm text-gray-600 mb-3">
                        {contentInfo.description}
                    </p>
                )}

                {/* Detalles específicos por tipo */}
                <div className="mb-3 space-y-1">
                    {type === "evento" && (
                        <>
                            <div className="text-sm text-gray-600">📍 <strong>Lugar:</strong> {details.lugar}</div>
                            <div className="text-sm text-gray-600">📅 <strong>Fecha:</strong> {details.fecha}</div>
                            <div className="text-sm text-gray-600">🕐 <strong>Horario:</strong> {details.horario}</div>
                            <div className="text-sm text-gray-600">👥 <strong>Cupos:</strong> {details.cupos}</div>
                        </>
                    )}

                    {type === "curso" && (
                        <>
                            <div className="text-sm text-gray-600">👨‍🏫 <strong>Instructores:</strong> {details.instructores}</div>
                            <div className="text-sm text-gray-600">📍 <strong>Lugar:</strong> {details.lugar}</div>
                            <div className="text-sm text-gray-600">📅 <strong>Inicio:</strong> {details.fecha_inicio}</div>
                            <div className="text-sm text-gray-600">📅 <strong>Fin:</strong> {details.fecha_fin}</div>
                            <div className="text-sm text-gray-600">🕐 <strong>Horario:</strong> {details.horario}</div>
                            <div className="text-sm text-gray-600">⏱️ <strong>Duración:</strong> {details.duracion}</div>
                            <div className="text-sm text-gray-600">👥 <strong>Cupos:</strong> {details.cupos}</div>
                        </>
                    )}

                    {type === "solicitud" && (
                        <>
                            <div className="text-sm text-gray-600">📅 <strong>Fecha de creación:</strong> {details.fecha_creacion}</div>
                            {details.carnet && (
                                <div className="text-sm text-gray-600 ml-2">
                                    • <strong>Carnet:</strong> {formatCurrency(details.carnet.costo_usd)} - Status: {details.carnet.status}
                                </div>
                            )}
                            {details.constancias?.map((constancia, index) => (
                                <div key={index} className="text-sm text-gray-600 ml-2">
                                    • <strong>{constancia.tipo_constancia.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {formatCurrency(constancia.costo_usd)} - Status: {constancia.status}
                                </div>
                            ))}
                        </>
                    )}

                    {type === "solvencia" && (
                        <>
                            <div className="text-sm text-gray-600">📋 <strong>Modelo:</strong> {details.modelo}</div>
                            <div className="text-sm text-gray-600">⏱️ <strong>Vigencia:</strong> {details.vigencia_meses} meses</div>
                            <div className="text-sm text-gray-600">📅 <strong>Fecha de creación:</strong> {details.fecha_creacion}</div>
                        </>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total:</span>
                    <span className="text-xl font-bold text-purple-600">{formatCurrency(totalCost)}</span>
                </div>
            </div>
        );
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
                    <div className="relative w-full z-20 min-h-screen flex flex-col justify-between px-6 py-12">
                        <PageHeader />
                        <div className='flex justify-center items-center mx-auto'>
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                {!isPaymentSuccess ? (
                                    <>
                                        <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-4">
                                            <h2 className="text-xl font-bold text-white flex items-center">
                                                <CreditCard className='w-6 h-6 mr-2' />
                                                Procesar Pago
                                            </h2>
                                        </div>

                                        <div className="p-6 justify-center items-center min-w-2xl max-w-2xl mx-auto">
                                            {renderContentDetails()}

                                            <PagosColg props={{
                                                costo: costoInscripcion,
                                                allowMultiplePayments: false,
                                                handlePago: handlePago,
                                                isSubmitting: isSubmitting
                                            }}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    // Mensaje de éxito del pago
                                    <motion.div
                                        className="relative overflow-hidden rounded-2xl group"
                                        whileHover={{ y: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border border-white/40 shadow-xl rounded-2xl z-1"></div>
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[#41023B]/20 to-[#D7008A]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                                        <div className="relative p-6 sm:p-8 z-10 text-center flex flex-col items-center gap-3">
                                            <h2 className="text-xl sm:text-2xl font-bold text-[#41023B] sm:mb-5 flex gap-5">
                                                Pago Procesado<BadgeCheck className="size-10 text-green-600" />
                                            </h2>
                                            <p className="text-sm sm:text-base text-gray-600 sm:mb-6">
                                                Su pago ha sido registrado exitosamente. <br />
                                                Recibirá un correo electrónico con la confirmación y los detalles de su pago.
                                            </p>

                                            <div className="w-full flex items-center justify-center">
                                                <Link
                                                    href="/Login"
                                                    className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white p-4 rounded-md flex items-center text-sm font-medium hover:bg-purple-200 transition-colors"
                                                >
                                                    <span>Regresar a Inicio de Sesión</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                        <PaymentFooter paymentData={paymentData} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page;

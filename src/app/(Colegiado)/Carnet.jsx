"use client";

import { useState, useEffect } from 'react';
import { Expand, Download } from 'lucide-react';
import useColegiadoUserStore from '@/store/colegiadoUserStore';
import api from '@/api/api';
import { generateConstanciaPDF, downloadPDF, openPDF } from '@/utils/PDF/constanciasPDFService';

export default function Carnet() {
    const [isHovered, setIsHovered] = useState(false);
    const [carnet, setCarnet] = useState(null);
    const colegiadoUser = useColegiadoUserStore(state => state.colegiadoUser);
    const loadCarnet = async () => {
        try {
            if (!colegiadoUser) return;
            const solicitudCarnet = await api.get(`/solicitudes/solicitud_unida/?colegiado=${colegiadoUser.colegiado_id}&status=cerrada&solicitudcarnet__status=aprobado`);
            const datosResponse = await api.get(`/solicitudes/solicitud_carnet/${solicitudCarnet.data.results[0].id}/datos/`);
            const datosCarnet = datosResponse.data;
            const { docDefinition } = generateConstanciaPDF(datosCarnet, 'carnet');
            const pdfUrl = await openPDF(docDefinition);
            setCarnet({url:pdfUrl,datos:datosCarnet});
        } catch (error) {
            console.error("Error al cargar el carnet:", error);
        }
    }
    useEffect(() => {
        loadCarnet();
    }, [colegiadoUser]);

    const getFileName = () => {
        if (!carnet?.datos) return 'carnet.pdf';
        const colegiado = carnet.datos.colegiado_nombre || 'colegiado';
        const fecha = new Date().toISOString().split('T')[0]; 
        return `carnet_${colegiado.replace(/\s+/g, '_')}_${fecha}.pdf`;
    };
    return (
        <div className="w-full h-full">
            {/* Versión completa para pantallas grandes (lg y más grandes) */}
            <div className="hidden lg:flex bg-white rounded-xl overflow-hidden transition-all duration-300 ease-out hover:shadow-xl h-full flex-col">
                {/* Encabezado del visor */}
                <div className="bg-gradient-to-b from-[#41023B] to-[#D7008A] p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center text-white">
                            <h2 className="text-sm font-semibold">Carnet Vigente hasta: {carnet ? carnet.datos.fecha_vencimiento : "No hay carnet vigente"}</h2>
                        </div>
                        <div className="flex space-x-2">
                            <a
                                href={carnet?.url}
                                download={getFileName()}
                                className="text-white hover:text-gray-200 transition-colors"
                                title="Descargar PDF"
                            >
                                <Download size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Contenedor del PDF */}
                <div
                    className="relative flex-1"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="pdf-container overflow-hidden relative border-t border-gray-100 h-full">
                        {/* Visor de PDF */}
                        <iframe
                            src={carnet?.url}
                            title="Carnet PDF"
                            className="w-full h-full min-h-[400px]"
                            style={{ overflow: 'hidden' }}
                        />

                        {/* Overlay con efecto hover */}
                        <a
                            href={carnet?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 flex items-end justify-center p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}
                        >
                            <div className="bg-white/90 rounded-lg py-2 px-4 text-sm text-gray-800 font-medium shadow-lg transform transition-transform duration-300 ease-out translate-y-0 flex items-center">
                                <Expand size={16} className="text-[#D7008A] mr-2" />
                                <span>Click para ver en pantalla completa</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            <div className="lg:hidden flex flex-col items-center justify-center bg-white rounded-xl p-6 shadow-md">
                <div className="text-center mb-4">
                    <h2 className="text-lg font-semibold text-[#41023B]">Carnet Vigente</h2>
                    <p className="text-sm text-gray-600 mt-1">Válido hasta: 12/12/2025</p>
                </div>
                <a
                    href={carnet?.url}
                    download={getFileName()}
                    className="flex items-center justify-center gap-2 bg-gradient-to-b from-[#41023B] to-[#D7008A] hover:from-[#510549] hover:to-[#e20091] text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
                >
                    <Download size={20} />
                    <span>Descargar Carnet</span>
                </a>
            </div>
        </div>
    );
}
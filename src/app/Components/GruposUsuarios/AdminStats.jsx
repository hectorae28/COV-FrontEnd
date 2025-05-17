import { motion } from "framer-motion";
import { Activity, BarChart2, ClipboardList, PieChart } from "lucide-react";
import { useEffect, useState } from "react";

// Componente de gráfico de barras para actividad mensual
const ActivityChart = ({ data }) => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];

    // Determinar el valor máximo para escalar el gráfico
    const maxValue = Math.max(...data);

    return (
        <div className="py-4">
            <div className="flex items-end h-52 gap-2">
                {data.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                            className="w-full bg-[#D7008A] rounded-t-md transition-all duration-500"
                            style={{
                                height: `${(value / maxValue) * 100}%`,
                                opacity: 0.6 + (value / maxValue) * 0.4
                            }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-2">{months[index]}</span>
                    </div>
                ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>{Math.floor(maxValue / 2)}</span>
                <span>{maxValue}</span>
            </div>
        </div>
    );
};

// Componente de gráfico circular para distribución de acciones
const PieChartComponent = ({ data }) => {
    // Calcular el total para los porcentajes
    const total = data.reduce((sum, item) => sum + item.valor, 0);

    // Calcular ángulos para cada segmento
    let startAngle = 0;
    const segments = data.map(item => {
        const percentage = (item.valor / total) * 100;
        const angle = (item.valor / total) * 360;
        const segment = {
            ...item,
            percentage,
            startAngle,
            endAngle: startAngle + angle
        };
        startAngle += angle;
        return segment;
    });

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {segments.map((segment, index) => {
                        const x1 = 50 + 40 * Math.cos((segment.startAngle * Math.PI) / 180);
                        const y1 = 50 + 40 * Math.sin((segment.startAngle * Math.PI) / 180);
                        const x2 = 50 + 40 * Math.cos((segment.endAngle * Math.PI) / 180);
                        const y2 = 50 + 40 * Math.sin((segment.endAngle * Math.PI) / 180);

                        const largeArcFlag = segment.endAngle - segment.startAngle <= 180 ? "0" : "1";

                        const pathData = [
                            `M 50 50`,
                            `L ${x1} ${y1}`,
                            `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                            `Z`
                        ].join(" ");

                        return (
                            <path
                                key={index}
                                d={pathData}
                                fill={segment.color}
                                stroke="#fff"
                                strokeWidth="0.5"
                            />
                        );
                    })}
                </svg>
            </div>

            <div className="flex flex-col gap-2">
                {segments.map((segment, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: segment.color }}
                        ></div>
                        <span className="text-sm">{segment.nombre}</span>
                        <span className="text-sm font-semibold ml-auto">{segment.percentage.toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Componente principal de estadísticas
export default function AdminStats({ adminId, stats }) {
    const [timeRange, setTimeRange] = useState("6m"); // 1m, 3m, 6m, 1y
    const [isLoading, setIsLoading] = useState(false);

    // En una implementación real, aquí cargaríamos datos específicos según el rango de tiempo
    useEffect(() => {
        if (timeRange) {
            setIsLoading(true);
            // Simular carga de datos
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    }, [timeRange, adminId]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            {/* Cabecera */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <BarChart2 className="text-[#D7008A]" size={24} />
                    <h2 className="text-xl font-semibold">Estadísticas de Actividad</h2>
                </div>

                <div>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A] focus:border-[#D7008A]"
                    >
                        <option value="1m">Último mes</option>
                        <option value="3m">Últimos 3 meses</option>
                        <option value="6m">Últimos 6 meses</option>
                        <option value="1y">Último año</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D7008A]"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfico de actividad mensual */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <Activity size={18} className="text-[#D7008A]" />
                            Actividad Mensual
                        </h3>
                        <ActivityChart data={stats.accionesMensuales} />
                    </div>

                    {/* Gráfico de distribución de acciones */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <PieChart size={18} className="text-[#D7008A]" />
                            Distribución de Acciones
                        </h3>
                        <PieChartComponent data={stats.distribucionAcciones} />
                    </div>

                    {/* Últimas acciones */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <ClipboardList size={18} className="text-[#D7008A]" />
                            Últimas Acciones Realizadas
                        </h3>

                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acción
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stats.ultimasAcciones.map((accion, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${accion.tipo === "usuario"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : accion.tipo === "permiso"
                                                            ? "bg-purple-100 text-purple-800"
                                                            : accion.tipo === "contenido"
                                                                ? "bg-green-100 text-green-800"
                                                                : accion.tipo === "reporte"
                                                                    ? "bg-amber-100 text-amber-800"
                                                                    : accion.tipo === "finanzas"
                                                                        ? "bg-indigo-100 text-indigo-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {accion.tipo.charAt(0).toUpperCase() + accion.tipo.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{accion.accion}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{accion.fecha}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
export default function TabNavigation({ activeTab, setActiveTab }) {
    return (
        <div className="flex flex-wrap border-b border-gray-200 mb-6">
            <button
                className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-300 ${activeTab === "personal" ? "border-[#D7008A] text-[#D7008A]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("personal")}
            >
                Datos Personales
            </button>
            <button
                className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-300 ${activeTab === "contacto" ? "border-[#D7008A] text-[#D7008A]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("contacto")}
            >
                Datos de Contacto
            </button>
            <button
                className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-300 ${activeTab === "colegiado" ? "border-[#D7008A] text-[#D7008A]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("colegiado")}
            >
                Información Profesional
            </button>
            <button
                className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-300 ${activeTab === "laboral" ? "border-[#D7008A] text-[#D7008A]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("laboral")}
            >
                Situación Laboral
            </button>
        </div>
    );
}
import { Search } from "lucide-react";

export default function SearchBar({ searchTerm, setSearchTerm }) {
    return (
        <div className="flex-1 w-full md:w-auto">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar por Nombre, Cédula..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
        </div>
    );
}
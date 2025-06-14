import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-[#6A0080] to-[#C40180] text-white py-6 sm:py-8 md:py-10 px-4 rounded-t-3xl sm:rounded-t-4xl">
            <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 items-start">
                    {/* Columna 1 - Logo y dirección */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                        <img src="/assets/escudo.png" alt="Logo" className="w-16 h-20 sm:w-18 md:w-20 md:h-26" />
                        <div className="text-center sm:text-left mt-2 sm:mt-0">
                            <h3 className="text-base md:text-[16px] font-bold sm:text-[14px]">Colegio de Odontólogos de Venezuela</h3>
                            <p className="font-light text-white/60 text-sm md:text-[14px] sm:text-[12px]">
                                Urb. Las Palmas, Calle el Pasaje,<br />
                                Edif. Colegio de Odontólogos.<br />
                                Caracas, Venezuela.
                            </p>
                        </div>
                    </div>

                    {/* Columna 2 - Teléfonos */}
                    <div className="flex justify-center sm:justify-start md:justify-center">
                        <div className="text-center sm:text-left">
                            <h3 className="text-base md:text-lg font-bold">Teléfonos:</h3>
                            <p className="mt-2 text-sm md:text-base">
                                Finanzas: (0212) 793-5687<br />
                                Presidencia: (0212) 781-2267
                            </p>
                        </div>
                    </div>

                    {/* Columna 3 - Redes sociales */}
                    <div className="flex justify-center md:justify-end items-center space-x-6">
                        <span className="cursor-pointer group">
                            <div className="w-5 h-5 md:w-6 md:h-6 transition-opacity group-hover:opacity-60">
                                <img src="/assets/icons/twitter.png" alt="X" className="w-full h-full" />
                            </div>
                        </span>
                        <span className="cursor-pointer hover:text-gray-300 transition-colors">
                            <FaFacebook size={22} className="md:w-6 md:h-6" />
                        </span>
                        <span className="cursor-pointer hover:text-gray-300 transition-colors">
                            <FaInstagram size={24} className="md:w-7 md:h-7" />
                        </span>
                        <span className="cursor-pointer hover:text-gray-300 transition-colors">
                            <FaYoutube size={26} className="md:w-8 md:h-8" />
                        </span>
                    </div>
                </div>

                <div className="mt-8 md:mt-12 text-center sm:text-left">
                    <p className="text-xs sm:text-sm">Copyright © 2025 Colegio de Odontólogos de Venezuela J-00041277-4</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
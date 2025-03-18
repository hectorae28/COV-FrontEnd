import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-[#6A0080] to-[#C40180] text-white py-10 px-4 rounded-t-4xl">
            <div className="w-full px-26">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Columna 1*/}
                    <div className="flex items-center space-x-4">
                        <img src="/assets/escudo.png" alt="Logo" className="w-20 h-26" />
                        <div className="mt-4">
                            <h3 className="text-lg font-bold">Colegio de Odontólogos de Venezuela</h3>
                            <p className="font-light text-white/60">
                                Urb. Las Palmas, Calle el Pasaje,<br />
                                Edif. Colegio de Odontólogos.<br />
                                Caracas, Venezuela.
                            </p>
                        </div>
                    </div>

                    {/* Columna 2 */}
                    <div className="flex flex-col items-center px-38">
                        <div className="self-start">
                            <h3 className="text-lg font-bold">Teléfonos:</h3>
                            <p className="mt-2">
                                Finanzas: (0212) 793-5687<br />
                                Presidencia: (0212) 781-2267
                            </p>
                        </div>
                    </div>

                    {/* Columna 3 */}
                    <div className="flex justify-end items-center">
                        <span className="mr-5 cursor-pointer group">
                            <div className="w-5 h-5 transition-opacity group-hover:opacity-60">
                                <img src="/assets/icons/twitter.png" alt="X" className="w-full h-full" />
                            </div>
                        </span>
                        <span className="mr-5 cursor-pointer hover:text-gray-400 transition-colors">
                            <FaFacebook size={26} />
                        </span>
                        <span className="mr-5 cursor-pointer hover:text-gray-400 transition-colors">
                            <FaInstagram size={28} />
                        </span>
                        <span className="cursor-pointer hover:text-gray-400 transition-colors">
                            <FaYoutube size={30} />
                        </span>
                    </div>
                </div>

                <div className="mt-12 text-left">
                    <p>Copyright © 2025 Colegio de Odontólogos de Venezuela J-00041277-4</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
import Image from "next/image";
export default function PageHeader() {
  return (
    <div className="mb-8 text-center flex flex-col items-center justify-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Enlace de Pago</h1>
      <Image
        src="/assets/logo.png"
        alt="Logo Colegio de Odontólogos de Venezuela"
        width={420}
        height={80}
        className="relative drop-shadow-md object-contain max-w-full h-auto"
      />
    </div>
  )
}

import Image from 'next/image';

export default function Carnet() {
  return (
    <div className="mb-10">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900">Carnet Vigente hasta: 12/12/2025</h2>
        </div>
        <div className="p-4 flex justify-center">
          <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-sm">
            <Image
              src="/carnet-ejemplo.png"
              alt="Carnet digital"
              width={400}
              height={250}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

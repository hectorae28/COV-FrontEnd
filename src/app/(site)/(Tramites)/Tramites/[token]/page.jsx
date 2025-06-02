import BackgroundAnimation from '@/app/Components/BackgroundAnimation';
import Image from 'next/image';

const Page = () => {
    return (
        <div>
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;

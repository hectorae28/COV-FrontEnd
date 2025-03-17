"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const aliados = [
    { id: 1, logo: '/assets/sponsor/1.png' },
    { id: 2, logo: '/assets/sponsor/2.png' },
    { id: 3, logo: '/assets/sponsor/3.png' },
    { id: 4, logo: '/assets/sponsor/4.png' },
    { id: 5, logo: '/assets/sponsor/5.png' },
    { id: 6, logo: '/assets/sponsor/6.png' },
    { id: 7, logo: '/assets/sponsor/7.png' },
    { id: 8, logo: '/assets/sponsor/8.png' },
    { id: 9, logo: '/assets/sponsor/9.png' },
    { id: 10, logo: '/assets/sponsor/10.png' },
    { id: 11, logo: '/assets/sponsor/11.png' },
    { id: 12, logo: '/assets/sponsor/12.png' },
    { id: 13, logo: '/assets/sponsor/13.png' },
];

const Sponsor = () => {
    const [activeIndex, setActiveIndex] = useState(4);
    const [isLoaded, setIsLoaded] = useState(false);
    const [logoPositions, setLogoPositions] = useState([]);

    useEffect(() => {
        const initialPositions = getOrderedAliados();
        setLogoPositions(initialPositions);
        setTimeout(() => setIsLoaded(true), 100);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            setLogoPositions(getOrderedAliados());
        }
    }, [activeIndex, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % aliados.length);
        }, 3000);
        
        return () => clearInterval(interval);
    }, [isLoaded]);

    const getOrderedAliados = () => {
        const result = [];
        const totalVisible = 7;
        const halfVisible = Math.floor(totalVisible / 2);
        
        for (let i = -halfVisible; i <= halfVisible; i++) {
            const index = (activeIndex + i + aliados.length) % aliados.length;
            result.push({
                ...aliados[index],
                position: i
            });
        }
        
        return result;
    };
    
    const handleClickLogo = (index) => {
        setActiveIndex(index);
    };

    const curvedTitleStyle = {
        fontStyle: 'italic',
        transform: 'perspective(500px) rotateX(10deg)',
        textShadow: '0 4px 5px rgba(0,0,0,0.1)',
        paddingBottom: '10px',
        display: 'inline-block'
    };

    return (
        <section className="overflow-hidden mt-10">
            <div className="container mx-auto px-8">
                <div className="text-center">
                    <h2 
                        className="text-[48px] font-extrabold text-center bg-gradient-to-br from-[#01c2fd] to-[#016FFB] text-transparent bg-clip-text italic inline-block"
                        style={curvedTitleStyle}
                    >
                        Nuestros Aliados
                    </h2>
                </div>
                
                <div className="relative h-48 mt-40">
                    <div className="absolute w-full flex justify-center items-center">
                        {logoPositions.map((aliado) => {
                            const isCenter = aliado.position === 0;
                            const distance = Math.abs(aliado.position);
                            const scale = isCenter ? 1 : 1 - (distance * 0.15);
                            const opacity = isCenter ? 1 : 1 - (distance * 0.3);
                            const translateX = aliado.position * 220;

                            const containerWidth = isCenter ? 240 : 180;
                            const containerHeight = isCenter ? 180 : 100;

                            const imageWidth = isCenter ? 180 : 100;
                            const imageHeight = isCenter ? 120 : 60;
                            
                            return (
                                <div
                                    key={aliado.id}
                                    className={`absolute bg-white p-4 rounded-lg shadow-sm transition-all duration-500 ease-in-out flex items-center justify-center cursor-pointer overflow-hidden
                                        ${isCenter ? 'shadow-lg z-10' : 'z-0'}`}
                                    style={{
                                        transform: `translateX(${translateX}px) scale(${scale})`,
                                        opacity,
                                        width: `${containerWidth}px`,
                                        height: `${containerHeight}px`,
                                    }}
                                    onClick={() => handleClickLogo(aliados.findIndex(a => a.id === aliado.id))}
                                >
                                    <div className="flex items-center justify-center w-full h-full">
                                        <Image
                                            src={aliado.logo}
                                            alt={`Logo de ${aliado.name}`}
                                            width={imageWidth}
                                            height={imageHeight}
                                            className="object-contain max-w-full max-h-full"
                                            priority={isCenter}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Sponsor;
"use client";

import React from 'react';

const CardNoticias = ({ item, index }) => {
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 hover:shadow-[#590248]/30 flex flex-col h-full"
            style={{ gridArea: `card-${index + 1}` }}
        >
            <div className="relative p-4">
                <div className={`
                    w-full overflow-hidden rounded-lg
                    ${item.size === "normal" ? "h-[180px]" : item.size === "alto" ? "h-[500px]" : "h-[220px]"}
                `}>
                    {item.imageUrl.length > 1 ? (
                        <div className={`flex ${item.size === "alto" ? "flex-col" : "flex-row"} h-full w-full gap-8`}>
                            {item.imageUrl.map((url, imgIndex) => (
                                <div
                                    key={imgIndex}
                                    className={`
                                        flex items-center justify-center overflow-hidden
                                        ${item.size === "ancho" ? "w-1/2" : "w-full"} 
                                        ${item.size === "alto" ? "h-4/5" : "h-full"}
                                    `}
                                >
                                    <img
                                        src={url}
                                        alt={`${item.title} image ${imgIndex + 1}`}
                                        className="object-cover w-full h-full"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/400x200";
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-full">
                            <img
                                src={item.imageUrl[0]}
                                alt={item.title}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/400x200";
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className={`p-6 flex-grow flex flex-col relative ${item.size === "alto" ? "mt-2" : ""}`}>
                {/* Fecha */}
                <div className="absolute mr-4 mb-2 top-[-2] right-0 bg-gradient-to-l from-[#C40180] to-[#590248] text-white px-3 py-1 text-xs rounded-lg shadow-md">
                    {item.date}
                </div>
                {/* Título y descripción */}
                <h3 className="text-xl mt-2 font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{item.description}</p>
                <button className="text-[#590248]/60 font-semibold text-end hover:text-[#590248] transition-colors duration-300 mt-auto cursor-pointer">
                    Leer más →
                </button>
            </div>
        </div>
    );
};

export default CardNoticias;
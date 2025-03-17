"use client";
import React from 'react';

const CardNoticias = ({ item, index }) => {
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
            style={{ gridArea: `card-${index + 1}` }}
        >
            <div className="relative p-6">
                <div className={`
                    w-full overflow-hidden
                    ${item.size === "normal" ? "h-[140px]" : item.size === "alto" ? "h-[540px]" : "h-[280px]"}
                    ${item.size === "ancho" ? "w-full" : ""}
                `}>
                    {item.imageUrl.length > 1 ? (
                        <div className={`flex ${item.size === "alto" ? "flex-col" : "flex-row"} h-full`}>
                            {item.imageUrl.map((url, imgIndex) => (
                                <div key={imgIndex} className={`flex items-center justify-center ${item.size === "ancho" ? "w-1/2" : ""} ${item.size === "ancho" ? "mx-2" : ""} ${item.size === "alto" ? "my-2" : ""}`}>
                                    <img
                                        src={url}
                                        className="max-w-full max-h-full"
                                        style={{
                                            width: item.size === "normal" ? "300px" : "auto",
                                            height: item.size === "normal" ? "280px" : "auto"
                                        }}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/400x200";
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <img
                                src={item.imageUrl[0]}
                                className="max-w-full max-h-full"
                                style={{
                                    width: item.size === "normal" ? "340px" : "auto",
                                    height: item.size === "normal" ? "300px" : "auto"
                                }}
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/400x200";
                                }}
                            />
                        </div>
                    )}
                </div>
                <div className="absolute top-2 right-2 bg-gradient-to-l from-[#C40180] to-[#590248] text-white px-3 py-1 text-xs rounded-lg shadow-md">
                    {item.date}
                </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 min-h-[2rem]">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{item.description}</p>
                <button className="text-[#590248] font-medium text-end hover:text-gray-400 transition-colors duration-300 mt-auto">
                    Leer más →
                </button>
            </div>
        </div>
    );
};

export default CardNoticias;
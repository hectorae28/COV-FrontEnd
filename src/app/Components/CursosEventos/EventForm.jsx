"use client";

import { useState } from "react";
import { FiDollarSign, FiPlus, FiTag } from "react-icons/fi";
import CardPreview from "./CardPreview";

export default function EventForm({
    formValues,
    setFormValues,
    handleSave,
    isCreating,
    handleNewItem,
    tabIndex,
    isInline = false
}) {
    const [imageType, setImageType] = useState("file");
    const [imageUrl, setImageUrl] = useState(formValues.image || "");

    // Nuevos estados para manejar las opciones de pago
    const [isPaid, setIsPaid] = useState(formValues.isPaid || false);
    const [showPriceTag, setShowPriceTag] = useState(formValues.showPriceTag || false);
    const [currency, setCurrency] = useState(formValues.currency || "USD");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            setFormValues((prev) => ({ ...prev, image: localUrl }));
        }
    };

    const handleImageUrlChange = (e) => {
        const value = e.target.value;
        setImageUrl(value);
        setFormValues((prev) => ({ ...prev, image: value }));
    };

    // Manejadores para las nuevas opciones
    const handlePaidToggle = (e) => {
        const newIsPaid = e.target.checked;
        setIsPaid(newIsPaid);
        setFormValues((prev) => ({ 
            ...prev, 
            isPaid: newIsPaid,
            price: newIsPaid ? (prev.price || "0.00") : "0.00"
        }));
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        setFormValues((prev) => ({ ...prev, price: value }));
    };

    const handleCurrencyChange = (e) => {
        const value = e.target.value;
        setCurrency(value);
        setFormValues((prev) => ({ ...prev, currency: value }));
    };

    const handleShowPriceTagToggle = (e) => {
        const value = e.target.checked;
        setShowPriceTag(value);
        setFormValues((prev) => ({ ...prev, showPriceTag: value }));
    };

    return (
        <div className={`bg-white ${!isInline && 'p-5 rounded-xl shadow-md'}`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                    Vista Previa
                </h2>
            </div>

            <div className="mb-6">
                <CardPreview {...formValues} />
            </div>

            <form className="space-y-4 mb-8">
                <div className="space-y-4">
                    {/* Opciones de pago - NUEVO */}
                    <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                        <h3 className="font-medium text-gray-700 flex items-center gap-2">
                            <FiDollarSign className="text-[#C40180]" />
                            Opciones de pago
                        </h3>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox"
                                        checked={isPaid}
                                        onChange={handlePaidToggle}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C40180]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C40180]"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">
                                        {isPaid ? "Evento/Curso de pago" : "Evento/Curso gratuito"}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {isPaid && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                                    <input
                                        type="number"
                                        name="price"
                                        step="0.01"
                                        min="0"
                                        value={formValues.price || "0.00"}
                                        onChange={handlePriceChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#C40180] focus:border-[#C40180] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                                    <select
                                        name="currency"
                                        value={currency}
                                        onChange={handleCurrencyChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#C40180] focus:border-[#C40180] outline-none"
                                    >
                                        <option value="USD">Dólares (USD)</option>
                                        <option value="BS">Bolívares (Bs)</option>
                                        <option value="EUR">Euros (EUR)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="pt-2 border-t border-gray-100">
                            <div className="flex items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox"
                                        checked={showPriceTag}
                                        onChange={handleShowPriceTagToggle}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C40180]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C40180]"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <FiTag size={14} />
                                        Mostrar etiqueta {isPaid ? "PAGO" : "PASE LIBRE"}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Imagen / Video</label>
                        <div className="flex space-x-2 mb-2">
                            <button
                                type="button"
                                onClick={() => setImageType("file")}
                                className={`px-3 py-1.5 rounded text-sm font-medium ${imageType === "file"
                                        ? "bg-[#C40180] text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                Subir archivo
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageType("url")}
                                className={`px-3 py-1.5 rounded text-sm font-medium ${imageType === "url"
                                        ? "bg-[#C40180] text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                URL
                            </button>
                        </div>

                        {imageType === "file" ? (
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <p className="mb-1 text-sm text-gray-500">
                                        <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF o MP4 (máx. 10MB)</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleFile}
                                    className="hidden"
                                />
                            </label>
                        ) : (
                            <input
                                type="url"
                                placeholder="https://ejemplo.com/imagen.jpg o video.mp4"
                                value={imageUrl}
                                onChange={handleImageUrlChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#C40180] focus:border-[#C40180] outline-none"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                            name="title"
                            value={formValues.title}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#C40180] focus:border-[#C40180] outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Texto del botón</label>
                        <input
                            name="linkText"
                            value={formValues.linkText}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#C40180] focus:border-[#C40180] outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                            <input
                                type="date"
                                name="date"
                                value={formValues.date}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#C40180] focus:border-[#C40180] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                            <input
                                type="time"
                                name="hora_inicio"
                                value={formValues.hora_inicio}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#C40180] focus:border-[#C40180] outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                        <input
                            name="location"
                            value={formValues.location}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#C40180] focus:border-[#C40180] outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Google Maps</label>
                        <input
                            type="url"
                            name="direccionMapa"
                            placeholder="https://maps.google.com/..."
                            value={formValues.direccionMapa}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#C40180] focus:border-[#C40180] outline-none"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Esta URL se usará como enlace de ubicación
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    className="w-full py-2.5 px-4 rounded-md font-semibold text-white bg-gradient-to-r from-[#C40180] to-[#590248] hover:from-[#a80166] hover:to-[#470137] transition-all duration-300 shadow-md"
                >
                    {!isCreating ? "Guardar cambios" : `Crear ${tabIndex === 0 ? "Evento" : "Curso"}`}
                </button>
            </form>
        </div>
    );
}
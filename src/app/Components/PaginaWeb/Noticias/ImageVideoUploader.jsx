"use client"
import { useState, useRef } from "react"
import { X, Upload, Link2, Image, Camera } from "lucide-react"

const ImageUploader = ({ imageUrl, onImageChange, previewClassName = "h-32" }) => {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [showUrlInput, setShowUrlInput] = useState(false)
    const [urlInput, setUrlInput] = useState("")
    const fileInputRef = useRef(null)

    // Simular un proceso de carga de imagen al servidor
    const simulateUpload = () => {
        setIsUploading(true)
        setUploadProgress(0)

        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setTimeout(() => {
                        setIsUploading(false)
                    }, 500)
                    return 100
                }
                return prev + 10
            })
        }, 200)
    }

    // Manejar la carga de archivo local
    const handleFileUpload = (e) => {
        const file = e.target.files[0]

        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecciona un archivo de imagen válido.')
                return
            }

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('El archivo es demasiado grande. El tamaño máximo es de 5MB.')
                return
            }

            // En un entorno real, aquí se subiría el archivo a un servidor
            // Para este ejemplo, usamos URL local y simulamos la carga
            simulateUpload()

            const reader = new FileReader()
            reader.onload = (event) => {
                onImageChange(event.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    // Manejar la carga desde URL
    const handleUrlUpload = () => {
        if (!urlInput) return

        // Validar que sea una URL de imagen válida
        if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(urlInput)) {
            alert('Por favor, ingresa una URL de imagen válida (.jpg, .jpeg, .png, .gif, .webp)')
            return
        }

        simulateUpload()

        // Simular verificación de la URL
        const img = new Image()
        img.onload = () => {
            onImageChange(urlInput)
            setShowUrlInput(false)
            setUrlInput("")
        }
        img.onerror = () => {
            setIsUploading(false)
            alert('No se pudo cargar la imagen desde esa URL. Por favor, verifica que la dirección sea correcta.')
        }
        img.src = urlInput
    }

    // Eliminar la imagen
    const handleRemoveImage = () => {
        onImageChange("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
            {/* Vista previa de la imagen */}
            {imageUrl ? (
                <div className="relative">
                    <img
                        src={imageUrl}
                        alt="Vista previa"
                        className={`w-full object-cover ${previewClassName}`}
                        onError={(e) => {
                            e.target.src = "/assets/placeholder-image.jpg"
                        }}
                    />
                    <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                        title="Eliminar imagen"
                    >
                        <X size={16} className="text-red-500" />
                    </button>

                    {/* Etiqueta de información */}
                    <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                        {imageUrl.startsWith('data:') ? 'Imagen Local' : 'URL de imagen'}
                    </div>
                </div>
            ) : (
                <div className={`bg-gray-50 flex flex-col items-center justify-center ${previewClassName} text-center p-4`}>
                    {isUploading ? (
                        <div className="w-full max-w-xs">
                            <div className="text-sm text-gray-600 mb-2">Subiendo imagen...</div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-[#C40180] h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    ) : showUrlInput ? (
                        <div className="w-full max-w-xs">
                            <div className="flex">
                                <input
                                    type="text"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                                />
                                <button
                                    onClick={handleUrlUpload}
                                    className="bg-[#C40180] text-white px-3 py-2 rounded-r-md hover:bg-[#a00167] transition-colors"
                                >
                                    <Upload size={16} />
                                </button>
                            </div>
                            <div className="mt-2 flex justify-between">
                                <button
                                    onClick={() => setShowUrlInput(false)}
                                    className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                    Cancelar
                                </button>
                                <span className="text-xs text-gray-500">Formatos: JPG, PNG, GIF, WebP</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Image className="w-12 h-12 text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500 mb-3">Selecciona una imagen para subirla</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                                >
                                    <Camera size={14} />
                                    Subir imagen
                                </button>
                                <button
                                    onClick={() => setShowUrlInput(true)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                                >
                                    <Link2 size={14} />
                                    Usar URL
                                </button>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <p className="text-xs text-gray-400 mt-2">Tamaño máximo: 5MB</p>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default ImageUploader
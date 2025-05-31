import { motion } from "framer-motion";
import { AlertCircle, Camera, CheckCircle, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function FotoColegiado({
  formData,
  onInputChange,
  validationErrors,
  attemptedNext,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Imágenes de ejemplo
  const exampleImages = [
    { src: "/FTH.png", alt: "Ejemplo foto carnet hombre" },
    { src: "/FTM.png", alt: "Ejemplo foto carnet mujer" }
  ];

  // Efecto para cambiar las imágenes de ejemplo cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExampleIndex((prevIndex) => 
        prevIndex === 0 ? 1 : 0
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Efecto para manejar foto existente
  useEffect(() => {
    if (formData.foto_colegiado && typeof formData.foto_colegiado === 'string') {
      // Si es una URL (foto existente)
      setPreviewUrl(formData.foto_colegiado);
    } else if (formData.foto_colegiado && formData.foto_colegiado instanceof File) {
      // Si es un archivo nuevo
      const url = URL.createObjectURL(formData.foto_colegiado);
      setPreviewUrl(url);
    }

    // Cleanup function para liberar URLs
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [formData.foto_colegiado]);

  // Limpiar stream cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Verificar si un campo tiene error de validación
  const isFieldEmpty = (fieldName) => {
    return attemptedNext && validationErrors && validationErrors[fieldName];
  };

  // Función para validar archivo
  const validarArchivo = (file) => {
    // Validar tipo de archivo (solo imágenes)
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return { valid: false, message: "Tipo de archivo no válido. Por favor suba una imagen JPG o PNG." };
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, message: "El archivo es demasiado grande. El tamaño máximo es 5MB." };
    }

    return { valid: true };
  };

  // Función para manejar la carga de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validarArchivo(file);
      if (validation.valid) {
        // Crear URL de vista previa
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        
        // Actualizar formData
        onInputChange({ foto_colegiado: file });
        
        // Simular petición al backend
        console.log("Petición al backend para validar foto");
        
        // Limpiar input file
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert(validation.message);
      }
    }
  };

  // Función para iniciar captura de cámara
  // FotoColegiado.jsx - Función startCamera mejorada
const startCamera = async () => {
  try {
    setIsCapturing(true);
    setCameraReady(false);
    
    // Constraints más flexibles con fallbacks
    const constraints = {
      video: {
        width: { ideal: 640, min: 320, max: 1280 },
        height: { ideal: 480, min: 240, max: 720 },
        facingMode: "user",
        aspectRatio: { ideal: 4/3 }
      },
      audio: false
    };

    console.log("Solicitando acceso a la cámara...");
    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    
    if (!videoRef.current) {
      console.error("videoRef no está disponible");
      throw new Error("Elemento de video no disponible");
    }

    setStream(mediaStream);
    videoRef.current.srcObject = mediaStream;

    // Crear múltiples listeners para asegurar que la cámara se active
    const setupVideoListeners = () => {
      const video = videoRef.current;
      if (!video) return;

      let isReady = false;
      let timeoutId;

      const markAsReady = () => {
        if (!isReady) {
          isReady = true;
          clearTimeout(timeoutId);
          console.log("Cámara lista");
          setCameraReady(true);
        }
      };

      // Múltiples eventos para detectar cuando el video está listo
      const readyEvents = ['loadedmetadata', 'loadeddata', 'canplay', 'playing'];
      
      readyEvents.forEach(eventName => {
        video.addEventListener(eventName, markAsReady, { once: true });
      });

      // Timeout de seguridad - si después de 5 segundos no está listo, intentar de todas formas
      timeoutId = setTimeout(() => {
        console.warn("Timeout esperando que la cámara esté lista, intentando activar de todas formas");
        if (video.videoWidth > 0 || video.readyState >= 2) {
          markAsReady();
        } else {
          // Si realmente no está lista, mostrar error
          console.error("La cámara no responde después del timeout");
          setCameraReady(false);
          setIsCapturing(false);
          alert("La cámara tardó demasiado en responder. Por favor, intente nuevamente o use la opción de subir archivo.");
        }
      }, 5000);

      // Intentar reproducir el video
      const playVideo = async () => {
        try {
          await video.play();
          console.log("Video reproduciéndose");
          
          // Si el video se está reproduciendo, probablemente está listo
          if (video.currentTime > 0 || video.readyState >= 3) {
            markAsReady();
          }
        } catch (error) {
          console.warn("Error al reproducir video automáticamente:", error);
          // En algunos navegadores, el autoplay está bloqueado, pero la cámara funciona
          markAsReady();
        }
      };

      // Intentar reproducir inmediatamente y después de un pequeño delay
      playVideo();
      setTimeout(playVideo, 100);
    };

    // Configurar listeners después de un pequeño delay para asegurar que el video esté en el DOM
    setTimeout(setupVideoListeners, 50);

  } catch (error) {
    console.error("Error detallado al acceder a la cámara:", error);
    setIsCapturing(false);
    setCameraReady(false);
    
    let errorMessage = "No se pudo acceder a la cámara. ";
    
    switch (error.name) {
      case 'NotAllowedError':
        errorMessage += "Por favor, permita el acceso a la cámara en su navegador y recargue la página.";
        break;
      case 'NotFoundError':
        errorMessage += "No se encontró ninguna cámara en su dispositivo.";
        break;
      case 'NotReadableError':
        errorMessage += "La cámara está siendo usada por otra aplicación.";
        break;
      case 'OverconstrainedError':
        errorMessage += "La cámara no cumple con los requisitos solicitados.";
        break;
      case 'SecurityError':
        errorMessage += "Acceso denegado por razones de seguridad.";
        break;
      default:
        errorMessage += `Error: ${error.message}. Por favor, use la opción de subir archivo.`;
    }
    
    alert(errorMessage);
  }
};

  // Función para detener la cámara
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
    setCameraReady(false);
  };

  // Función para capturar foto
  const capturePhoto = () => {
    if (!cameraReady) {
      alert("Espere un momento a que la cámara esté lista");
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      // Verificación más flexible del estado del video
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        alert("Espere un momento a que la cámara esté lista");
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      
      try {
        ctx.drawImage(video, 0, 0);
        
        // Convertir a blob
        canvas.toBlob((blob) => {
          if (blob) {
            // Crear archivo desde blob
            const file = new File([blob], `foto_colegiado_${Date.now()}.jpg`, {
              type: 'image/jpeg'
            });
            
            // Crear URL de vista previa
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            
            // Actualizar formData
            onInputChange({ foto_colegiado: file });
            
            // Simular petición al backend
            console.log("Petición al backend para validar foto");
            
            // Detener cámara
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      } catch (error) {
        console.error("Error al capturar la foto:", error);
        alert("Error al capturar la foto. Intente nuevamente.");
      }
    }
  };

  // Función para eliminar foto
  const removePhoto = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onInputChange({ foto_colegiado: null });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Requisitos para la foto - Como opciones dinámicas en la parte superior */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4 shadow-sm">
        <h3 className="text-base font-semibold text-blue-900 mb-4 text-center">
          Requisitos para la foto tipo carnet
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex items-center space-x-2 bg-white/50 rounded-lg p-2 border border-blue-100">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
            <span className="text-xs text-blue-800 font-medium">Fondo blanco</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/50 rounded-lg p-2 border border-blue-100">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
            <span className="text-xs text-blue-800 font-medium">Posición frontal</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/50 rounded-lg p-2 border border-blue-100">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
            <span className="text-xs text-blue-800 font-medium">Sin accesorios</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/50 rounded-lg p-2 border border-blue-100">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
            <span className="text-xs text-blue-800 font-medium">Rostro visible</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/50 rounded-lg p-2 border border-blue-100">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
            <span className="text-xs text-blue-800 font-medium">Buena iluminación</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/50 rounded-lg p-2 border border-blue-100">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
            <span className="text-xs text-blue-800 font-medium">Foto reciente</span>
          </div>
        </div>
      </div>

      {/* Ejemplos y Campo de foto - Lado a lado del mismo tamaño */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ejemplos de foto */}
        <div className="lg:col-span-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-3 shadow-sm">
          <h3 className="text-sm font-semibold text-green-900 mb-3 text-center">
            Ejemplos correctos
          </h3>
          <div className="flex justify-center">
            <div className="relative w-36 h-44 bg-white rounded-lg overflow-hidden border-2 border-green-200 shadow-md">
              {exampleImages.map((image, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: index === 0 ? 1 : 0 }}
                  animate={{ 
                    opacity: currentExampleIndex === index ? 1 : 0 
                  }}
                  transition={{ 
                    duration: 0.8,
                    ease: "easeInOut"
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 144px"
                  />
                </motion.div>
              ))}
              
              {/* Indicadores */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {exampleImages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      currentExampleIndex === index 
                        ? 'bg-green-600' 
                        : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Campo de foto */}
        <div className="lg:col-span-2 bg-white rounded-lg border-2 border-gray-200 p-3 shadow-sm">
          <label className="block mb-3 text-sm font-semibold text-[#41023B] flex items-center justify-center">
            <Camera className="w-4 h-4 mr-2" />
            Foto tipo Carnet
            <span className="text-red-500 ml-1">*</span>
          </label>

          {/* Mostrar foto capturada/subida */}
          {previewUrl ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <div className="w-36 h-44 bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200 shadow-md">
                  <img
                    src={previewUrl}
                    alt="Foto del colegiado"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <p className="text-xs text-green-700 font-medium">
                  Foto cargada
                </p>
              </div>
            </div>
          ) : (
            <div className={`rounded-lg border-2 border-dashed p-3 transition-all duration-200 ${
              isFieldEmpty("foto_colegiado") 
                ? "border-red-300 bg-red-50" 
                : "border-gray-300 hover:border-[#D7008A] hover:bg-gray-50"
            }`}>
              {isCapturing ? (
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <div className="w-56 h-42 bg-black rounded-lg overflow-hidden shadow-lg relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {!cameraReady && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto mb-1"></div>
                            <p className="text-xs">Preparando...</p>
                          </div>
                        </div>
                      )}
                      {cameraReady && (
                        <div className="absolute top-1 right-1 bg-green-500 text-white px-1.5 py-0.5 rounded-full text-xs flex items-center gap-1">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          Listo
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center gap-2">
                    <motion.button
                      type="button"
                      onClick={capturePhoto}
                      disabled={!cameraReady}
                      className={`flex items-center gap-1 px-3 py-1.5 text-white rounded-md font-medium shadow-md hover:shadow-lg transition-all duration-200 text-xs ${
                        cameraReady 
                          ? "bg-gradient-to-r from-[#D7008A] to-[#B8007A] hover:opacity-90" 
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      whileHover={cameraReady ? { scale: 1.02 } : {}}
                      whileTap={cameraReady ? { scale: 0.98 } : {}}
                    >
                      <Camera className="w-3 h-3" />
                      {cameraReady ? "Capturar" : "Preparando..."}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={stopCamera}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-md font-medium shadow-md hover:shadow-lg hover:bg-gray-600 transition-all duration-200 text-xs"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Camera className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                      Agregue su foto
                    </h3>
                    <p className="text-xs text-gray-600 mb-1">
                      Subir archivo desde dispositivo
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG • Máx. 5MB
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <motion.button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-md font-medium shadow-md hover:shadow-lg hover:bg-gray-700 transition-all duration-200 text-xs"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Upload className="w-3 h-3" />
                      Subir Archivo
                    </motion.button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                  />
                </div>
              )}
            </div>
          )}

          {isFieldEmpty("foto_colegiado") && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-red-500 flex items-center justify-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              Este campo es obligatorio
            </motion.p>
          )}
        </div>
      </div>

      {/* Canvas oculto para captura */}
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
} 
import { motion } from "framer-motion";
import { AlertCircle, Camera, CheckCircle, Upload, X } from "lucide-react";
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
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

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
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Instrucciones - Mejoradas */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 shadow-sm mt-0 md:mt-12">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <h3 className="text-base text-center font-semibold text-blue-900 mb-3">
                  Requisitos para la foto
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Fondo completamente blanco</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Posición frontal mirando a la cámara</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Sin gorras, sombreros o accesorios</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Expresión neutral y rostro visible</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Buena iluminación natural</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Foto reciente (máximo 6 meses)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Campo de foto - Mejorado */}
        <div className="lg:col-span-2">
          <label className="block mb-4 text-lg font-semibold text-[#41023B] flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            Foto tipo Carnet
            <span className="text-red-500 ml-1">*</span>
          </label>

          {/* Mostrar foto capturada/subida */}
          {previewUrl ? (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-56 h-72 bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
                    <img
                      src={previewUrl}
                      alt="Foto del colegiado"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-700 font-medium">
                    Foto cargada correctamente
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className={`bg-white rounded-2xl border-2 border-dashed p-8 shadow-sm transition-all duration-200 ${
              isFieldEmpty("foto_colegiado") 
                ? "border-red-300 bg-red-50" 
                : "border-gray-300 hover:border-[#D7008A] hover:bg-gray-50"
            }`}>
              {isCapturing ? (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="w-80 h-60 bg-black rounded-xl overflow-hidden shadow-lg relative">
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
                            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                            <p className="text-sm">Preparando cámara...</p>
                          </div>
                        </div>
                      )}
                      {cameraReady && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          Listo
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <motion.button
                      type="button"
                      onClick={capturePhoto}
                      disabled={!cameraReady}
                      className={`flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 ${
                        cameraReady 
                          ? "bg-gradient-to-r from-[#D7008A] to-[#B8007A] hover:opacity-90" 
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      whileHover={cameraReady ? { scale: 1.02 } : {}}
                      whileTap={cameraReady ? { scale: 0.98 } : {}}
                    >
                      <Camera className="w-5 h-5" />
                      {cameraReady ? "Capturar Foto" : "Preparando..."}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={stopCamera}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:bg-gray-600 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <Camera className="w-10 h-10 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Agregue foto tipo carnet
                    </h3>
                    <p className="text-sm text-gray-600">
                      Puede tomar una foto con su cámara o subir un archivo desde su dispositivo
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos: JPG, PNG • Tamaño máximo: 5MB
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      type="button"
                      onClick={startCamera}
                      className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#D7008A] to-[#B8007A] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Camera className="w-5 h-5" />
                      Tomar Foto
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-3 px-6 py-3 bg-gray-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:bg-gray-700 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Upload className="w-5 h-5" />
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
              className="mt-2 text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
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
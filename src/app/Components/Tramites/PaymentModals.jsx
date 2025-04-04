"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CreditCard, ExternalLink, Calculator, DollarSign } from "lucide-react"

// PaymentModals component to be imported in your main file
export function BancoVenezuelaModal({ isOpen, onClose }) {
  useEffect(() => {
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gradient-to-t from-white to-[#590248]/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="bg-[#590248] p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Banco de Venezuela
              </h2>
              <button 
                onClick={onClose}
                className="text-white hover:text-gray-200 focus:outline-none transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 bg-white">
              <div className="mb-6">
                <div className="flex justify-center mb-6">
                  <img src="/assets/icons/BDV.png" alt="Banco de Venezuela" className="h-16" />
                </div>
                
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-lg font-bold text-center text-[#590248] mb-4">Cuentas Bancarias</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold">Números de cuentas del Colegio de Odontólogos de Venezuela</p>
                    <p className="text-sm mt-2">RIF.: J-00041277-4</p>
                    <p className="text-sm">A nombre del Colegio de Odontólogos de Venezuela</p>
                    <p className="text-sm mt-2">Correo: <a href="mailto:secretariafinanzas@elcov.org" className="text-[#590248] hover:underline">secretariafinanzas@elcov.org</a></p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="font-semibold text-red-700">ALERTA:</p>
                    <p className="text-sm text-red-700">SI VA A REALIZAR TRÁMITES EN LINEA DEBERÁ DEPOSITAR SOLAMENTE EN LA CUENTA DEL BANCO DE VENEZUELA.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold">BANCO DE VENEZUELA</p>
                    <p className="text-sm">Cuenta Corriente Nº 0102-0127-63-0000007511</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 font-medium"
                >
                  Cerrar
                </button>
                <a
                  href="mailto:secretariafinanzas@elcov.org"
                  className="px-6 py-2 rounded-lg bg-[#590248] hover:bg-[#590248]/90 transition-colors text-white font-medium flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Contactar
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PayPalModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState("");
  const [paypalAmount, setPaypalAmount] = useState("");
  
  // Calculate PayPal fee (5.4% + $0.30 international fee)
  const calculatePaypalFee = (amount) => {
    if (!amount || isNaN(parseFloat(amount))) return "";
    const numAmount = parseFloat(amount);
    // Calculate PayPal amount with fee included
    const total = (numAmount + 0.30) / (1 - 0.054);
    return total.toFixed(2);
  };
  
  useEffect(() => {
    setPaypalAmount(calculatePaypalFee(amount));
  }, [amount]);

  useEffect(() => {
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePayPalCheckout = () => {
    if (paypalAmount) {
      // Here you would typically redirect to PayPal checkout
      window.open("https://www.paypal.com/paypalme/elcov", "_blank");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gradient-to-t from-white to-[#118AB2]/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="bg-[#118AB2] p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center">
                <img src="/assets/icons/Paypal.png" alt="PayPal" className="w-5 h-5 mr-2" />
                PayPal COV
              </h2>
              <button 
                onClick={onClose}
                className="text-white hover:text-gray-200 focus:outline-none transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 bg-white">
              <div className="mb-6">
                <div className="flex justify-center mb-6">
                  <img src="/assets/icons/Paypal.png" alt="PayPal" className="h-12" />
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <p className="text-sm">
                    Para realizar los pagos desde PayPal deberás calcular la comisión en el siguiente formulario.
                    Una vez conozca el monto a depositar deberás colocarlo en el formulario y sabrás el monto a depositar por PayPal.
                    Tienes el botón de acceso directo para pagar en PayPal o el correo.
                  </p>
                  
                  <p className="text-sm">
                    Si estás realizando el trámite en línea deberás reportarlo adjuntando el pago a la página. 
                    En caso contrario deberás notificarlo al correo <a href="mailto:secretariafinanzas@elcov.org" className="text-[#118AB2] hover:underline">secretariafinanzas@elcov.org</a> indicando información necesaria.
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="font-semibold text-blue-700">ATENCIÓN:</p>
                    <p className="text-sm text-blue-700">Recomendamos no colocar dirección de envío y liberar el pago. Hasta que este disponible el pago puede ser aceptado su trámite.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="mb-4">
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Ingrese el Monto a cancelar (USD):</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </span>
                        <input 
                          type="number" 
                          id="amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00" 
                          className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent" 
                        />
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700">Monto a depositar en PayPal:</p>
                      <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </span>
                        <input 
                          type="text"
                          value={paypalAmount}
                          disabled
                          className="pl-10 w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-semibold"
                        />
                      </div>
                    </div>
                    
                    <p className="text-center text-sm mt-2">Correo: <a href="mailto:paypalelcov@gmail.com" className="text-[#118AB2] hover:underline">paypalelcov@gmail.com</a></p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 font-medium"
                >
                  Cerrar
                </button>
                <button
                  onClick={handlePayPalCheckout}
                  disabled={!paypalAmount}
                  className={`px-6 py-2 rounded-lg transition-colors text-white font-medium flex items-center ${!paypalAmount ? 'bg-gray-400' : 'bg-[#118AB2] hover:bg-[#118AB2]/90'}`}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Pagar en PayPal
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
"use client"
import React, { useState, useEffect } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { getCookie } from 'cookies-next/client';

const Checkout = ({ amount, pagoDetalles, handlePago }) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    // Use the passed amount from parent component, default to "0.00" if not provided
    const [paymentAmount, setPaymentAmount] = useState(amount || "0.00");

    // Update payment amount when the prop changes
    useEffect(() => {
        if (amount) {
            setPaymentAmount(amount);
        }
    }, [amount]);

    const onCreateOrder = async (data, actions) => {
        return await actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: paymentAmount,
                    },
                },
            ],
        });
    }

    const onApproveOrder = async (data, actions) => {
        try {
            const capturedOrder = await fetch("http://localhost:8000/api/v1/solicitudes/capture-order/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    order_id: data.orderID
                })
            })
            const detallesDePago = {...pagoDetalles, num_referencia: data.orderID, metodo_de_pago: pagoDetalles.metodo_de_pago_id}
            const pagoResult = await handlePago(detallesDePago);
            return pagoResult;
        } catch(error) {
            console.error("Hubo un error: ", error);
        }
    }

    return (
        <div className="checkout">
            {isPending ? <p>LOADING...</p> : (
                <div>
                    <PayPalButtons
                        style={{ layout: "vertical", color: "blue" }}
                        createOrder={(data, actions) => onCreateOrder(data, actions)}
                        onApprove={(data, actions) => onApproveOrder(data, actions)}
                        fundingSource={"paypal"}
                    />
                </div>
            )}
        </div>
    );
}

export default Checkout;
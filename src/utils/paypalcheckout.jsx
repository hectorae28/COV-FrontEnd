"use client"
import React, { useState, useEffect } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { getCookie } from 'cookies-next/client';

const Checkout = ({ amount }) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    // Use the passed amount from parent component, default to "0.00" if not provided
    const [paymentAmount, setPaymentAmount] = useState(amount || "0.00");

    // Update payment amount when the prop changes
    useEffect(() => {
        if (amount) {
            setPaymentAmount(amount);
        }
    }, [amount]);

    const onCreateOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: paymentAmount,
                    },
                },
            ],
        });
    }

    const onApproveOrder = (data, actions) => {
        const capturedOrder = fetch("http://localhost:8000/api/v1/solicitudes/capture-order/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                order_id: data.orderID
            })
        })
        return capturedOrder;
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
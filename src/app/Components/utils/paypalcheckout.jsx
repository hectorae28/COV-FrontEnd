import React, { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { getCookie } from 'cookies-next/client';

const Checkout = () => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    const [amount, setAmount] = useState("0.00");

    const handleChange = (e) => setAmount(e.target.value);

    const onCreateOrder = (data,actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: amount,
                    },
                },
            ],
        });
    }

    const onApproveOrder = (data,actions) => {
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
                    <label>
                        Enter amount to pay: 
                        <input value={amount} onChange={handleChange} placeholder="0.00" />
                    </label>
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
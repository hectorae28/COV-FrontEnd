import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Checkout from "./paypalcheckout";

const initialOptions = {
  "client-id": "Aa7iI9EAfqM_sJtnxATG9cfAbonHk4hfEPBa8riVOCDlcnNP73Of-en9Exqa_Y-2eA_dA0pwTI2BAffN",
  currency: "USD",
  intent: "capture",
};

// Modified to accept the amount prop
function PayPalProvider({ amount }) {
  return (
    <PayPalScriptProvider options={initialOptions}>
      <Checkout amount={amount} />
    </PayPalScriptProvider>
  );
}

export default PayPalProvider;
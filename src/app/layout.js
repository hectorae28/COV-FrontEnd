import Head from "next/head";
import "./globals.css";
import Providers from "@/Components/Provider";
import AutoLog from "@/Components/autoLogOut";

export default async function RootLayout({ children }) {
    return (
        <html lang="es-ES">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <PayPalScriptProvider options={{ "client-id": "Aa7iI9EAfqM_sJtnxATG9cfAbonHk4hfEPBa8riVOCDlcnNP73Of-en9Exqa_Y-2eA_dA0pwTI2BAffN" }}>
                <body className={`antialiased`}>
                    <Providers session={children.session}  >
                        <AutoLog>
                            <main>{children}</main>
                        </AutoLog>
                    </Providers>
                </body>
            </PayPalScriptProvider>
        </html>
    );
}
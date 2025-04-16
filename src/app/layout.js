import Head from "next/head";
import "./globals.css";
import Providers from "@/Components/Provider";

export default async function RootLayout({ children }) {
    return (
        <html lang="es-ES">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <body className={`antialiased`}>
                <Providers>
                    <main>{children}</main>
                </Providers>
            </body>
        </html>
    );
}
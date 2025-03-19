import { Montserrat } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "COV - Colegio de Odontólogos de Venezuela",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-ES">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body className={`${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
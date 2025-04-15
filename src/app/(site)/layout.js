import Head from "next/head";
import "../globals.css";
import AppBar from "./(Home)/AppBar";
import Footer from "./(Home)/Footer";
import { fetchFooter } from "@/api/endpoints/landingPage";


export const metadata = {
  title: "INICIO DE SESION - COV",
};

export default async function RootLayout({ children }) {
  const footerData = await fetchFooter();
  return (
    <html lang="es-ES">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body className={`antialiased`}>
        <header>
          <AppBar />
        </header>
        <main>{children}</main>
        <footer className="bg-[#F9F9F9]">
          <Footer props={footerData.data} />
        </footer>
      </body>
    </html>
  );
}
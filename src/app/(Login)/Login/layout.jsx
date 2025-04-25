import Head from "next/head";
import "../../globals.css";
import Providers from "@/Components/Provider";
import AutoLog from "@/Components/autoLogOut";

export const metadata = {
  title: "Inicio de Sesión - COV",
};

export default async function RootLayout({ children }) {
  return (
    <div lang="es-ES">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={`antialiased`}>
        <Providers session={children.session}>
          <AutoLog>
            <main>{children}</main>
          </AutoLog>
        </Providers>
      </div>
    </div>
  );
}

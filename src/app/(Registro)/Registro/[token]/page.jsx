import DetallePendiente from "@/app/Components/Solicitudes/ListaColegiados/DetallePendiente";
import RegistrationForm from "../page";
import { fetchDataUsuario } from "@/api/endpoints/colegiado";

export default async function RegistrationFormPage({params}) {
    const { token } = await params;
    console.log(token);
    try {
        const res = await fetchDataUsuario(`register/${token}`);
        const data = await res.data;

        return (
          <DetallePendiente
            params={{ id: token }}
            onVolver={handleAprobarPendiente}
            isAdmin={true}
          />
        );
    } catch (error) {
        console.log(error);
        return <div>Error</div>;
    }
}

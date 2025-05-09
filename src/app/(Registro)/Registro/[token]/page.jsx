import DetallePendienteWrapper from "./DetallePendienteWrapper";
import { fetchDataUsuario } from "@/api/endpoints/colegiado";

export default async function RegistrationFormPage({params}) {
    const { token } = await params;
    
    try {
        const res = await fetchDataUsuario(`recaudos-token`,null, `?token=${token}`);
        const data = await res.data;
        
        return (
            <DetallePendienteWrapper 
                id={token}
                isAdmin={false}
                recaudos={data}
            />
        );
    } catch (error) {
        console.log(error);
        return <div>Error</div>;
    }
}
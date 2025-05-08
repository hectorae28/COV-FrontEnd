import DetallePendienteWrapper from "./DetallePendienteWrapper";
import { fetchDataUsuario } from "@/api/endpoints/colegiado";

export default async function RegistrationFormPage({params}) {
    const { token } = params;
    
    try {
        const res = await fetchDataUsuario(`register/${token}`);
        const data = await res.data;
        
        return (
            <DetallePendienteWrapper 
                id={token} 
                isAdmin={false} 
            />
        );
    } catch (error) {
        console.log(error);
        return <div>Error</div>;
    }
}
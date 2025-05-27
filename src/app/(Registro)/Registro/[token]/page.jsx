import { fetchDataUsuario } from "@/api/endpoints/colegiado";
import DetallePendienteWrapper from "./DetallePendienteWrapper";

export default async function RegistrationFormPage({ params }) {
    const { token } = await params;

    try {

        const res = await fetchDataUsuario(`recaudos-token`, null, `?token=${token}`);
        if (!res || !res.data) {
            throw new Error("No data received from API");
        }

        const data = res.data;

        return (
            <DetallePendienteWrapper
                id={token}
                isAdmin={false}
                recaudos={data}
                error={null}
                isColegiado={true}
            />
        );
    } catch (error) {
        return (
            <DetallePendienteWrapper
                error={error.message || "Error desconocido"}
                id={token}
                isAdmin={false}
                recaudos={null}
                isColegiado={true}
            />
        )
    }
}
import RegistrationForm from "../page";
import { fetchDataUsuario } from "@/api/endpoints/colegiado";

export default async function RegistrationFormPage({params}) {
    const { token } = await params;
    console.log(token);
    try {
        const res = await fetchDataUsuario(`register/${token}`);
        const data = await res.data;

        return <RegistrationForm {...data} />;
    } catch (error) {
        console.log(error);
        return <div>Error</div>;
    }
}

import DetalleInfo from "@/app/Components/Solicitudes/ListaColegiados/DetalleInfo";

export default function DetalleColegiadoPage({ params }) {
  return (
    <DetalleInfo
      params={params}
      tipo="colegiado"
      isAdmin={true}
    />
  );
}
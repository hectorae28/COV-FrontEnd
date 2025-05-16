import DetalleSolicitud from "@/Components/Solicitudes/Solicitudes/DetalleSolicitud";

const DetallesDynamic = async ({ params }) => {
  const { id } = await params;

  return (
    <>
      <DetalleSolicitud props={{ id, isAdmin: false }} />
    </>
  );
};
export default DetallesDynamic;

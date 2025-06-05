import DetallePago from "@/Components/Solicitudes/Pagos/DetallePago";

const DetallesPagoDynamic = async ({ params }) => {
  const { id } = await params;
  return (
    <>
      <DetallePago pagoId={id} isAdmin={true} />
    </>
  );
};

export default DetallesPagoDynamic; 
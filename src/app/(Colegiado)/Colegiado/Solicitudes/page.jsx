"use client"

import ListaSolicitudes from '@/app/PanelControl/(Solicitudes)/Solicitudes/page'

const ListaSolicitudesColegiado = () => {
  const {colegiadoId} = useColegiadoUserStore();
  return (
    <>
        <ListaSolicitudes isAdmin={false} />
    </>
  )
}

export default ListaSolicitudesColegiado    
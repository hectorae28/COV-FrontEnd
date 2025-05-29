"use client"

import { fetchMe } from '@/api/endpoints/colegiado';
import ListaSolicitudes from '@/app/PanelControl/(Solicitudes)/Solicitudes/ListaSolicitudes'
import useColegiadoUserStore from '@/store/colegiadoUserStore'
import { useEffect } from 'react';

const ListaSolicitudesColegiado = () => {
  const colegiadoUser = useColegiadoUserStore( state => state.colegiadoUser);
  return (
    <>
        <ListaSolicitudes props={{isAdmin:false,colegiadoId:colegiadoUser}} />
    </>
  )
}

export default ListaSolicitudesColegiado    
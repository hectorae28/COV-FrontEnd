"use client"

import { fetchMe } from '@/api/endpoints/colegiado';
import ListaSolicitudes from '@/app/PanelControl/(Solicitudes)/Solicitudes/page'
import useColegiadoUserStore from '@/store/colegiadoUserStore'
import { useEffect } from 'react';

const ListaSolicitudesColegiado = () => {
  const setColegiadoUser = useColegiadoUserStore( state => state.setColegiadoUser);
  const colegiadoId = useColegiadoUserStore( state => state.colegiadoUser);
  const LoadAsyncData = async () => {
    const UserData = await fetchMe()
    setColegiadoUser(UserData.data)
  }
  useEffect(() => {
    if(!colegiadoId){
      LoadAsyncData()
    }
    setColegiadoUser(colegiadoId)
  }, [colegiadoId])
  return (
    <>
        <ListaSolicitudes props={{isAdmin:false,colegiadoId:colegiadoId}} />
    </>
  )
}

export default ListaSolicitudesColegiado    
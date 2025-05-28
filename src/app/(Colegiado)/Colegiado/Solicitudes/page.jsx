"use client"

import { fetchMe } from '@/api/endpoints/colegiado';
import ListaSolicitudes from '@/app/PanelControl/(Solicitudes)/Solicitudes/ListaSolicitudes'
import useColegiadoUserStore from '@/store/colegiadoUserStore'
import { useEffect } from 'react';

const ListaSolicitudesColegiado = () => {
  //const setColegiadoUser = useColegiadoUserStore( state => state.setColegiadoUser);
  const colegiadoUser = useColegiadoUserStore( state => state.colegiadoUser);
  console.log({colegiadoUser})
  // const LoadAsyncData = async () => {
  //   const UserData = await fetchMe()
  //   setColegiadoUser(UserData.data)
  // }
  // useEffect(() => {
  //   if(!colegiadoUser){
  //     LoadAsyncData()
  //   }
  //   setColegiadoUser(colegiadoUser)
  // }, [colegiadoUser])
  return (
    <>
        <ListaSolicitudes props={{isAdmin:false,colegiadoId:colegiadoUser}} />
    </>
  )
}

export default ListaSolicitudesColegiado    
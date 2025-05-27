import ListaSolicitudes from "./ListaSolicitudes"

export default function Solicitudes() {
  return (
    <ListaSolicitudes props={{isAdmin: true,colegiadoId:null}} />
  )
}
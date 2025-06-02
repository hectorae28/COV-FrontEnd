import { create } from "zustand";

const useColegiadoUserStore = create((set, get) => (
    {
        colegiadoUser: null,
        costos: [],
        tasaBcv: null,
        pagosSolvencia: [],

        setColegiadoUser: (newColegiadoUser) => set({colegiadoUser: newColegiadoUser }),
        setCostos: (newCostos) => set({costos: newCostos}),
        setSolvenciaStatus: (newStatus) => set((state) => ({
            colegiadoUser: {
                ...state.colegiadoUser,
                solvencia_status: newStatus
            }
        })),
        setTasaBcv: (newTasaBcv) => set({tasaBcv: newTasaBcv}),
        setPagosSolvencia: (pagos) => set({pagosSolvencia: pagos})
    })
);

export default useColegiadoUserStore;
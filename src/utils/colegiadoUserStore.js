import { create } from "zustand";

const useColegiadoUserStore = create((set, get) => (
    {
        colegiadoUser: {
            email: "",
            first_name: "",
            last_name: "",
            solvencia_status: null,
            solvente: "",
            username: "",
            id: null,
            requiere_solvencia_esp: null,
            costo_de_solvencia: null
        },
        costos: [],
        tasaBcv: null,

        setColegiadoUser: (newColegiadoUser) => set({colegiadoUser: newColegiadoUser }),
        setCostos: (newCostos) => set({costos: newCostos}),
        setSolvenciaStatus: (newStatus) => set((state) => ({
            colegiadoUser: {
                ...state.colegiadoUser,
                solvencia_status: newStatus
            }
        })),
        setTasaBcv: (newTasaBcv) => set({tasaBcv: newTasaBcv})
    })
);

export default useColegiadoUserStore;
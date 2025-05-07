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
            id: null
        },
        costos: [],
        tasaBcv: 0.00,

        setColegiadoUser: (newColegiadoUser) => set({colegiadoUser: newColegiadoUser }),
        setCostos: (newCostos) => set({costos: newCostos}),
        setSolvenciaStatus: (newStatus) => set((state) => ({
            colegiadoUser: {
                ...state.colegiadoUser,
                solvencia_status: newStatus
            }
        })),
    })
);

export default useColegiadoUserStore;
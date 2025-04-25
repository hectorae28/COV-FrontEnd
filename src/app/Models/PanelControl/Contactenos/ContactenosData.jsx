"use client"
import { create } from 'zustand'

// Initial data structure based on your Contactenos page
const initialContactData = {
    title: "Contáctenos",
    subtitle: "Estamos aquí para atenderle. No dude en comunicarse con nosotros a través de cualquiera de nuestros canales de contacto.",
    emails: [
        { email: "secretariapresidencia@elcov.org", description: "Secretaría de Presidencia" },
        { email: "secretariafinanzas@elcov.org", description: "Secretaría de Finanzas" },
        { email: "secretariaorganizacion@elcov.org", description: "Secretaría de Organización" },
        { email: "soporteweb@elcov.org", description: "Soporte de Sistemas COV Web" }
    ],
    businessHours: {
        days: "Lunes a Viernes",
        hours: "09:00 AM - 03:00 PM"
    },
    phones: [
        { number: "(0212) 793-56 87", description: "FINANZAS" },
        { number: "(0212) 781-22 67", description: "PRESIDENCIA" }
    ],
    location: {
        address: "Urb. Las Palmas, Calle el Pasaje, Edif. Colegio de Odontólogos. Caracas, Venezuela",
        latitude: "10.50767",
        longitude: "-66.88259"
    }
}

// Create a Zustand store to manage the contact data
export const useContactStore = create((set) => ({
    contactData: initialContactData,
    // Update section functions
    updateTitle: (title) => set((state) => ({
        contactData: { ...state.contactData, title }
    })),
    updateSubtitle: (subtitle) => set((state) => ({
        contactData: { ...state.contactData, subtitle }
    })),
    // Email functions
    updateEmail: (index, email, description) => set((state) => {
        const newEmails = [...state.contactData.emails];
        newEmails[index] = { email, description };
        return { contactData: { ...state.contactData, emails: newEmails } };
    }),
    addEmail: (email, description) => set((state) => ({
        contactData: {
            ...state.contactData,
            emails: [...state.contactData.emails, { email, description }]
        }
    })),
    removeEmail: (index) => set((state) => ({
        contactData: {
            ...state.contactData,
            emails: state.contactData.emails.filter((_, i) => i !== index)
        }
    })),
    // Business hours functions
    updateBusinessHours: (days, hours) => set((state) => ({
        contactData: {
            ...state.contactData,
            businessHours: { days, hours }
        }
    })),
    // Phone functions
    updatePhone: (index, number, description) => set((state) => {
        const newPhones = [...state.contactData.phones];
        newPhones[index] = { number, description };
        return { contactData: { ...state.contactData, phones: newPhones } };
    }),
    addPhone: (number, description) => set((state) => ({
        contactData: {
            ...state.contactData,
            phones: [...state.contactData.phones, { number, description }]
        }
    })),
    removePhone: (index) => set((state) => ({
        contactData: {
            ...state.contactData,
            phones: state.contactData.phones.filter((_, i) => i !== index)
        }
    })),
    // Location functions
    updateLocation: (address, latitude, longitude) => set((state) => ({
        contactData: {
            ...state.contactData,
            location: { address, latitude, longitude }
        }
    })),
    // Reset data function
    resetData: () => set({ contactData: initialContactData }),
}));

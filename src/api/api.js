import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';

import { getSession } from 'next-auth/react';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACK_HOST + '/api/v1/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        try {
            const session = await getSession();
            if (session) {
                config.headers['Authorization'] = `Bearer ${session.user.access}`;
            }
        } catch (error) {
            console.error('Error obteniendo la sesión:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             signOut({ callbackUrl: '/Login' });
//         }
//         return Promise.reject(error);
//     }
// );

export default api;
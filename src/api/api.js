import axios from 'axios';
import { signOut } from 'next-auth/react';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACK_HOST + '/api/v1/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            signOut({ callbackUrl: '/login' });
        }
        return Promise.reject(error);
    }
);

export default api;
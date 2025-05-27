import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';

import { getSession } from 'next-auth/react';

// Function to get the CSRF token from cookies
const getCsrfToken = () => {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrftoken') {
        return value;
      }
    }
  }
  return '';
};

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACK_HOST + '/api/v1/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

api.interceptors.request.use(
    async (config) => {
        try {
            const session = await getSession();
            if (session) {
                config.headers['Authorization'] = `Bearer ${session.user.access}`;
            }
            
            if (config.method !== 'get') {
                const csrfToken = getCsrfToken();
                if (csrfToken) {
                    config.headers['X-CSRFToken'] = csrfToken;
                }
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
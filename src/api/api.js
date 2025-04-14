import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACK_HOST + '/api/v1/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
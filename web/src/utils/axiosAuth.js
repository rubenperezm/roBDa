import axios from 'axios';

const axiosAuth = axios.create({
    baseURL: process.env.NEXT_CLIENT_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

axiosAuth.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;
        
        if (error.response.status === 401) {
            try {
                const res = await fetch('/api/account/refresh', {
                    method: 'POST',
                    withCredentials: true,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                });
                
                if (res.status === 200) {
                    return axiosAuth(originalRequest);

                } else {
                    return Promise.reject(error);
                }
            } catch(err) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosAuth;

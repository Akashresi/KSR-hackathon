import axios from 'axios';

// Replace with your local machine's IP (e.g., 10.1.5.135)
const DEFAULT_IP = '10.1.5.135';
const API_BASE_URL = `http://${DEFAULT_IP}:8000/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
});

export const getAlerts = async (userId = "demo_user") => {
    try {
        const response = await api.get(`/alerts/${userId}`);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const setTrustedContact = async (contactData) => {
    const response = await api.post('/set-trusted-contact', contactData);
    return response.data;
};

export default api;

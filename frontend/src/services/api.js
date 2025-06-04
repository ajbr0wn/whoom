import axios from 'axios';

const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const generateResponse = async (messages, selectedCharacters = []) => {
    try {
        const response = await api.post('/api/generate', {
            messages,
            selected_characters: selectedCharacters
        });
        return response.data;
    } catch (error) {
        console.error('Error generating response:', error);
        throw error;
    }
};

export const analyzeResponse = async (responseText) => {
    try {
        const response = await api.post('/api/analyze', {
            response: responseText
        });
        return response.data;
    } catch (error) {
        console.error('Error analyzing response:', error);
        throw error;
    }
};

export default api;
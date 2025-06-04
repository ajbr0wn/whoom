import axios from 'axios';

let apiKey = localStorage.getItem('openai_api_key') || '';

export const setApiKey = (key) => {
    apiKey = key;
    localStorage.setItem('openai_api_key', key);
};

const openai = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const generateResponse = async (messages, selectedCharacters = []) => {
    if (!apiKey) throw new Error('API key not set');
    const payload = {
        model: 'gpt-3.5-turbo',
        messages,
    };
    const response = await openai.post('/chat/completions', payload, {
        headers: { Authorization: `Bearer ${apiKey}` },
    });
    return { response: response.data.choices[0].message.content, status: 'success' };
};

export const analyzeResponse = async (responseText) => {
    if (!apiKey) throw new Error('API key not set');
    const prompt = `Identify 2-3 distinct characters or perspectives in the following text and return a JSON array under the key \"characters\". Each character should have a name and short description.\n\n${responseText}`;
    const payload = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You analyze text and extract characters.' },
            { role: 'user', content: prompt },
        ],
    };
    const response = await openai.post('/chat/completions', payload, {
        headers: { Authorization: `Bearer ${apiKey}` },
    });
    try {
        const data = JSON.parse(response.data.choices[0].message.content);
        return data;
    } catch (e) {
        return { characters: [] };
    }
};

export default { setApiKey, generateResponse, analyzeResponse };

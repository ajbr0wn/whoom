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

export const analyzeResponse = async (responseText, prevCharacters = []) => {
    if (!apiKey) throw new Error('API key not set');
    const prevList = JSON.stringify(prevCharacters.map(c => ({ name: c.name, description: c.description })));
    const prompt = `Identify distinct characters or perspectives in the following text. Return a JSON object with a "characters" array listing the active characters (each with name and short description). Also include a "changes" array describing how characters evolved compared to this previous list: ${prevList}. Use change objects like {"type":"new","name":"X"}, {"type":"disappear","name":"X"}, {"type":"merge","into":"X","from":["Y","Z"]}, or {"type":"split","from":"X","into":["Y","Z"]}.\n\n${responseText}`;
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

const api = {
    setApiKey,
    generateResponse,
    analyzeResponse,
};

export default api;

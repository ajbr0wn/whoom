import axios from 'axios';

let provider = localStorage.getItem('provider') || 'openai';
const apiKeys = {
    openai: localStorage.getItem('openai_api_key') || '',
    anthropic: localStorage.getItem('anthropic_api_key') || '',
    gemini: localStorage.getItem('gemini_api_key') || '',
    llama: localStorage.getItem('llama_api_key') || '',
};

export const setProvider = (p) => {
    provider = p;
    localStorage.setItem('provider', p);
};

export const setApiKey = (key, p = provider) => {
    apiKeys[p] = key;
    localStorage.setItem(`${p}_api_key`, key);
};

const callLLM = async (messages) => {
    const key = apiKeys[provider];
    if (!key && provider !== 'llama') throw new Error('API key not set');

    switch (provider) {
        case 'openai': {
            const openai = axios.create({
                baseURL: 'https://api.openai.com/v1',
                headers: { 'Content-Type': 'application/json' },
            });
            const payload = { model: 'gpt-3.5-turbo', messages };
            const resp = await openai.post('/chat/completions', payload, {
                headers: { Authorization: `Bearer ${key}` },
            });
            return resp.data.choices[0].message.content;
        }
        case 'anthropic': {
            const anthropic = axios.create({
                baseURL: 'https://api.anthropic.com/v1',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': key,
                    'anthropic-version': '2023-06-01',
                },
            });
            const payload = { model: 'claude-3-haiku-20240307', messages, max_tokens: 1024 };
            const resp = await anthropic.post('/messages', payload);
            return resp.data.content[0].text;
        }
        case 'gemini': {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`;
            const contents = messages.map((m) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            }));
            const payload = { contents };
            const resp = await axios.post(url, payload);
            const parts = resp.data.candidates[0].content.parts;
            return parts.map((p) => p.text).join('');
        }
        case 'llama': {
            const ollama = axios.create({ baseURL: 'http://localhost:11434' });
            const payload = { model: 'llama2', messages };
            const resp = await ollama.post('/api/chat', payload);
            return resp.data.message.content;
        }
        default:
            throw new Error('Unknown provider');
    }
};

export const generateResponse = async (messages) => {
    const content = await callLLM(messages);
    return { response: content, status: 'success' };
};

export const analyzeResponse = async (responseText, prevCharacters = []) => {
    const prevList = JSON.stringify(
        prevCharacters.map((c) => ({ name: c.name, description: c.description }))
    );
    const prompt = `Identify distinct characters or perspectives in the following text. Return a JSON object with a "characters" array listing the active characters (each with name and short description). Also include a "changes" array describing how characters evolved compared to this previous list: ${prevList}. Use change objects like {"type":"new","name":"X"}, {"type":"disappear","name":"X"}, {"type":"merge","into":"X","from":["Y","Z"]}, or {"type":"split","from":"X","into":["Y","Z"]}.\n\n${responseText}`;
    const analysisMessages = [
        { role: 'system', content: 'You analyze text and extract characters.' },
        { role: 'user', content: prompt },
    ];
    try {
        const content = await callLLM(analysisMessages);
        const data = JSON.parse(content);
        return data;
    } catch {
        return { characters: [] };
    }
};

export default {
    setProvider,
    setApiKey,
    generateResponse,
    analyzeResponse,
};

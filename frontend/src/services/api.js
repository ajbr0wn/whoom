export const setProvider = () => {};
export const setApiKey = () => {};

import axios from 'axios';

let provider = localStorage.getItem('provider') || 'openai';
const apiKeys = {
    openai: '',
    anthropic: '',
    gemini: '',
    llama: '',
};

export const setProvider = (p) => {
    provider = p;
    localStorage.setItem('provider', p);
};

export const setApiKey = (key, p = provider) => {
    apiKeys[p] = key;
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
    const last = messages[messages.length - 1];
    return { response: `[simulated] ${last.content}`, status: 'success' };
};

export const analyzeResponse = async (responseText, prevCharacters = []) => {
    return {
        characters: [
            { name: 'Reasoner', description: 'Walks through a line of reasoning.' },
            { name: 'Skeptic', description: 'Questions assumptions.' },
        ],
        changes: [],
    };
};

export default {
    setProvider,
    setApiKey,
    generateResponse,
    analyzeResponse,
};


let provider = localStorage.getItem('provider') || 'simulated';
const apiKeys = {
    openai: '',
    anthropic: '',
    gemini: '',
    llama: '',
    simulated: '',
};

export const setProvider = (p) => {
    provider = p;
    localStorage.setItem('provider', p);
};

export const setApiKey = (key, p = provider) => {
    apiKeys[p] = key;
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

const api = {
    setProvider,
    setApiKey,
    generateResponse,
    analyzeResponse,
};

export default api;

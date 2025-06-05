
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

let merged = false;

export const analyzeResponse = async (responseText, prevCharacters = []) => {
    const names = prevCharacters.map(c => c.name);

    if (!merged && names.includes('Reasoner') && names.includes('Skeptic')) {
        merged = true;
        return {
            characters: [
                {
                    name: 'Unified',
                    description: 'Combination of Reasoner and Skeptic.',
                },
            ],
            changes: [{ type: 'merge', into: 'Unified', from: ['Reasoner', 'Skeptic'] }],
        };
    }

    if (merged && names.includes('Unified')) {
        merged = false;
        return {
            characters: [
                { name: 'Reasoner', description: 'Walks through a line of reasoning.' },
                { name: 'Skeptic', description: 'Questions assumptions.' },
            ],
            changes: [{ type: 'split', from: 'Unified', into: ['Reasoner', 'Skeptic'] }],
        };
    }

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

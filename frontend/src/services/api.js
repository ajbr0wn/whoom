export const setProvider = () => {};
export const setApiKey = () => {};

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

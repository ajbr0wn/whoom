import React, { useState, useEffect } from 'react';
import { generateResponse, analyzeResponse, setApiKey as storeApiKey } from './services/api';
import { loadConversation, saveConversation, clearConversation } from './services/storage';
import './App.css';

function App() {
    const [branches, setBranches] = useState([
        { id: 'root', parentId: null, messages: [], characters: [] },
    ]);
    const [currentBranchId, setCurrentBranchId] = useState('root');
    const [inputText, setInputText] = useState('');
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');

    const currentBranch = branches.find(b => b.id === currentBranchId) || branches[0];

    useEffect(() => {
        const { branches: savedBranches, currentBranchId: savedId } = loadConversation();
        if (savedBranches && savedBranches.length > 0) {
            setBranches(savedBranches);
            setCurrentBranchId(savedId || savedBranches[0].id);
        }
    }, []);

    useEffect(() => {
        if (apiKey) {
            storeApiKey(apiKey);
        }
    }, [apiKey]);

    useEffect(() => {
        saveConversation(branches, currentBranchId);
    }, [branches, currentBranchId]);

    const updateBranch = (id, updates) => {
        setBranches(prev => prev.map(branch => branch.id === id ? { ...branch, ...updates } : branch));
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() || loading || !apiKey) return;

        const newMessage = { role: 'user', content: inputText };
        const updatedMessages = [...currentBranch.messages, newMessage];
        updateBranch(currentBranchId, { messages: updatedMessages });
        setInputText('');
        setLoading(true);

        try {
            // Generate response
            const response = await generateResponse(updatedMessages, selectedCharacters);

            const assistantMessage = { role: 'assistant', content: response.response };
            const newMessages = [...updatedMessages, assistantMessage];
            updateBranch(currentBranchId, { messages: newMessages });

            // Analyze response for characters
            const analysis = await analyzeResponse(response.response);
            updateBranch(currentBranchId, { characters: analysis.characters });
            setSelectedCharacters([]); // Reset selection

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCharacterToggle = (characterName) => {
        setSelectedCharacters(prev =>
            prev.includes(characterName)
                ? prev.filter(name => name !== characterName)
                : [...prev, characterName]
        );
    };

    const handleCreateBranch = () => {
        if (selectedCharacters.length === 0) return;
        const newId = `branch-${Date.now()}`;
        const newBranch = {
            id: newId,
            parentId: currentBranchId,
            messages: [...currentBranch.messages],
            characters: currentBranch.characters,
        };
        setBranches(prev => [...prev, newBranch]);
        setCurrentBranchId(newId);
    };

    const handleReset = () => {
        clearConversation();
        setBranches([{ id: 'root', parentId: null, messages: [], characters: [] }]);
        setCurrentBranchId('root');
        setSelectedCharacters([]);
    };

    const handleExport = () => {
        const data = JSON.stringify({ branches, currentBranchId }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'conversation.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="App">
            <h1>Character Decomposition Chat</h1>
            <div className="api-key">
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="OpenAI API key"
                />
            </div>

            <div className="branches">
                <h3>Branches</h3>
                {branches.map((branch) => (
                    <button
                        key={branch.id}
                        onClick={() => setCurrentBranchId(branch.id)}
                        disabled={branch.id === currentBranchId}
                    >
                        {branch.id}
                    </button>
                ))}
            </div>
            <div className="controls">
                <button onClick={handleExport}>Export</button>
                <button onClick={handleReset}>Reset</button>
            </div>

            {/* Messages */}
            <div className="messages">
                {currentBranch.messages.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        <strong>{message.role}:</strong> {message.content}
                    </div>
                ))}
            </div>

            {/* Characters */}
            {currentBranch.characters && currentBranch.characters.length > 0 && (
                <div className="characters">
                    <h3>Characters in the response:</h3>
                    {currentBranch.characters.map((character) => (
                        <div key={character.name} className="character">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedCharacters.includes(character.name)}
                                    onChange={() => handleCharacterToggle(character.name)}
                                />
                                <strong>{character.name}</strong>: {character.description}
                            </label>
                        </div>
                    ))}
                    <button onClick={handleCreateBranch} disabled={selectedCharacters.length === 0}>Create Branch</button>
                </div>
            )}

            {/* Input */}
            <div className="input-area">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    disabled={loading}
                />
                <button onClick={handleSendMessage} disabled={loading || !inputText.trim() || !apiKey}>
                    {loading ? 'Loading...' : 'Send'}
                </button>
            </div>
        </div>
    );
}

export default App;

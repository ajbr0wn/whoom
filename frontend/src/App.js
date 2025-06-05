import React, { useState, useEffect } from 'react';
import {
    generateResponse,
    analyzeResponse,
    setApiKey as storeApiKey,
    setProvider as storeProvider,
} from './services/api'; // swap to ./services/llmApi for real LLM calls
import { loadConversation, saveConversation, clearConversation } from './services/storage';
import { generateId } from './utils/id';
import './App.css';

function App() {
    const [branches, setBranches] = useState([
        { id: 'root', name: 'Root', parentId: null, messages: [], characters: [] },
    ]);
    const [currentBranchId, setCurrentBranchId] = useState('root');
    const [inputText, setInputText] = useState('');
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState(
        localStorage.getItem('provider') || 'openai'
    );
    const [apiKey, setApiKey] = useState('');
    const [humanMode, setHumanMode] = useState(false);

    const currentBranch = branches.find(b => b.id === currentBranchId) || branches[0];

    useEffect(() => {
        const { branches: savedBranches, currentBranchId: savedId } = loadConversation();
        if (savedBranches && savedBranches.length > 0) {
            const fixed = savedBranches.map(b => ({
                ...b,
                characters: (b.characters || []).map(c => ({ ...c, active: c.active !== false, id: c.id || generateId() })),
            }));
            setBranches(fixed);
            setCurrentBranchId(savedId || savedBranches[0].id);
        }
    }, []);

    useEffect(() => {
        storeProvider(provider);
        setApiKey('');
    }, [provider]);

    useEffect(() => {
        if (apiKey) {
            storeApiKey(apiKey, provider);
        }
    }, [apiKey, provider]);

    useEffect(() => {
        saveConversation(branches, currentBranchId);
    }, [branches, currentBranchId]);

    const updateBranch = (id, updates) => {
        setBranches(prev => prev.map(branch => branch.id === id ? { ...branch, ...updates } : branch));
    };

    const applyCharacterChanges = (id, analysis) => {
        setBranches(prev => prev.map(branch => {
            if (branch.id !== id) return branch;
            const existing = branch.characters ? branch.characters.map(c => ({ ...c, active: c.active !== false })) : [];
            const activeNames = new Set();
            const updated = [];
            analysis.characters.forEach(ch => {
                const match = existing.find(c => c.name === ch.name);
                if (match) {
                    updated.push({ ...match, description: ch.description, active: true });
                } else {
                    updated.push({ id: generateId(), name: ch.name, description: ch.description, active: true });
                }
                activeNames.add(ch.name);
            });
            existing.forEach(c => {
                if (!activeNames.has(c.name)) {
                    updated.push({ ...c, active: false });
                }
            });
            return { ...branch, characters: updated, changes: analysis.changes || [] };
        }));
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() || loading || (!apiKey && provider !== 'llama')) return;

        setLoading(true);

        try {
            if (humanMode) {
                // Treat the input as an assistant message written by the user
                const assistantMessage = { role: 'assistant', content: inputText };
                const newMessages = [...currentBranch.messages, assistantMessage];
                updateBranch(currentBranchId, { messages: newMessages });
                const analysis = await analyzeResponse(inputText, currentBranch.characters);
                applyCharacterChanges(currentBranchId, analysis);
                setSelectedCharacters([]);
            } else {
                const newMessage = { role: 'user', content: inputText };
                const updatedMessages = [...currentBranch.messages, newMessage];
                updateBranch(currentBranchId, { messages: updatedMessages });

                const response = await generateResponse(updatedMessages, selectedCharacters);

                const assistantMessage = { role: 'assistant', content: response.response };
                const newMessages = [...updatedMessages, assistantMessage];
                updateBranch(currentBranchId, { messages: newMessages });

                const analysis = await analyzeResponse(response.response, currentBranch.characters);
                applyCharacterChanges(currentBranchId, analysis);
                setSelectedCharacters([]);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setInputText('');
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
            name: newId,
            parentId: currentBranchId,
            messages: [...currentBranch.messages],
            characters: currentBranch.characters.filter(c => c.active),
        };
        setBranches(prev => [...prev, newBranch]);
        setCurrentBranchId(newId);
    };

    const handleReset = () => {
        clearConversation();
        setBranches([{ id: 'root', name: 'Root', parentId: null, messages: [], characters: [] }]);
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

    const handleImport = (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.branches && Array.isArray(data.branches)) {
                    const fixed = data.branches.map(b => ({
                        ...b,
                        characters: (b.characters || []).map(c => ({ ...c, active: c.active !== false, id: c.id || generateId() })),
                    }));
                    setBranches(fixed);
                    setCurrentBranchId(data.currentBranchId || data.branches[0].id);
                }
            } catch (err) {
                console.error('Failed to import conversation', err);
            }
        };
        reader.readAsText(file);
        // reset value so same file can be uploaded again if needed
        event.target.value = '';
    };

    const handleRenameBranch = () => {
        const newName = prompt('Enter new branch name', currentBranch.name || currentBranch.id);
        if (newName && newName.trim()) {
            updateBranch(currentBranchId, { name: newName.trim() });
        }
    };

    return (
        <div className="App">
            <div className="layout">
                <header className="app-header">
                    <h1>Character Decomposition Chat</h1>
                    <div className="api-key">
                        <select
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                        >
                            <option value="openai">OpenAI</option>
                            <option value="anthropic">Anthropic</option>
                            <option value="gemini">Gemini</option>
                            <option value="llama">Local Llama</option>
                        </select>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder={`${provider.charAt(0).toUpperCase() + provider.slice(1)} API key`}
                            disabled={provider === 'llama'}
                        />
                    </div>
                </header>
                <div className="left-panel">
                    <div className="branches">
                        <h3>Branches</h3>
                        {branches.map((branch) => (
                            <button
                                key={branch.id}
                                onClick={() => setCurrentBranchId(branch.id)}
                                disabled={branch.id === currentBranchId}
                            >
                                {branch.name || branch.id}
                            </button>
                        ))}
                    </div>
                    <div className="controls">
                        <button onClick={handleExport}>Export</button>
                        <button onClick={handleReset}>Reset</button>
                        <button onClick={handleRenameBranch}>Rename Branch</button>
                        <label style={{ display: 'inline-block' }}>
                            <input type="file" accept="application/json" onChange={handleImport} style={{ display: 'none' }} />
                            <span className="import-button">Import</span>
                        </label>
                    </div>
                    <div className="future-placeholder">Branch tree placeholder</div>
                </div>

                <main className="main-panel">
                    <div className="mode-select">
                        <label>
                            <input
                                type="radio"
                                value="ai"
                                checked={!humanMode}
                                onChange={() => setHumanMode(false)}
                            />
                            AI mode
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="human"
                                checked={humanMode}
                                onChange={() => setHumanMode(true)}
                            />
                            Human-written mode
                        </label>
                    </div>

                    <div className="messages">
                        {currentBranch.messages.map((message, index) => (
                            <div key={index} className={`message ${message.role}`}>
                                <strong>{message.role}:</strong> {message.content}
                            </div>
                        ))}
                    </div>

                    <div className="input-area">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={humanMode ? 'Write assistant reply...' : 'Type your message...'}
                            disabled={loading}
                        />
                        <button onClick={handleSendMessage} disabled={loading || !inputText.trim() || !apiKey}>
                            {loading ? 'Loading...' : humanMode ? 'Process' : 'Send'}
                        </button>
                    </div>
                </main>

                <div className="right-panel">
                    {currentBranch.characters && currentBranch.characters.length > 0 && (
                        <div className="characters">
                            <h3>Characters</h3>
                            {currentBranch.characters.filter(c => c.active).map((character) => (
                                <div key={character.id} className="character">
                                    <div className="character-avatar">{character.name.charAt(0)}</div>
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

                    {currentBranch.changes && currentBranch.changes.length > 0 && (
                        <div className="changes">
                            <h4>Character Changes:</h4>
                            <ul>
                                {currentBranch.changes.map((ch, idx) => (
                                    <li key={idx}>{JSON.stringify(ch)}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <footer className="app-footer">
                    <div className="future-placeholder">Additional controls coming soon</div>
                </footer>
            </div>
        </div>
    );
}

export default App;

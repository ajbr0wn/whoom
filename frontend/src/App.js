import React, { useState } from 'react';
import { generateResponse, analyzeResponse } from './services/api';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [characters, setCharacters] = useState([]);
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!inputText.trim() || loading) return;

        const newMessage = { role: 'user', content: inputText };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInputText('');
        setLoading(true);

        try {
            // Generate response
            const response = await generateResponse(updatedMessages, selectedCharacters);

            const assistantMessage = { role: 'assistant', content: response.response };
            setMessages([...updatedMessages, assistantMessage]);

            // Analyze response for characters
            const analysis = await analyzeResponse(response.response);
            setCharacters(analysis.characters);
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

    return (
        <div className="App">
            <h1>Character Decomposition Chat</h1>

            {/* Messages */}
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        <strong>{message.role}:</strong> {message.content}
                    </div>
                ))}
            </div>

            {/* Characters */}
            {characters.length > 0 && (
                <div className="characters">
                    <h3>Characters in the response:</h3>
                    {characters.map((character) => (
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
                <button onClick={handleSendMessage} disabled={loading || !inputText.trim()}>
                    {loading ? 'Loading...' : 'Send'}
                </button>
            </div>
        </div>
    );
}

export default App;
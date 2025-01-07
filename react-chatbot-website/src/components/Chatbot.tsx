import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput(''); // Clear input field
    setLoading(true); // Show loader

    try {
      const response = await axios.post('https://chatbot-m1t6.onrender.com/chatbot', { userInput: input });
      const botMessage: Message = { sender: 'bot', text: response.data.response || 'No response.' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage: Message = { sender: 'bot', text: 'Error connecting to chatbot.' };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="loader"></div>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // Trigger sendMessage on Enter
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;

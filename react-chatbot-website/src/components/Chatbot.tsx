import React, { useState } from 'react';
import axios from 'axios';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post('http://localhost:5000/chatbot', { userInput: input });
      const botMessage: Message = { sender: 'bot', text: response.data.response || 'No response.' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error:', error.message);
      } else {
        console.error('Error:', error);
      }
      const botMessage: Message = { sender: 'bot', text: 'Error connecting to chatbot.' };
      setMessages((prev) => [...prev, botMessage]);
    }

    setInput(''); // Clear the input box after sending
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '10px 0' }}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: '10px' }}>
        <input
          type="text"
          value={input} // Bind input value to the state
          onChange={(e) => setInput(e.target.value)} // Update state when input changes
          placeholder="Type your message here..."
          style={{ flex: 1, padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        <button
          onClick={sendMessage}
          style={{ marginLeft: '10px', padding: '10px 20px', fontSize: '16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

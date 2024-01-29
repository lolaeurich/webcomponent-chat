import React, { useState, useEffect, useId } from 'react';
import axios from 'axios';
import userAvatar from "../assets/userAvatar.jpg"
import chatAvatar from "../assets/avatarChat.png"
import "../App.css"
// import "../styles/glassMode.css"
// import "../styles/whiteMode.css"
import "../styles/darkMode.css"
// import { reactToWebComponent } from 'react-to-webcomponent';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const CustomTypingIndicator = ({ typing }) => {
  return (
    <div style={{ display: typing ? 'block' : 'none', position: 'absolute', top: '85%', left: '20%', transform: 'translate(-50%, -50%)' }}>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
};

const WebChatComponent = () => {
  const [typing, setTyping] = useState(false);
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    const msg = {
        id: newMessage,
        role: 'user',
        assistantId: null,
        threadId: null,
        content: [
            {
                type: "text",
                text: {
                    value: newMessage
                }
            }
        ]
    };

    // Adicionando a mensagem do usuário ao estado
    setMessages(prevMessages => [...prevMessages, msg]);
    setNewMessage('');
    setTyping(true);

    const { data } = await axios.post('https://devell-ai-bot.onrender.com/messages', {
        message: newMessage
    });

    // Adicionando a resposta do bot ao estado sem remover as mensagens do usuário
    setMessages(prevMessages => [...prevMessages, data.result]);
    setNewMessage('');
    setTyping(false);
  };

  useEffect(() => {
    console.log(messages)
  }, [messages]);

  return (
    <div className="App">
      <div className="chat-container">
        <div className="messages-container">
          {Array.isArray(messages) && messages.length > 0 ? (
            messages.map((msg, i) => {
              const isUser = msg.role === 'user';
              const avatar = isUser ? (
                <div className="user-container" key={msg.id}>
                  <div className="user-message">
                    {msg.content[0]?.text?.value}
                  </div>
                  <img className="user-avatar" src={userAvatar} alt="User Avatar" />
                </div>
              ) : (
                <div className="bot-container" key={msg.id}>
                  <img className="bot-avatar" src={chatAvatar} alt="Chat Avatar" />
                  <div className="bot-message">
                    {msg.content[0]?.text?.value}
                  </div>
                </div>
              );

              return (
                <div className="return-avatar" key={msg.id} style={{ justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                  {avatar}
                </div>
              );
            })
          ) : (
            <div>Nenhuma mensagem para mostrar.</div>
          )}
          {typing && <CustomTypingIndicator typing={typing} />}
        </div>
        <div className="input-container">
          <input 
            className="message-input"
            value={newMessage}
            type="text"
            placeholder='Escreva sua mensagem aqui'
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button className="send-button" onClick={handleSend}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default WebChatComponent;
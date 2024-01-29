import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import WebChatComponent from "./components/WebChatComponent.jsx";
import './index.css';

// Função para renderizar o componente React
const renderReactApp = () => {
  const rootContainer = document.getElementById('root');
  const reactRoot = ReactDOM.createRoot(rootContainer);
  reactRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Verifica se é um ambiente de componente da web antes de renderizar
const isWebComponent = document.getElementById('web-chat-mount-point');

if (isWebComponent) {
  // Espera até que o documento esteja totalmente carregado
  document.addEventListener('DOMContentLoaded', () => {
    const existingWebChat = isWebComponent.querySelector('web-chat');

    if (!existingWebChat) {
      const webChatComponent = document.createElement('web-chat');
      isWebComponent.appendChild(webChatComponent);
      ReactDOM.createRoot(webChatComponent).render(<WebChatComponent />);
    }
  });
} else {
  // Se não for um componente da web, renderiza o aplicativo React imediatamente
  renderReactApp();
}

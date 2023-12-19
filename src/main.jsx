import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import WebChatComponent from "./components/WebChatComponent.jsx";
import './index.css';
import axios from 'axios';

// Renderiza o componente React no ponto de montagem '#root'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Verifica se é um ambiente de componente da web antes de renderizar
const isWebComponent = document.getElementById('web-chat-mount-point');
if (isWebComponent) {
  const mountPoint = document.getElementById('web-chat-mount-point');
  const webChatComponent = document.createElement('web-chat');
  mountPoint.appendChild(webChatComponent);

  const handleWeatherRequest = async () => {
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: 'Curitiba',
          appid: 'S4fc309daebdfc5d60bcb72018985c228',
          units: 'metric',
        },
      });

      const temperature = parseFloat(response.data.main.temp);
      const weatherDescription = response.data.weather[0].description;

      console.log(`A temperatura em Curitiba é ${temperature.toFixed(2)}°C e o tempo está ${weatherDescription}.`);
    } catch (error) {
      console.error('Erro ao obter a previsão do tempo:', error);
      console.error('Desculpe, não foi possível obter a previsão do tempo no momento.');
    }
  };

  ReactDOM.createRoot(webChatComponent).render(<WebChatComponent handleWeatherRequest={handleWeatherRequest} />);
}

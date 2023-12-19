/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import userAvatar from "../assets/userAvatar.jpg"
import chatAvatar from "../assets/avatarChat.png"
import "../App.css"
// import { reactToWebComponent } from 'react-to-webcomponent';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
// import TypingIndicator from '@chatscope/chat-ui-kit-react';
import { Message, MessageInput, Avatar, TypingIndicator } from "@chatscope/chat-ui-kit-react";

const CustomTypingIndicator = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
      <div style={{ marginRight: '8px', width: '10px', height: '10px', backgroundColor: '#ccc', borderRadius: '50%' }}></div>
      <div style={{ marginRight: '8px', width: '10px', height: '10px', backgroundColor: '#ccc', borderRadius: '50%' }}></div>
      <div style={{ width: '10px', height: '10px', backgroundColor: '#ccc', borderRadius: '50%' }}></div>
    </div>
  );
};

const API_KEY = "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";

const WebChatComponent = ({handleWeatherRequest}) => {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Olá, eu sou o Pedro, seu consultor pessoal sobre o que fazer em Curitiba! Em que posso lhe ajudar hoje?",
      sender: "ChatGPT",
      sentTime: "just now",
      position: "single"
    }
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
      position: "single"
    };
  
    const newMessages = [...messages, newMessage];

  setMessages(newMessages);
  setTyping(true);

  const isFunctionCall = message.toLowerCase().startsWith('registrar compromisso') || message.toLowerCase().startsWith('lembrar compromisso');

  if (isFunctionCall) {
    const [functionName, ...args] = message.split(' ').slice(1);

    if (functionName.toLowerCase() === 'temperatura') {
      await handleWeatherRequest();
    } else {
      const functionResponse = functions[functionName](...args);

      setMessages((prevMessages) => [
        ...prevMessages,
        { message: JSON.stringify(functionResponse), sender: 'ChatGPT' },
      ]);
    }

    setTyping(false);
    return;
  }

  // Se não for uma chamada de função, continue com a lógica existente
  await processMessageToChatGPT(newMessages);
};
  // const handleWeatherRequest = async () => {
  //   try {
  //     const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
  //       params: {
  //         q: 'Curitiba', // Nome da cidade para obter a previsão do tempo
  //         appid: 'S4fc309daebdfc5d60bcb72018985c228', // Substitua pelo seu próprio token da OpenWeather API
  //         units: 'metric', // Para obter a temperatura em Celsius
  //       },
  //     });

  //     const temperature = parseFloat(response.data.main.temp);
  //     const weatherDescription = response.data.weather[0].description;

  //     // Exiba a resposta no chat
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { message: `A temperatura em Curitiba é ${temperature.toFixed(2)}°C e o tempo está ${weatherDescription}.`, sender: 'ChatGPT' },
  //     ]);

  //     setTyping(false);
  //   } catch (error) {
  //     console.error('Erro ao obter a previsão do tempo:', error);

  //     // Exiba uma mensagem de erro no chat
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { message: 'Desculpe, não foi possível obter a previsão do tempo no momento.', sender: 'ChatGPT' },
  //     ]);

  //     setTyping(false);
  //   }
  // };

  const [suggestedEvent, setSuggestedEvent] = useState(null);
  const [schedulingEvent, setSchedulingEvent] = useState(false);

  const processRecommendation = () => {
    const recommendation = getRecommendation();
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: recommendation, sender: "ChatGPT" },
        { message: 'Gostaria de marcar um evento? (Sim/Não)', sender: 'bot' },
      ]);
      setRecommendationRequested(true);
      setSuggestedEvent(recommendation);  // Armazena a sugestão atual
    }, 1000);
  };

  const handleUserResponse = async (response) => {
    if (schedulingEvent) {
      // Se já estivermos no modo de agendamento de eventos, processar a resposta do usuário para marcar o evento
      // Você pode modificar isso de acordo com a lógica necessária para coletar informações e marcar o evento
      if (response.toLowerCase() === 'sim') {
        // Coletar informações do usuário e marcar o evento
        // ...
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: 'Evento marcado com sucesso!', sender: 'bot' },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: 'Ok, se precisar marcar um evento, estou aqui para ajudar!', sender: 'bot' },
        ]);
      }
      setSchedulingEvent(false);  // Sai do modo de agendamento de eventos
    } else if (response.toLowerCase() === 'sim') {
      // Se não estivermos no modo de agendamento e o usuário concordar em marcar um evento
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: 'Ótimo! Estou aqui para ajudar. Quando você gostaria de marcar o evento?', sender: 'bot' },
      ]);
      setSchedulingEvent(true);  // Entra no modo de agendamento de eventos
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: 'Ok, se precisar de mais alguma coisa, estou à disposição!', sender: 'bot' },
      ]);
    }
  };

  const processReminder = async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: 'Ótimo! Me passe seu nome:', sender: 'bot' },
    ]);
    setReminderInProgress(true);
  };

  const handleReminderInput = async (input) => {
    if (reminderData.name === '') {
      setReminderData({ ...reminderData, name: input });
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: `Legal, ${input}! Agora me informe a data que você quer ir (no formato dd/mm/yyyy):`, sender: 'bot' },
      ]);
    } else if (reminderData.date === '') {
      setReminderData({ ...reminderData, date: input });
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: 'Perfeito! E qual é o horário que você pretende ir?', sender: 'bot' },
      ]);
    } else if (reminderData.time === '') {
      setReminderData({ ...reminderData, time: input });
      setTyping(true);

      // Simular processo de gravação de lembrete
      await saveReminder();
      setTyping(false);

      setMessages((prevMessages) => [
        ...prevMessages,
        { message: 'Lembrete gravado com sucesso!', sender: 'bot' },
      ]);


      // Reiniciar estado
      setReminderInProgress(false);
      setRecommendationRequested(false);
      setReminderData({
        name: '',
        date: '',
        time: ''
      });
    }
  };

  const saveReminder = async () => {
    // Lógica para salvar o lembrete (pode ser uma chamada de API, armazenamento local, etc.)
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const processMessageToChatGPT = async (chatMessages) => {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });


    const systemMessage = {
      name: "Pedro",
      role: "system",
      content: "Você é curitibano, receptivo e está sempre pronto para ajudar! Fala de um jeito mais jovem e descontraído.",
    };

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ],
      max_tokens: 2048,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    };

    setTyping(true);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    });

    setTyping(false);

    if (!response.ok) {
      console.error('Erro na resposta da API do Assistente:', response.status, response.statusText);
      return;
    }

    const data = await response.json();
    console.log('Resposta da API do Assistente:', data);

    const rawResponse = data.choices[0].message.content;
    const maxLength = 500;
    const summarizedResponse = summarizeText(rawResponse, maxLength);

    setMessages([
      ...chatMessages,
      { message: summarizedResponse, sender: "ChatGPT" }
    ]);
    setTyping(false);

    // Se uma recomendação foi solicitada, processar a recomendação
    if (recommendationRequested) {
      processRecommendation();
    }

    // Se um lembrete está em andamento, processar o lembrete
    if (reminderInProgress) {
      handleReminderInput(rawResponse);
    }
  }


  const getRecommendation = () => {
    // Lógica para obter recomendação de lugar
    return 'Recomendação: Bar do Alemão! (Resto do texto da recomendação)';
  };

  const summarizeText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }

    const words = text.split(' ');
    let summarizedText = '';
    let currentLength = 0;

    for (const word of words) {
      if (currentLength + word.length + 1 <= maxLength) {
        summarizedText += word + ' ';
        currentLength += word.length + 1;
      } else {
        break;
      }
    }

    // Remover o último espaço adicionado, se houver
    return summarizedText.trim();
  };

  return (
    <div className='App' style={{ backdropFilter: "blur(10px)" }}>
      <div style={{
        backdropFilter: "blur(10px)",
        position: "relative",
        height: "750px",
        width: "550px",
        overflow: "hidden",
        boxShadow: " 0 0 10px rgba(148, 0, 211, 0.1), 0 0 20px rgba(148, 0, 211, 0.1), 0 0 30px rgba(148, 0, 211, 0.1)"
      }}>
        <div style={{ backdropFilter: "blur(30px)", height: "750px", display: 'flex', flexDirection: 'column' }}>
          <div
            style={{ paddingTop: "15px", paddingRight: "5px", height: "680px", backdropFilter: "blur(30px)", scrollBehavior: "smooth", flex: 1 }}
          >
            {messages.map((message, i) => {
              const isUser = message.sender === 'user';
              const avatar = isUser ? (
                <div style={{ marginLeft: 'auto', marginRight: '8px', display: 'flex', alignItems: 'center' }}>
                  <div style={{fontSize: '20px', padding: "10px", marginBottom: "10px", backgroundColor: "white", borderRadius: "15px", color: "black", display: 'flex', alignItems: 'center',}}
                  >{message.message}
                  </div>
                  <img src={userAvatar} alt="User Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginLeft: '8px' }} />
                </div>
              ) : (
                <div style={{ marginRight: 'auto', marginLeft: '8px', display: 'flex', alignItems: 'center' }}>
                  <img src={chatAvatar} alt="Chat Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '8px' }} />
                  <div style={{fontSize: '20px', padding: "10px", marginBottom: "10px", backgroundColor: "white", borderRadius: "15px", color: "black", display: 'flex', alignItems: 'center',}}
                  >{message.message}
                  </div>
                </div>
              );
  
              return (
                <div key={i} style={{ fontSize: '20px', padding: "5px", color: "black", display: 'flex', alignItems: 'center', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                  {avatar}
                </div>
              );
            })}
            {typing && <CustomTypingIndicator />}
          </div>
          <div
            style={{ height: "70px", backgroundColor: "purple", fontSize: "24px", boxShadow: "0 0 0px rgba(255, 0, 255, 0.8)" }}
          >
            <MessageInput
              style={{ height: "70px", backgroundColor: "purple", fontSize: "24px", boxShadow: "0 0 0px rgba(255, 0, 255, 0.8)" }}
              placeholder='Escreva sua mensagem aqui'
              onSend={handleSend}
              sendButtonProps={{
                color: 'red',
                size: '30px'
              }}
              attachmentsButtonProps={{
                color: 'red',
                size: '30px'
              }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebChatComponent;
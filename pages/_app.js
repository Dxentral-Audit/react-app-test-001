import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import './App.css';

const App = () => {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState({});
  const [history, setHistory] = useState([]);
  const [recording, setRecording] = useState(false);

  const { transcript, resetTranscript, startListening, stopListening } = useSpeechRecognition({
    language: language,
  });

  useEffect(() => {
    setText(transcript);
  }, [transcript]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat',
        {
          prompt: text,
          model: 'gpt3',
          language: language,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer sk-4G0ZHJLZRKJZKDVEXJAVWPRJT3Q2YDP3`,
          },
        }
      );
      setResponse(res.data.text);
      resetTranscript();
      addToHistory({ user: user.name, text: text, response: response });
      setRecording(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLanguageChange = e => {
    setLanguage(e.target.value);
  };

  const handleUserChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const addToHistory = chat => {
    setHistory([...history, chat]);
  };

  const handleStartRecording = () => {
    setRecording(true);
    startListening();
  };

  const handleStopRecording = () => {
    setRecording(false);
    stopListening();
  };

  return (
    <div className="app">
      <h1>Mai</h1>
      <div className="user-profile">
        <h2>User Profile</h2>
        <form>
          <label>
            Name:
            <input type="text" name="profilePicture" onChange={handleUserChange} />
          </label>
        </form>
      </div>
      <div className="chat">
        {recording ? (
          <button onClick={handleStopRecording}>Done</button>
        ) : (
          <button onClick={handleStartRecording}>Ask Mai</button>
        )}
        {recording && (
          <button onClick={handleStopRecording}>Cancel</button>
        )}
        <form onSubmit={handleSubmit}>
          <label>
            Text:
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </label>
          <br />
          <label>
            Language:
            <select onChange={handleLanguageChange}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="ru">Russian</option>
              <option value="zh">Chinese</option>
            </select>
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
        <div className="response">
          {response && <p>{response}</p>}
        </div>
      </div>
      <div className="history">
        <h2>Chat History</h2>
        {history.map((chat, index) => (
          <div key={index}>
            <p>
              <strong>{chat.user}:</strong> {chat.text}
            </p>
            <p>
              <strong>Mai:</strong> {chat.response}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { ChatGPT3 } from 'openai';

function App() {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [recording, setRecording] = useState(false);

  const handleMicClick = () => {
    if (recording) {
      // Stop recording and send input to Chat GPT-3 API
      mediaRecorder.stop();
      stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    } else {
      // Start recording audio input
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        setRecording(true);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
          audioBitsPerSecond: 128000
        });
        mediaRecorder.start();

        // Stop recording after 30 seconds
        setTimeout(() => {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
          setRecording(false);
        }, 30000);

        mediaRecorder.addEventListener('dataavailable', event => {
          // Convert audio data to text
          const audioBlob = event.data;
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const audioDataUrl = reader.result;
            fetch('https://api.cloudinary.com/v1_1/your-cloud-name/upload', {
              method: 'POST',
              body: JSON.stringify({
                file: audioDataUrl,
                resource_type: 'raw'
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(response => {
              return response.json();
            }).then(data => {
              // Send text input to Chat GPT-3 API
              const input = data.url;
              ChatGPT3.prompt(input).then(result => {
                setResponse(result.text);
              });
            });
          };
        });
      });
    }
  };

  return (
    <div className="App">
      <button onClick={handleMicClick}>
        {recording ? 'Stop recording' : 'Click to speak'}
      </button>
      <p>{response}</p>
    </div>
  );
}

export default App;

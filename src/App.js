import logo from './logo.svg';
import './App.css';

import useWebSocket, { ReadyState } from 'react-use-websocket'
import React, { useState, useEffect } from 'react';


function App() {

  const [socketUrl, setSocketUrl] = useState("ws://localhost:8080")

  const {
    lastMessage
  } = useWebSocket(socketUrl)
  console.log(lastMessage)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>{lastMessage == null ? 1 : lastMessage.data[0]}</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

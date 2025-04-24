import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import './global.css';
import StartSessionComponent from './components/startSessionComponent';
import SessionContentComponent from './components/sessionContentComponent.js';
import GetSessionsComponent from './components/getSessionsComponent';
import NavbarComponent from './components/navbarComponent.js'
import Profile from './components/profileComponent.js'


function App() {

  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionLogId, setSessionLogId] = useState(null);

  const handleSessionStarted = (newSessionLogId) => {
    console.log("New sessionLogId:", newSessionLogId);
    setSessionStarted(true)
    setSessionLogId(newSessionLogId)
  };

  const handleSessionEnded = () => {
    setSessionStarted(false)
    setSessionLogId(null)
  }

  return (  
      <Router>
      <NavbarComponent/>
      <div className='main-content'>
        <Routes>
          <Route path="/" element={
            <div>
              <h1>Workout Logger</h1>
              <Profile/>
            </div>
            } />
          <Route path="/new-session" element={
            <div className='form-container'>
            {!sessionStarted && <StartSessionComponent onSessionStart={handleSessionStarted}/>}
            {sessionStarted && <SessionContentComponent sessionLogId={sessionLogId} onSessionEnd={handleSessionEnded} /> }
          </div>
          } /> 
          <Route path="/session-history" element={
            <div className='table-container'>
            <GetSessionsComponent />
          </div>
          } />
          </Routes>
      </div>
    </Router>   
  );
}

export default App;

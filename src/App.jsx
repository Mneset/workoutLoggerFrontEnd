import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import StartSessionComponent from './components/startSessionComponent';
import SessionContentComponent from './components/sessionContentComponent.js';
import GetSessionsComponent from './components/getSessionsComponent';
import GetSessionComponent from './components/getSessionComponent';
import NavbarComponent from './components/navbarComponent.js'
import Profile from './components/profileComponent.js'


function App() {

  //ad isLoggedIn for rendering getting session and session by id

  const [sessionStarted, setSessionStarted] = useState(false);

  const handleSessionStarted = () => {
    setSessionStarted(true)
  };

  const handleSessionEnded = () => {
    setSessionStarted(false)
  }

  return (  
      <Router>
      <NavbarComponent />
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
            {sessionStarted && <SessionContentComponent onSessionEnd={handleSessionEnded} /> }
          </div>
          } /> 
          <Route path="/session-history" element={
            <div className='table-container'>
            <GetSessionsComponent />
            <GetSessionComponent />
          </div>
          } />
          </Routes>
      </div>
    </Router>   
  );
}

export default App;

import React, { useState } from 'react';
import './App.css';
import StartSessionComponent from './components/startSessionComponent';
import SessionContentComponent from './components/sessionContentComponent.js';
import GetSessionsComponent from './components/getSessionsComponent';
import GetSessionComponent from './components/getSessionComponent';


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
    <div>

      <h1>Workout App</h1>
        <div className='form-container'>
          {!sessionStarted && <StartSessionComponent onSessionStart={handleSessionStarted}/>}
          {sessionStarted && <SessionContentComponent onSessionEnd={handleSessionEnded} /> }
        </div>

        <div className='table-container'>
          <div className='get-sessions-container'>
            <GetSessionsComponent />
          </div>
          <div className='get-session-container'>
            <GetSessionComponent />
          </div>
        </div>

    </div>   
  );
}

export default App;

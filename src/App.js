import React from 'react';
import './App.css';
import StartSessionComponent from './components/startSessionComponent';
import AddExerciseComponent from './components/addExerciseComponent';
import EndSessionComponent from './components/endSessionComponent';
import GetSessionsComponent from './components/getSessionsComponent';
import GetSessionComponent from './components/getSessionComponent';


function App() {

  return (   
    <div>

      <h1>Workout App</h1>
        <div className='form-container'>
          <StartSessionComponent />
          <AddExerciseComponent />
          <EndSessionComponent />
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

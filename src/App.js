import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

  return (   
    <div>
      <h1>Workout App</h1>
      <h2>Start a new session</h2>
      <form className='start-session-form'> 
        <label>User ID: </label>
        <input type="number" placeholder='Please provide your User ID'/>
        <button type="submoit">Start session</button>
      </form>

      <h2>Add exercises to your session</h2>
      <form className='add-exercise-form'>
        <label>Add a exercise: </label>
        <input type="number" placeholder='Please provide the exercise ID'/>
        <button type="submit">Add exercise</button>
      </form>

      <h2>End session</h2>
      <form className='end-session-form'> 
        <button type="submoit">End session</button>
      </form>

      <h2>Session Log</h2>
    </div>   
  );
}

export default App;

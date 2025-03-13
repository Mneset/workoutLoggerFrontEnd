import React, { useState, useEffect } from 'react';
import api from '../api';

function EndSessionComponent() {
    const [sessionLogId, setSessionLogId] = useState('');
    const [workoutHistoryId, setWorkoutHistoryId] = useState(1);
    const [notes, setNotes] = useState('');

    const handleEndSession = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/session/end', {sessionLogId, workoutHistoryId, notes})
            console.log("Session ended:", response.data);
            alert("Session ended!");
        } catch (error) {
            console.log("Error ending session:", error);      
        }
    }

    return (
        <div>
            <h2>End session</h2>
            <form className='end-session-form' onSubmit={handleEndSession}> 
                <label>Session Log ID: </label>
                <input type="number" 
                    name="sessionLogId" 
                    placeholder='Please provide the session log ID' 
                    onChange={(e) => setSessionLogId(e.target.value)}
                />
                <label>Workout History ID: </label>
                <input type="number" 
                    name="workoutHistoryId" 
                    placeholder='1' 
                    onChange={(e) => setWorkoutHistoryId(e.target.value)}
                />
                <label>Notes: </label>
                <input type="string" 
                    name="notes" 
                    placeholder='Please provide notes if needed' 
                    onChange={(e) => setNotes(e.target.value)}
                />
                <button type="submit">End session</button>
            </form>
        </div>
    )
}

export default EndSessionComponent;
import React, { useState, useEffect } from 'react';
import api from '../api';

function EndSessionComponent({ onSessionEnd }) {
    const [sessionLogId, setSessionLogId] = useState('');
    const [sessionNotes, setSessionNotes] = useState('');

    const handleEndSession = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/session/end', {sessionLogId, sessionNotes})
            console.log("Session ended:", response.data);
            alert("Session ended!");
            onSessionEnd()
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
                <label>Notes: </label>
                <input type="string" 
                    name="notes" 
                    placeholder='Please provide notes if needed' 
                    onChange={(e) => setSessionNotes(e.target.value)}
                />
                <button type="submit">End session</button>
            </form>
        </div>
    )
}

export default EndSessionComponent;
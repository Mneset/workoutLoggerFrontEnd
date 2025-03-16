import React, { useState, useEffect } from 'react';
import api from '../api';

function StartSessionComponent({ onSessionStart }) {
    const [userId, setUserId] = useState(1);

    const handleStartSession = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/session', {userId})
            console.log("Session started:", response.data);
            alert("Session started!");
            onSessionStart()
        } catch (error) {
            console.log("Error starting session:", error);      
        }
    }

    return (
        <div>
            <h2>Start a new session</h2>
            <form className='start-session-form' onSubmit={handleStartSession}> 
                <label>User ID: </label>
                <input type="number" 
                    name="userId" 
                    placeholder='1' 
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button type="submit">Start session</button>
            </form>
        </div>
    )
}

export default StartSessionComponent;
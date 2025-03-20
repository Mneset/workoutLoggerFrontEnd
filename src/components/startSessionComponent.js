import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import api from '../api';

function StartSessionComponent({ onSessionStart }) {
    const [userId, setUserId] = useState(1);
    const { getAccessTokenSilently } = useAuth0();

    const handleStartSession = async (e) => {
        e.preventDefault();
        try {

            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: `https://${process.env.REACT_APP_ACCESS_DOMAIN}/api/v2/`,
                    scope: "read:current_user",
                },
            });

            const response = await api.post('/new-session', {userId}, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

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
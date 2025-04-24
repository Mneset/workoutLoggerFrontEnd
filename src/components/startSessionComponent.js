import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import api from '../api';

function StartSessionComponent({ onSessionStart }) {
    const { getAccessTokenSilently, user } = useAuth0();

    const handleStartSession = async (e) => {
        e.preventDefault();
        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'https://dev-n8xnfzfw0w26p6nq.us.auth0.com/api/v2/',
                    scope: "openid start:session",
                },
            });

            console.log('user.sub:', user.sub);
            console.log("Access Token:", accessToken);
            

            const response = await api.post('/new-session', {userId: user.sub}, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

            console.log("Session started:", response);
            alert("Session started!");
            onSessionStart(response.data.sessionLogId);
        } catch (error) {
            console.error("Error starting session:", error);      
        }
    }

    return (
        <div>
            <h2>Start a new session</h2>
            <form className='start-session-form' onSubmit={handleStartSession}>
                <button type="submit">Start session</button>
            </form>
        </div>
    )
}

export default StartSessionComponent;
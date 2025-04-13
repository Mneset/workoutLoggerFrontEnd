import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import api from '../api';

function GetSessionComponent() {
    const [sessionLogId, setSessionLogId] = useState('');
    const [session, setSession] = useState(null);
    const { getAccessTokenSilently } = useAuth0();
    
    const handleGetSession = async (e) => {
        e.preventDefault();
        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: `http://localhost:3000/api/v1`,
                    scope: "openid start:session",
                },
            }); 

            const response = await api.get('/session-history/:id', { params: { sessionLogId }, 
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setSession(response.data.session);
            console.log('Current session:', response.data.session);
        } catch (error) {
            console.log('Error getting current session:', error.response ? error.response.data : error.message);
        }
    }

    return (
        <div>
            <div className='get-session-form-container'>
                <h2>Get session by ID</h2>
                <form className='get-sessions-form' onSubmit={handleGetSession}>
                    <label>Session Log ID: </label>
                    <input
                        type="number"
                        name="sessionLogId"
                        placeholder='Please provide your User ID'
                        onChange={(e) => setSessionLogId(e.target.value)}
                    />
                    <button type="submit">Get session</button>
                </form>
                <h2>Specific session</h2>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Session ID</th>
                        <th>Exercise</th>
                        <th>Reps</th>
                        <th>Weight</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {session && session.ExerciseLogs && session.ExerciseLogs.length > 0 ? (
                        session.ExerciseLogs.map((log) => (
                            <tr key={log.id}>
                                <td>{session.id}</td>
                                <td>{log.Exercise.name}</td>
                                <td>{log.reps}</td>
                                <td>{log.weight}</td>
                                <td>{log.notes}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No session has been selected</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default GetSessionComponent;
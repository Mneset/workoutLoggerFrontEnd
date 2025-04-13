import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import api from '../api';

function GetSessionsComponent() {
    const [userId, setUserId] = useState('github|182747903');
    const [sessions, setSessions] = useState([]);
    const { getAccessTokenSilently } = useAuth0();
    
    const handleGetSessions = async (e) => {
        e.preventDefault();
        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: `http://localhost:3000/api/v1`,
                    scope: "openid start:session",
                },
            }); 

            console.log("Access Token:", accessToken);

            const response = await api.get('/session-history', { params: { userId }, 
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });
                setSessions(response.data.sessions);
            console.log('Sessions for user:', response.data.sessions);
        } catch (error) {
            console.log('Error getting sessions:', error.response ? error.response.data : error.message);
        }
    }

    return (
        <div>
            <div className='get-sessions-form-container'>
                <h2>Get all sessions</h2>
                <form className='get-sessions-form' onSubmit={handleGetSessions}>
                    <label>User ID: </label>
                    <input
                        type="string"
                        name="userId"
                        placeholder='github|182747903'
                        onChange={(e) => setUserId(e.target.value)}
                    />
                    <button type="submit">Get sessions</button>
                </form>
            <h2>Sessions</h2>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Session ID</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions && sessions.length > 0 ? 
                        (sessions.filter(session => session.id >= 6).map((session) => (
                            <tr key={session.id}>
                                <td>{session.id}</td>
                                <td>{session.sessionDateStart}</td>
                                <td>{session.sessionDateEnd}</td>
                                <td>{session.notes}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">Sessions has not been requested</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default GetSessionsComponent;
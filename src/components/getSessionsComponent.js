import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import api from '../api';

function GetSessionsComponent() {
    const [sessions, setSessions] = useState([]);
    const { getAccessTokenSilently, user } = useAuth0();
    
    const handleGetSessions = async (e) => {
        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: `http://localhost:3000/api/v1`,
                    scope: "openid start:session",
                },
            }); 

            console.log("Access Token:", accessToken);

            const response = await api.get('/session-history', { params: { userId: user.sub }, 
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

    useEffect(()=> {
        handleGetSessions();
    }, []);

    return (
        <div id='sessions-container'> 
            { sessions && sessions.length > 0 ? (
                sessions.filter(session => session.id >= 6).map((session) => (
                    <div key={session.id}>
                        <h2>Session ID: {session.id}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Exercise</th>
                                    <th>Reps</th>
                                    <th>Weight</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(session.ExerciseLogs) && session.ExerciseLogs.length > 0 ? (
                                    session.ExerciseLogs.map((log, index) => (
                                        <tr key={`${session.id}-${log.exerciseId}-${index}`}>
                                            <td>{log.Exercise.name}</td>
                                            <td>{log.reps}</td>
                                            <td>{log.weight}</td>
                                            <td>{log.notes}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No exercise logs found for this session.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <div>No sessions found.</div>
            )}
        </div>
    );
};

export default GetSessionsComponent;
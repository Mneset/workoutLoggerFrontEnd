import React, { useState, useEffect } from 'react';
import api from '../api';

function GetSessionsComponent() {
    const [userId, setUserId] = useState(1);
    const [sessions, setSessions] = useState([]);
    
    const handleGetSessions = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get('/session-history', { params: { userId } });
                setSessions(response.data.sessions);
            console.log('Sessions for user:', response.data.sessions);
        } catch (error) {
            console.log('Error getting sessions:', error.response ? error.response.data : error.message);
        }
    }

    return (
        <div>
            <div className='get-sessions-form-container'>
                <h2>Get sessions</h2>
                <form className='get-sessions-form' onSubmit={handleGetSessions}>
                    <label>User ID: </label>
                    <input
                        type="number"
                        name="userId"
                        placeholder='1'
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
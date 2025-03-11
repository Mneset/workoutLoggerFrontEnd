import React, { useState, useEffect } from 'react';
import api from '../api';

function GetSessionComponent() {
    const [sessionLogId, setSessionLogId] = useState('');
    const [session, setSession] = useState('');
    
    const handleGetSession = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get('/session/:id', { params: { sessionLogId } });
                setSession(response.data.session);
            console.log('Current session:', response.data.session);
        } catch (error) {
            console.log('Error getting current session:', error.response ? error.response.data : error.message);
        }
    }

    return (
        <div>
            <div className='get-session-form-container'>
                <h2>Session by ID</h2>
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
                <h2>Session</h2>
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
                        <tr key={session.id}>
                            <td>{session.id}</td>
                            <td>{session.sessionDateStart}</td>
                            <td>{session.sessionDateEnd}</td>
                            <td>{session.notes}</td>
                        </tr>
                </tbody>
            </table>
        </div>
    )
}

export default GetSessionComponent;
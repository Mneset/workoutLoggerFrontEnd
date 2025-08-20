import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import api from '../api';
import ExerciseListComponent from './exerciseListComponent';


function SessionContent2Component( {sessionLogId, onSessionEnd }) {
    const [exerciseId, setExerciseId] = useState();
    const [setId, setSetId] = useState(1);
    const [reps, setReps] = useState(10);
    const [weight, setWeight] = useState(100);
    const [notes, setNotes] = useState('');
    const [session, setSession] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [sets, setSets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddExerciseForm, setShowAddExerciseForm] = useState(false);
    const [editTableLogs, setEditTableLogs] = useState([]);
    const [sessionName, setSessionName] = useState('');
    const [modal, setModal] = useState(false);
 
    const { getAccessTokenSilently, user } = useAuth0();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: 'https://dev-n8xnfzfw0w26p6nq.us.auth0.com/api/v2/',
                        scope: "openid start:session",
                    },
                });

                const response = await api.get('/exercises', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setExercises(response.data.exercises);

                const setsResponse = await api.get('/sets', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setSets(setsResponse.data.setTypes);
            
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [getAccessTokenSilently]);

    const toggleModal = () => {
            setModal(!modal);
        }

    const handleAddExercise = async (id) => {
        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'https://dev-n8xnfzfw0w26p6nq.us.auth0.com/api/v2/',
                    scope: "openid start:session",
                },
            });

            const response = await api.post('/new-session/exercise', {exerciseId: id, setId, reps, weight, notes, sessionLogId}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            console.log("Exercise added to session:", response.data);

        } catch (error) {
            console.log("Error adding exercise to session:", error);
        }
    }

    const handleAddSet = async => {
        
    }

    const handleEndSession = async () => {
        const notes = window.prompt("Please provide notes for the session");
        if (notes === null) {
            return
        }
        console.log("Notes for session:", notes);
        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: `https://dev-n8xnfzfw0w26p6nq.us.auth0.com/api/v2/`,
                    scope: "openid start:session",
                },
            });

            const response = await api.put('/new-session/end', {sessionLogId, notes, updatedLogs: editTableLogs, name: sessionName}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            
            console.log("Session ended:", response.data);
            alert("Session ended!");
            onSessionEnd()
            window.location.href = '/';
        } catch (error) {
            console.log("Error ending session:", error);      
        }
    }

    const handleCancelSession = async (sessionLogId) => {
        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'https://dev-n8xnfzfw0w26p6nq.us.auth0.com/api/v2/',
                    scope: "openid start:session",
                },
            });

            console.log("Access Token:", accessToken);

            const response = await api.delete(`/session-history/${sessionLogId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });
            console.log("Session deleted:", response.data);
            alert("Session was canceled successfully!");
            window.location.href = '/';
        } catch (error) {
            console.error("Error deleting session:", error);         
        }
    }

    useEffect(() => {
        if (session && session.name) {
            setSessionName(session.name);
        }
    }, [session]);

    return (
        <div>
        <div id='session-container'> 
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="4" style={{ fontWeight: 'bold', textAlign: 'center'}}>
                                    <label htmlFor="sessionName">Session Name: </label>
                                    <input
                                        type="text"
                                        id="sessionName"
                                        name="sessionName"
                                        placeholder="Enter session name..."
                                        value={sessionName}
                                        onChange={e => setSessionName(e.target.value)}
                                        style={{ width: '100%' }}
                                    />     
                                </th>
                            </tr>
                        </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan="4"  className='exercise-name' style={{ fontWeight: 'bold', textAlign: 'center'}}>
                                            <span></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Set</td>
                                        <td>Reps</td>
                                        <td>Weight</td>
                                        <td>Notes</td>
                                    </tr>
                                        <tr>
                                            <td>Set 1</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={reps}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={weight}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={notes || ""}
                                                />
                                            </td>
                                        </tr>
                                    <tr>
                                        <td colSpan="4">
                                            <button 
                                            className='add-button'
                                            onClick={() => handleAddSet()}
                                            >
                                                Add set
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4">
                                            <button 
                                            className='add-btn'
                                            onClick={() => toggleModal()}
                                            >
                                                Add new Exercise
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                    </table>
                    <div className='button-group'>
                    <button 
                            className='session-button'
                            onClick={() => handleCancelSession(session.id)}
                        >
                            Cancel
                        </button>
                    <button
                            type="button"
                            className='session-button'
                            style={{ marginTop: "10px" }}
                            onClick={handleEndSession}
                        >
                            End session
                        </button>
                    </div>
                </div>     
             </div>
              {modal && (
                        <ExerciseListComponent
                            exercises={exercises}
                            onClose={toggleModal}
                            onSelect={exercise => {
                                setExerciseId(exercise.id);
                                handleAddExercise(exercise.id);
                                setShowAddExerciseForm(true);
                            }}
                        />
                    )}
        </div>                 
    )
}

export default SessionContent2Component;
import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import api from '../api';

function SessionContentComponent( {sessionLogId, onSessionEnd }) {
    const [exerciseId, setExerciseId] = useState();
    const [setId, setSetId] = useState(1);
    const [reps, setReps] = useState(10);
    const [weight, setWeight] = useState(100);
    const [notes, setNotes] = useState('');
    const [session, setSession] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [sets, setSets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExerciseName, setSelectedExerciseName] = useState('')
    const [showAddExerciseForm, setShowAddExerciseForm] = useState(false);
    const [editTableLogs, setEditTableLogs] = useState([]);
 
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

    const handleGetSession = async (e) => {
        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: `https://dev-n8xnfzfw0w26p6nq.us.auth0.com/api/v2/`,
                    scope: "openid start:session",
                },
            }); 

            const response = await api.get('/session-history/:id', { params: { sessionLogId }, 
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setSession(response.data.session);
            setEditTableLogs(response.data.session.ExerciseLogs);
        } catch (error) {
            console.log('Error getting current session:', error.response ? error.response.data : error.message);
        }
    }

    const handleAddExercise = async () => {
        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'https://dev-n8xnfzfw0w26p6nq.us.auth0.com/api/v2/',
                    scope: "openid start:session",
                },
            });

            const response = await api.post('/new-session/exercise', {exerciseId, setId, reps, weight, notes, sessionLogId}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            console.log("Exercise added to session:", response.data);
            alert("Exercise added to session!");
            await handleGetSession()

        } catch (error) {
            console.log("Error adding exercise to session:", error);
        }
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

            const response = await api.put('/new-session/end', {sessionLogId, notes, updatedLogs: editTableLogs}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            
            console.log("Session ended:", response.data);
            alert("Session ended!");
            onSessionEnd()
        } catch (error) {
            console.log("Error ending session:", error);      
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = e.nativeEvent.submitter.name;
        if (action === 'addExercise'){
            handleAddExercise();
            setShowAddExerciseForm(false);
        } else if (action === 'endSession') {
            handleEndSession();
        }
    };

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

    const saveAllEdits = async () => {
        const accessToken = await getAccessTokenSilently({
            authorizationParams: {
                audience: 'https://dev-n8xnfzfw0w26p6nq.us.auth0.com/api/v2/',
                scope: "openid start:session",
            },
        });
        for (const log of editTableLogs) {
            if (log.id) {
                await api.put(`/new-session/exercise-log/${log.id}`, {
                    reps: log.reps,
                    weight: log.weight,
                    notes: log.notes,
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            }
        }
    };

 const handleAddSet = async (exerciseName) => {
    // Find all logs for this exercise
    const logsForExercise = editTableLogs.filter(log => log.Exercise.name === exerciseName);
    if (logsForExercise.length === 0) return;

    // Get the last log for this exercise
    const lastLog = logsForExercise[logsForExercise.length - 1];

    try {
        await saveAllEdits();

        const accessToken = await getAccessTokenSilently({
            authorizationParams: {
                audience: 'https://dev-n8xnfzfw0w26p6nq.us.auth0.com/api/v2/',
                scope: "openid start:session",
            },
        });

        // Send a POST request to create a new log with the same values as the last log
        await api.post('/new-session/exercise', {
            exerciseId: lastLog.exerciseId,
            setId: lastLog.setId,
            reps: lastLog.reps,
            weight: lastLog.weight,
            notes: lastLog.notes,
            sessionLogId
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        // Refresh session data to get the new log
        await handleGetSession();
    } catch (error) {
        console.error("Error adding set:", error);
    }
};

    useEffect(() => {
        handleGetSession();
    }, [sessionLogId]);

    return (
        <div>
        <div id='session-container'> 
        {session && (
                <div key={session.id}>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="4" style={{ fontWeight: 'bold', textAlign: 'center'}}>
                                    Evening Session         
                                </th>
                            </tr>
                        </thead>
                        {Array.isArray(session.ExerciseLogs) && session.ExerciseLogs.length > 0 ? (
                            Object.entries(
                                editTableLogs.reduce((acc, log) => {
                                    const exerciseName = log.Exercise.name;
                                    if (!acc[exerciseName]) acc[exerciseName] = [];
                                    acc[exerciseName].push(log);
                                    return acc;
                                }, {})
                            ).map(([exerciseName, logs]) => (
                                <tbody key={exerciseName}>
                                    <tr>
                                        <td colSpan="4"  className='exercise-name' style={{ fontWeight: 'bold', textAlign: 'center'}}>
                                            {exerciseName}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Set</td>
                                        <td>Reps</td>
                                        <td>Weight</td>
                                        <td>Notes</td>
                                    </tr>
                                    {logs.map((log, index) => (
                                        <tr key={`${session.id}-${log.exerciseId}-${index}`}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={log.reps}
                                                    onChange={e => {
                                                        const updatedLogs = [...editTableLogs];
                                                        const globalIndex = editTableLogs.findIndex(
                                                            l => l.id === log.id
                                                        );
                                                        updatedLogs[globalIndex] = {
                                                            ...updatedLogs[globalIndex],
                                                            reps: e.target.value
                                                        };
                                                        setEditTableLogs(updatedLogs);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={log.weight}
                                                    onChange={e => {
                                                        const updatedLogs = [...editTableLogs];
                                                        const globalIndex = editTableLogs.findIndex(
                                                            l => l.id === log.id
                                                        );
                                                        updatedLogs[globalIndex] = {
                                                            ...updatedLogs[globalIndex],
                                                            weight: e.target.value
                                                        };
                                                        setEditTableLogs(updatedLogs);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={log.notes || ""}
                                                    onChange={e => {
                                                        const updatedLogs = [...editTableLogs];
                                                        const globalIndex = editTableLogs.findIndex(
                                                            l => l.id === log.id
                                                        );
                                                        updatedLogs[globalIndex] = {
                                                            ...updatedLogs[globalIndex],
                                                            notes: e.target.value
                                                        };
                                                        setEditTableLogs(updatedLogs);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="4">
                                            <button 
                                            className='add-button'
                                            onClick={() => handleAddSet(exerciseName)}
                                            >
                                                Add set
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4">
                                            <button 
                                            className='add-button'
                                            onClick={() => setShowAddExerciseForm(true)}
                                            >
                                                Add new Exercise
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            ))
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan="4">No exercise logs found for this session.</td>
                                </tr>
                                <tr>
                                    <td colSpan="4">
                                        <button 
                                        className='add-button'
                                        onClick={() => setShowAddExerciseForm(true)}
                                        >
                                            Add Exercise
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                    {showAddExerciseForm && (
                        <form className='add-exercise-form' onSubmit={handleSubmit}>
                            <label htmlFor="exerciseSearch">Search for an exercise: </label>
                            <input
                                type="text"
                                id="exerciseSearch"
                                name="exerciseSearch"
                                placeholder="Type to search..."
                                value={searchQuery || selectedExerciseName}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setSelectedExerciseName('');
                                }}
                            />
                            {searchQuery && (
                                <ul className='searchUl'>
                                    {exercises
                                        .filter((exercise) =>
                                            exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((exercise) => (
                                            <li
                                                key={exercise.id}
                                                style={{ cursor: 'pointer', padding: '5px 0' }}
                                                onClick={() => {
                                                    console.log('Selected exercise ID:', exercise.id);
                                                    setExerciseId(exercise.id);
                                                    setSelectedExerciseName(exercise.name);
                                                    setSearchQuery('');
                                                }}
                                            >
                                                {exercise.name}
                                            </li>
                                        ))}
                                </ul>
                            )}
                            <div className='button-group'>
                                <button type="submit" name='addExercise'>Add exercise</button>
                                <button type="button" onClick={() => setShowAddExerciseForm(false)}>Cancel</button>
                            </div>
                        </form>    
                    )}
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
                )}
             </div>
        </div>                 
    )
}

export default SessionContentComponent;
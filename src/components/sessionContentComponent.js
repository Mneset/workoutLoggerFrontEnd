import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import api from '../api';

function SessionContentComponent( {sessionLogId, onSessionEnd }) {
    //exerciseId, setId, reps, weight, notes, sessionLogId
    const [exerciseId, setExerciseId] = useState();
    const [setId, setSetId] = useState(1);
    const [reps, setReps] = useState(10);
    const [weight, setWeight] = useState(100);
    const [notes, setNotes] = useState('');
    const [sessionNotes, setSessionNotes] = useState('');
    const [session, setSession] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [sets, setSets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExerciseName, setSelectedExerciseName] = useState('')
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
            console.log('Current session:', response.data.session);
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
        const sessionNotes = window.prompt("Please provide notes for the session");
        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: `https://dev-n8xnfzfw0w26p6nq.us.auth0.com/api/v2/`,
                    scope: "openid start:session",
                },
            });

            const response = await api.put('/new-session/end', {sessionLogId, sessionNotes}, {
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
        } else if (action === 'endSession') {
            handleEndSession();
        }
    };

    return (
        <div>
            <h2>Add a exercise to the session</h2>
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
{/* Show the list only when the user is typing */}
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
                        setSearchQuery('');
                    }}
                >
                    {exercise.name}
                </li>
            ))}
    </ul>
)}
                <label htmlFor="setId">Choose a set: </label>
                <select
                    id="setId"
                    name="setId"
                    value={setId}
                    onChange={(e) => setSetId(e.target.value)}
                >
                    <option value="" disabled>Select a set</option>
                    {sets.map((set) => (
                        <option key={set.id} value={set.id}>
                            {set.name}
                        </option>
                    ))}
                </select>
                <label>Reps: </label>
                <input 
                    type="number" 
                    name="reps" 
                    placeholder='10' 
                    onChange={(e) => setReps(e.target.value)}
                />
                <label>Weight: </label>
                <input 
                    type="number" 
                    name="weight" 
                    placeholder='100' 
                    onChange={(e) => setWeight(e.target.value)}
                />
                <label>Exercise Notes: </label>
                <input 
                    type="string" 
                    name="notes" 
                    placeholder='Please provide notes if needed' 
                    onChange={(e) => setNotes(e.target.value)}
                />
                <div className='button-group'>
                    <button type="submit" name='addExercise'>Add exercise</button>
                    <button type="submit" name='endSession'>End session</button>
                </div>
            </form>

            <div id='session-container'> 
            {session && session.ExerciseLogs.length > 0 ? (
                    <div key={session.id}>
                        <h2>Session ID: {session.id}</h2>
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
                                    session.ExerciseLogs.reduce((acc, log) => {
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
                                                <td>{log.reps}</td>
                                                <td>{log.weight}</td>
                                                <td>{log.notes}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                ))
                            ) : (
                                <tbody>
                                    <tr>
                                        <td colSpan="4">No exercise logs found for this session.</td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>     
            ) : (
                <div>Sessions is empty as of now. Add an exercise to see your session</div>
            )}
        </div>

        </div>
        
    )
}

export default SessionContentComponent;
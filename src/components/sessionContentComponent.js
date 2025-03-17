import React, { useState } from 'react';
import api from '../api';

function SessionContentComponent( {onSessionEnd }) {
    //exerciseId, setId, reps, weight, notes, sessionLogId
    const [exerciseId, setExerciseId] = useState(1);
    const [setId, setSetId] = useState(1);
    const [reps, setReps] = useState(10);
    const [weight, setWeight] = useState(100);
    const [notes, setNotes] = useState('');
    const [sessionLogId, setSessionLogId] = useState('');
    const [sessionNotes, setSessionNotes] = useState('');

    const handleAddExercise = async () => {
        try {
            const response = await api.post('/new-session/exercise', {exerciseId, setId, reps, weight, notes, sessionLogId})
            console.log("Exercise added to session:", response.data);
            alert("Exercise added to session!");
        } catch (error) {
            console.log("Error adding exercise to session:", error);
        }
    }

    const handleEndSession = async () => {
        const sessionNotes = window.prompt("Please provide notes for the session");
        try {
            const response = await api.put('/new-session/end', {sessionLogId, sessionNotes})
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
                <label>Exercise ID: </label>
                <input 
                    type="number" 
                    name="exerciseId" 
                    placeholder='1' 
                    onChange={(e) => setExerciseId(e.target.value)}
                />
                <label>Set ID: </label>
                <input 
                    type="number" 
                    name="setId" 
                    placeholder='1' 
                    onChange={(e) => setSetId(e.target.value)}
                />
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
                <label>Session Log ID: </label>
                <input 
                    type="number" 
                    name="sessionLogId" 
                    placeholder='Please provide the session log ID' 
                    onChange={(e) => setSessionLogId(e.target.value)}
                />
                <div className='button-group'>
                    <button type="submit" name='addExercise'>Add exercise</button>
                    <button type="submit" name='endSession'>End session</button>
                </div>
            </form>

        </div>
        
    )
}

export default SessionContentComponent;
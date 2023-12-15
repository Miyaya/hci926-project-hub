import React, { useState } from 'react';

export default function Login({ socket }) {
    const [username, setUsername] = useState('');

    const handleInputChange = (event) => {
        setUsername(event.target.value);
    };

    const handleSubmit = () => {
        // fetch('http://localhost:8000/api/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ username }),
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         // Handle the server response here
        //         console.log('Server response:', data);
        //     })
        //     .catch(error => {
        //         console.error('Error sending data to server:', error);
        //     })
        socket.emit('login', username)
    }

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                value={username}
                onChange={handleInputChange}
                placeholder="Enter your username"
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

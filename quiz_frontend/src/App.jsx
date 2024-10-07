import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Quiz from './components/Quiz';
import Leaderboard from './components/Leaderboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Register />} />
                    <Route path="/quiz/:topic" element={<Quiz />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

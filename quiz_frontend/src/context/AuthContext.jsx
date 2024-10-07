import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a Context for Authentication
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Check if user is logged in on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('/api/profile', {
                headers: { 'Authorization': token }
            })
            .then(response => {
                setUser(response.data);
            }).catch(() => {
                localStorage.removeItem('token');
                setUser(null);
            });
        }
    }, []);

    // Login function
    const login = async (username, password) => {
        const { data } = await axios.post('/api/login', { username, password });
        localStorage.setItem('token', data.token);
        setUser(await getUserProfile());
    };

    // Register function
    const register = async (username, password) => {
        const { data } = await axios.post('/api/register', { username, password });
        localStorage.setItem('token', data.token);
        setUser(await getUserProfile());
    };

    // Get User Profile
    const getUserProfile = async () => {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/profile', {
            headers: { 'Authorization': token }
        });
        return data;
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };

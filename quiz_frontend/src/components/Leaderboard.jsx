import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const { data } = await axios.get('/api/leaderboard');
            setLeaderboard(data);
        };
        fetchLeaderboard();
    }, []);

    return (
        <div>
            <h2>Leaderboard</h2>
            <ul>
                {leaderboard.map((user, index) => (
                    <li key={index}>
                        <h4>{user.username}</h4>
                        <ul>
                            {user.scores.map((score, i) => (
                                <li key={i}>{score.topic}: {score.score}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;

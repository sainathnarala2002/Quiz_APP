import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Quiz = () => {
    const { topic } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`/api/quiz/${topic}`, {
                headers: { 'Authorization': token }
            });
            setQuiz(data);
        };
        fetchQuiz();
    }, [topic]);

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const { data } = await axios.post(`/api/quiz/${topic}`, { answers }, {
            headers: { 'Authorization': token }
        });
        setScore(data.score);
    };

    if (!quiz) return <div>Loading...</div>;

    return (
        <div>
            <h2>{quiz.topic} Quiz</h2>
            {quiz.questions.map((q, index) => (
                <div key={index}>
                    <h4>{q.questionText}</h4>
                    {q.options.map((option, i) => (
                        <label key={i}>
                            <input
                                type="radio"
                                name={`question-${index}`}
                                value={option}
                                onChange={() => {
                                    const newAnswers = [...answers];
                                    newAnswers[index] = option;
                                    setAnswers(newAnswers);
                                }}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            ))}
            <button onClick={handleSubmit}>Submit Quiz</button>
            {score !== null && <h3>Your Score: {score}</h3>}
        </div>
    );
};

export default Quiz;

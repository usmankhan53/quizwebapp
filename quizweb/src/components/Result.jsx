import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../css/Result.module.css'; // Import the CSS module

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Result() {
  const query = useQuery();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const score = parseInt(query.get('score'));
  const totalQuestions = parseInt(query.get('totalQuestions'));
  const title = query.get('title');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      console.error('Username not found in localStorage');
    }
  }, []);

  useEffect(() => {
    if (!username) return;

    const data = {
      title,
      score,
      totalQuestions,
    };

    const updateQuizResults = async () => {
      try {
        const response = await fetch(`https://quizwebbackend.vercel.app/${username}/quizResults`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to update quiz results');
        }

        console.log('Quiz results updated successfully');
      } catch (error) {
        console.error('Error updating quiz results:', error);
      }
    };

    updateQuizResults();
  }, [username, title, score, totalQuestions]);

  useEffect(() => {
    // Simulate loading for 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer); // Clean up timer on unmount
  }, []);

  let emoji;
  if (score === 0) {
    emoji = '😞';
  } else if (score < totalQuestions / 2) {
    emoji = '😐';
  } else {
    emoji = '😄';
  }

  const handleGoBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className={styles.resultContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  const progress = (score / totalQuestions) * 100;

  return (
    <div className={styles.resultContainer}>
      <h2 className={styles.resultTitle}>Quiz Result {emoji}</h2>
      <div
        className={styles.progressCircle}
        style={{ '--progress': progress }}
      >
        {Math.round(progress)}%
      </div>
      <p className={styles.resultScore}>
        Your score: {score}
      </p>
      <p className={styles.resultSummary}>
        You Got {score} out of {totalQuestions} questions.
      </p>
      <button className={styles.backButton} onClick={handleGoBack}>Go Back Home</button>
    </div>
  );
}

export default Result;

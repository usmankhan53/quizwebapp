import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Result.css'; // Import the CSS file for styling

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Result() {
  const query = useQuery();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State to track loading status
  const score = parseInt(query.get('score')); // Parse score as integer
  const totalQuestions = parseInt(query.get('totalQuestions')); // Parse totalQuestions as integer
  const title = query.get('title');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // Handle case where username is not found in localStorage
      console.error('Username not found in localStorage');
    }
  }, []);

  useEffect(() => {
    if (!username) return; // Don't proceed if username is not available

    // Prepare data for API call
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

        // Handle success if needed
        console.log('Quiz results updated successfully');
      } catch (error) {
        console.error('Error updating quiz results:', error);
        // Handle error as needed
      }
    };

    updateQuizResults();
  }, [username, title, score, totalQuestions]);

  useEffect(() => {
    // Simulate loading for 2 seconds
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 2000); // 2 seconds

    return () => clearTimeout(timer); // Clean up timer on unmount
  }, []);

  // Determine emoji based on score
  let emoji;
  if (score === 0) {
    emoji = '😞'; // Sad face emoji
  } else if (score < totalQuestions / 2) {
    emoji = '😐'; // Neutral face emoji
  } else {
    emoji = '😄'; // Happy face emoji
  }

  const handleGoBack = () => {
    navigate('/'); // Navigate back to the home page
  };

  if (loading) {
    return (
      <div className="result-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="result-container">
      <h2 className="result-title">Quiz Result {emoji}</h2>
      <p className="result-score">
        Your score: {score}
      </p>
      <p className="result-summary">
        You Got {score} out of {totalQuestions} questions.
      </p>
      <button className="back-button" onClick={handleGoBack}>Go Back Home</button>
    </div>
  );
}

export default Result;

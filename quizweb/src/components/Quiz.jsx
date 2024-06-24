import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import UsernameModal from './UsernameModal';
import '../css/Quiz.css'; // Import the CSS file for styling

function Quiz() {
  const { id } = useParams(); // Extracting quiz ID from URL params
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(60); // Timer set to 60 seconds (1 minute)
  const [timerExpired, setTimerExpired] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false); // State to track if quiz has started
  const [loading, setLoading] = useState(true); // State to track loading status
  const [showUsernameModal, setShowUsernameModal] = useState(false); // State to show UsernameModal
  const [userAnswers, setUserAnswers] = useState([]); // State to store user answers

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`https://quizwebbackend.vercel.app/quiz/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz');
        }
        const data = await response.json();
        setQuizData(data);
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error('Error fetching quiz:', error);
        navigate('/quiz-list'); // Redirect to quiz list if fetch fails
      }
    };

    fetchQuiz();
  }, [id, navigate]);

  // Check if username exists in local storage upon component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      setShowUsernameModal(true); // Show UsernameModal if no username found
    }
  }, []);

  // Effect to start a new timer whenever currentQuestionIndex changes
  useEffect(() => {
    if (quizStarted) {
      setTimer(60); // Reset timer to 60 seconds for each new question
      setTimerExpired(false);

      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown); // Clear interval on cleanup
    }
  }, [currentQuestionIndex, quizStarted]);

  // Effect to handle timer expiration
  useEffect(() => {
    if (timer === 0 && !timerExpired && quizStarted) {
      handleNextQuestion();
      setTimerExpired(true);
    }
  }, [timer, timerExpired, quizStarted]);

  const handleOptionChange = (e) => {
    setSelectedOption(Number(e.target.value));
  };

  const handleNextQuestion = () => {
    const updatedAnswers = [...userAnswers, selectedOption];
    setUserAnswers(updatedAnswers);

    if (!quizData || currentQuestionIndex >= quizData.questions.length - 1) {
      // If quizData is null or at the end of questions array, navigate to result
      const score = updatedAnswers.reduce(
        (acc, answer, index) => (answer === quizData.questions[index].answer ? acc + 1 : acc),
        0
      );
      navigate(`/result?score=${score}&totalQuestions=${quizData.questions.length}&title=${quizData.title}`);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Clear selected option for next question
    }
  };

  const startQuiz = () => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setQuizStarted(true);
    } else {
      setShowUsernameModal(true); // Show UsernameModal if no username found
    }
  };

  // Function to handle username submission
  const handleUsernameSubmit = async (username) => {
    try {
      // Send username to backend API
      const response = await fetch('https://quizwebbackend.vercel.app/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      const data = await response.json();
      localStorage.setItem('username', data.username);
      setShowUsernameModal(false); // Hide UsernameModal after successful submission
    } catch (error) {
      console.error('Error creating user', error);
      alert('Failed to create user. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!quizData) {
    return <div className="quiz-container">Failed to load quiz. Please try again later.</div>;
  }

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">{quizData.title}</h2>
      {!quizStarted && (
        <button onClick={startQuiz} className="start-button">
          Start Quiz
        </button>
      )}
      {quizStarted && (
        <div className="question-container">
          <p className="question-text">
            <strong>Question {currentQuestionIndex + 1}:</strong>  {quizData.questions[currentQuestionIndex].question}
            
            {quizData.questions[currentQuestionIndex].inputType === 'code' ? (
              <SyntaxHighlighter language={quizData.questions[currentQuestionIndex].language} style={darcula}>
                {quizData.questions[currentQuestionIndex].codeSnippet}
              </SyntaxHighlighter>
            ) : (
              ""
            )}
          </p>
          <div className="options-container">
            {quizData.questions[currentQuestionIndex].options.map((option, index) => (
              <label key={index} className="option-label">
                <input
                  type="radio"
                  name="option"
                  value={index}
                  checked={selectedOption === index}
                  onChange={handleOptionChange}
                  className="option-input"
                />
                <span className="option-text">{option}</span>
              </label>
            ))}
          </div>
          <p className="timer-text">Time left: {timer} seconds</p>
          <button onClick={handleNextQuestion} className="quiz-button">
            {currentQuestionIndex < quizData.questions.length - 1 ? 'Next' : 'Submit'}
          </button>
        </div>
      )}
      {/* Show UsernameModal if showUsernameModal is true */}
      {showUsernameModal && <UsernameModal onSubmit={handleUsernameSubmit} />}
    </div>
  );
}

export default Quiz;

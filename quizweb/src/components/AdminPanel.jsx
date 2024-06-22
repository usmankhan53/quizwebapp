import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AdminPanel.css'; // Import the CSS file for styling

function AdminPanel() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentOptions, setCurrentOptions] = useState(['', '', '', '']);
  const [currentAnswer, setCurrentAnswer] = useState(0);
  const [category, setCategory] = useState(''); // New state for category
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzesPerPage] = useState(5); // Number of quizzes per page

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin-login');
    } else {
      loadQuizzes();
    }
  }, [navigate]);

  useEffect(() => {
    // Filter quizzes based on search term whenever it changes
    if (searchTerm.trim() !== '') {
      const filtered = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuizzes(filtered);
    } else {
      setFilteredQuizzes(quizzes);
    }
  }, [searchTerm, quizzes]);

  const loadQuizzes = async () => {
    try {
      const response = await fetch(`https://quizwebbackend.vercel.app/quizzes`);
      const data = await response.json();
      setQuizzes(data);
      setFilteredQuizzes(data); // Initialize filtered quizzes with all quizzes
    } catch (error) {
      console.error('Error loading quizzes', error);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: currentQuestion, options: currentOptions, answer: currentAnswer },
    ]);
    setCurrentQuestion('');
    setCurrentOptions(['', '', '', '']);
  };

  const handleSaveQuiz = async () => {
    try {
      const response = await fetch(`https://quizwebbackend.vercel.app/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, category, questions }), // Include category in the request body
      });
      if (response.ok) {
        setTitle('');
        setCategory(''); // Reset category state
        setQuestions([]);
        loadQuizzes(); // Reload quizzes to update the list
      } else {
        console.error('Error saving quiz', response.statusText);
      }
    } catch (error) {
      console.error('Error saving quiz', error);
    }
  };

  const handleDeleteQuiz = async (id) => {
    try {
      const response = await fetch(`https://quizwebbackend.vercel.app/quiz/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        loadQuizzes(); // Reload quizzes to update the list
      } else {
        console.error('Error deleting quiz', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting quiz', error);
    }
  };

  // Pagination
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = filteredQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h2 className="heading">Create a Quiz</h2>
     
      <div className="input-container">
        <label htmlFor="quizTitle">Quiz Title</label>
        <input
          type="text"
          id="quizTitle"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="question">Question</label>
        <input
          type="text"
          id="question"
          className="input"
          placeholder="Enter Question"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="options">Options</label>
        {currentOptions.map((option, index) => (
          <input
            key={index}
            type="text"
            className="input"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) =>
              setCurrentOptions(currentOptions.map((opt, i) => (i === index ? e.target.value : opt)))
            }
          />
        ))}
      </div>
      <div className="input-container">
        <label htmlFor="answer">Correct Answer</label>
        <select
          id="answer"
          className="input"
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(Number(e.target.value))}
        >
          {currentOptions.map((_, index) => (
            <option key={index} value={index}>
              {`Option ${index + 1}`}
            </option>
          ))}
        </select>
      </div>
      <button className="btn-add" onClick={handleAddQuestion}>Add Question</button>
      <button className="btn-save" onClick={handleSaveQuiz}>Save Quiz</button>
      <h2>Manage Quizzes</h2>
       {/* Search Bar */}
       <div className="input-container">
        <label htmlFor="search">Search Quiz</label>
        <input
          type="text"
          id="search"
          className="input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title..."
        />
      </div>
      {currentQuizzes.length === 0 ? (
        <p>No quizzes created yet.</p>
      ) : (
        <div>
          {currentQuizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              <h3 className="quiz-title">{quiz.title}</h3>
              <div className="quiz-actions">
                <button className="button" onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button>
              </div>
            </div>
          ))}
          {/* Pagination */}
          <ul className="pagination">
            {Array.from({ length: Math.ceil(filteredQuizzes.length / quizzesPerPage) }, (_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;

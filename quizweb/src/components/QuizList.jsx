import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/QuizList.module.css'; // Adjust the path as per your project structure
import UsernameModal from './UsernameModal';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzesPerPage] = useState(5); // Number of quizzes per page

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('https://quizwebbackend.vercel.app/quizzes');
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }
        const data = await response.json();
        setQuizzes(data);
        setIsLoading(false);
        extractCategories(data);
      } catch (error) {
        console.error('Error fetching quizzes', error);
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    const isAdminStorage = localStorage.getItem('isAdmin');
    setIsAdmin(isAdminStorage === 'true');
  }, []);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      setShowUsernameModal(true);
    }
  }, []);

  const extractCategories = (data) => {
    const allCategories = data.reduce((categories, quiz) => {
      if (!categories.includes(quiz.category)) {
        categories.push(quiz.category);
      }
      return categories;
    }, []);
    setCategories(allCategories);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUsernameSubmit = async (username) => {
    try {
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
      setShowUsernameModal(false);
    } catch (error) {
      console.error('Error creating user', error);
      alert('Failed to create user. Please try again.');
    }
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || quiz.category === selectedCategory)
  );

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = filteredQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredQuizzes.length / quizzesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles['quiz-list-container']}>
      <h2 className={styles['quiz-list-title']}>QUIZ BYTE</h2>

      <div className={styles['search-bar']}>
        <input
          type="text"
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles['search-input']}
        />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className={styles['category-select']}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <Link to="/dashboard" className={styles['dashboard-link']}>
        Go to Dashboard
      </Link>

      {isLoading && (
        <div className={styles['loading-container']}>
          <div className={styles['loading-ios']}></div>
        </div>
      )}

      {!isLoading && (
        <div>
          {currentQuizzes.length === 0 ? (
            <p className={styles['no-results-message']}>No quizzes created yet</p>
          ) : (
            <ul className={styles['quiz-list']}>
              {currentQuizzes.map((quiz) => (
                <li key={quiz._id} className={styles['quiz-item']}>
                  <Link to={`/quiz/${quiz._id}`} className={styles['quiz-link']}>
                    {quiz.title}
                    <span className={styles['question-count']}>
                      {quiz.questions.length} {quiz.questions.length === 1 ? 'question' : 'questions'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination */}
          <ul className={styles['pagination']}>
            {pageNumbers.map(number => (
              <li key={number} className={styles['page-item']}>
                <button
                  onClick={() => paginate(number)}
                  className={`${styles['page-link']} ${number === currentPage ? styles['active'] : ''}`}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isAdmin && (
        <Link to="/admin" className={styles['create-quiz-link']}>
          Create a New Quiz
        </Link>
      )}

      {showUsernameModal && <UsernameModal onSubmit={handleUsernameSubmit} />}
    </div>
  );
}

export default QuizList;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Dashboard.module.css';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [quizSumScores, setQuizSumScores] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzesPerPage] = useState(5); // Number of quizzes per page
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData(username) {
      try {
        const response = await fetch('https://quizwebbackend.vercel.app/user');
        const users = await response.json();
        const user = users.find((user) => user.username === username);
        return user;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    }

    const username = localStorage.getItem('username'); // Assuming username is stored in localStorage

    if (username) {
      fetchUserData(username)
        .then((user) => {
          if (user) {
            setUserData(user);

            // Calculate sum scores for quizzes
            const scores = {};
            user.quizResultsArray.forEach((quiz) => {
              const { title, score, totalQuestions } = quiz;
              if (!scores[title]) {
                scores[title] = { sumScore: score, totalQuestions };
              } else {
                scores[title].sumScore += score;
              }
            });
            setQuizSumScores(scores);

            // Calculate total score across all quizzes
            const total = Object.values(scores).reduce((acc, { sumScore }) => acc + sumScore, 0);
            setTotalScore(total);
            setLoading(false); // Set loading to false once data is fetched
          }
        })
        .catch((error) => {
          console.error('Error fetching and processing user data:', error);
          setLoading(false); // Set loading to false in case of error
        });
    }
  }, []);

  if (!userData) {
    return <div className={styles.dashboard}>Loading...</div>;
  }

  // Filter quizzes based on search term
  const filteredQuizzes = Object.entries(quizSumScores).filter(([quizTitle]) =>
    quizTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = filteredQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Page numbers array for pagination
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredQuizzes.length / quizzesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.greeting}>Hey {userData.username},</div>
        <div className={styles.buttons}>
          <button className={styles['dashboard-button']} onClick={() => navigate('/')}>
            Go Home
          </button>
          <button className={styles['dashboard-button']} onClick={() => navigate('/leaderboard')}>
            Leaderboard
          </button>
        </div>
      </div>
      <div className={styles['total-score']}>
        <h2>Total Score</h2>
        <div>{totalScore}</div>
      </div>
      <div className={styles['search-bar']}>
        <input
          type="text"
          placeholder="Search by Quiz Title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className={styles.note}>
        Note: If your quiz score is greater than the total questions, it indicates multiple attempts.
      </div>
      <div className={styles['quiz-scores']}>
        <h2>Quiz Scores</h2>
        {filteredQuizzes.length === 0 && <div className={styles['no-results']}>No quizzes found for "{searchTerm}"</div>}
        <table>
          <thead>
            <tr>
              <th>Quiz Title</th>
              <th>Total Questions</th>
              <th>Sum Score</th>
            </tr>
          </thead>
          <tbody>
            {currentQuizzes.map(([quizTitle, { sumScore, totalQuestions }]) => (
              <tr key={quizTitle}>
                <td>{quizTitle}</td>
                <td>{totalQuestions}</td>
                <td>{sumScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <ul className={styles.pagination}>
          {pageNumbers.map((number) => (
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
      {loading && <div className={styles.loading}>Loading...</div>}
    </div>
  );
}

export default Dashboard;

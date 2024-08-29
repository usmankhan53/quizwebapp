import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/LeaderBoard.module.css';

function LeaderBoard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6); // Number of users per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://quizwebbackend.vercel.app/user');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setLeaderboardData(data);
        setFilteredData(data); // Initialize filtered data with all users
        setLoading(false); // Data fetched, set loading to false
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Error occurred, set loading to false
      }
    };

    fetchData();
  }, []);

  // Function to calculate total score for a user
  const calculateTotalScore = (quizResultsArray) => {
    return quizResultsArray.reduce((total, quizResult) => total + quizResult.score, 0);
  };

  // Function to calculate rank based on total score
  const calculateRank = (data) => {
    // Sort leaderboardData by totalScore in descending order
    const sortedData = [...data].sort((a, b) => calculateTotalScore(b.quizResultsArray) - calculateTotalScore(a.quizResultsArray));
    
    // Assign ranks based on sorted order
    sortedData.forEach((user, index) => {
      user.rank = index + 1; // Rank starts from 1
    });

    return sortedData;
  };

  useEffect(() => {
    const sortedData = calculateRank(leaderboardData);
    setFilteredData(sortedData);
    
    // Get current user's username from local storage
    const currentUsername = localStorage.getItem('username');
    const currentUser = sortedData.find(user => user.username === currentUsername);
    if (currentUser) {
      setCurrentUserRank(currentUser.rank);
    }
  }, [leaderboardData]);

  useEffect(() => {
    const sortedData = searchTerm === ''
      ? calculateRank(leaderboardData)
      : calculateRank(leaderboardData.filter(user =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    
    setFilteredData(sortedData);
    setCurrentPage(1); // Reset current page to 1 on search term change
  }, [searchTerm, leaderboardData]);

  useEffect(() => {
    if (filteredData.length < (currentPage - 1) * usersPerPage) {
      setCurrentPage(1); // Reset current page if the current page is out of range
    }
  }, [filteredData, currentPage, usersPerPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className={styles.loader}></div>;
  }

  // Page numbers array for pagination
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  // Display a range of page numbers around the current page
  const visiblePageNumbers = pageNumbers.slice(
    Math.max(currentPage - 2, 0),
    Math.min(currentPage + 2, pageNumbers.length)
  );

  return (
    <div className={styles.leaderboardContainer}>
      <h2>Leaderboard</h2>
      <div className={styles.totalUsers}>
        Total Users: {leaderboardData.length}
        <div className={styles.statusCircle}></div>
      </div>
      {currentUserRank !== null && (
        <div className={styles.currentUserRank}>
          Your Rank: {currentUserRank}
        </div>
      )}
      <div className={styles.buttonsContainer}>
        <button onClick={() => navigate('/')} className={styles.navButton} aria-label="Go Home">Go Home</button>
        <button onClick={() => navigate('/dashboard')} className={styles.navButton} aria-label="Go Dashboard">Go Dashboard</button>
      </div>
      <input
        type="text"
        placeholder="Search by username"
        value={searchTerm}
        onChange={handleSearch}
        className={styles.searchBar}
        aria-label="Search by username"
      />
      <div className={styles.leaderboard}>
        <div className={styles.leaderboardHeader}>
          <div className={styles.column}>Rank</div>
          <div className={styles.column}>Username</div>
          <div className={styles.column}>Total Score</div>
        </div>
        {currentUsers.map((user) => (
          <div className={styles.leaderboardRow} key={user._id}>
            <div className={styles.column}>{user.rank}</div>
            <div className={styles.column}>{user.username}</div>
            <div className={styles.column}>{calculateTotalScore(user.quizResultsArray)}</div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <ul className={styles.pagination} aria-label="Pagination">
        {currentPage > 1 && (
          <li className={styles.pageItem}>
            <button
              onClick={() => paginate(currentPage - 1)}
              className={styles.pageLink}
              aria-label="Previous Page"
            >
              &laquo;
            </button>
          </li>
        )}
        {visiblePageNumbers.map((number) => (
          <li key={number} className={styles.pageItem}>
            <button
              onClick={() => paginate(number)}
              className={`${styles.pageLink} ${number === currentPage ? styles.active : ''}`}
              aria-label={`Page ${number}`}
            >
              {number}
            </button>
          </li>
        ))}
        {currentPage < pageNumbers.length && (
          <li className={styles.pageItem}>
            <button
              onClick={() => paginate(currentPage + 1)}
              className={styles.pageLink}
              aria-label="Next Page"
            >
              &raquo;
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default LeaderBoard;

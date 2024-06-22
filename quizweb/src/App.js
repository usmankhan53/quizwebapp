import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import Quiz from './components/Quiz';
import Result from './components/Result';
import QuizList from './components/QuizList';
import Dashboard from './components/Dashboard';
import LeaderBoard from './components/LeaderBoard';
import UsernameModal from './components/UsernameModal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuizList />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/leaderboard' element={<LeaderBoard/>}/>
      </Routes>
    </Router>
  );
}

export default App;

const QUIZZES_KEY = 'quizzes';
const RESULTS_KEY = 'results';

const getQuizzes = () => {
  const quizzes = localStorage.getItem(QUIZZES_KEY);
  return quizzes ? JSON.parse(quizzes) : [];
};

const saveQuiz = (quiz) => {
  const quizzes = getQuizzes();
  quiz.id = quizzes.length ? quizzes[quizzes.length - 1].id + 1 : 0;
  quizzes.push(quiz);
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
  return quiz.id;
};

const deleteQuiz = (quizId) => {
    const quizzes = getQuizzes();
    const updatedQuizzes = quizzes.filter((quiz) => quiz.id !== quizId);
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(updatedQuizzes));
  };
  

const getResults = () => {
    const results = localStorage.getItem(RESULTS_KEY);
    return results ? JSON.parse(results) : [];
  };
  

const saveResult = (quizTitle, score) => {
    const results = getResults();
    const newResult = { quizTitle, score, date: new Date().toISOString() };
    results.push(newResult);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  };
  

  export { getQuizzes, saveQuiz, deleteQuiz, getResults, saveResult };
  

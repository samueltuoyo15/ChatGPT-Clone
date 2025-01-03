import {useState, useEffect} from 'react';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Main from './pages/Main';
import NotFoundPage from './pages/NotFoundPage';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('isAuthenticated') === 'true');
   useEffect(() => {
    const Status = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(Status === 'true');
  },[]);
  
  return (
     <Router>
      <Routes>
     <Route path="/" element={<Main />}/>
     <Route path="/c/:id" element={<Main />} />
     <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated}/>} />
     <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated}/>} />
      <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
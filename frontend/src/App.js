import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import Myday from './Myday';
import Overdue from './Overdue';
import User from './images/user2.png';
import UserContext from './UserContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Uncompleted from './Uncompleted';
import Completed from './Completed';
import Settings from './Settings';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

function App() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/user', {withCredentials: true})
     .then(response => {
        setUsername(response.data.username);
      })
  });

  function logout() {
    axios.post('http://localhost:4000/logout', null, {withCredentials: true})
     .then(() => {
        setUsername('');
        window.location.href = '/';
      });
  }


  return (
    <UserContext.Provider value={{username, setUsername}}>
      <BrowserRouter>
          <nav className='loggedin'>
            {username? (
              <div className='sidenav'>
                <div className='user'>
                  <img src={User} alt='user' height={24} width={24} />
                  <h3>{username}</h3>
                </div>
                <div className='sidenav_links'>
                  <Link to="/">All Tasks</Link>
                  <Link to="/todays_tasks">My Day</Link>
                  <Link to="/overdue_tasks">Overdue</Link>
                  <Link to="/uncompleted_tasks">Uncompleted</Link>
                  <Link to="/completed_tasks">Completed</Link>
                  <Link to="/settings">Settings</Link>
                </div>
                <Link to="/logout" onClick={e => {e.preventDefault();logout();}}>
                  <button id='logout'>Logout</button>
                </Link>
              </div>
            )
          : (
            <>
            </>
            )}
          </nav>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/todays_tasks" element={<Myday />} />
            <Route path="/overdue_tasks" element={<Overdue />} />
            <Route path="/uncompleted_tasks" element={<Uncompleted />} />
            <Route path="/completed_tasks" element={<Completed />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
            <Route path='/reset-password/:token' element={<ResetPassword/>}/>
          </Routes>
        </main>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

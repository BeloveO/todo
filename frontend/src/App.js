import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import User from './images/user2.png';
import UserContext from './UserContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

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
      });
  }

  function upcoming_tasks() {
    return (
      <div>
        <h2>Upcoming Tasks</h2>
        {/* Render tasks */}
      </div>
    );
  }
  function completed_tasks() {
    return (
      <div>
        <h2>Completed Tasks</h2>
        {/* Render tasks */}
      </div>
    );
  }
  function overdue_tasks() {
    return (
      <div>
        <h2>Overdue Tasks</h2>
        {/* Render tasks */}
      </div>
    );
  }
  function settings() {
    return (
      <div>
        <h2>Settings</h2>
        {/* Render settings */}
      </div>
    );
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
                  <Link to="/" onClick={e => {e.preventDefault();}}>Tasks</Link>
                  <Link to="/upcoming_tasks" onClick={e => {e.preventDefault();upcoming_tasks();}}>
                    My Day
                  </Link>
                  <Link to="/overdue_tasks" onClick={e => {e.preventDefault();overdue_tasks();}}>
                    Planned
                  </Link>
                  <Link to="/completed_tasks" onClick={e => {e.preventDefault();completed_tasks();}}>
                    Completed Tasks
                  </Link>
                  <Link to="/settings" onClick={e => {e.preventDefault();settings();}}>
                    Settings
                  </Link>
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
          </Routes>
        </main>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

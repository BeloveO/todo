import { useState, useContext } from "react";
import axios from "axios";
import UserContext from './UserContext';
import { Navigate } from "react-router-dom";
import Password from './images/password.png';
import Account from './images/account.png';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const user = useContext(UserContext);

    function registerUser(e) {
        e.preventDefault();
        if (password!==confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        axios.post('http://localhost:4000/register', { username, email, password, confirmPassword }, {withCredentials: true})
           .then(response => {
                user.setUsername(response.data.username);
                setError('');
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setSuccess(true);
           });
    }
    if (success) {
        return <Navigate to="/" />;
    }

    return (
        <div className="wrapper">
            <h2>Register</h2>
            <form action="" onSubmit={e => registerUser(e)} id="form">
                <div>
                    <label for="name-input">
                        <img src={Account} height={24} width={24} alt="user" />
                    </label>
                    <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /> <br />
                </div>
                <div>
                    <label for="email-input">
                        <span>@</span>
                    </label>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /> <br />
                </div>
                <div>
                    <label for="password-input">
                        <img src={Password} height={24} width={24} alt="pass" />
                    </label>
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /> <br />
                </div>
                <div>
                    <label for="confirm-password-input">
                        <img src={Password} height={24} width={24} alt="pass" />
                    </label>
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /> <br />
                </div>
                <button type="submit">Register</button>
                {error && <p>{error}</p>}
                <p>Already have an account? <a href="/login">Login</a></p>
            </form>
        </div>
    );
}

export default Register;
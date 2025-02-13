import { useState, useContext } from "react";
import axios from "axios";
import UserContext from './UserContext';
import { Navigate } from "react-router-dom";
import Password from "./images/password.png";
import { Link } from "react-router-dom";


function Login() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const user = useContext(UserContext);

    function loginUser(e) {
        e.preventDefault();

        axios.post('http://localhost:4000/login', { email, password }, {withCredentials: true})
           .then(response => {
                user.setUsername(response.data.username);
                setError(false);
                setEmail('');
                setPassword('');
                setSuccess(true);
           })
           .catch(() => {
            setError(true);
           });
    }
    if (success) {
        return <Navigate to="/" />;
    }
    return (
        <div className="wrapper">
            <h2>Login</h2>
            <form action="" onSubmit={e => loginUser(e)} id="form">
                {error && (
                    <div>Login Error! Wrong email or Password</div>
                )}
                <div>
                    <label>
                        <span>@</span>
                    </label>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /> <br />
                </div>
                <div>
                    <label>
                        <img src={Password} height={24} width={24} alt="pass" />
                    </label>
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /> <br />
                </div>
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </form>
        </div>
    )
}

export default Login;
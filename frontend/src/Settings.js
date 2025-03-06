import { useState, useContext, useEffect } from "react";
import axios from "axios";
import UserContext from './UserContext';
import { Navigate } from "react-router-dom";
import Account from './images/account.png';


function Settings() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const user = useContext(UserContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newConfirmPassword, setNewConfirmPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [passwordMismatchError, setPasswordMismatchError] = useState('');
    const [accountMismatchError, setAccountMismatchError] = useState('');
    const [loading, setLoading] = useState(false);
    const [accountUpdated, setAccountUpdated] = useState(false);
    const [passwordUpdated, setPasswordUpdated] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:4000/settings', {withCredentials: true}, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            setUsername(res.data.username);
            setEmail(res.data.email);
            setCurrentPassword(res.data.currentPassword);
            setNewPassword('');
            setNewConfirmPassword('');
            setNewPasswordError('');
            setCurrentPasswordError('');
            setPasswordMismatchError('');
            setAccountMismatchError('');
        })
        axios.get('http://localhost:4000/user', {withCredentials: true})
            .then(response => {
                setUsername(response.data.username);
                setEmail(response.data.email);
            })
        .catch(err => console.error(err));
            setLoading(false);
            setAccountUpdated(false);
            setPasswordUpdated(false);
            setCurrentPassword('');
            setNewPassword('');
            setNewConfirmPassword('');
            setNewPasswordError('');
            setCurrentPasswordError('');
            setPasswordMismatchError('');
            setAccountMismatchError('');
    }, [])

    function updateAccount() {
        setLoading(true);
        setAccountMismatchError('');
        setAccountUpdated(false);
        axios.put('http://localhost:4000/user', {username, email}, {withCredentials: true})
           .then(() => {
                setAccountUpdated(true);
                setLoading(false);
            })
           .catch(err => {
                setAccountMismatchError('Failed to update account. Please try again.');
                setLoading(false);
            });
    }

    function updatePassword() {
        setLoading(true);
        setPasswordUpdated(false);
        setCurrentPasswordError('');
        setNewPasswordError('');
        setPasswordMismatchError('');

        // Validate new password and confirmation
        if (newPassword !== newConfirmPassword) {
            setPasswordMismatchError('New password and confirmation do not match.');
            setLoading(false);
            return;
        }
        axios.put(
            'http://localhost:4000/user/change_password', { currentPassword, newPassword }, { withCredentials: true })
            .then(() => {
                setPasswordUpdated(true);
                setLoading(false);
                setCurrentPassword('');
                setNewPassword('');
                setNewConfirmPassword('');
            })
            .catch(err => {
                if (err.response.status === 401) {
                    setCurrentPasswordError('Current password is incorrect.');
                } else {
                    setError('Failed to update password. Please try again.');
                }
                setLoading(false);
            });
    }

   
    return (
        <div className="settings">
            <h1>Settings</h1>
            <div className="account">
                <h2>Account Information</h2>
                <div className="account-details">
                    <img src={Account} alt="Account" />
                    <div className="details">
                        <div>
                            <label for="name-input">
                                <img src={Account} height={24} width={24} alt="user" />
                            </label>
                            <p>{username}</p>
                        </div>
                        <div>
                            <label for="email-input">
                                <span>@</span>
                            </label>
                            <p>{email}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h2>
                        Update Profile
                    </h2>
                    <h2>
                        Delete Account
                    </h2>
                </div>
                <div className="update-account">
                    <h2>Update Account Name</h2>
                    <label for="OUsername">Old Username</label> <br />
                    <input type="text" placeholder="Old Username" value={username} disabled /> <br />
                    <label for="NUsername">New Username</label> <br />
                    <input type="text" placeholder="New Username" onChange={(e) => setUsername(e.target.value)} /> <br />
                    <button onClick={updateAccount} disabled={loading}>Update</button>
                    {accountMismatchError && <p className="error">{accountMismatchError}</p>}
                    {accountUpdated && <p className="success">Account updated successfully.</p>}
                </div>
                <div className="password">
                    <h2>Change Password</h2>
                    <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <input type="password" placeholder="Confirm New Password" value={newConfirmPassword} onChange={(e) => setNewConfirmPassword(e.target.value)} />
                    <button onClick={updatePassword} disabled={loading}>Update</button>
                    {currentPasswordError && <p className="error">{currentPasswordError}</p>}
                    {passwordMismatchError && <p className="error">{passwordMismatchError}</p>}
                    {passwordUpdated && <p className="success">Password updated successfully.</p>}
                </div>
                {success && <Navigate to="/" replace />}
                {error && <p className="error">Failed to update settings. Please try again.</p>}
                {loading && <p>Loading...</p>}
            </div>
        </div>
    )

}

export default Settings;
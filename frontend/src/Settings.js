import { useState, useContext, useEffect } from "react";
import axios from "axios";
import UserContext from './UserContext';
import { Navigate, useNavigate } from "react-router-dom";
import Account from './images/account.png';


function Settings() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);
    const navigate = useNavigate();

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
        axios.get('http://localhost:4000/user', { withCredentials: true })
            .then(response => {
                setUsername(response.data.username);
                setEmail(response.data.email);
            })
            .catch(err => console.error(err));
    }, []);

     // Handle clicks outside the dropdown to close it
     useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.matches('.dropbtn') && dropdownVisible) {
                setDropdownVisible(false);
            }
        };

        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [dropdownVisible]);


    function updateAccount() {
        setLoading(true);
        setAccountMismatchError('');
        setAccountUpdated(false);
        axios.put('http://localhost:4000/user', { username }, { withCredentials: true })
            .then((response) => {
                setUsername(response.data.username);
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

    // Function to delete the user's profile
    function deleteProfile() {
        setLoading(true);
        setError('');

        // Confirm deletion with the user
        const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");
        if (!confirmDelete) {
            setLoading(false);
            return;
        }

        // Send a DELETE request to the backend
        axios.delete('http://localhost:4000/user', { withCredentials: true })
            .then(() => {
                setLoading(false);
                navigate('/register'); // Redirect to the register page after deletion
            })
            .catch(err => {
                setError('Failed to delete profile. Please try again.');
                setLoading(false);
            });
    }


    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    // Open and close the popup form
    const openForm = () => {
        setFormVisible(!formVisible);
    };

    const closeForm = () => {
        setFormVisible(false);
    };

    // Toggle password form visibility
    const togglePasswordForm = () => {
        setIsPasswordFormVisible(!isPasswordFormVisible);
    };

    const closePasswordForm = () => {
        setIsPasswordFormVisible(false);
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
                                <img src={Account} alt="user" />
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
                <div className="dropdown">
                    <button onClick={toggleDropdown} className="dropbtn">Update Profile</button>
                    <div id="myDropdown" className={`dropdown-content ${dropdownVisible ? 'show' : ''}`}>
                        <button className="open-button" onClick={openForm}>Change Username</button>
                        <button className="open-button" onClick={togglePasswordForm}>Change Password</button>
                    </div>
                    <button className="dropbtn" onClick={deleteProfile} disabled={loading}>Delete Profile</button>
                </div>
                

                {formVisible && (
                     <div className="form-popup" id="myForm">
                        <div className="update-account">
                            <h2>Update Account Name</h2>
                            <input type="text" placeholder="Input New Username" onChange={(e) => setUsername(e.target.value)} /> <br />
                            <button type="submit" className="btn" onClick={updateAccount} disabled={loading}>Update</button>
                            <button type="button" className="cancel" onClick={closeForm}>Close</button>
                            {accountMismatchError && <p className="error">{accountMismatchError}</p>}
                            {accountUpdated && <p className="success">Account updated successfully.</p>}
                        </div>
                    </div>
                )}
                {isPasswordFormVisible && (
                    <div className="form-popup" id="myForm">
                        <div className="update-account">
                            <h2>Change Password</h2>
                            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <input type="password" placeholder="Confirm New Password" value={newConfirmPassword} onChange={(e) => setNewConfirmPassword(e.target.value)} />
                            <button onClick={updatePassword} className="btn" disabled={loading}>Update</button>
                            <button type="button" onClick={closePasswordForm} className="cancel">Close</button>
                            {currentPasswordError && <p className="error">{currentPasswordError}</p>}
                            {passwordMismatchError && <p className="error">{passwordMismatchError}</p>}
                            {passwordUpdated && <p className="success">Password updated successfully.</p>}
                        </div>
                    </div>
                )}
                {success && <Navigate to="/" replace />}
                {error && <p className="error">Failed to update settings. Please try again.</p>}
                {loading && <p>Loading...</p>}
            </div>
        </div>
    )

}

export default Settings;
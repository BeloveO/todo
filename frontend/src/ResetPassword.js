import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams(); // Extract token from URL
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);


    // Password validation function
    const validatePassword = (password) => {
        const minLength = 6;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        if (password.length < minLength) {
            return "Password must be at least 6 characters long!";
        }
        if (!hasUppercase) {
            return "Password must contain at least one uppercase letter!";
        }
        if (!hasLowercase) {
            return "Password must contain at least one lowercase letter!";
        }
        if (!hasNumber) {
            return "Password must contain at least one number!";
        }
        if (!hasSpecialChar) {
            return "Password must contain at least one special character!";
        }
        return null; // No error
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        // Validate password constraints
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        try {
            const response = await axios.post(`http://localhost:4000/reset-password/${token}`, {
                password,
                confirmPassword,
            });

            if (response.data.message) {
                setSuccess(true);
                setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
            }
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password">
            <h1>Reset Password</h1>

            {success && (
                <div className="success-message">
                    <p>Your password has been reset successfully.</p>
                    <p>Redirecting to login page...</p>
                </div>
            )}

            {!success && (
                <form onSubmit={handleSubmit}>
                    {error && <p className="error">{error}</p>}
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default ResetPassword;
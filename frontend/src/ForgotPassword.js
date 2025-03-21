import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const forgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await axios.post('http://localhost:4000/forgot-password', { email });
            if (response.data.message) {
                setSuccess(true); // Show success message
            }
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password">
            {success && (
                <div className="success-message">
                    <p>A password reset link has been sent to your email.</p>
                    <Link to="/login">Back to Login</Link>
                </div>
            )}

            {!success && (
                <div className="forgot-password">
                    <form onSubmit={forgotPassword}>
                        <h1>Forgot Password</h1>
                        <p>Enter your email address to reset your password.</p>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Reset Password"}
                        </button>
                    </form>
                    <div className="links">
                        <p>Back to <Link to="/login">Login?</Link></p>
                        <p>Don't have an account? <Link to="/register">Register</Link></p>
                    </div>
                </div>
            )}

            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default ForgotPassword;
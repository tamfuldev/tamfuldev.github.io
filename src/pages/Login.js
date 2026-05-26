import React from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { auth } from '../configs/firebase';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/admin.css";

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await auth.signInWithEmailAndPassword(email, password);
            navigate('/admin');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);

        try {
            const provider = new firebase.auth.GoogleAuthProvider();

            await auth.signInWithPopup(provider);
            navigate('/admin/expense');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="admin-login-page">
            <section className="admin-login-card">
                <h2>Admin Login</h2>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <label>
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                            required
                        />
                    </label>

                    {error && <p className="admin-login-error">{error}</p>}

                    <button type="submit" className="admin-btn admin-btn-primary">
                        Login admin
                    </button>
                </form>

                {/* <div className="admin-login-divider">or</div> */}
{/* 
                <button type="button" className="admin-btn admin-btn-ghost admin-login-google" onClick={handleGoogleLogin}>
                    Login with Google for Expense
                </button> */}

                {/* <div className="admin-login-links">
                    <Link to="/admin/expense">Expense admin</Link>
                    <Link to="/admin/roadmap">Roadmap admin</Link>
                    <Link to="/blog">View public blog</Link>
                    <Link to="/">Back to portfolio</Link>
                </div> */}
            </section>
        </div>
    );
}

export default Login;

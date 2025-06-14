import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Login_Title from "../components/hoc/loc/Login_Title";
import { Link, useNavigate } from "react-router-dom";
import { RouterContainer } from "../routes/RouteContainer";
import { useState } from "react";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login Failed");
            }

            localStorage.setItem("token", data.token);
            navigate(RouterContainer.Homepage);
        } catch (err) {
            console.error("Login error", err);
        }
    }


    return (
        <>
            <div className="login_page">
                <Header />
                    <main className="main">
                        <div className="login-container">
                            <div className="login-card">
                                <header className="login-header">
                                    <Login_Title />
                                </header>
                                <form className="login-form" onSubmit={handleLogin} method="POST">
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        placeholder="your@email.com" 
                                        required
                                        aria-describedby="email-help"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="password">Password</label>
                                        <div className="password-input">
                                        <input 
                                            type="password" 
                                            id="password" 
                                            name="password" 
                                            placeholder="" 
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        </div>
                                    </div>

                                    <button type="submit" className="login-button">Log In</button>

                                    <div className="form-options">
                                        {/* Add functionallity */}
                                        <div className="forgot-password">Forgot password?</div>
                                    </div>

                                    
                                </form>

                                <footer className="login-footer">
                                    Don't have an account? 
                                    <div className="link"><Link to={RouterContainer.Register}>Sign Up</Link></div>
                                </footer>
                            </div>
                        </div>
                    </main>
                <Footer />
            </div>

        </>
    );
};

export default Login;
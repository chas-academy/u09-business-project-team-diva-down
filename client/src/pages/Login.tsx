import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Login_Title from "../components/hoc/loc/Login_Title";
import { Link } from "react-router-dom";
import { RouterContainer } from "../routes/RouteContainer";


const Login = () => {
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
                                {/* Put it into a sepearate function that then calls the backend API Call so it can be wrapped with a redirect function */}
                                <form className="login-form" action="/login" method="POST">
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        placeholder="your@email.com" 
                                        required
                                        aria-describedby="email-help"
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
                                    <Link to={RouterContainer.Register}>Sign Up</Link>
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
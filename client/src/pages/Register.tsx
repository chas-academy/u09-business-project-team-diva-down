import Header from "../components/common/header";
import Footer from "../components/common/footer";
import { Link } from "react-router-dom";
import Register_Title from "../components/hoc/loc/Register_Title";

const Register_Page = () => {
    return (
        <>
            <div className="Register_Page">
                <Header />
                    <main className="main">
                        <div className="login-container">
                            <div className="login-card">
                                <header className="login-header">
                                    <Register_Title />
                                </header>
                                <form className="login-form" action="/register" method="GET">
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input 
                                        type="name" 
                                        id="username" 
                                        name="username" 
                                        placeholder="John Doe" 
                                        required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        placeholder="your@email.com" 
                                        required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="password">Password</label>
                                        <div className="password-input">
                                        <input 
                                            type="password" 
                                            id="password" 
                                            name="password" 
                                            required
                                        />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="password">Password</label>
                                        <div className="password-input">
                                        <input 
                                            type="password" 
                                            id="confirm_password" 
                                            name="confirm_password" 
                                            required
                                        />
                                        </div>
                                    </div>
                                    

                                    <button type="submit" className="login-button">Register</button>
                                   
                                </form>
                            </div>
                        </div>
                    </main>
                <Footer />
            </div>
        </>
    );
};

export default Register_Page;
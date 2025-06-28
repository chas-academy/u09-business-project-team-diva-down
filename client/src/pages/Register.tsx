import Header from "../components/common/header";
import Footer from "../components/common/footer";
import { Link, useNavigate } from "react-router-dom";
import Register_Title from "../components/hoc/loc/Register_Title";
import { RouterContainer } from "../routes/RouteContainer";
import { useState } from "react";

interface NewUser {
    id: string,
    name: string,
    email: string,
    token: string;
}

const Register_Page = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [newUser, setNewUser] = useState<NewUser>();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            if (password != ConfirmPassword) {
                console.error("ConfirmPassword and Password doesn't match");
                return;
            }

            const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
            const apiUrl = isLocalhost 
                ? 'http://localhost:3000/register' 
                : 'https://u09-business-project-team-diva-down.onrender.com/register';

            const response = await fetch( apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: username,
                    email: email,
                    password: password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed!");
            }

            const authUser: NewUser = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                token: data.token
            };

            setNewUser(authUser);

            navigate(RouterContainer.Login);
        } catch (error) {
            console.error("Registration Error", error);
        }
    }

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
                                <form className="login-form" onSubmit={handleRegister} method="GET">
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input 
                                        type="name" 
                                        id="username" 
                                        name="username" 
                                        placeholder="John Doe" 
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
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
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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
                                            value={ConfirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        </div>
                                    </div>
                                    

                                    <button type="submit" className="login-button">Register</button>
                                   
                                </form>

                                <footer className="login-footer">
                                    Already got an account?
                                    <div className="link"><Link to={RouterContainer.Login}>Log in</Link></div>
                                </footer>
                            </div>
                        </div>
                    </main>
                <Footer />
            </div>
        </>
    );
};

export default Register_Page;
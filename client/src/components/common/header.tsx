import Register from "../hoc/loc/register_button";
import ChangeTheme from "../../common/Switch_Theme";

const Header = () => {
    return (
        <>
            <header className="navbar">
                <div className="logo">NEONIX</div>
                <ul className="navlinks">
                    <li>Home</li>
                    <li>Play</li>
                    <li>Categories</li>
                    <li>Leaderboard</li>
                    <li>About</li>
                </ul>
                <div className="button-container">
                    <button id="switch" className="switch" onClick={ChangeTheme}></button>
                    <button>Logins</button>
                    <Register />
                </div>
            </header>
        </>
    );
};

export default Header;
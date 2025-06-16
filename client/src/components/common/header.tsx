import Register from "../hoc/loc/register_button";
import { ChangeTheme } from "../../common/Switch_Theme";
import { useState } from "react";
import Login from "../hoc/loc/login_button";
import { Link } from "react-router-dom";
import { RouterContainer } from "../../routes/RouteContainer";
import { id } from "../../common/GenerateUserId";
import LogOut from "../hoc/loc/LogOut";

const Header = () => {

    const [transition, setTransition] = useState<'spin-forward' | 'spin-backward'>('spin-forward');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [Navbar, setNavMenu] = useState(false);
    const AuthToken = localStorage.getItem("token");

    const toggleNavMenu = () => {
        setNavMenu(!Navbar);
    };    

    const handleClick = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setTransition(prev => 
            prev === 'spin-forward' ? 'spin-backward' : "spin-forward"
        );

        const timeout = setTimeout(() => {
            setIsTransitioning(false);
        }, 600);

        return () => clearTimeout(timeout);
    };

    const handleTransitionEnd = () => {
        setIsTransitioning(false);
    };

    const handleCombinedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        handleClick();
        ChangeTheme(e);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("authUser");
        window.location.reload();
    }

    return (
        <>
            <header className="navbar">
                <div className="logo">NEONIX</div>

                {AuthToken ? (
                    <>
                        <ul className="navlinks">
                            <Link to={RouterContainer.Homepage}>Home</Link>
                            <Link to={RouterContainer.SinglePlayer}>Play</Link>
                            <Link to={RouterContainer.UserDashboard.replace(':id', id)}>Player Stats</Link>
                            <Link to={RouterContainer.CustomTrivia.replace(':id', id)}>Custom</Link>
                            <Link to={RouterContainer.Leaderboard}>Leaderboard</Link>
                        </ul>
                        <div className="button-container">
                            <button 
                                id="switch" 
                                className={`switch ${transition}`}
                                onClick={handleCombinedClick}
                                onTransitionEnd={handleTransitionEnd}
                                style={{ pointerEvents: isTransitioning ? 'none' : 'auto' }}
                            >
                            </button>
                            <span className="display_nav">
                                <button onClick={handleLogout}><LogOut /></button>
                            </span>
                            <div onClick={toggleNavMenu} id="nav_menu" className="hamburger_menu">
                                <div className="hamburger_bar"></div>
                                <div className="hamburger_bar"></div>
                                <div className="hamburger_bar"></div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <ul className="navlinks">
                            <Link to={RouterContainer.Homepage}>Home</Link>
                            <Link to={RouterContainer.SinglePlayer}>Play</Link>
                            <Link to={RouterContainer.UserDashboard.replace(':id', id)}>Player Stats</Link>
                            <Link to={RouterContainer.CustomTrivia.replace(':id', id)}>Custom</Link>
                            <Link to={RouterContainer.Leaderboard}>Leaderboard</Link>
                        </ul>
                        <div className="button-container">
                            <button 
                                id="switch" 
                                className={`switch ${transition}`}
                                onClick={handleCombinedClick}
                                onTransitionEnd={handleTransitionEnd}
                                style={{ pointerEvents: isTransitioning ? 'none' : 'auto' }}
                            >
                            </button>
                            <span className="display_nav">
                                <Link to={RouterContainer.Login}><Login/></Link>
                                <Link to={RouterContainer.Register}><Register/></Link>
                            </span>
                            <div onClick={toggleNavMenu} id="nav_menu" className="hamburger_menu">
                                <div className="hamburger_bar"></div>
                                <div className="hamburger_bar"></div>
                                <div className="hamburger_bar"></div>
                            </div>
                        </div>
                    </>
                )} 
                {Navbar === true && (
                    <>
                        <div className="mobile_nav_menu_container">
                            <div onClick={toggleNavMenu} className="cross-placement">
                                <div className="cross-container">
                                    <div className="cross-bar top"></div>
                                    <div className="cross-bar btm"></div>
                                </div>
                            </div>
                            <ul className="mobile_navlinks">
                                <Link to={RouterContainer.Homepage}>Home</Link>
                                <Link to={RouterContainer.SinglePlayer}>Play</Link>
                                <Link to={RouterContainer.UserDashboard.replace(':id', id)}>Player Stats</Link>
                                <Link to={RouterContainer.Leaderboard}>Leaderboard</Link>
                            </ul>
                        </div>
                    </>
                )}
            </header>
        </>
    );
};

export default Header;
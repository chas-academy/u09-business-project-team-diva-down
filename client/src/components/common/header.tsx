import Register from "../hoc/loc/register_button";
import { ChangeTheme } from "../../common/Switch_Theme";
import { useState } from "react";
import Login from "../hoc/loc/login_button";
import { Link } from "react-router-dom";
import { RouterContainer } from "../../routes/RouteContainer";

const Header = () => {

    const [transition, setTransition] = useState<'spin-forward' | 'spin-backward'>('spin-forward');
    const [isTransitioning, setIsTransitioning] = useState(false);

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
        ChangeTheme(e); // Passing the event to EChangeTheme where it's actually used
    };



    return (
        <>
            <header className="navbar">
                <div className="logo">NEONIX</div>
                <ul className="navlinks">
                    <li>Home</li>
                    <Link to={RouterContainer.SinglePlayer}>Play</Link>
                    <li>Categories</li>
                    <li>Leaderboard</li>
                    <li>About</li>
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
                    <Login />
                    <Register />
                </div>
            </header>
        </>
    );
};

export default Header;
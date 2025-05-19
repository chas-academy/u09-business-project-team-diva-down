import Register from "../hoc/loc/register_button";
import { ChangeTheme } from "../../common/Switch_Theme";
import { useState } from "react";

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
                    <li>Play</li>
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
                    <button>Logins</button>
                    <Register />
                </div>
            </header>
        </>
    );
};

export default Header;
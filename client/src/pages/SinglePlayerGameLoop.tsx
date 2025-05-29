import Header from "../components/common/header";
import Footer from "../components/common/footer";
import { useState } from "react";
import SinglePlayer_title from "../components/hoc/loc/SinglePlayer_title";
import SettingsCard from "../components/common/gameloop/settings_card";


type GameState = 'prep' | 'playing' | 'finished';

const SingePlayerGameLoop: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('prep');

    return (
        <> 
            <div id="container" className="SinglePlayerGameLoop">
                <Header />
                <main className="main">
                    {/* Here is where all the prep elements will be before the game starts */}
                    {gameState === 'prep' && (
                        <>
                        <section className="title-section">
                            <SinglePlayer_title />
                        </section>
                        <SettingsCard />
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
};

export default SingePlayerGameLoop;
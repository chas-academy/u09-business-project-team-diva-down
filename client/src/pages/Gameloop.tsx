import Header from "../components/common/header";
import Footer from "../components/common/footer";
import { useState } from "react";
import Countdown from "../components/common/CountDownTimer";
import ChangeGameState from "../components/hoc/loc/TestingGameComp/ChangeGameState";
import ResetTimerState from "../components/hoc/loc/Reset_Btn";
import InsertData from "../components/TestComponents/InsertData";
import AnswerCard from "../components/common/Answer_Card";

type GameState = 'start' | 'playing' | 'finished';

const Gameloop: React.FC = () => {
    const [resetKey, setResetKey] = useState(0);
    const [gameState, setGameState] = useState<GameState>('start');

    const handleReset = () => {
        setResetKey(prev => prev + 1);
    };

    function Change() {
        setGameState(prev => {
            switch (prev) {
                case 'start':
                    return 'playing';
                case 'playing':
                    return 'finished';
                case 'finished':
                    return 'start';
                default:
                    return prev;
            }
        });
    }

    return (
        <>
            <div id="container" className="GameLoop">
                <Header />
                <main className="main">
                <ChangeGameState onClick={Change}/>
                    {gameState === 'start' && (
                        <div style={{color: 'white'}}>Hello</div>
                    )}
                    {gameState == 'playing' && (
                        <>
                        <div className="progress">Progress</div>
                        <Countdown key={resetKey} />
                        <ResetTimerState onClick={handleReset}/>
                        <InsertData name="Steven"/>
                        <AnswerCard />
                        </>
                    )}
                    {gameState === 'finished' && (
                        <div style={{color: 'white'}}>GoodBye</div>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Gameloop;
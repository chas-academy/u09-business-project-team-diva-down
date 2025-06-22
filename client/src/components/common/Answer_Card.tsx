import Countdown from "./CountDownTimer";
import { useState } from "react";

const AnswerCard = () => {

    const [resetKey, setResetKey] = useState(0);

    const handleReset = () => {
        setResetKey(prev => prev + 1);
    };

    {/* <div className="timer"><Countdown key={resetKey}/></div> */}
    // <div className="submit"><button className="submit_box" onClick={handleReset}>Reset Timer</button></div>

    return (
        <>
            <div className="game-screen">
                <div className="game-info">
                    <div className="question">
                        Question
                    </div>
                    <div className="timer">
                        <Countdown key={resetKey}/>
                    </div>
                </div>
                <div className="game-settings">
                    <div className="category">
                        History
                    </div>
                    <div className="difficulty">
                        Medium Difficulty
                    </div>
                </div>
                <div className="question-text">
                    What is the largets organ in the human body?
                </div>
                <div className="answer-options">
                    <div className="answer-button">Liver</div>
                    <div className="answer-button">Skin</div>
                    <div className="answer-button">Brain</div>
                    <div className="answer-button">Large Intstine</div>
                </div>
                <div className="next-button-container">
                    <div className="next-button" onClick={handleReset}>
                        Submit answer
                    </div>
                </div>
            </div>
        </>
    );
};

export default AnswerCard;
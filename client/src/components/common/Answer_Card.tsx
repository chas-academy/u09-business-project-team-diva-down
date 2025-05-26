import Countdown from "./CountDownTimer";
import { useState } from "react";

const AnswerCard = () => {

    const [resetKey, setResetKey] = useState(0);

    const handleReset = () => {
        setResetKey(prev => prev + 1);
    };

    return (
        <>
            <div className="answer-container">
                <div className="timer"><Countdown key={resetKey}/></div>
                <div className="question"><div className="question_box"></div></div>
                <div className="option1"><div className="option_answer"></div></div>
                <div className="option2"><div className="option_answer"></div></div>
                <div className="option3"><div className="option_answer"></div></div>
                <div className="option4"><div className="option_answer"></div></div>
                <div className="submit"><button className="submit_box" onClick={handleReset}>Reset Timer</button></div>
            </div>
        </>
    );
};

export default AnswerCard;
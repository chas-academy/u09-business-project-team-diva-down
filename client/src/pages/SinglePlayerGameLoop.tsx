import Header from "../components/common/header";
import Footer from "../components/common/footer";
import { useState } from "react";
import SinglePlayer_title from "../components/hoc/loc/SinglePlayer_title";
import SettingsCard from "../components/common/gameloop/settings_card";
import axios from "axios";
import Countdown from "../components/common/CountDownTimer";
import Home_button from "../components/hoc/loc/Home_button";
import PlayAgain from "../components/hoc/loc/PlayAgain";
import { Link } from "react-router-dom";
import { RouterContainer } from "../routes/RouteContainer";

type GameState = 'prep' | 'playing' | 'finished';

interface selectedOption {
    value: string;
    label: string;
}

type Questions = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
  difficulty: string;
  category: string;
};

const SingePlayerGameLoop: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('prep');
    const [selectedCategory, setSelectedCategory] = useState<selectedOption>({
        value: '',
        label: 'Select Category'
    });
    const [difficulty, setDifficulty] = useState("");
    const [ranked, setRanked] = useState("");
    const [questions, setQuestions] = useState<Questions[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const changeGameState = () => {
        setGameState(prev => {
            switch (prev) {
                case 'prep':
                    return 'playing';
                case 'playing':
                    return 'finished';
                case 'finished':
                    return 'prep';
                default:
                    return prev;
            }
        });
    };

    // for debugging purpose
    // function checkStatus() {
    //     console.log(score);
    //     console.log();
    // };

    const shuffleArray = (array: any[]): any[] => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    const StartGame = async (): Promise<void> => {
        if (selectedCategory.value === '' || difficulty === '') {
            return;
        } else {
            try {
                const custom_apicall = `https://opentdb.com/api.php?amount=10&category=${selectedCategory.value}&difficulty=${difficulty}&type=multiple`;
                const response = await axios.get(custom_apicall);
                const formattedQuestions = response.data.results.map((q: any) => ({
                    ...q,
                    all_answers: shuffleArray([...q.incorrect_answers, q.correct_answer])
                }));
                setQuestions(formattedQuestions);
                setCurrentQuestionIndex(0);
                setScore(0);
                console.log(response);
                console.log(custom_apicall);
                changeGameState();
            } catch (err) {
                console.error('Couldnt fetch the questions, please try again!', err)
            };
        };
    };

    const handleAnswerSelect = (answer: string): void => {
        if (selectedAnswer) return;
        setSelectedAnswer(answer);

        if (answer === questions[currentQuestionIndex].correct_answer) {
            setScore((prev) => prev + 1);
        }
    }

    const handleNextQuestion = (): void => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedAnswer(null);
        } else {
            setGameState('finished');
        }
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <> 
            <div className="SinglePlayerGameLoop">
                <Header />
                <main className="main">
                    {gameState === 'prep' && 
                        <>
                        <section className="title-section">
                            <SinglePlayer_title />
                        </section>
                        {/* <div style={{color: '#FAFAFA'}} onClick={checkStatus}>Hello</div> */}
                        <SettingsCard 
                            selectedOption={selectedCategory}
                            onOptionChange={setSelectedCategory}
                            onDifficutlyChange={setDifficulty}
                            onRankedChange={setRanked}
                            difficulty={difficulty}
                            ranked={ranked}
                            checkStatus={StartGame}
                        />
                        </>
                    }
                    {gameState === 'playing' && currentQuestion && (
                        <>
                            <div className="game-screen">
                                <div className="game-info">
                                    <div className="question">
                                        Question {currentQuestionIndex + 1}/{questions.length}
                                    </div>
                                    <div className="timer">
                                        <Countdown />
                                    </div>
                                </div>

                                <div className="game-settings">
                                    <div className="category">
                                        {decodeURIComponent(currentQuestion.category)}
                                    </div>
                                    <div className="difficulty">
                                        Difficulty <span className="capitalize">{decodeURIComponent(currentQuestion.difficulty)}</span>
                                    </div>
                                </div>
                                <div className="question-text">
                                    {decodeURIComponent(currentQuestion.question)}
                                </div>
                                <div className="answer-options">
                                    {currentQuestion.all_answers.map((answer, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerSelect(answer)}
                                            className={`answer-button ${
                                                selectedAnswer === answer
                                                ? answer === currentQuestion.correct_answer
                                                    ? 'correct'
                                                    : 'incorrect'
                                                : ''
                                            } ${
                                                selectedAnswer && answer === currentQuestion.correct_answer
                                                ? 'correct-answer'
                                                : ''
                                            }`}
                                            disabled={!!selectedAnswer}
                                        >
                                            {decodeURIComponent(answer)}
                                        </button>
                                    ))}
                                </div>
                                <div className="next-button-container">
                                    {selectedAnswer && (
                                        <button onClick={handleNextQuestion} className="next-button">
                                            {currentQuestionIndex < questions.length - 1
                                                ? 'Next'
                                                : 'See Result'
                                            }
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    {gameState === 'finished' && (
                        <>
                            <div className="score_card">
                                <h2 className="title">Quiz Completed!</h2>
                                <div className="score">{score}/{questions.length} </div>
                                {10 + (score - questions.length) >= 9 && (
                                    <div className="congrats-text">Excellent Work! You're a trivia master!</div>
                                )}
                                {10 + (score - questions.length) >= 4 && questions.length - score < 10 && (
                                    <div className="congrats-text">Great Work! You did good!</div>
                                )}
                                {10 + (score - questions.length) < 4 && (
                                    <div className="congrats-text">You tried your best! And that's what counts!</div>
                                )}
                                <div className="stats">
                                    <div className="stats-bar"><span>Correct Answers: </span><span>{score}</span></div>
                                    <div className="stats-bar"><span>Incorrect Answers: </span><span>{questions.length - score}</span></div>
                                    <div className="stats-bar none"><span>Skipped Answers: </span><span>In Waiting</span></div>
                                </div>
                                <div className="button-container">
                                    <Link to={RouterContainer.Homepage}><Home_button /></Link>
                                    <PlayAgain onClick={changeGameState}/>
                                </div>
                            </div>
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
};

export default SingePlayerGameLoop;
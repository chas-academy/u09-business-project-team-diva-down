import { useState, useEffect, useRef, useCallback } from "react";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import { useLocation, Link } from "react-router-dom";
import CustomMultiplayerSettings from "../components/common/gameloop/custom_multiplayer_settings_card";
import MultiPlayer_title from "../components/hoc/loc/MultiPlayer_title";
import { ActiveClientsLobby } from "../components/common/mutliplayer-Custom-Comp/Lobby_Active_Clients_card";
import { AuthUserLobbyCard } from "../components/common/mutliplayer-Custom-Comp/Lobby_AuthUser_card";
import SendInviteCard from "../components/common/mutliplayer-Custom-Comp/SendInvite_Card";
import Invitation_title from "../components/hoc/loc/Invitation_title";
import Lobby_title from "../components/hoc/loc/Lobby_title";
import ReciveInvitationscard from "../components/common/mutliplayer-Custom-Comp/ReciveInvitations_card";
import { v4 as uuidv4 } from "uuid";
import FullClientLobbyDisplay from "../components/common/mutliplayer-Custom-Comp/Full_Client_Lobby_Display_card";
// import { MockDataGameLoop } from "../MockData/MockDataGameLoop";
import Countdown from "../components/common/CountDownTimer";
import Home_button from "../components/hoc/loc/Home_button";
// import PlayAgain from "../components/hoc/loc/PlayAgain";
import { RouterContainer } from "../routes/RouteContainer";
import LobbyScoreBoardCard from "../components/common/gameloop/Lobby_ScoreBoard";
import axios from "axios";

// Fetching Trivia ID from the redirect to this page

interface LocationState {
    TriviaId: string;
}

// Interfaces, Const and UseEffect for fetching the Auth Users data -----------------

interface AuthUser {
    id: string;
    email: string;
    name: string;
    token: string;
}

// -------------------------------------------------------------------------------

interface Client {
    id: string;
    username: string;
    ready: boolean;
    isHost?: boolean;
    lobbyId?: string;
}

interface LobbyInfo {
    id: string;
    name: string;
    hostId: string;
    clientCount: number;
    isHost: boolean;
}

interface Invitation {
    id: string;
    from: string;
    lobbyId: string;
    lobbyName: string;
    timestamp: Date;
}

// Gameloop interfaces and types

type GameState = 'prep' | 'playing' | 'finished';

// interface selectedOption {
//     value: string;
//     label: string;
// }

type Questions = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
  difficulty: string;
  category: string;
}

interface FinalScore {
    skippedQuestions: number;
    correctAnswered: number;
    InCorrectAnswered: number;
}

interface LobbyScoreBoard {
    UserId: string;
    name: string;
    skippedQuestions: number;
    correctAnswered: number;
    InCorrectAnswered: number;
    placement?: number;
}

interface TriviaData {
  _id: string;
  userId: string;
  title: string;
  data: {
    results: Questions[];
  };
  createdAt?: string;
  updatedAt?: string;
}

const CustomMultiplayer: React.FC = () => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const baseWsUrl = import.meta.env.VITE_WS_URL;
    const [LobbyTriviaData, setLobbyTriviaData] = useState<TriviaData | null>(null);
    const [LobbyScoreBoard, setLobbyScoreBoard] = useState<LobbyScoreBoard[]>([]);
    const [gameState, setGameState] = useState<GameState>('prep');
    const [questions, setQuestions] = useState<Questions[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [resetKey, setResetKey] = useState(0);
    const [_remainingTime, setRemainingTime] = useState<number>(30);
    const hasTimeExpired = useRef(false);
    const [skippedQuestions, setSkippedQuestions] =  useState<number>(0);
    const [ranked, setRanked] = useState<string>('');
    const [_finalScore, setFinalScore] = useState<FinalScore>();
    const [placements, setPlacements] = useState<{
        sortedData: LobbyScoreBoard[];
        placementsMap: Record<string, number>;
        authUserPlacement?: number;
    } | null>(null);;
    const placementsRef = useRef(placements);
    //------ GameState const above --------//
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);
    const AuthUserName = authUser?.name;
    const location = useLocation();
    const { TriviaId } = location.state as LocationState | null || {};
    // const state = location.state as LocationState; // TrivaID regarding the mockData questions
    const [lobbyStatus, setLobbyStatus] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const ws = useRef<WebSocket | null>(null);
    const [_lobbies, setLobbies] = useState<LobbyInfo[]>([]);
    const [clients, setClients] = useState<Client[]>([]); // Specific For Lobby, if no lobby found, then all clients,
    const [allClients, setAllClients] = useState<Client[]>([]);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [isWsReady, setIsWsReady] = useState<boolean>(false);
    const [GuestConnect, setGuestConnect] = useState<boolean>(false);
    const [allClientsReady, setAllClientsReady] = useState<boolean>(false);
    const [currentLobby, setCurrentLobby] = useState<{
        id: string;
        name: string;
        isHost: boolean;
    } | null>(null);

    // UseEffects
    useEffect(() => {

        const user = JSON.parse(localStorage.getItem("userDataWithToken") ||'[]');

        if (!user) {
            return;
        }

        const NewAuthUser: AuthUser = {
            id: user.user.id,
            name: user.user.name,
            email: user.user.email,
            token: user.token
        }

        setAuthUser(NewAuthUser);

    }, []);

    useEffect(() => {

        if (!TriviaId) {
            return;
        }

        FetchSpecificTriviaTable(TriviaId);

    }, [TriviaId]);

    useEffect(() => {
        if (ws.current && isConnected) {
            ws.current.send(JSON.stringify({
                type: 'ready',
                ready: false,
                clientId: authUser?.id
            }));
        }
    }, [isConnected]);

    // Connect to the Websocket Server
    
    useEffect(() => {
        if (GuestConnect === true && !isConnected) {
            connect();
        }
        if (GuestConnect === false && !isConnected) {
            disconnect();
        }
    })

    useEffect(() => {
        if (lobbyStatus === "open" && !isConnected) {
            console.log("Open");
            connect();
        }
        if (lobbyStatus === 'close' && isConnected) {
            console.log("Closed");
            disconnect();
        }

    }, [lobbyStatus, isConnected])

    useEffect(() => {
        if (isWsReady && lobbyStatus === "open" && !currentLobby) {
            createLobby();
        }
    }, [isWsReady, lobbyStatus, currentLobby]);

    useEffect(() => {

        const allReady = clients.length > 0 && clients.every(client => client.ready);
        setAllClientsReady(allReady);

    }, [clients])

    useEffect(() => {
        
        if (gameState === 'finished') {
            if (authUser) {
                const timer = setTimeout(() => {
                    UpdateTotalMatches(authUser.id);
                }, 1000);

                return () => clearTimeout(timer);
            }
        }
        
    }, [gameState, placements, authUser]);

    const UpdateTotalMatches = async(currentUserId: string) => {
        try {
            if (!currentUserId) {
                return;
            }

            const AuthUserPlacementData = placements?.sortedData.find((client) => client.UserId === authUser?.id);

            const response = await axios.get(`${baseUrl}/${currentUserId}`);
            const userData = response.data;

            let updatedData = {
                wins: (userData.wins || 0),
                total_matches: (userData.total_matches || 0) + 1
            };

            if (AuthUserPlacementData?.placement === 1) {
                updatedData = {
                    wins: (userData.wins || 0) + 1,
                    total_matches: (userData.total_matches || 0) + 1
                };
            }

            const updateResponse = await axios.put(
                `${baseUrl}/${currentUserId}`,
                updatedData
            );

            console.log(updateResponse);

        } catch (error) {
            console.error("Failed to update total matches", error);
        }
    }

    const connect = () => {

        ws.current = new WebSocket(`${baseWsUrl}`);

        ws.current.onopen = () => {
            console.log('connected to Webscoket Server!');

            const user = authUser;
            
            if (!user || !user.token) {
                console.error('No Authentication token found');
                disconnect();
                return;
            }

            const authMessage = JSON.stringify({
                type: 'auth',
                token: user?.token,
                id: user?.id,
                username: user?.name,
            })

            console.log('Sending Auth Message:', authMessage);
            ws.current?.send(authMessage);
            setIsConnected(true);
            setIsWsReady(true);
        }

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'lobbyCreated') {
                setCurrentLobby({
                    id: data.lobbyId,
                    name: data.lobbyName,
                    isHost: true
                });
            }
            else if (data.type === 'lobbyList') {
                const updatedLobbies = data.data.map((lobby: any) => ({
                    ...lobby,
                    isHost: lobby.hostId === authUser?.id
                }));
                setLobbies(updatedLobbies);
            }
            else if (data.type === 'clientList') {
                setClients(data.data);

                if (currentLobby) {
                    const lobbyClients = data.data.filter((client: Client) => 
                        client.lobbyId === currentLobby.id
                    );
                    setClients(lobbyClients);
                } else {
                    setClients(data.data);
                }
            }
            else if (data.type === 'allClients') {
                setAllClients(data.data);
            }
            else if (data.type === 'authSuccess') {
                console.log('Authentication successful');
                console.log(data.userId);
                console.log(data.username);
                setIsConnected(true);
                setAuthUser(prev => ({
                    ...prev!,
                    id: data.userId,
                    name: data.username
                }));
                if (ws.current) {
                    ws.current.send(JSON.stringify({
                        type: 'getClientList',
                    }));
                    ws.current.send(JSON.stringify({
                        type: 'getLobbyList'
                    }));
                }
            }
            else if (data.type === 'authError') {
                console.error('Authentication failed:', data.message);
                disconnect();
            }
            else if (data.type === 'inviteReceived') {
                const newInvitation: Invitation = {
                    id: uuidv4(),
                    from: data.from,
                    lobbyId: data.lobbyId,
                    lobbyName: data.lobbyName,
                    timestamp: new Date()
                };
                setInvitations(prev => [...prev, newInvitation]);
            }
            else if (data.type === 'lobbyJoined') {
                setCurrentLobby({
                    id: data.lobbyId,
                    name: data.lobbyName,
                    isHost: data.isHost || false
                });
                
                if (ws.current) {
                    ws.current.send(JSON.stringify({
                        type: 'getClientList'
                    }));
                }
            }
            else if (data.type === 'clientList') {
                setAllClients(data.data);

                if (currentLobby) {
                    const lobbyClients = data.data.filter((client: Client) => 
                        currentLobby && client.lobbyId === currentLobby.id
                    );
                    setClients(lobbyClients);
                } else {
                    setClients(data.data);
                }
            }
            else if (data.type === 'lobbyLeft') {
                setCurrentLobby(null);
            }
            else if (data.type === 'kickedFromLobby') {
                setCurrentLobby(null);
            }
            else if (data.type === 'playerKicked') {
                if (ws.current) {
                    ws.current.send(JSON.stringify({
                        type: 'getClientList'
                    }));
                }
            }
            else if (data.type === 'kickSuccess') {
                console.log(`Successfully kciked player ${data.clientId}`);

                if (ws.current) {
                    ws.current.send(JSON.stringify({
                        type: 'getClientList'
                    }));
                }
            }
            else if (data.type === 'lobbyLeft') {
                setCurrentLobby(null);
                setIsReady(false);
            }
            else if (data.type === 'lobbyDisbanded') {
                if (data.lobbyId === currentLobby?.id) {
                    setCurrentLobby(null);
                    setIsReady(false);
                }
            }
            else if (data.type === 'newHost') {
                if (data.hostId === authUser?.id) {
                }
            }
            else if (data.type === 'promotedToHost') {
                if (data.lobbyId === currentLobby?.id) {
                    setCurrentLobby(prev => prev ? { ...prev, isHost: true } : null);
                }
            }
            else if (data.type === 'gameStarted') {
                const FormatQuestions = data.questions;
                if (FormatQuestions) {
                    setQuestions(FormatQuestions);
                    setGameState('playing');
                }
            }
            else if (data.type === 'LobbiesFinalScores') {

                console.log(data);
                console.log(data.ScoreData);

                const LobbyScoreBoardData: LobbyScoreBoard = {
                    UserId: data.clientId ||'unknown',
                    name: data.username || 'Anonymous',
                    skippedQuestions: data.ScoreData?.skippedQuestions || 0,
                    correctAnswered: data.ScoreData?.correctAnswered || 0,
                    InCorrectAnswered: data.ScoreData?.InCorrectAnswered || 0,
                };

                setLobbyScoreBoard(prev => [...prev, LobbyScoreBoardData]);
            }
        }

        ws.current.onclose = () => {
            setIsConnected(false);
            ws.current = null;
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
            ws.current = null;
        }
    }

    const disconnect = () => {
        if (ws.current) {
            ws.current.close();
            console.log("user has disconnected from the Websocket Server");
        }
    };

    const createLobby = () => {
        if (!ws.current) return;

        ws.current.send(JSON.stringify({
            type: 'createLobby',
            name: AuthUserName,
            id: authUser?.id
        }));

    };

    const toggleReady = () => {
        if (!ws.current) return;

        const newReadyStatus = !isReady
        setIsReady(newReadyStatus);

        ws.current.send(JSON.stringify({
            type: 'ready',
            ready: newReadyStatus,
            clientId: authUser?.id
        }));
    };

    const ConnectToTheServer = () => {
        const newGuestConnect = !GuestConnect;
        setGuestConnect(newGuestConnect);
    }

    const SendInvitation = (id: string) => {
        if (!ws.current || !currentLobby) return;

        const targetClient = allClients.find(c => c.id === id);
        if (!targetClient) {
            console.error('Target client not found');
            return;
        }

        if (!currentLobby) {
            console.error('No Current lobby');
            return;
        }

        const inviteMessage = {
            type: 'invite',
            id,
            lobbyId: currentLobby.id,
            lobbyName: currentLobby.name,
            senderId: authUser?.id
        }

        try {
            ws.current.send(JSON.stringify(inviteMessage));
            console.log(`Invite sent to ${targetClient.username}`);
        } catch (error) {
            console.error(`Error sending the invite: `, error)
        }
    }

    const DeclineInvitation = (id: string) => {
        if (!ws.current) return;

        const updatedInvitations = invitations.filter(i => i.id != id);
        setInvitations(updatedInvitations);
    }

    const AcceptInvitation = (LobbyId: string) => {
        if (!ws.current) return;

        console.log("Accept");
        ws.current.send(JSON.stringify({
            type: 'joinLobby',
            lobbyId: LobbyId
        }));

        setInvitations(prev => prev.filter(i => i.lobbyId !== LobbyId));
    };

    const leaveLobby = (id: string) => {
        if (!ws.current || !currentLobby) return;
        
        ws.current.send(JSON.stringify({
            type: 'leaveLobby',
            clientId: id
        }));

        setCurrentLobby(null);
        setIsReady(false);
        setClients(prevClients => 
            prevClients.filter(client => client.id !== id)
        );
    }

    const RemoveClientFromLobby = (clientId: string) => {
        if (!ws.current || !currentLobby?.isHost) return;
        
        ws.current.send(JSON.stringify({
            type: 'kickPlayer',
            clientId,
            lobbyId: currentLobby.id
        }));
    };

    const shuffleArray = (array: any[]): any[] => {
        return [...array].sort(() => Math.random() - 0.5);
    }

    const StartGame = () => {
        if (!ws.current) return;

        if (clients.every(client => client.ready === true)) {
            console.log("Ready");

            try {
                // const response = MockDataGameLoop[1];

                const response = LobbyTriviaData;

                // Add Fetch TriviaTable here depending on the TriviaID in State

                const formattedQuestions = response?.data.results.map((q: any) => ({
                    question: q.question,
                    correct_answer: q.correct_answer,
                    incorrect_answers: q.incorrect_answers,
                    all_answers: shuffleArray([...q.incorrect_answers, q.correct_answer]),
                    difficulty: q.difficulty,
                    category: q.category
                }));

                ws.current.send(JSON.stringify({
                    type: 'getClientList'
                }));

                ws.current.send(JSON.stringify({
                    type: 'StartGame',
                    formattedQuestions: formattedQuestions,
                    lobbyId: currentLobby?.id
                }));

                if (formattedQuestions) {
                    setQuestions(formattedQuestions);
                }
                setGameState('playing');

            } catch (error) {
                console.error('Couldnt fetch the questions, please try again!', error);
            }

        } else {
            console.log("Waiting for some client to be ready!");
        }
    }

    const handleReset = () => {
        setResetKey(prev => prev + 1);
    };

    const handleAnswerSelect = (answer: string): void => {
        if (selectedAnswer) return;
        setSelectedAnswer(answer);

        if (answer === questions[currentQuestionIndex].correct_answer) {
            setScore((prev) => prev + 1);
        }
    }

    const handleNextQuestion = (): void => {
        if (!ws.current) return; 

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            handleReset();
        } else {

            const finalScoreData: FinalScore = {
                correctAnswered: score,
                InCorrectAnswered: questions.length - score - skippedQuestions,
                skippedQuestions: skippedQuestions,
            };

            setFinalScore(finalScoreData);

            ws.current.send(JSON.stringify({
                type: 'FinalScores',
                ScoreData: finalScoreData,
            }));

            console.log(finalScoreData);

            setGameState('finished');
        }
    }

    const currentQuestion = questions[currentQuestionIndex];


    const FetchSpecificTriviaTable = async (TriviaId: string) => {

        try {
            const response = await axios.get<TriviaData>(`${baseUrl}/trivia/${TriviaId}`);
            setLobbyTriviaData(response.data);

        } catch (error) {
            console.error("Failed to fetch Trivia Data, reload the page", error);
        }
    }

    const handlePlacementsCalculated = useCallback((data: {
        sortedData: LobbyScoreBoard[];
        placementsMap: Record<string, number>;
        authUserPlacement?: number;
    }) => {
        if (JSON.stringify(placementsRef.current) !== JSON.stringify(data)) {
            setPlacements(data);
            placementsRef.current = data;
            console.log("Placements updated:", data);
        }
    }, []);

    return (
        <>
            <div className="CustomMultiPlayer_page">
                <Header />
                <main className="main">
                    <MultiPlayer_title />
                    {TriviaId ? (
                        <>
                        {gameState === 'prep' && (
                            <>
                                <CustomMultiplayerSettings 
                                    triviaData={LobbyTriviaData}
                                    ranked={ranked}
                                    onRankedChange={setRanked}
                                    lobbyStatus={lobbyStatus}
                                    onLobbyStatusChange={setLobbyStatus}
                                    checkStatus={StartGame}
                                    allClientsReady={allClientsReady}
                                />
                                <div className="lobbyDetails">
                                    <Lobby_title />
                                    <AuthUserLobbyCard 
                                        clients={clients}
                                        authUser={authUser}
                                        readyButton={toggleReady}
                                        isReady={isReady}
                                    />
                                    <ActiveClientsLobby 
                                        clients={clients}
                                        authUser={authUser}
                                        currentLobbyId={currentLobby?.id}
                                        kickPlayer={RemoveClientFromLobby}
                                    />
                                </div>
                                <div className="sendInvite">
                                    <Invitation_title />
                                    <SendInviteCard 
                                        clients={allClients}
                                        authUser={authUser}
                                        sendInvite={SendInvitation}
                                        currentLobbyId={currentLobby?.id}
                                    />
                                </div>
                            </>
                        )}
                        {gameState === 'playing' && (
                            <>
                            <div className="game_window">
                                <div className="game-screen">
                                    <div className="game-info">
                                        <div className="question">
                                            Question {currentQuestionIndex + 1}/{questions.length}
                                        </div>
                                        <div className="timer">
                                            <Countdown 
                                                key={resetKey}
                                                onTimeUpdate={(time) => {
                                                    setRemainingTime(time);
                                                    if (time <= 0 && !hasTimeExpired.current) {
                                                        console.log("Missed Question!");
                                                        setSkippedQuestions((prev) => prev + 1);
                                                        handleNextQuestion();
                                                        hasTimeExpired.current = true;
                                                    }
                                                    if (time > 0) {
                                                        hasTimeExpired.current = false;
                                                    }
                                                }}
                                            />
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
                                <div className="display-players">
                                    <ul>
                                        {clients.map(client => 
                                            <li>{client.username}</li>
                                        )}
                                    </ul>
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
                                        <div className="stats-bar"><span>Incorrect Answers: </span><span>{questions.length - score - skippedQuestions}</span></div>
                                        <div className="stats-bar none"><span>Skipped Answers: </span><span>{skippedQuestions}</span></div>
                                    </div>
                                    <div className="button-container">
                                        <Link to={RouterContainer.Homepage}><Home_button /></Link>
                                        {/* <PlayAgain onClick={changeGameState}/> */}
                                    </div>
                                </div>
                                <LobbyScoreBoardCard 
                                    lobbyScoreBoardData={LobbyScoreBoard}
                                    authUser={authUser}
                                    onPlacementsCalculated={handlePlacementsCalculated}
                                />
                            </>
                        )}
                        </>
                    ) : (
                        <>
                            {currentLobby ? (
                                <>
                                {gameState === 'prep' && (
                                    <>
                                        <FullClientLobbyDisplay 
                                            clients={clients}
                                            authUser={authUser}
                                            readyButton={toggleReady}
                                            leaveLobby={leaveLobby}
                                        />
                                    </>
                                )}
                                {gameState === 'playing' && (
                                <>
                                <div className="game_window">
                                    <div className="game-screen">
                                        <div className="game-info">
                                            <div className="question">
                                                Question {currentQuestionIndex + 1}/{questions.length}
                                            </div>
                                            <div className="timer">
                                                <Countdown 
                                                    key={resetKey}
                                                    onTimeUpdate={(time) => {
                                                        setRemainingTime(time);
                                                        if (time <= 0 && !hasTimeExpired.current) {
                                                            console.log("Missed Question!");
                                                            setSkippedQuestions((prev) => prev + 1);
                                                            handleNextQuestion();
                                                            hasTimeExpired.current = true;
                                                        }
                                                        if (time > 0) {
                                                            hasTimeExpired.current = false;
                                                        }
                                                    }}
                                                />
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
                                    <div className="display-players">
                                        <ul>
                                            {clients.map(client => 
                                                <li>{client.username}</li>
                                            )}
                                        </ul>
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
                                                <div className="stats-bar"><span>Incorrect Answers: </span><span>{questions.length - score - skippedQuestions}</span></div>
                                                <div className="stats-bar none"><span>Skipped Answers: </span><span>{skippedQuestions}</span></div>
                                            </div>
                                            <div className="button-container">
                                                <Link to={RouterContainer.Homepage}><Home_button /></Link>
                                                {/* <PlayAgain onClick={changeGameState}/> */}
                                            </div>
                                        </div>
                                        <LobbyScoreBoardCard 
                                            lobbyScoreBoardData={LobbyScoreBoard}
                                            authUser={authUser}
                                            onPlacementsCalculated={handlePlacementsCalculated}
                                        />
                                    </>
                                )}
                                </>
                            ) : (
                                <>
                                    <div className="invitationDetails">
                                        <button className="connect_button" onClick={() => ConnectToTheServer()}>{GuestConnect ? 'Disconnect' : 'Connect'}</button>
                                    </div>
                                    <Invitation_title />
                                    <ReciveInvitationscard 
                                        ReciviedInvitations={invitations}
                                        AcceptInvitation={AcceptInvitation}
                                        DeclineInvitation={DeclineInvitation}
                                    />
                                </>
                            )}

                        </>
                    )}

                </main>
                <Footer />
            </div>
        </>
    );
};

export default CustomMultiplayer;
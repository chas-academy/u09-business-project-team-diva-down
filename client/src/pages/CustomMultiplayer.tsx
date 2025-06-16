import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import { useEffect, useRef, useState } from "react";
import { RouterContainer } from "../routes/RouteContainer";
import MultiPlayer_title from "../components/hoc/loc/MultiPlayer_title";
import CustomMultiplayerSettings from "../components/common/gameloop/custom_multiplayer_settings_card";
// MockData needs to be replaced later
import { MockDataGameLoop } from "../MockData/MockDataGameLoop";
import FriendsList_title from "../components/hoc/loc/FriendsList_title";
import Friendslist_Container from "../components/common/gameloop/Friendlist_container_card";
import CurrentClientsLobby_title from "../components/hoc/loc/CurrentClientsLobby_title";
import Lobby_Container from "../components/common/gameloop/Lobby_container_card";

// Types

type GameState = 'prep' | 'playing' | 'finished';

// Interfaces
interface AuthUser {
    id: string;
    email: string;
    name: string;
    token: string;
}

interface TriviaData {
    id: number; // Needs to be change to match the MongoDB id handling
    title: string;
    data: {
        results: {
            category: string;
            correct_answer: string;
            incorrect_answers: string[];
            question: string;
            difficulty: string;
        }[];
    }
}

// Currently only taking the fields of data that will be used in later function, can be expanded to the full data structure if needed
interface FriendsData {
    id: string;
    friend: {
        email: string;
        name: string;
        id: string;
    }[];
}

interface IFriend {
    id: string;
    name: string;
    email: string;
};

type SpecificFriendArray = IFriend[];

const CustomMultiplayer: React.FC = () => {

    const location = useLocation();
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const ws = useRef<WebSocket | null>(null);
    const [AuthUserClient, setAuthUserClient] = useState<AuthUser>();
    const navigate = useNavigate();
    const [gameState, setGameState] = useState<GameState>('prep');
    const [ranked, setRanked] = useState("");
    const [ActiveCustomTriviaData, SetActiveCustomTriviaData] = useState<TriviaData>({
        id: 0,
        title: "",
        data: { results: [] }
    });
    const [friendsDataTemp, setFriendsData] = useState<FriendsData>({
        id: '',
        friend: [{
            email: '',
            name: '',
            id: '',
        }]
    });
    const [EachFriendData, setEachFriendData] = useState<SpecificFriendArray>([
        {
            id: '',
            name: '',
            email: '',
        }
    ]);

    const { TriviaId } = location.state || {};

    
    // A UseEffect that is used to set the active Trivia Data from the users own custom Trivia List, currently using Mock Data

    useEffect(() => {

        const ClearActiveCustomTriviaData: TriviaData = {
            id: 0,
            title: "",
            data: {
                results: []
            }
        };

        if (TriviaId) {
            try {
                const LobbyActiveTrivia = MockDataGameLoop.find(request => request.id === TriviaId);
                if (LobbyActiveTrivia) {
                    // Clear the data first before inserting new just in case:
                    SetActiveCustomTriviaData(ClearActiveCustomTriviaData);
                    SetActiveCustomTriviaData(LobbyActiveTrivia);
                }
            } catch (error) {
                console.error('Failed to Init The Selected Trivia Data, Exit the lobby and try again');
                return;
            }
        }
    })

    // UseEffect to populate the Logged In user to the specific client.

    useEffect(() => {
        const AuthUser = localStorage.getItem("authUser");

        if (AuthUser) {
            try {
                const AuthUserObject = JSON.parse(AuthUser);
                setAuthUserClient(AuthUserObject);
            } catch (error) {
                console.error('Failed to parse user data', error);
                localStorage.removeItem("authUser");
                navigate(RouterContainer.Login);
            }
        } else {
            console.log('No User data found in LocalStorage');
            navigate(RouterContainer.Login);
        }

    }, [navigate]);

    // Fetch The specific users friends, that is stored in a different table within the DB

    useEffect(() => {
        const fetchFriends = async () => {
            if (!AuthUserClient?.id) return;
            
            try {
                const response = await fetch(`http://localhost:3000/friends/${AuthUserClient.id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const friendsData = await response.json();
                setFriendsData(friendsData);

                if(friendsDataTemp) {
                    try {
                        const friendRespones = await Promise.all(
                            friendsDataTemp.friend.map(async (friend) => {
                                const response = await fetch(`http://localhost:3000/user/${friend.id}`);
                                if (!response.ok) {
                                    throw new Error(`Failed to fetch user ${friend.id}`);
                                }

                                const userData = await response.json();

                                return {
                                    id: userData._id,
                                    name: userData.name,
                                    email: userData.email
                                };

                            })
                        );

                        setEachFriendData(friendRespones);
                    } catch (err) {
                        console.log("Failed to fetch friend Specific Data", err);
                        setEachFriendData([]);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch friends data", error);
                setEachFriendData([]);
            }
        };

        fetchFriends();
    }, [AuthUserClient?.id]); // Only re-run if AuthUserClient.id changes



    const connect = () => {

        ws.current = new WebSocket(`ws://localhost:3000?${encodeURIComponent(TriviaId)}`);

        ws.current.onopen = () => {
            console.log('Connected to WebSocket server');
            setIsConnected(true);
        };

        ws.current.onclose = () => {
            console.log('Disconnected from Websocket server');
            setIsConnected(false);
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };
    };

    useEffect(() => {
        connect();

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    return (
        <>
            <div className="CustomMultiPlayer_page">
                <Header />
                <main className="main">
                    {isConnected? (
                        <>
                        {gameState === 'prep' && (
                            <>
                                <section className="title_section">
                                    <MultiPlayer_title />
                                </section>
                                <CustomMultiplayerSettings 
                                    ranked={ranked}
                                    onRankedChange={setRanked}
                                    triviaData={ActiveCustomTriviaData}
                                />
                                <div style={{color: '#FFF'}}>You are Connected</div>
                                <div style={{color: '#FFF'}}>{AuthUserClient?.name}</div>
                                <section className="title_section">
                                    <CurrentClientsLobby_title />
                                </section>
                                <Lobby_Container />
                                
                                <section className="title_section">
                                    <FriendsList_title />
                                </section>
                                <Friendslist_Container 
                                    EachFriend={EachFriendData}
                                />
                            </>
                        )}
                        </>
                    ) : (
                        <>
                        <div style={{color: '#FFF'}}>Disconnected! Try Again!</div>
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
};

export default CustomMultiplayer;
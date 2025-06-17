import { useState, useEffect, useRef } from "react";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import { useLocation } from "react-router-dom";
import CustomMultiplayerSettings from "../components/common/gameloop/custom_multiplayer_settings_card";
import MultiPlayer_title from "../components/hoc/loc/MultiPlayer_title";
import { ActiveClientsLobby } from "../components/common/mutliplayer-Custom-Comp/Lobby_Active_Clients_card";
import { AuthUserLobbyCard } from "../components/common/mutliplayer-Custom-Comp/Lobby_AuthUser_card";

// Fetching Trivia ID from the redirect to this page

interface LocationState {
    TriviaId: number;
}


// Interfaces, Const and UseEffect for fetching the Auth Users data -----------------

interface AuthUser {
    id: string;
    email: string;
    name: string;
    token: string;
}

const getAuthUser = (): AuthUser | null => {
    try {
        const user = localStorage.getItem("authUser");
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Error parsing auth user", error);
        return null; 
    }
};

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

const CustomMultiplayer: React.FC = () => {
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);
    const AuthUserName = authUser?.name;
    const location = useLocation();
    const state = location.state as LocationState; // TrivaID regarding the mockData questions
    const [ranked, setRanked] = useState<string>('');
    const [lobbyStatus, setLobbyStatus] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const ws = useRef<WebSocket | null>(null);
    const [lobbies, setLobbies] = useState<LobbyInfo[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [currentLobby, setCurrentLobby] = useState<{
        id: string;
        name: string;
        isHost: boolean;
    } | null>(null);

    // UseEffects
    useEffect(() => {
        const user = getAuthUser();
        setAuthUser(user);
    }, []);

    // Connect to the Websocket Server

    useEffect(() => {
        if (lobbyStatus === "open" && !isConnected) {
            console.log("Open");
            connect();
        }
        if (lobbyStatus === 'close' && isConnected) {
            console.log("Closed");
            disconnect();
        }

        // return () => {
        //     if (ws.current & isConnected) {
        //         disconnect();
        //     }
        // }
    }, [lobbyStatus, isConnected])

    const connect = () => {

        ws.current = new WebSocket(`ws://localhost:3000`);

        ws.current.onopen = () => {
            console.log('connected to Webscoket Server!');
            const authMessage = JSON.stringify({
                type: 'auth',
                userId: authUser?.id,
                username: authUser?.name,
                token: authUser?.token
            });
            console.log('Sending Auth Message:', authMessage);
            ws.current?.send(authMessage);
            setIsConnected(true);
            createLobby();
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
            name: AuthUserName
        }));

    };



    return (
        <>
            <div className="CustomMultiPlayer_page">
                <Header />
                <main className="main">
                    <MultiPlayer_title />
                    <CustomMultiplayerSettings 
                        ranked={ranked}
                        onRankedChange={setRanked}
                        lobbyStatus={lobbyStatus}
                        onLobbyStatusChange={setLobbyStatus}
                    />
                    <div className="lobbyDetails">
                        {currentLobby?.id}
                        <br />
                        ({currentLobby?.isHost ? 'Host' : 'Guest'})
                        <br />
                        {currentLobby?.name}
                        <AuthUserLobbyCard 
                            // Need to filter thru the auth user for both comps
                            clients={clients}
                            authUser={authUser}
                        />
                        <ActiveClientsLobby />
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default CustomMultiplayer;
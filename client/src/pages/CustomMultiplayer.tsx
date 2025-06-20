import { useState, useEffect, useRef } from "react";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import { useLocation } from "react-router-dom";
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

interface Invitation {
    id: string;
    from: string;
    lobbyId: string;
    lobbyName: string;
    timestamp: Date;
}

const CustomMultiplayer: React.FC = () => {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);
    const AuthUserName = authUser?.name;
    const location = useLocation();
    const state = location.state as LocationState; // TrivaID regarding the mockData questions
    const [ranked, setRanked] = useState<string>('');
    const [lobbyStatus, setLobbyStatus] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const ws = useRef<WebSocket | null>(null);
    const [lobbies, setLobbies] = useState<LobbyInfo[]>([]);
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
        const user = getAuthUser();
        setAuthUser(user);
    }, []);

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
        // return () => {
        //     if (ws.current & isConnected) {
        //         disconnect();
        //     }
        // }
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

    const connect = () => {

        ws.current = new WebSocket(`ws://localhost:3000`);

        ws.current.onopen = () => {
            console.log('connected to Webscoket Server!');

            const user = getAuthUser();
            
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
        console.log("Reg");
        if (!ws.current) return;

        const newReadyStatus = !isReady
        setIsReady(newReadyStatus);

        ws.current.send(JSON.stringify({
            type: 'ready',
            ready: newReadyStatus
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

    const StartGame = () => {
        if (clients.every(client => client.ready === true)) {
            console.log("Ready");
        } else {
            console.log("Waiting for some client to be ready!");
        }
    }

    return (
        <>
            <div className="CustomMultiPlayer_page">
                <Header />
                <main className="main">
                    <MultiPlayer_title />
                    {state.TriviaId ? (
                        <>
                            <CustomMultiplayerSettings 
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
                    ) : (
                        <>
                            {currentLobby ? (
                                <>
                                    <FullClientLobbyDisplay 
                                        clients={clients}
                                        authUser={authUser}
                                        readyButton={toggleReady}
                                        leaveLobby={leaveLobby}
                                    />

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

interface Client {
  id: string;
  username: string;
  ready: boolean;
  isHost?: boolean;
  lobbyId?: string;
}

interface AuthUser {
    id: string;
    email: string;
    name: string;
    token: string;
}

interface ActiveClientsLobbyProps {
    clients: Client[];
    authUser: AuthUser | null;
    currentLobbyId?: string;
    kickPlayer: (id: string) => void;
}

export const ActiveClientsLobby: React.FC<ActiveClientsLobbyProps> = ({
    clients,
    authUser,
    currentLobbyId,
    kickPlayer
}) => {

    const RestOfClients = clients.filter(client => 
        client.id !== authUser?.id && 
        client.lobbyId === currentLobbyId
    );

    if (!RestOfClients){
        return (
        <tr>
            <td>Empty</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        )
    }

    return (
        <>
            <div className="active_clientsWrapper">
                <table className="lobby_table">
                    <tbody>
                        {RestOfClients && RestOfClients.length > 0 ? (
                            RestOfClients.map(client => 
                                <tr key={client.id}>
                                    <td>{client.username}</td>
                                    <td>{client.isHost ? 'Host' : 'Guest'}</td>
                                    <td>{client.ready ? 'Ready' : 'Not Ready'}</td>
                                    <td><button className="kick" onClick={() => kickPlayer(client.id)}>Kick Player</button></td>
                                </tr>
                            )
                        ) : (
                            <tr>
                                <td colSpan={4}>No other players in the lobby</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};
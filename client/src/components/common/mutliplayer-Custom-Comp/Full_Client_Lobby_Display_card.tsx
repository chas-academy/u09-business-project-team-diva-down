
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

interface FullClientLobbyDisplayProps {
    clients: Client[];
    authUser: AuthUser | null;
    readyButton: () => void;
    leaveLobby: (id: string) => void;
}


const FullClientLobbyDisplay: React.FC<FullClientLobbyDisplayProps> = ({
    clients,
    authUser,
    readyButton,
    leaveLobby
}) => {

    const HostClient = clients.find(client => client.isHost === true);
    const RestOfTheClients = clients.filter(client => client.id != HostClient?.id);


    return (
        <div className="invited_to_lobby">
            <table className="lobby_table">
                <tbody>
                    <tr>
                        <td>{HostClient?.username}</td>
                        <td>{HostClient?.isHost ? 'Host' : 'Guest'}</td>
                        <td>{HostClient?.ready ? 'Ready' : 'Not Ready'}</td>
                        <td></td>
                    </tr>
                    {RestOfTheClients.map(client => 
                        <tr key={client.id}>
                            <td>{client.username}</td>
                            <td>{client.isHost ? 'Host' : 'Guest'}</td>
                            <td>{client.ready ? 'Ready' : 'Not Ready'}</td>
                            <td className="action_container">
                                <button className="btn ready" onClick={readyButton}>Ready</button>
                                <button className="btn leave" onClick={() => leaveLobby(client.id)}>Leave</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FullClientLobbyDisplay;
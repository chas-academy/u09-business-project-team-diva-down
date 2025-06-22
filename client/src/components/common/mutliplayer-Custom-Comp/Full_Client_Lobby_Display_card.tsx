
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

    const AuthUserClient = clients.find(client => client.id === authUser?.id);
    const HostClient = clients.find(client => client.isHost === true);
    const RestOfTheClients = clients.filter(
        client => client.id != HostClient?.id &&
        client.id != AuthUserClient?.id
    );
    const AuthUserClientID = AuthUserClient?.id


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
                    <tr>
                        <td>{AuthUserClient?.username}</td>
                        <td>{AuthUserClient?.isHost ? 'Host' : 'Guest'}</td>
                        <td>{AuthUserClient?.ready ? 'Ready' : 'Not Ready'}</td>
                        <td className="action_container">
                            <button className="btn ready" onClick={readyButton}>Ready</button>
                            <button className="btn leave" onClick={() => {
                                if (AuthUserClientID) {
                                    leaveLobby(AuthUserClientID);
                                } else {
                                    console.error("No Auth user ID found!");
                                }
                            }}>Leave</button>
                        </td>
                    </tr>
                    {RestOfTheClients.map(client => 
                        <tr key={client.id}>
                            <td>{client.username}</td>
                            <td>{client.isHost ? 'Host' : 'Guest'}</td>
                            <td>{client.ready ? 'Ready' : 'Not Ready'}</td>
                            <td className="action_container"></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FullClientLobbyDisplay;

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

interface AuthUserLobbyCardProps {
    clients: Client[];
    authUser: AuthUser | null;
    readyButton: () => void;
}


export const AuthUserLobbyCard: React.FC<AuthUserLobbyCardProps> = ({
    clients,
    authUser,
    readyButton
}) => {


    const currentUser = clients.find(client => client.id === authUser?.id);

    return (
        <>
            <div className="active_clientsWrapper">
                <table className="lobby_table">
                    <tbody>
                        <tr>
                            <td>{currentUser?.username}</td>
                            <td>{currentUser?.isHost ? 'Host' : 'Guest'}</td>
                            <td>{currentUser?.ready ? 'Ready' : 'Not Ready'}</td>
                            <td><button onClick={readyButton} className="ready">{currentUser?.ready ? '✖' : '✓'}</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}
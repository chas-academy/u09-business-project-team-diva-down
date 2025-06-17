
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
    clients: Client;
    authUser: AuthUser;
}


export const AuthUserLobbyCard: React.FC<AuthUserLobbyCardProps> = ({
    clients,
    authUser
}) => {
    return (
        <>
            <div className="active_clientsWrapper">
                <table className="lobby_table">
                    <tbody>
                        {clients.filter()}
                        <tr>
                            <td>Username</td>
                            <td>Role</td>
                            <td>Ready/Not Ready</td>
                            <td><button className="ready">Ready</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}
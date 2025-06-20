
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

interface SendInviteCardProps {
    clients: Client[];
    authUser: AuthUser | null;
    sendInvite: (id: string) => void;
    currentLobbyId?: string;
}


const SendInviteCard: React.FC<SendInviteCardProps> = ({
    clients,
    authUser,
    sendInvite,
    currentLobbyId
}) => {

    const RestOfClients = clients.filter(client => 
        client.id != authUser?.id &&
        client.lobbyId != currentLobbyId
    );


    return (
        <>
            <div className="invite_container">
                <table className="lobby_table">
                    <tbody>
                        {RestOfClients && RestOfClients.length > 0 ? (
                            RestOfClients.map(client => 
                                <tr key={client.id}>
                                    <td>{client.username}</td>
                                    <td>{client.lobbyId === undefined ? 'Free' : 'Occupied'}</td>
                                    <td><button className="invite" onClick={() => sendInvite(client.id)}>Send Invite</button></td>
                                </tr>
                            )
                        ) : (
                            <>
                                <tr>
                                    <td colSpan={2}>Currently no users online</td>
                                    <td className="action_container"><button className="invite">Send Invite</button></td>
                                </tr>
                            </>
                        )}

                    </tbody>
                </table>
            </div>
        </>
    );
};

export default SendInviteCard;
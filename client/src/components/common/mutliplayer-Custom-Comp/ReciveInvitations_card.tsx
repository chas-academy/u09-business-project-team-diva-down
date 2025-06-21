
interface Invitation {
    id: string;
    from: string;
    lobbyId: string;
    lobbyName: string;
    timestamp: Date;
}

interface ReciveInvitationscardProps {
    ReciviedInvitations?: Invitation[];
    DeclineInvitation: (id: string) => void;
    AcceptInvitation: (id: string) => void;
}

const ReciveInvitationscard: React.FC<ReciveInvitationscardProps> = ({
    ReciviedInvitations,
    DeclineInvitation,
    AcceptInvitation
}) => {

    return (
        <>
            <div className="invitation_container">
                <table className="lobby_table">
                    <tbody>
                        {ReciviedInvitations?.map(i => 
                            <tr key={i.id}>
                                <td>{i.from}</td>
                                <td>{i.timestamp.toLocaleDateString()}</td>
                                <td className="action_container">
                                    <div className="accept" onClick={() => AcceptInvitation(i.lobbyId)}>Accept</div>
                                    <div className="decline" onClick={() => DeclineInvitation(i.id)}>Decline</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ReciveInvitationscard;
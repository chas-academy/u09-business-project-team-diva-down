


export const ActiveClientsLobby = () => {
    return (
        <>
            <div className="active_clientsWrapper">
                <table className="lobby_table">
                    <tbody>
                        <tr>
                            <td>Username</td>
                            <td>Role</td>
                            <td>Ready/Not Ready</td>
                            <td><button className="kick">Kick Player</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};
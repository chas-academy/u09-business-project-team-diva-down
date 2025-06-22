

const Lobby_Container = () => {
    return (
        <>
            <div className="lobby_container">
                <table className="lobby_table">
                    <tbody>
                        <tr>
                            <td>Username</td>
                            <td>Elo Rating</td>
                            <td>Host/Guest</td>
                            <td><button className="kick">Kick Player</button></td>
                        </tr>
                        <tr>
                            <td>Username</td>
                            <td>Elo Rating</td>
                            <td>Host/Guest</td>
                            <td><button className="kick">Kick Player</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Lobby_Container;

interface LobbyScoreBoard {
    UserId: string;
    name: string;
    skippedQuestions: number;
    correctAnswered: number;
    InCorrectAnswered: number;
}

interface LobbyScoreBoardCardProps {
    lobbyScoreBoardData: LobbyScoreBoard[];
}

const LobbyScoreBoardCard: React.FC<LobbyScoreBoardCardProps> = ({
    lobbyScoreBoardData
}) => {
    
    const sortedData = [...lobbyScoreBoardData].sort((a, b) => {
        if (b.correctAnswered !== a.correctAnswered) {
            return b.correctAnswered - a.correctAnswered;
        }
        if (a.InCorrectAnswered !== b.InCorrectAnswered) {
            return a.InCorrectAnswered - b.InCorrectAnswered;
        }
        return a.skippedQuestions - b.skippedQuestions;
    });

    return (
        <div className="scoreboard">
            <h2>Final Score</h2>
            {sortedData.length === 0 ? (
                <p>No Scores yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Skipped</th>
                            <th>Incorrect</th>
                            <th>Correct</th>
                            <th>Placement</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((player, index) => (
                            <tr key={player.UserId}>
                                <td>{player.name}</td>
                                <td>{player.skippedQuestions}</td>
                                <td>{player.InCorrectAnswered}</td>
                                <td>{player.correctAnswered}</td>
                                <td>{index + 1}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LobbyScoreBoardCard;
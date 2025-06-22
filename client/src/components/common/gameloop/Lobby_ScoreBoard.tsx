import { useEffect, useRef } from "react";

interface AuthUser {
    id: string;
    email: string;
    name: string;
    token: string;
}

interface LobbyScoreBoard {
    UserId: string;
    name: string;
    skippedQuestions: number;
    correctAnswered: number;
    InCorrectAnswered: number;
    placement?: number;
}

interface LobbyScoreBoardCardProps {
    lobbyScoreBoardData: LobbyScoreBoard[];
    authUser: AuthUser | null;
    onPlacementsCalculated?: (placements: {
        sortedData: LobbyScoreBoard[];
        placementsMap: Record<string, number>;
        authUserPlacement?: number;
    }) => void;
}

const LobbyScoreBoardCard: React.FC<LobbyScoreBoardCardProps> = ({
    lobbyScoreBoardData,
    authUser,
    onPlacementsCalculated
}) => {
    const prevDataRef = useRef<LobbyScoreBoard[] | undefined>(undefined);
    
    const sortedData = [...lobbyScoreBoardData]
        .sort((a, b) => {
            if (b.correctAnswered !== a.correctAnswered) {
                return b.correctAnswered - a.correctAnswered;
            }
            if (a.InCorrectAnswered !== b.InCorrectAnswered) {
                return a.InCorrectAnswered - b.InCorrectAnswered;
            }
            return a.skippedQuestions - b.skippedQuestions;
        })
        .map((player, index) => ({
            ...player,
            placement: index + 1
        }));

    useEffect(() => {
        if (JSON.stringify(prevDataRef.current) !== JSON.stringify(sortedData)) {
            prevDataRef.current = sortedData;
            
            if (onPlacementsCalculated) {
                const placementsMap: Record<string, number> = {};
                sortedData.forEach(player => {
                    placementsMap[player.UserId] = player.placement!;
                });

                const authUserPlacement = authUser ? placementsMap[authUser.id] : undefined;

                onPlacementsCalculated({
                    sortedData,
                    placementsMap,
                    authUserPlacement
                });
            }
        }
    }, [sortedData, authUser, onPlacementsCalculated]);

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
                        {sortedData.map((player) => (
                            <tr key={player.UserId}>
                                <td>{player.name}</td>
                                <td>{player.skippedQuestions}</td>
                                <td>{player.InCorrectAnswered}</td>
                                <td>{player.correctAnswered}</td>
                                <td>{player.placement}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LobbyScoreBoardCard;
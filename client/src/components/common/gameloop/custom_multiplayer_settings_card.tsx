import Home from "../../hoc/loc/Home_button";
import Play from "../../hoc/loc/Play.button";
import { RouterContainer } from "../../../routes/RouteContainer";
import { Link } from "react-router-dom";
import { all } from "axios";

interface TriviaData {
    id: number;
    title: string;
    data: {
        results: {
            category: string;
            correct_answer: string;
            incorrect_answers: string[];
            question: string;
            difficulty: string;
        }[];
    };
}

interface CustomMultiplayerSettingsProps {
    onRankedChange: (ranked: string) => void;
    ranked: string;
    // triviaData: TriviaData;
    lobbyStatus: string;
    onLobbyStatusChange: (lobbyStatus: string) => void;
    checkStatus: () => void;
    allClientsReady: boolean;
}


const CustomMultiplayerSettings: React.FC<CustomMultiplayerSettingsProps> = ({
    onRankedChange,
    ranked,
    // triviaData,
    lobbyStatus,
    onLobbyStatusChange,
    checkStatus,
    allClientsReady
}) => {
    
    return (
    <div className="settings-container">
        <div className="settings-bar">
            <h2>Custom Trivia</h2>
            <div className="trivia_title">
                {/* {triviaData.title} */}
                Title
            </div>
        </div>
        <div className="settings-bar">
            <h2>Ranked</h2>
            <div className="radio-options">
                <label className={`input-styling ${ranked === "Yes" ? "checked" : ""}`}>
                <input
                className="hidden"
                type="radio"
                name="difficulty"
                value="Yes"
                checked={ranked === "Yes"}
                onChange={(e) => onRankedChange(e.target.value)}
                />
                Yes
                </label>
                <label className={`input-styling ${ranked === "No" ? "checked" : ""}`}>
                <input
                className="hidden"
                type="radio"
                name="difficulty"
                value="No"
                checked={ranked === "No"}
                onChange={(e) => onRankedChange(e.target.value)}
                />
                No
                </label>
            </div>
        </div>
        <div className="settings-bar">
            <h2>Lobby Status</h2>
            <div className="radio-options">
                <label className={`input-styling ${lobbyStatus === "open" ? "checked" : ""}`}>
                    <input
                    className="hidden"
                    type="radio"
                    name="status"
                    value="open"
                    checked={lobbyStatus === "open"}
                    onChange={(e) => onLobbyStatusChange(e.target.value)}
                    />
                    Open
                </label>
                <label className={`input-styling ${lobbyStatus === "close" ? "checked" : ""}`}>
                    <input
                    className="hidden"
                    type="radio"
                    name="status"
                    value="close"
                    checked={lobbyStatus === "close"}
                    onChange={(e) => onLobbyStatusChange(e.target.value)}
                    />
                    Close
                </label>
            </div>
        </div>
        <div className="settings-bar empty">
            <Link style={{textDecoration: 'none', margin: '0'}} to={RouterContainer.Homepage}><Home /></Link>
            <span className={allClientsReady ? "play-button-ready" : "play-button-waiting"}>
                <Play onClick={checkStatus} disabled={!allClientsReady}/>
            </span>
        </div>
    </div>
    );
};

export default CustomMultiplayerSettings;
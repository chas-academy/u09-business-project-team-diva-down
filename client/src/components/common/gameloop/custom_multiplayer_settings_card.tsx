import Home from "../../hoc/loc/Home_button";
import Play from "../../hoc/loc/Play.button";
import { RouterContainer } from "../../../routes/RouteContainer";
import { Link } from "react-router-dom";

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
    triviaData: TriviaData;
}


const CustomMultiplayerSettings: React.FC<CustomMultiplayerSettingsProps> = ({
    onRankedChange,
    ranked,
    triviaData
}) => {
    
    return (
    <div className="settings-container">
        <div className="settings-bar">
            <h2>Custom Trivia</h2>
            <div className="trivia_title">
                {triviaData.title}
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
        <div className="settings-bar empty">
            <Link style={{textDecoration: 'none', margin: '0'}} to={RouterContainer.Homepage}><Home /></Link>
            <Play/>
        </div>
    </div>
    );
};

export default CustomMultiplayerSettings;
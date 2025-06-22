import Home from "../../hoc/loc/Home_button";
import Play from "../../hoc/loc/Play.button";
import Category_Dropdown from "./category_dropdown";
import { RouterContainer } from "../../../routes/RouteContainer";
import { Link } from "react-router-dom";

interface SelectOption {
    value: string;
    label: string;
}

interface GameloopSettingsCardProps {
  selectedOption: SelectOption;
  onOptionChange: (option: SelectOption) => void;
  onDifficutlyChange: (difficulty: string) => void;
  onRankedChange: (ranked: string) => void;
  difficulty: string;
  ranked: string;
  checkStatus: () => void;
}

const GameloopSettingsCard: React.FC<GameloopSettingsCardProps> = ({ 
  selectedOption: selectedCategory,
  onOptionChange: setSelectedCategory,
  onDifficutlyChange,
  onRankedChange,
  difficulty,
  ranked,
  checkStatus
}) => {

  return (
    <div className="settings-container">
      <div className="settings-bar">
        <h2>Category</h2>
        <Category_Dropdown 
          selectedOption={selectedCategory}
          onOptionChange={setSelectedCategory}
        />
      </div>
      <div className="settings-bar">
        <h2>Difficulty</h2>
        <div className="radio-options">
          <label className={`input-styling ${difficulty === "easy" ? "checked" : ""}`}>
            <input
              className="hidden"
              type="radio"
              name="difficulty"
              value="easy"
              checked={difficulty === "easy"}
              onChange={(e) => onDifficutlyChange(e.target.value)}
            />
            Easy
          </label>
          <label className={`input-styling ${difficulty === "medium" ? "checked" : ""}`}>
            <input
              className="hidden"
              type="radio"
              name="difficulty"
              value="medium"
              checked={difficulty === "medium"}
              onChange={(e) => onDifficutlyChange(e.target.value)}
            />
            Medium
          </label>
          <label className={`input-styling ${difficulty === "hard" ? "checked" : ""}`}>
            <input
              className="hidden"
              type="radio"
              name="difficulty"
              value="hard"
              checked={difficulty === "hard"}
              onChange={(e) => onDifficutlyChange(e.target.value)}
            />
            Hard
          </label>
        </div>
      </div>
      {/* <div className="settings-bar">
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
      </div> */}
      <div className="settings-bar empty">
        <Link style={{textDecoration: 'none', margin: '0'}} to={RouterContainer.Homepage}><Home /></Link>
        <Play onClick={checkStatus}/>
      </div>
    </div>
  );
};

export default GameloopSettingsCard;
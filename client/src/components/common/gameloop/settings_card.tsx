import { useState } from "react";
import Home from "../../hoc/loc/Home_button";
import Play from "../../hoc/loc/Play.button";
import Category_Dropdown from "./category_dropdown";

const GameloopSettingsCard = () => {
  const [difficulty, setDifficulty] = useState("");
  const [ranked, setRanked] = useState("");

  function checkStatus() {
    console.log(difficulty);
    console.log(ranked);
  }

  return (
    <div className="settings-container">
      <div className="settings-bar">
        <h2>Category</h2>
        <Category_Dropdown />
      </div>
      <div className="settings-bar">
        <h2>Difficulty</h2>
        <div className="radio-options">
          <label className={`input-styling ${difficulty === "Easy" ? "checked" : ""}`}>
            <input
              className="hidden"
              type="radio"
              name="difficulty"
              value="Easy"
              checked={difficulty === "Easy"}
              onChange={(e) => setDifficulty(e.target.value)}
            />
            Easy
          </label>
          <label className={`input-styling ${difficulty === "Medium" ? "checked" : ""}`}>
            <input
              className="hidden"
              type="radio"
              name="difficulty"
              value="Medium"
              checked={difficulty === "Medium"}
              onChange={(e) => setDifficulty(e.target.value)}
            />
            Medium
          </label>
          <label className={`input-styling ${difficulty === "Hard" ? "checked" : ""}`}>
            <input
              className="hidden"
              type="radio"
              name="difficulty"
              value="Hard"
              checked={difficulty === "Hard"}
              onChange={(e) => setDifficulty(e.target.value)}
            />
            Hard
          </label>
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
              onChange={(e) => setRanked(e.target.value)}
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
              onChange={(e) => setRanked(e.target.value)}
            />
            No
            </label>
        </div>
      </div>
      <div className="settings-bar empty">
        <Home />
        <Play onClick={checkStatus}/>
      </div>
    </div>
  );
};

export default GameloopSettingsCard;
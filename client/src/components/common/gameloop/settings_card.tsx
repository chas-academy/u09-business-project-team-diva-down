import Countdown from "../CountDownTimer";
import Home from "../../hoc/loc/Home_button";
import Play from "../../hoc/loc/Play.button";
import Category_Dropdown from "./category_dropdown";

const gameloop_settings_card = () => {

    return (
        <>
            <div className="settings-container">
                <div className="settings-bar">
                    <h2>Category</h2>
                    <Category_Dropdown />
                </div>
                <div className="settings-bar">
                    <h2>Difficulty</h2>
                </div>
                <div className="settings-bar">
                    <h2>Ranked</h2>
                </div>
                <div className="settings-bar empty">
                    <Home />
                    <Play />
                </div>
            </div>
        </>
    );
};

export default gameloop_settings_card;
import Edit from "../hoc/loc/Edit_button_dashboard";
import { useState } from "react";
import { MockDataUserOwnData } from "../../MockData/MockData";

<Edit />
const UserInfo = () => {
    const [UsersOwnData, SetUsersOwnData] = useState(MockDataUserOwnData);
    const [toggleWindow, setToggleWindow] = useState(false);


    const ToggleWindowFunction = () => {
        setToggleWindow(!toggleWindow);
    }

    return (
        <>
            <div className="user_info">
                <div className="game_title">Game Stats</div>
                <div className="game_stats">
                    <div className="title">Current Rating:</div>
                    <div className="data">{UsersOwnData.elo}</div>
                    <div className="title">Total Wins:</div>
                    <div className="data">{UsersOwnData.wins}</div>
                    <div className="title">Total Matches:</div>
                    <div className="data">{UsersOwnData.total_matches}</div>
                </div>
                <div className="user_title">User Settings</div>

                {toggleWindow && (
                    <>
                        <div>Hello</div> 
                        {/* Make this into a change Password Card! */}
                    </>
                )}
                <div className="sub_title">Password and account details</div>
                <div className="grid">
                    <div className="title">Username</div>
                    <div className="data">{UsersOwnData.username}</div>
                    <Edit />
                    <div className="title">Email</div>
                    <div className="data">{UsersOwnData.email}</div>
                    <Edit />
                </div>
                <button onClick={ToggleWindowFunction} className="change_button">Change Password</button>
                <div className="account_title">Account Removal</div>
                <div className="account_sub_title">Disabling your account means you can recover it at any time after taking this action.</div>
                <div className="button_container">
                    <button className="disable">Disable Account</button>
                    <button className="delete">Delete Account</button>
                </div>
            </div>
            
        </>
    );
};

export default UserInfo;
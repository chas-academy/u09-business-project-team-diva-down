import Edit from "../hoc/loc/Edit_button_dashboard";
import Save from "../hoc/loc/Save_button_dashboard";
import Back from "../hoc/loc/Back_button_dashboard";
import { useState } from "react";
import { MockDataUserOwnData } from "../../MockData/MockData";
import ChangePassword from "./user_dashboard/Change_password";

interface SelectValue {
    value: number;
}

const UserInfo = () => {
    const [UsersOwnData, SetUsersOwnData] = useState(MockDataUserOwnData);
    const [toggleWindow, setToggleWindow] = useState(false);
    const [editUsername, setEditUsername] = useState(false);
    const [editEmail, setEditEmail] = useState(false);


    const ToggleWindowFunction = () => {
        setToggleWindow(!toggleWindow);
    }

    const ToggleEditEmailFunction = () => {
        setEditEmail(!editEmail);
    }

    const ToggleEditUsernameFunction = () => {
        setEditUsername(!editUsername);
    }

    const ToggleResetEditForm = () => {
        setEditEmail(false);
        setEditUsername(false);
    }

    const [selectValue, SetSelectValue] = useState<SelectValue>({
        value: 0,
    })

    const handleOptionChange = (newValue: SelectValue) => {
        SetSelectValue(newValue);
    }

    const TestConsole = () => {
        console.log("Event Registerd!");
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
                <div className="sub_title">Password and account details</div>
                {editEmail === false && editUsername === false && (
                    <>
                    <div className="grid">
                        <div className="title">Username</div>
                        <div className="data">{UsersOwnData.username}</div>
                        <Edit onClick={ToggleEditUsernameFunction}/>
                        <div className="title">Email</div>
                        <div className="data">{UsersOwnData.email}</div>
                        <Edit onClick={ToggleEditEmailFunction}/>
                    </div>
                    </>
                )}
                {editEmail === true && (
                    <div className="grid">
                        <div className="title">Username</div>
                        <div className="data">{UsersOwnData.username}</div>
                        <Back onClick={ToggleResetEditForm}/>
                        <form className="grid-form">
                            <div className="title">Email</div>
                            <input type="text" className="data data-edit" placeholder={UsersOwnData.email} />
                            <Save className="action"/>
                        </form>
                    </div>
                )}
                {editUsername === true && (
                    <div className="grid">
                        <form className="grid-form" onSubmit={TestConsole}>
                            <div className="title">Username</div>
                            <input type="text" className="data data-edit" placeholder={UsersOwnData.username} />
                            <Save className="action"/>
                        </form>
                        <form className="grid-form">
                            <div className="title">Email</div>
                            <div className="data">{UsersOwnData.email}</div>
                            <Save className="action"/>
                        </form>
                    </div>
                )}
                <button onClick={ToggleWindowFunction} className="change_button">Change Password</button>
                <div className="account_title">Account Removal</div>
                <div className="account_sub_title">Disabling your account means you can recover it at any time after taking this action.</div>
                <div className="button_container">
                    <button className="disable">Disable Account</button>
                    <button className="delete">Delete Account</button>
                </div>
            </div>
            {toggleWindow && (
                <>
                    <ChangePassword
                        selectedValue={selectValue}
                        onOptionChange={handleOptionChange}
                        ToggleWindowFunction={ToggleWindowFunction}
                    />
                </>
            )}
        </>
    );
};

export default UserInfo;
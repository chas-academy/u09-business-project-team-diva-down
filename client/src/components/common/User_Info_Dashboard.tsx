// import Edit from "../hoc/loc/Edit_button_dashboard";
// import Save from "../hoc/loc/Save_button_dashboard";
// import Back from "../hoc/loc/Back_button_dashboard";
// import { useState } from "react";
// import { MockDataUserOwnData } from "../../MockData/MockData";
// import ChangePassword from "./user_dashboard/Change_password";

// interface SelectValue {
//     value: number;
// }

// const UserInfo = () => {
//     const UsersOwnData = MockDataUserOwnData;
//     const [toggleWindow, setToggleWindow] = useState(false);
//     const [editUsername, setEditUsername] = useState(false);
//     const [editEmail, setEditEmail] = useState(false);
//     const [newEmailValue, setNewEmailValue] = useState(UsersOwnData.email);
//     const [newUsernameValue, setNewUsernameValue] = useState(UsersOwnData.username);

//     const ToggleWindowFunction = () => {
//         setToggleWindow(!toggleWindow);
//     }

//     const ToggleEditEmailFunction = () => {
//         setEditEmail(!editEmail);
//     }

//     const ToggleEditUsernameFunction = () => {
//         setEditUsername(!editUsername);
//     }

//     const ToggleResetEditForm = () => {
//         setEditEmail(false);
//         setEditUsername(false);
//     }

//     const [selectValue, SetSelectValue] = useState<SelectValue>({
//         value: 0,
//     })

//     const handleOptionChange = (newValue: SelectValue) => {
//         SetSelectValue(newValue);
//     }

//     const FetchInputData = (e: React.FormEvent) => {
//         e.preventDefault();
//         console.log(newEmailValue);
//         setEditEmail(false);
//     }

//     const FetchUsernameData = (e: React.FormEvent) => {
//         e.preventDefault();
//         setEditUsername(false);
//     }

//     return (
//         <>
//             <div className="user_info">
//                 <div className="game_title">Game Stats</div>
//                 <div className="game_stats">
//                     <div className="title">Current Rating:</div>
//                     <div className="data">{UsersOwnData.elo}</div>
//                     <div className="title">Total Wins:</div>
//                     <div className="data">{UsersOwnData.wins}</div>
//                     <div className="title">Total Matches:</div>
//                     <div className="data">{UsersOwnData.total_matches}</div>
//                 </div>
//                 <div className="user_title">User Settings</div>
//                 <div className="sub_title">Password and account details</div>
//                 {editEmail === false && editUsername === false && (
//                     <>
//                     <div className="grid">
//                         <div className="title">Username</div>
//                         <div className="data">{newUsernameValue}</div>
//                         <Edit onClick={ToggleEditUsernameFunction}/>
//                         <div className="title">Email</div>
//                         <div className="data">{newEmailValue}</div>
//                         <Edit onClick={ToggleEditEmailFunction}/>
//                     </div>
//                     </>
//                 )}
//                 {editEmail === true && (
//                     <div className="grid">
//                         <div className="title">Username</div>
//                         <div className="data">{newUsernameValue}</div>
//                         <Back onClick={ToggleResetEditForm}/>
//                         <form className="grid-form" onSubmit={FetchInputData}>
//                             <div className="title">Email</div>
//                             <input 
//                                 id="EmailData" 
//                                 type="text" 
//                                 className="data data-edit" 
//                                 placeholder={newEmailValue}
//                                 value={newEmailValue}
//                                 onChange={(e) => setNewEmailValue(e.target.value)} 
//                             />
//                             <Save className="action"/>
//                         </form>
//                     </div>
//                 )}
//                 {editUsername === true && (
//                     <div className="grid">
//                         <form className="grid-form" onSubmit={FetchUsernameData}>
//                             <div className="title">Username</div>
//                             <input 
//                                 type="text"
//                                 className="data data-edit"
//                                 placeholder={newUsernameValue}
//                                 value={newUsernameValue}
//                                 onChange={(e) => setNewUsernameValue(e.target.value)}
//                             />
//                             <Save className="action"/>
//                         </form>
//                         <div className="title">Email</div>
//                         <div className="data">{newEmailValue}</div>
//                         <Back className="action" onClick={ToggleResetEditForm}/>
//                     </div>
//                 )}
//                 <button onClick={ToggleWindowFunction} className="change_button">Change Password</button>
//                 <div className="account_title">Account Removal</div>
//                 <div className="account_sub_title">If you delete your account, it can't be recovered</div>
//                 <div className="button_container">
//                     <button className="delete">Delete Account</button>
//                 </div>
//             </div>
//             {toggleWindow && (
//                 <>
//                     <ChangePassword
//                         selectedValue={selectValue}
//                         onOptionChange={handleOptionChange}
//                         ToggleWindowFunction={ToggleWindowFunction}
//                     />
//                 </>
//             )}
//         </>
//     );
// };

// export default UserInfo;
import Edit from "../hoc/loc/Edit_button_dashboard";
import Save from "../hoc/loc/Save_button_dashboard";
import Back from "../hoc/loc/Back_button_dashboard";
import { useState, useEffect } from "react";
import ChangePassword from "./user_dashboard/Change_password";
import { useAuth } from "../../context/AuthContext";
import api from '../../services/loginapi';

interface SelectValue {
    value: number;
}

interface UserData {
    id: string;
    username: string;
    email: string;
    elo: number;
    wins: number;
    total_matches: number;
}

const UserInfo = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [toggleWindow, setToggleWindow] = useState(false);
    const [editUsername, setEditUsername] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [newEmailValue, setNewEmailValue] = useState("");
    const [newUsernameValue, setNewUsernameValue] = useState("");

    const [selectValue, setSelectValue] = useState<SelectValue>({
        value: 0,
    });

    useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await api.get('/me');
            setUserData(response.data.user); // Note the .user access
            setNewEmailValue(response.data.user.email);
            setNewUsernameValue(response.data.user.username);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            logout();
        } finally {
            setLoading(false);
        }
};

    if (user?.id) fetchData();
  }, [user?.id, logout]);

    const ToggleWindowFunction = () => {
        setToggleWindow(!toggleWindow);
    };

    const ToggleEditEmailFunction = () => {
        setEditEmail(!editEmail);
    };

    const ToggleEditUsernameFunction = () => {
        setEditUsername(!editUsername);
    };

    const ToggleResetEditForm = () => {
        setEditEmail(false);
        setEditUsername(false);
    };

    const handleOptionChange = (newValue: SelectValue) => {
        setSelectValue(newValue);
    };

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patch(`/users/${user?.id}`, { email: newEmailValue });
            setEditEmail(false);
            if (userData) {
                setUserData({ ...userData, email: newEmailValue });
            }
        } catch (error) {
            console.error("Failed to update email:", error);
        }
    };

    const handleUpdateUsername = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patch(`/users/${user?.id}`, { username: newUsernameValue });
            setEditUsername(false);
            if (userData) {
                setUserData({ ...userData, username: newUsernameValue });
            }
        } catch (error) {
            console.error("Failed to update username:", error);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
            try {
                await api.delete(`/users/${user?.id}`);
                // You might want to redirect to login or home page after deletion
            } catch (error) {
                console.error("Failed to delete account:", error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!userData) return <div>No user data found</div>;

    return (
        <>
            <div className="user_info">
                <div className="game_title">Game Stats</div>
                <div className="game_stats">
                    <div className="title">Current Rating:</div>
                    <div className="data">{userData.elo}</div>
                    <div className="title">Total Wins:</div>
                    <div className="data">{userData.wins}</div>
                    <div className="title">Total Matches:</div>
                    <div className="data">{userData.total_matches}</div>
                </div>
                <div className="user_title">User Settings</div>
                <div className="sub_title">Password and account details</div>
                {editEmail === false && editUsername === false && (
                    <div className="grid">
                        <div className="title">Username</div>
                        <div className="data">{userData.username}</div>
                        <Edit onClick={ToggleEditUsernameFunction}/>
                        <div className="title">Email</div>
                        <div className="data">{userData.email}</div>
                        <Edit onClick={ToggleEditEmailFunction}/>
                    </div>
                )}
                {editEmail === true && (
                    <div className="grid">
                        <div className="title">Username</div>
                        <div className="data">{userData.username}</div>
                        <Back onClick={ToggleResetEditForm}/>
                        <form className="grid-form" onSubmit={handleUpdateEmail}>
                            <div className="title">Email</div>
                            <input 
                                id="EmailData" 
                                type="email" 
                                className="data data-edit" 
                                value={newEmailValue}
                                onChange={(e) => setNewEmailValue(e.target.value)} 
                                required
                            />
                            <Save type="submit" className="action"/>
                        </form>
                    </div>
                )}
                {editUsername === true && (
                    <div className="grid">
                        <form className="grid-form" onSubmit={handleUpdateUsername}>
                            <div className="title">Username</div>
                            <input 
                                type="text"
                                className="data data-edit"
                                value={newUsernameValue}
                                onChange={(e) => setNewUsernameValue(e.target.value)}
                                required
                                minLength={3}
                            />
                            <Save type="submit" className="action"/>
                        </form>
                        <div className="title">Email</div>
                        <div className="data">{userData.email}</div>
                        <Back onClick={ToggleResetEditForm}/>
                    </div>
                )}
                <button 
                    onClick={ToggleWindowFunction} 
                    className="change_button"
                    type="button"
                >
                    Change Password
                </button>
                <div className="account_title">Account Removal</div>
                <div className="account_sub_title">If you delete your account, it can't be recovered</div>
                <div className="button_container">
                    <button 
                        className="delete" 
                        onClick={handleDeleteAccount}
                        type="button"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
            {toggleWindow && (
                <ChangePassword
                    selectedValue={selectValue}
                    onOptionChange={handleOptionChange}
                    ToggleWindowFunction={ToggleWindowFunction}
                />
            )}
        </>
    );
};

export default UserInfo;
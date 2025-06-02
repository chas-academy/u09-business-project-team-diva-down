import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Edit from "../components/hoc/loc/Edit_button_dashboard";

const UserDashboard = () => {

    return (
        <>
            <div className="userdashboard">
                <Header />
                    <main className="main">
                        <section className="sub_main">
                            <section className="user_info">
                                <div className="game_title">Game Stats</div>
                                <div className="game_stats">
                                    <div className="title">Current Rating:</div>
                                    <div className="data">231</div>
                                    <div className="title">Total Wins:</div>
                                    <div className="data">5</div>
                                    <div className="title">Total Matches:</div>
                                    <div className="data">12</div>
                                </div>
                                <div className="user_title">User Settings</div>
                                <div className="sub_title">Password and account details</div>
                                <div className="grid">
                                    <div className="title">Username</div>
                                    <div className="data">Stevensson</div>
                                    <Edit />
                                    <div className="title">Email</div>
                                    <div className="data">Joakim@svenssonÅker.com</div>
                                    <Edit />
                                </div>
                                <button className="change_button">Change Password</button>
                                <div className="account_title">Account Removal</div>
                                <div className="account_sub_title">Disabling your account means you can recover it at any time after taking this action.</div>
                                <div className="button_container">
                                    <button className="disable">Disable Account</button>
                                    <button className="delete">Delete Account</button>
                                </div>
                            </section>

                            <section className="user_friendslist">
                                <div className="under_title">Friendslist</div>
                                <div className="search_container">
                                    <input className="input_field" type="text"></input>
                                    <input className="submit_button" type="submit"></input>
                                </div>
                                <div className="friend_container">
                                    <div className="friend_bar">
                                        <div className="username">Username</div>
                                        <button className="remove_friend">Remove Friend</button>
                                    </div>
                                </div>
                                <div className="under_title">Accpet Pending Requests</div>
                                <div className="accept_container">
                                    <div className="accept_bar">
                                        <div className="username">Username</div>
                                        <div className="container">
                                            <button className="accept">Accept</button>
                                            <button className="decline">Decline</button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </section>
                    </main>
                <Footer />
            </div>
        </>
    );
};

export default UserDashboard;
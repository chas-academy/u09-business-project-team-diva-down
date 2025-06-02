import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Leaderboard_title from "../components/hoc/loc/Leaderboard_title";


const Leaderboard = () => {
    return (
        <>
            <div className="leaderboard_page">
                <Header />
                    <main className="main">
                        <Leaderboard_title />
                        <div className="leaderboard_container">
                            <div className="leaderboard_bar">
                                <div className="username">
                                    Username
                                </div>
                                <div className="rank">
                                    Rank
                                </div>
                                <div className="eloRating">
                                    Elo Rating
                                </div>
                            </div>
                            <div className="leaderboard_bar">
                                <div className="username">
                                    Username
                                </div>
                                <div className="rank">
                                    Rank
                                </div>
                                <div className="eloRating">
                                    Elo Rating
                                </div>
                            </div>
                            <div className="leaderboard_bar">
                                <div className="username">
                                    Username
                                </div>
                                <div className="rank">
                                    Rank
                                </div>
                                <div className="eloRating">
                                    Elo Rating
                                </div>
                            </div>
                            <div className="leaderboard_bar">
                                <div className="username">
                                    Username
                                </div>
                                <div className="rank">
                                    Rank
                                </div>
                                <div className="eloRating">
                                    Elo Rating
                                </div>
                            </div>
                            <div className="leaderboard_bar">
                                <div className="username">
                                    Username
                                </div>
                                <div className="rank">
                                    Rank
                                </div>
                                <div className="eloRating">
                                    Elo Rating
                                </div>
                            </div>
                            <div className="leaderboard_bar">
                                <div className="username">
                                    Username
                                </div>
                                <div className="rank">
                                    Rank
                                </div>
                                <div className="eloRating">
                                    Elo Rating
                                </div>
                            </div>
                        </div>
                    </main>
                <Footer />
            </div>
        </>
    );
};

export default Leaderboard;
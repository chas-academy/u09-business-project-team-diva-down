import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Leaderboard_title from "../components/hoc/loc/Leaderboard_title";
import Leaderboard_Card from "../components/common/Leaderboard";


const Leaderboard = () => {
    return (
        <>
            <div className="leaderboard_page">
                <Header />
                    <main className="main">
                        <Leaderboard_title />
                        <Leaderboard_Card />
                    </main>
                <Footer />
            </div>
        </>
    );
};

export default Leaderboard;